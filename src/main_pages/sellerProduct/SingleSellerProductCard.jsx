"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const SingleSellerProductCard = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(
    product.thumbnail?.[0] || product.images?.default
  );
   const calculateDiscount = () => {
    const currentPrice = product.priceRange || product.price;
    const originalPrice = product.mrpRange || product.oldPrice;

    if (!currentPrice || !originalPrice) return null;

    const discount = Math.round(
      ((originalPrice - currentPrice) / originalPrice) * 100
    );
    return discount > 0 ? discount : null;
  };
  const [hoverImage, setHoverImage] = useState(product.images?.hover);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageSrc("https://via.placeholder.com/300");
     // Calculate discount percentage
  };

  // Helper function to get label color
  const getLabelColor = (label) => {
    const labelColors = {
      "Best Seller": "bg-gradient-to-r from-green-500 to-emerald-600",
      "New Arrival": "bg-gradient-to-r from-blue-500 to-cyan-600",
      "Limited Edition": "bg-gradient-to-r from-purple-500 to-pink-600",
      "Flash Sale": "bg-gradient-to-r from-red-500 to-orange-600",
      "Clearance Sale": "bg-gradient-to-r from-amber-500 to-yellow-500",
      NEW: "bg-green-600",
      SALE: "bg-orange-500",
    };
    return labelColors[label] || "bg-gradient-to-r from-gray-500 to-gray-700";
  };

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
        content: "⚡Trending",
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

    if (product.sponsored) {
      return {
        type: "sponsored",
        content: "Sponsored",
        className:
          "text-xs text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 px-2 py-1 rounded border border-gray-300 shadow-sm",
      };
    }

    return null;
  };
  const discount = calculateDiscount();
  const topTag = getTopTag();

  const renderRating = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
      }
    }
    return stars;
  };

  return (
    <Link href={`/product/${product.slugUrl || product._id}`} passHref>
      <div
        className="bg-white rounded-lg relative overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Top Tag - Shows only one tag with priority */}
  {discount > 0 && (
          <span className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500  to-emerald-600 text-white text-xs px-2 py-1 font-bold rounded-lg z-10 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
            {discount}% OFF
          </span>
        )}
        {/* Sponsored Tag */}
        {product.sponsored && !topTag && (
          <p className="absolute top-2 right-2 text-xs text-gray-400 bg-white bg-opacity-90 px-10 py-0.5 rounded z-10">
            {product.sponsored}
          </p>
        )}

        {/* Product Images with Hover Effect */}
        <div className="relative aspect-square">
          <div className="relative aspect-square group">
            <div className="group relative w-full h-full">
              <Image
                src={imageSrc}
                alt={product.name || product.title || "Product image"}
                fill
                className="object-fill"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={handleImageError}
                priority={false}
              />
            </div>
          </div>

          {/* Stock Progress Bar */}
          {product.sold !== undefined && product.available !== undefined && (
            <div className="flex bottom-0 left-0 right-0 bg-white bg-opacity-80 px-3 py-2">
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
         {topTag && (
            <div className=" w-full z-20">
              <div
                className={`w-full text-center  text-sm font-semibold text-white ${
                  topTag.className
                } transform transition-all duration-300 ${
                  isHovered ? "scale-105" : "scale-100"
                }`}
              >
                {topTag.content}
              </div>
            </div>
          )}
        {/* Product Details */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 h-10">
            {product.name || product.title}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-1 mb-2">
            {product.shortDescription || product.subtitle}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            <p className="text-base font-bold text-[#212121]">
              ₹{product.priceRange || product.price || "N/A"}
            </p>
            {(product.mrpRange || product.oldPrice) && (
              <p className="text-xs line-through text-gray-400">
                ₹{product.mrpRange || product.oldPrice}
              </p>
            )}
          </div>
          {/* {topTag && (
            <div className=" w-full z-20">
              <div
                className={`w-full text-center  text-sm font-semibold text-white ${
                  topTag.className
                } transform transition-all duration-300 ${
                  isHovered ? "scale-105" : "scale-100"
                }`}
              >
                {topTag.content}
              </div>
            </div>
          )} */}
          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">{renderRating(product.rating || 0)}</div>
            <span className="text-xs text-gray-500">
              ({product.sold || 0} sold)
            </span>
          </div>

          {/* Colors and Stock Status */}
          <div className="flex justify-between items-center">
            {/* Color Swatches */}
            {(product.colors || product.variants) && (
              <div className="flex gap-1">
                {(product.colors || []).slice(0, 4).map((color, index) => (
                  <span
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}

            {/* Low Stock Indicator */}
            {product.available !== undefined && product.available < 20 && (
              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded">
                {product.available < 10 ? "Low stock" : "Few left"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SingleSellerProductCard;
