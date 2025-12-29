"use client";

import { usePathname } from "next/navigation";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

import { useEffect, useState } from "react";
import MobileHeader from "./MobileHeader";
import HomeMobileHeader from "./HomeMobileHeader";

const MainLayout = ({ children }) => {
  const pathname = usePathname()?.toLowerCase() || "/";
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Run only on client AFTER hydration
  useEffect(() => {
    setMounted(true);

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.removeItem("banners");
    }
  }, [mounted]);

  // 🚨 CRITICAL: block layout switching before mount
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col mx-auto">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    );
  }

  // Routes where header/footer are hidden
  const noLayoutRoutes = ["/login", "/register", "/register-page", "/otp"];
  const isAuthPage = noLayoutRoutes.includes(pathname);
  const isHomePage = pathname === "/" || pathname === "/home";

  // --- Layout logic ---
  let showHeader = true;
  let showFooter = true;
  let showMobileHeader = false;
  let showMobileSubHeader = false;

  if (isMobile) {
    showHeader = false;

    if (isAuthPage) {
      showFooter = false;
    } else if (isHomePage) {
      showMobileHeader = true;
    } else if (pathname !== "/searchmobile") {
      showMobileSubHeader = true;
      showFooter = false;
    } else {
      showFooter = false;
    }
  } else {
    if (isAuthPage) {
      showHeader = false;
      showFooter = false;
    }
  }

  return (
    <div className="min-h-screen flex flex-col mx-auto">
      {showHeader && <Header />}
      {showMobileHeader && <HomeMobileHeader />}
      {showMobileSubHeader && <MobileHeader />}

      {(showHeader || showMobileHeader || !showMobileSubHeader) && (
        <div className={`${showHeader ? "mt-35 sm:mt-15" : "mt-0"}`} />
      )}

      <main className="flex-grow">{children}</main>

      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
