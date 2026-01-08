"use client";

import {
  CategoryTagProducts,
  loadMoreCategoryTagProducts,
  getCategoryTagFilters,
  resetFiltersLoaded,
} from "../../../../redux/serach/catTagProdactSlice";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import NewSingleProductCard from "../../../../main_pages/ProductPages.jsx/NewSingleProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import NewFilter from "../.../../../../../components/searchMobile/NewFilter";

/* ---------------- PRICE SLIDER ---------------- */
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

const SORTS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price -- Low to High", value: "price_asc" },
  { label: "Price -- High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
];

const SearchPage = ({ params }) => {
  const p = React.use(params);
  const categoryTag = p.categorytag || "";

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "relevance";

  const {
    products,
    total,
    filters,
    priceRange: apiPriceRange, // ✅ GET PRICE RANGE FROM REDUX (DYNAMIC FROM API)
    loadingMore,
    loadingFilters,
    filtersLoaded,
    page: currentPage,
    limit,
  } = useSelector((state) => state.catTagProdact);

  const initialSearchDone = useRef(false);
  const searchTimeoutRef = useRef(null);

  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: null,
  });
  const [expandedFilters, setExpandedFilters] = useState({});
  const [tempPriceRange, setTempPriceRange] = useState([0, 10000]);

  // ✅ GET DISPLAY PRICE RANGE (API OR FALLBACK)
  const productPriceRange = useMemo(() => {
    // Priority 1: Use API price range from Redux
    if (apiPriceRange) {
      return apiPriceRange;
    }
    
    // Priority 2: Calculate from current products
    if (products.length > 0) {
      const prices = products
        .map(p => {
          if (p.priceRange) return p.priceRange;
          if (p.salePrice) return p.salePrice;
          if (p.price) return p.price;
          return 0;
        })
        .filter(p => p > 0);
      
      if (prices.length > 0) {
        return {
          min: Math.min(...prices),
          max: Math.max(...prices)
        };
      }
    }
    
    // Priority 3: Default values
    return { min: 0, max: 10000 };
  }, [apiPriceRange, products]);

  // ✅ INITIALIZE TEMP PRICE RANGE FROM API/FALLBACK
  useEffect(() => {
    if (productPriceRange) {
      setTempPriceRange([productPriceRange.min, productPriceRange.max]);
    } else {
      setTempPriceRange([0, 10000]);
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
  const buildSearchParams = (page = 1, overrideFilters = null) => {
    const params = {
      categoryTag,
      page,
      limit: limit || 20,
      filters: overrideFilters || selectedFilters,
      sort: sort,
    };
    return params;
  };

  // Initialize selectedFilters based on filter names from API
  useEffect(() => {
    if (filters && filters.length > 0) {
      const filterNames = filters
        .filter((f) => f.values && f.values.length > 0)
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

  // Debounced search for products (NO filter fetching)
  const debouncedSearch = useCallback(
    (params) => {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        dispatch(CategoryTagProducts(params));
      }, 300);
    },
    [dispatch]
  );

  // Quick products update without debounce
  const updateProducts = useCallback(
    (params) => {
      clearTimeout(searchTimeoutRef.current);
      dispatch(CategoryTagProducts(params));
    },
    [dispatch]
  );

  /* ---------- INITIAL SEARCH ---------- */
  useEffect(() => {
    if (initialSearchDone.current) return;

    dispatch(resetFiltersLoaded());

    const params = buildSearchParams(1);
    
    // ✅ FETCH PRODUCTS FIRST
    dispatch(CategoryTagProducts(params));
    
    // ✅ FETCH FILTERS (INCLUDING PRICE RANGE) ONLY ONCE
    dispatch(getCategoryTagFilters({ categoryTag }));

    initialSearchDone.current = true;
  }, [categoryTag, dispatch]);

  /* ---------- SORT CHANGE ---------- */
  useEffect(() => {
    if (!initialSearchDone.current) return;

    const productParams = buildSearchParams(1);
    debouncedSearch(productParams);
    
    // ✅ NO FILTER FETCHING ON SORT CHANGE
  }, [
    sort,
    debouncedSearch,
    initialSearchDone,
  ]);

  /* ---------- INFINITE SCROLL ---------- */
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore) return;
      if (products.length === 0 || products.length >= total) return;

      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 300;

      if (isNearBottom) {
        const nextPage = currentPage + 1;
        const params = buildSearchParams(nextPage);
        dispatch(loadMoreCategoryTagProducts(params));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    loadingMore,
    products.length,
    total,
    currentPage,
    dispatch,
    selectedFilters,
    sort,
  ]);

  const handleSort = (value) => {
    const p = new URLSearchParams(searchParams.toString());

    if (value === "relevance") {
      p.delete("sort");
    } else {
      p.set("sort", value);
    }

    router.push(`?${p.toString()}`, { scroll: false });

    if (initialSearchDone.current) {
      const params = buildSearchParams(1);
      params.sort = value;
      debouncedSearch(params);
    }
  };

  const handleFilterChange = (name, value) => {
    setSelectedFilters((prev) => {
      const curr = prev[name] || [];
      const newFilters = {
        ...prev,
        [name]: curr.includes(value)
          ? curr.filter((v) => v !== value)
          : [...curr, value],
      };

      // ✅ UPDATE PRODUCTS IMMEDIATELY WITH NEW FILTERS
      // ✅ NO FILTER FETCHING - FILTERS REMAIN STATIC
      const productParams = buildSearchParams(1, newFilters);
      updateProducts(productParams);

      return newFilters;
    });
  };

  const removeSelected = (name, value) => {
    setSelectedFilters((prev) => {
      const newFilters = {
        ...prev,
        [name]: prev[name]?.filter((v) => v !== value),
      };

      // ✅ UPDATE PRODUCTS IMMEDIATELY
      // ✅ NO FILTER FETCHING
      const productParams = buildSearchParams(1, newFilters);
      updateProducts(productParams);

      return newFilters;
    });
  };

  // ✅ PRICE FILTER CHANGE HANDLER
  const handlePriceChange = (newRange) => {
    const range = { min: newRange[0], max: newRange[1] };
    const newFilters = {
      ...selectedFilters,
      priceRange: range,
    };

    setSelectedFilters(newFilters);
    
    // ✅ UPDATE PRODUCTS WITH NEW PRICE FILTER
    // ✅ NO FILTER FETCHING
    const productParams = buildSearchParams(1, newFilters);
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
    const productParams = buildSearchParams(1, newFilters);
    updateProducts(productParams);
  };

  const clearAllFilters = () => {
    const clearedFilters = { priceRange: null };

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.values && filter.values.length > 0) {
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
    const productParams = buildSearchParams(1, clearedFilters);
    updateProducts(productParams);
  };

  /* ---------- Calculate hasSelectedFilters ---------- */
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
      (filter) => filter.values && filter.values.length > 0
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
                  onChange={(e, v) => setTempPriceRange(v)}
                  onChangeCommitted={(e, v) => handlePriceChange(v)}
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>₹{productPriceRange.min}</span>
                  <span>₹{productPriceRange.max}</span>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC FILTERS */}
          {shouldShowFilters && validFilters.length > 0 ? (
            validFilters.map((filter) => {
              const values = filter.values || [];
              if (!values || values.length === 0) return null;

              const expanded = expandedFilters[filter.name];
              const visible = expanded ? values : values.slice(0, 4);
              const currentSelections = selectedFilters[filter.name] || [];

              return (
                <div
                  key={filter.name}
                  className="px-4 py-4 border-b border-gray-200"
                >
                  <p className="mb-2 text-gray-800 font-fk text-[11px] font-semibold text-fkText leading-[1.4]">
                    {filter.name.toUpperCase()}
                  </p>

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
          const productParams = buildSearchParams(1, newFilters);
          updateProducts(productParams);
        }}
        onSortChange={handleSort}
        onTempPriceRangeChange={setTempPriceRange}
        onPriceChange={handlePriceChange}
        onClearPriceFilter={clearPriceFilter}
      />
    </div>
  );
};

export default SearchPage;