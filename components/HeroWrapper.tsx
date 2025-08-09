"use client";

import { usePathname } from "next/navigation";
import Hero from "./Hero";

export default function HeroWrapper() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return <Hero />;
}