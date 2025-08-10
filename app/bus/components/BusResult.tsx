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

const BusResult = () => {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<BusData[] | null>(null);
  const [openTripId, setOpenTripId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  // const [tripData, setTripData] = useState<TripData | null>(null);
  const [tripDataLoading, setTripDataLoading] = useState(false);

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

  const handleTripSelect = async (tripId: string) => {
    setTripDataLoading(true);
    
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/trip/${tripId}`
      );

      if (response.data.success) {
        toast.success("Trip details loaded successfully");

        console.log(response.data);
        // setTripData(response.data);
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
  if (!result || result.length === 0) return <p>No results found.</p>;

  return (
    <div className="p-4 max-w-7xl md:pt-8 md:pb-10 mx-auto">
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
              <p>{trip.trip_id}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default BusResult;
