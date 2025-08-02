import React, { useState } from "react";
import Link from "next/link";
import { Hotel, Umbrella, BadgeCheck, Plane } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import HotelComponent from "./search-components/Hotel";
import FlightComponent from "./search-components/Flight";

const Hero = () => {
  const [activeTab, setActiveTab] = useState("flight");

  const getBackgroundClass = () => {
    switch (activeTab) {
      case "hotel":
        return "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800";
      case "holidays":
        return "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800";
      case "visa":
        return "bg-gradient-to-r from-violet-600 via-purple-600 to-violet-800";
      case "flight":
      default:
        return "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800";
    }
  };

  return (
    <section
      className={`relative ${getBackgroundClass()} md:pt-8 pt-14 pb-24 md:h-[350px] h-screen`}
    >
      {/* Background elements remain the same */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero content */}
        <div className="text-center md:py-10 pb-28">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create A New Story With Every Trip
          </h1>
          <p className="text-xl text-white/90">
            Flight, Hotel, Holidays & Visa at your fingertips
          </p>
        </div>
      </div>

      {/* Tabs positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs
            defaultValue="flight"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="w-full mx-auto flex-wrap gap-1 bg-transparent">
              <TabsTrigger value="flight" className="bg-white">
                <Plane size={18} /> Flight
              </TabsTrigger>
              <TabsTrigger value="hotel" className="bg-white">
                <Hotel size={18} /> Hotel
              </TabsTrigger>
              <TabsTrigger value="holidays" className="bg-white">
                <Umbrella size={18} /> Holidays
              </TabsTrigger>
              <TabsTrigger value="visa" className="bg-white">
                <BadgeCheck size={18} /> Visa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flight">
              <FlightComponent />
            </TabsContent>

            <TabsContent value="hotel">
              <HotelComponent />
            </TabsContent>

            <TabsContent value="holidays"></TabsContent>

            <TabsContent value="visa"></TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Hero;
