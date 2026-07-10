"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { apiGet, parseSearchTrips } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useCartLock } from "@/hooks/useCartLock";

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

interface BusData {
  type?: string;
  trip_date?: string;
  return_trip_date?: string;
  trip_from?: string;
  trip_to?: string;
  trip_id?: string;
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
    seats: Record<string, Record<number, Seat[]>>;
  };
}

interface Seat {
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
  [key: string]: unknown;
}

const BusResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items } = useCart();
  const [result, setResult] = useState<BusData[] | null>(null);
  const [openTripId, setOpenTripId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [tripDataLoading, setTripDataLoading] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<string | undefined>();
  const [activeFloor, setActiveFloor] = useState(1);

  const tripMeta = useMemo(
    () =>
      tripData?.data
        ? {
            vehicle_name: tripData.data.vehicle_name,
            route_name: tripData.data.route_name,
            schedule_date: tripData.data.schedule_date,
          }
        : undefined,
    [tripData]
  );

  const { toggleItem, isInCart, locking } = useCartLock(
    openTripId,
    "seat",
    tripMeta
  );

  const handleCabinClick = (cabin: Seat) => {
    toggleItem(cabin);
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

        const response = await apiGet<Record<string, unknown>>("search", {
          trip_date,
          trip_from,
          trip_to,
          type: trip,
          ...(trip === "roundTrip" && return_trip_date
            ? { return_trip_date }
            : {}),
        });

        const trips = parseSearchTrips(response);
        if (trips.length > 0) {
          toast.success(`Search successful for ${trip} trips`);
          setResult(trips as BusData[]);
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

  const handleTripSelect = async (tripId: string) => {
    setTripDataLoading(true);

    try {
      const response = await apiGet<TripData>(`trip/${tripId}`);

      if ((response as { success?: boolean }).success !== false) {
        toast.success("Trip details loaded successfully");

        setTripData(response);
      } else {
        toast.error("Failed to load trip details");
      }
    } catch (error) {
      toast.error("Error fetching trip details");
    } finally {
      setTripDataLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  if (!result || result.length === 0)
    return (
      <p className="text-center py-4 text-muted-foreground w-full">
        No results found.
      </p>
    );

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
        {result.map((trip) => (
          <AccordionItem
            key={trip.trip_id}
            value={trip.trip_id!}
            className="border rounded-lg"
          >
            <AccordionTrigger className="px-4 hover:no-underline border-b">
              <div className="flex items-center w-full">
                <div className="mr-4">{getIcon(trip.service_type)}</div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{trip.route_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {trip.starting_point} → {trip.ending_point} on{" "}
                    {trip.schedule_date}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
                    {tripData?.data?.floors?.map((floor) => {
                      const floorKey =
                        floor.value === 1
                          ? "first_floor"
                          : floor.value === 2
                          ? "second_floor"
                          : floor.value === 3
                          ? "third_floor"
                          : `floor_${floor.value}`;

                      const floorCabins = tripData?.data?.seats?.[floorKey] as
                        | Record<number, Seat[]>
                        | undefined;
                      const cabinRows = tripData?.data?.cabin_rows ?? 0;

                      return (
                        <div
                          key={floor.value}
                          className="
    relative rounded-[10px] p-5 bg-blue-50 border border-blue-300 mt-5 shadow-md"
                        >
                          {/* Top left bump */}
                          <span
                            className="
    absolute top-8 left-[-10px] w-2 h-8 rounded-l-lg border border-blue-300 bg-blue-50
  "
                          ></span>

                          {/* Top right bump */}
                          <span
                            className="
    absolute top-8 right-[-10px] w-2 h-8 rounded-r-lg border border-blue-300 bg-blue-50
  "
                          ></span>

                          {/* Bottom left bump */}
                          <span
                            className="
    absolute bottom-8 left-[-10px] w-2 h-8 rounded-l-lg border border-blue-300 bg-blue-50
  "
                          ></span>

                          {/* Bottom right bump */}
                          <span
                            className="
    absolute bottom-8 right-[-10px] w-2 h-8 rounded-r-lg border border-blue-300 bg-blue-50
  "
                          ></span>

                          {/* Driver seat */}
                          <div
                            className="
      absolute top-4 right-6 w-14 h-14 bg-red-300 rounded-[12px] border-2 border-red-500
      flex flex-col items-center justify-center
    "
                          >
                            {/* Backrest */}
                            <div className="w-10 h-6 bg-red-500 rounded-t-lg"></div>
                            {/* Seat base */}
                            <div className="w-full h-6 bg-red-400 rounded-b-lg mt-1"></div>
                          </div>

                          {floorCabins &&
                          Object.keys(floorCabins).length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 mt-16">
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
                                      className="grid grid-cols-2 gap-8 mt-2"
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
    relative w-12 h-14 flex items-center justify-center text-[9px] font-semibold rounded-sm border
    before:content-[''] before:absolute before:top-1 before:left-[-6px] before:w-1.5 before:h-6 before:rounded-l-sm before:border before:border-inherit before:bg-inherit
    after:content-[''] after:absolute after:top-1 after:right-[-6px] after:w-1.5 after:h-6 after:rounded-r-sm after:border after:border-inherit after:bg-inherit
    ${
      cabin.cabin_type === "empty"
        ? "bg-gray-200 border-dashed border-gray-500 cursor-default"
        : isInCart(cabin.item_id!)
        ? "bg-primary/20 border-primary"
        : locking === cabin.item_id
        ? "opacity-60 cursor-wait"
        : cabin.status === 1
        ? "bg-green-200 border-green-400 hover:bg-green-300 cursor-pointer"
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
                                                    <span>
                                                      {cabin.cabin_no}
                                                    </span>
                                                  </>
                                                )}
                                                {cabin.cabin_is_ac && (
                                                  <span className="absolute bottom-1 left-2.5 text-[8px] px-1">
                                                    {cabin.capacity === 1
                                                      ? "S-AC"
                                                      : "D-AC"}
                                                  </span>
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
                            <div className="flex items-center justify-center text-gray-500 h-[300px]">
                              <p className="text-center text-sm">
                                No seat data available
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {items.length > 0 && (
                    <div className="flex justify-center">
                      <p className="text-sm text-primary font-medium">
                        {items.length} item{items.length !== 1 ? "s" : ""} in cart — use the cart button to checkout
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No Seat data available
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default BusResult;
