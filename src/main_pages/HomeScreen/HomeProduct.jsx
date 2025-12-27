// HomeProduct.js - Updated with vibrant colors, arrow buttons & skeleton loader
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

const HomeProduct = ({
  title,
  smallTitle,
  border,
  categoryUrl = "home-decor",
}) => {
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();

  const { allCategoryTags, tagsStatus, tagsError } = useSelector(
    (state) => state.category
  );

  const categoryData = allCategoryTags[categoryUrl];
  const categoryStatus = tagsStatus[categoryUrl] || "idle";
  const categoryError = tagsError[categoryUrl];

  // Get category name and icon
  const categoryName = categoryData?.categoryName || "Featured Collection";
  const categoryIcon = iconsByCategory[categoryName] || iconsByCategory.Default;

  const problematicImages = [
    "https://res.cloudinary.com/dexterous-technology/image/upload/v1721580241/th_76_igkjus.jpg",
    "https://res.cloudinary.com/dexterous-technology/image/upload/v1721330640/download_21_aosmpw.jpg",
  ];

  const validTags =
    categoryData?.tags?.filter((tag) => {
      const hasProblematicImage = problematicImages.includes(tag.mobileImage);
      if (hasProblematicImage) return false;
      return true;
    }) || [];

  useEffect(() => {
    if (categoryUrl && categoryUrl !== "undefined") {
      if (!allCategoryTags[categoryUrl] && categoryStatus !== "loading") {
        dispatch(getAllCategoryTagsAllCategories(categoryUrl));
      }
    }
  }, [dispatch, categoryUrl, allCategoryTags, categoryStatus]);

  // ✅ NEW — SKELETON LOADING UI (ONLY THIS BLOCK CHANGED)
  if (categoryStatus === "loading") {
    return (
      <section className="w-full bg-white py-3">
        <div className="px-4 mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-6 bg-gray-300 animate-pulse rounded-md"></div>
            <div className="h-5 w-40 bg-gray-300 animate-pulse rounded"></div>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide px-2 pb-2">
          <div className="flex space-x-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-32 h-40 bg-gray-200 animate-pulse rounded-xl shadow-sm"
              >
                <div className="w-full h-24 bg-gray-300 animate-pulse rounded-t-xl"></div>
                <div className="p-2 space-y-2">
                  <div className="w-3/4 h-3 bg-gray-300 animate-pulse rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-300 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ERROR UI (unchanged)
  if (categoryStatus === "failed") {
    return (
      <section className="w-full bg-gradient-to-b from-rose-50/40 to-orange-50/40">
        <div className="mb-2 text-left sm:px-4 px-2 sm:pb-1 pd-3">
          <h2 className="text-left normal-case bg-gradient-to-r from-rose-800 via-red-800 to-orange-900 bg-clip-text text-transparent text-[0.8rem] sm:text-base md:text-xl font-bold">
            ⚠️ Oops! Something went wrong
          </h2>
        </div>
        <div className="mx-2 p-6 bg-gradient-to-br from-rose-100/80 via-white to-orange-100/80 rounded-xl border-2 border-rose-200/80 shadow-lg">
          <p className="text-sm text-rose-700/90 mt-1">{categoryError}</p>
        </div>
      </section>
    );
  }

  const hasValidData = validTags.length > 0;
  if (!hasValidData) return null;

  return (
    <section className="w-full bg-gradient-to-r from-orange-500/15 via-pink-500/15 to-rose-500/15 overflow-hidden shadow-lg border-y border-pink-100/60 relative">
      <div className="relative md:mb-3 text-left sm:px-6 px-4 pt-2">
        <div className="flex items-center mb-1 space-x-2">
          <div className="w-2 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
          <h2 className="flex items-center gap-2 text-left bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-900 bg-clip-text text-transparent text-xl font-extrabold">
            <span>{categoryData?.categoryName || "Featured Collection"}</span>
            <span className="text-xl">{categoryIcon}</span>
          </h2>
        </div>
      </div>

      <div
        className="overflow-x-auto w-full scrollbar-hide md:pb-2 px-2"
        ref={scrollContainerRef}
      >
        <div className="flex space-x-4 w-full py-2">
          {validTags.map((tag, index) => (
            <CategoryCard
              key={`${tag.slugUrl}-${index}`}
              name={tag.name}
              categoryTagData={tag}
              productCount={tag.productCount}
              offer={tag.offerTags || []}
              price={tag.price || ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeProduct;
