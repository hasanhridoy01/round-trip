"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Layers,
  Ticket,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { unlockCartItem } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { AuthContext } from "@/context/AuthContext";
import LoginDialog from "./LoginDialog";

const CheckOutButton = () => {
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthContext);
  const { items, total, removeItem, clear } = useCart();

  const handleRemove = async (lockId: string, itemId: number) => {
    try {
      await unlockCartItem(lockId, itemId);
    } catch {
      // Lock may already be expired on server
    }
    removeItem(lockId);
  };

  const handleClearAll = async () => {
    await Promise.all(
      items.map((item) =>
        unlockCartItem(item.lockId, item.itemId).catch(() => {})
      )
    );
    clear();
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue booking.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="relative h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300">
            <ShoppingCart size={24} />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white animate-pulse">
                {items.length}
              </span>
            )}
          </Button>
        </DrawerTrigger>

        <DrawerContent className="p-0">
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <DrawerHeader className="p-0">
              <DrawerTitle className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Booking Cart
              </DrawerTitle>
              <DrawerDescription className="text-sm mt-1">
                {items.length > 0 ? (
                  <span className="text-primary">
                    {items.length} item{items.length !== 1 ? "s" : ""} locked
                  </span>
                ) : (
                  "Select seats or cabins to start booking"
                )}
              </DrawerDescription>
            </DrawerHeader>
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-4 max-h-[50vh]">
            {items.length > 0 ? (
              <div className="space-y-4">
                <div className="border rounded-xl p-4 shadow-sm bg-white relative">
                  <button
                    onClick={handleClearAll}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="Clear cart"
                  >
                    <Trash2 size={16} />
                  </button>

                  <ul className="space-y-3 mt-2">
                    {items.map((item) => (
                      <li
                        key={item.lockId}
                        className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/10"
                      >
                        <div className="flex items-start gap-3">
                          <Ticket className="w-4 h-4 text-primary mt-1" />
                          <div>
                            <p className="font-semibold">
                              {String(item.meta.cabin_no || item.type)}
                              <Badge variant="secondary" className="ml-2 uppercase text-xs">
                                {item.type}
                              </Badge>
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Route className="w-3 h-3" />
                              {String(item.meta.vehicle_name || "")}
                            </p>
                            {item.meta.route_name ? (
                              <p className="text-xs text-muted-foreground">
                                {String(item.meta.route_name)}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">৳{item.price}</Badge>
                          <button
                            onClick={() => handleRemove(item.lockId, item.itemId)}
                            className="p-1 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      Total
                    </span>
                    <span className="text-primary">৳{total}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-1">Your cart is empty</h3>
                <p className="text-gray-500 max-w-xs text-sm">
                  Search for a trip and select seats or cabins to add them here
                </p>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 z-10 bg-white border-t px-6 py-4">
            <DrawerFooter className="p-0 flex gap-2">
              {isAuthenticated ? (
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <LoginDialog />
              )}
              <DrawerClose className="w-full">
                <Button variant="outline" className="w-full">
                  Continue Browsing
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CheckOutButton;
