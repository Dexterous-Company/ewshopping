// "use client";
// import { usePathname } from "next/navigation";
// import Header from "./layout/Header";
// import Footer from "./layout/Footer";

// const MainLayout = ({ children }) => {
//   const pathname = usePathname().toLowerCase();

//   const noLayoutRoutes = [
//     "/login",
//     "/register",
//     "/register-page",
//     "/otp",
//     "/searchmobile",
//     // '/cart'
//   ];
//   const sear = ["/searchresults", "/product"];
//   const isProductPage = pathname.startsWith("/product/");

//   const hideHeader =
//     noLayoutRoutes.includes(pathname) || pathname === "/product";
//   const hideFooter = noLayoutRoutes.includes(pathname);
//   const hideFooterSearch = sear.includes(pathname) || isProductPage;

//   return (
//     <div className="min-h-screen flex flex-col max-w-[2000px] m-auto">
//       {!hideHeader && <Header />}
//       <main className="flex-grow">{children}</main>

//       {!hideFooter && !hideFooterSearch && <Footer />}
//     </div>
//   );
// };

// export default MainLayout;

// "use client";
// import { usePathname } from "next/navigation";
// import Header from "./layout/Header";
// import Footer from "./layout/Footer";

// const MainLayout = ({ children }) => {
//   const pathname = usePathname().toLowerCase();

//   // ====== Visibility Rules ======
//   const hideOnBoth = ["/login", "/register", "/register-page", "/otp"];

//   const hideOnMobile = [
//     "/cart",
//     "/checkout",
//     "/accounts",
//     "/accounts/address",
//     "/searchmobile",
//   ];

//   const hideOnDesktop = [
//     // if any desktop-specific hiding needed
//     // example: "/admin"
//   ];

//   const sear = ["/searchresults", "/product"];
//   const isProductPage = pathname.startsWith("/product/");

//   // ====== HEADER ======
//   const hideHeaderOnMobile =
//     hideOnBoth.includes(pathname) || hideOnMobile.includes(pathname);
//   const hideHeaderOnDesktop =
//     hideOnBoth.includes(pathname) || hideOnDesktop.includes(pathname);

//   // ====== FOOTER ======
//   const hideFooterOnMobile =
//     hideOnBoth.includes(pathname) ||
//     hideOnMobile.includes(pathname) ||
//     sear.some((route) => pathname.startsWith(route)) ||
//     isProductPage;

//   const hideFooterOnDesktop =
//     hideOnBoth.includes(pathname) || hideOnDesktop.includes(pathname);

//   return (
//     <div className="min-h-screen flex flex-col max-w-[2000px] m-auto">
//       {/* ===== HEADER ===== */}
//       <>
//         {/* Desktop Header */}
//         {!hideHeaderOnDesktop && (
//           <div className="hidden sm:block">
//             <Header />
//           </div>
//         )}

//         {/* Mobile Header */}
//         {!hideHeaderOnMobile && (
//           <div className="block sm:hidden">
//             <Header />
//           </div>
//         )}
//       </>

//       {!hideFooterOnMobile &&
//         !hideHeaderOnMobile && (<div className="w-full sm:mt-0 mt-36"></div>)}
//       {/* ===== MAIN CONTENT ===== */}
//       <main className="flex-grow sm:mt-15">{children}</main>

//       {/* ===== FOOTER ===== */}
//       <>
//         {/* Desktop Footer */}
//         {!hideFooterOnDesktop && (
//           <div className="hidden sm:block">
//             <Footer />
//           </div>
//         )}

//         {/* Mobile Footer */}
//         {!hideFooterOnMobile && (
//           <div className="block sm:hidden">
//             <Footer />
//           </div>
//         )}
//       </>
//     </div>
//   );
// };

// export default MainLayout;

"use client";
import { usePathname } from "next/navigation";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useEffect, useState } from "react";
import MobileHeader from "./MobileHeader";

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

  // Routes where header/footer are hidden in desktop
  const noLayoutRoutes = ["/login", "/register", "/register-page", "/otp","/searchmobile"];
  const isAuthPage = noLayoutRoutes.includes(pathname);
  const isHomePage = pathname === "/" || pathname === "/home";

  // --- Logic ---
  let showHeader = true;
  let showFooter = true;
  let useMobileSubHeader = false;

  if (isMobile) {
    if (isHomePage) {
      // 📱 Home page: show normal header/footer
      showHeader = true;
      showFooter = true;
    } else {
      // 📱 Other mobile pages: hide header/footer, show alt header
      showHeader = false;
      showFooter = false;
      useMobileSubHeader = true;
    }
  } else {
    // 💻 Desktop: hide on auth pages only
    if (isAuthPage) {
      showHeader = false;
      showFooter = false;
    }
  }

  return (
    <div className="min-h-screen flex flex-col max-w-[2000px] mx-auto">
      {/* Header logic */}
      {showHeader && <Header />}
      {useMobileSubHeader && !isAuthPage && <MobileHeader />}

      {/* Space below header */}
      {(showHeader || useMobileSubHeader ) && (
        <div className={`${showHeader && "mt-35 sm:mt-15"}`} />
      )}

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
