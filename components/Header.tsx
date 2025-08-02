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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import LoginDialog from "./LoginDialog";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { icon: Bus, label: "Bus", active: false },
    { icon: Plane, label: "Air", active: false },
    { icon: Train, label: "Train", active: false },
    { icon: Ship, label: "Launch", active: true },
    { icon: Calendar, label: "Event", active: false },
    { icon: MapPin, label: "Park", active: false, beta: true },
  ];
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">
              Travel<span className="text-purple-600">Hub</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`flex items-center space-x-2 hover:bg-blue-50 relative ${
                  item.active ? "text-blue-600 bg-blue-50" : ""
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={26} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <div className="text-xl font-bold text-blue-600">
                      Travel<span className="text-purple-600">Hub</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-4">
                  {/* Navigation Items */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Services
                    </h3>
                    {navigationItems.map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className={`w-full justify-start space-x-3 h-12 ${
                          item.active
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Contact & Account */}
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Account
                    </h3>
                    {/* <Button
                      variant="ghost"
                      className="w-full justify-start space-x-3 h-12 hover:bg-gray-50"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/login">
                        <User size={20} />
                        <span className="font-medium">Login / Sign Up</span>
                      </Link>
                    </Button> */}
                    <LoginDialog />
                    <Button
                      variant="ghost"
                      className="w-full justify-start space-x-3 h-12 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Phone size={20} />
                      <span className="font-medium">Call 16374</span>
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  {/* <div className="space-y-3 pt-4 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Quick Actions
                    </h3>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Book Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      Track Booking
                    </Button>
                  </div> */}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Right side */}
          <div className="md:flex items-center space-x-4 hidden">
            <Button
              variant="outline"
              className="hidden sm:flex items-center space-x-2"
            >
              <Phone size={16} />
              <span>16374</span>
            </Button>
            <LoginDialog />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
