"use client";
import React, { useState, useEffect } from "react";
import { FaTimes, FaStar, FaSearch } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Clean e-commerce color scheme
const colors = {
  primary: "#2874f0", // Flipkart blue
  secondary: "#fb641b", // Orange
  accent: "#ff9f00", // Yellow
  dark: "#212121",
  light: "#f1f3f6",
  text: "#212121",
  textLight: "#878787",
  border: "#e0e0e0",
  background: "#ffffff"
};

const PriceSlider = styled(Slider)(({ theme }) => ({
  color: colors.primary,
  height: 4,
  "& .MuiSlider-track": {
    border: "none",
    backgroundColor: colors.primary,
  },
  "& .MuiSlider-rail": {
    backgroundColor: colors.border,
    opacity: 1,
  },
  "& .MuiSlider-thumb": {
    height: 16,
    width: 16,
    backgroundColor: "#fff",
    border: `2px solid ${colors.primary}`,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    "&:hover, &.Mui-focusVisible": {
      boxShadow: `0 0 0 6px rgba(40, 116, 240, 0.1)`,
    },
  },
}));

const DesktopFilterMain = () => {
  const { filters, pagination, availableFilters } = useSelector(
    (state) => state.search
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  // State for show more/less
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  // Get actual price range from available filters or use defaults
  const minPriceFromFilters = availableFilters?.priceRange?.min || 0;
  const maxPriceFromFilters = availableFilters?.priceRange?.max || 30000;

  // Dynamic state management
  const [priceRange, setPriceRange] = useState(() => [
    Number(searchParams.get("minPrice")) || minPriceFromFilters,
    Number(searchParams.get("maxPrice")) || maxPriceFromFilters,
  ]);

  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.getAll("brand") || []
  );
  const [selectedColors, setSelectedColors] = useState(
    searchParams.get("color") ? [searchParams.get("color")] : []
  );
  const [selectedRatings, setSelectedRatings] = useState(
    searchParams.get("rating") ? [searchParams.get("rating")] : []
  );

  // Track if price range has changed
  const [isPriceChanged, setIsPriceChanged] = useState(false);

  // Initialize filters from URL params and available filters
  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand") || []);
    setSelectedColors(
      searchParams.get("color") ? [searchParams.get("color")] : []
    );
    setSelectedRatings(
      searchParams.get("rating") ? [searchParams.get("rating")] : []
    );

    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");

    setPriceRange([
      urlMinPrice ? Number(urlMinPrice) : minPriceFromFilters,
      urlMaxPrice ? Number(urlMaxPrice) : maxPriceFromFilters,
    ]);
    setIsPriceChanged(false);
  }, [searchParams, minPriceFromFilters, maxPriceFromFilters]);

  // Active filters for display
  const activeFilters = [
    ...(searchParams.get("category")
      ? [{ id: "category", value: searchParams.get("category") }]
      : []),
    ...(searchParams.get("color")
      ? [{ id: "color", value: searchParams.get("color") }]
      : []),
    ...(searchParams.get("rating")
      ? [{ id: "rating", value: `${searchParams.get("rating")}★ & Above` }]
      : []),
    ...(searchParams.get("minPrice") || searchParams.get("maxPrice")
      ? [
        {
          id: "price",
          value: `₹${searchParams.get("minPrice") || minPriceFromFilters}-₹${searchParams.get("maxPrice") || maxPriceFromFilters
            }`,
        },
      ]
      : []),
    ...selectedBrands.map((brand) => ({ id: `brand-${brand}`, value: brand })),
  ];

  // Dynamic filter handlers
  const handleBrandToggle = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    updateUrlParams({ brands: newBrands });
  };

  const handleColorToggle = (color) => {
    const newColors = selectedColors.includes(color) ? [] : [color];
    setSelectedColors(newColors);
    updateUrlParams({ color: newColors[0] || null });
  };

  const handleRatingToggle = (rating) => {
    const newRatings = selectedRatings.includes(rating) ? [] : [rating];
    setSelectedRatings(newRatings);
    updateUrlParams({ rating: newRatings[0] || null });
  };

  // Handle price change (on drag)
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    setIsPriceChanged(true);
  };

  // Apply price filter when user stops dragging (on change committed)
  const handlePriceChangeCommitted = (event, newValue) => {
    updateUrlParams({
      minPrice: newValue[0].toString(),
      maxPrice: newValue[1].toString(),
    });
    setIsPriceChanged(false);
  };

  // Apply price filter manually (for button click)
  const applyPriceFilter = () => {
    updateUrlParams({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    });
    setIsPriceChanged(false);
  };

  // Reset price filter to default
  const resetPriceFilter = () => {
    const newRange = [minPriceFromFilters, maxPriceFromFilters];
    setPriceRange(newRange);
    updateUrlParams({
      minPrice: null,
      maxPrice: null,
    });
  };

  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if ("brands" in updates) {
      params.delete("brand");
      updates.brands.forEach((brand) => params.append("brand", brand));
    }

    if ("color" in updates) {
      if (updates.color) {
        params.set("color", updates.color);
      } else {
        params.delete("color");
      }
    }

    if ("rating" in updates) {
      if (updates.rating) {
        params.set("rating", updates.rating);
      } else {
        params.delete("rating");
      }
    }

    if ("minPrice" in updates) {
      if (updates.minPrice) {
        params.set("minPrice", updates.minPrice);
      } else {
        params.delete("minPrice");
      }
    }

    if ("maxPrice" in updates) {
      if (updates.maxPrice) {
        params.set("maxPrice", updates.maxPrice);
      } else {
        params.delete("maxPrice");
      }
    }

    router.push(`?${params.toString()}`);
  };

  const removeFilter = (filter) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (filter.id === "category") {
      params.delete("category");
    } else if (filter.id === "color") {
      params.delete("color");
    } else if (filter.id === "rating") {
      params.delete("rating");
    } else if (filter.id === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
      setPriceRange([minPriceFromFilters, maxPriceFromFilters]);
    } else if (filter.id.startsWith("brand-")) {
      const brandValue = filter.value;
      params.delete("brand");
      selectedBrands
        .filter((b) => b !== brandValue)
        .forEach((brand) => params.append("brand", brand));
    }

    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get("q")) {
      params.set("q", searchParams.get("q"));
    }
    setPriceRange([minPriceFromFilters, maxPriceFromFilters]);
    router.push(`?${params.toString()}`);
  };

  const createCategoryLink = (category) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    params.delete("page");
    return `?${params.toString()}`;
  };

  // Add this function inside your DesktopFilter component
  const generatePriceOptions = (min, max) => {
    const options = new Set();
    
    // Add the minimum price
    options.add(min);
    
    // Generate common price points
    const commonPoints = [
      500, 1000, 2000, 3000, 4000, 5000, 
      7500, 10000, 15000, 20000, 25000, 
      30000, 40000, 50000, 75000, 100000
    ];
    
    // Add common price points within range
    commonPoints.forEach(point => {
      if (point >= min && point <= max) {
        options.add(point);
      }
    });
    
    // Add quarter points
    const quarter1 = min + Math.floor((max - min) * 0.25);
    const quarter2 = min + Math.floor((max - min) * 0.5);
    const quarter3 = min + Math.floor((max - min) * 0.75);
    
    if (quarter1 > min && quarter1 < max) options.add(quarter1);
    if (quarter2 > min && quarter2 < max) options.add(quarter2);
    if (quarter3 > min && quarter3 < max) options.add(quarter3);
    
    // Add the maximum price
    options.add(max);
    
    // Convert to array and sort
    return Array.from(options).sort((a, b) => a - b);
  };

  const formatPrice = (price) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}k`;
    }
    return `₹${price}`;
  };

  // Handle dropdown price change
  const handleMinPriceChange = (e) => {
    const newMin = Number(e.target.value);
    const newRange = [newMin, Math.max(newMin, priceRange[1])];
    setPriceRange(newRange);
    updateUrlParams({
      minPrice: newRange[0].toString(),
      maxPrice: newRange[1].toString(),
    });
  };

  const handleMaxPriceChange = (e) => {
    const newMax = Number(e.target.value);
    const newRange = [Math.min(priceRange[0], newMax), newMax];
    setPriceRange(newRange);
    updateUrlParams({
      minPrice: newRange[0].toString(),
      maxPrice: newRange[1].toString(),
    });
  };

  // Dynamic data from availableFilters or fallback to mock data
  const categories = availableFilters?.categories || [
    { name: "Mobiles & Accessories", count: 245, isMain: true }
  ];

  const brands = availableFilters?.brands || [
    { name: "Apple", count: 67 },
    { name: "Google", count: 23 },
    { name: "MOTOROLA", count: 45 },
    { name: "vivo", count: 89 },
    { name: "OPPO", count: 76 },
    { name: "Infinix", count: 34 },
    { name: "Samsung", count: 156 },
    { name: "OnePlus", count: 98 },
    { name: "Xiaomi", count: 134 },
    { name: "Realme", count: 87 }
  ];

  const displayedBrands = showMoreBrands ? brands : brands.slice(0, 6);
  const remainingBrandsCount = Math.max(0, brands.length - 6);

  // Check if price filter is active
  const isPriceFilterActive = 
    searchParams.get("minPrice") || searchParams.get("maxPrice");

  return (
    <div className="hidden sm:block w-75 bg-white border-r border-gray-200">
      {/* Header */}
      <div className="bg-white">
        <h1 className="text-[18px] font-semibold text-gray-900">Filters</h1>
      </div>

      <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(100vh - 80px)' }}>

        {/* Active Filters Section - Always visible when there are active filters */}
        {activeFilters.length > 0 && (
          <div className="border-b border-gray-200 bg-gray-50 bg-white">
            <div className="flex justify-between items-center py-1 px-4">
              {/* <h2 className="text-sm font-semibold text-gray-90">
                ACTIVE FILTERS
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {activeFilters.length}
                </span>
              </h2> */}
            </div>

            <div className="px-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {activeFilters.map((filter) => (
                  <span
                    key={filter.id}
                    className="flex items-center gap-2  bg-gray-200  px-3 py-1 text-sm"
                  >
                    <span className="font-medium text-black-800">
                      {filter.value}
                    </span>
                    <button
                      onClick={() => removeFilter(filter)}
                      className="text-gray-400 "
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Section - Dynamic */}
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-3 mt-2">
            <h3 className="text-xs font-semibold text-gray-900">CATEGORIES</h3>
          </div>

          <div className="px-4 pb-2 mt-2 space-y-1 max-h-80 overflow-y-auto no-scrollbar">
            {categories
              ?.slice(0, showMoreCategories ? undefined : 5)
              .map((category) => (
                <Link
                  key={category.name}
                  href={createCategoryLink(category.name)}
                  className={`flex justify-between items-center px-3 rounded-lg transition-all ${searchParams.get("category") === category.name
                      ? " text-blue-700 "
                      : "hover:text-blue-800"
                    }`}
                >
                  <span className="text-sm">{category.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${searchParams.get("category") === category.name
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {category.count}
                  </span>
                </Link>
              ))}

            {categories?.length > 5 && (
              <button
                onClick={() => setShowMoreCategories(!showMoreCategories)}
                className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-300"
              >
                {showMoreCategories ? "Show Less Categories" : "View All Categories"}
              </button>
            )}
          </div>
        </div>

        {/* Price Range Section - Dynamic */}
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center p-3">
            <h2 className="text-xs font-semibold text-gray-900">PRICE RANGE</h2>
            {isPriceFilterActive && (
              <button
                onClick={resetPriceFilter}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                CLEAR
              </button>
            )}
          </div>

          <div className="px-4 pb-4">
            <Box sx={{ mb: 3 }}>
              <PriceSlider
                value={priceRange}
                onChange={handlePriceChange}
                onChangeCommitted={handlePriceChangeCommitted}
                valueLabelDisplay="off"
                min={minPriceFromFilters}
                max={maxPriceFromFilters}
                step={Math.max(1, Math.floor((maxPriceFromFilters - minPriceFromFilters) / 100))}
              />
              
              {/* Updated Price Display with Dropdowns */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  gap: 2,
                }}
              >
                {/* Min Price Dropdown */}
                <div className="text-center flex-1 ">
                  <Typography variant="body2" className="text-gray-600 text-xs font-medium mb-1 gap-3">
                    Min
                  </Typography>
                  <div className="relative">
                    <select
                      value={priceRange[0]}
                      onChange={handleMinPriceChange}
                      className="w-full border border-gray-300 rounded px-3 py-1 bg-white appearance-none text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    >
                      {generatePriceOptions(minPriceFromFilters, maxPriceFromFilters).map((price) => (
                        <option key={`min-${price}`} value={price}>
                          {formatPrice(price)}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Separator */}
                <div className="mx-1 mt-5">
                  <Typography variant="body2" className="text-gray-500 font-medium">
                    to
                  </Typography>
                </div>
                
                {/* Max Price Dropdown */}
                <div className="text-center flex-1 gap-2">
                  <Typography variant="body2" className="text-gray-600 text-xs font-medium mb-1">
                    Max
                  </Typography>
                  <div className="relative">
                    <select
                      value={priceRange[1]}
                      onChange={handleMaxPriceChange}
                      className="w-full border border-gray-300 rounded px-3 py-1 bg-white appearance-none text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    >
                      {generatePriceOptions(minPriceFromFilters, maxPriceFromFilters).map((price) => (
                        <option key={`max-${price}`} value={price}>
                          {formatPrice(price)}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Box>
            </Box>
          </div>
        </div>

        {/* Brands Filter - Dynamic */}
        <div className="border-b border-b-gray-200">
          <div className="flex justify-between items-center p-3">
            <h2 className="text-xs font-semibold text-gray-900">BRANDS</h2>
          </div>

          <div className="px-4 pb-4">
            {/* Search Brand */} 
            <div className="relative mb-3">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search Brand"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-b border-b-gray-300 hover:border-b-blue-500 outline-none focus:outline-none"
              />
            </div> 

            <div className="space-y-1 max-h-60 overflow-y-auto no-scrollbar">
              {displayedBrands
                .filter(brand =>
                  brand.name.toLowerCase().includes(brandSearch.toLowerCase())
                )
                .map((brand) => (
                  <label
                    key={brand.name}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandToggle(brand.name)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="flex-1 text-sm text-gray-700">
                      {brand.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {brand.count}
                    </span>
                  </label>
                ))}
            </div>

            {/* Show More/Less */}
            {remainingBrandsCount > 0 && (
              <button
                onClick={() => setShowMoreBrands(!showMoreBrands)}
                className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2 mt-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-300"
              >
                {showMoreBrands ? "Show Less Brands" : `View ${remainingBrandsCount} More Brands`}
              </button>
            )}
          </div>
        </div>

        {/* Additional Static Filter Sections */}
      </div>
    </div>
  );
};

export default DesktopFilterMain;