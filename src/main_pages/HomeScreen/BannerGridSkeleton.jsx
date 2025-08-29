"use client";

import React from "react";
import "./HoverCss.css";

const BannerGridSkeleton = () => {
  // Create 3 skeleton items (or however many you typically display)
  const skeletonItems = Array.from({ length: 3 }, (_, index) => index);

  return (
    <div className="py-2 px-2">
      <div className="hidden md:block">
        <div className="flex flex-row overflow-x-auto w-full space-x-4 scrollbar-hide">
          {skeletonItems.map((item) => (
            <div
              key={`skeleton-${item}`}
              className="relative min-w-[400px] aspect-[2/1] group flex-shrink-0"
            >
              <div className="block size-full">
                {/* Image skeleton */}
                <div className="w-full h-full bg-gray-200 rounded-md animate-pulse object-cover"></div>

                {/* Content skeleton */}
                <div className="absolute inset-0 flex flex-col items-start justify-center p-6 text-left z-10">
                  {/* Main title skeleton */}
                  <div className="h-8 bg-gray-300 rounded mb-2 w-3/4 animate-pulse"></div>
                  
                  {/* Subtitle skeleton */}
                  <div className="h-4 bg-gray-300 rounded mb-4 w-1/2 animate-pulse"></div>
                  
                  {/* Button skeleton */}
                  <div className="h-10 bg-gray-300 rounded-md w-24 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerGridSkeleton;