"use client";
import {
  fetchBrandSubProducts,
  fetchBrandSubFilters,
  loadMoreBrandSubProducts,
} from "@/redux/serach/brandSlice";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import NewSingleProductCard from "@/main_pages/ProductPages.jsx/NewSingleProductCard";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Slider = dynamic(() => import("@mui/material/Slider"), {
  ssr: false,
});

const NewFilter = dynamic(() => import("@/components/searchMobile/NewFilter"), {
  ssr: false,
});

// Sort options matching your UI
const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price -- Low to High" },
  { value: "price_desc", label: "Price -- High to Low" },
  { value: "newest", label: "Newest First" },
];

// Process filter values
const getFilterValues = (filter) => {
  if (!filter || !filter.values) return [];
  return filter.values
    .map((value) => value.replace(/[^\x20-\x7E]/g, "").trim())
    .filter((value) => value);
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
  const searchTimeoutRef = useRef(null);

  // State for selected filters and sort
  const [selectedFilters, setSelectedFilters] = useState({});
  const [expandedFilters, setExpandedFilters] = useState({});
  const [tempPriceRange, setTempPriceRange] = useState([0, 50000]);

  // Extract price range from products
  const productPriceRange = useMemo(() => {
    if (products.length > 0) {
      const prices = products.map(p => {
        let price = typeof p.price === "number"
          ? p.price
          : typeof p.price === "object"
          ? Number(p.price?.current)
          : Number(p.price);
        return isNaN(price) || price <= 0 ? null : price;
      }).filter(p => p !== null);

      if (prices.length > 0) {
        return {
          min: Math.floor(Math.min(...prices)),
          max: Math.ceil(Math.max(...prices) * 1.1),
        };
      }
    }
    return { min: 0, max: 50000 };
  }, [products]);

  // Initialize temp price range
  useEffect(() => {
    setTempPriceRange([productPriceRange.min, productPriceRange.max]);
  }, [productPriceRange]);

  const toggleFilterExpand = (name) =>
    setExpandedFilters((p) => ({ ...p, [name]: !p[name] }));

  // Build params for products search
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

  // Debounced search for products
  const debouncedSearch = useCallback(
    (params) => {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        dispatch(fetchBrandSubProducts(params));
      }, 300);
    },
    [dispatch]
  );

  // Quick products update without debounce
  const updateProducts = useCallback(
    (params) => {
      clearTimeout(searchTimeoutRef.current);
      dispatch(fetchBrandSubProducts(params));
    },
    [dispatch]
  );

  /* ---------- INITIAL SEARCH ---------- */
  useEffect(() => {
    if (initialLoadDone.current) return;

    const productParams = buildProductParams(1);
    
    // Fetch products
    dispatch(fetchBrandSubProducts(productParams));
    
    // Fetch filters only ONCE on initial load
    dispatch(fetchBrandSubFilters({ brand, subCategory }));

    initialLoadDone.current = true;
  }, [brand, subCategory, dispatch]);

  /* ---------- SORT CHANGE ---------- */
  useEffect(() => {
    if (!initialLoadDone.current) return;

    const productParams = buildProductParams(1);
    debouncedSearch(productParams);
    // NO filter fetching on sort change
  }, [sort, debouncedSearch, initialLoadDone]);

  /* ---------- INFINITE SCROLL ---------- */
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || products.length >= total) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 300) {
        const nextPage = currentPage + 1;
        const params = buildProductParams(nextPage);
        dispatch(loadMoreBrandSubProducts(params));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, products.length, total, currentPage, dispatch, buildProductParams]);

  const handleSort = (sortValue) => {
    const p = new URLSearchParams(searchParams.toString());

    if (sortValue === "relevance") {
      p.delete("sort");
    } else {
      p.set("sort", sortValue);
    }

    router.push(`?${p.toString()}`, { scroll: false });

    if (initialLoadDone.current) {
      const params = buildProductParams(1);
      params.sort = sortValue;
      debouncedSearch(params);
    }
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

      // Update products with new filters
      // NO filter fetching - filters remain static
      const productParams = buildProductParams(1, newFilters);
      updateProducts(productParams);

      return newFilters;
    });
  };

  const handlePriceRangeChange = (range) => {
    const newFilters = {
      ...selectedFilters,
      priceRange: { min: range[0], max: range[1] },
    };

    setSelectedFilters(newFilters);
    
    // Update products with new price range
    // NO filter fetching
    const productParams = buildProductParams(1, newFilters);
    updateProducts(productParams);
  };

  const removeSelected = (filterName, value) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterName] || [];
      const newValues = currentValues.filter((item) => item !== value);

      const newFilters = {
        ...prev,
        [filterName]: newValues,
      };

      // Update products
      // NO filter fetching
      const productParams = buildProductParams(1, newFilters);
      updateProducts(productParams);

      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const clearedFilters = {};

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        clearedFilters[filter.name] = [];
      });
    } else {
      Object.keys(selectedFilters).forEach((key) => {
        clearedFilters[key] = [];
      });
    }

    setSelectedFilters(clearedFilters);
    setTempPriceRange([productPriceRange.min, productPriceRange.max]);

    // Fetch products with cleared filters
    // NO filter fetching
    const productParams = buildProductParams(1, clearedFilters);
    updateProducts(productParams);
  };

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
  }, [brand, subCategory]);

  const hasSelectedFilters = useMemo(() => {
    return Object.keys(selectedFilters).some(
      (key) =>
        (selectedFilters[key] && selectedFilters[key].length > 0) ||
        (key === "priceRange" && selectedFilters[key])
    );
  }, [selectedFilters]);

  // Filter out empty filter values
  const validFilters = useMemo(() => {
    return (filters || []).filter(
      (filter) => {
        const values = getFilterValues(filter);
        return values && values.length > 0;
      }
    );
  }, [filters]);

  // Show filters only when they're loaded or loading
  const shouldShowFilters = filtersLoaded || loadingFilters;

  const isLoading = loading && !loadingMore;
  const isLoadingFilters = loadingFilters && !filtersLoaded;

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 pt-4">
        <div className="max-w-[1600px] mx-auto flex">
          <div className="hidden lg:block w-[270px]">
            <div className="w-80 bg-white border border-gray-200 rounded-lg h-screen sticky top-24">
              <div className="animate-pulse p-4">
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
                <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                  <div className="w-full aspect-square bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1 w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
                  </div>
                </div>
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
        <div className="hidden lg:block w-[240px] bg-white border border-gray-300 text-gray-600">
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

          {/* Show loading indicator for filters */}
          {isLoadingFilters && validFilters.length === 0 && (
            <div className="px-4 py-3 border-b border-gray-200">
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
          )}

          {/* SELECTED FILTERS */}
          {hasSelectedFilters && shouldShowFilters && (
            <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-gray-300 bg-gray-50">
              {Object.entries(selectedFilters).map(([key, values]) => {
                if (key === "priceRange") {
                  if (values && values.min !== undefined && values.max !== undefined) {
                    return (
                      <div
                        key={`price-${values.min}-${values.max}`}
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] px-2 py-[3px] rounded hover:bg-blue-100 transition-colors cursor-pointer"
                        onClick={() => {
                          const newFilters = { ...selectedFilters, priceRange: null };
                          setSelectedFilters(newFilters);
                          const productParams = buildProductParams(1, newFilters);
                          updateProducts(productParams);
                        }}
                      >
                        <FaTimes size={8} className="hover:text-red-600" />
                        <span>
                          ₹{values.min} – ₹{values.max}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }

                if (Array.isArray(values) && values.length > 0) {
                  return values.map((v) => (
                    <div
                      key={`${key}-${v}`}
                      className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] px-2 py-[3px] rounded hover:bg-blue-100 transition-colors cursor-pointer"
                      onClick={() => removeSelected(key, v)}
                    >
                      <FaTimes size={8} className="hover:text-red-600" />
                      <span>{v}</span>
                    </div>
                  ));
                }
                return null;
              })}
            </div>
          )}

          {/* PRICE FILTER */}
          {shouldShowFilters && (
            <div className="px-4 py-4 border-b border-gray-200">
              <p className="text-xs font-semibold mb-2 text-gray-800">PRICE</p>
              <div className="w-[85%] mx-auto">
                <Slider
                  value={tempPriceRange}
                  min={productPriceRange.min}
                  max={productPriceRange.max}
                  step={100}
                  onChange={(e, v) => setTempPriceRange(v)}
                  onChangeCommitted={(e, v) => {
                    handlePriceRangeChange(v);
                    // NO filter fetching
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>₹{productPriceRange.min}</span>
                <span>₹{productPriceRange.max}</span>
              </div>
            </div>
          )}

          {/* DYNAMIC FILTERS */}
          {shouldShowFilters && validFilters.length > 0 ? (
            validFilters.map((filter) => {
              const values = getFilterValues(filter);
              if (!values.length) return null;

              const expanded = expandedFilters[filter.name];
              const visible = expanded ? values : values.slice(0, 4);
              const currentSelections = selectedFilters[filter.name] || [];

              return (
                <div
                  key={filter.name}
                  className="px-4 py-4 border-b border-gray-200"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-semibold text-gray-800">
                      {filter.name.toUpperCase()}
                    </p>
                    {currentSelections.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        {currentSelections.length}
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
                          checked={currentSelections.includes(v)}
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
          ) : shouldShowFilters && !loadingFilters && filters?.length === 0 ? (
            <div className="px-4 py-4 text-center text-gray-500">
              No filters available
            </div>
          ) : null}
        </div>

        {/* ---------------- PRODUCTS ---------------- */}
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p) => (
              <NewSingleProductCard key={p._id} product={p} />
            ))}
          </div>

          {/* LOADING INDICATOR */}
          {loadingMore && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* END OF RESULTS */}
          {products.length > 0 && products.length >= total && (
            <div className="text-center py-8 text-gray-500">
              You've reached the end
            </div>
          )}

          {/* NO PRODUCTS FOUND */}
          {products.length === 0 && !loadingMore && (
            <div className="text-center py-12 text-gray-500">
              No products found
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter */}
      <NewFilter
        filters={validFilters}
        loadingFilters={loadingFilters}
        selectedFilters={selectedFilters}
        sort={sort}
        productPriceRange={productPriceRange}
        tempPriceRange={tempPriceRange}
        onFilterChange={(newFilters) => {
          setSelectedFilters(newFilters);
          const productParams = buildProductParams(1, newFilters);
          updateProducts(productParams);
          // NO filter fetching
        }}
        onSortChange={handleSort}
        onTempPriceRangeChange={setTempPriceRange}
      />
    </div>
  );
};

export default BrandSubPage;