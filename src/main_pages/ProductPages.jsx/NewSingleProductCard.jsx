"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NewSingleProductCard = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(
    product.thumbnail?.[0] || product.images?.default
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageSrc("/placeholder.jpg");
  };

  // Determine label color based on type
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

  // Calculate discount percentage
  const calculateDiscount = () => {
    const currentPrice = product.priceRange || product.price;
    const originalPrice = product.mrpRange || product.oldPrice;

    if (!currentPrice || !originalPrice) return null;

    const discount = Math.round(
      ((originalPrice - currentPrice) / originalPrice) * 100
    );
    return discount > 0 ? discount : null;
  };

  const discount = calculateDiscount();

  // Determine which single tag to show (priority order)
  const getTopTag = () => {
    // Priority order: label > HotProducts > Trending > Recommends > sponsored
    if (product.label) {
      return {
        type: "label",
        content: product.label,
        className: `text-white text-xs px-2 py-1 font-semibold rounded ${getLabelColor(
          product.label
        )}`,
      };
    }

    if (product.HotProducts) {
      return {
        type: "hot",
        content: "🔥 Hot Products",
        className:
          "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-white text-xs px-2 py-1 font-semibold rounded shadow-md shadow-orange-300/30",
      };
    }

    if (product.Trending) {
      return {
        type: "trending",
        content: "⚡ Trending",
        className:
          "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white text-xs px-2 py-1 font-semibold rounded shadow-md shadow-pink-400/30",
      };
    }

    if (product.Recommends) {
      return {
        type: "recommended",
        content: "⭐ Recommended",
        className:
          "bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 text-white text-xs px-2 py-1 font-semibold rounded shadow-md shadow-blue-300/30",
      };
    }


    // Default tag when none of the above are present
    return {
      type: "✨ Best Offer",
      content: "✨ Best Offer",
      className:
  "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white text-xs px-2 py-1 font-semibold rounded shadow-md shadow-pink-400/30"
    };
  };

  const topTag = getTopTag();

  return (
    <Link href={`/product/${product.slugUrl || product._id}`} passHref>
      <div
        className="bg-white rounded-lg relative overflow-hidden transition-transform duration-300 hover:scale-105 shadow-sm hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500  to-emerald-600 text-white text-xs px-2 py-1 font-bold rounded-lg z-10 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
            {discount}% OFF
          </span>
        )}

        {/* Product Images with Hover Effect */}
        <div className="relative aspect-square">
          <div className="relative aspect-square group">
            <div className="group relative w-full h-full">
              <Image
                src={imageSrc}
                alt={product.name || product.title || "Product image"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={handleImageError}
                priority={false}
              />
            </div>
          </div>
          
          {/* Always show the tag - now includes default "Classic" */}
          <div className="bottom-0 left-0 w-full z-20">
            <div
              className={`w-full text-center py-1 text-sm font-semibold text-white
                ${topTag.className} transform transition-all duration-300
                ${isHovered ? "scale-105" : "scale-100"}
              `}
            >
              {topTag.content}
            </div>
          </div>

          {/* Stock Progress Bar */}
          {product.sold !== undefined && product.available !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 px-3 py-2">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-600">
                  Sold: <span className="text-[#212121]">{product.sold}</span>
                </span>
                <span className="text-gray-600">
                  Available:{" "}
                  <span className="text-[#212121]">{product.available}</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#e96f84]"
                  style={{
                    width: `${
                      (product.sold / (product.sold + product.available)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-2">
          <h3 className="sm:text-sm text-xs font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name || product.title}
          </h3>

          <p className="sm:text-xs text-[10px] text-gray-500 line-clamp-1">
            {product.shortDescription || product.subtitle}
          </p>

          {/* Price */}
          <div className="flex items-center">
            {discount === 50 && (
              <img
                src="https://ewshoppingsellerapinew.dexterous.in/uploads/1759926575679.webp"
                alt="icon"
                className="h-7 w-7 object-contain ml-2"
              />
            )}
            <span className="text-sm font-bold text-blue-900">
              ₹{product.priceRange || product.price || "N/A"}
            </span>
            <span className="sm:text-base text-xs text-gray-500 line-through ml-2">
              ₹{product.mrpRange || product.mrp || "N/A"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewSingleProductCard;