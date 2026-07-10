"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { apiGet, apiPostJson, extractPaymentUrl } from "@/lib/api";

interface Gateway {
  id: number;
  label: string;
  iconUrl?: string;
  fee?: string | number;
}

function parseGateways(raw: unknown): Gateway[] {
  const out: Gateway[] = [];
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as Record<string, unknown>).data)
      ? ((raw as Record<string, unknown>).data as unknown[])
      : [];

  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const m = item as Record<string, unknown>;
    const id = Number(m.id);
    const name = String(m.name || "");
    if (!id || !name) continue;
    out.push({
      id,
      label: name,
      iconUrl: m.icon ? String(m.icon) : undefined,
      fee: m.fee as string | number | undefined,
    });
  }
  return out;
}

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = Number(params.bookingId);
  const amount = Number(searchParams.get("amount") || 0);

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gateways, setGateways] = useState<Gateway[]>([]);

  const fetchGateways = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<Record<string, unknown>>("gateway", {
        booking_id: bookingId.toString(),
      });

      if (res.success === false) {
        throw new Error(String(res.message || "Failed to load gateways"));
      }

      const raw = res.gateways ?? res.data ?? res;
      const parsed = parseGateways(raw);
      if (parsed.length === 0) {
        throw new Error("No payment methods available.");
      }
      setGateways(parsed);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load gateways");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) fetchGateways();
  }, [bookingId]);

  const startPayment = async (gateway: Gateway) => {
    if (paying) return;
    setPaying(true);
    try {
      const res = await apiPostJson<Record<string, unknown>>("payment/make", {
        order_id: bookingId,
        booking_id: bookingId,
        gateway_id: gateway.id,
        amount,
      });

      if (res.success !== true) {
        throw new Error(String(res.message || "Payment init failed"));
      }

      const paymentUrl = extractPaymentUrl(res);
      if (!paymentUrl) {
        throw new Error("No payment URL from server");
      }

      const ref =
        (res.data as Record<string, unknown>)?.transaction_id ??
        (res.data as Record<string, unknown>)?.trx_id ??
        res.paymentID ??
        res.paymentId;

      const processUrl = new URL("/payment/process", window.location.origin);
      processUrl.searchParams.set("url", paymentUrl);
      processUrl.searchParams.set("bookingId", bookingId.toString());
      if (ref) processUrl.searchParams.set("ref", String(ref));
      window.location.href = processUrl.toString();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Payment could not be started"
      );
      setPaying(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/checkout">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Select Payment Method</h1>
          <p className="text-sm text-muted-foreground">
            Booking #{bookingId} · ৳{amount}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchGateways} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {gateways.map((g) => (
            <Card
              key={g.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => !paying && startPayment(g)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {g.iconUrl ? (
                    <img
                      src={g.iconUrl}
                      alt={g.label}
                      className="w-10 h-10 rounded-full object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{g.label}</p>
                    {g.fee != null && (
                      <p className="text-xs text-muted-foreground">
                        Fee: {g.fee}
                      </p>
                    )}
                  </div>
                </div>
                {paying ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
