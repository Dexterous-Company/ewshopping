"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
// import Header from "@/components/layout/MobileHeader";
import Accountspage from "../../components/Accounts/Accountspage";

const AccountLayout = ({ children }) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(null); 

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isRootAccountPage = pathname === "/accounts";

  if (isMobile === null) return null;

  return (
    <>
      {/* <div className="hidden sm:block">
        <Header />
      </div> */}

      {/* Mobile view */}
      {isMobile ? (
        <div className="bg-white w-full min-h-screen p-3">
          {isRootAccountPage ? <Accountspage /> : children}
        </div>
      ) : (
        <div className="bg-[#f5f6fb] sm:p-5 p-2 h-full w-full flex sm:flex-row flex-col gap-10">
          {/* Left Menu */}
          <div className="sm:w-1/3 w-full flex flex-col gap-2">
            <Accountspage />
          </div>

          {/* Right Content */}
          <div className="w-full p-5 bg-white shadow-md hidden sm:block">
            <main className="flex-grow">{children}</main>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountLayout;
