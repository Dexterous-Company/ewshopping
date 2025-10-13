import React from "react";
import Lottie from "lottie-react";
import animationData from "../../main_pages/animation/couponempty.json";

function EmptyCoupon() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      {/* Simple Clean Card */}
      <div className="flex flex-col items-center justify-center text-center bg-white rounded-2xl p-8 w-full max-w-sm relative overflow-hidden min-h-[450px]">
        
        {/* Lottie Animation Container */}
        <div className="mb-6 relative z-10 flex-1 flex items-center justify-center">
          <div className="relative">
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: 160, height: 160 }}
              className="filter drop-shadow-md"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            No Coupons Available
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 px-2">
            Check back later for new offers and discounts
          </p>
          
          {/* Clean CTA Button */}
          <button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:from-[#764ba2] hover:to-[#667eea] transition-all duration-300 text-white font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmptyCoupon;