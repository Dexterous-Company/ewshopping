"use client";
import React from "react";

const ProductTagsSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Category Skeleton */}
      <div className="relative sm:py-8 py-2 px-4">
        <div className="flex justify-between mb-4">
          <div className="h-8 w-32 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <div className="flex overflow-x-auto gap-4 no-scrollbar px-0">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="min-w-[150px] sm:min-w-[200px] bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-[150px] md:h-[230px] bg-gray-300"></div>
              <div className="p-3 text-center">
                <div className="h-5 bg-gray-300 rounded mb-2 mx-auto w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded mx-auto w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Brands Skeleton */}
      <div className="px-5 py-6">
        <div className="h-8 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="flex overflow-x-auto gap-4 no-scrollbar">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="min-w-[80px] h-[80px] bg-gray-200 rounded-full flex-shrink-0"></div>
          ))}
        </div>
      </div>
      
      {/* Offers Products Skeleton */}
      <div className="px-5 py-4">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative aspect-square bg-gray-200"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="flex items-center gap-2">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductTagsSkeleton;