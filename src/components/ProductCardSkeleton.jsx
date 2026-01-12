"use client";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-md border border-gray-200 overflow-hidden animate-pulse">
      {/* IMAGE */}
      <div className="h-[200px] bg-gray-200 w-full" />

      {/* CONTENT */}
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-300 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
