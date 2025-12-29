"use client";
import React from "react";

const BannerGridSkeleton = () => {
  const skeletonItems = Array.from({ length: 3 });

  return (
    <div
      className="relative px-2 overflow-x-auto overflow-y-hidden"
      aria-hidden="true"
    >
      <div className="flex flex-row gap-3 sm:gap-4 whitespace-nowrap">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="
              relative flex-shrink-0 aspect-[2/1] rounded-md overflow-hidden
              min-w-[calc(50vw-20px)]   /* mobile */
              sm:min-w-[180px]
              md:min-w-[230px]
              lg:min-w-[260px]
              xl:min-w-[400px]
              bg-gray-200 animate-pulse
            "
          >
            {/* image skeleton */}
            <div className="absolute inset-0 bg-gray-300" />

            {/* text overlay skeleton */}
            <div className="absolute inset-0 flex flex-col justify-center p-2 sm:p-4">
              <div className="h-4 sm:h-5 md:h-7 w-3/4 bg-gray-400 rounded mb-2" />
              <div className="h-3 sm:h-4 w-1/2 bg-gray-400 rounded mb-3" />
              <div className="h-8 w-24 bg-gray-400 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerGridSkeleton;
