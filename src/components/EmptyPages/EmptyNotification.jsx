"use client";
import Lottie from "lottie-react";
import React, { useEffect, useRef } from "react";
import animationData from "../../main_pages/animation/Alert Notification Character.json";

const EmptyNotification = () => {
  const lottieRef = useRef();
  useEffect(() => {
    lottieRef.current.setSpeed(0.5); // Adjust speed (1 = normal, 2 = 2x)
  }, []);
  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-10 mb-10  bg-white">
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop
          autoplay
          style={{ width: "300px", height: "300px" }}
          className="flex items-center justify-center"
        />
        <h1 className="text-xl font-semibold text-gray-800">All caught up!</h1>
        <p className="text-gray-500 text-sm mt-1">
          There are no new notifications for you.
        </p>
      </div>
    </div>
  );
};

export default EmptyNotification;
