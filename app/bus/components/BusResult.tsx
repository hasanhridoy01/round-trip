"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading search results...</p>;
  if (!result || result.length === 0) return <p>No results found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Search Results</h2>
      <div className="space-y-4">
        {result.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg">
            <h3 className="font-medium">{item.route_name}</h3>
            <p className="text-sm text-gray-600">
              {item.starting_point} → {item.ending_point}
            </p>
            <p className="text-sm text-gray-600">
              Departure: {item.schedule_date}
            </p>
            {item.return_trip_date && (
              <p className="text-sm text-gray-600">
                Return: {item.return_trip_date}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusResult;
