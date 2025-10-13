"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./HoverCss.css";
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = (e, promotion) => {
    e.preventDefault();
    // superCategory
    if (promotion) {
      router.push(
        `/searchresults?category=${encodeURIComponent(promotion.category)}`
      );
    }
  };

  useEffect(() => {
    dispatch(fetchCardPromotions());
  }, [dispatch]);

  useEffect(() => {
    // Simulate loading delay or use actual loading state from Redux
    if (cardPromotions.length > 0) {
      setIsLoading(false);
    }
  }, [cardPromotions]);

  // Show skeleton while loading
  if (isLoading) {
    return <BannerGridSkeleton />;
  }

  return (
    <div className="py-2 px-2">
      <div className="block">
        <div className="flex flex-row overflow-x-auto w-full space-x-4 scrollbar-hide">
          {cardPromotions.map((promotion) => {
            const altText =
              promotion.mainTitle || promotion.title || "Promotional banner";
            return (
              <div
                key={`banner-${promotion._id}`}
                className="relative min-w-[150px] sm:min-w-[400px] cursor-pointer aspect-[2/1] group flex-shrink-0"
                onClick={(e) => handleClick(e, promotion)}
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
                    sizes="(max-width: 767px) 100vw, 33vw"
                    quality={70}
                  />
                  <div className="absolute inset-0 flex flex-col items-start justify-center p-2 sm:p-6 text-left z-10 text-black">
                    <h3 className="text-[0.7rem] sm:mt-0 mt-6 sm:text-lg md:text-2xl font-bold mb-1 sm:mb-2 transition-all duration-500 group-hover:translate-x-[-10px]">
                      {promotion.mainTite}
                    </h3>
                    <p className="text-[0.5rem] sm:text-[0.7rem] sm:w-60 w-20  md:text-sm lg:text-base mb-2 sm:mb-4 transition-all duration-500 group-hover:translate-x-[-5px]">
                      {promotion.title}
                    </p>
                    <button className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-black/60 text-white rounded-md font-medium transition-all duration-300 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-4">
                      {promotion.buttonText}
                    </button>
                  </div>
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
