"use client";
import { searchNewProducts, loadMoreProducts } from "@/redux/serach/brandSlice";
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

// Sort options matching your UI
const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price -- Low to High" },
  { value: "price_desc", label: "Price -- High to Low" },
  { value: "newest", label: "Newest First" },
];

// Process filter values - split and remove duplicates
const processFilterValues = (value) => {
  if (!value) return [];
  return [...new Set(value.split(", "))].filter((item) => item.trim());
};

// Skeleton Loader Components (keep your existing skeleton components)
const FilterSkeleton = () => {
  return (
    <div className="w-80 bg-white border border-gray-200 rounded-lg h-screen sticky top-24 hidden lg:block">
      <div className="overflow-y-auto no-scrollbar h-full pb-10">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Price Filter Skeleton */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-gray-200 p-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="h-2 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}

        {/* Filter Options Skeletons */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-b border-gray-200 p-4">
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>

        {/* Price Skeleton */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 bg-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-1 mb-3">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-10"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-9 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

const BrandSubPage = ({ params }) => {
  const p = React.use(params);
  const brand = p?.brand || "";
  const subCategory = p?.subCat || "";
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
  } = useSelector((state) => state.brandData);

  // Refs to prevent multiple initializations
  const initialSearchDone = useRef(false);
  const filtersInitialized = useRef(false);
  const searchTimeoutRef = useRef(null);

  // State for selected filters and sort
  const [selectedFilters, setSelectedFilters] = useState({});
  const [expandedFilters, setExpandedFilters] = useState({});
  const [tempPriceRange, setTempPriceRange] = useState([0, 50000]);
  const [mobileSort, setMobileSort] = useState(sort);

  // Build search parameters
  const buildSearchParams = (page = 1, customFilters = selectedFilters) => {
    const params = {
      brand,
      subCategory,
      page: page,
      limit: limit || 20,
      sort: sort !== "relevance" ? sort : "",
    };

    // Add filters if any selected
    const hasActiveFilters = Object.keys(customFilters).some(
      (key) => customFilters[key] && customFilters[key].length > 0
    );

    if (hasActiveFilters || customFilters.priceRange) {
      params.filters = {};

      Object.keys(customFilters).forEach((key) => {
        if (key === "priceRange") {
          if (customFilters[key]) {
            params.filters.priceRange = {
              min: customFilters[key].min,
              max: customFilters[key].max,
            };
          }
        } else if (customFilters[key] && customFilters[key].length > 0) {
          // Convert filter keys to match backend expectation
          if (key === "Color") {
            params.filters.colors = customFilters[key];
          } else if (key === "Model") {
            params.filters.models = customFilters[key];
          } else {
            params.filters[key] = customFilters[key];
          }
        }
      });
    }

    return params;
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (params) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        dispatch(searchNewProducts(params));
      }, 300);
    },
    [dispatch]
  );

  // Handle sort change
  const handleSort = (sortValue) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterName] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      const newFilters = {
        ...prev,
        [filterName]: newValues,
      };

      // Trigger search with new filters
      const searchParams = buildSearchParams(1, newFilters);
      debouncedSearch(searchParams);

      return newFilters;
    });
  };

  // Remove selected filter
  const removeSelected = (filterName, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterName] || [];
      const newValues = currentValues.filter((item) => item !== value);

      const newFilters = {
        ...prev,
        [filterName]: newValues,
      };

      // Trigger search with updated filters
      const searchParams = buildSearchParams(1, newFilters);
      debouncedSearch(searchParams);

      return newFilters;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    const resetFilters = {};
    if (filters) {
      filters.forEach((filter) => {
        resetFilters[filter.name] = [];
      });
    }
    setSelectedFilters(resetFilters);
    
    // Trigger search with cleared filters
    const searchParams = buildSearchParams(1, resetFilters);
    debouncedSearch(searchParams);
  };

  // Toggle filter expansion
  const toggleFilterExpand = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  // Check if any filter is selected
  const hasSelectedFilters = Object.keys(selectedFilters).some(
    (key) =>
      (selectedFilters[key] && selectedFilters[key].length > 0) ||
      (key === "priceRange" && selectedFilters[key])
  );

  // Initial search when component mounts or category changes
  useEffect(() => {
    if (initialSearchDone.current) return;

    const initialParams = buildSearchParams(1);
    dispatch(searchNewProducts(initialParams));
    initialSearchDone.current = true;
  }, [brand, subCategory, limit, dispatch]);

  // Initialize selected filters when filters are loaded from API
  useEffect(() => {
    if (filters && filters.length > 0 && !filtersInitialized.current) {
      const initialFilters = {};
      filters.forEach((filter) => {
        initialFilters[filter.name] = [];
      });
      setSelectedFilters(initialFilters);
      filtersInitialized.current = true;
    }
  }, [filters]);

  // Update mobile sort when URL sort changes
  useEffect(() => {
    setMobileSort(sort);
  }, [sort]);

  // Reset refs when category changes
  useEffect(() => {
    initialSearchDone.current = false;
    filtersInitialized.current = false;
    setSelectedFilters({});
  }, [brand, subCategory]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (loadingMore || products.length >= total) return;

    const nextPage = currentPage + 1;
    const params = buildSearchParams(nextPage);
    dispatch(loadMoreProducts(params));
  }, [loadingMore, products.length, total, currentPage, dispatch]);

  // Use the infinite scroll hook
  const [isFetching, setIsFetching] = useInfiniteScroll(handleLoadMore, 300);

  // Reset isFetching when loadingMore changes
  useEffect(() => {
    if (!loadingMore && isFetching) {
      setIsFetching(false);
    }
  }, [loadingMore, isFetching, setIsFetching]);

  // Handle mobile sort change
  const handleMobileSortChange = (sortValue) => {
    setMobileSort(sortValue);
    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  // Combined loading state
  const isLoading = loading && !loadingMore;

  // Initial loading skeleton
  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-4">
        <div className="max-w-[1600px] mx-auto flex">
          {/* Filters Sidebar Skeleton */}
          <div className="hidden lg:block w-[270px] bg-gray-50 border border-gray-300">
            <div className="animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 p-4">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-3"></div>
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Products Section Skeleton */}
          <div className="flex-1 px-4">
            {/* Sort Options Skeleton */}
            <div className="bg-white border border-gray-300 px-4 py-2 mb-3">
              <div className="flex gap-3 flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-24 bg-gray-200 rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-4">
      <div className="max-w-[1600px] mx-auto flex">
        {/* ---------------- LEFT FILTER ---------------- */}
        <div className="hidden lg:block w-[270px] bg-gray-50 border border-gray-300 text-gray-600">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 text-sm font-semibold text-gray-800">
            <span>Filters</span>
            {hasSelectedFilters && (
              <button
                onClick={clearAllFilters}
                className="text-blue-600 text-xs font-medium"
              >
                CLEAR ALL
              </button>
            )}
          </div>

          {/* SELECTED FILTERS */}
          {hasSelectedFilters && (
            <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-gray-300 bg-gray-100">
              {Object.entries(selectedFilters).map(([key, values]) =>
                Array.isArray(values)
                  ? values.map((v) => (
                      <div
                        key={`${key}-${v}`}
                        className="flex items-center gap-1 bg-gray-200 text-gray-700 text-[11px] px-2 py-[3px] rounded"
                      >
                        <FaTimes
                          size={8}
                          className="cursor-pointer"
                          onClick={() => removeSelected(key, v)}
                        />
                        <span>{v}</span>
                      </div>
                    ))
                  : null
              )}

              {selectedFilters.priceRange && (
                <div className="flex items-center gap-1 bg-gray-200 text-gray-700 text-[11px] px-2 py-[3px] rounded">
                  <FaTimes
                    size={8}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedFilters((p) => ({
                        ...p,
                        priceRange: null,
                      }))
                    }
                  />
                  <span>
                    ₹{selectedFilters.priceRange.min} – ₹
                    {selectedFilters.priceRange.max}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* PRICE */}
          <div className="px-4 py-4 border-b border-gray-200">
            <p className="text-xs font-semibold mb-2 text-gray-800">PRICE</p>
            <div className="w-[85%] mx-auto">
              <PriceSlider
                value={tempPriceRange}
                onChange={(e, v) => setTempPriceRange(v)}
                onChangeCommitted={(e, v) => {
                  const range = { min: v[0], max: v[1] };

                  setSelectedFilters((p) => ({
                    ...p,
                    priceRange: range,
                  }));

                  debouncedSearch(
                    buildSearchParams(1, {
                      ...selectedFilters,
                      priceRange: range,
                    })
                  );
                }}
              />
            </div>
          </div>

          {/* DYNAMIC FILTERS */}
          {filters?.map((filter) => {
            const values = processFilterValues(filter.value);
            if (!values.length) return null;

            const expanded = expandedFilters[filter.name];
            const visible = expanded ? values : values.slice(0, 4);

            return (
              <div
                key={filter.name}
                className="px-4 py-4 border-b border-gray-200"
              >
                <p className="text-xs font-semibold mb-1 text-gray-800">
                  {filter.name.toUpperCase()}
                </p>

                {visible.map((v) => (
                  <label
                    key={v}
                    className="flex gap-2 text-sm mb-1 text-gray-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters[filter.name]?.includes(v)}
                      onChange={() => handleFilterChange(filter.name, v)}
                    />
                    {v}
                  </label>
                ))}

                {values.length > 4 && (
                  <button
                    className="text-sm text-blue-600 mt-1"
                    onClick={() => toggleFilterExpand(filter.name)}
                  >
                    {expanded ? "Show Less" : `View ${values.length - 4} More`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* ---------------- PRODUCTS ---------------- */}
        <div className="flex-1 px-4">
          <div className=" hidden lg:flex bg-white border border-gray-300 px-4 py-2 mb-3  items-center text-sm">
            <div className="flex gap-3 flex-wrap">
              {SORTS.map((s) => {
                const isActive = sort === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => handleSort(s.value)}
                    className={`px-3 py-1 rounded-full border transition-all duration-200 ${
                      isActive
                        ? "border-yellow-600 text-yellow-700 bg-yellow-50"
                        : "border-yellow-600 text-gray-700 hover:bg-yellow-50"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p) => (
              <NewSingleProductCard key={p._id} product={p} />
            ))}
          </div>

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

          {/* No Products Found */}
          {!loading && products.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">
                No products found for the selected filters.
              </h2>
              <p className="text-gray-500">
                Try adjusting your search terms or browse other categories.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER */}
      <NewFilter
        filters={filters}
        selectedFilters={selectedFilters}
        sort={mobileSort}
        onFilterChange={setSelectedFilters}
        onSortChange={handleMobileSortChange}
      />
    </div>
  );
};

export default BrandSubPage;