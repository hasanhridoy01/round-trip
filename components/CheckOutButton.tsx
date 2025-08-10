"use client";

import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  ChevronRight,
  Ticket,
  MapPin,
  Layers,
  Route,
  Calendar,
} from "lucide-react";
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
import {
  useBookingContext,
  BookingData,
  SelectedCabin,
} from "@/context/BookingContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoginDialog from "./LoginDialog";
import { AuthContext } from "@/context/AuthContext";

const CheckOutButton = () => {
  const router = useRouter();
  const { isAuthenticated, travel_auth } = useContext(AuthContext);
  console.log(travel_auth);
  const { bookingData, setBookingData, clearBookingData } = useBookingContext();
  const [checkoutCount, setCheckoutCount] = useState<number>(0);
  const [bookings, setBookings] = useState<BookingData | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const handleDeleteCabin = (cabinId: number) => {
    if (!bookings || !("selectedCabins" in bookings)) return;

    // Filter out the cabin to be deleted
    const updatedCabins = bookings.selectedCabins.filter(
      (cabin: SelectedCabin) => cabin.cabin_id !== cabinId
    );

    if (updatedCabins.length === 0) {
      setBookings(null);
      setCheckoutCount(0);
      clearBookingData();
    } else {
      const updatedBooking = {
        ...bookings,
        selectedCabins: updatedCabins,
      };
      setBookings(updatedBooking as any);
      setBookingData(updatedBooking as any);
      setCheckoutCount(updatedCabins.length);
    }
  };

  const handleDeleteAll = () => {
    // Clear all bookings
    setBookings(null);
    setCheckoutCount(0);
    clearBookingData();
  };

  useEffect(() => {
    if (bookingData && "selectedCabins" in bookingData) {
      setBookings(bookingData);
      setCheckoutCount(bookingData.selectedCabins.length);
    }
  }, [bookingData]);

  const calculateTotal = () => {
    if (!bookings || !("selectedCabins" in bookings)) return 0;
    return bookings.selectedCabins.reduce(
      (sum: number, cabin: SelectedCabin) => sum + cabin.fare,
      0
    );
  };

  const getBookingDetails = (booking: BookingData) => {
    if (!("selectedCabins" in booking)) return [];
    return [
      { label: "Trip ID", value: booking.tripId.toString(), icon: <Ticket /> },
      { label: "Trip Type", value: booking.tripType, icon: <MapPin /> },
      { label: "Floor", value: booking.floor, icon: <Layers /> },
      { label: "Vehicle", value: booking.vehicleName, icon: <Route /> },
      { label: "Route", value: booking.routeName, icon: <Route /> },
      {
        label: "Cabins",
        value: booking.selectedCabins.length.toString(),
        icon: <Calendar />,
      },
      {
        label: "Total Fare",
        value: `${booking.selectedCabins.reduce(
          (sum: number, cabin: SelectedCabin) => sum + cabin.fare,
          0
        )}`,
        icon: <Calendar />,
      },
    ];
  };

  const handleBooked = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue booking.");
      setIsOpen(false);
      return;
    }

    // 2. Check booking data
    if (!bookings || !("selectedCabins" in bookings)) {
      toast.error("No booking details found.");
      return;
    }

    try {
      const payload = {
        tripId: bookings.tripId,
        tripType: bookings.tripType,
        floor: bookings.floor,
        vehicleName: bookings.vehicleName,
        routeName: bookings.routeName,
        deckNumber: "deckNumber" in bookings ? bookings.deckNumber : undefined,
        selectedCabins: bookings.selectedCabins.map((cabin: SelectedCabin) => ({
          cabin_id: cabin.cabin_id,
          cabin_no: cabin.cabin_no,
          fare: cabin.fare,
          description: cabin.description,
        })),
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/order/confirm`,
        payload,
        {
          headers: { Authorization: `Bearer ${travel_auth.token}` },
        }
      );

      toast.success("Booking successful!");
      console.log("Booking response:", res.data);

      // Reset state
      setBookings(null);
      setCheckoutCount(0);
      setIsOpen(true);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Booking failed.");
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="relative h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              <ShoppingCart size={24} />
              {checkoutCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white animate-pulse">
                  {checkoutCount}
                </span>
              )}
            </Button>
          </DrawerTrigger>

          <DrawerContent className="p-0">
            <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
              <DrawerHeader className="p-0">
                <DrawerTitle className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Booking Summary
                </DrawerTitle>
                <DrawerDescription className="text-sm mt-1">
                  {checkoutCount > 0 ? (
                    <span className="text-green-600">
                      You have {checkoutCount} item
                      {checkoutCount !== 1 ? "s" : ""} in your cart
                    </span>
                  ) : (
                    "Your booking cart is empty"
                  )}
                </DrawerDescription>
              </DrawerHeader>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-4">
              {bookings && "selectedCabins" in bookings ? (
                <div className="space-y-6">
                  <div className="border rounded-xl p-5 shadow-sm bg-white dark:bg-gray-900 relative transition-all hover:shadow-md">
                    <button
                      onClick={handleDeleteAll}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Badge variant="secondary" className="uppercase">
                            {bookings.tripType}
                          </Badge>
                          <span>Booking #{bookings.tripId}</span>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {bookings.selectedCabins.length} cabin
                          {bookings.selectedCabins.length !== 1 ? "s" : ""}{" "}
                          selected
                        </p>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="grid gap-3">
                      {getBookingDetails(bookings).map((detail, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="text-gray-500 dark:text-gray-400">
                            {detail.icon}
                          </span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {detail.label}:
                          </span>
                          <span className="ml-auto font-medium">
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Selected Cabins
                      </h4>
                      <ul className="space-y-2">
                        {bookings.selectedCabins.map((cabin) => (
                          <li
                            key={cabin.cabin_id}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{cabin.cabin_no}</p>
                              <p className="text-sm text-gray-500">
                                {cabin.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="ml-2">
                                ${cabin.fare}
                              </Badge>
                              <button
                                onClick={() =>
                                  handleDeleteCabin(cabin.cabin_id)
                                }
                                className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Subtotal</span>
                      <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Service Fee</span>
                      <span>$5.00</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total</span>
                      <span>${calculateTotal() + 5}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                    Your booking cart is empty
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                    Select cabins to start your booking process
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 z-10 bg-white border-t px-6 py-4">
              <DrawerFooter className="p-0 flex gap-2">
                <Button
                  onClick={handleBooked}
                  className="w-full hover:bg-secondary"
                  disabled={!bookings}
                >
                  Submit
                </Button>
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
    </>
  );
};

export default CheckOutButton;
