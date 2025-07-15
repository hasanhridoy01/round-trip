import React, { useState } from "react";
import Link from "next/link";
import {
  Bus,
  Plane,
  Train,
  Ship,
  Calendar,
  MapPin,
  Search,
  ArrowLeftRight,
  Phone,
  User,
  CreditCard,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  const [tripType, setTripType] = useState("oneWay");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };
  return (
    <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 md:py-32 py-14">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-7xl mx-auto rounded-xl bg-white/90 backdrop-blur-sm shadow-md">
          <CardContent className="p-6">
            {/* Trip Type */}
            <div className="flex items-center space-x-6 mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="oneWay"
                  checked={tripType === "oneWay"}
                  onChange={(e) => setTripType(e.target.value)}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="font-normal text-black uppercase">
                  One Way
                </span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="tripType"
                  value="roundTrip"
                  checked={tripType === "roundTrip"}
                  onChange={(e) => setTripType(e.target.value)}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="font-normal text-black uppercase">
                  Round Way
                </span>
              </label>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* From */}
              <div className="space-y-1.5">
                <span className="text-sm text-green-600 font-medium uppercase">
                  From
                </span>
                <div className="relative bg-gray-100 rounded-md px-3 py-2 flex items-center">
                  <MapPin className="text-green-500 h-4 w-4 mr-2" />
                  <Input
                    placeholder="Departure City"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base font-normal placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Swap */}
              <div className="flex justify-center pt-6 md:pt-0">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={swapLocations}
                  className="h-14 w-14 rounded-full border-gray-300 text-gray-500"
                >
                  <ArrowLeftRight size={22} />
                </Button>
              </div>

              {/* To */}
              <div className="space-y-1.5">
                <span className="text-sm text-green-600 font-medium uppercase">
                  To
                </span>
                <div className="relative bg-gray-100 rounded-md px-3 py-2 flex items-center">
                  <MapPin className="text-green-500 h-4 w-4 mr-2" />
                  <Input
                    placeholder="Destination City"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base font-normal placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Journey Date */}
              <div className="space-y-1.5 relative">
                <span className="text-sm text-green-600 font-medium uppercase">
                  Journey Date
                </span>
                <div className="relative bg-gray-100 rounded-md px-3 py-2 flex items-center">
                  <Calendar className="text-green-500 h-4 w-4 mr-2" />
                  <Input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base font-normal"
                  />
                </div>
              </div>

              {tripType === "roundTrip" && (
                <div className="md:col-start-5 col-span-1 space-y-1.5 mt-4">
                  <span className="text-sm text-green-600 font-medium uppercase">
                    Return Date
                  </span>
                  <div className="bg-gray-100 rounded-md px-3 py-2 flex items-center">
                    <Calendar className="text-green-500 h-4 w-4 mr-2" />
                    <Input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base font-normal"
                    />
                  </div>
                </div>
              )}

              {/* Search Button */}
              <div
                className={`pt-3 md:pt-0 ${
                  tripType === "roundTrip"
                    ? "md:col-start-5 mt-2"
                    : "md:col-span-1"
                } col-span-1 flex justify-center transation-all duration-300 ease-in-out`}
              >
                <Button
                  className={`${
                    tripType === "roundTrip" ? "h-14" : "h-14"
                  } w-full bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-md`}
                >
                  SEARCH
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Hero;
