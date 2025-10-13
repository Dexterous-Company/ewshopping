"use client";
import React, { useRef } from "react";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Mobile Product Card Component - Updated to match Design 1 style
const MobileProductCard = ({ product }) => {
  const discount = Math.round(
    ((product.mrpRange - product.priceRange) / product.mrpRange) * 100
  );

  const handleProductClick = () => {
    window.location.href = `/product/${product.slugUrl}`;
  };

  return (
    <div 
      className="min-w-[140px] flex flex-col cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Product Card Container */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/30 mb-3 hover:scale-[1.02] transition-transform duration-300">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden relative bg-white rounded-t-2xl">
          <img
            src={product.thumbnail[0]}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-block bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                {discount}% OFF
              </span>
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="sm:p-3 sm:text-center">
          {/* Price Section */}
          <div className="flex sm:items-center sm:justify-center sm:gap-2 mb-2">
            <img
              src="https://ewshoppingsellerapinew.dexterous.in/uploads/1759926575679.webp"
              className="h-5 w-5 object-contain -rotate-20 sm:block hidden"
              alt="icon"
            />
            <div className="flex flex-col sm:items-center w-full">
              <span className="text-lg font-bold sm:text-white text-black w-full sm:bg-none bg-white">
                ₹{product.priceRange?.toLocaleString()}
              </span>
              <span className="text-xs text-white/80 line-through sm:block hidden">
                ₹{product.mrpRange?.toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* Product Name */}
          <h3 className="font-semibold text-sm text-white line-clamp-1 sm:line-clamp-2 overflow-hidden mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-white/80 line-clamp-1 sm:block hidden ">
            {product.shortDescription || product.subtitle || "Premium iPhone"}
          </p>
        </div>
      </div>
    </div>
  );
};

// Desktop Product Card Component (unchanged)
const ProductCard = ({ product }) => {
  const discount = Math.round(
    ((product.mrpRange - product.priceRange) / product.mrpRange) * 100
  );

  const handleProductClick = () => {
    window.location.href = `/product/${product.slugUrl}`;
  };

  return (
    <div
      className="min-w-[110px] sm:min-w-[180px] md:min-w-[220px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative cursor-pointer border border-gray-100"
      onClick={handleProductClick}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-1 right-1 z-10">
          <span className="inline-block bg-[#2eab2c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {discount}% OFF
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.thumbnail[0]}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details */}
      <div className="p-2 space-y-1">
        <h3 className="font-medium text-left text-xs line-clamp-2 overflow-hidden h-8 sm:text-[15px] sm:line-clamp-1 sm:h-auto">
          {product.name}
        </h3>
        <p className="text-[10px] text-left text-gray-500 line-clamp-1 mb-1 sm:text-xs">
          {product.shortDescription || product.subtitle}
        </p>

        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-left relative">
            <img
              src="https://ewshoppingsellerapinew.dexterous.in/uploads/1759926575679.webp"
              className="h-4 w-4 object-contain -rotate-20 absolute"
              alt="icon"
            />
            <div className="flex flex-col pl-5 text-left">
              <span className="text-sm font-bold text-blue-900 sm:text-md">
                ₹{product.priceRange?.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 line-through sm:text-xs">
                ₹{product.mrpRange?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const SortFilterLoader = ({ className }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const ProductGridSkeleton = () => (
  <div className="py-2">
    <div className="space-y-2 mb-4 px-2">
      <SortFilterLoader className="h-6 w-40 sm:w-56 md:w-64" />
      <SortFilterLoader className="h-4 w-32 sm:w-40 md:w-48" />
    </div>
    <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="min-w-[110px] sm:min-w-[180px] md:min-w-[220px] bg-white rounded-lg shadow-sm space-y-2 p-2"
        >
          <SortFilterLoader className="h-32 w-full rounded-lg sm:h-48" />
          <SortFilterLoader className="h-3 w-3/4 sm:h-4" />
          <SortFilterLoader className="h-2 w-1/2 sm:h-3" />
          <SortFilterLoader className="h-3 w-full sm:h-4" />
        </div>
      ))}
    </div>
  </div>
);

