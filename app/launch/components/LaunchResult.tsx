"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { set } from "date-fns";
import { useBookingContext, BookingData } from "@/context/BookingContext";
import Loading from "../loading";
import { useRouter } from "next/navigation";

function getIcon(type?: string) {
  switch (type) {
    case "bus":
      return <BusIcon />;
    case "train":
      return <TrainIcon />;
    case "launch":
      return <LaunchIcon />;
    default:
      return <DefaultIcon />;
  }
}

function BusIcon() {
  return (
    <span role="img" aria-label="bus">
      🚌
    </span>
  );
}
function TrainIcon() {
  return (
    <span role="img" aria-label="train">
      🚆
    </span>
  );
}
function LaunchIcon() {
  return (
    <span role="img" aria-label="launch">
      ⛴️
    </span>
  );
}
function DefaultIcon() {
  return (
    <span role="img" aria-label="trip">
      🚍
    </span>
  );
}

interface LaunchData {
  type?: string;
  trip_date?: string;
  return_trip_date?: string;
  trip_from?: string;
  trip_to?: string;
  trip_id?: string | number;
  service_type?: string;
  route_name?: string;
  starting_point?: string;
  ending_point?: string;
  schedule_date?: string;
}

interface TripData {
  data?: {
    id?: number;
    trip_id?: number;
    vehicle_name?: string;
    route_name?: string;
    schedule_date?: string;
    cabin_rows?: number;
    floors?: Array<{ label: string; value: number }>;
    cabins: Record<string, Record<number, Cabin[]>>;
  };
}

interface Cabin {
  item_id?: number;
  trip_id?: number;
  cabin_id?: number;
  cabin_type?: string;
  cabin_floor?: number;
  cabin_no?: string;
  fare?: number;
  status?: number;
  capacity?: number;
  cabin_row?: number;
  cabin_position?: number;
  description?: string;
  cabin_class?: string;
  ac_type?: string;
  cabin_is_ac?: boolean;
}

const LaunchResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setBookingData } = useBookingContext();
  const [result, setResult] = useState<LaunchData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [tripDataLoading, setTripDataLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [openTripId, setOpenTripId] = useState<string | undefined>();
  const [currentTrip, setCurrentTrip] = useState<string | undefined>();
  const [selectedCabins, setSelectedCabins] = useState<Cabin[]>([]);
  const [activeFloor, setActiveFloor] = useState(1);

  const handleTripSelect = async (tripId: string) => {
    setTripDataLoading(true);
    setSelectedCabins([]);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/trip/${tripId}`
      );

      if (response.data.success) {
        toast.success("Trip details loaded successfully");
        setTripData(response.data);
      } else {
        toast.error("Failed to load trip details");
      }
    } catch (error) {
      toast.error("Error fetching trip details");
    } finally {
      setTripDataLoading(false);
    }
  };

  const handleCabinClick = (cabin: Cabin) => {
    if (!cabin.item_id || cabin.cabin_type === "empty" || cabin.status !== 1)
      return;

    setSelectedCabins((prev) => {
      if (prev.some((c) => c.item_id === cabin.item_id)) {
        return prev.filter((c) => c.item_id !== cabin.item_id);
      }
      return [...prev, cabin];
    });
  };

  function getOrdinalSuffix(num: number) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  }

  const handleBookClick = () => {
    setBookingLoading(true);
    if (selectedCabins.length > 0 && openTripId && tripData?.data) {
      const floorNumber = selectedCabins[0]?.cabin_floor || 2;
      const floorName =
        tripData.data.floors?.find((f) => f.value === floorNumber)?.label ||
        `${floorNumber}${getOrdinalSuffix(floorNumber)} Floor`;

      const currentTrip = result?.find((trip) => trip.service_type);
      const currentTripType = currentTrip?.service_type || "unknown";
      console.log(currentTripType);

      const bookingDetails: BookingData = {
        tripId: openTripId,
        tripType: "launch",
        floor: floorName,
        selectedCabins: selectedCabins as any,
        vehicleName: tripData.data.vehicle_name as string,
        routeName: tripData.data.route_name as string,
        deckNumber: floorNumber,
      };

      console.log("Booking Details:", bookingDetails);

      setBookingData(bookingDetails);
      setBookingLoading(false);
      toast.success(
        `Booking ${selectedCabins.length} cabins for ${currentTripType} on ${floorName}`
      );
    }
  };

  useEffect(() => {
    const fetchLaunchData = async () => {
      try {
        const trip = searchParams.get("type");
        const trip_date = searchParams.get("trip_date");
        const return_trip_date = searchParams.get("return_trip_date");
        const trip_from = searchParams.get("trip_from");
        const trip_to = searchParams.get("trip_to");

        if (!trip || !trip_date || !trip_from || !trip_to) {
          toast.error("Missing required search parameters");
          setLoading(false);
          return;
        }

        const params = new URLSearchParams({
          trip_date,
          trip_from,
          trip_to,
          type: trip,
        });

        if (trip === "roundTrip" && return_trip_date) {
          params.append("return_trip_date", return_trip_date);
        }

        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/api/v2/search?${params.toString()}`
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          toast.success(`Search successful for ${trip} trips`);

          setResult(response.data.data);
        } else {
          toast.error("No trips found");
        }
      } catch (error) {
        toast.error("Failed to fetch trip data");
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchData();
  }, [searchParams]);

  const handleDateChange = (daysToAdd: number) => {
    const currentDate = searchParams.get("trip_date");
    if (!currentDate) return;

    setLoading(false);

    const date = new Date(currentDate);
    date.setDate(date.getDate() + daysToAdd);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time for accurate comparison

    // Prevent selecting a date before today
    if (date < today) {
      toast.error("You cannot select a date before today.");
      return; // Just exit without updating
    }

    // Format date as YYYY-MM-DD
    const newDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Create new params object with updated date
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("trip_date", newDate);

    // Update URL without reload
    router.push(`?${newParams.toString()}`);
  };

  const handlePreviousDay = () => handleDateChange(-1);
  const handleNextDay = () => handleDateChange(1);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  if (!result || result.length === 0) return <p>No results found.</p>;

  return (
    <div className="p-4 max-w-7xl md:pt-8 md:pb-10 mx-auto">
      <div className="flex items-center justify-between mb-5 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium text-sm text-blue-600 bg-primary/10 uppercase p-3 rounded-full">
            {searchParams.get("type")}
          </h3>
          <p className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-full">
            {searchParams.get("trip_from")} → {searchParams.get("trip_to")} on{" "}
            <span className="font-medium text-red-500 text-md">
              {searchParams.get("trip_date")}
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePreviousDay}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Previous Day
          </button>
          <button
            onClick={handleNextDay}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Next Day
          </button>
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full space-y-2"
        value={openTripId}
        onValueChange={(tripId) => {
          setOpenTripId(tripId);
          if (tripId) {
            handleTripSelect(tripId);
          }
        }}
      >
        {result.map((item) => (
          <AccordionItem
            key={item.trip_id}
            value={item.trip_id?.toString() || ""}
            className="border rounded-lg"
          >
            <AccordionTrigger className="px-4 hover:no-underline border-b">
              <div className="flex items-center w-full">
                <div className="mr-4">{getIcon(item.service_type)}</div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{item.route_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.starting_point} → {item.ending_point} on{" "}
                    {item.schedule_date}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-4">
              {tripDataLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : tripData?.data ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">
                      {tripData.data.vehicle_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tripData.data.route_name} • {tripData.data.schedule_date}
                    </p>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm"></div>
                      <span className="text-base">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded-sm"></div>
                      <span className="text-base">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 border border-dashed rounded-sm"></div>
                      <span className="text-base">Empty space</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded-sm"></div>
                      <span className="text-base">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] bg-white text-blue-600 px-1 rounded">
                        S-AC
                      </span>
                      <span className="text-base">Single AC</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] bg-white text-blue-600 px-1 rounded">
                        D-AC
                      </span>
                      <span className="text-base">Double AC</span>
                    </div>
                  </div>

                  {/* Floor Render */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tripData?.data?.floors?.map((floor) => {
                      const floorKey =
                        floor.value === 1
                          ? "first_floor"
                          : floor.value === 2
                          ? "second_floor"
                          : floor.value === 3
                          ? "third_floor"
                          : `floor_${floor.value}`;

                      const floorCabins = tripData?.data?.cabins?.[floorKey] as
                        | Record<number, Cabin[]>
                        | undefined;
                      const cabinRows = tripData?.data?.cabin_rows ?? 0;

                      return (
                        <div
                          key={floor.value}
                          className="p-4 bg-blue-50 py-10 my-36 border border-blue-300 relative"
                        >
                          <h4 className="font-medium mb-5 text-center">
                            {floor.label} Cabin Layout
                          </h4>

                          {/* Top bump */}
                          <span
                            className="
      absolute top-[-97px] left-0 right-0 w-full h-24 rounded-tr-[60px] rounded-tl-[60px] border border-blue-300 bg-gray-50
    "
                          ></span>

                          {/* Bottom bump */}
                          <span
                            className="
      absolute bottom-[-97px] left-0 right-0 w-full h-24 rounded-br-[60px] rounded-bl-[60px] border border-blue-300 bg-gray-50
    "
                          ></span>

                          {floorCabins &&
                          Object.keys(floorCabins).length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                              {Array.from(
                                { length: cabinRows },
                                (_, rowIndex) => {
                                  const rowNum = rowIndex + 1;
                                  const rowCabins = floorCabins[rowNum] || [];

                                  const cabinPairs = [
                                    [1, 2],
                                    [3, 4],
                                  ];

                                  return (
                                    <div
                                      key={rowNum}
                                      className="grid grid-cols-2 gap-8"
                                    >
                                      {cabinPairs.map((pair, pairIndex) => (
                                        <div
                                          key={pairIndex}
                                          className="grid grid-cols-2 gap-2 justify-items-center"
                                        >
                                          {pair.map((pos) => {
                                            const cabin = rowCabins.find(
                                              (c) => c.cabin_position === pos
                                            ) || {
                                              cabin_type: "empty",
                                            };

                                            return (
                                              <button
                                                key={pos}
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (
                                                    cabin.cabin_type !== "empty"
                                                  ) {
                                                    handleCabinClick(cabin);
                                                  }
                                                }}
                                                disabled={
                                                  cabin.cabin_type ===
                                                    "empty" ||
                                                  cabin.status !== 1
                                                }
                                                className={`
                    w-full h-16 flex flex-col items-center justify-center text-center 
                    border rounded-md text-xs relative transition-colors
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${
                      cabin.cabin_type === "empty"
                        ? "bg-gray-100 border-dashed cursor-default"
                        : selectedCabins.some(
                            (c) => c.item_id === cabin.item_id
                          )
                        ? "bg-blue-100 border-blue-400 ring-2 ring-blue-300"
                        : cabin.status === 1
                        ? "bg-green-100 border-green-300 hover:bg-green-200 cursor-pointer"
                        : "bg-red-100 border-red-300 opacity-70 cursor-not-allowed"
                    }
                  `}
                                                aria-label={
                                                  cabin.cabin_type === "empty"
                                                    ? "Empty space"
                                                    : `Cabin ${
                                                        cabin.cabin_no
                                                      } - ${
                                                        cabin.description || ""
                                                      }`
                                                }
                                              >
                                                {cabin.cabin_type !==
                                                  "empty" && (
                                                  <>
                                                    <span className="font-medium text-[10px]">
                                                      {cabin.cabin_no}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                      ৳{cabin.fare}
                                                    </span>
                                                    {cabin.cabin_is_ac && (
                                                      <span className="absolute top-1 left-1 text-[8px] bg-white text-blue-600 px-1 rounded">
                                                        {cabin.capacity === 1
                                                          ? "S-AC"
                                                          : "D-AC"}
                                                      </span>
                                                    )}
                                                    {/* {cabin.status === 1 && (
                                                      <span className="absolute top-1 right-1 text-[10px] bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                                        {cabin.capacity}
                                                      </span>
                                                    )} */}
                                                  </>
                                                )}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          ) : (
                            <div className="flex justify-center items-center h-[300px]">
                              <p className="text-center text-sm text-gray-500">
                                No cabin data available
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Book Button */}
                  {selectedCabins.length > 0 && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleBookClick}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        disabled={bookingLoading || selectedCabins.length === 0}
                      >
                        {bookingLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Booking...</span>
                          </div>
                        ) : (
                          <>
                            Book {selectedCabins.length} Cabin
                            {selectedCabins.length !== 1 ? "s" : ""}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No cabin data available
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default LaunchResult;
