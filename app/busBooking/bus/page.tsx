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
  const [openTripId, setOpenTripId] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);
  const [tripDataLoading, setTripDataLoading] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!openTripId) return;
      setTripDataLoading(true);

      try {
        const response = await axios(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/trip/${openTripId}`
        );
        const data = response.data;

        console.log(data);
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
            <AccordionTrigger className="px-4 hover:no-underline">
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
            <AccordionContent className="px-4 pb-4 pt-0">
              <p>no data</p>
            </AccordionContent>
          </AccordionItem>
        ))}

        {results.length === 0 && (  
          <p className="text-center">No results found</p>
        )}
      </Accordion>
    </div>
  );
}
