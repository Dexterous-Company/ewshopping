import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const OffersProducts = ({ product }) => {
  // Calculate discount percentage
  const discountPercentage = product.mrpRange && product.priceRange
    ? Math.round(((parseInt(product.mrpRange) - parseInt(product.priceRange)) / parseInt(product.mrpRange)) * 100)
    : 0;


  return (
    <Link href={`/product/${product.slugUrl}`} className="bg-white rounded-lg relative overflow-hidden transition-shadow duration-300 shadow-sm hover:shadow-md">
      {/* Badge - Show discount if available */}
      {discountPercentage > 0 && (
        <span className="absolute top-2 left-2 text-white text-xs px-2 py-1 font-semibold rounded z-10 bg-red-600">
          {discountPercentage}% OFF
        </span>
      )}

      {/* Hot product badge */}
      {product.HotProducts && (
        <span className="absolute top-2 right-2 text-white text-xs px-2 py-1 font-semibold rounded z-10 bg-orange-500">
          HOT
        </span>
      )}

      {/* Images */}
      <div className="relative aspect-square">
        <div className="relative w-full h-full group">
          {product.thumbnail && product.thumbnail.length > 0 ? (
            <>
              <Image
                src={product.thumbnail[0]}
                alt={product.name}
                fill
                className="object-contain transition-opacity duration-300 group-hover:opacity-0"
              />
              <Image
                src={product.thumbnail[1] || product.thumbnail[0]}
                alt={`${product.name} Hover`}
                fill
                className="object-contain absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2 mb-1 h-10">
          {product.name?.length > 40
            ? `${product.name?.slice(0, 37)}...`
            : product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
          {product.shortDescription?.length > 50
            ? `${product.shortDescription?.slice(0, 47)}...`
            : product.shortDescription}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <p className="text-base font-bold text-[#212121]">
            ₹{product.priceRange}
          </p>
          {product.mrpRange && product.mrpRange !== product.priceRange && (
            <p className="text-xs line-through text-gray-400">
              ₹{product.mrpRange}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default OffersProducts;