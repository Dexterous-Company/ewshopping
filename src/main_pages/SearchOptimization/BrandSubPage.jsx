"use client";
import {
  fetchBrandSubProducts,
  fetchBrandSubFilters,
  loadMoreBrandSubProducts,
  clearProductsForNewBrandSub, // Import new action
} from "../../redux/serach/brandSlice";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import NewSingleProductCard from "../../main_pages/ProductPages.jsx/NewSingleProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { styled } from "@mui/material/styles";
import ProductGridSkeleton from "../../components/ProductGridSkeleton";

const Slider = dynamic(() => import("@mui/material/Slider"), {
  ssr: false,
});

const NewFilter = dynamic(() => import("../../components/searchMobile/NewFilter"), {
  ssr: false,
});

/* ---------------- PRICE SLIDER STYLES ---------------- */
const PriceSlider = styled(Slider)({
  color: "#2874f0",
  height: 2.5,
  padding: "8px 0",

  "& .MuiSlider-track": {
    border: "none",
    height: 2.5,
  },

  "& .MuiSlider-rail": {
    backgroundColor: "#d1d5db",
    opacity: 1,
    height: 2.5,
  },

  "& .MuiSlider-thumb": {
    height: 12,
    width: 12,
    backgroundColor: "#fff",
    border: "2px solid #2874f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",

    "&:hover": {
      boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
    },

    "&::after": {
      display: "none",
    },
  },
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

  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "relevance";

  const {
    products,
    filters,
    priceRange,
    total,
    page: currentPage,
    limit,
    loading,
    loadingMore,
    loadingFilters,
    filtersLoaded,
    hasFetchedOnce,
    currentBrandSub, // Add current brand/subcategory tracking
  } = useSelector((state) => state.brandSub);

  // Refs
  const initialLoadDone = useRef(false);
  const previousBrandSubRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Refs for infinite scroll
  const pageRef = useRef(currentPage);
  const loadingMoreRef = useRef(loadingMore);
  const productsRef = useRef(products);
  const totalRef = useRef(total);

  // Update refs when state changes
  useEffect(() => {
    pageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  // State for selected filters and sort
  const [selectedFilters, setSelectedFilters] = useState({});
  const [expandedFilters, setExpandedFilters] = useState({});
  const [tempPriceRange, setTempPriceRange] = useState([0, 50000]);

  // ✅ GET DISPLAY PRICE RANGE (API OR FALLBACK)
  const productPriceRange = useMemo(() => {
    // Priority 1: Use API price range from Redux
    if (priceRange) {
      return priceRange;
    }
    
    // Priority 2: Calculate from current products
    if (products.length > 0) {
      const prices = products
        .map(p => {
          let price = typeof p.price === "number"
            ? p.price
            : typeof p.price === "object"
            ? Number(p.price?.current)
            : Number(p.price);
          return isNaN(price) || price <= 0 ? null : price;
        })
        .filter(p => p !== null);
      
      if (prices.length > 0) {
        return {
          min: Math.floor(Math.min(...prices)),
          max: Math.ceil(Math.max(...prices) * 1.1),
        };
      }
    }
    
    // Priority 3: Default values
    return { min: 0, max: 50000 };
  }, [priceRange, products]);

  // ✅ INITIALIZE TEMP PRICE RANGE FROM API/FALLBACK
  useEffect(() => {
    if (productPriceRange) {
      setTempPriceRange([productPriceRange.min, productPriceRange.max]);
    }
  }, [productPriceRange]);

  // ✅ RESET TEMP PRICE RANGE WHEN PRICE FILTER IS CLEARED
  useEffect(() => {
    if (!selectedFilters.priceRange && productPriceRange) {
      setTempPriceRange([productPriceRange.min, productPriceRange.max]);
    }
  }, [selectedFilters.priceRange, productPriceRange]);

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

  // Debounced search for products (NO filter fetching)
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
    const brandSubKey = `${brand}-${subCategory}`;
    if (previousBrandSubRef.current !== brandSubKey) {
      previousBrandSubRef.current = brandSubKey;

      // 🔥 CLEAR OLD DATA + SHOW LOADER
      dispatch(clearProductsForNewBrandSub());
      initialLoadDone.current = false;
      clearTimeout(searchTimeoutRef.current);

      const productParams = buildProductParams(1);
      
      // ✅ FETCH PRODUCTS FIRST
      dispatch(fetchBrandSubProducts(productParams));
      
      // ✅ FETCH FILTERS (INCLUDING PRICE RANGE) ONLY ONCE
      dispatch(fetchBrandSubFilters({ brand, subCategory }));

      initialLoadDone.current = true;
    }
  }, [brand, subCategory, dispatch]);

  /* ---------- SORT CHANGE ---------- */
  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (currentBrandSub !== `${brand}-${subCategory}`) return; // Only update if we're on the correct brand/sub

    const productParams = buildProductParams(1);
    debouncedSearch(productParams);
    
    // ✅ NO FILTER FETCHING ON SORT CHANGE
  }, [sort, debouncedSearch, initialLoadDone, buildProductParams, currentBrandSub, brand, subCategory]);

  /* ---------- INFINITE SCROLL ---------- */
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMoreRef.current) return;
      if (loading) return;

      const currentProducts = productsRef.current;
      const currentTotal = totalRef.current;

      if (
        currentProducts.length === 0 ||
        currentProducts.length >= currentTotal
      )
        return;

      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 300;

      if (isNearBottom) {
        const nextPage = pageRef.current + 1;

        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
          const params = buildProductParams(nextPage);
          dispatch(loadMoreBrandSubProducts(params));
        }, 200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(searchTimeoutRef.current);
    };
  }, [dispatch, loading, buildProductParams]);

  const handleSort = (sortValue) => {
    const p = new URLSearchParams(searchParams.toString());

    if (sortValue === "relevance") {
      p.delete("sort");
    } else {
      p.set("sort", sortValue);
    }

    router.push(`?${p.toString()}`, { scroll: false });

    if (initialLoadDone.current && currentBrandSub === `${brand}-${subCategory}`) {
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

      // ✅ UPDATE PRODUCTS WITH NEW FILTERS
      // ✅ NO FILTER FETCHING - FILTERS REMAIN STATIC
      const productParams = buildProductParams(1, newFilters);
      updateProducts(productParams);

      return newFilters;
    });
  };

  // ✅ PRICE FILTER CHANGE HANDLER
  const handlePriceRangeChange = (range) => {
    const newFilters = {
      ...selectedFilters,
      priceRange: { min: range[0], max: range[1] },
    };

    setSelectedFilters(newFilters);
    
    // ✅ UPDATE PRODUCTS WITH NEW PRICE RANGE
    // ✅ NO FILTER FETCHING
    const productParams = buildProductParams(1, newFilters);
    updateProducts(productParams);
  };

  // ✅ CLEAR PRICE FILTER
  const clearPriceFilter = () => {
    const newFilters = {
      ...selectedFilters,
      priceRange: null,
    };

    setSelectedFilters(newFilters);

    // ✅ RESET TEMP PRICE RANGE TO CURRENT API/FALLBACK RANGE
    if (productPriceRange) {
      setTempPriceRange([productPriceRange.min, productPriceRange.max]);
    }

    // ✅ UPDATE PRODUCTS
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

      // ✅ UPDATE PRODUCTS
      // ✅ NO FILTER FETCHING
      const productParams = buildProductParams(1, newFilters);
      updateProducts(productParams);

      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const clearedFilters = { priceRange: null };

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.values && getFilterValues(filter).length > 0) {
          clearedFilters[filter.name] = [];
        }
      });
    } else {
      Object.keys(selectedFilters).forEach((key) => {
        if (key !== "priceRange") {
          clearedFilters[key] = [];
        }
      });
    }

    setSelectedFilters(clearedFilters);
    
    // ✅ RESET TEMP PRICE RANGE TO CURRENT API/FALLBACK RANGE
    if (productPriceRange) {
      setTempPriceRange([productPriceRange.min, productPriceRange.max]);
    }

    // ✅ FETCH PRODUCTS WITH CLEARED FILTERS
    // ✅ NO FILTER FETCHING
    const productParams = buildProductParams(1, clearedFilters);
    updateProducts(productParams);
  };

  // Initialize selectedFilters based on filter names from API
  useEffect(() => {
    if (filters && filters.length > 0) {
      const filterNames = filters
        .filter((f) => getFilterValues(f).length > 0)
        .map((f) => f.name);

      setSelectedFilters((prev) => {
        const newFilterState = { ...prev };
        let hasChanges = false;

        filterNames.forEach((name) => {
          if (!(name in newFilterState)) {
            newFilterState[name] = [];
            hasChanges = true;
          }
        });

        if (!("priceRange" in newFilterState)) {
          newFilterState["priceRange"] = null;
          hasChanges = true;
        }

        return hasChanges ? newFilterState : prev;
      });
    }
  }, [filters]);

  const hasSelectedFilters = Object.entries(selectedFilters).some(
    ([key, value]) => {
      if (key === "priceRange") {
        return (
          value &&
          productPriceRange &&
          (value.min !== productPriceRange.min ||
            value.max !== productPriceRange.max)
        );
      }
      return Array.isArray(value) && value.length > 0;
    }
  );

  // Filter out empty filter values
  const validFilters = useMemo(() => {
    return (filters || []).filter(
      (filter) => getFilterValues(filter).length > 0
    );
  }, [filters]);

  // Show filters only when they're loaded or loading
  const shouldShowFilters = filtersLoaded || loadingFilters;

  return (
    <div className="min-h-screen bg-gray-100 pt-4">
      <div className="max-w-[1600px] mx-auto flex">
        {/* ---------------- LEFT FILTER ---------------- */}
        <div className="hidden lg:block w-[240px] bg-gray-50 border border-gray-300 text-gray-600">
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

          {/* Show loading indicator for filters */}
          {loadingFilters && validFilters.length === 0 && (
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          )}

          {/* SELECTED FILTERS */}
          {hasSelectedFilters && shouldShowFilters && (
            <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-gray-300 bg-gray-100">
              {Object.entries(selectedFilters).map(([key, values]) => {
                if (key === "priceRange") {
                  if (
                    values &&
                    productPriceRange &&
                    (values.min !== productPriceRange.min ||
                      values.max !== productPriceRange.max)
                  ) {
                    return (
                      <div
                        key={`price-${values.min}-${values.max}`}
                        className="flex items-center gap-1 bg-gray-200 text-gray-700 text-[11px] px-2 py-[3px] rounded"
                      >
                        <X
                          size={8}
                          className="cursor-pointer"
                          onClick={clearPriceFilter}
                        />
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
                      className="flex items-center gap-1 bg-gray-200 text-gray-700 text-[11px] px-2 py-[3px] rounded"
                    >
                      <X
                        size={8}
                        className="cursor-pointer"
                        onClick={() => removeSelected(key, v)}
                      />
                      <span>{v}</span>
                    </div>
                  ));
                }
                return null;
              })}
            </div>
          )}

          {/* ✅ PRICE FILTER - SHOW ONLY WHEN WE HAVE PRICE RANGE DATA */}
          {shouldShowFilters && productPriceRange && (
            <div className="px-4 py-4 border-b border-gray-200">
              <p className="text-xs font-semibold mb-2 text-gray-800">PRICE</p>
              <div className="w-[85%] mx-auto">
                <PriceSlider
                  value={tempPriceRange}
                  min={productPriceRange.min}
                  max={productPriceRange.max}
                  step={100}
                  onChange={(e, v) => setTempPriceRange(v)}
                  onChangeCommitted={(e, v) => handlePriceRangeChange(v)}
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
                        className="flex items-center text-gray-900 gap-3 mb-2 cursor-pointer font-inter text-[13px] font-normal text-fkText leading-[1.4]"
                      >
                        <input
                          type="checkbox"
                          checked={currentSelections.includes(v)}
                          onChange={() => handleFilterChange(filter.name, v)}
                          className="
                            w-[14px] h-[14px]
                            cursor-pointer
                            border-none
                            outline-none
                            accent-blue-600
                          "
                        />
                        <span className="truncate">{v}</span>
                      </label>
                    ))}
                  </div>

                  {values.length > 4 && (
                    <button
                      className="text-sm text-blue-600 mt-1 hover:text-blue-600"
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
            <div className="px-4 py-4 text-sm text-gray-500 text-center">
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
                        : "border-yellow-600 text-gray-700 hover:bg-yellow-50"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SHOW LOADING STATE WHEN BRAND/SUB CHANGES */}
          {loading && products.length === 0 && (
            <ProductGridSkeleton count={limit || 20} />
          )}

          {/* PRODUCTS GRID - Only show when not loading or if we have products */}
          {(!loading || products.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((p) => (
                <NewSingleProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {/* LOADING INDICATOR FOR LOAD MORE */}
          {loadingMore && (
            <div className="mt-6">
              <ProductGridSkeleton count={5} />
            </div>
          )}

          {/* END OF RESULTS */}
          {products.length > 0 && products.length >= total && (
            <div className="text-center py-8 text-gray-500">
              You've reached the end
            </div>
          )}

          {/* NO PRODUCTS FOUND */}
          {hasFetchedOnce && !loading && products.length === 0 && (
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
        }}
        onSortChange={handleSort}
        onTempPriceRangeChange={setTempPriceRange}
        onPriceChange={handlePriceRangeChange}
        onClearPriceFilter={clearPriceFilter}
      />
    </div>
  );
};

export default BrandSubPage;