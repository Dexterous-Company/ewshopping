"use client";
import React, { memo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getCategoryTagBySlugUrl } from "@/redux/header/CategoryTagSlice";

// Skeleton component
const CategoryCardSkeleton = memo(() => {
  return (
    <div className="w-[110px] xs:w-[95px] sm:w-[130px] md:w-[160px] lg:w-[180px] flex-shrink-0 mx-1">
      <div className="flex flex-col items-center h-full sm:rounded-xl bg-white shadow-lg border border-gray-100 animate-pulse">
        {/* Image Container Skeleton */}
        <div className="relative w-full aspect-square overflow-hidden rounded-md sm:rounded-lg bg-gray-100">
          {/* Subtle shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer"></div>
        </div>

        {/* Text Content Skeleton */}
        <div className="w-full p-2 sm:p-3 space-y-2.5">
          {/* Main title line */}
          <div className="h-3 bg-gray-100 rounded-full w-5/6 mx-auto"></div>
          
          {/* Secondary line */}
          <div className="h-2.5 bg-gray-100 rounded-full w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );
});

// Main CategoryCard component
const CategoryCard = ({
  name,
  categoryTagData,
  offer = [],
  textAlign = "center",
  price = "",
  productCount = "",
  isLoading = false, // Add loading prop
}) => {
  const textAlignment =
    {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[textAlign] || "text-center";

  const router = useRouter();
  const dispatch = useDispatch();

  // Show skeleton if loading
  if (isLoading) {
    return <CategoryCardSkeleton />;
  }

  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f8fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";

  const problematicImages = [
    "https://res.cloudinary.com/dexterous-technology/image/upload/v1721580241/th_76_igkjus.jpg",
    "https://res.cloudinary.com/dexterous-technology/image/upload/v1721330640/download_21_aosmpw.jpg",
  ];

  const mobileImage = categoryTagData?.mobileImage;
  const isProblematic = problematicImages.includes(mobileImage);
  const displayImage =
    mobileImage && !isProblematic ? mobileImage : placeholderImage;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(!mobileImage || isProblematic);

  const handleClick = (e) => {
    e.preventDefault();
    if (categoryTagData?.slugUrl) {
      dispatch(getCategoryTagBySlugUrl({ slugUrl: categoryTagData.slugUrl }))
        .unwrap()
        .then((res) => {
          if (res?.categoryUrl && res?.SubCategoryUrl && res?.slugUrl) {
            router.push(
              `/${res.categoryUrl}/${res.SubCategoryUrl}/${res.slugUrl}`
            );
          }
        })
        .catch((err) => console.error("Navigation error:", err));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e);
    }
  };

  const handleImageError = (e) => {
    setImageError(true);
    setImageLoaded(true);
    e.target.style.display = "none";
  };

  const handleImageLoad = () => setImageLoaded(true);

  return (
    <div
      className="w-[110px] xs:w-[95px] sm:w-[130px] md:w-[160px] lg:w-[180px] flex-shrink-0 mx-1 cursor-pointer group"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Browse ${name} category`}
    >
      {/* Modern Card Container - Enhanced colors */}
      <div className="flex flex-col items-center h-full sm:rounded-xl bg-gradient-to-b from-white/90 via-rose-50/40 to-purple-50/40 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 border border-white/50 group-hover:border group-hover:border-gradient-to-r group-hover:from-cyan-300/50 group-hover:via-purple-300/50 group-hover:to-pink-300/50 active:scale-95 backdrop-blur-md hover:backdrop-blur-lg">
        {/* Image Container - Enhanced gradient background */}
        <div className="relative w-full aspect-square overflow-hidden rounded-md sm:rounded-lg bg-gradient-to-br from-cyan-100/50 via-purple-100/50 to-pink-100/50">
          {/* Premium Badge - Vibrant colors */}

          {/* Image with colored overlay */}
          <div className="relative w-full h-full">
            {!imageError ? (
              <div className="relative w-full h-full overflow-hidden rounded-sm xs:rounded-md">
                <img
                  src={displayImage}
                  alt={`${name} category`}
                  className={` object-contain w-full h-full rounded-sm xs:rounded-md transition-all duration-500 group-hover:scale-110 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                  decoding="async"
                />
                {/* Enhanced overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm xs:rounded-md"></div>
              </div>
            ) : null}

            {/* Enhanced loading skeleton */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-1.5 xs:inset-2 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-sm xs:rounded-md animate-pulse flex items-center justify-center">
                <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-lg"></div>
              </div>
            )}

            {/* Enhanced fallback image */}
            {imageError && (
              <div className="absolute inset-1.5 xs:inset-2 flex items-center justify-center bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100 rounded-sm xs:rounded-md">
                <img
                  src={placeholderImage}
                  alt="No Image"
                  className="w-full h-full object-cover rounded-sm xs:rounded-md opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-400/10 rounded-sm xs:rounded-md"></div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section - Enhanced text colors */}
        <div className={`flex-1 w-full space-y-1 xs:space-y-1.5`}>
          <div>
            <h3 className="font-extrabold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent text-[9px] xs:text-[10px] sm:text-[12px] leading-tight line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-cyan-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-300 min-h-[28px] xs:min-h-[32px] flex items-center justify-center drop-shadow-sm">
              {name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CategoryCard);