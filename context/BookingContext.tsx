"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";

// Define types for different booking types
type BookingType = "launch" | "bus" | "hotel" | "boat" | "train";

interface SelectedCabin {
  booking_id: number | null;
  cabin_class: string;
  cabin_floor: number;
  cabin_id: number;
  cabin_no: string;
  cabin_type: string;
  capacity: number;
  description: string;
  fare: number;
  item_id: number;
  merchant_id: number;
  nid_check: number;
  ownership: string;
  route_id: number;
  status: number;
  trip_date: string;
  trip_id: number;
  vehicle_id: number;
  vehicle_name: string;
  [key: string]: any; 
}

interface BaseBookingData {
  tripId: number;
  tripType: BookingType;
  floor: string;
  selectedCabins: SelectedCabin[];
  vehicleName: string;
  routeName: string;
}

interface LaunchBookingData extends BaseBookingData {
  tripType: "launch";
  // Launch-specific properties can be added here
}

interface BusBookingData extends BaseBookingData {
  tripType: "bus";
  seatNumbers: string[];
  busType: string;
  departureTime: string;
}

interface HotelBookingData {
  tripType: "hotel";
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  hotelName: string;
}

interface BoatBookingData extends BaseBookingData {
  tripType: "boat";
  deckNumber: number;
}

type BookingData =
  | LaunchBookingData
  | BusBookingData
  | HotelBookingData
  | BoatBookingData;

interface BookingContextType {
  bookingData: BookingData | null;
  setBookingData: (data: BookingData) => void;
  clearBookingData: () => void;
}

const BookingContext = createContext<BookingContextType>({
  bookingData: null,
  setBookingData: () => {},
  clearBookingData: () => {},
});

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookingData, setBookingDataState] = useState<BookingData | null>(null);

  const setBookingData = (data: BookingData) => {
    setBookingDataState(data);
  };

  const clearBookingData = () => {
    setBookingDataState(null);
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        setBookingData,
        clearBookingData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => useContext(BookingContext);