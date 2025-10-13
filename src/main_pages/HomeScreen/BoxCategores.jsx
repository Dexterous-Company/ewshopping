import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { getSubCategoryPromotions } from "@/redux/header/SubCategoryPromotionSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BoxCategories = ({ selectedIndexes = [] }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { subCategoryPromotions, status, error } = useSelector(
    (store) => store.subCategoryPromotion
  );

  useEffect(() => {
    dispatch(getSubCategoryPromotions());
  }, [dispatch]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (status === "loading") {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!subCategoryPromotions || subCategoryPromotions.length === 0) {
    return <div className="text-center py-8">No promotions available</div>;
  }

  const handleClickCategory = (e, category) => {
    e.preventDefault();
    if (category) {
      router.push(`/searchresults?category=${category?.category}`);
    }
  };

  const handleClick = (e, subCategory) => {
    e.preventDefault();
    if (subCategory) {
      router.push(
        `/searchresults?subCategory=${encodeURIComponent(subCategory.name)}`
      );
    }
  };

  const filteredCategories = subCategoryPromotions.filter((_, i) =>
    selectedIndexes.includes(i)
  );

  // Mobile version with new design
  const MobileCategoryCard = ({ category }) => (
    <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-4 shadow-lg mb-4 mx-2 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-white to-gray-200 rounded-2xl"></div>

      {/* Header Section */}
      <div className="relative z-10 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white text-lg font-bold mb-1">
              Spotlight's on
            </h3>
            <p className="text-white/80 text-sm">{category.category}</p>
          </div>
          {/* Discount Badge */}
          <div className="bg-yellow-400 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
            Upto 70% Off
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="relative z-10">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {(category.selectedSubCategories || [])
            .slice(0, 6)
            .map((subCategory, index) => (
              <div
                key={subCategory._id}
                onClick={(e) => handleClick(e, subCategory)}
                className="text-center cursor-pointer group"
              >
                {/* Image Container */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 mb-2 group-hover:scale-105 transition-transform duration-300">
                  <div className="relative aspect-square">
                    <Image
                      src={subCategory.mobileImage}
                      alt={`${subCategory.name} category`}
                      fill
                      className="object-contain rounded-lg"
                      sizes="(max-width: 768px) 33vw"
                      loading="lazy"
                      quality={80}
                      decoding="async"
                    />
                  </div>
                </div>

                {/* Subcategory Name */}
                <p className="text-white text-xs font-semibold truncate px-1">
                  {subCategory.name}
                </p>

                {/* Additional Info - Like in the image */}
                {index === 0 && (
                  <p className="text-yellow-300 text-[10px] mt-1 font-bold">
                    Min 50% Off
                  </p>
                )}
                {index === 1 && (
                  <p className="text-white text-[10px] mt-1">Under ₹2999</p>
                )}
              </div>
            ))}
        </div>

        {/* See All Button */}
        <button
          onClick={(e) => handleClickCategory(e, category)}
          className="w-full bg-white text-purple-700 font-bold py-2 rounded-lg hover:bg-purple-100 transition-colors text-sm"
        >
          {category.button_text || "See all offers"}
        </button>
      </div>
    </div>
  );

  // Desktop version remains unchanged
  const DesktopCategoryCard = ({ category }) => (
    <div className="w-full md:w-1/3 px-2 mb-4">
      <div className="sm:bg-white rounded-lg shadow-md sm:shadow-md flex flex-col h-full">
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-edu font-bold text-[1rem] sm:text-xl cursor-pointer hover:text-primary transition-colors line-clamp-1 text-blue-950">
              {category.category}
            </h5>
          </div>
          <div className="flex-grow">
            <div className="grid sm:grid-cols-2 grid-cols-3 gap-2">
              {(category.selectedSubCategories || [])
                .slice(0, 4)
                .map((subCategory) => (
                  <div
                    key={subCategory._id}
                    onClick={(e) => handleClick(e, subCategory)}
                    className="text-center h-full rounded-md cursor-pointer shadow-sm bg-white hover:bg-white transition-all duration-200"
                  >
                    <div className="relative aspect-square mb-2 ">
                      <Image
                        src={subCategory.desktopImage}
                        alt={`${subCategory.name} category`}
                        fill
                        className="sm:object-cover rounded-xs"
                        sizes="25vw"
                        loading="lazy"
                        quality={80}
                        decoding="async"
                      />
                    </div>
                    <p className="lg:text-base md:text-xs text-[9px] font-normal truncate px-1 mb-2">
                      {subCategory.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-2">
            <button
              onClick={(e) => handleClickCategory(e, category)}
              className="text-white bg-[#e96f84] px-2 py-1 rounded-xs hover:bg-[#2f415d] text-xs transition-colors"
              aria-label={`View all ${category.category} offers`}
            >
              {category.button_text || "See all offers"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sm:m-4 mx-0.5 mt-2">
      {isMobile ? (
        // Mobile Layout - New Design
        <div className="space-y-3">
          {filteredCategories.map((category) => (
            <MobileCategoryCard key={category._id} category={category} />
          ))}
        </div>
      ) : (
        // Desktop Layout - Original Design
        <div className="flex flex-wrap -mx-2">
          {filteredCategories.map((category) => (
            <DesktopCategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(BoxCategories);