// Mobile Loading Skeleton - Updated style
const MobileProductGridSkeleton = () => (
  <div className="flex gap-4 overflow-x-auto scrollbar-hide px-2">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="min-w-[140px] flex flex-col">
        <div className="bg-white/20 rounded-2xl aspect-square mb-3 animate-pulse"></div>
        <div className="bg-white/20 rounded-lg p-3 animate-pulse h-20"></div>
      </div>
    ))}
  </div>
);

// Horizontal Scroll Product List for Desktop
const ProductScroll = ({ products, loading }) => {
  const scrollContainerRef = useRef(null);

  if (loading) return <ProductGridSkeleton />;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto pb-2 w-full scrollbar-hide"
      ref={scrollContainerRef}
    >
      <div className="flex gap-3 px-2 sm:gap-4 sm:px-1">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Mobile Horizontal Scroll Product List - Updated
const MobileProductScroll = ({ products, loading }) => {
  const scrollContainerRef = useRef(null);

  if (loading) return <MobileProductGridSkeleton />;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white">No products found</p>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto pb-2 w-full scrollbar-hide"
      ref={scrollContainerRef}
    >
      <div className="flex gap-4 px-2">
        {products.map((product) => (
          <MobileProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Main Component - Updated Mobile Version to match Design 1
const MobileAccessoriesIOSPhones = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${Baseurl}/api/v1/product/getEventProduct/mobile-accessories-ios-phones`
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        if (data.success) setProducts(data.product);
        else throw new Error("API returned unsuccessful response");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="sm:py-5 w-full relative">
      {/* MOBILE VERSION - UPDATED TO MATCH DESIGN 1 STYLE */}
      <div className="sm:hidden relative w-full rounded-2xl bg-gradient-to-b from-red-600 to-red-800 p-4 shadow-lg overflow-hidden mx-auto my-4">
        {/* Animated top border light - Like Design 1 */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-300 animate-pulse"></div>

        {/* Header Section - Like Design 1 */}
              
            <div className="absolute sm:left-35 sm:top-7 top-3 left-36 z-10">
            <div className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 text-blue-900 animate-pulse md:px-2 md:py-1 px-1 py-0.5 lg:px-3 lg:py-2 rounded-r-full shadow-lg transform -skew-x-3 border-l-4 border-yellow-200">
              <span className="text-[13px] font-semibold whitespace-nowrap flex items-center animate-pulse">
                ⚡ MAHA MEGA SALE ⚡
              </span>
            </div>
          </div>
        

        

        {/* Section Title */}
        <div className="text-left mb-3">
          <h3 className="text-xl font-bold text-left text-white">iOS Phones</h3>
          <p className="text-white/80 text-sm">Premium iPhone Collection</p>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-white to-gray-200 rounded-2xl"></div>
        
        {/* Products */}
        <div className="relative z-10">
          <MobileProductScroll products={products} loading={loading} />
        </div>
      </div>

      {/* DESKTOP VERSION - UNCHANGED */}
      <div className="hidden sm:block">
        <div>
          <div className="text-left pt-2 sm:pb-1 pd-3 flex gap-2 px-2">
            <h2 className="text-left text-blue-950 font-semibold text-[0.875rem] sm:text-base md:text-xl space-y-1 flex sm:items-center">
              iOS Phones
            </h2>
          </div>
          <p className="sm:text-sm text-[9px] -mt-1 text-left italic text-cyan-500 px-2">
            Top iPhone Brands
          </p>
          <div className="absolute sm:left-35 sm:top-7 top-3 left-25 z-10">
            <div className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 text-blue-900 animate-pulse md:px-2 md:py-1 px-1 py-0.5 lg:px-3 lg:py-2 rounded-r-full shadow-lg transform -skew-x-3 border-l-4 border-yellow-200">
              <span className="text-[13px] font-semibold whitespace-nowrap flex items-center animate-pulse">
                ⚡ MAHA MEGA SALE ⚡
              </span>
            </div>
          </div>
        </div>
        <ProductScroll products={products} loading={loading} />
      </div>
    </section>
  );
};

export default MobileAccessoriesIOSPhones;