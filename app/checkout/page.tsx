"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bus,
  CheckCircle,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { apiPostJson } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);
  const { items, total, updateItem, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <p className="text-muted-foreground mb-6">
          Please sign in to complete your booking.
        </p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Add seats or cabins from a trip to checkout.
        </p>
        <Button asChild>
          <Link href="/">Search Trips</Link>
        </Button>
      </div>
    );
  }

  const handleConfirm = async () => {
    for (const item of items) {
      if (!item.forSelf) {
        const p = item.passengers[0];
        if (!p?.name?.trim() || !p?.mobile?.trim()) {
          toast.error("Please enter passenger name and mobile for all items.");
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((it) => ({
          item_id: it.itemId,
          type: it.type,
          price: it.price,
          lock_id: it.lockId,
          for_self: it.forSelf ? 1 : 0,
          passengers: it.passengers,
          meta: it.meta,
        })),
        amount: total,
      };

      const res = await apiPostJson<Record<string, unknown>>(
        "booking/confirm",
        payload
      );

      if (res.success !== true) {
        throw new Error(String(res.message || "Booking failed"));
      }

      const bookingMap =
        (res.booking as Record<string, unknown>) ??
        (res.data as Record<string, unknown>) ??
        {};
      const bookingId =
        bookingMap.id ?? res.booking_id ?? res.order_id ?? res.id;

      if (!bookingId) {
        throw new Error("Booking created but ID missing");
      }

      clear();
      toast.success("Booking confirmed. Select a payment method.");
      router.push(
        `/payment/${bookingId}?amount=${total}`
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Booking failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.lockId} className="overflow-hidden">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-primary" />
                  {String(item.meta.cabin_no || item.type)}
                  <span className="text-xs font-normal uppercase bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                </span>
                <span className="text-primary font-bold">৳{item.price}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {String(item.meta.vehicle_name || "")}
                {item.meta.route_name
                  ? ` · ${String(item.meta.route_name)}`
                  : ""}
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <RadioGroup
                value={item.forSelf ? "self" : "others"}
                onValueChange={(val) =>
                  updateItem(item.lockId, { forSelf: val === "self" })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="self" id={`self-${item.lockId}`} />
                  <Label htmlFor={`self-${item.lockId}`}>Self</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="others" id={`others-${item.lockId}`} />
                  <Label htmlFor={`others-${item.lockId}`}>Others</Label>
                </div>
              </RadioGroup>

              {!item.forSelf && (
                <div className="mt-4 space-y-3">
                  <div>
                    <Label htmlFor={`name-${item.lockId}`}>Passenger Name</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id={`name-${item.lockId}`}
                        className="pl-10"
                        placeholder="Full name"
                        value={item.passengers[0]?.name || ""}
                        onChange={(e) => {
                          const passengers = [...item.passengers];
                          passengers[0] = {
                            ...passengers[0],
                            name: e.target.value,
                          };
                          updateItem(item.lockId, { passengers });
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`mobile-${item.lockId}`}>Mobile Number</Label>
                    <Input
                      id={`mobile-${item.lockId}`}
                      className="mt-1"
                      placeholder="01XXXXXXXXX"
                      value={item.passengers[0]?.mobile || ""}
                      onChange={(e) => {
                        const passengers = [...item.passengers];
                        passengers[0] = {
                          ...passengers[0],
                          mobile: e.target.value,
                        };
                        updateItem(item.lockId, { passengers });
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Subtotal</span>
            <span className="text-2xl font-bold text-primary">৳{total}</span>
          </div>
          <Separator className="mb-4" />
          <Button
            className="w-full h-12 text-base"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating booking...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm &amp; Pay
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
