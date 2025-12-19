"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopEffect() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top smoothly whenever route changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null; // no UI, just the effect
}
