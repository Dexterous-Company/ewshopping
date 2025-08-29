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
      {/* <div className="hidden sm:block ">
        <Header />
      </div> */}
      {/* #f1f3f6 */}
      {CartItems && CartItems?.length > 0 ? (
        <>
          <div className="h-screen sm:mb-0 mb-14 overflow-y-auto no-scrollbar bg-[#f5f6fb] relative overflow-x-hidden ">
            <div className="block md:hidden sticky inset-0 top-0 z-[10] w-full shadow-md bg-white">
              <div className="bg-white mx-3 flex flex-row gap-2 h-13 items-center">
                <IoIosArrowRoundBack size={30} />
                <span>My Cart</span>
              </div>
            </div>
            <div className="w-full bg-[#f5f6f7] sm:mt-17  gap-2 relative px-4 mt-4">
              <div className="w-full flex flex-col lg:flex-row  lg:justify-center  my-2 gap-2">
                <div className="lg:w-7/12 mx-0 lg:mx-2 flex flex-col bg-[#f5f6f7] lg:px-0 px-3 space-y-1 border border-[#ddd]">
                  <CartLeft />
                </div>
                <div className="lg:w-4/12 flex flex-col lg:mx-0 mr-5 w-full lg:p-5  rounded-sm lg:mr-5">
                  <div className="lg:sticky lg:top-2 lg:h-[calc(100vh-120px)] lg:overflow-y-auto no-scrollbar">
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
