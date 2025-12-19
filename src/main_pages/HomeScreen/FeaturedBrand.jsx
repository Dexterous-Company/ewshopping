import React from "react";
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
    if (banner.category) {
      router.push(`/${banner.categoryUrl}`);
      return;
    }
    router.push("/");
  };

  return (
    <div className="px-2 w-full block">
      {/* Diwali Themed Header */}
      <div className="flex items-center gap-3 sm:mb-2 mb-0.5">
        <h4 className="text-left normal-case text-black text-[0.8rem] sm:text-base md:text-xl font-semibold">
          {title}
        </h4>
      </div>

      {/* Diwali Themed Banner Container */}
      <div className="relative">
        <div className="flex gap-3 sm:gap-5 overflow-x-auto whitespace-nowrap category-scrollbar-hide cursor-pointer">
          {promotionBanners.map((banner) => (
            <div
              key={banner._id?.$oid || banner._id}
              onClick={(e) => handleClick(e, banner)}
              className="relative flex-shrink-0 hover_effect1 w-[40vw] sm:w-[50vw] lg:w-[30vw] h-[80px] sm:h-[200px] rounded-xl overflow-hidden border-2 border-yellow-300/50 hover:border-yellow-400 transition-all duration-300 hover:scale-[1.02]"
            >
              <Image
                src={banner.desktopImage}
                alt={banner.name}
                fill
                className="sm:object-cover object-fill rounded-xl"
                sizes="(max-width: 768px) 75vw, 32vw"
                priority={banner.priority <= 3}
              />

              {/* Diwali Themed Text Overlay */}
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent text-black font-bold text-sm sm:text-[1.3rem] px-3 sm:px-5 py-2 sm:py-4">
                <div className="flex items-center gap-2">
                  {/* <span className="text-yellow-300 animate-pulse">🎁</span> */}
                  {/* {banner.text || banner.name} */}
                </div>
              </div>

              {/* Diwali Offer Badge */}
              {/* <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xs px-2 sm:px-3 py-1 rounded-full font-bold shadow-lg">
                Diwali Offer
              </div> */}
            </div>
          ))}
        </div>

        {/* Bottom Animated Border */}
      </div>
    </div>
  );
};

export default FeaturedBrand;
