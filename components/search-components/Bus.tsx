"use client";

import React from "react";
import { Calendar, MapPin, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSearch } from "@/context/SearchContext";

const BusComponent = () => {
  const router = useRouter();
  const { setResults } = useSearch();
  const [tripType, setTripType] = React.useState<"oneWay" | "roundTrip">(
    "oneWay"
  );
  const [fromLocation, setFromLocation] = React.useState("");
  const [toLocation, setToLocation] = React.useState("");
  const [journeyDate, setJourneyDate] = React.useState("");
  const [returnDate, setReturnDate] = React.useState("");
  const [trip, setTrip] = React.useState("bus");

  // Famous Bangladeshi cities for bus routes
  const bdCities = [
    // Divisional Cities
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Khulna",
    "Rajshahi",
    "Barisal",
    "Rangpur",
    "Mymensingh",

    // Major District Cities
    "Comilla",
    "Cox's Bazar",
    "Gazipur",
    "Narayanganj",
    "Jessore",
    "Bogra",
    "Dinajpur",
    "Faridpur",
    "Pabna",
    "Tangail",
    "Kushtia",
    "Noakhali",
    "Feni",
    "Brahmanbaria",

    // Important Tourist/Transit Cities
    "Bandarban",
    "Rangamati",
    "Khagrachhari",
    "Sreemangal",
    "Kuakata",
    "Teknaf",
    "Chandpur",
    "Manikganj",
    "Munshiganj",

    // Border Cities
    "Benapole",
    "Hili",
    "Tamabil",
    "Teknaf",
  ];

  const [showSuggestions, setShowSuggestions] = React.useState<{
    field: "from" | "to" | null;
  }>({ field: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as "oneWay" | "roundTrip";
    setTripType(value);
  };

  const swapLocations = () => {
    setFromLocation(toLocation);
    setToLocation(fromLocation);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(
      `/bus?type=${trip}&trip_date=${journeyDate}&return_trip_date=${returnDate}&trip_from=${fromLocation}&trip_to=${toLocation}`
    );
  };

  // Filtered city lists
  const filteredFromCities = bdCities.filter((city) =>
    city.toLowerCase().includes(fromLocation.toLowerCase())
  );
  const filteredToCities = bdCities.filter((city) =>
    city.toLowerCase().includes(toLocation.toLowerCase())
  );

  return (
    <Card className="max-w-7xl mx-auto rounded-xl bg-white shadow-md">
      <CardContent className="py-10 px-8">
        {/* Trip Type */}
        <div className="flex items-center space-x-6 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value="oneWay"
              checked={tripType === "oneWay"}
              onChange={handleChange}
              className="accent-primary w-4 h-4"
            />
            <span className="font-normal text-black uppercase">One Way</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="tripType"
              value="roundTrip"
              checked={tripType === "roundTrip"}
              onChange={handleChange}
              className="accent-primary w-4 h-4"
            />
            <span className="font-normal text-black uppercase">Round Way</span>
          </label>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
            {/* From */}
            <div className="md:col-span-2 space-y-1.5 relative">
              <span className="text-sm text-primary font-medium uppercase">
                From
              </span>
              <div className="relative bg-gray-100 rounded-md px-3 py-2 flex items-center">
                <MapPin className="text-primary h-4 w-4 mr-2" />
                <Input
                  placeholder="Departure City"
                  value={fromLocation}
                  onChange={(e) => {
                    setFromLocation(e.target.value);
                    setShowSuggestions({ field: "from" });
                  }}
                  onFocus={() => setShowSuggestions({ field: "from" })}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions({ field: null }), 200)
                  }
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base font-normal placeholder-gray-500"
                />
              </div>
              {showSuggestions.field === "from" &&
                fromLocation &&
                filteredFromCities.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white shadow-md rounded-md mt-1 max-h-40 overflow-y-auto">
                    {filteredFromCities.map((city) => (
                      <li
                        key={city}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onMouseDown={() => setFromLocation(city)}
                      >
                        <MapPin className="text-primary h-4 w-4 mr-2" />
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center items-center md:col-span-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={swapLocations}
                className="h-14 w-14 rounded-full border-gray-300 text-gray-500 hover:bg-primary hover:text-white"
              >
                <ArrowLeftRight size={22} />
              </Button>
            </div>

            {/* To */}
            <div className="md:col-span-2 space-y-1.5 relative">
              <span className="text-sm text-primary font-medium uppercase">
                To
              </span>
              <div className="relative bg-gray-100 rounded-md px-3 py-2 flex items-center">
                <MapPin className="text-primary h-4 w-4 mr-2" />
                <Input
                  placeholder="Destination City"
                  value={toLocation}
                  onChange={(e) => {
                    setToLocation(e.target.value);
                    setShowSuggestions({ field: "to" });
                  }}
                  onFocus={() => setShowSuggestions({ field: "to" })}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions({ field: null }), 200)
                  }
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base font-normal placeholder-gray-500"
                />
              </div>
              {showSuggestions.field === "to" &&
                toLocation &&
                filteredToCities.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white shadow-md rounded-md mt-1 max-h-40 overflow-y-auto">
                    {filteredToCities.map((city) => (
                      <li
                        key={city}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onMouseDown={() => setToLocation(city)}
                      >
                        <MapPin className="text-primary h-4 w-4 mr-2" />
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
            </div>

            {/* Journey Date */}
            <div className="md:col-span-2 space-y-1.5 relative">
              <span className="text-sm text-primary font-medium uppercase">
                Journey Date
              </span>
              <div className="relative bg-gray-100 rounded-md px-3 py-2 flex items-center">
                <Calendar className="text-primary h-4 w-4" />
                <Input
                  type="date"
                  value={journeyDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base font-normal"
                />
              </div>
            </div>

            {tripType === "roundTrip" && (
              <div className="md:col-span-2 space-y-1.5">
                <span className="text-sm text-primary font-medium uppercase">
                  Return Date
                </span>
                <div className="bg-gray-100 rounded-md px-3 py-2 flex items-center">
                  <Calendar className="text-primary h-4 w-4" />
                  <Input
                    type="date"
                    value={returnDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base font-normal"
                  />
                </div>
              </div>
            )}

            {/* Search Button */}
            <div
              className={`pt-3 md:pt-0 ${
                tripType === "roundTrip" ? "mt-2" : ""
              } md:col-span-2 col-span-1 flex justify-center transition-all duration-300 ease-in-out`}
            >
              <Button
                disabled={!fromLocation || !toLocation || !journeyDate}
                type="submit"
                className="h-14 w-full bg-primary hover:bg-primary/80 text-white text-lg font-medium rounded-md"
              >
                SEARCH
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusComponent;
