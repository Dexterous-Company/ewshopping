"use client";
import React, { useRef } from "react";
import Image from "next/image";

// Unified Product Card Component for all devices
const ProductCard = ({ product }) => {
  const discount = Math.round(
    ((product.mrpRange - product.priceRange) / product.mrpRange) * 100
  );

  const handleProductClick = () => {
    window.location.href = `/product/${product.slugUrl}`;
  };

  return (
    <div
      className="min-w-[120px] md:w-[160px]  flex flex-col cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Product Card Container */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:scale-[1.02] transition-all duration-300 hover:shadow-xl">
        {/* Product Image with Flip Effect */}
        <div className="aspect-square overflow-hidden relative bg-white rounded-t-lg group">
          {/* Flip Container */}
          <div className="relative w-full h-full transition-transform duration-700 group-hover:rotate-y-180 transform-style-preserve-3d">
            {/* Front Image */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <Image
                src={product.thumbnail[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 120px, 160px"
                
                decoding="async"
                className="w-full h-full  object-contain"
                priority
                fetchPriority="high"
              />
            </div>

            {/* Back Image (second thumbnail or same image with different effect) */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gray-100">
              <Image
                src={product.thumbnail[1] || product.thumbnail[0]}
                alt={`${product.name} - Back view`}
                className="w-full h-full  object-contain"
                fill
                sizes="(max-width: 768px) 120px, 160px"
                
                decoding="async"
                priority
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Price Overlay on Image */}
          <div className="absolute bottom-0 left-0 w-full z-10">
            <div className="bg-cyan-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 w-full justify-center py-0.5">
                  <span className="text-xs font-bold text-gray-900">
                    ₹{product.priceRange?.toLocaleString()}
                  </span>
                  <span className="text-[0.6rem] text-gray-700 line-through">
                    ₹{product.mrpRange?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-1 right-1 z-10">
              <span className="inline-block bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
                {discount}% OFF
              </span>
            </div>
          )}

          {/* Flip Indicator */}
          <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/50 text-white rounded-full p-1 backdrop-blur-sm">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Product Details Below Image */}
        <div className="bg-indigo-900 rounded-b-lg">
          {/* Product Name */}
          <div className="flex items-start justify-between">
            <h3 className="text-xs font-bold text-white line-clamp-1 flex-1 py-1 overflow-hidden whitespace-nowrap text-ellipsis px-1">
              {product.name}
            </h3>
          </div>

          {/* Product Description */}
          <div className="">
            <p className="text-white/80 text-[0.6rem] line-clamp-1 pb-1 px-1">
              {product.shortDescription?.slice(0, 25) ||
                product.subtitle ||
                "Premium iPhone"}
            </p>
          </div>
        </div>
      </div>

      {/* CSS for 3D flip effect */}
      <style jsx>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .group:hover .group-hover\\:rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

// Loading Skeleton with Flip Effect
const ProductGridSkeleton = () => {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="min-w-[140px] flex flex-col">
          <div className="bg-white/20 rounded-lg aspect-square mb-1 animate-pulse relative transform-style-preserve-3d"></div>
          <div className="bg-white/20 rounded-lg animate-pulse h-12"></div>
        </div>
      ))}
    </div>
  );
};

// Horizontal Scroll Product List for all devices
const ProductScroll = ({ products, loading }) => {
  const scrollContainerRef = useRef(null);

  if (loading) return <ProductGridSkeleton />;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-white">No products found</p>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto w-full scrollbar-hide"
      ref={scrollContainerRef}
    >
      <div className="flex gap-2">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Main Component - Updated to accept props
const MobileAccessoriesIOSPhones = ({
  products,
  loading,
  error,
  bgGradient,
}) => {
  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="w-full relative">
      {/* UNIFIED DESIGN FOR ALL DEVICES */}
      <div
        className={`relative w-full rounded-lg ${bgGradient} p-2 shadow-sm overflow-hidden`}
      >
        {/* Animated top border light */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-pulse"></div>

        {/* Header Section */}
        <div className="relative z-10">
          <div className="text-left">
            <div className="flex items-center gap-1 mb-1">
              <h3 className="text-base font-bold text-white">
                Trending Products
              </h3>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-white to-gray-200 rounded-lg"></div>

        {/* Products */}
        <div className="relative">
          <ProductScroll products={products} loading={loading} />
        </div>

        {/* Bottom decorative border */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-pulse"></div>
      </div>

      {/* Global CSS for flip effects */}
      <style jsx global>{`
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .group:hover .group-hover\\:rotate-y-180 {
          transform: rotateY(180deg);
        }

        /* Mobile touch support */
        @media (max-width: 640px) {
          .group:active .group-hover\\:rotate-y-180 {
            transform: rotateY(180deg);
          }
        }
      `}</style>
    </section>
  );
};

export default MobileAccessoriesIOSPhones;
