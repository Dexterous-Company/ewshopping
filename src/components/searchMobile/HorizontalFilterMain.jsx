"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  IoFilter,
  IoStar,
  IoPricetag,
  IoBag,
  IoColorPalette,
  IoClose,
  IoArrowUp,
  IoArrowDown,
  IoCalendar,
  IoTrendingUp,
} from "react-icons/io5";

const HorizontalFilterMain = ({ filters = {} }) => {
  const searchParams = useSearchParams();

  // Get current active filters from URL
  const currentSort = searchParams.get("sort") || "relevance";
  const currentBrands = searchParams.getAll("brand") || [];
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const currentColor = searchParams.get("color") || "";

  // Sort options for horizontal display with icons
  const sortOptions = [
    { value: "relevance", label: "Relevance", icon: IoTrendingUp },
    { value: "price_asc", label: "Price: Low to High", icon: IoArrowDown },
    { value: "price_dsc", label: "Price: High to Low", icon: IoArrowUp },
    { value: "newest", label: "Newest First", icon: IoCalendar },
  ];

  // Create URL with updated filter
  const createFilterUrl = (key, value, isArray = false) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page"); // Reset to first page when filter changes

    if (isArray) {
      // For array parameters like brand
      const currentValues = params.getAll(key);
      if (currentValues.includes(value)) {
        // Remove if already exists
        params.delete(key);
        currentValues
          .filter((v) => v !== value)
          .forEach((v) => params.append(key, v));
      } else {
        // Add new value
        params.append(key, value);
      }
    } else {
      // For single value parameters
      if (params.get(key) === value || !value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    return `?${params.toString()}`;
  };

  // Check if a filter is active
  const isFilterActive = (type, value) => {
    switch (type) {
      case "sort":
        return currentSort === value;
      case "brand":
        return currentBrands.includes(value);
      case "category":
        return currentCategory === value;
      case "price":
        return currentMinPrice || currentMaxPrice;
      default:
        return false;
    }
  };

  // Clear specific filter
  const createClearFilterUrl = (filterType) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    switch (filterType) {
      case "brand":
        params.delete("brand");
        break;
      case "category":
        params.delete("category");
        break;
      case "price":
        params.delete("minPrice");
        params.delete("maxPrice");
        break;
      case "color":
        params.delete("color");
        break;
      case "sort":
        params.delete("sort");
        break;
    }

    return `?${params.toString()}`;
  };

  // Get icon for brand (you can customize this based on your brand data)
  const getBrandIcon = (brandName) => {
    const brandIcons = {
      // Add specific brand icons here if needed
      default: IoBag,
    };
    return brandIcons[brandName] || brandIcons.default;
  };

  // Get icon for category
  const getCategoryIcon = (categoryName) => {
    const categoryIcons = {
      // Add specific category icons here
      "Home Decor": IoStar,
      Electronics: IoPricetag,
      Clothing: IoBag,
      Food: IoColorPalette,
      default: IoFilter,
    };
    return categoryIcons[categoryName] || categoryIcons.default;
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 to-orange-5 ">
      {/* Active Filters */}
      {(currentBrands.length > 0 ||
        currentCategory ||
        currentMinPrice ||
        currentMaxPrice ||
        currentColor ||
        currentSort !== "relevance") && (
        <div className="px-3 py-0.5 border-b border-amber-200 bg-gradient-to-r from-orange-100 to-amber-100">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-sm text-black whitespace-nowrap font-medium flex items-center gap-1">
              <IoFilter className="text-black" size={16} />
              Active filters:
            </span>

            {/* Sort filter */}
            {currentSort !== "relevance" && (
              <Link
                href={createClearFilterUrl("sort")}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full whitespace-nowrap hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-md"
              >
                {sortOptions.find((opt) => opt.value === currentSort)?.icon &&
                  React.createElement(
                    sortOptions.find((opt) => opt.value === currentSort)?.icon,
                    {
                      size: 12,
                      className: "text-yellow-200",
                    }
                  )}
                {sortOptions.find((opt) => opt.value === currentSort)?.label}
                <IoClose className="ml-1 text-yellow-200" size={12} />
              </Link>
            )}

            {/* Brand filters */}
            {currentBrands.map((brand) => {
              const BrandIcon = getBrandIcon(brand);
              return (
                <Link
                  key={brand}
                  href={createFilterUrl("brand", brand, true)}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full whitespace-nowrap hover:from-amber-200 hover:to-orange-200 transition-all duration-200 border border-amber-300 shadow-sm"
                >
                  <BrandIcon size={12} className="text-amber-600" />
                  {brand}
                  <IoClose className="ml-1 text-amber-600" size={12} />
                </Link>
              );
            })}

            {/* Category filter */}
            {currentCategory && (
              <Link
                href={createClearFilterUrl("category")}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full whitespace-nowrap hover:from-amber-200 hover:to-orange-200 transition-all duration-200 border border-amber-300 shadow-sm"
              >
                <IoPricetag size={12} className="text-amber-600" />
                {currentCategory}
                <IoClose className="ml-1 text-amber-600" size={12} />
              </Link>
            )}

            {/* Price filter */}
            {(currentMinPrice || currentMaxPrice) && (
              <Link
                href={createClearFilterUrl("price")}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full whitespace-nowrap hover:from-amber-200 hover:to-orange-200 transition-all duration-200 border border-amber-300 shadow-sm"
              >
                <IoPricetag size={12} className="text-amber-600" />₹
                {currentMinPrice || 0} - ₹{currentMaxPrice || "10000+"}
                <IoClose className="ml-1 text-amber-600" size={12} />
              </Link>
            )}

            {/* Color filter */}
            {currentColor && (
              <Link
                href={createClearFilterUrl("color")}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full whitespace-nowrap hover:from-amber-200 hover:to-orange-200 transition-all duration-200 border border-amber-300 shadow-sm"
              >
                <IoColorPalette size={12} className="text-amber-600" />
                {currentColor}
                <IoClose className="ml-1 text-amber-600" size={12} />
              </Link>
            )}

            {/* Clear all */}
            {(currentBrands.length > 0 ||
              currentCategory ||
              currentMinPrice ||
              currentMaxPrice ||
              currentColor ||
              currentSort !== "relevance") && (
              <Link
                href={`?${new URLSearchParams({
                  q: searchParams.get("q") || "",
                })}`}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-orange-600 border-2 border-orange-500 rounded-full whitespace-nowrap hover:bg-orange-500 hover:text-white transition-all duration-200 font-medium shadow-sm"
              >
                <IoClose size={12} />
                Clear All
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Filter Scroll */}
      <div className="px-2 py-0.5">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-0.5">
          {/* Sort Options */}
          {sortOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Link
                key={option.value}
                href={createFilterUrl("sort", option.value)}
                className={`inline-flex items-center gap-2 px-4 text-sm rounded-2xl whitespace-nowrap transition-all duration-300 border-1 ${
                  isFilterActive("sort", option.value)
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border-orange-500 shadow-lg"
                    : "bg-white text-amber-800 border-amber-300 hover:border-orange-400 hover:shadow-md hover:scale-105"
                }`}
              >
                <IconComponent
                  size={14}
                  className={
                    isFilterActive("sort", option.value)
                      ? "text-yellow-200"
                      : "text-amber-600"
                  }
                />
                {option.label}
              </Link>
            );
          })}

          {/* Brand Filters */}
          {filters.brands?.slice(0, 8).map((brand) => {
            const BrandIcon = getBrandIcon(brand.name);
            return (
              <Link
                key={brand.name}
                href={createFilterUrl("brand", brand.name, true)}
                className={`inline-flex items-center gap-2 px-4  text-sm rounded-2xl whitespace-nowrap transition-all duration-300 border-2 ${
                  isFilterActive("brand", brand.name)
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border-orange-500 shadow-lg"
                    : "bg-white text-amber-800 border-amber-300 hover:border-orange-400 hover:shadow-md hover:scale-105"
                }`}
              >
                <BrandIcon
                  size={14}
                  className={
                    isFilterActive("brand", brand.name)
                      ? "text-yellow-200"
                      : "text-amber-600"
                  }
                />
                {brand.name}
                <span
                  className={`text-xs ${
                    isFilterActive("brand", brand.name)
                      ? "text-yellow-200"
                      : "text-amber-600"
                  }`}
                >
                  ({brand.count})
                </span>
              </Link>
            );
          })}

          {/* Category Filters */}
          {filters.categories?.slice(0, 6).map((category) => {
            const CategoryIcon = getCategoryIcon(category.name);
            return (
              <Link
                key={category.name}
                href={createFilterUrl("category", category.name)}
                className={`inline-flex items-center gap-2 px-4 py-1 text-sm rounded-2xl whitespace-nowrap transition-all duration-300 border-2 ${
                  isFilterActive("category", category.name)
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border-orange-500 shadow-lg"
                    : "bg-white text-amber-800 border-amber-300 hover:border-orange-400 hover:shadow-md hover:scale-105"
                }`}
              >
                <CategoryIcon
                  size={14}
                  className={
                    isFilterActive("category", category.name)
                      ? "text-yellow-200"
                      : "text-amber-600"
                  }
                />
                {category.name}
                <span
                  className={`text-xs ${
                    isFilterActive("category", category.name)
                      ? "text-yellow-200"
                      : "text-amber-600"
                  }`}
                >
                  ({category.count})
                </span>
              </Link>
            );
          })}

          {/* Price Range Quick Filters */}
          <Link
            href={createFilterUrl("minPrice", "0") + "&maxPrice=1000"}
            className={`inline-flex items-center gap-2 px-4 py-1 text-sm rounded-2xl whitespace-nowrap transition-all duration-300 border-2 ${
              currentMinPrice === "0" && currentMaxPrice === "1000"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border-orange-500 shadow-lg"
                : "bg-white text-amber-800 border-amber-300 hover:border-orange-400 hover:shadow-md hover:scale-105"
            }`}
          >
            <IoPricetag
              size={14}
              className={
                currentMinPrice === "0" && currentMaxPrice === "1000"
                  ? "text-yellow-200"
                  : "text-amber-600"
              }
            />
            Under ₹1000
          </Link>

          <Link
            href={createFilterUrl("minPrice", "1000") + "&maxPrice=3000"}
            className={`inline-flex items-center gap-2 px-4 py-1 text-sm rounded-2xl whitespace-nowrap transition-all duration-300 border-2 ${
              currentMinPrice === "1000" && currentMaxPrice === "3000"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold border-orange-500 shadow-lg"
                : "bg-white text-amber-800 border-amber-300 hover:border-orange-400 hover:shadow-md hover:scale-105"
            }`}
          >
            <IoPricetag
              size={14}
              className={
                currentMinPrice === "1000" && currentMaxPrice === "3000"
                  ? "text-yellow-200"
                  : "text-amber-600"
              }
            />
            ₹1000 - ₹3000
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HorizontalFilterMain;
