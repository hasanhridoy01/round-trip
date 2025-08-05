"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import axios from "axios";
import { useSearch } from "@/context/SearchContext";
import { useBookingContext } from "@/context/BookingContext";

interface SearchPageProps {
  searchParams: {
    type?: string;
  };
}

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

export default function SearchResults({ searchParams }: SearchPageProps) {
  const { results } = useSearch();
  const { setBookingData } = useBookingContext();
  const [openTripId, setOpenTripId] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);
  const [tripDataLoading, setTripDataLoading] = useState(false);
  const [selectedCabins, setSelectedCabins] = useState<any[]>([]);

  const bookingType = searchParams.type;

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!openTripId) return;
      setTripDataLoading(true);
      setSelectedCabins([]);

      try {
        const response = await axios(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/trip/${openTripId}`
        );
        const data = response.data;
        setTripData(data);
      } catch (error) {
        toast.error("Failed to fetch trip details");
        console.error("Error fetching trip details:", error);
      } finally {
        setTripDataLoading(false);
      }
    };

    fetchTripDetails();
  }, [openTripId]);

  const handleCabinClick = (cabin: any) => {
    if (cabin.cabin_type === "empty" || cabin.status !== 1) return;

    setSelectedCabins((prev) => {
      if (prev.some((c) => c.item_id === cabin.item_id)) {
        return prev.filter((c) => c.item_id !== cabin.item_id);
      }

      return [...prev, cabin];
    });
  };

  const handleBookClick = () => {
    if (selectedCabins.length > 0) {
      console.log("Selected Cabins Data:", selectedCabins, bookingType);
      toast.success(`${selectedCabins.length} cabins selected for booking`);
    }
  };

  return (
    <div className="p-6 max-w-7xl md:pt-44 md:pb-24 mx-auto">
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-2"
        onValueChange={(value) => {
          setOpenTripId(value ?? null);
        }}
      >
        {results.map((result) => (
          <AccordionItem
            key={result.trip_id}
            value={String(result.trip_id)}
            className="border rounded-lg"
          >
            <AccordionTrigger className="px-4 hover:no-underline border-b">
              <div className="flex items-center w-full">
                <div className="mr-4">{getIcon(searchParams.type)}</div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{result.route_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.starting_point} → {result.ending_point} on{" "}
                    {result.schedule_date}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4">
              {tripDataLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : tripData ? (
                <div className="space-y-6">
                  {/* ... (keep existing header and floor buttons the same) */}

                  {/* Floor Content */}
                  {tripData.data.cabins.second_floor ? (
                    <>
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <h4 className="font-medium mb-3 text-center">
                          2nd Floor Cabin Layout
                        </h4>

                        <div className="space-y-4">
                          {Object.entries(
                            tripData.data.cabins.second_floor
                          ).map(([row, cabins]: [string, any]) => (
                            <div
                              key={row}
                              className="flex justify-center gap-2"
                            >
                              {cabins.map((cabin: any, index: number) => (
                                <div
                                  key={index}
                                  onClick={() => handleCabinClick(cabin)}
                                  className={`
                                    w-24 h-16 rounded-md flex flex-col items-center justify-center border
                                   ${
                                     cabin.cabin_type === "empty"
                                       ? "bg-gray-100 border-dashed"
                                       : selectedCabins.some(
                                           (c) => c.item_id === cabin.item_id
                                         )
                                       ? "bg-blue-100 border-blue-400 ring-2 ring-blue-300"
                                       : cabin.status === 1
                                       ? "bg-green-100 border-green-300 hover:bg-green-200 cursor-pointer"
                                       : "bg-red-100 border-red-300 opacity-70"
                                   }
                                    transition-colors relative
                                  `}
                                  title={
                                    cabin.cabin_type === "empty"
                                      ? "Empty space"
                                      : cabin.description
                                  }
                                >
                                  {cabin.cabin_type !== "empty" && (
                                    <>
                                      <span className="font-medium text-sm">
                                        {cabin.cabin_no}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        ৳{cabin.fare}
                                      </span>
                                      {cabin.status === 1 && (
                                        <span className="absolute top-1 right-1 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                                          {cabin.capacity}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Book Button */}
                      {selectedCabins && (
                        <div className="flex justify-center">
                          <button
                            onClick={handleBookClick}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          >
                            Book {selectedCabins.length} Cabin
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="border rounded-lg p-8 text-center bg-gray-50">
                      <p className="text-gray-500">
                        No cabin data available for this floor
                      </p>
                    </div>
                  )}

                  {/* Information about other floors */}
                  <div className="space-y-2">
                    {tripData.data.floors
                      .filter((f: any) => f.value !== 2)
                      .map((floor: any) => (
                        <div
                          key={floor.value}
                          className="text-sm text-center text-gray-500"
                        >
                          {floor.label} has no cabin available
                        </div>
                      ))}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 justify-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded-sm"></div>
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 border border-dashed rounded-sm"></div>
                      <span>Empty space</span>
                    </div>
                  </div>
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
}
