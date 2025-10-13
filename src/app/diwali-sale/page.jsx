"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Your existing SingleProductCard component
const SingleProductCard = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(
    product.thumbnail?.[0] || product.images?.default
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageSrc("https://via.placeholder.com/300");
  };

  const getLabelColor = (label) => {
    switch (label) {
      case "NEW":
        return "bg-green-600";
      case "SALE":
        return "bg-orange-500";
      case "Best seller":
        return "bg-red-600";
      default:
        return "bg-[#e96f84]";
    }
  };

  const calculateDiscount = () => {
    const currentPrice = product.priceRange || product.price;
    const originalPrice = product.mrpRange || product.oldPrice;

    if (!currentPrice || !originalPrice) return null;

    const discount = Math.round(
      ((originalPrice - currentPrice) / originalPrice) * 100
    );
    return discount > 0 ? discount : null;
  };

  const discount = calculateDiscount();

  const getTopTag = () => {
    if (product.label) {
      return {
        type: "label",
        content: product.label,
        className: `text-white text-xs px-2 py-1 font-semibold rounded ${getLabelColor(
          product.label
        )}`,
      };
    }

    if (product.HotProducts) {
      return {
        type: "hot",
        content: "🔥 Hot Products",
        className:
          "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-white text-xs px-2 py-1 font-semibold rounded shadow-md shadow-orange-300/30",
      };
    }

    if (product.Trending) {
      return {
        type: "trending",
        content: "⚡Trending",
        className:
          "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white text-xs px-2 py-1 font-semibold rounded shadow-md shadow-pink-400/30",
      };
    }

    if (product.Recommends) {
      return {
        type: "recommended",
        content: "⭐ Recommended",
        className:
          "bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 text-white text-xs px-2 py-1 font-semibold rounded shadow-md shadow-blue-300/30",
      };
    }

    if (product.sponsored) {
      return {
        type: "sponsored",
        content: "Sponsored",
        className:
          "text-xs text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-1 rounded border border-gray-300 shadow-sm",
      };
    }

    return null;
  };

  const topTag = getTopTag();

  return (
    <Link href={`/product/${product.slugUrl || product._id}`} passHref>
      <div
        className="bg-white rounded-lg relative overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl border border-orange-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs px-2 py-1 font-bold rounded-lg z-10 shadow-lg">
            {discount}% OFF
          </span>
        )}

        {/* Product Images with Hover Effect */}
        <div className="relative aspect-square">
          <div className="relative aspect-square group">
            <div className="group relative w-full h-full">
              <Image
                src={imageSrc}
                alt={product.name || product.title || "Product image"}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={handleImageError}
                priority={false}
              />
            </div>
          </div>
          
          {topTag && (
            <div className="absolute bottom-0 left-0 w-full z-20">
              <div
                className={`w-full text-center py-1 text-sm font-semibold text-white
                  ${topTag.className} transform transition-all duration-300
                  ${isHovered ? "scale-105" : "scale-100"}
                `}
              >
                {topTag.content}
              </div>
            </div>
          )}

          {/* Stock Progress Bar */}
          {product.sold !== undefined && product.available !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 px-3 py-2">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-600">
                  Sold: <span className="text-[#212121]">{product.sold}</span>
                </span>
                <span className="text-gray-600">
                  Available:{" "}
                  <span className="text-[#212121]">{product.available}</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  style={{
                    width: `${
                      (product.sold / (product.sold + product.available)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name || product.title}
          </h3>

          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {product.shortDescription || product.subtitle}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {discount === 50 && (
                <img
                  src="https://ewshoppingsellerapinew.dexterous.in/uploads/1759926575679.webp"
                  alt="icon"
                  className="h-6 w-6 object-contain mr-2"
                />
              )}
              <div>
                <span className="text-lg font-bold text-orange-600">
                  ₹{product.priceRange || product.price || "N/A"}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{product.mrpRange || product.mrp || "N/A"}
                </span>
              </div>
            </div>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform duration-200 shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Product Card Component for Horizontal Scroll
const ProductCard = ({ product }) => {
  const discount = Math.round(
    ((product.mrpRange - product.priceRange) / product.mrpRange) * 100
  );

  const handleProductClick = () => {
    window.location.href = `/product/${product.slugUrl}`;
  };

  return (
    <div
      className="min-w-[150px] sm:min-w-[180px] md:min-w-[220px] bg-white rounded-md shadow-xs overflow-hidden hover:shadow-lg transition-shadow duration-300 relative cursor-pointer"
      onClick={handleProductClick}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-block bg-[#2eab2c] text-white text-xs font-bold px-2 py-1 rounded-md ">
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
      <div className="p-2 space-y-0.5 relative ">
        <h3 className="font-medium text-left text-[9px] sm:text-[15px] line-clamp-1 overflow-hidden">
          {product.name}
        </h3>
        <p className="sm:text-xs text-[7px] text-left text-gray-500 line-clamp-1 mb-0.5">
          {product.shortDescription || product.subtitle}
        </p>

        {/* Price Section */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-left relative">
            {/* Image before price */}
            <img
              src="https://ewshoppingsellerapinew.dexterous.in/uploads/1759926575679.webp"
              className="h-5 w-5 object-contain -rotate-20 top-0 absolute "
              alt="icon"
            />
            <div className="flex flex-col pl-6  text-left">
              {/* Price */}
              <span className="text-md font-bold text-blue-900">
                ₹{product.priceRange?.toLocaleString()}
              </span>

              {/* MRP / Original Price */}
              <span className="text-xs text-gray-400 line-through">
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
    {/* Skeleton for heading and subtitle */}
    <div className="space-y-2 mb-4 px-2">
      <SortFilterLoader className="h-6 w-40 sm:w-56 md:w-64" /> {/* heading */}
      <SortFilterLoader className="h-4 w-32 sm:w-40 md:w-48" /> {/* subtitle */}
    </div>

    {/* Horizontal product skeletons */}
    <div className="flex gap-4 overflow-x-auto scrollbar-hide">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="min-w-[150px] sm:min-w-[180px] md:min-w-[220px] bg-white rounded-lg shadow-sm space-y-3 p-2"
        >
          {/* Image */}
          <SortFilterLoader className="h-48 w-full rounded-lg" />
          {/* Product name */}
          <SortFilterLoader className="h-4 w-3/4" />
          {/* Product subtitle */}
          <SortFilterLoader className="h-3 w-1/2" />
          {/* Price */}
          <SortFilterLoader className="h-4 w-full" />
        </div>
      ))}
    </div>
  </div>
);

// Horizontal Scroll Product List
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
      <div className="flex md:gap-0 px-1 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

// Mobile Accessories iOS Phones Component
const MobileAccessoriesIOSPhones = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Baseurl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
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
    <section className="sm:py-5 w-full relative bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl mx-4 my-8 p-6">
      <div>
        <div className="text-left pt-2 sm:pb-1 pd-3 flex gap-2 px-2">
          <h2 className="text-left text-blue-950 font-semibold text-[0.875rem] sm:text-base md:text-xl space-y-1 flex items-center">
            iOS Phones - Diwali Special Offers
          </h2>
        </div>
        <p className="sm:text-sm text-[9px] -mt-1 text-left italic text-cyan-500 px-2">
          Top iPhone Brands with Exclusive Diwali Discounts
        </p>        
      </div>
      <ProductScroll products={products} loading={loading} />
    </section>
  );
};

// Diwali Sale Page Component
const DiwaliSalePage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Sample products data
  const diwaliProducts = [
    {
      _id: 1,
      name: "Premium Diya Set with Handcrafted Design",
      title: "Premium Diya Set",
      price: 399,
      mrp: 799,
      label: "SALE",
      HotProducts: true,
      thumbnail: ["/api/placeholder/300/300"],
      shortDescription: "Beautiful handcrafted diyas for your Diwali celebrations",
      sold: 45,
      available: 15
    },
    {
      _id: 2,
      name: "Festive LED Lanterns with Color Changing Lights",
      title: "LED Lanterns",
      price: 1299,
      mrp: 1999,
      Trending: true,
      thumbnail: ["/api/placeholder/300/300"],
      shortDescription: "Modern LED lanterns with multiple color options",
      sold: 28,
      available: 22
    },
    {
      _id: 3,
      name: "Traditional Rangoli Colors Pack",
      title: "Rangoli Colors",
      price: 199,
      mrp: 299,
      Recommends: true,
      thumbnail: ["/api/placeholder/300/300"],
      shortDescription: "Vibrant colors for beautiful rangoli designs",
      sold: 67,
      available: 33
    },
    {
      _id: 4,
      name: "Silk Saree with Golden Zari Work",
      title: "Silk Saree",
      price: 3299,
      mrp: 4599,
      label: "NEW",
      thumbnail: ["/api/placeholder/300/300"],
      shortDescription: "Elegant silk saree perfect for Diwali celebrations",
      sold: 12,
      available: 38
    },
    {
      _id: 5,
      name: "Gold Plated Temple Jewelry Set",
      title: "Temple Jewelry",
      price: 1899,
      mrp: 2599,
      label: "Best seller",
      thumbnail: ["/api/placeholder/300/300"],
      shortDescription: "Traditional temple jewelry for festive occasions",
      sold: 89,
      available: 11
    },
    {
      _id: 6,
      name: "Deluxe Diwali Gift Hamper",
      title: "Gift Hamper",
      price: 1199,
      mrp: 1599,
      sponsored: true,
      thumbnail: ["/api/placeholder/300/300"],
      shortDescription: "Curated gift hamper with sweets and decorations",
      sold: 34,
      available: 16
    }
  ];

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date('2024-11-12T23:59:59');
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-orange-50">
      {/* Main Banner */}
      <section className="relative py-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 z-0"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
              <div className="inline-flex items-center bg-yellow-400 text-orange-800 px-4 py-2 rounded-full font-bold mb-6 animate-pulse">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Limited Time Offer
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Diwali <span className="text-yellow-300">Sparkle</span> Sale
              </h1>
              
              <p className="text-xl text-orange-100 mb-8 max-w-2xl">
                Light up your celebrations with exclusive deals and discounts. Shop now and make this Diwali unforgettable!
              </p>

              {/* Countdown Timer */}
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 inline-block">
                <h3 className="text-white font-semibold mb-4 text-center">Sale Ends In</h3>
                <div className="flex space-x-4">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center">
                      <div className="bg-gradient-to-b from-orange-500 to-red-600 text-white w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold">{value}</span>
                      </div>
                      <span className="text-orange-200 mt-2 text-sm capitalize">{unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
                  Shop Now
                  <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-300">
                  View All Deals
                </button>
              </div>
            </div>

            {/* Banner Image */}
            <div className="lg:w-1/2 relative">
              <div className="relative w-full max-w-lg mx-auto">
                {/* Animated elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
                
                {/* Main banner card */}
                <div className="relative bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">Extra 20% OFF</h3>
                    <p className="text-orange-100 mb-6">Use code: <span className="font-bold bg-white text-orange-600 px-3 py-1 rounded-lg">DIWALI20</span></p>
                    <div className="bg-white/20 rounded-xl p-4">
                      <p className="text-sm">On orders above ₹1999</p>
                      <p className="text-lg font-bold mt-2">Free Shipping 🚚</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* iOS Phones Section */}
      <MobileAccessoriesIOSPhones />

      {/* Featured Products Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Diwali Products</h2>
            <p className="text-orange-200 text-lg max-w-2xl mx-auto">
              Discover our curated collection of festive products to make your Diwali celebrations special
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {diwaliProducts.map((product) => (
              <SingleProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
              Load More Products
            </button>
          </div>
        </div>
      </section>

      {/* Categories Banner */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Shop By Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Decorations', icon: '🏮', items: '120+ Products' },
                { name: 'Clothing', icon: '👗', items: '85+ Products' },
                { name: 'Gifts', icon: '🎁', items: '65+ Products' },
                { name: 'Sweets', icon: '🍬', items: '45+ Products' }
              ].map((category, index) => (
                <div 
                  key={index}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{category.name}</h3>
                  <p className="text-orange-100 text-sm">{category.items}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default DiwaliSalePage;