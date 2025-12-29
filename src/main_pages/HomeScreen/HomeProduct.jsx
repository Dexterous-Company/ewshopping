"use client";

import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CategoryCard from "./CategoryCard";
import { getAllCategoryTagsAllCategories } from "@/redux/category/categorySlice";

const iconsByCategory = {
  Gardening: "🌿",
  "Men's Fashion": "👕",
  Kitchen: "🍽️",
  "Cookware & Serveware": "🍳",
  "Staples & Cooking Essentials": "🫙",
  "Home Decor": "🛋️",
  "Women's Fashion": "👗",
  "Makeup & Cosmetics": "💄",
  "Bath & Body Care": "🛁",
  Default: "⭐",
};

export default function HomeProduct({ categoryUrl = "home-decor" }) {
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();

  const { allCategoryTags, tagsStatus, tagsError } = useSelector(
    (state) => state.category
  );

  const categoryData = allCategoryTags[categoryUrl];
  const categoryStatus = tagsStatus[categoryUrl] || "idle";
  const categoryError = tagsError[categoryUrl];

  const categoryName = categoryData?.categoryName || "Featured Collection";
  const categoryIcon =
    iconsByCategory[categoryName] || iconsByCategory.Default;

  const problematicImages = [
    "https://res.cloudinary.com/dexterous-technology/image/upload/v1721580241/th_76_igkjus.jpg",
    "https://res.cloudinary.com/dexterous-technology/image/upload/v1721330640/download_21_aosmpw.jpg",
  ];

  const validTags =
    categoryData?.tags?.filter(
      (tag) => !problematicImages.includes(tag.mobileImage)
    ) || [];

  useEffect(() => {
    if (
      categoryUrl &&
      categoryUrl !== "undefined" &&
      !allCategoryTags[categoryUrl] &&
      categoryStatus !== "loading"
    ) {
      dispatch(getAllCategoryTagsAllCategories(categoryUrl));
    }
  }, [dispatch, categoryUrl, allCategoryTags, categoryStatus]);

  return (
    <section
      className="w-full bg-gradient-to-r from-orange-500/15 via-pink-500/15 to-rose-500/15 overflow-hidden shadow-lg border-y border-pink-100/60"
      aria-labelledby={`homeproduct-heading-${categoryUrl}`}
    >
      {/* HEADER */}
      <div className="px-4 sm:px-6 pt-2 mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"
            aria-hidden="true"
          />
          <h2
            id={`homeproduct-heading-${categoryUrl}`}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-900 bg-clip-text text-transparent text-xl font-extrabold"
          >
            {categoryName}
            <span aria-hidden="true">{categoryIcon}</span>
          </h2>
        </div>
      </div>

      {/* SCROLL AREA */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide px-2"
        role="region"
        aria-label={`${categoryName} products`}
      >
        <div
          className="flex gap-4 py-2 w-full"
          role="list"
        >
          {/* ================= SKELETON ================= */}
          {categoryStatus === "loading" &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                role="listitem"
                aria-hidden="true"
                className="flex-shrink-0 w-[150px] sm:w-[170px] md:w-[180px]"
              >
                {/* image skeleton – SAME height as actual card */}
                <div className="w-full h-[140px] bg-gray-300 rounded-xl animate-pulse" />

                {/* text skeleton */}
                <div className="p-3 space-y-2">
                  <div className="h-3 w-3/4 bg-gray-300 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-300 rounded animate-pulse" />
                </div>
              </div>
            ))}

          {/* ================= ERROR ================= */}
          {categoryStatus === "failed" && (
            <div
              className="p-6 text-red-600"
              role="alert"
              aria-label="Failed to load products"
            >
              {categoryError}
            </div>
          )}

          {/* ================= DATA ================= */}
          {categoryStatus === "succeeded" &&
            validTags.length > 0 &&
            validTags.map((tag, index) => (
              <div
                key={`${tag.slugUrl}-${index}`}
                role="listitem"
                aria-label={`Open ${tag.name} category`}
              >
                <CategoryCard
                  name={tag.name}
                  categoryTagData={tag}
                  productCount={tag.productCount}
                  offer={tag.offerTags || []}
                  price={tag.price || ""}
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
