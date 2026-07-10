"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { apiGet } from "@/lib/api";

const SUCCESS_PATTERNS = [
  "success",
  "paid",
  "complete",
  "status=success",
  "payment_status=success",
];
const FAIL_PATTERNS = [
  "failed",
  "cancel",
  "declined",
  "status=failed",
  "payment_status=failed",
];

function matchesAny(url: string, patterns: string[]) {
  const lower = url.toLowerCase();
  return patterns.some((p) => lower.includes(p.toLowerCase()));
}

export default function PaymentProcessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentUrl = searchParams.get("url");
  const bookingId = searchParams.get("bookingId");
  const ref = searchParams.get("ref");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState("Loading payment gateway...");

  useEffect(() => {
    if (!paymentUrl || !bookingId) {
      router.replace("/");
      return;
    }

    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type !== "payment-navigate") return;
      const url = String(event.data.url || "");
      await handleNavigation(url);
    };

    const pollVerify = async () => {
      try {
        const res = await apiGet<Record<string, unknown>>("payment/verify", {
          order_id: bookingId,
          booking_id: bookingId,
          ...(ref ? { transaction_id: ref } : {}),
        });
        if (res.success === true) {
          const data = (res.data as Record<string, unknown>) || res;
          const paid =
            data.status === "paid" ||
            data.payment_status === "success" ||
            res.status === "paid";
          if (paid) {
            goResult(true);
            return true;
          }
        }
      } catch {
        // Continue polling on URL patterns
      }
      return false;
    };

    const goResult = (success: boolean) => {
      const params = new URLSearchParams({
        success: success ? "1" : "0",
        bookingId: bookingId,
      });
      if (ref) params.set("ref", ref);
      router.replace(`/payment/result?${params.toString()}`);
    };

    const handleNavigation = async (url: string) => {
      if (matchesAny(url, SUCCESS_PATTERNS)) {
        const verified = await pollVerify();
        goResult(verified !== false);
        return;
      }
      if (matchesAny(url, FAIL_PATTERNS)) {
        goResult(false);
      }
    };

    window.addEventListener("message", handleMessage);

    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      try {
        const loc = iframe.contentWindow?.location.href;
        if (loc && loc !== "about:blank") {
          handleNavigation(loc);
        }
      } catch {
        // Cross-origin — rely on postMessage or gateway redirect to our domain
      }
    };

    iframe.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("message", handleMessage);
      iframe.removeEventListener("load", onLoad);
    };
  }, [paymentUrl, bookingId, ref, router]);

  if (!paymentUrl) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">{status}</span>
      </div>
      <iframe
        ref={iframeRef}
        src={paymentUrl}
        className="flex-1 w-full border-0"
        title="Payment"
        sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups"
        onLoad={() => setStatus("Complete payment in the window below")}
      />
    </div>
  );
}
