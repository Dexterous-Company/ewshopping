"use client";

import Image from "next/image";
import React, { useRef, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSubCategory,
  resetSubCategories,
} from "@/redux/header/HeaderSubSlice";
import { useRouter } from "next/navigation";

const CategoryCarousel = () => {
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);

  const { subCategories = [], status, error } = useSelector(
    (state) => state.subCat
  );

  useEffect(() => {
    dispatch(resetSubCategories());
    dispatch(getSubCategory());
    setIsMounted(true);
  }, [dispatch]);

  const router = useRouter();

  const handleClick = (e, category) => {
    e.preventDefault();
    if (category) {
      router.push(`/subcat/${encodeURIComponent(category.slugUrl)}`);
    }
  };

  // Diwali-themed floating circles background
  const diwaliCircles = useMemo(
    () =>
      Array(15)
        .fill(0)
        .map((_, i) => ({
          id: i,
          size: Math.random() * 60 + 20, // 20-80px
          left: Math.random() * 100, // 0-100%
          animationDelay: Math.random() * 5, // 0-5s
          animationDuration: Math.random() * 10 + 10, // 10-20s
          color: [
            "from-yellow-200 to-orange-300",
            "from-orange-200 to-red-300",
            "from-red-200 to-pink-300",
            "from-amber-200 to-yellow-300",
            "from-orange-100 to-amber-200",
          ][Math.floor(Math.random() * 5)],
          opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4
        })),
    []
  );

  // Loading skeletons with Diwali theme
  const loadingSkeletons = useMemo(
    () =>
      Array(12)
        .fill(0)
        .map((_, i) => (
          <div
            key={`loading-${i}`}
            className="flex-shrink-0 text-center mx-3 w-[80px] sm:w-[100px] relative z-10"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 shadow-lg animate-pulse mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-100 to-transparent animate-shimmer" />
            </div>
            <div className="mt-3 h-3 bg-gradient-to-r from-amber-500 to-orange-800 rounded-full w-3/4 mx-auto" />
          </div>
        )),
    []
  );

  if (status === "failed") {
    return (
      <div className="my-8 p-6 bg-red-50 border border-red-200 rounded-lg text-center relative overflow-hidden">
        {/* Error background circles */}
        <div className="absolute inset-0 overflow-hidden">
          {diwaliCircles.slice(0, 5).map((circle) => (
            <div
              key={`error-${circle.id}`}
              className="absolute rounded-full bg-gradient-to-br from-red-100 to-red-200 animate-float"
              style={{
                width: circle.size,
                height: circle.size,
                left: `${circle.left}%`,
                top: `${Math.random() * 100}%`,
                opacity: circle.opacity,
                animationDelay: `${circle.animationDelay}s`,
                animationDuration: `${circle.animationDuration}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <p className="text-red-600 font-medium text-sm">
            Failed to load categories: {error || "Unknown error"}
          </p>
          <button
            onClick={() => dispatch(getSubCategory())}
            className="mt-3 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 shadow-lg text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="my-6 relative overflow-hidden">
        <div
          className="flex overflow-x-auto px-4 no-scrollbar scroll-smooth relative z-10"
          style={{ scrollbarWidth: "none" }}
        >
          {loadingSkeletons}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4 relative overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* Diwali Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {diwaliCircles.map((circle) => (
          <div
            key={circle.id}
            className={`absolute rounded-full bg-gradient-to-br animate-float ${circle.color}`}
            style={{
              width: circle.size,
              height: circle.size,
              left: `${circle.left}%`,
              top: `${Math.random() * 100}%`,
              opacity: circle.opacity,
              animationDelay: `${circle.animationDelay}s`,
              animationDuration: `${circle.animationDuration}s`,
              filter: "blur(1px)",
            }}
          />
        ))}
        
        {/* Sparkle effects */}
        <div className="absolute inset-0">
          {Array(8).fill(0).map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Diwali Offer Badge */}
      {/* <div className="absolute top-2 right-4 z-20">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
          🪔 Diwali Special Offers 🪔
        </div>
      </div> */}

      {/* Carousel */}
      <div className="relative z-10">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto no-scrollbar px-4 md:gap-6 scroll-smooth pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {status === "loading"
            ? loadingSkeletons
            : subCategories.map((category) => (
                <div
                  key={category._id}
                  onClick={(e) => handleClick(e, category)}
                  className="flex flex-col items-center justify-center text-center cursor-pointer group min-w-[80px] sm:min-w-[100px] relative"
                >
                  {/* Circular Image with Diwali Glow */}
                  <div className="relative w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] rounded-full overflow-hidden border-2 border-orange-200 shadow-lg group-hover:shadow-xl transition-all duration-300 bg-white group-hover:border-orange-400">
                    <Image
                      src={
                        category.desktopImage ||
                        category.mobileImage ||
                        "/default-category-image.jpg"
                      }
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                      sizes="(max-width: 768px) 80px, 100px"
                      loading="lazy"
                      quality={85}
                    />
                    
                    {/* Hover glow effect */}
                    <div className=" rounded-full" />
                  </div>

                  {/* Name with festive colors */}
                  <p className="mt-3 text-[11px] sm:text-[13px] md:text-[14px] font-medium text-gray-800 group-hover:text-orange-700 group-hover:font-bold whitespace-nowrap transition-all duration-200 bg-white/80 px-2 py-1 rounded-full backdrop-blur-sm">
                    {category.name.length > 14
                      ? category.name.slice(0, 13) + "…"
                      : category.name}
                  </p>

                  {/* Floating particles on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {[1, 2, 3].map((particle) => (
                      <div
                        key={particle}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-bounce"
                        style={{
                          left: `${20 + particle * 20}%`,
                          animationDelay: `${particle * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Add the custom animations to your global CSS or use a CSS-in-JS solution */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default React.memo(CategoryCarousel);