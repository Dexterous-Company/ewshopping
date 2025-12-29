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

  /* FETCH */
  useEffect(() => {
    if (status === "idle") dispatch(getBanners());
  }, [dispatch, status]);

  /* AUTOPLAY */
  useEffect(() => {
    if (!banners?.length) return;

    const start = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setIndex((p) => (p + 1) % banners.length);
      }, AUTO_PLAY_DELAY);
    };

    const stop = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    const handleVisibility = () => {
      document.hidden ? stop() : start();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    start();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [banners?.length]); // Added ?. for safety

  /* TOUCH */
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

  return (
    <section
      className="relative w-full overflow-hidden "
      aria-label="Promotional banners"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* HEIGHT LOCK — SAME AS REAL SLIDE */}
      <div className="relative h-[75px] sm:h-[180px] md:h-[250px] lg:h-[200px]">
        {status === "loading" ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : (
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {banners?.map((banner, i) => (
              <div
                key={banner._id || `banner-${i}`} // FIX: Added fallback key
                className="relative min-w-full h-full cursor-pointer"
                onClick={() => handleClick(banner)}
              >
                <Image
                  src={banner.desktopImage}
                  alt={banner.name || `Banner ${i + 1}`}
                  fill
                  priority={i === 0}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  sizes="100vw"
                  className="object-cover"
                  onError={(e) => {
                    console.error("Failed to load banner image:", banner.desktopImage);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DOTS */}
      {banners?.length > 0 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition ${
                index === i ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default memo(HomeBanner);