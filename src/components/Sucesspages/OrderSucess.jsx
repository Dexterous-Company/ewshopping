"use client";
import React, { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCartTotal } from "@/redux/cart/CartSlice";

const OrderSucess = () => {
  const [modelState, setModelState] = useState({ type: null });
  const router = useRouter();
  const { loginData, otp, mob, current_address, isAuth } = useSelector((store) => store.Athentication);

  const [isMount, setIsMount] = useState(false)
  useEffect(() => {
    setIsMount(true);
  }, []);
  const today = new Date();
  const after3Days = new Date(today);
  after3Days.setDate(today.getDate() + 3);

  const options = { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit' };
  const formattedDate = after3Days.toLocaleDateString('en-US', options)
    .replace(',', '') // remove first comma
    .replace(/(\d{1,2}),/, "$1th"); // add 'th' after day

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(clearCart());
    dispatch(getCartTotal());
  }, [dispatch])
  return (
    <div className="bg-gray-50 sm:p-6 p-3 sm:mb-0 mb-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-8">
        {/* Left Section */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
          <div className="flex sm:flex-row flex-col-reverse  sm:items-start justify-between  border-b border-b-gray-200 pb-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold text-gray-800">
                Thanks for shopping with us!
              </h2>
              <p className="text-sm text-gray-500">
                Delivery by <span className="font-medium">{formattedDate}</span>
              </p>
              <button
                onClick={() => router.push("/accounts/orders")}
                className="text-xs font-semibold text-[#e96f84] hover:underline  text-start"
              >
                Track & Manage Orders
              </button>
            </div>
            <img
              src="assets/images/sucess.png"
              alt="Order Success"
              loading="lazy"
              className="w-28 h-28 object-contain"
            />
          </div>

          {/* Desktop delivery date */}
          <div className="hidden sm:block border-b border-b-gray-200 py-3">
            <span className="text-lg font-semibold text-gray-800">
              Delivery by {formattedDate}
            </span>
          </div>

          {/* Continue Shopping */}
          <button className="w-full mt-4 bg-[#2f415d] hover:bg-[#24334a] text-white font-semibold py-2 rounded-md transition" onClick={() => router.push('/')}>
            Continue Shopping
          </button>

          {/* Tracking Info */}
          <p className="text-sm text-gray-600 mt-3">
            We have shared the order tracking with <span className="font-medium underline text-[#e96f84]">{isMount && loginData?.Mobile}</span> used in the address. Tracking link is shared via SMS.
          </p>
        </div>

        {/* Right Section */}
        <div className="sm:w-[25vw] bg-white rounded-lg shadow-lg p-6">
          <div className="flex gap-3 items-center">
            <BsFillBoxSeamFill className="text-5xl text-[#2f415d]" />
            <div>
              <h3 className="font-semibold text-sm tracking-wide">
                Why Call? Just Click
              </h3>
              <button
                className="bg-[#2f425d] hover:bg-[#24334a] text-white text-xs px-3 py-1 mt-1 rounded transition"
                type="submit"
                onClick={() => router.push('/accounts/orders')}
              >
                Go to my Orders
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold">Customer Name</span>
              {/* <button className="text-xs font-medium text-[#2f415d] hover:underline">
                Change
              </button> */}
            </div>
            <p className="text-sm w-[14vw] text-gray-700">
              {
                isMount && (<>
                  {current_address.HNo}, {current_address.locality}, {current_address.City},
                  {current_address.State} - {current_address.Pincode}
                </>)
              }
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <span className="font-semibold">Phone Number</span>
              <span>{isMount && loginData?.Mobile}</span>
            </div>
            {/* <button className="text-xs font-semibold text-[#e96f84] hover:underline">
              Change or add Number
            </button> */}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modelState.type === "Send" && (
        <div
          onClick={() => setModelState({ type: null })}
          className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center"
        >
          <div
            className="bg-white rounded-lg shadow-lg w-80 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg text-gray-800">Send Order Details to</h3>
            <p className="text-sm text-gray-500 mt-1">
              The recipient will be able to track the items in this order.
            </p>
            <div className="flex items-center border rounded-md px-3 py-2 mt-4">
              <span className="font-semibold text-sm">+91</span>
              <input
                type="number"
                className="ml-2 outline-none text-sm flex-1"
                placeholder="Enter phone number"
              />
            </div>
            <button
              className="bg-[#2f425d] hover:bg-[#24334a] text-white font-medium w-full py-2 mt-4 rounded-md transition"
              type="submit"
            >
              Send Order Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSucess;
