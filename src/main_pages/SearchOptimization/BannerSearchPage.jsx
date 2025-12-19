"use client";

import {
  searchNewProducts,
  loadMoreProducts,
} from "@/redux/serach/newSerchProdactSlice";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaSearch } from "react-icons/fa";
import NewSingleProductCard from "@/main_pages/ProductPages.jsx/NewSingleProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import NewFilter from "@/components/searchMobile/NewFilter";

// Custom styled price slider
const PriceSlider = styled(Slider)(({ theme }) => ({
  color: "#2874f0",
  height: 4,
  "& .MuiSlider-track": {
    border: "none",
    backgroundColor: "#2874f0",
  },
  "& .MuiSlider-rail": {
    backgroundColor: "#e0e0e0",
    opacity: 1,
  },
  "& .MuiSlider-thumb": {
    height: 16,
    width: 16,
    backgroundColor: "#fff",
    border: `2px solid #2874f0`,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    "&:hover, &.Mui-focusVisible": {
      boxShadow: `0 0 0 6px rgba(40, 116, 240, 0.1)`,
    },
  },
}));

const BannerSearchPage = ({ params }) => {
  const searchQuery = params?.banner || "";
  const categoryTag = "all";
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sort = searchParams.get("sort") || "relevance";

  const {
    loading,
    query,
    total,
    limit,
    products,
    totalPages,
    filters,
    sort: reduxSort,
    loadingMore,
    page: currentPage,
  } = useSelector((state) => state.searchNew);

  // Refs to prevent multiple initializations
  const initialSearchDone = useRef(false);
  const filtersInitialized = useRef(false);
  const searchTimeoutRef = useRef(null);

  // State for selected filters and sort
  const [selectedFilters, setSelectedFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // State for show more/less
  const [showMoreColors, setShowMoreColors] = useState(false);
  const [showMoreModels, setShowMoreModels] = useState(false);
  const [colorSearch, setColorSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");

  // Price range state
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 50000]);

  // Mobile filter state
  const [mobileSort, setMobileSort] = useState(sort);

  // Sort options
  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price -- Low to High" },
    { value: "price_desc", label: "Price -- High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "popularity", label: "Popularity" },
  ];

  // Create sort URL function
  const createSortUrl = (sortValue) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    params.delete("page");
    return `?${params.toString()}`;
  };

  // Handle sort change
  const handleSortChange = (sortValue) => {
    const url = createSortUrl(sortValue);
    router.push(url);
  };

  // Handle mobile sort change
  const handleMobileSortChange = (sortValue) => {
    setMobileSort(sortValue);
    const url = createSortUrl(sortValue);
    router.push(url);
  };

  // Build search parameters
  const buildSearchParams = (page = 1) => {
    const params = {
      q: searchQuery,
      categoryTag,
      page: page,
      limit: limit || 20,
      sort: sort !== "relevance" ? sort : "",
    };

    // Add filters if any selected
    const hasActiveFilters = Object.keys(selectedFilters).some(
      (key) => selectedFilters[key] && selectedFilters[key].length > 0
    );

    if (hasActiveFilters) {
      params.filters = {};

      Object.keys(selectedFilters).forEach((key) => {
        if (selectedFilters[key] && selectedFilters[key].length > 0) {
          // Convert filter keys to match backend expectation
          if (key === "Color") {
            params.filters.colors = selectedFilters[key];
          } else if (key === "Model") {
            params.filters.models = selectedFilters[key];
          } else {
            params.filters[key] = selectedFilters[key];
          }
        }
      });
    }

    // Add price range if set
    if (selectedFilters.priceRange) {
      if (!params.filters) params.filters = {};
      params.filters.priceRange = {
        min: selectedFilters.priceRange.min,
        max: selectedFilters.priceRange.max,
      };
    }

    console.log("Building search params:", params);
    return params;
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (params) => {
      setIsSearching(true);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        dispatch(searchNewProducts(params));
        setIsSearching(false);
      }, 500);
    },
    [dispatch]
  );

  // Initial search when component mounts or category changes
  useEffect(() => {
    if (initialSearchDone.current) return;

    console.log("Initial search dispatch");
    const initialParams = buildSearchParams(1);

    dispatch(searchNewProducts(initialParams));
    initialSearchDone.current = true;
  }, [searchQuery, categoryTag, limit, dispatch, sort]);

  // Initialize selected filters when filters are loaded from API
  useEffect(() => {
    if (filters && filters.length > 0 && !filtersInitialized.current) {
      console.log("Filters loaded from API, initializing filter state");

      const initialFilters = {};
      filters.forEach((filter) => {
        initialFilters[filter.name] = [];
      });
      setSelectedFilters(initialFilters);
      filtersInitialized.current = true;
    }
  }, [filters]);

  // Handle search when filters change with debouncing
  useEffect(() => {
    if (!filtersInitialized.current || !initialSearchDone.current) {
      return;
    }

    console.log("Filter change detected");
    const params = buildSearchParams(1);
    debouncedSearch(params);
  }, [selectedFilters, searchQuery, categoryTag, limit, debouncedSearch, sort]);

  // Reset refs when category changes
  useEffect(() => {
    initialSearchDone.current = false;
    filtersInitialized.current = false;
    setSelectedFilters({});
  }, [categoryTag, searchQuery]);

  // Update mobile sort when URL sort changes
  useEffect(() => {
    setMobileSort(sort);
  }, [sort]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (loadingMore || products.length >= total) return;

    const nextPage = currentPage + 1;
    const params = buildSearchParams(nextPage);
    dispatch(loadMoreProducts(params));
  }, [loadingMore, products.length, total, currentPage, dispatch]);

  // Infinite scroll callback
  const loadMoreCallback = useCallback(() => {
    if (!loadingMore && products.length < total && currentPage < totalPages) {
      handleLoadMore();
    }
  }, [
    loadingMore,
    products.length,
    total,
    currentPage,
    totalPages,
    handleLoadMore,
  ]);

  // Use the infinite scroll hook
  const [isFetching, setIsFetching] = useInfiniteScroll(loadMoreCallback, 300);

  // Reset isFetching when loadingMore changes
  useEffect(() => {
    if (!loadingMore && isFetching) {
      setIsFetching(false);
    }
  }, [loadingMore, isFetching, setIsFetching]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterName] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterName]: newValues,
      };
    });
  };

  // Handle mobile filter changes
  const handleMobileFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
  };

  // Handle price range change
  const handlePriceChange = (event, newValue) => {
    setTempPriceRange(newValue);
  };

  // Apply price filter when user stops dragging
  const handlePriceChangeCommitted = (event, newValue) => {
    setPriceRange(newValue);
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: {
        min: newValue[0],
        max: newValue[1],
        label: `₹${newValue[0].toLocaleString()} - ₹${newValue[1].toLocaleString()}`,
      },
    }));
  };

  // Clear price filter
  const clearPriceFilter = () => {
    setPriceRange([0, 50000]);
    setTempPriceRange([0, 50000]);
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters.priceRange;
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const resetFilters = {};
    if (filters) {
      filters.forEach((filter) => {
        resetFilters[filter.name] = [];
      });
    }
    setSelectedFilters(resetFilters);
    setPriceRange([0, 50000]);
    setTempPriceRange([0, 50000]);
  };

  // Process filter values - split and remove duplicates
  const processFilterValues = (value) => {
    if (!value) return [];
    return [...new Set(value.split(", "))].filter((item) => item.trim());
  };

  // Check if any filter is active
  const hasActiveFilters = Object.keys(selectedFilters).some(
    (key) =>
      (selectedFilters[key] && selectedFilters[key].length > 0) ||
      (key === "priceRange" && selectedFilters[key])
  );

  // Extract specific filters for enhanced UI
  const colorFilter = filters?.find(
    (filter) => filter.name === "Color" || filter.name === "Option 1"
  );
  const modelFilter = filters?.find((filter) => filter.name === "Model");
  const connectorFilter = filters?.find(
    (filter) => filter.name === "Connector Type"
  );

  // Process colors - split and remove duplicates
  const availableColors = colorFilter
    ? processFilterValues(colorFilter.value)
    : [];

  // Process models - split and remove duplicates
  const availableModels = modelFilter
    ? processFilterValues(modelFilter.value)
    : [];

  // Display logic for show more/less
  const displayedColors = showMoreColors
    ? availableColors
    : availableColors.slice(0, 6);
  const displayedModels = showMoreModels
    ? availableModels
    : availableModels.slice(0, 6);
  const remainingColorsCount = Math.max(0, availableColors.length - 6);
  const remainingModelsCount = Math.max(0, availableModels.length - 6);

  // Active filters for display
  const activeFilters = [
    ...(selectedFilters.Color || []).map((color) => ({
      id: `color-${color}`,
      value: color,
      type: "Color",
    })),
    ...(selectedFilters.Model || []).map((model) => ({
      id: `model-${model}`,
      value: model,
      type: "Model",
    })),
    ...(selectedFilters.priceRange
      ? [
          {
            id: "price",
            value: selectedFilters.priceRange.label,
            type: "Price",
          },
        ]
      : []),
  ];

  const removeFilter = (filter) => {
    if (filter.id.startsWith("color-")) {
      handleFilterChange("Color", filter.value);
    } else if (filter.id.startsWith("model-")) {
      handleFilterChange("Model", filter.value);
    } else if (filter.id === "price") {
      clearPriceFilter();
    }
  };

  // Combined loading state
  const isLoading = (loading || isSearching) && !loadingMore;

  if (isLoading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        {/* Active Filters Section */}
        {activeFilters.length > 0 && (
          <div className="bg-white border-b border-gray-200 mb-4 rounded-lg">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-row items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">
                    Active Filters:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activeFilters.map((filter) => (
                      <span
                        key={filter.id}
                        className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded-full"
                      >
                        <span className="font-medium">
                          {filter.type}: {filter.value}
                        </span>
                        <button
                          onClick={() => removeFilter(filter)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filters Sidebar - Fixed with sticky positioning */}
          <div
            className={`
            ${isFilterOpen ? "block" : "hidden"} 
            lg:block lg:w-80 bg-white border border-gray-200 rounded-lg
            h-[calc(100vh-140px)] sticky top-24 overflow-hidden flex flex-col
          `}
          >
            {/* Fixed header */}
            <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg flex-shrink-0">
              <div className="flex justify-between items-center">
                <h1 className="text-[18px] font-semibold text-gray-900">
                  Filters
                </h1>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    CLEAR ALL
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable filters content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* Price Range Filter with Slider */}
              <div className="border-b border-gray-200">
                <div className="flex justify-between items-center p-4">
                  <h3 className="text-xs font-semibold text-gray-900">
                    PRICE RANGE
                  </h3>
                  {selectedFilters.priceRange && (
                    <button
                      onClick={clearPriceFilter}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="px-4 pb-4">
                  <div className="mb-4">
                    <PriceSlider
                      value={tempPriceRange}
                      onChange={handlePriceChange}
                      onChangeCommitted={handlePriceChangeCommitted}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
                      min={0}
                      max={50000}
                      step={1000}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{tempPriceRange[0].toLocaleString()}</span>
                    <span>₹{tempPriceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Filters */}
              {filters &&
                filters.map((filter, index) => {
                  const filterValues = processFilterValues(filter.value);

                  if (filterValues.length === 0 || filterValues.length > 50) {
                    return null;
                  }

                  if (
                    filter.name === "Color" ||
                    filter.name === "Option 1" ||
                    filter.name === "Model"
                  ) {
                    return null;
                  }

                  return (
                    <div key={filter.name} className="border-b border-gray-200">
                      <div className="flex justify-between items-center p-4">
                        <h3 className="text-xs font-semibold text-gray-900">
                          {filter.name.toUpperCase()}
                        </h3>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {filterValues.map((value, valueIndex) => (
                            <label
                              key={valueIndex}
                              className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedFilters[filter.name]?.includes(
                                    value
                                  ) || false
                                }
                                onChange={() =>
                                  handleFilterChange(filter.name, value)
                                }
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <span className="flex-1 text-sm text-gray-700">
                                {value}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* Enhanced Color Filter */}
              {availableColors.length > 0 && (
                <div className="border-b border-gray-200">
                  <div className="flex justify-between items-center p-4">
                    <h3 className="text-xs font-semibold text-gray-900">
                      COLORS
                    </h3>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="relative mb-3">
                      <FaSearch
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={14}
                      />
                      <input
                        type="text"
                        placeholder="Search Color"
                        value={colorSearch}
                        onChange={(e) => setColorSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-b border-gray-300 hover:border-blue-500 outline-none focus:outline-none text-sm"
                      />
                    </div>

                    <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
                      {displayedColors
                        .filter((color) =>
                          color
                            .toLowerCase()
                            .includes(colorSearch.toLowerCase())
                        )
                        .map((color, index) => (
                          <label
                            key={index}
                            className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={
                                selectedFilters.Color?.includes(color) || false
                              }
                              onChange={() =>
                                handleFilterChange("Color", color)
                              }
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="flex-1 text-sm text-gray-700">
                              {color}
                            </span>
                          </label>
                        ))}
                    </div>

                    {remainingColorsCount > 0 && (
                      <button
                        onClick={() => setShowMoreColors(!showMoreColors)}
                        className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2 mt-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-300"
                      >
                        {showMoreColors
                          ? "Show Less Colors"
                          : `View ${remainingColorsCount} More Colors`}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Model Filter */}
              {availableModels.length > 0 && (
                <div className="border-b border-gray-200">
                  <div className="flex justify-between items-center p-4">
                    <h3 className="text-xs font-semibold text-gray-900">
                      MODELS
                    </h3>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="relative mb-3">
                      <FaSearch
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={14}
                      />
                      <input
                        type="text"
                        placeholder="Search Model"
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-b border-gray-300 hover:border-blue-500 outline-none focus:outline-none text-sm"
                      />
                    </div>

                    <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
                      {displayedModels
                        .filter((model) =>
                          model
                            .toLowerCase()
                            .includes(modelSearch.toLowerCase())
                        )
                        .map((model, index) => (
                          <label
                            key={index}
                            className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={
                                selectedFilters.Model?.includes(model) || false
                              }
                              onChange={() =>
                                handleFilterChange("Model", model)
                              }
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="flex-1 text-sm text-gray-700">
                              {model}
                            </span>
                          </label>
                        ))}
                    </div>

                    {remainingModelsCount > 0 && (
                      <button
                        onClick={() => setShowMoreModels(!showMoreModels)}
                        className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2 mt-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-300"
                      >
                        {showMoreModels
                          ? "Show Less Models"
                          : `View ${remainingModelsCount} More Models`}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Connector Type Filter */}
              {connectorFilter && connectorFilter.value && (
                <div className="border-b border-gray-200">
                  <div className="flex justify-between items-center p-4">
                    <h3 className="text-xs font-semibold text-gray-900">
                      CONNECTOR TYPE
                    </h3>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                      {connectorFilter.value}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid - Main scrollable area */}
          <div className="flex-1">
            {products && products.length > 0 ? (
              <>
                {/* Products Count and Sort By Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 hidden md:block">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Products Count - Left Side */}
                    <p className="text-gray-600 text-sm"></p>

                    {/* Sort By - Right Side */}
                    {/* Sort By - Right Side */}
                    <div className="md:block hidden">
                      <div className="flex items-center gap-3">
                        <span className="text-ms font-bold text-gray-600 whitespace-nowrap">
                          Sort By
                        </span>
                        <div className="flex flex-wrap gap-4 text-sm">
                          {sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleSortChange(option.value)}
                              className={`font-medium transition-colors duration-200 ${
                                sort === option.value
                                  ? "text-blue-500 border-b border-blue-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12 md:mb-0">
                  {products.map((product) => (
                    <NewSingleProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <h2 className="text-xl font-semibold text-gray-600 mb-4">
                  No products found {searchQuery && `for "${searchQuery}"`}
                </h2>
                <p className="text-gray-500">
                  Try adjusting your search terms or browse other categories.
                </p>
              </div>
            )}

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading more products...</p>
              </div>
            )}

            {/* Load More Button */}
            {!loadingMore && products && products.length < total && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Component */}
      <NewFilter
        filters={filters}
        loading={loading}
        selectedFilters={selectedFilters}
        onFilterChange={handleMobileFilterChange}
        sort={mobileSort}
        onSortChange={handleMobileSortChange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        onClearAllFilters={clearAllFilters}
      />
    </div>
  );
};

export default BannerSearchPage;
