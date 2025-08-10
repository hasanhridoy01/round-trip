"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { Bus, Ship, Phone, Menu, Briefcase, Building2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import LoginDialog from "./LoginDialog";
import { usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, login, logout, travel_auth } =
    useContext(AuthContext);
  const navigationItems = [
    { icon: Bus, label: "Bus", link: "/bus" },
    { icon: Ship, label: "Launch", link: "/launch" },
    { icon: Briefcase, label: "Boat", link: "/boat" },
    { icon: Building2, label: "Hotels", link: "/hotels" },
  ];

  // Logout Function
  const handleLogout = async () => {
    logout();
    toast.success("Logout successful");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-lg font-bold text-blue-600 cursor-pointer">
            <Link href={"/"}>
              Travel<span className="text-purple-600">Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.link;

              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  className={`flex items-center w-full justify-start space-x-2 hover:bg-primary/10 ${
                    isActive ? "text-primary bg-primary/10" : ""
                  }`}
                >
                  <item.icon size={20} />
                  <Link href={item.link}>{item.label}</Link>
                </Button>
              );
            })}
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
                      <Link href={"/"}>
                        Travel<span className="text-purple-600">Hub</span>
                      </Link>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 space-y-4">
                  {/* Navigation Items */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Services
                    </h3>
                    {navigationItems.map((item) => {
                      const isActive = pathname === item.link;

                      return (
                        <Button
                          key={item.label}
                          variant="ghost"
                          className={`w-full justify-start space-x-3 h-12 ${
                            isActive
                              ? "bg-blue-50 text-blue-600"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <item.icon size={20} />
                          <Link href={item.link} className="font-medium">
                            {item.label}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Account Info */}
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      Account
                    </h3>
                    <LoginDialog />
                    {/* <Button
                      variant="ghost"
                      className="flex items-center space-x-2 hover:bg-primary/70 text-primary hover:text-primary-foreground border border-gray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Phone size={20} />
                      <span className="font-medium">Call 16374</span>
                    </Button> */}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <Button
              variant="outline"
              className="flex items-center space-x-2 hover:bg-primary/70 text-primary hover:text-primary-foreground border border-gray-300"
            >
              <Phone size={16} />
              <span>16374</span>
            </Button> */}
            {
              isAuthenticated ? (
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-primary/70 text-primary hover:text-primary-foreground border border-gray-300" onClick={handleLogout}                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              ) : (
                <LoginDialog />
              ) 
            }
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
