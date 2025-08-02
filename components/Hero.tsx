import React, { useState } from "react";
import { Bus, Ship, Briefcase, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import BusComponent from "./search-components/Bus";
import LaunchComponent from "./search-components/Launch";

type TabBackgrounds = {
  [key: string]: string;
  bus: string;
  launch: string;
  hotel: string;
  boat: string;
  default: string;
};

const Hero = () => {
  const [activeTab, setActiveTab] = useState<keyof TabBackgrounds>("launch");

  // Define background images for each tab
  const getBackgroundImage = (): string => {
    const backgrounds: TabBackgrounds = {
      bus: 'url("https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg")',
      launch:
        'url("https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg")',
      hotel:
        'url("https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg")',
      boat: 'url("https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg")',
      default:
        'url("https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg")',
    };

    return backgrounds[activeTab] || backgrounds.default;
  };

  const backgroundImage = getBackgroundImage();

  return (
    <section className="relative md:pt-8 pt-14 pb-24 md:h-[350px] h-screen">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: backgroundImage,
          opacity: 1,
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
            defaultValue="launch"
            onValueChange={(value) =>
              setActiveTab(value as keyof TabBackgrounds)
            }
          >
            <TabsList className="w-full mx-auto flex-wrap gap-1 bg-transparent">
              <TabsTrigger value="bus" className="bg-white text-black">
                <Bus size={18} /> Bus
              </TabsTrigger>
              <TabsTrigger value="launch" className="bg-white text-black">
                <Ship size={18} /> Launch
              </TabsTrigger>
              <TabsTrigger value="boat" className="bg-white text-black">
                <Briefcase size={18} /> Boat
              </TabsTrigger>
              <TabsTrigger value="hotel" className="bg-white text-black">
                <Building2 size={18} /> Hotels
              </TabsTrigger>
            </TabsList>

            {/* Tab contents remain the same */}
            <TabsContent value="bus">
              <BusComponent />
            </TabsContent>
            <TabsContent value="launch">
              <LaunchComponent />
            </TabsContent>
            <TabsContent value="boat">
              <BusComponent />
            </TabsContent>
            <TabsContent value="hotel">
              <BusComponent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Hero;
