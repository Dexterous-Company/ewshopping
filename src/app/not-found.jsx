

"use client";
import Lottie from "lottie-react";
import animationData from "../main_pages/animation/Lonely404.json";
import { useEffect, useRef } from "react";

export default function NotFound() {
  const lottieRef = useRef();
  useEffect(() => {
    lottieRef.current.setSpeed(0.5);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center  text-center px-4 pb-4">
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop
        autoplay
        style={{ width: "250px", height: "250px" }}
      />
      <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
        404
      </h1>
      <p className="text-lg mb-6">Oops! The page you’re looking for doesn’t exist.</p>

      <a
        href="/"
        className="relative px-6 py-3 rounded-xl font-extrabold text-lg text-[#212121] bg-[#e8e8e8] shadow-[4px_8px_19px_-3px_rgba(0,0,0,0.27)] overflow-hidden transition-all duration-250 group"
      >
        <span className="relative z-10 transition-colors duration-250 group-hover:text-white">
          Go Home
        </span>
        <span className="absolute top-0 left-0 h-full w-0 rounded-xl bg-[#212121] shadow-[4px_8px_19px_-3px_rgba(0,0,0,0.27)] transition-all duration-250 group-hover:w-full"></span>
      </a>
    </div>
  );
}
