"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export function NavbarWrapper() {
  const pathname = usePathname();

  // Hide navbar on home page (root path)
  if (pathname === "/") {
    return null;
  }

  return <Navbar />;
}
