export interface CartItem {
  lockId: string;
  itemId: number;
  type: string;
  price: number;
  meta: Record<string, unknown>;
  expiresAt?: string | null;
  forSelf: boolean;
  passengers: Array<{ name: string; mobile: string }>;
}

export function parseCartItemFromLock(
  payload: Record<string, unknown>,
  item: Record<string, unknown>,
  itemType: string,
  tripMeta?: Record<string, unknown>
): CartItem | null {
  let d: Record<string, unknown> =
    payload.item && typeof payload.item === "object"
      ? (payload.item as Record<string, unknown>)
      : payload.data && typeof payload.data === "object"
        ? (payload.data as Record<string, unknown>)
        : payload;

  const missingLockId =
    !d.lock_id &&
    !d.reservation_id &&
    Array.isArray(d.items);

  if (missingLockId && Array.isArray(d.items)) {
    const itemId = Number(item.item_id ?? item.id);
    const row = (d.items as unknown[]).find((e) => {
      if (!e || typeof e !== "object") return false;
      const m = e as Record<string, unknown>;
      return Number(m.item_id ?? m.id) === itemId;
    }) as Record<string, unknown> | undefined;
    if (row) d = row;
  }

  const lockId = String(d.lock_id ?? d.reservation_id ?? "");
  if (!lockId) return null;

  const price = Number(d.price ?? d.fare ?? item.fare ?? 0);

  return {
    lockId,
    itemId: Number(d.item_id ?? d.cabin_id ?? item.item_id ?? item.id),
    type: String(d.type ?? itemType),
    price,
    expiresAt: (d.expires_at ?? d.locked_until)?.toString() ?? null,
    forSelf: true,
    passengers: [{ name: "", mobile: "" }],
    meta: {
      cabin_no: d.cabin_no ?? item.cabin_no,
      vehicle_name: d.vehicle_name ?? tripMeta?.vehicle_name ?? item.vehicle_name,
      route_name: d.route_name ?? tripMeta?.route_name ?? item.route_name,
      trip_date:
        d.trip_date ??
        tripMeta?.schedule_date ??
        item.trip_date ??
        item.schedule_date,
      fare: price,
      ...tripMeta,
    },
  };
}

export function cartItemFromApi(raw: Record<string, unknown>): CartItem {
  const meta =
    raw.meta && typeof raw.meta === "object"
      ? (raw.meta as Record<string, unknown>)
      : {};

  return {
    lockId: String(raw.lock_id ?? ""),
    itemId: Number(raw.item_id ?? 0),
    type: String(raw.type ?? "cabin"),
    price: Number(raw.price ?? 0),
    meta,
    expiresAt: raw.expires_at?.toString() ?? null,
    forSelf:
      raw.for_self === true ||
      raw.for_self === 1 ||
      raw.for_self === "1" ||
      raw.for_self == null,
    passengers: Array.isArray(raw.passengers)
      ? (raw.passengers as Array<{ name: string; mobile: string }>)
      : [{ name: "", mobile: "" }],
  };
}
