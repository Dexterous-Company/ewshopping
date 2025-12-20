"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchBrandsByPromotion,
  clearPromotionData,
} from "@/redux/header/NewBrandSlice";

const BoxCategories = ({
  promotionType = "promotionone",
  showAllPromotions = false,
  categories = [
    "HeadPhones",
    "Mobile",
    "LED",
    "Refrigerators",
    "Home Theater",
    "Washing Machine",
  ],
  singleCategory = false,
  brandsPerCategory = 6,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [allPromotionData, setAllPromotionData] = useState({
    promotionone: [],
    promotiontwo: [],
    promotionthree: [],
  });

  const [loadingStates, setLoadingStates] = useState({
    promotionone: false,
    promotiontwo: false,
    promotionthree: false,
  });

  const diwaliColors = {
    HeadPhones: {
      bg: "bg-gradient-to-br from-yellow-400 to-orange-500",
      text: "text-white",
      accent: "border-yellow-300",
      shadow: "shadow-lg shadow-yellow-500/30",
    },
    Mobile: {
      bg: "bg-gradient-to-br from-red-500 to-orange-600",
      text: "text-white",
      accent: "border-red-300",
      shadow: "shadow-lg shadow-red-500/30",
    },
    LED: {
      bg: "bg-gradient-to-br from-yellow-500 to-red-500",
      text: "text-white",
      accent: "border-yellow-300",
      shadow: "shadow-lg shadow-orange-500/30",
    },
    Refrigerators: {
      bg: "bg-gradient-to-br from-orange-500 to-red-600",
      text: "text-white",
      accent: "border-orange-300",
      shadow: "shadow-lg shadow-red-500/30",
    },
    "Home Theater": {
      bg: "bg-gradient-to-br from-yellow-500 to-orange-600",
      text: "text-white",
      accent: "border-yellow-300",
      shadow: "shadow-lg shadow-amber-500/30",
    },
    "Washing Machine": {
      bg: "bg-gradient-to-br from-red-500 to-yellow-500",
      text: "text-white",
      accent: "border-red-300",
      shadow: "shadow-lg shadow-yellow-500/30",
    },
  };

  const displayCategories = singleCategory ? [singleCategory] : categories;

  useEffect(() => {
    if (showAllPromotions) {
      const promotionTypes = ["promotionone", "promotiontwo", "promotionthree"];

      promotionTypes.forEach(async (type) => {
        try {
          setLoadingStates((prev) => ({ ...prev, [type]: true }));
          const result = await dispatch(fetchBrandsByPromotion(type)).unwrap();

          setAllPromotionData((prev) => ({
            ...prev,
            [type]: result.brands || [],
          }));
        } catch (error) {
          console.error(`Error fetching ${type}:`, error);
        } finally {
          setLoadingStates((prev) => ({ ...prev, [type]: false }));
        }
      });
    } else {
      dispatch(fetchBrandsByPromotion(promotionType));
    }

    return () => {
      if (!showAllPromotions) {
        dispatch(clearPromotionData());
      }
    };
  }, [dispatch, promotionType, showAllPromotions]);

  const singlePromotionState = useSelector((store) => store.newBrands);

  const getAllBrands = () => {
    if (showAllPromotions) {
      return [
        ...allPromotionData.promotionone,
        ...allPromotionData.promotiontwo,
        ...allPromotionData.promotionthree,
      ];
    } else {
      return singlePromotionState.brands || [];
    }
  };

  const brandsToUse = getAllBrands();
  const isLoading = showAllPromotions
    ? Object.values(loadingStates).some((state) => state)
    : singlePromotionState.loading;

  const getBrandsByCategory = () => {
    const grouped = {};

    displayCategories.forEach((category) => {
      const categoryBrands = brandsToUse
        .filter(
          (brand) =>
            brand.category === category ||
            brand.categoryUrl === category.toLowerCase()
        )
        .slice(0, brandsPerCategory);
      grouped[category] = categoryBrands;
    });

    return grouped;
  };

  const brandsByCategory = getBrandsByCategory();

  const handleClick = (e, brand) => {
    e.preventDefault();
    router.push(`/sb/${brand.SubCategoryUrl}/${brand.name}`);
  };

  const getBrandLogo = (brand) => {
    return (
      brand.logo ||
      brand.iconImage ||
      brand.banner ||
      brand.image ||
      brand.icon ||
      brand.brandLogo ||
      brand.thumbnail ||
      brand.profileImage
    );
  };

  const getBrandName = (brand) => {
    return (
      brand.name || brand.brandName || brand.title || brand.brand || `Brand`
    );
  };

  const CategoryBox = ({ category, brands, index }) => {
    const colors = diwaliColors[category];

    return (
      <div
        className={`${colors.bg} ${colors.shadow} rounded-xl border-2 ${colors.accent} overflow-hidden`}
      >
        <div className="py-2 px-3 border-b border-white/20">
          <h3
            className={`text-sm font-bold ${colors.text} text-center truncate`}
          >
            {category}
          </h3>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-3 gap-2">
            {brands.length > 0
              ? brands.map((brand, brandIndex) => (
                  <div key={brand._id?.$oid || brand._id || brandIndex}>
                    <BrandCard brand={brand} colors={colors} />
                  </div>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <BrandPlaceholder colors={colors} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  };

  const BrandCard = ({ brand, colors }) => {
    const brandLogo = getBrandLogo(brand);
    const brandName = getBrandName(brand);

    return (
      <div
        className="group relative cursor-pointer"
        onClick={(e) => handleClick(e, brand)}
      >
        <div className="relative w-full">
          {/* Brand Logo/Image Container */}
          <div className="relative w-full h-24 mb-1">
            {brandLogo ? (
              <div className="relative w-full h-full rounded-md overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/40">
                <Image
                  src={brandLogo}
                  alt={brandName}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 100px, 120px"
                  priority
                  fetchPriority="high"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute inset-0 border-2 border-transparent rounded-md transition-all duration-300 group-hover:border-white/50 group-hover:shadow-inset" />
              </div>
            ) : (
              <div className="w-full h-full rounded-md bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-yellow-500/50">
                <span className="text-lg font-bold text-white">
                  {brandName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Brand Name */}
          <div className="text-center">
            <p className={`text-xs font-semibold ${colors.text} truncate px-1`}>
              {brandName}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const BrandPlaceholder = ({ colors }) => (
    <div className="relative w-full h-24">
      <div className="w-full h-full rounded-md bg-gradient-to-br from-white/20 to-transparent border-2 border-dashed border-white/30" />
    </div>
  );

  if (isLoading) return <LoadingSkeleton singleCategory={singleCategory} />;

  return (
    <div className=" sm:w-1/3">
      <div className="w-full mx-auto px-1">
        {singleCategory ? (
          <div className=" mx-auto">
            <CategoryBox
              category={singleCategory}
              brands={brandsByCategory[singleCategory] || []}
              index={0}
            />
          </div>
        ) : (
          <>
            {/* First Row - 3 Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              {displayCategories.slice(0, 3).map((category, index) => (
                <CategoryBox
                  key={category}
                  category={category}
                  brands={brandsByCategory[category] || []}
                  index={index}
                />
              ))}
            </div>

            {/* Second Row - 3 Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3">
              {displayCategories.slice(3, 6).map((category, index) => (
                <CategoryBox
                  key={category}
                  category={category}
                  brands={brandsByCategory[category] || []}
                  index={index + 3}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = ({ singleCategory = false }) => (
  <div className="py-6 px-3 bg-gradient-to-b from-orange-50 to-red-50">
    {singleCategory ? (
      <div className=" mx-auto">
        <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-200 shadow-lg overflow-hidden">
          <div className="py-2 px-3 border-b border-yellow-200">
            <div className="h-5 bg-gradient-to-r from-yellow-200 to-orange-200 rounded w-28 mx-auto"></div>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <div
                  key={j}
                  className="w-full h-24 rounded-md bg-gradient-to-br from-yellow-200 to-orange-200"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 mb-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-200 shadow-lg overflow-hidden"
            >
              <div className="py-2 px-3 border-b border-yellow-200">
                <div className="h-5 bg-gradient-to-r from-yellow-200 to-orange-200 rounded w-28 mx-auto"></div>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div
                      key={j}
                      className="w-full h-24 rounded-md bg-gradient-to-br from-yellow-200 to-orange-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 ">
          {[4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-200 shadow-lg overflow-hidden"
            >
              <div className="py-2 px-3 border-b border-yellow-200">
                <div className="h-5 bg-gradient-to-r from-yellow-200 to-orange-200 rounded w-28 mx-auto"></div>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div
                      key={j}
                      className="w-full h-24 rounded-md bg-gradient-to-br from-yellow-200 to-orange-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

export default React.memo(BoxCategories);
