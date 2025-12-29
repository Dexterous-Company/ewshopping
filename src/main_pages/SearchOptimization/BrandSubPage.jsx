"use client";
import {
  fetchBrandSubProducts,
  fetchBrandSubFilters,
  loadMoreBrandSubProducts,
} from "@/redux/serach/brandSlice";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaSearch } from "react-icons/fa";
import NewSingleProductCard from "@/main_pages/ProductPages.jsx/NewSingleProductCard";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
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

// Updated: Process filter values - now directly use the values array
const getFilterValues = (filter) => {
  if (!filter || !filter.values) return [];
  // Clean up the values (remove any special characters like ‎)
  return filter.values
    .map((value) => value.replace(/[^\x20-\x7E]/g, "").trim())
    .filter((value) => value);
};

// Skeleton Loader Components
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
  const router = useRouter();
  const pathname = usePathname();

  
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "relevance";
  const page = searchParams.get("page") || "1";

  
  const products = useSelector((state) => state.brandSub.products);

  const filters = useSelector((state) => state.brandSub.filters);

  const total = useSelector((state) => state.brandSub.total);
  const currentPage = useSelector((state) => state.brandSub.page);
  const loading = useSelector((state) => state.brandSub.loading);
  const loadingMore = useSelector((state) => state.brandSub.loadingMore);
  const loadingFilters = useSelector((state) => state.brandSub.loadingFilters);
  const filtersLoaded = useSelector((state) => state.brandSub.filtersLoaded);
  const error = useSelector((state) => state.brandSub.error);

  // Refs
  const initialLoadDone = useRef(false);
  const filtersInitialized = useRef(false);
  const prevSortRef = useRef(sort);
  const prevPageRef = useRef(page);
  const sentinelRef = useRef(null);

  // State for selected filters and sort
  const [selectedFilters, setSelectedFilters] = useState({});
  const [expandedFilters, setExpandedFilters] = useState({});
  const [tempPriceRange, setTempPriceRange] = useState([0, 50000]);
  const [mobileSort, setMobileSort] = useState(sort);

  // Build search parameters for products
  const buildProductParams = useCallback(
    (pageNum = 1, customFilters = selectedFilters, customSort = sort) => {
      const params = {
        brand,
        subCategory,
        page: pageNum,
        limit: 20,
        sort: customSort !== "relevance" ? customSort : "",
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
            params.filters[key] = customFilters[key];
          }
        });
      }

      return params;
    },
    [brand, subCategory, sort, selectedFilters]
  );

  const buildFilterParams = (customFilters = {}) => {
    const params = {
      brand,
      subCategory,
    };

    if (Object.keys(customFilters).length > 0) {
      params.filters = customFilters;
    }

    return params;
  };

  const fetchProducts = useCallback(
    (pageNum = 1, customSort = sort) => {
      const productParams = buildProductParams(
        pageNum,
        selectedFilters,
        customSort
      );
      dispatch(fetchBrandSubProducts(productParams));
    },
    [buildProductParams, selectedFilters, dispatch, sort]
  );

  
  const fetchFilters = useCallback(() => {
    const filterParams = buildFilterParams(selectedFilters);
    dispatch(fetchBrandSubFilters(filterParams));
  }, [selectedFilters, dispatch]);

  
  const updateURL = useCallback(
    (updates) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          currentParams.delete(key);
        } else {
          currentParams.set(key, value.toString());
        }
      });

      const queryString = currentParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const handleSort = (sortValue) => {

    
    setMobileSort(sortValue);

    
    updateURL({ sort: sortValue, page: "1" });

    
    fetchProducts(1, sortValue);
  };

  
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

      
      fetchProducts(1, sort);

      
      const filterParams = buildFilterParams(newFilters);
      dispatch(fetchBrandSubFilters(filterParams));

      return newFilters;
    });
  };

  
  const handlePriceRangeChange = (range) => {
    const newFilters = {
      ...selectedFilters,
      priceRange: { min: range[0], max: range[1] },
    };

    setSelectedFilters(newFilters);

    
    fetchProducts(1, sort);

    
    const filterParams = buildFilterParams(newFilters);
    dispatch(fetchBrandSubFilters(filterParams));
  };

  
  const removeSelected = (filterName, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterName] || [];
      const newValues = currentValues.filter((item) => item !== value);

      const newFilters = {
        ...prev,
        [filterName]: newValues,
      };

      
      fetchProducts(1, sort);

      
      const filterParams = buildFilterParams(newFilters);
      dispatch(fetchBrandSubFilters(filterParams));

      return newFilters;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({});
    setTempPriceRange([0, 50000]);

    // Fetch products with cleared filters
    fetchProducts(1, sort);

    // Fetch fresh filters
    const filterParams = buildFilterParams({});
    dispatch(fetchBrandSubFilters(filterParams));
  };

  // Toggle filter expansion
  const toggleFilterExpand = (filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  
  const hasSelectedFilters = Object.keys(selectedFilters).some(
    (key) =>
      (selectedFilters[key] && selectedFilters[key].length > 0) ||
      (key === "priceRange" && selectedFilters[key])
  );

  
  useEffect(() => {
    if (initialLoadDone.current) return;


    
    fetchProducts(1, sort);

    
    const filterParams = buildFilterParams();
    dispatch(fetchBrandSubFilters(filterParams));

    initialLoadDone.current = true;
    prevSortRef.current = sort;
    prevPageRef.current = page;
  }, [brand, subCategory, dispatch]);

  useEffect(() => {

    if (!initialLoadDone.current) return;

    const pageNum = parseInt(page) || 1;

    if (sort !== prevSortRef.current) {
      prevSortRef.current = sort;
      setMobileSort(sort);

      fetchProducts(1, sort);
      return;
    }

    if (pageNum !== parseInt(prevPageRef.current)) {
      prevPageRef.current = page;

      if (pageNum === 1) {
        fetchProducts(1, sort);
      } else if (pageNum > currentPage) {
        const params = buildProductParams(pageNum, selectedFilters, sort);
        dispatch(loadMoreBrandSubProducts(params));
      }
    }
  }, [sort, page, currentPage, selectedFilters, dispatch]);

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

  useEffect(() => {
    initialLoadDone.current = false;
    filtersInitialized.current = false;
    setSelectedFilters({});
    setExpandedFilters({});
    setTempPriceRange([0, 50000]);
    prevSortRef.current = "relevance";
    prevPageRef.current = "1";
  }, [brand, subCategory]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || products.length >= total) return;

    const nextPage = currentPage + 1;

    updateURL({ page: nextPage.toString() });

    const params = buildProductParams(nextPage, selectedFilters, sort);
    dispatch(loadMoreBrandSubProducts(params));
  }, [
    loadingMore,
    products.length,
    total,
    currentPage,
    updateURL,
    selectedFilters,
    sort,
    dispatch,
    buildProductParams,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || products.length >= total) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 300) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, products.length, total, handleLoadMore]);

  useEffect(() => {
  }, [loadingMore]);

  const handleMobileSortChange = (sortValue) => {
    handleSort(sortValue);
  };

  const isLoading = loading && !loadingMore;
  const isLoadingFilters = loadingFilters && !filtersLoaded;

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-4">
        <div className="max-w-[1600px] mx-auto flex">
          <div className="hidden lg:block w-[270px]">
            <FilterSkeleton />
          </div>

          <div className="flex-1 px-4">
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
        <div className="hidden lg:block w-[270px] bg-white border border-gray-300 text-gray-600">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 text-sm font-semibold text-gray-800">
            <span>Filters</span>
            {hasSelectedFilters && (
              <button
                onClick={clearAllFilters}
                className="text-blue-600 text-xs font-medium hover:text-blue-700"
              >
                CLEAR ALL
              </button>
            )}
          </div>

          {hasSelectedFilters && (
            <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-gray-300 bg-gray-50">
              {Object.entries(selectedFilters).map(([key, values]) =>
                Array.isArray(values)
                  ? values.map((v) => (
                      <div
                        key={`${key}-${v}`}
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] px-2 py-[3px] rounded hover:bg-blue-100 transition-colors cursor-pointer"
                        onClick={() => removeSelected(key, v)}
                      >
                        <FaTimes size={8} className="hover:text-red-600" />
                        <span>{v}</span>
                      </div>
                    ))
                  : null
              )}

              {selectedFilters.priceRange && (
                <div
                  className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] px-2 py-[3px] rounded hover:bg-blue-100 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedFilters((p) => ({
                      ...p,
                      priceRange: null,
                    }));
                    setTempPriceRange([0, 50000]);
                    fetchProducts(1, sort);
                  }}
                >
                  <FaTimes size={8} className="hover:text-red-600" />
                  <span>
                    ₹{selectedFilters.priceRange.min} – ₹
                    {selectedFilters.priceRange.max}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* PRICE FILTER */}
          <div className="px-4 py-4 border-b border-gray-200">
            <p className="text-xs font-semibold mb-2 text-gray-800">PRICE</p>
            <div className="w-[85%] mx-auto">
              <PriceSlider
                value={tempPriceRange}
                onChange={(e, v) => setTempPriceRange(v)}
                onChangeCommitted={(e, v) => {
                  handlePriceRangeChange(v);
                }}
                min={0}
                max={50000}
                step={100}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `₹${value}`}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>₹{tempPriceRange[0]}</span>
              <span>₹{tempPriceRange[1]}</span>
            </div>
          </div>

          {/* DYNAMIC FILTERS */}
          {isLoadingFilters ? (
            <div className="px-4 py-2">
              <div className="animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="mb-4">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                    {[...Array(4)].map((_, j) => (
                      <div
                        key={j}
                        className="h-3 w-24 bg-gray-200 rounded mb-1"
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : filters && filters.length > 0 ? (
            filters.map((filter) => {
              const values = getFilterValues(filter);
              if (!values.length) return null;

              const expanded = expandedFilters[filter.name];
              const visible = expanded ? values : values.slice(0, 4);
              const selectedCount = selectedFilters[filter.name]?.length || 0;

              return (
                <div
                  key={filter.name}
                  className="px-4 py-4 border-b border-gray-200"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-gray-800">
                      {filter.name.toUpperCase()}
                    </p>
                    {selectedCount > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        {selectedCount}
                      </span>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {visible.map((v) => (
                      <label
                        key={v}
                        className="flex items-center gap-2 text-sm mb-1 text-gray-600 hover:text-gray-800 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[filter.name]?.includes(v)}
                          onChange={() => handleFilterChange(filter.name, v)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="truncate">{v}</span>
                      </label>
                    ))}
                  </div>

                  {values.length > 4 && (
                    <button
                      className="text-sm text-blue-600 hover:text-blue-700 mt-1 font-medium"
                      onClick={() => toggleFilterExpand(filter.name)}
                    >
                      {expanded
                        ? "Show Less"
                        : `View ${values.length - 4} More`}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            filtersLoaded && (
              <div className="px-4 py-4 text-center text-gray-500">
                No filters available for this category
              </div>
            )
          )}

          {filtersLoaded && filters.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600">
                {filters.length} filters available
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 px-4">
          <div className="hidden lg:flex bg-white border border-gray-300 px-4 py-2 mb-3 items-center text-sm">
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
                        : "border-gray-300 text-gray-700 hover:border-yellow-600 hover:bg-yellow-50"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((p) => (
                  <NewSingleProductCard key={p._id} product={p} />
                ))}
              </div>

              {loadingMore && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading more products...</p>
                </div>
              )}

              <div
                ref={sentinelRef}
                id="scroll-sentinel"
                className="h-1 w-full"
                style={{ visibility: "hidden" }}
              />

              {!loadingMore && products.length < total && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <h2 className="text-xl font-semibold text-gray-600 mb-4">
                  No products found for the selected filters.
                </h2>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search terms or browse other categories.
                </p>
                {hasSelectedFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )
          )}

          {/* Error Display */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Error Loading Products
              </h3>
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => {
                  fetchProducts(1, sort);
                }}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    
      {/* MOBILE FILTER COMPONENT */}
      <NewFilter
        filters={filters}
        loadingFilters={loadingFilters}
        selectedFilters={selectedFilters}
        sort={mobileSort}
        productPriceRange={{ min: 0, max: 50000 }}
        tempPriceRange={tempPriceRange}
        onFilterChange={(newFilters) => {

          setSelectedFilters(newFilters);

          const productParams = buildProductParams(1, newFilters, sort);
          dispatch(fetchBrandSubProducts(productParams));

          const filterParams = buildFilterParams(newFilters);
          dispatch(fetchBrandSubFilters(filterParams));
        }}
        onSortChange={handleMobileSortChange}
        onTempPriceRangeChange={setTempPriceRange}
      />
    </div>
  );
};

export default BrandSubPage;
