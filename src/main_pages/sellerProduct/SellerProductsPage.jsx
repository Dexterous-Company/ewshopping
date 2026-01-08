"use client";
import { fetchShopProducts } from "../../redux/sellerProduct/SellerProductSlice";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SingleSellerProductCard from "./SingleSellerProductCard";
import SellerBrands from "./SellerBrands";
import Image from "next/image";
import {
  FaCheckCircle,
  FaStore,
  FaStar,
  FaShippingFast,
  FaGift,
  FaFire,
  FaShareAlt,
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        {/* Shop Header with Diwali Theme */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-2xl shadow-2xl p-8 mb-8 border border-amber-300 overflow-hidden relative">
          {/* Diwali Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-l from-yellow-200/30 to-transparent opacity-60 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-r from-red-200/30 to-transparent opacity-60 rounded-tr-full"></div>

          {/* Diwali Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSIjRkY2QjAwIiBvcGFjaXR5PSIwLjIiLz48L3N2Zz4=')]"></div>

          {/* Floating Diya Elements */}
          <div className="absolute top-4 left-8 w-3 h-4 bg-gradient-to-b from-yellow-200 to-amber-400 rounded-full opacity-80 animate-bounce">
            <div className="absolute -top-1 left-0.5 w-2 h-2 bg-yellow-300 rounded-full blur-sm"></div>
          </div>
          <div className="absolute bottom-6 right-10 w-3 h-4 bg-gradient-to-b from-yellow-200 to-amber-400 rounded-full opacity-80 animate-bounce delay-300">
            <div className="absolute -top-1 left-0.5 w-2 h-2 bg-yellow-300 rounded-full blur-sm"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Shop Avatar with Diwali Theme */}
            <div className="relative">
              <div className="relative w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-yellow-200 transform hover:scale-105 transition-transform duration-300">
                {shopDetails?.shopImage && !imageError ? (
                  <Image
                    src={shopDetails.shopImage}
                    alt={shopDetails.shopName}
                    width={128}
                    height={128}
                    className="object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white drop-shadow-lg">
                      {shopDetails?.shopName?.charAt(0)?.toUpperCase() || "S"}
                    </span>
                  </div>
                )}

                {/* Diwali Border Effect */}
                <div className="absolute inset-0 rounded-full border-2 border-yellow-300/50 animate-pulse"></div>
              </div>

              {/* Verified Badge with Diwali Colors */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full border-2 border-yellow-200 flex items-center justify-center shadow-lg">
                <FaCheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Shop Information */}
            <div className="text-center md:text-left flex-1">
              {/* Shop Name with Diwali Theme */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                {shopDetails?.shopName &&
                typeof shopDetails.shopName === "string"
                  ? shopDetails.shopName
                  : "Ewshopping"}
              </h1>

              {/* Stats Cards with Diwali Colors */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                {/* Verified Seller */}
                <div className="flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border border-white/30">
                  <FaCheckCircle className="mr-2 text-yellow-300" />
                  {shopDetails?.ShopStatusText || "Verified Seller"}
                </div>

                {/* Products Count */}
                <div className="flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border border-white/30">
                  <FaStore className="mr-2 text-yellow-300" />
                  <span>{totalProducts || 0} Products</span>
                </div>

                {/* Average Rating */}
                {averageRating && (
                  <div className="flex items-center bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border border-white/30">
                    <FaStar className="mr-2 text-yellow-300" />
                    <span>{averageRating} Avg Rating</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* <button className="bg-white text-amber-700 hover:bg-yellow-50 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center border-2 border-yellow-300">
            <FaStore className="mr-2" />
            Shop Now
          </button>
           */}
              {/* <button className="bg-amber-600/80 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-md transition-all duration-300 flex items-center justify-center border border-amber-400">
            <FaShareAlt className="mr-2" />
            Share Offers
          </button> */}
            </div>
          </div>

          {/* Bottom Sparkle Effect */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60 blur-sm"></div>
        </div>

        {/* Rest of your existing code remains the same */}
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
