"use client";
import Link from "next/link";
import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import animationData from "../../main_pages/animation/Shopping cart.json";

const EmptyCart = () => {

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-lg  max-w-md w-full text-center flex flex-col items-center justify-center ">
        <Lottie
          animationData={animationData}
          loop
          autoplay
          speed={1}
          style={{ width: "300px", height: "300px" }}

          className="flex items-center justify-center"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-1">Your cart is empty!</h2>
        <p className="text-gray-600 mb-6">Add items to it now.</p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-10 sm:px-8 py-2 border border-transparent rounded-sm shadow-sm text-base font-medium text-white bg-[#e96f84] hover:bg-[#2f415d] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Shop Now
        </Link>

        <div className="mt-4">
          <Link href="/" className="text-indigo-600 hover:text-indigo-500 font-medium">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
