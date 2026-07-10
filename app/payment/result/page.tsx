"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Home, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const bookingId = searchParams.get("bookingId");
  const ref = searchParams.get("ref");

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <Card>
        <CardContent className="pt-8 pb-8 text-center">
          {success ? (
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}

          <h1 className="text-2xl font-bold mb-2">
            {success ? "Payment Successful" : "Payment Failed"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {success
              ? "Your booking has been confirmed. You will receive a confirmation shortly."
              : "Payment was not completed. You can try again from your bookings."}
          </p>

          {bookingId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-semibold">#{bookingId}</span>
              </div>
              {ref && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-xs">{ref}</span>
                </div>
              )}
            </div>
          )}

          <Button asChild className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
