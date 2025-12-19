"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchCardPromotions } from "@/redux/header/cardPromotionSlice";
import BannerGridSkeleton from "./BannerGridSkeleton";

const BannerGrid = () => {
  const {
    cardPromotions = [],
    loading,
    error,
  } = useSelector((state) => state.cPromotion);

  const allPromotions = [...cardPromotions, ...cardPromotions];
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = (e, promotion) => {
    e.preventDefault();
    if (promotion) {
      router.push(`/${promotion.categoryUrl}`);
    }
  };

  useEffect(() => {
    dispatch(fetchCardPromotions());
  }, [dispatch]);

  useEffect(() => {
    if (cardPromotions.length > 0) {
      setIsLoading(false);
    }
  }, [cardPromotions]);

  if (isLoading) {
    return <BannerGridSkeleton />;
  }

  return (
    <div className="relative px-2 overflow-hidden" ref={containerRef}>
      <div className="block">
        <div className="flex flex-row scroller-inner gap-3 sm:gap-4">
          {allPromotions.map((promotion, index) => {
            const altText =
              promotion.mainTitle || promotion.title || "Promotional banner";

            return (
              <div
                key={`banner-${promotion._id}-${index}`}
                onClick={(e) => handleClick(e, promotion)}
                className="
                  relative cursor-pointer aspect-[2/1] group flex-shrink-0
                  min-w-[calc(50vw-20px)]   /* Mobile: 2 items */
                  sm:min-w-[180px]          /* Tablet */
                  md:min-w-[230px]          /* Desktop (fixed width) */
                  lg:min-w-[260px]          /* Large desktop */
                  xl:min-w-[400px]          /* Extra large desktop */
                "
              >
                <a
                  href={`/${promotion.slugUrl}`}
                  className="hover_effect1 block size-full"
                >
                  <Image
                    src={promotion.desktopImage}
                    alt={altText}
                    fill
                    className="object-cover rounded-md"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 639px) 50vw, 33vw"
                    quality={75}
                    priority={false}
                  />

                  <div className="absolute inset-0 flex flex-col items-start justify-center p-1 sm:p-4 md:p-6 text-left z-10 text-black bg-gradient-to-r from-white/10 via-transparent to-transparent">
                    <h3
                      className="text-xs sm:text-sm md:text-lg lg:text-2xl font-bold mb-1 sm:mb-2 md:mb-3 
                        transition-all duration-500 group-hover:translate-x-[-8px]
                        line-clamp-2 sm:line-clamp-none"
                    >
                      {promotion.mainTitle ||
                        promotion.mainTite ||
                        "Special Offer"}
                    </h3>

                    <p
                      className="text-[10px] xs:text-xs sm:text-sm md:text-base mb-2 sm:mb-3 md:mb-4 
                        transition-all duration-500 group-hover:translate-x-[-5px]
                        line-clamp-2 sm:line-clamp-3 w-full max-w-[90%] sm:max-w-[80%]"
                    >
                      {promotion.title || "Discover amazing deals"}
                    </p>

                    <button
                      className="text-[10px] xs:text-xs sm:text-sm px-2.5 py-1.5 sm:px-4 sm:py-2 
                        bg-black/70 hover:bg-black/80 text-white rounded-md font-medium 
                        transition-all duration-300 opacity-0 group-hover:opacity-100 
                        transform translate-x-4 group-hover:translate-x-0
                        whitespace-nowrap shadow-lg"
                    >
                      {promotion.buttonText || "Shop Now"}
                    </button>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-md" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BannerGrid;
