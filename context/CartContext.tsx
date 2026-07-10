"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { apiGet } from "@/lib/api";
import { CartItem, cartItemFromApi } from "@/lib/cart";

interface CartContextType {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (lockId: string) => void;
  updateItem: (lockId: string, patch: Partial<CartItem>) => void;
  clear: () => void;
  isInCart: (itemId: number) => boolean;
  syncFromServer: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  updateItem: () => {},
  clear: () => {},
  isInCart: () => false,
  syncFromServer: async () => {},
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const clearTimer = (lockId: string) => {
    if (timers.current[lockId]) {
      clearTimeout(timers.current[lockId]);
      delete timers.current[lockId];
    }
  };

  const scheduleExpiry = useCallback((item: CartItem) => {
    if (!item.expiresAt) return;
    const ms = new Date(item.expiresAt).getTime() - Date.now();
    if (ms <= 0) {
      setItems((prev) => prev.filter((i) => i.lockId !== item.lockId));
      return;
    }
    clearTimer(item.lockId);
    timers.current[item.lockId] = setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.lockId !== item.lockId));
      clearTimer(item.lockId);
    }, ms);
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        const filtered = prev.filter((i) => i.itemId !== item.itemId);
        return [...filtered, item];
      });
      scheduleExpiry(item);
    },
    [scheduleExpiry]
  );

  const removeItem = useCallback((lockId: string) => {
    clearTimer(lockId);
    setItems((prev) => prev.filter((i) => i.lockId !== lockId));
  }, []);

  const updateItem = useCallback((lockId: string, patch: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((i) => (i.lockId === lockId ? { ...i, ...patch } : i))
    );
  }, []);

  const clear = useCallback(() => {
    Object.keys(timers.current).forEach(clearTimer);
    timers.current = {};
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (itemId: number) => items.some((i) => i.itemId === itemId),
    [items]
  );

  const syncFromServer = useCallback(async () => {
    try {
      const res = await apiGet<Record<string, unknown>>("cart");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res.data)
          ? res.data
          : [];
      const parsed = (list as Record<string, unknown>[]).map(cartItemFromApi);
      setItems(parsed);
      parsed.forEach(scheduleExpiry);
    } catch {
      // Cart may be empty or user not logged in
    }
  }, [scheduleExpiry]);

  useEffect(() => {
    syncFromServer();
    return () => {
      Object.keys(timers.current).forEach(clearTimer);
    };
  }, [syncFromServer]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        addItem,
        removeItem,
        updateItem,
        clear,
        isInCart,
        syncFromServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
