"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const SingleProductCard = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(product.thumbnail?.[0] || product.images?.default);
  const [hoverImage, setHoverImage] = useState(product.images?.hover);

  const handleImageError = () => {
    setImageSrc('https://via.placeholder.com/300'); // Higher resolution placeholder
  };

  const renderRating = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
      }
    }
    return stars;
  };

  // Determine label color based on type
  const getLabelColor = (label) => {
    switch (label) {
      case 'NEW':
        return 'bg-green-600';
      case 'SALE':
        return 'bg-orange-500';
      case 'Best seller':
        return 'bg-red-600';
      default:
        return 'bg-[#e96f84]';
    }
  };

  return (
    <Link href={`/product/${product.slugUrl || product._id}`} passHref>
      <div className="bg-white rounded-lg relative overflow-hidden transition-transform duration-300 hover:scale-105 shadow-md hover:shadow-lg">
        {/* Product Label */}
        {product.label && (
          <span className={`absolute top-2 left-2 text-white text-xs px-2 py-1 font-semibold rounded z-10 ${getLabelColor(product.label)}`}>
            {product.label}
          </span>
        )}

        {/* Sponsored Tag */}
        {product.sponsored && (
          <p className="absolute top-2 right-2 text-xs text-gray-400 bg-white bg-opacity-90 px-2 py-0.5 rounded">
            {product.sponsored}
          </p>
        )}

        {/* Product Images with Hover Effect */}
        <div className="relative aspect-square ">
          <div className="relative w-full h-full group ">
            <div className="group relative w-full h-full">
              <Image
                src={imageSrc}
                alt={product.name || product.title || "Product image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={handleImageError}
                priority={false}
              />
            </div>
            
          </div>

          {/* Stock Progress Bar */}
          {(product.sold !== undefined && product.available !== undefined) && (
            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 px-3 py-2">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-600">
                  Sold: <span className="text-[#212121]">{product.sold}</span>
                </span>
                <span className="text-gray-600">
                  Available: <span className="text-[#212121]">{product.available}</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#e96f84]"
                  style={{
                    width: `${(product.sold / (product.sold + product.available)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

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

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {renderRating(product.rating || 0)}
            </div>
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

export default SingleProductCard;