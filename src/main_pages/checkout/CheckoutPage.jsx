
"use client"
import React, { useState } from "react";
import RightSideCheckOut from "./RightSideCheckOut";
import CheckoutLogin from "./CheckoutLogin";
import OrderSummary from "./OrderSummary";
import PaymentOptions from "./PaymentOptionsCheckOut";
import { useSelector } from "react-redux";
import CheckOutAddress from "./CheckoutAddress";

const CheckoutPage = () => {
  const { loginData, otp, mob, isAuth } = useSelector(
    (store) => store.Athentication
  );
  const [showSummary, setShowSummary] = useState(false)
  const [continueSummary, setContinueSummary] = useState(false)
    const [continueSumamryData, setContinueSumamryData] = useState(false)
    
  return (
    <div className="min-h-screen">
      <div className="container mx-auto   px-5 sm:px-30 py-6 bg-[#f1f3f6]">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left section - scrollable content */}
          <div className="w-full lg:w-2/3 flex flex-col gap-2">
            <CheckoutLogin />
            <CheckOutAddress setShowSummary={setShowSummary} />
            <OrderSummary showSummary={showSummary} setContinueSumamryData={setContinueSumamryData} continueSumamryData={continueSumamryData} />
            <PaymentOptions  continueSumamryData={continueSumamryData} showSummary={showSummary}/>
          </div>

          {/* Right section - sticky sidebar */}
          <div className="w-full lg:w-1/3 lg:min-w-[320px] pb-10">
            <div className="lg:sticky lg:h-[calc(100vh-120px)] lg:overflow-y-auto">
              <RightSideCheckOut />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
