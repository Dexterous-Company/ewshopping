"use client";

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "@/redux/header/BannerSlice";
import { useRouter } from "next/navigation";


const HomeBanner = () => {
  const dispatch = useDispatch();
  const { banners, status, error } = useSelector((state) => state.banner);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="w-[98%] mb-5 sm:mb-0 h-auto mx-auto">
        <div className="w-full h-[120px] sm:h-[180px] md:h-[250px] lg:h-[200px] bg-gray-200 animate-pulse rounded-md" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="w-[98%] mb-5 sm:mb-0 h-auto mx-auto text-red-500">
        Error loading banners: {error}
      </div>
    );
  }
  const router = useRouter()
  const handleClick = (e, banner) => {
    e.preventDefault();
    if (banner) {
      router.push(`/searchresults?productTag=${encodeURIComponent(banner.name)}`);
    }
  };

  return (
    <div className="w-[100%] mb-5 sm:mb-0 h-auto " id="swi_cont">
      <Swiper
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        modules={[Autoplay]}
        className="mySwiper"
      >
        {banners?.map((banner, index) => (
          <SwiperSlide key={banner._id} onClick={(e) => handleClick(e, banner)}>
            <div className="relative w-full h-[75px] sm:h-[180px] md:h-[250px] lg:h-[200px]">
              <Image
                src={banner.desktopImage}
                alt={banner.name || `Banner ${index + 1}`}
                fill
                className="sm:object-fill object-cover"
                priority={index < 2} // Prioritize first 2 images
                sizes="100vw"
              />

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default React.memo(HomeBanner);
// "use client";
// import React, { useEffect } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";
// import Image from "next/image";
// import { useDispatch, useSelector } from "react-redux";
// import { getBanners } from "@/redux/header/BannerSlice";
// import { useRouter } from "next/navigation";

// const HomeBanner = () => {
//   const dispatch = useDispatch();
//   const { banners, status, error } = useSelector((state) => state.banner);

//   useEffect(() => {
//     dispatch(getBanners());
//   }, [dispatch]);

//   if (status === "loading") {
//     return (
//       <div className="w-[98%] mb-5 sm:mb-0 h-auto mx-auto">
//         <div className="w-full h-[120px] sm:h-[180px] md:h-[250px] lg:h-[200px] bg-gray-200 animate-pulse rounded-md" />
//       </div>
//     );
//   }

//   if (status === "failed") {
//     return (
//       <div className="w-[98%] mb-5 sm:mb-0 h-auto mx-auto text-red-500">
//         Error loading banners: {error}
//       </div>
//     );
//   }

//   const router = useRouter();
  
//   const handleClick = (e, banner) => {
//     e.preventDefault();
//     if (banner) {
//       router.push(`/searchresults?productTag=${encodeURIComponent(banner.name)}`);
//     }
//   };

//   // Create array where first banner appears after every other banner
//   const getEnhancedBanners = () => {
//     if (!banners || banners.length === 0) return [];
    
//     const firstBanner = banners[0];
//     const otherBanners = banners.slice(1);
    
//     const enhancedBanners = [];
    
//     // Add first banner
//     enhancedBanners.push(firstBanner);
    
//     // For each other banner, add it followed by first banner
//     otherBanners.forEach(banner => {
//       enhancedBanners.push(banner);
//       enhancedBanners.push(firstBanner);
//     });
    
//     return enhancedBanners;
//   };

//   const enhancedBanners = getEnhancedBanners();

//   return (
//     <div className="w-[100%] mb-5 sm:mb-0 h-auto " id="swi_cont">
//       <Swiper
//         autoplay={{
//           delay: 3000,
//           disableOnInteraction: false,
//           pauseOnMouseEnter: true,
//         }}
//         loop={true}
//         modules={[Autoplay]}
//         className="mySwiper"
//       >
//         {enhancedBanners.map((banner, index) => (
//           <SwiperSlide key={`${banner._id}-${index}`} onClick={(e) => handleClick(e, banner)}>
//             <div className="relative w-full h-[120px] sm:h-[180px] md:h-[250px] lg:h-[200px]">
//               <Image
//                 src={banner.desktopImage}
//                 alt={banner.name || `Banner ${index + 1}`}
//                 fill
//                 className="object-fit"
//                 priority={index < 3} // Prioritize first few images
//                 sizes="100vw"
//               />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default React.memo(HomeBanner);
