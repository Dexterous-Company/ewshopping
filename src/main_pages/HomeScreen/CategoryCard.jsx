// CategoryCard.js
import React, { memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CategoryCard = ({ name, image, offer = [], textAlign = "center" }) => {
  const textAlignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[textAlign] || "text-center";

  const router = useRouter()
  const handleClick = (e, name) => {
    e.preventDefault();
    if (name) {
      // router.push(`/searchresults?categoryTag=${name}`)
      router.push(`/searchresults?categoryTag=${encodeURIComponent(name)}`)
    }
  };
  return (
    <div className="w-[100px] sm:w-[140px] md:w-[160px] flex-shrink-0">
      <div className="flex flex-col items-center justify-center cursor-pointer">
        <div className="relative aspect-square w-[80px] sm:w-[140px] overflow-hidden rounded-xl" onClick={(e) => handleClick(e, name)}>
          <Image
            src={image}
            alt={`${name} category`}
            fill
            sizes="(max-width: 640px) 80px, 140px"
            className="object-contain"
            loading="lazy"
            decoding="async"
            quality={100}
            priority={false}
          />
        </div>

        <div className={`px-1 sm:px-2 pt-1 pb-0 flex flex-col ${textAlignment}`}>
          <div className="font-medium text-xs sm:text-sm text-gray-800 truncate max-w-full leading-tight">
            {name.length > 10 ? `${name.slice(0, 10)}...` : name}
          </div>
          {offer.length > 0 && (
            <span className="text-green-800 font-bold text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md inline-block truncate whitespace-nowrap overflow-hidden leading-tight">
              {offer[0].length > 13 ? `${offer[0].slice(0, 13)}...` : offer[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CategoryCard);