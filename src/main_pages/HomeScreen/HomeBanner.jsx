"use client";

import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
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
  const router = useRouter();
  const handleClick = (e, banner) => {
    e.preventDefault();
    if (banner) {
      router.push(`/banner/${encodeURIComponent(banner.name)}`);
    }
  };

  return (
    <div
      className="w-[100%]  h-auto sm:px-0 px-2 sm:rounded-none rounded-xl"
      id="swi_cont"
    >
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
        {banners?.map((banner, index) => {
          const isLCP = index === 0; // ✅ define here

          return (
            <SwiperSlide
              key={banner._id}
              onClick={(e) => handleClick(e, banner)}
            >
              <div className="relative w-full h-[75px] sm:h-[180px] md:h-[250px] lg:h-[200px]">
                <Image
                  src={banner.desktopImage}
                  alt={banner.name || `Banner ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={isLCP} // ✅ only first image
                  loading={isLCP ? "eager" : undefined}
                  sizes="100vw"
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default React.memo(HomeBanner);
