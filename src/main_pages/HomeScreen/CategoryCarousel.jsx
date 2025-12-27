"use client";

import Image from "next/image";
import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSubCategory,
  resetSubCategories,
  getCategoryTags,
} from "@/redux/header/HeaderSubSlice";
import { useRouter } from "next/navigation";

const CategoryCarousel = () => {
  const scrollRef = useRef(null);
  const hoverCache = useRef(new Set()); // ✅ cache hover fetch
  const dispatch = useDispatch();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const hoverTimer = useRef(null);

  const { subCategories = [], status, error } = useSelector(
    (state) => state.subCat
  );

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    dispatch(resetSubCategories());
    dispatch(getSubCategory());

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  /* -------------------- SCROLL (DESKTOP ONLY) -------------------- */
  const handleWheel = useCallback((e) => {
    if (!scrollRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY * 1.5;
    }
  }, []);

  useEffect(() => {
    if (!isMobile && scrollRef.current) {
      const el = scrollRef.current;
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, [isMobile, handleWheel]);

  /* -------------------- HOVER FETCH (CACHED) -------------------- */
  const handleMouseEnter = (category) => {
    if (isMobile) return;

    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setHoveredCategory(category);

      if (!hoverCache.current.has(category.slugUrl)) {
        hoverCache.current.add(category.slugUrl);
        dispatch(getCategoryTags(category.slugUrl));
      }
    }, 250);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 250);
  };

  /* -------------------- CLICK -------------------- */
  const handleClick = (cat) => {
    router.push(`/${cat.categoryUrl}/${cat.slugUrl}`);
  };

  /* -------------------- LOADING -------------------- */
  if (status === "loading") {
    return (
      <div className="flex px-4 py-3 gap-3 overflow-x-auto">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="min-w-[100px] h-[140px] bg-gray-200 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-4 text-red-600 text-center">
        Failed to load categories
      </div>
    );
  }

  /* -------------------- RENDER -------------------- */
  return (
    <div className="relative bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-100">
      <div
        ref={scrollRef}
        className="flex gap-3 px-2 py-3 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {subCategories.map((cat, index) => (
          <div
            key={cat._id}
            className="min-w-[80px] sm:min-w-[100px] text-center cursor-pointer group"
            onMouseEnter={() => handleMouseEnter(cat)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(cat)}
          >
            <div className="relative w-[85px] h-[85px] mx-auto rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:scale-105 transition">
              <Image
                src={cat.desktopImage || cat.mobileImage}
                alt={cat.name}
                fill
                sizes="85px"
                className="object-cover"
                quality={80}
                loading={index < 4 ? "eager" : "lazy"} // ✅ ONLY FIRST
                priority={index < 4} // ✅ LCP SAFE
              />
            </div>

            <p className="mt-2 text-[12px] font-semibold text-slate-800 truncate">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(CategoryCarousel);
