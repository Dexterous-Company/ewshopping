"use client";
import { Box, Skeleton } from "@mui/material";

export default function OrdersSkeleton() {
  return (
    <div className="px-4 py-6 w-full min-h-[70vh] max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="text" width={150} height={40} />
        </div>
        <div className="w-full md:w-1/3">
          <Skeleton variant="rounded" height={40} />
        </div>
      </div>

      {/* Filters Section Skeleton */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <Skeleton variant="text" width={120} height={30} />
          <div className="flex gap-2">
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={100} height={32} />
          </div>
        </div>
        
        {/* Filter Options Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={40} />
        </div>
      </div>

      {/* Results Info Skeleton */}
      <div className="mb-4">
        <Skeleton variant="text" width={200} height={20} />
      </div>

      {/* Order List Skeletons */}
      <div className="space-y-4 mb-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 border">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Product Image */}
              <Skeleton variant="rounded" width={80} height={80} />
              
              {/* Order Details */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton variant="text" width={120} height={25} />
                  <Skeleton variant="text" width={80} height={25} />
                </div>
                
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="60%" height={20} />
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Skeleton variant="rounded" width={100} height={24} />
                  <Skeleton variant="rounded" width={80} height={24} />
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Skeleton variant="text" width={100} height={20} />
                  <div className="flex gap-2">
                    <Skeleton variant="rounded" width={80} height={32} />
                    <Skeleton variant="rounded" width={100} height={32} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center mt-8">
        <Skeleton variant="rounded" width={300} height={32} />
      </div>
    </div>
  );
}