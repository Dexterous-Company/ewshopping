import React from "react";
import "./HoverCss.css";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const FeaturedBrand = ({ title }) => {
  // Assuming your slice is named 'promotionBanner' in the Redux store
  const { promotionBanners, status, error } = useSelector((state) => state.bPromotion);

  const router = useRouter()
  if (status === "loading") {
    return <div>Loading promotion banners...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!promotionBanners || promotionBanners.length === 0) {
    return <div>No promotion banners available</div>;
  }



  const handleClick = (e, banner) => {
    e.preventDefault();
    if (banner) {
      router.push(`/searchresults?category=${encodeURIComponent(banner.category)}`)
    }
  };
  return (
    <div className="px-3 py-4 w-full block">
      <h4 className="mb-4 font-bold text-base sm:text-2xl">{title}</h4>
      <div className="flex gap-2 sm:gap-5 overflow-x-auto whitespace-nowrap category-scrollbar-hide cursor-pointer">
        {promotionBanners.map((banner) => (
          <div
            key={banner._id}
            onClick={(e) => handleClick(e, banner)}
            // w-[75%] md:w-[32%]  h-[100px] sm:h-[200px]
            className="relative flex-shrink-0 hover_effect1 w-[48%] sm:w-[75%] md:w-[32%] h-[100px] sm:h-[200px]  rounded-lg overflow-hidden" >
            <Image
              src={banner.desktopImage} // Using desktopImage from your data
              alt={banner.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 75vw, 32vw"
              priority={banner.priority <= 3} // Prioritize loading for top banners
            />
            {/* absolute bottom-0 w-full bg-[#2f415d]/80 text-white font-semibold text-[1.3rem] px-[14px] py-[10px] */}
            <div className="absolute bottom-0 w-full bg-[#2f415d]/80 text-white font-semibold text-sm sm:text-[1.3rem] px-[10px] sm:px-[14px] py-[6px] sm:py-[10px]">
              {banner.text || banner.name} {/* Fallback to name if text is empty */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBrand;