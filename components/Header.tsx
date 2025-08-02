import React, { useState } from "react";
import Link from "next/link";
import { Bus, Ship, Phone, Menu, Briefcase, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    { icon: Ship, label: "Launch", active: true },
    { icon: Briefcase, label: "Board", active: false },
    { icon: Building2, label: "Hotels", active: false },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            Travel<span className="text-purple-600">Hub</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`flex items-center w-full justify-start space-x-2 hover:bg-primary/10 ${
                  item.active ? "text-primary bg-primary/10" : ""
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" color="primary">
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

                  {/* Account Info */}
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Account
                    </h3>
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
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
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
