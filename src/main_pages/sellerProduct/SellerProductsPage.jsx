"use client";
import { fetchShopProducts } from "@/redux/sellerProduct/SellerProductSlice";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SingleSellerProductCard from "./SingleSellerProductCard";
import SellerBrands from "./SellerBrands";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaStore,
  FaCheckCircle,
  FaStar,
  FaRegStar,
} from "react-icons/fa";

// Simple Skeleton component
const Skeleton = ({ className }) => {
  return (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`}></div>
  );
};

const SellerProductsPage = ({ sellerName }) => {
  const dispatch = useDispatch();
  const {
    products,
    shopDetails,
    loading,
    error,
    totalProducts,
    page: currentPage,
    hasMore,
  } = useSelector((state) => state.shopProducts);
  const [imageError, setImageError] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // Initial data fetch
  useEffect(() => {
    if (sellerName) {
      dispatch(
        fetchShopProducts({
          shopName: sellerName,
          page: 1,
          limit: 50,
          append: false,
        })
      );
    }
  }, [sellerName, dispatch]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || isFetchingMore || !hasMore) return;

    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      setIsFetchingMore(true);
      const nextPage = currentPage + 1;
      dispatch(
        fetchShopProducts({
          shopName: sellerName,
          page: nextPage,
          limit: 50,
          append: true,
        })
      ).finally(() => {
        setIsFetchingMore(false);
      });
    }
  }, [isFetchingMore, hasMore, loading, currentPage, sellerName, dispatch]);
  const router = useRouter();
  // Add scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (loading && currentPage === 1)
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          {/* Shop Header Skeleton */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton className="w-28 h-28 rounded-full" />
              <div className="text-center md:text-left space-y-3 flex-1">
                <Skeleton className="h-9 w-72 mx-auto md:mx-0" />
                <Skeleton className="h-5 w-56 mx-auto md:mx-0" />
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  <Skeleton className="h-7 w-28" />
                  <Skeleton className="h-7 w-36" />
                </div>
              </div>
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-60 mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform hover:shadow-md"
                >
                  <Skeleton className="h-52 w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  if (error && currentPage === 1)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-5 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Error Loading Products
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() =>
              dispatch(
                fetchShopProducts({
                  shopName: sellerName,
                  page: 1,
                  limit: 50,
                  append: false,
                })
              )
            }
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  // Calculate average rating if available
  const averageRating =
    products && products.length > 0
      ? (
          products.reduce((sum, product) => sum + (product.ratings || 0), 0) /
          products.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Shop Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-blue-50 to-transparent opacity-50 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-r from-purple-50 to-transparent opacity-50 rounded-tr-full"></div>

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="relative">
              <div className="relative w-28 h-28 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white">
                {shopDetails?.shopImage && !imageError ? (
                  <Image
                    src={shopDetails.shopImage}
                    alt={shopDetails.shopName}
                    width={112}
                    height={112}
                    className="object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-600">
                      {shopDetails?.shopName?.charAt(0) || "S"}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <FaCheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {/* &nbsp;{isNaN(shopDetails?.shopName) ? shopDetails?.shopName : "Ewshopping"} */}
                {shopDetails?.shopName &&
                typeof shopDetails.shopName === "string"
                  ? shopDetails.shopName
                  : "Ewshopping"}
              </h1>
              {/* {shopDetails?.shopAddress && (
                <div className="flex items-center justify-center md:justify-start text-gray-600 mb-3">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <span className="text-sm">{shopDetails.shopAddress}</span>
                </div>
              )} */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                <div className="flex items-center bg-green-50 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full shadow-sm">
                  <FaCheckCircle className="mr-1.5 text-green-600" />
                  {shopDetails?.ShopStatusText || "Verified Seller"}
                </div>

                <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full shadow-sm">
                  <FaStore className="mr-1.5 text-gray-500" />
                  <span>{totalProducts || 0} products</span>
                </div>

                {averageRating && (
                  <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full shadow-sm">
                    <FaStar className="mr-1.5" />
                    <span>{averageRating} avg rating</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Brands Section */}
        {shopDetails?.brands && shopDetails.brands.length > 0 && (
          <SellerBrands brandData={shopDetails.brands} />
        )}

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Shop Products
              </h2>
              <p className="text-gray-600">
                Browse our collection of {totalProducts || 0} quality items
                {products &&
                  products.length < totalProducts &&
                  ` (showing ${products.length})`}
              </p>
            </div>

            {/* {products && products.length > 0 && (
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                <select className="text-sm border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                  <option>Most Popular</option>
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            )} */}
          </div>

          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {products.map((product) => (
                  <SingleSellerProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>

              {/* Loading indicator for infinite scroll */}
              {(isFetchingMore || loading) && (
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <Skeleton className="h-52 w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-5 w-14 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No more products message */}
              {!hasMore && products.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  You've reached the end of the products list
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
              <div className="w-24 h-24 mx-auto mb-5 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                This shop doesn't have any products listed yet. Check back later
                for new arrivals.
              </p>
              <button
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => router.push("/")}
              >
                Follow Shop to Get Updates
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProductsPage;
