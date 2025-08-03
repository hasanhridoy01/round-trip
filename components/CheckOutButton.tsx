"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";
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

interface BookingDetail {
  label: string;
  value: string;
}

interface Booking {
  id: number;
  type: string;
  details: BookingDetail[];
}

const bookingData: Booking[] = [
  {
    id: 1,
    type: "🏨 Hotel Booking",
    details: [
      { label: "Hotel", value: "Grand Palace" },
      { label: "Check-in", value: "Aug 10, 2025" },
      { label: "Nights", value: "3" },
    ],
  },
  {
    id: 2,
    type: "✈️ Flight Booking",
    details: [
      { label: "From", value: "Dhaka" },
      { label: "To", value: "Dubai" },
      { label: "Date", value: "Aug 10, 2025" },
    ],
  },
  {
    id: 3,
    type: "🍽️ Lunch Booking",
    details: [
      { label: "Restaurant", value: "Spice Garden" },
      { label: "Time", value: "1:00 PM" },
      { label: "Date", value: "Aug 11, 2025" },
    ],
  },
  {
    id: 4,
    type: "🏨 Hotel Booking",
    details: [
      { label: "Hotel", value: "Royal Suites" },
      { label: "Check-in", value: "Aug 12, 2025" },
      { label: "Nights", value: "2" },
    ],
  },
  {
    id: 5,
    type: "✈️ Flight Booking",
    details: [
      { label: "From", value: "Dubai" },
      { label: "To", value: "Maldives" },
      { label: "Date", value: "Aug 15, 2025" },
    ],
  },
  {
    id: 6,
    type: "🚗 Car Rental",
    details: [
      { label: "Company", value: "Hertz" },
      { label: "Type", value: "SUV" },
      { label: "Days", value: "5" },
    ],
  },
  {
    id: 7,
    type: "🏨 Hotel Booking",
    details: [
      { label: "Hotel", value: "Beach Resort" },
      { label: "Check-in", value: "Aug 15, 2025" },
      { label: "Nights", value: "7" },
    ],
  },
  {
    id: 8,
    type: "✈️ Flight Booking",
    details: [
      { label: "From", value: "Maldives" },
      { label: "To", value: "Dhaka" },
      { label: "Date", value: "Aug 22, 2025" },
    ],
  },
  {
    id: 9,
    type: "🍽️ Dinner Booking",
    details: [
      { label: "Restaurant", value: "Ocean View" },
      { label: "Time", value: "8:00 PM" },
      { label: "Date", value: "Aug 18, 2025" },
    ],
  },
  {
    id: 10,
    type: "🚤 Boat Tour",
    details: [
      { label: "Tour", value: "Sunset Cruise" },
      { label: "Duration", value: "2 hours" },
      { label: "Date", value: "Aug 19, 2025" },
    ],
  },
];

const CheckOutButton = () => {
  const [checkoutCount, setCheckoutCount] = useState<number>(0);
  const [bookings, setBookings] = useState<Booking[]>(bookingData);

  const handleCheckout = () => {
    setCheckoutCount((prev) => prev + 1);
  };

  const handleDelete = (id: number) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
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
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <DrawerHeader className="p-0">
              <DrawerTitle>Checkout Summary</DrawerTitle>
              <DrawerDescription>
                You have checked out {checkoutCount}{" "}
                {checkoutCount === 1 ? "time" : "times"}.
              </DrawerDescription>
            </DrawerHeader>
          </div>

          <div className="overflow-y-auto min-h-[calc(100vh-205px)] px-6 py-4 flex flex-col">
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md cursor-pointer relative"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(booking.id);
                      }}
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                    <h3 className="font-semibold text-base mb-2">
                      {booking.type}
                    </h3>
                    {booking.details.map((detail, i) => (
                      <p key={i}>
                        <span className="font-medium">{detail.label}:</span>{" "}
                        {detail.value}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-center text-gray-500">No bookings found.</p>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 z-10 bg-white border-t px-6 py-4">
            <DrawerFooter className="p-0 flex gap-2">
              <Button className="w-full hover:bg-secondary">Submit</Button>
              <DrawerClose className="w-full">
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 hover:bg-primary/70 text-primary hover:text-primary-foreground border border-gray-300 w-full"
                >
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
