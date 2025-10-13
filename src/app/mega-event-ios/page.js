"use client";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Link from "next/link";

const MegaSale = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentMobileBanner, setCurrentMobileBanner] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Desktop Banners (visible on sm and above)
  const desktopBanners = [
    "https://res.cloudinary.com/duezqhb2e/image/upload/v1759898998/homeslider/MobileImage/qxy8nfsywur14nsqsyxj.jpg",
    "https://res.cloudinary.com/duezqhb2e/image/upload/v1759897984/homeslider/MobileImage/wncmoqyrgig2cc2u4uyx.jpg",
  ];

  // Mobile Banners (visible on sm:hidden)
  const mobileBanners = [
    "https://res.cloudinary.com/duezqhb2e/image/upload/v1759933235/Product/thumbnail/msg6wlordlnf9heel1zu.webp",
    "https://res.cloudinary.com/duezqhb2e/image/upload/v1759933313/Product/thumbnail/uounktmcd8owcpqari2z.webp",
    "https://res.cloudinary.com/duezqhb2e/image/upload/v1759933341/Product/thumbnail/hlcepp4qx3yaboi6ndmx.webp",
  ];

  // Function to categorize products by series
  const categorizeProductsBySeries = (products) => {
    const categorized = {
      series17: [],
      series16: [],
      series15: [],
      series14: [],
      seriesAir: [],
      otherSeries: [],
    };

    products.forEach((product) => {
      const name = product.name.toLowerCase();

      if (
        name.includes("17 pro max") ||
        name.includes("17 pro") ||
        name.includes("iphone 17")
      ) {
        categorized.series17.push(product);
      } else if (
        name.includes("16 pro max") ||
        name.includes("16 pro") ||
        name.includes("iphone 16")
      ) {
        categorized.series16.push(product);
      } else if (name.includes("15")) {
        categorized.series15.push(product);
      } else if (name.includes("14")) {
        categorized.series14.push(product);
      } else if (name.includes("air")) {
        categorized.seriesAir.push(product);
      } else {
        categorized.otherSeries.push(product);
      }
    });

    return categorized;
  };

  // Function to determine badge based on product properties
  const getProductBadge = (product) => {
    if (product.HotProducts) return "HOT";
    if (product.Trending) return "TRENDING";
    if (product.Offers) return "OFFER";
    if (product.Recommends) return "RECOMMENDED";
    return "NEW";
  };

  // Function to calculate discount percentage
  const calculateDiscount = (product) => {
    const price = parseInt(product.priceRange);
    const mrp = parseInt(product.mrpRange);
    if (mrp > 0 && price < mrp) {
      return Math.round(((mrp - price) / mrp) * 100);
    }
    return 0;
  };

  useEffect(() => {
    const checkPopupTime = () => {
      const now = new Date();
      const target = new Date();
      target.setDate(now.getDate() + 1); // tomorrow's date
      target.setHours(18, 0, 0, 0); // 6 PM

      if (now >= target) {
        setShowPopup(true);
      } else {
        const msUntilPopup = target - now;
        setTimeout(() => setShowPopup(true), msUntilPopup);
      }
    };

    checkPopupTime();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${Baseurl}/api/v1/product/getProdactUsingSeries`
        );
        const result = await response.json();

        if (result.success) {
          const categorized = categorizeProductsBySeries(result.product);
          setProducts(categorized);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Desktop banner auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % desktopBanners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Mobile banner auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMobileBanner((prev) => (prev + 1) % mobileBanners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(18, 0, 0, 0); // Today 6 PM

    let popupShown = false;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: 0,
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });

        if (!popupShown) {
          setShowPopup(true); // show popup only once
          popupShown = true;
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % desktopBanners.length);
  };

  const prevBanner = () => {
    setCurrentBanner(
      (prev) => (prev - 1 + desktopBanners.length) % desktopBanners.length
    );
  };

  const nextMobileBanner = () => {
    setCurrentMobileBanner((prev) => (prev + 1) % mobileBanners.length);
  };

  const prevMobileBanner = () => {
    setCurrentMobileBanner(
      (prev) => (prev - 1 + mobileBanners.length) % mobileBanners.length
    );
  };

  // Product Card Component - Dynamic
  const ProductCard = ({ product }) => {
    const discount = calculateDiscount(product);
    const badge = getProductBadge(product);

    return (
      <Link
        href={`/product/${product.slugUrl || product._id}`}
        passHref
        className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 rounded-lg shadow-sm"
      >
        {/* Product Image */}
        <div className="relative">
          {/* Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                badge === "NEW"
                  ? "bg-green-500 text-white"
                  : badge === "HOT"
                  ? "bg-blue-950 text-white"
                  : badge === "TRENDING"
                  ? "bg-blue-500 text-white"
                  : badge === "RECOMMENDED"
                  ? "bg-orange-500 text-white"
                  : badge === "OFFER"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {badge}
            </span>
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(product._id)}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
          >
            <FaHeart
              className={`w-4 h-4 ${
                favorites.has(product._id)
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400"
              }`}
            />
          </button>

          {/* Product Image */}
          <div className="w-full aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
            <img
              src={
                product.thumbnail?.[0] ||
                "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/s/t/g/-original-imahft5gqkxzyeqa.jpeg?q=70&crop=false"
              }
              alt={product.name}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 pt-3 text-left">
          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1 text-center leading-tight">
            {product.name}
          </h3>

          {/* Price and Discount */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg font-bold text-green-700">
                ₹{parseInt(product.priceRange).toLocaleString()}
              </span>
              {discount > 0 && (
                <span className="text-sm text-green-700 font-bold">
                  {discount}% OFF
                </span>
              )}
            </div>

            {discount > 0 && (
              <div className="text-xs text-gray-500 line-through">
                ₹{parseInt(product.mrpRange).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        {/* Skeleton for banner */}
        <div className="relative sm:h-80 h-40 bg-gray-200 animate-pulse rounded-2xl mb-6"></div>

        {/* Skeleton for section title */}
        <div className="h-6 w-1/3 bg-gray-300 animate-pulse rounded mb-4"></div>

        {/* Skeleton for product cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Image Skeleton */}
              <div className="w-full aspect-square bg-gray-200 animate-pulse" />

              {/* Text Skeletons */}
              <div className="p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Desktop Banner Carousel - Visible on sm and above */}
      <div className="hidden lg:block relative h-80 bg-gray-900 overflow-hidden shadow-xl">
        {desktopBanners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner}
              alt={`Desktop Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}

        {/* Desktop Banner Navigation Arrows */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-2xl hover:scale-110"
        >
          <FaArrowLeft className="text-gray-800 text-lg" />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-2xl hover:scale-110"
        >
          <FaArrowRight className="text-gray-800 text-lg" />
        </button>

        {/* Desktop Banner Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {desktopBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentBanner
                  ? "bg-white w-8 scale-110"
                  : "bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Banner Carousel - Visible on sm:hidden */}
      <div className="lg:hidden relative h-40 sm:h-60 bg-gray-900 overflow-hidden shadow-xl">
        {mobileBanners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentMobileBanner ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner}
              alt={`Mobile Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}

        {/* Mobile Banner Navigation Arrows */}
        <button
          onClick={prevMobileBanner}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-2xl hover:scale-110"
        >
          <FaArrowLeft className="text-gray-800 text-sm" />
        </button>
        <button
          onClick={nextMobileBanner}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-2xl hover:scale-110"
        >
          <FaArrowRight className="text-gray-800 text-sm" />
        </button>

        {/* Mobile Banner Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {mobileBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMobileBanner(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentMobileBanner
                  ? "bg-white w-6 scale-110"
                  : "bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Diwali Mega Offer Header */}
      {/* `<div className="py-4 bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
        <div className="mx-auto px-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 animate-pulse">
              Maha Mega Launching
            </h1>
            <p className="text-orange-100 text-lg text-center md:text-xl font-medium mb-6">
              Exclusive discounts on premium iPhones - Don't miss out!
            </p>

            <div className="flex justify-center text-left items-center space-x-3 md:space-x-6">
              {Object.entries(timeLeft).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="bg-white rounded-xl px-4 py-3 shadow-2xl transform hover:scale-105 transition-transform">
                    <span className="text-2xl md:text-4xl font-bold text-orange-600 block">
                      {value.toString().padStart(2, "0")}
                    </span>
                    <span className="text-orange-800 text-xs md:text-sm font-semibold uppercase tracking-wide">
                      {key}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>` */}

      {/* iPhone 17 Series Section */}
      {products.series17 && products.series17.length > 0 && (
        <div className="mx-auto px-4 pt-4 bg-white">
          <div className="text-left mb-2">
            <h2 className="text-4xl font-bold text-gray-900 mb-1">
              iPhone <span className="text-orange-500">17 Series</span>
            </h2>
            <p className="text-gray-600 text-left sm:text-sm text-xs italic mx-auto">
              The latest innovation with cutting-edge technology and premium
              features
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.series17.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* iPhone 16 Series Section */}
      {products.series16 && products.series16.length > 0 && (
        <div className="mx-auto px-4 py-3 bg-white">
          <div className="text-left mb-2">
            <h2 className="text-4xl font-bold text-gray-900">
              iPhone <span className="text-orange-500">16 Series</span>
            </h2>
            <p className="text-gray-600 sm:text-sm text-xs italic mx-auto">
              Powerful performance with advanced camera systems and stunning
              display
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.series16.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* iPhone 15 Series Section */}
      {products.series15 && products.series15.length > 0 && (
        <div className="mx-auto px-4 py-3 bg-white">
          <div className="text-left mb-2">
            <h2 className="text-4xl font-bold text-gray-900">
              iPhone <span className="text-orange-500">15 Series</span>
            </h2>
            <p className="text-gray-600 sm:text-sm text-xs italic mx-auto">
              Excellent value with premium features at an affordable price point
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.series15.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* iPhone 14 Series Section */}
      {products.series14 && products.series14.length > 0 && (
        <div className="mx-auto px-4 py-3 bg-white">
          <div className="text-left mb-2">
            <h2 className="text-4xl font-bold text-gray-900">
              iPhone <span className="text-orange-500">14 Series</span>
            </h2>
            <p className="text-gray-600 sm:text-sm text-xs italic mx-auto">
              Reliable performance with proven features and great value
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.series14.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* iPhone Air Series Section */}
      {products.seriesAir && products.seriesAir.length > 0 && (
        <div className="mx-auto px-4 py-3 bg-white">
          <div className="text-left mb-2">
            <h2 className="text-4xl font-bold text-gray-900">
              iPhone <span className="text-orange-500">Air Series</span>
            </h2>
            <p className="text-gray-600 sm:text-sm text-xs italic mx-auto">
              Ultra-thin and lightweight design with pro-level performance
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.seriesAir.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Other iPhone Series Section */}
      {products.otherSeries && products.otherSeries.length > 0 && (
        <div className="mx-auto px-4 py-3 bg-white">
          <div className="text-left mb-2">
            <h2 className="text-4xl font-bold text-gray-900">
              Other iPhone <span className="text-orange-500">Series</span>
            </h2>
            <p className="text-gray-600 sm:text-sm text-xs italic mx-auto">
              More great iPhone options with amazing discounts
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.otherSeries.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 120, damping: 15 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm mx-auto text-center relative border-4 border-orange-400"
            >
              <h2 className="text-3xl font-extrabold text-orange-600 mb-3 animate-pulse">
                🚀 Mega Sale is LIVE!
              </h2>
              <p className="text-gray-700 mb-5 font-medium">
                Grab your favorite iPhones at **exclusive launch prices** now!
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full shadow-md"
                >
                  Shop Now
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-full shadow-md"
                >
                  Maybe Later
                </button>
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-950 text-white font-bold rounded-full flex items-center justify-center animate-bounce shadow-lg">
                🔥
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaSale;
