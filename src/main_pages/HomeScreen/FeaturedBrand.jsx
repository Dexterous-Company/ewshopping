import React from "react";
import "./HoverCss.css";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const FeaturedBrand = ({ title }) => {
  const { promotionBanners, status, error } = useSelector(
    (state) => state.bPromotion
  );
  const router = useRouter();

  if (status === "loading") return <div>Loading promotion banners...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  if (!promotionBanners?.length)
    return <div>No promotion banners available</div>;

  const handleClick = (e, banner) => {
    e.preventDefault();
    if (!banner) return;

    const bannerName = (banner.name || "").toLowerCase();
    const bannerText = (banner.text || "").toLowerCase();
    const slugUrl = banner.slugUrl || "";

    // Enhanced iOS/Mega Event detection
    const isIOSBanner =
      bannerName.includes("ios") ||
      bannerName.includes("iphone") ||
      bannerName.includes("apple") ||
      bannerText.includes("ios") ||
      bannerText.includes("iphone") ||
      bannerText.includes("apple") ||
      slugUrl.includes("ios") ||
      slugUrl.includes("iphone");

    // If it's an iOS-related banner, navigate to mega event page
    if (isIOSBanner) {
      router.push("/mega-event-ios");
      return;
    }

    // Fallback to category navigation
    if (banner.category) {
      router.push(
        `/searchresults?category=${encodeURIComponent(banner.category)}`
      );
      return;
    }

    // Final fallback
    router.push("/");
  };

  const isIOSBanner = (banner) => {
    const bannerName = (banner.name || "").toLowerCase();
    const bannerText = (banner.text || "").toLowerCase();
    const slugUrl = (banner.slugUrl || "").toLowerCase();

    return (
      bannerName.includes("ios") ||
      bannerName.includes("iphone") ||
      bannerName.includes("apple") ||
      bannerText.includes("ios") ||
      bannerText.includes("iphone") ||
      slugUrl.includes("ios") ||
      slugUrl.includes("iphone")
    );
  };

  return (
    <div className="px-3 pb-6  w-full block">
      <h4 className="text-left normal-case text-blue-950 text-[0.8rem] sm:text-base md:text-xl font-semibold mb-2">
        {title}
      </h4>
      <div className="flex gap-2 sm:gap-5 overflow-x-auto whitespace-nowrap category-scrollbar-hide cursor-pointer">
        {promotionBanners.map((banner) => (
          <div
            key={banner._id?.$oid || banner._id}
            onClick={(e) => handleClick(e, banner)}
            className={`relative flex-shrink-0 hover_effect1 w-[40vw] sm:w-[50vw] lg:w-[30vw] h-[80px] sm:h-[200px] rounded-lg overflow-hidden ${
              isIOSBanner(banner) ? "ring-2 ring-blue-500 shadow-lg" : ""
            }`}
          >
            <Image
              src={banner.desktopImage}
              alt={banner.name}
              fill
              className="sm:object-cover object-fill rounded-lg"
              sizes="(max-width: 768px) 75vw, 32vw"
              priority={banner.priority <= 3}
            />
            <div className="absolute bottom-0 w-full bg-[#2f415d]/80 text-white font-semibold text-sm sm:text-[1.3rem] px-[10px] sm:px-[14px] py-[6px] sm:py-[10px]">
              {banner.text || banner.name}
            </div>

            {isIOSBanner(banner) && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs  px-2 sm:px-3 py-1 rounded-full font-bold shadow-lg">
                Mega Event
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBrand;
