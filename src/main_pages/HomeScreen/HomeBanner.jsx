"use client";

import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { getBanners } from "@/redux/header/BannerSlice";
import { useRouter } from "next/navigation";

const AUTO_PLAY_DELAY = 3500;

const HomeBanner = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { banners, status } = useSelector((state) => state.banner);

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const startX = useRef(0);

  /* ------------------------------------
     FETCH ONCE
  ------------------------------------ */
  useEffect(() => {
    if (status === "idle") dispatch(getBanners());
  }, [dispatch, status]);

  /* ------------------------------------
     AUTOPLAY
  ------------------------------------ */
  useEffect(() => {
    if (!banners?.length) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, AUTO_PLAY_DELAY);

    return () => clearInterval(intervalRef.current);
  }, [banners]);

  /* ------------------------------------
     TOUCH SUPPORT (MOBILE)
  ------------------------------------ */
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 50) return;

    setIndex((prev) =>
      diff > 0
        ? (prev + 1) % banners.length
        : (prev - 1 + banners.length) % banners.length
    );
  };

  const handleClick = useCallback(
    (banner) => {
      router.push(`/banner/${encodeURIComponent(banner.name)}`);
    },
    [router]
  );

  /* ------------------------------------
     SKELETON
  ------------------------------------ */
  if (status === "loading") {
    return (
      <div className="w-full  mb-5">
        <div className="h-[75px] sm:h-[180px] md:h-[250px] lg:h-[200px] bg-gray-200 animate-pulse " />
      </div>
    );
  }

  if (!banners?.length) return null;

  /* ------------------------------------
     UI
  ------------------------------------ */
  return (
    <section
      className="relative w-full overflow-hidden "
      aria-label="Promotional banners"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((banner, i) => (
          <div
            key={banner._id}
            className="relative min-w-full h-[75px] sm:h-[180px] md:h-[250px] lg:h-[200px] cursor-pointer"
            onClick={() => handleClick(banner)}
          >
            <Image
              src={banner.desktopImage}
              alt={banner.name}
              fill
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={`dot-${i}`} // ✅ FIX
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition ${
              index === i ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default memo(HomeBanner);
