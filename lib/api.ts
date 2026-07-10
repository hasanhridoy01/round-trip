import axios, { AxiosRequestConfig } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apigw.durpalla.com/api/v1";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("token");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildUrl(path: string, query?: Record<string, string>) {
  const clean = path.replace(/^\//, "");
  const url = new URL(`${API_BASE_URL.replace(/\/$/, "")}/${clean}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    });
  }
  return url.toString();
}

export async function apiGet<T = Record<string, unknown>>(
  path: string,
  query?: Record<string, string>,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await axios.get(buildUrl(path, query), {
    ...config,
    headers: { ...authHeaders(), ...config?.headers },
  });
  return res.data;
}

export async function apiPostForm<T = Record<string, unknown>>(
  path: string,
  body: Record<string, string>,
  config?: AxiosRequestConfig
): Promise<T> {
  const params = new URLSearchParams();
  Object.entries(body).forEach(([k, v]) => params.append(k, v));
  const res = await axios.post(buildUrl(path), params, {
    ...config,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...authHeaders(),
      ...config?.headers,
    },
  });
  return res.data;
}

export async function apiPostJson<T = Record<string, unknown>>(
  path: string,
  body: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const res = await axios.post(buildUrl(path), body, {
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...config?.headers,
    },
  });
  return res.data;
}

export function idempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function lockCartItem(
  tripId: number,
  itemType: string,
  itemId: number
) {
  const params = new URLSearchParams();
  params.append("trip_id", tripId.toString());
  params.append("item_id", itemId.toString());
  params.append("type", itemType);

  const res = await axios.post(buildUrl("cart/add"), params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Idempotency-Key": idempotencyKey(),
      ...authHeaders(),
    },
  });
  return res.data;
}

export async function unlockCartItem(lockId: string, itemId?: number) {
  const body: Record<string, string> = { lock_id: lockId };
  if (itemId != null) body.item_id = itemId.toString();
  return apiPostJson("cart/unlock", body);
}

export function extractToken(data: Record<string, unknown>): string | null {
  const nested = data.data as Record<string, unknown> | undefined;
  const token =
    data.token ??
    data.access_token ??
    nested?.token ??
    nested?.access_token;
  return token ? String(token) : null;
}

export function parseSearchTrips(data: Record<string, unknown>) {
  if (data.success === false) {
    throw new Error(String(data.message || "Search failed"));
  }
  const list = data.data;
  if (!list) return [];
  if (Array.isArray(list)) return list;
  return [];
}

export function extractPaymentUrl(res: Record<string, unknown>): string | null {
  const nested =
    res.data && typeof res.data === "object"
      ? (res.data as Record<string, unknown>)
      : {};
  const keys = [
    "paymentURL",
    "paymentUrl",
    "payment_url",
    "redirectURL",
    "redirectUrl",
    "redirect_url",
    "checkout_url",
    "url",
    "bkashURL",
    "bkashUrl",
  ];
  for (const key of keys) {
    const val = res[key] ?? nested[key];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return null;
}
