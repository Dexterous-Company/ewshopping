import React from "react";

const SortFilterLoader = () => {
  return (
    <div className="text-sm text-gray-800 mb-4 animate-pulse">
      {/* Showing text skeleton */}
      <div className="h-4 w-1/2 bg-gray-300 rounded mb-2" />

      {/* Sort by row */}
      <div className="flex items-center gap-4">
        <div className="h-4 w-16 bg-gray-300 rounded" />

        <div className="flex gap-4 text-sm">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="h-4 w-24 bg-gray-300 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortFilterLoader;
