import React from "react";

const SingleProductCardLoader = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-gray-200"></div>

      {/* Info Section */}
      <div className="p-3 space-y-2">
        {/* Sponsored */}
        <div className="h-3 w-20 bg-gray-200 rounded"></div>

        {/* Title */}
        <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>

        {/* Price */}
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-gray-300 rounded"></div>
          <div className="h-3 w-10 bg-gray-200 rounded"></div>
        </div>

        {/* Ratings */}
        <div className="flex gap-2 items-center">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-300 rounded-full"></div>
            ))}
          </div>
          <div className="h-3 w-6 bg-gray-200 rounded"></div>
        </div>

        {/* Colors and Stock */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-gray-300 border border-gray-200"
              ></div>
            ))}
          </div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductCardLoader;
