"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchBrandsByPromotion,
  clearPromotionData,
} from "../../redux/header/NewBrandSlice";

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

  // Use refs to track if data has been fetched
  const hasFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);

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

  // Memoized color scheme to prevent re-renders
  const diwaliColors = useMemo(() => ({
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
  }), []);

  const displayCategories = singleCategory ? [singleCategory] : categories;

  // Optimized data fetching - FIXED: Prevent double fetch
  useEffect(() => {
    // Skip if already fetching or fetched
    if (isFetchingRef.current || hasFetchedRef.current) return;

    const fetchPromotions = async () => {
      isFetchingRef.current = true;
      
      if (showAllPromotions) {
        const promotionTypes = ["promotionone", "promotiontwo", "promotionthree"];
        
        // Fetch all promotions sequentially to avoid overwhelming network
        for (const type of promotionTypes) {
          try {
            setLoadingStates(prev => ({ ...prev, [type]: true }));
            const result = await dispatch(fetchBrandsByPromotion(type)).unwrap();
            
            setAllPromotionData(prev => ({
              ...prev,
              [type]: result?.brands || [],
            }));
          } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            setAllPromotionData(prev => ({
              ...prev,
              [type]: [],
            }));
          } finally {
            setLoadingStates(prev => ({ ...prev, [type]: false }));
          }
        }
      } else {
        try {
          // Only fetch if not already loading
          if (!singlePromotionState?.loading) {
            await dispatch(fetchBrandsByPromotion(promotionType)).unwrap();
          }
        } catch (error) {
          console.error(`Error fetching ${promotionType}:`, error);
        }
      }
      
      hasFetchedRef.current = true;
      isFetchingRef.current = false;
    };

    fetchPromotions();

    return () => {
      if (!showAllPromotions) {
        dispatch(clearPromotionData());
      }
    };
  }, [dispatch, promotionType, showAllPromotions]);

  // FIX: Added optional chaining and default value for singlePromotionState
  const singlePromotionState = useSelector((store) => store?.newBrands || { brands: [], loading: false });

  // Memoized brand aggregation with proper fallbacks
  const getAllBrands = useCallback(() => {
    if (showAllPromotions) {
      return [
        ...(allPromotionData.promotionone || []),
        ...(allPromotionData.promotiontwo || []),
        ...(allPromotionData.promotionthree || []),
      ];
    } else {
      // FIX: Added proper fallback for singlePromotionState.brands
      return singlePromotionState?.brands || [];
    }
  }, [showAllPromotions, allPromotionData, singlePromotionState]);

  // Memoized brands data
  const brandsToUse = useMemo(() => getAllBrands(), [getAllBrands]);
  
  const isLoading = useMemo(() => {
    if (showAllPromotions) {
      return Object.values(loadingStates).some((state) => state);
    } else {
      // Check if we have data already loaded
      const hasData = singlePromotionState?.brands?.length > 0;
      const isLoadingState = singlePromotionState?.loading || false;
      
      // Only show loading if we don't have data AND we're loading
      return !hasData && isLoadingState;
    }
  }, [showAllPromotions, loadingStates, singlePromotionState]);

  // Memoized brand grouping by category
  const brandsByCategory = useMemo(() => {
    const grouped = {};

    displayCategories.forEach((category) => {
      const categoryBrands = (brandsToUse || [])
        .filter(
          (brand) =>
            brand?.category === category ||
            brand?.categoryUrl === category?.toLowerCase()
        )
        .slice(0, brandsPerCategory);
      grouped[category] = categoryBrands || [];
    });

    return grouped;
  }, [displayCategories, brandsToUse, brandsPerCategory]);

  // Optimized click handler with proper ARIA labels
  const handleClick = useCallback((e, brand) => {
    e.preventDefault();
    if (!brand?.name || !brand?.SubCategoryUrl) return;
    
    router.push(`/sb/${brand.SubCategoryUrl}/${brand.name}`, {
      scroll: false, // Prevent page jump
    });
  }, [router]);

  // Helper functions with proper fallbacks
  const getBrandLogo = useCallback((brand) => {
    if (!brand) return null;
    
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
  }, []);

  const getBrandName = useCallback((brand) => {
    if (!brand) return "Brand";
    
    return (
      brand.name || brand.brandName || brand.title || brand.brand || "Brand"
    );
  }, []);

  // Category Box Component - Memoized
  const CategoryBox = React.memo(({ category, brands, index }) => {
    const colors = diwaliColors[category] || diwaliColors.HeadPhones;

    return (
      <div
        className={`${colors.bg} ${colors.shadow} rounded-xl border-2 ${colors.accent} overflow-hidden min-h-[260px]`}
        role="region"
        aria-label={`${category} brands`}
      >
        <div className="py-2 px-3 border-b border-white/20">
          <h2
            className={`text-sm font-bold ${colors.text} text-center truncate`}
            id={`category-heading-${index}`}
          >
            {category}
          </h2>
        </div>

        <div className="p-3">
          <div 
            className="grid grid-cols-3 gap-2"
            role="list"
            aria-labelledby={`category-heading-${index}`}
          >
            {brands && brands.length > 0
              ? brands.map((brand, brandIndex) => (
                  <div 
                    key={brand?._id?.$oid || brand?._id || `brand-${category}-${brandIndex}`}
                    role="listitem"
                  >
                    <BrandCard brand={brand} colors={colors} index={brandIndex} />
                  </div>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <div key={`placeholder-${category}-${i}`} role="listitem">
                    <BrandPlaceholder colors={colors} index={i} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    );
  });

  CategoryBox.displayName = 'CategoryBox';

  // Brand Card Component - Memoized
  const BrandCard = React.memo(({ brand, colors, index }) => {
    if (!brand) return <BrandPlaceholder colors={colors} index={index} />;
    
    const brandLogo = getBrandLogo(brand);
    const brandName = getBrandName(brand);

    return (
      <button
        className="group relative w-full text-left focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md"
        aria-label={`View ${brandName} products`}
        onClick={(e) => handleClick(e, brand)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e, brand);
          }
        }}
      >
        <div className="relative w-full">
          {/* Brand Logo/Image Container */}
          <div className="relative w-full aspect-square mb-1 min-h-[80px]">
            {brandLogo ? (
              <div className="relative w-full h-full rounded-md overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-black/40 group-focus:scale-105 group-focus:shadow-2xl group-focus:shadow-black/40">
                <Image
                  src={brandLogo}
                  alt={`${brandName} logo`}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-110 group-focus:scale-110"
                  sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 120px"
                  priority={index < 3}
                  loading={index < 6 ? "eager" : "lazy"}
                  quality={75}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />

                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100"
                  aria-hidden="true"
                />

                <div 
                  className="absolute inset-0 border-2 border-transparent rounded-md transition-all duration-300 group-hover:border-white/50 group-hover:shadow-inset group-focus:border-white/50 group-focus:shadow-inset"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <div 
                className="w-full h-full rounded-md bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-yellow-500/50 group-focus:scale-105 group-focus:shadow-lg group-focus:shadow-yellow-500/50"
                aria-hidden="true"
              >
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
      </button>
    );
  });

  BrandCard.displayName = 'BrandCard';

  // Brand Placeholder Component
  const BrandPlaceholder = React.memo(({ colors, index }) => (
    <div 
      className="relative w-full aspect-square min-h-[80px]"
      aria-hidden="true"
      data-placeholder={true}
    >
      <div className="w-full h-full rounded-md bg-gradient-to-br from-white/20 to-transparent border-2 border-dashed border-white/30" />
    </div>
  ));

  BrandPlaceholder.displayName = 'BrandPlaceholder';

  return (
    <div className="sm:w-1/3" role="complementary" aria-label="Product categories">
      <div
        className="w-full mx-auto px-1"
        style={{ 
          minHeight: singleCategory ? '260px' : '520px',
        }}
      >
        {isLoading ? (
          <LoadingSkeleton singleCategory={singleCategory} />
        ) : singleCategory ? (
          <div className="">
            <CategoryBox
              category={singleCategory}
              brands={brandsByCategory[singleCategory] || []}
              index={0}
            />
          </div>
        ) : (
          <>
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              {displayCategories.slice(0, 3).map((category, index) => (
                <CategoryBox
                  key={category}
                  category={category}
                  brands={brandsByCategory[category] || []}
                  index={index}
                />
              ))}
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 ">
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

const LoadingSkeleton = React.memo(({ singleCategory = false }) => {
  const SkeletonItem = () => (
    <div className="w-full aspect-square min-h-[80px] rounded-md bg-gradient-to-br from-yellow-200 to-orange-200 animate-pulse" />
  );

  return (
    <div className="w-full mx-auto px-1" aria-label="Loading categories" role="status">
      {singleCategory ? (
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-200 shadow-lg overflow-hidden min-h-[260px]">
            <div className="py-2 px-3 border-b border-yellow-200">
              <div className="h-5 bg-gradient-to-r from-yellow-200 to-orange-200 rounded w-28 mx-auto"></div>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((j) => (
                  <SkeletonItem key={j} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-200 shadow-lg overflow-hidden min-h-[260px]"
              >
                <div className="py-2 px-3 border-b border-yellow-200">
                  <div className="h-5 bg-gradient-to-r from-yellow-200 to-orange-200 rounded w-28 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <SkeletonItem key={j} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl border-2 border-yellow-200 shadow-lg overflow-hidden min-h-[260px]"
              >
                <div className="py-2 px-3 border-b border-yellow-200">
                  <div className="h-5 bg-gradient-to-r from-yellow-200 to-orange-200 rounded w-28 mx-auto"></div>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <SkeletonItem key={j} />
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
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default React.memo(BoxCategories);