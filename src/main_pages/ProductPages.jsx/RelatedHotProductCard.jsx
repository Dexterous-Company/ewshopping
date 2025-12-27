"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const RelatedHotProductCard = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(
    product.thumbnail?.[0] || product.images?.default
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageSrc("/placeholder.jpg");
  };

  // label color same as original
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

  const calculateDiscount = () => {
    const price = product.priceRange || product.price;
    const mrp = product.mrpRange || product.mrp;
    if (!price || !mrp) return null;
    const d = Math.round(((mrp - price) / mrp) * 100);
    return d > 0 ? d : null;
  };

  const discount = calculateDiscount();

  // SAME TAG LOGIC
  const getTopTag = () => {
    if (product.label) {
      return {
        content: product.label,
        className: getLabelColor(product.label),
      };
    }
    if (product.HotProducts)
      return {
        content: "🔥 Hot Products",
        className:
          "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400",
      };

    if (product.Trending)
      return {
        content: "⚡ Trending",
        className:
          "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600",
      };

    return {
      content: "✨ Best Offer",
      className:
        "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600",
    };
  };

  const tag = getTopTag();

  return (
    <Link href={`/product/${product.slugUrl || product._id}`}>
      <div
        className="
          bg-white rounded-lg overflow-hidden
          flex flex-col h-full
          transition-transform duration-300
          hover:scale-[1.03] shadow-sm hover:shadow-lg
        "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* DISCOUNT */}
        {discount && (
          <span className="absolute top-1 right-1 z-10 text-xs font-bold text-white px-2 py-1 rounded bg-gradient-to-r from-indigo-500 to-emerald-600">
            {discount}% OFF
          </span>
        )}

        {/* IMAGE */}
        <div className="relative aspect-square">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-contain"
            onError={handleImageError}
          />

          {/* TAG */}
          <div className="absolute bottom-0 w-full">
            <div
              className={`text-white text-xs font-semibold text-center py-1 ${tag.className}
              transition-transform ${isHovered ? "scale-105" : ""}`}
            >
              {tag.content}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-2 flex flex-col flex-1">
          {/* ONE LINE NAME */}
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {product.name || product.title}
          </h3>

          {/* spacer = equal height magic */}
          <div className="flex-1" />

          {/* PRICE */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-bold text-blue-900">
              ₹{product.priceRange || product.price}
            </span>
            <span className="text-xs text-gray-500 line-through">
              ₹{product.mrpRange || product.mrp}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RelatedHotProductCard;
