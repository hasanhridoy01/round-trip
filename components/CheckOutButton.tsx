"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

const CheckOutButton = () => {
  const [checkoutCount, setCheckoutCount] = useState(0);

  const handleCheckout = () => {
    setCheckoutCount((prev) => prev + 1);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            onClick={handleCheckout}
            className="relative h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <ShoppingCart size={24} />
            {checkoutCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {checkoutCount}
              </span>
            )}
          </Button>
        </DrawerTrigger>

        <DrawerContent className="p-0">
          {/* Fixed Top Header */}
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <DrawerHeader className="p-0">
              <DrawerTitle>Checkout Summary</DrawerTitle>
              <DrawerDescription>
                You have checked out {checkoutCount}{" "}
                {checkoutCount === 1 ? "time" : "times"}.
              </DrawerDescription>
            </DrawerHeader>
          </div>

          {/* Scrollable Booking Cards */}
          <div className="overflow-y-auto max-h-[calc(100vh-160px)] px-6 py-4 space-y-4">
            {/* Hotel Booking */}
            <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer">
              <h3 className="font-semibold text-base mb-2">🏨 Hotel Booking</h3>
              <p>
                <span className="font-medium">Hotel:</span> Grand Palace
              </p>
              <p>
                <span className="font-medium">Check-in:</span> Aug 10, 2025
              </p>
              <p>
                <span className="font-medium">Nights:</span> 3
              </p>
            </div>

            {/* Flight Booking */}
            <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer">
              <h3 className="font-semibold text-base mb-2">
                ✈️ Flight Booking
              </h3>
              <p>
                <span className="font-medium">From:</span> Dhaka
              </p>
              <p>
                <span className="font-medium">To:</span> Dubai
              </p>
              <p>
                <span className="font-medium">Date:</span> Aug 10, 2025
              </p>
            </div>

            {/* Lunch Booking */}
            <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer">
              <h3 className="font-semibold text-base mb-2">🍽️ Lunch Booking</h3>
              <p>
                <span className="font-medium">Restaurant:</span> Spice Garden
              </p>
              <p>
                <span className="font-medium">Time:</span> 1:00 PM
              </p>
              <p>
                <span className="font-medium">Date:</span> Aug 11, 2025
              </p>
            </div>

            {/* Hotel Booking */}
            <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer">
              <h3 className="font-semibold text-base mb-2">🏨 Hotel Booking</h3>
              <p>
                <span className="font-medium">Hotel:</span> Grand Palace
              </p>
              <p>
                <span className="font-medium">Check-in:</span> Aug 10, 2025
              </p>
              <p>
                <span className="font-medium">Nights:</span> 3
              </p>
            </div>

            {/* Flight Booking */}
            <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer">
              <h3 className="font-semibold text-base mb-2">
                ✈️ Flight Booking
              </h3>
              <p>
                <span className="font-medium">From:</span> Dhaka
              </p>
              <p>
                <span className="font-medium">To:</span> Dubai
              </p>
              <p>
                <span className="font-medium">Date:</span> Aug 10, 2025
              </p>
            </div>

            {/* Lunch Booking */}
            <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer">
              <h3 className="font-semibold text-base mb-2">🍽️ Lunch Booking</h3>
              <p>
                <span className="font-medium">Restaurant:</span> Spice Garden
              </p>
              <p>
                <span className="font-medium">Time:</span> 1:00 PM
              </p>
              <p>
                <span className="font-medium">Date:</span> Aug 11, 2025
              </p>
            </div>
          </div>

          {/* Fixed Bottom Footer */}
          <div className="sticky bottom-0 z-10 bg-white border-t px-6 py-4">
            <DrawerFooter className="p-0 flex gap-2">
              <Button className="w-full">Submit</Button>
              <DrawerClose className="w-full">
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CheckOutButton;
