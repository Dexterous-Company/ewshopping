"use client";

import React, { memo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { getSubCategory } from "../../redux/header/HeaderSubSlice";

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const { subCategories, status } = useSelector(
    (state) => state.subCat
  );

  // 🔥 ONLY ON PAGE REFRESH
  useEffect(() => {
    if (status === "idle") {
      dispatch(getSubCategory());
    }
  }, [dispatch, status]);

  return (
    <section className="relative bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-100">
      <div
        ref={scrollRef}
        className="flex gap-3 px-2 py-3 overflow-x-auto no-scrollbar"
        style={{ minHeight: 130 }}
      >
        {subCategories.map((subCat, index) => (
          <Link
            key={subCat._id}
            href={`/${subCat.categoryUrl}/${subCat.slugUrl}`}
            className="min-w-[80px] sm:min-w-[100px] text-center cursor-pointer"
          >
            <div className="relative w-[85px] h-[85px] mx-auto rounded-full overflow-hidden border-2 border-white shadow-lg">
              <Image
                src={subCat.desktopImage || subCat.mobileImage}
                alt={subCat.name}
                fill
                priority={index < 4}
                sizes="85px"
                className="object-cover"
              />
            </div>

            <p className="mt-2 text-[12px] h-[16px] font-semibold text-slate-800 truncate">
              {subCat.name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default memo(CategoryCarousel);
