"use client";
import React from "react";

const LoadingSpinner = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-3 gap-3 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-2 bg-gray-200 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;