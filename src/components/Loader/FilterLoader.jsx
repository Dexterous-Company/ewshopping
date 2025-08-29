import React from "react";

const FilterLoader = () => {
  return (
    <div className="space-y-6 animate-pulse px-4 py-2">
      {/* Filter Title Skeleton */}
      <div className="h-5 bg-gray-200 rounded w-1/3" />

      {/* Active Filters Skeleton (horizontal pills) */}
      <div className="flex flex-wrap gap-2">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="h-6 w-20 bg-gray-200 rounded-full" />
        ))}
      </div>

      {/* Category Title */}
      <div className="h-4 bg-gray-200 rounded w-24 mt-4" />

      {/* Category Items */}
      <div className="space-y-2">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="h-4 w-3/4 bg-gray-200 rounded" />
        ))}
      </div>

      {/* Brand Title */}
      <div className="h-4 bg-gray-200 rounded w-20 mt-6" />

      {/* Brand Items */}
      <div className="space-y-2">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Size Title */}
      <div className="h-4 bg-gray-200 rounded w-16 mt-6" />

      {/* Size Pills */}
      <div className="flex flex-wrap gap-2">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="h-6 w-10 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export default FilterLoader;
