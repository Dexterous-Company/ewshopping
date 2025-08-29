import Image from "next/image";
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ScrollProduct = ({ product }) => {
  return (
    <div className="bg-white relative h-[26vh] px-2 py-2  transition-shadow duration-300">
      {/* Images */}
      <div className="relative ">
        <div className="relative w-full h-[13vh] group">
          <Image
            src={product.images?.default}
            alt={product.title}
            loading="lazy"
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-0"
          />
          <Image
            src={product.images?.hover}
            alt={`${product.title} Hover`}
            loading="lazy"
            fill
            className="object-contain absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="px-3 mt-2">
        {product.sponsored && (
          <p className="text-xs text-gray-400 mb-1">{product.sponsored}</p>
        )}

        <h3 className="text-xs font-semibold line-clamp-2 mb-1">
          {product.title?.length > 15
            ? `${product.title?.slice(0, 14)} ...`
            : product.title}
        </h3>

        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-[#212121]">{product.price}</p>
          {product.oldPrice && (
            <p className="text-xs line-through text-gray-400">
              {product.oldPrice}
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, index) => {
              const rating = product.rating;
              if (index + 1 <= rating) return <FaStar key={index} size={12} />;
              else if (index < rating)
                return <FaStarHalfAlt key={index} size={12} />;
              else return <FaRegStar key={index} size={12} />;
            })}
          </div>
          <span className="text-xs text-gray-500">({product.sold})</span>
        </div>
      </div>
    </div>
  );
};

export default ScrollProduct;
