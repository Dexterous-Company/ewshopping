"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const SingleProductCard = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(
    product.thumbnail?.[0] || product.images?.default
  );

  const handleImageError = () => {
    setImageSrc("https://via.placeholder.com/300");
  };

  // Label color
  const getLabelColor = (label) => {
    switch (label) {
      case "NEW":
        return "bg-green-600";
      case "SALE":
        return "bg-orange-500";
      case "Best seller":
        return "bg-red-600";
      default:
        return "bg-[#e96f84]";
    }
  };

  // Discount (memoized)
  const discount = useMemo(() => {
    const current = product.priceRange || product.price;
    const original = product.mrpRange || product.oldPrice;
    if (!current || !original) return null;
    const d = Math.round(((original - current) / original) * 100);
    return d > 0 ? d : null;
  }, [product]);

  // Top tag (memoized)
  const topTag = useMemo(() => {
    if (product.label) {
      return {
        content: product.label,
        className: `text-white text-xs px-2 py-1 font-semibold rounded ${getLabelColor(
          product.label
        )}`,
      };
    }
    if (product.HotProducts) {
      return {
        content: "🔥 Hot Products",
        className:
          "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-white text-xs px-2 py-1 font-semibold rounded",
      };
    }
    if (product.Trending) {
      return {
        content: "⚡ Trending",
        className:
          "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white text-xs px-2 py-1 font-semibold rounded",
      };
    }
    if (product.Recommends) {
      return {
        content: "⭐ Recommended",
        className:
          "bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 text-white text-xs px-2 py-1 font-semibold rounded",
      };
    }
    if (product.sponsored) {
      return {
        content: "Sponsored",
        className:
          "text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded border",
      };
    }
    return null;
  }, [product]);

  return (
    <Link
      href={`/product/${product.slugUrl || product._id}`}
      prefetch={false}
    >
      <div className="bg-white rounded-lg relative overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
        
        {/* Discount badge */}
        {discount && (
          <span className="absolute top-1 right-1 z-10 bg-gradient-to-r from-indigo-500 to-emerald-600 text-white text-xs px-2 py-1 font-bold rounded-md">
            {discount}% OFF
          </span>
        )}

        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
            <Image
              src={imageSrc}
              alt={product.name || "Product"}
              fill
              className="object-contain"
              sizes="(max-width:768px) 100vw, 50vw"
              onError={handleImageError}
            />
          </div>

          {/* Tag */}
          {topTag && (
            <div className="absolute bottom-0 left-0 w-full">
              <div className="w-full text-center py-1 text-sm font-semibold text-white transition-transform duration-300 group-hover:scale-105">
                <span className={topTag.className}>{topTag.content}</span>
              </div>
            </div>
          )}
        </div>

        {/* Product details */}
        <div className="p-2">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2">
            {product.name || product.title}
          </h3>

          <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
            {product.shortDescription || product.subtitle}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-blue-900">
              ₹{product.priceRange || product.price || "N/A"}
            </span>
            <span className="text-xs text-gray-500 line-through">
              ₹{product.mrpRange || product.mrp || "N/A"}
            </span>

            {discount === 50 && (
              <img
                src="https://ewshoppingsellerapinew.dexterous.in/uploads/1759926575679.webp"
                alt="offer"
                className="h-6 w-6 object-contain"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SingleProductCard;
