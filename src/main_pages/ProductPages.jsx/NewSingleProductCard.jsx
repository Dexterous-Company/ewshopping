"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, memo, useCallback } from "react";

const NewSingleProductCard = memo(({ product }) => {
  const [imageSrc, setImageSrc] = useState(
    () =>
      product.thumbnail?.[0] || product.images?.default || "/placeholder.jpg"
  );
  const [isHovered, setIsHovered] = useState(false);

  // Memoize handlers to prevent recreations
  const handleImageError = useCallback(() => {
    setImageSrc("/placeholder.jpg");
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Memoize label color function
  const getLabelColor = useCallback((label) => {
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
  }, []);

  // Memoize discount calculation
  const discount = useMemo(() => {
    const currentPrice = product.priceRange || product.price;
    const originalPrice = product.mrpRange || product.oldPrice;

    if (!currentPrice || !originalPrice) return null;

    const discountValue = Math.round(
      ((originalPrice - currentPrice) / originalPrice) * 100
    );
    return discountValue > 0 ? discountValue : null;
  }, [product.priceRange, product.price, product.mrpRange, product.oldPrice]);

  // Memoize top tag selection
  const topTag = useMemo(() => {
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
        "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white text-xs px-2 py-1 font-semibold rounded shadow-md shadow-pink-400/30",
    };
  }, [
    product.label,
    product.HotProducts,
    product.Trending,
    product.Recommends,
    getLabelColor,
  ]);

  // Memoize product details
  const productName = useMemo(
    () => product.name || product.title || "",
    [product.name, product.title]
  );

  const productDescription = useMemo(
    () => product.shortDescription || product.subtitle || "",
    [product.shortDescription, product.subtitle]
  );

  const currentPrice = useMemo(
    () => product.priceRange || product.price || "N/A",
    [product.priceRange, product.price]
  );

  const originalPrice = useMemo(
    () => product.mrpRange || product.mrp || "N/A",
    [product.mrpRange, product.mrp]
  );

  const productUrl = useMemo(
    () => `/product/${product.slugUrl || product._id}`,
    [product.slugUrl, product._id]
  );

  // Memoize stock progress calculation
  const stockProgressWidth = useMemo(() => {
    if (product.sold !== undefined && product.available !== undefined) {
      return `${(product.sold / (product.sold + product.available)) * 100}%`;
    }
    return "0%";
  }, [product.sold, product.available]);

  // Determine if this is an LCP candidate (first few products)
  const isLCPCandidate = product.index < 5; // Assuming you pass index prop

  return (
    <Link href={productUrl} passHref legacyBehavior>
      <div
        className="bg-white rounded-lg relative overflow-hidden transition-transform duration-300 hover:scale-105 shadow-sm hover:shadow-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="link"
        tabIndex={0}
        aria-label={`View ${productName}`}
      >
        {/* Discount Badge */}
        {discount && discount > 0 && (
          <span
            className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-emerald-600 text-white text-xs px-2 py-1 font-bold rounded-lg z-10 shadow-lg transform group-hover:scale-105 transition-transform duration-300"
            aria-label={`${discount}% off`}
          >
            {discount}% OFF
          </span>
        )}

        {/* Product Images with Hover Effect */}
        <div className="relative aspect-square">
          <div className="relative aspect-square group">
            <div className="group relative w-full h-full">
              <Image
                src={imageSrc}
                alt={productName || "Product image"}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 180px"
                onError={handleImageError}
                priority={isLCPCandidate}
                loading={isLCPCandidate ? "eager" : "lazy"}
                unoptimized
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
              aria-label={topTag.content}
            >
              {topTag.content}
            </div>
          </div>

          {/* Stock Progress Bar */}
          {product.sold !== undefined && product.available !== undefined && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 px-3 py-2"
              aria-label={`Stock progress: ${product.sold} sold, ${product.available} available`}
            >
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-600">
                  Sold: <span className="text-[#212121]">{product.sold}</span>
                </span>
                <span className="text-gray-600">
                  Available:{" "}
                  <span className="text-[#212121]">{product.available}</span>
                </span>
              </div>
              <div
                className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={product.sold}
                aria-valuemin={0}
                aria-valuemax={product.sold + product.available}
              >
                <div
                  className="h-full bg-[#e96f84]"
                  style={{ width: stockProgressWidth }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-2">
          <h3 className="sm:text-sm text-xs font-semibold text-gray-900 line-clamp-2 mb-1">
            {productName}
          </h3>

          <p className="sm:text-xs text-[10px] text-gray-500 line-clamp-1">
            {productDescription}
          </p>

          {/* Price */}
          <div className="flex items-center">
            {discount === 50 && (
              <Image
                src="https://ewshoppingsellerapinew.dexterous.in/uploads/1759926575679.webp"
                alt="Special offer icon"
                width={28}
                height={28}
                className="object-contain ml-2"
                loading="lazy"
                sizes="28px"
              />
            )}
            <span
              className="text-sm font-bold text-blue-900"
              aria-label={`Price: ₹${currentPrice}`}
            >
              ₹{currentPrice}
            </span>
            <span
              className="sm:text-base text-xs text-gray-500 line-through ml-2"
              aria-label={`Original price: ₹${originalPrice}`}
            >
              ₹{originalPrice}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});

// Display name for debugging
NewSingleProductCard.displayName = "NewSingleProductCard";

export default NewSingleProductCard;
