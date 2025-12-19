"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import CartLeft from "@/components/CartPage/CartLeft";
import CartRight from "@/components/CartPage/CartRight";
import EmptyCart from "@/components/CartPage/EmptyCard";
// import Header from "@/components/layout/MobileHeader";
import { useSelector } from "react-redux";
const MainCart = () => {
  const { CartItems, TotalMrp, TotalPrice } = useSelector(
    (state) => state.cart
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents SSR mismatch
  return (
    <>
      {CartItems && CartItems?.length > 0 ? (
        <>
          <div className="sm:h-screen h-fit sm:mb-0 mb-14 overflow-y-auto no-scrollbar bg-[#f5f6fb] relative overflow-x-hidden">
            <div className="w-full bg-[#f5f6f7] sm:mt-2 gap-2 relative sm:px-4 px-0 mt-4">
              <div className="w-full flex flex-col lg:flex-row  my-2 gap-2">
                <div className="lg:w-full py-2 mx-0 lg:mx-2 flex flex-col bg-[#fff] lg:px-0 px-0 space-y-1">
                  <CartLeft />
                </div>
                <div className="lg:w-1/2 sm:px-0 px-3 flex flex-col lg:mx-0 mr-5 w-full lg:p-5  rounded-sm lg:mr-5">
                  {/* <div className="lg:sticky  lg:h-[calc(100vh-120px)] lg:overflow-y-auto no-scrollbar"> */}
                  <div className="lg:sticky lg:top-6">
                    <CartRight />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <EmptyCart />
        </>
      )}
    </>
  );
};

export default MainCart;
