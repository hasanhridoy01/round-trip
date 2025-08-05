import React, { createContext, useContext, ReactNode, useState } from "react";

// Define types for different booking types
type BookingType = "launch" | "bus" | "hotel" | "boat";

interface BaseBookingData {
  booking_id: number | null;
  merchant_id: number;
  item_id: number;
  status: number;
  fare: number;
  service_charge: number;
  trip_date: string;
  description: string;
  nid_check: number;
}

interface LaunchBookingData extends BaseBookingData {
  type: "launch";
  cabin_class: string;
  cabin_floor: number;
  cabin_id: number;
  cabin_is_ac: number;
  cabin_no: string;
  cabin_position: number;
  cabin_row: number;
  cabin_type: string;
  cabin_type_id: number;
  capacity: number;
  ownership: string;
  route_id: number;
  trip_id: number;
  vehicle_id: number;
  vehicle_name: string;
}

interface BusBookingData extends BaseBookingData {
  type: "bus";
  seat_number: string;
  bus_type: string;
  departure_time: string;
  arrival_time: string;
  route_name: string;
  coach_number: string;
}

interface HotelBookingData extends BaseBookingData {
  type: "hotel";
  room_number: string;
  room_type: string;
  check_in: string;
  check_out: string;
  hotel_name: string;
  amenities: string[];
}

interface BoatBookingData extends BaseBookingData {
  type: "boat";
  deck_number: number;
  cabin_number: string;
  departure_time: string;
  arrival_time: string;
  route_name: string;
  vessel_name: string;
}

type BookingData =
  | LaunchBookingData
  | BusBookingData
  | HotelBookingData
  | BoatBookingData;

interface BookingContextType {
  bookingData: BookingData | null;
  bookingType: BookingType | null;
  setBookingData: <T extends BookingData>(type: BookingType, data: T) => void;
  clearBookingData: () => void;
}

const BookingContext = createContext<BookingContextType>({
  bookingData: null,
  bookingType: null,
  setBookingData: () => {},
  clearBookingData: () => {},
});

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [bookingType, setBookingType] = useState<BookingType | null>(null);

  const handleSetBookingData = <T extends BookingData>(
    type: BookingType,
    data: T
  ) => {
    setBookingType(type);
    setBookingData(data);
  };

  const clearBookingData = () => {
    setBookingData(null);
    setBookingType(null);
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        bookingType,
        setBookingData: handleSetBookingData,
        clearBookingData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingContext = () => useContext(BookingContext);