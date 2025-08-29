import React from "react";
import Lottie from "lottie-react";
import animationData from "../../main_pages/animation/NoProducts.json";
import { useRouter } from "next/navigation";

function Noproducts() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center  bg-gradient-to-br from-white via-[#FE677E0D] to-[#2F415D0D] 
    px-4 text-center mb-15 sm:mb-0 ">
      {/* Animation (slightly larger with soft bounce) */}
      <div className="w-60 h-60 sm:w-80 sm:h-80 animate-bounce-slow">
        <Lottie animationData={animationData} loop={true} />
      </div>

      {/* Title */}
      <h2 className="text-2xl sm:text-4xl font-extrabold mt-2 bg-clip-text text-transparent  bg-[#2F415D]">
        No Products Found
      </h2>
      {/* Subtitle */}
      <p className="text-gray-700 mt-3 max-w-md leading-relaxed text-base sm:text-lg">
        Oops! Looks like there are no products available right now.
        {/* Please try again later or explore other categories. */}
        Try adjusting your search or filter criteria
      </p>
      {/* Buttons */}
      <div className="flex flex-row gap-4 mt-6">
        {/* Go Back - Accent color */}
        <button
          onClick={() => router.back()}
          className="px-6 py-2 rounded-lg bg-[#FE677E] text-white font-medium shadow-md hover:bg-[#e2556b] hover:scale-105 transition-all duration-300"
        >
          Go Back
        </button>
        {/* Shop Now - Primary color */}
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 rounded-lg bg-[#2F415D] text-white font-medium shadow-md hover:bg-[#1d2a3f] hover:scale-105 transition-all duration-300"
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}

export default Noproducts;
