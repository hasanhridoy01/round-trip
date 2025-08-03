"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Plane,
  Hotel,
  Ship,
  Clock,
  MapPin,
  Calendar,
  Wallet,
} from "lucide-react";

interface SearchResult {
  id: string;
  type: "flight" | "hotel" | "cruise";
  departureTime?: string;
  arrivalTime?: string;
  checkIn?: string;
  checkOut?: string;
  departurePort?: string;
  arrivalPort?: string;
  price: number;
  duration?: string;
  name: string;
  description: string;
  amenities?: string[];
  cabinType?: string;
  itinerary?: string[];
}

export default function SearchResults() {
  const mockResults: SearchResult[] = [
    {
      id: "flight-1",
      type: "flight",
      departureTime: "10:00 AM",
      arrivalTime: "2:30 PM",
      price: 249,
      duration: "4h 30m",
      name: "Skyline Airways",
      description: "Direct flight from JFK to LAX",
      departurePort: "New York (JFK)",
      arrivalPort: "Los Angeles (LAX)",
    },
    {
      id: "hotel-1",
      type: "hotel",
      checkIn: "Jun 15, 2023",
      checkOut: "Jun 20, 2023",
      price: 1200,
      name: "Grand Marina Resort",
      description: "5-star luxury resort with ocean view",
      amenities: ["Pool", "Spa", "Restaurant", "Free WiFi"],
    },
    {
      id: "cruise-1",
      type: "cruise",
      departureTime: "Jun 10, 2023",
      arrivalTime: "Jun 17, 2023",
      price: 1800,
      name: "Caribbean Dream Cruise",
      description: "7-night Caribbean cruise",
      cabinType: "Balcony Suite",
      itinerary: ["Miami", "Bahamas", "Jamaica", "Grand Cayman"],
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "flight":
        return <Plane className="h-5 w-5" />;
      case "hotel":
        return <Hotel className="h-5 w-5" />;
      case "cruise":
        return <Ship className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Search Results</h1>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {mockResults.map((result) => (
          <AccordionItem
            key={result.id}
            value={result.id}
            className="border rounded-lg"
          >
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center w-full">
                <div className="mr-4">{getIcon(result.type)}</div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium">{result.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${result.price}</p>
                  {result.duration && (
                    <p className="text-sm text-muted-foreground">
                      {result.duration}
                    </p>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 pt-0">
              {result.type === "flight" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Route
                    </h4>
                    <p>
                      {result.departurePort} → {result.arrivalPort}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Departs: {result.departureTime}, Arrives:{" "}
                      {result.arrivalTime}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Wallet className="h-4 w-4 mr-2" />
                      Price Details
                    </h4>
                    <p>Total: ${result.price}</p>
                  </div>
                </div>
              )}

              {result.type === "hotel" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Dates
                    </h4>
                    <p>Check-in: {result.checkIn}</p>
                    <p>Check-out: {result.checkOut}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Wallet className="h-4 w-4 mr-2" />
                      Amenities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.amenities?.map((amenity) => (
                        <span
                          key={amenity}
                          className="px-2 py-1 bg-muted rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {result.type === "cruise" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Itinerary
                    </h4>
                    <ul className="list-disc pl-5">
                      {result.itinerary?.map((port) => (
                        <li key={port}>{port}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Wallet className="h-4 w-4 mr-2" />
                      Cabin Details
                    </h4>
                    <p>Cabin Type: {result.cabinType}</p>
                    <p>Total: ${result.price}</p>
                  </div>
                </div>
              )}

              <button className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                {result.type === "flight" && "Book Flight"}
                {result.type === "hotel" && "Book Hotel"}
                {result.type === "cruise" && "Book Cruise"}
              </button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}