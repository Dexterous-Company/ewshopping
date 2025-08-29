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

  const {
    subCategories = [],
    status,
    error,
  } = useSelector((state) => state.subCat);

  // Load data on mount
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
  // Memoized loading skeletons - fixed count for SSR
  const loadingSkeletons = useMemo(() => {
    return Array(18)
      .fill(0)
      .map((_, i) => (
        <div
          key={`loading-${i}`}
          className="flex-shrink-0 text-center mx-1 md:mx-3 w-16 sm:w-20 md:w-24 p-1"
        >
          <div className="w-full aspect-square relative rounded-full overflow-hidden bg-gray-200 animate-pulse" />
          {/* <h6 className="mt-2 text-[10px] sm:text-[11px] md:text-[13px] font-semibold truncate">
            Loading...
          </h6> */}
        </div>
      ));
  }, []);

  // Error state
  if (status === "failed") {
    return (
      <div className="my-4 p-4 bg-red-50 rounded-lg text-center">
        <p className="text-red-500 font-medium">
          Failed to load categories: {error || "Unknown error"}
        </p>
        <button
          onClick={() => dispatch(getSubCategory())}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Don't render anything on server to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="my-4">
        <div
          className="flex overflow-x-auto px-2 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {loadingSkeletons}
        </div>
      </div>
    );
  }

  return (
    <div className="my-4">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto px-2 no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {status === "loading"
          ? loadingSkeletons
          : subCategories.map((category) => (
              <div
                key={category._id}
                onClick={(e) => handleClick(e, category)}
                className="flex-shrink-0 text-center mx-1 md:mx-3 w-16 sm:w-20 md:w-24 cursor-pointer p-1 group"
              >
                <div className="w-full aspect-square relative rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-200">
                  <Image
                    src={
                      category.desktopImage ||
                      category.mobileImage ||
                      "/default-category-image.jpg"
                    }
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 64px, 96px"
                    loading="lazy"
                    quality={80}
                  />
                </div>
                <h6 className="mt-2 text-[10px] sm:text-[11px] md:text-[13px] font-semibold truncate text-gray-700 group-hover:text-primary transition-colors">
                  {/* {category.name.split(" ")[0]} */}
                  {category.name.length > 25
                    ? category.name.slice(0, 25) + "..."
                    : category.name}
                </h6>
              </div>
            ))}
      </div>
    </div>
  );
};

export default React.memo(CategoryCarousel);
