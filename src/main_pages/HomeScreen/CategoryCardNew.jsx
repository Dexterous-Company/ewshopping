import React, { memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CategoryCardNew = ({ name, image, offer = [], textAlign = "center" }) => {
  const textAlignment = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[textAlign] || "text-center";

  const router = useRouter()
  const handleClick = (e, name) => {
    e.preventDefault();
    if (name) {
      router.push(`/searchresults?categoryTag=${encodeURIComponent(name)}`)
    }
  };

  return (
    <div className="w-[75px] sm:w-[140px] md:w-[160px] flex-shrink-0 group">
      <div className="flex flex-col items-center justify-center cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:z-10">
        {/* Image Container with Hover Effects */}
        <div 
          className="relative aspect-square w-[80px] sm:w-[140px] overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-blue-200"
          onClick={(e) => handleClick(e, name)}
        >
          <Image
            src={image}
            alt={`${name} category`}
            fill
            sizes="(max-width: 640px) 80px, 140px"
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            quality={100}
            priority={false}
          />
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Offer Badge with Animation */}
          {offer.length > 0 && (
            <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
              <span className="bg-red-500 text-white font-bold text-[7px] sm:text-[10px] px-1.5 py-0.5 rounded-full animate-pulse shadow-sm">
                {offer[0].length > 8 ? `${offer[0].slice(0, 8)}...` : offer[0]}
              </span>
            </div>
          )}
        </div>

        {/* Text Container with Hover Effects */}
        <div className={`px-1 sm:px-2 pt-1 pb-0 flex flex-col ${textAlignment} w-full transition-all duration-300 group-hover:transform group-hover:-translate-y-1`}>
          <div className="font-medium text-[10px] sm:text-[9px] md:text-[14px] lg:text-[15px] xl:text-[15px] text-gray-800 truncate max-w-full leading-tight transition-colors duration-300 group-hover:text-blue-700">
            {name.length > 10 ? `${name.slice(0, 14)}...` : name}
          </div>
          
          {/* Secondary Offer Text */}
          {offer.length > 1 && (
            <span className="font-medium text-[10px] sm:text-[10px] md:text-[14px] lg:text-[15px] text-gray-800 truncate max-w-full leading-tight transition-colors duration-300 group-hover:text-blue-700">
              {offer[1].length > 13 ? `${offer[1].slice(0, 13)}...` : offer[1]}
            </span>
          )}
        </div>

        {/* Hover Indicator */}
        <div className="w-0 group-hover:w-4 h-0.5 bg-blue-500 rounded-full transition-all duration-300 mt-1" />
      </div>
    </div>
  );
};

export default memo(CategoryCardNew);