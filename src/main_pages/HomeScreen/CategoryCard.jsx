// CategoryCard.js
import React, { memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CategoryCard = ({
  name,
  image,
  offer = [],
  textAlign = "center",
  price = "",
}) => {
  const textAlignment =
    {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[textAlign] || "text-center";

  const router = useRouter();
  const handleClick = (e, name) => {
    e.preventDefault();
    if (name) {
      router.push(`/searchresults?categoryTag=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className=" flex w-[75px] sm:w-[140px] md:w-[160px] flex-shrink-0 gap-10 mx-1">
      <div className="flex flex-col items-center justify-center cursor-pointer group rounded-xl border-4 border-[#ffb703] bg-gradient-to-b from-[#fff3c4] via-[#ffd166] to-[#f8961e]">
        {/* Card Container with enhanced styling */}
        <div
          className="relative aspect-square w-[80px] sm:w-[140px] overflow-hidden rounded-t-md border-transparent"
          onClick={(e) => handleClick(e, name)}
        >
          {/* Sale Badge */}
          <div className="absolute top-1 left-1 z-10 hidden md:block">
            <div className="bg-gradient-to-b from-[#ec6911] to-[#d3be22] text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-[1px] rounded-md shadow">
              SALE
            </div>
          </div>

          {/* Image Section */}
          <div className="flex items-center justify-center h-full bg-[#fffbe6] rounded-t-md">
            <div className="relative w-full h-full rounded-t-md">
              <Image
                src={image}
                alt={`${name} category`}
                fill
                sizes="(max-width: 640px) 80px, 140px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                quality={100}
                priority={false}
              />
            </div>
          </div>

          {/* Offer Badge at bottom */}
          {offer.length > 0 && (
            <div className="absolute bottom-1 left-0 right-0 mx-auto w-max max-w-[90%]">
              <div className="bg-gradient-to-b from-[#8E024D] to-[#c2185b] text-white text-[8px] sm:text-[10px] font-bold px-2 py-[2px] rounded-md shadow truncate">
                {offer[0].length > 12
                  ? `${offer[0].slice(0, 12)}...`
                  : offer[0]}
              </div>
            </div>
          )}
        </div>
        {/* Text Content - Keeping original layout */}
        <div className={` pb-0 py-1 flex flex-col ${textAlignment} w-full`}>
          <div className="bg-[#8E024D] text-white text-center rounded-b-xl py-0.5 sm:py-2 font-semibold text-[10px] sm:text-[13px] z-50">
            {name.length > 10 ? `${name.slice(0, 10)}...` : name}
          </div>

          {/* Price if available */}
          {price && (
            <div className="text-[#ec6911] font-bold text-[9px] sm:text-[11px] leading-tight mt-1">
              {price}
            </div>
          )}

          {/* Original offer text as fallback */}
          {/* {offer.length > 0 && !price && (
            <span className="text-green-800 font-bold text-[9px] sm:text-[12px] px-1.5 py-0.5 rounded-md inline-block truncate whitespace-nowrap overflow-hidden leading-tight">
              {offer[0].length > 13 ? `${offer[0].slice(0, 13)}...` : offer[0]}
            </span>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default memo(CategoryCard);
