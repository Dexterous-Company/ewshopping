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

  // ✅ Detect screen width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.removeItem("banners");
  }, []);

  // Routes where header/footer are hidden
  const noLayoutRoutes = ["/login", "/register", "/register-page", "/otp"];
  const isAuthPage = noLayoutRoutes.includes(pathname);
  const isHomePage = pathname === "/" || pathname === "/home";

  // --- Logic ---
  let showHeader = true;
  let showFooter = true;
  let showMobileHeader = false;
  let showMobileSubHeader = false;

  if (isMobile) {
    showHeader = false;

    if (isAuthPage) {
      showMobileHeader = false;
      showMobileSubHeader = false;
      showFooter = false;
    } else if (isHomePage) {
      showMobileHeader = true;
      showFooter = true;
    } else if (pathname !== "/searchmobile") {
      showMobileSubHeader = true;
      showFooter = false;
    } else {
      showMobileHeader = false;
      showMobileSubHeader = false;
      showFooter = false;
    }
  } else {
    // 💻 Desktop logic
    if (isAuthPage) {
      showHeader = false;
      showFooter = false;
    }
  }

  return (
    <div className="min-h-screen flex flex-col mx-auto">
      {/* Headers */}
      {showHeader && <Header />}
      {showMobileHeader && <HomeMobileHeader />}
      {showMobileSubHeader && <MobileHeader />}

      {/* Space below header */}
      {(showHeader || showMobileHeader || !showMobileSubHeader) && (
        <div className={`${showHeader ? "mt-35 sm:mt-15" : "mt-0"}`} />
      )}

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
