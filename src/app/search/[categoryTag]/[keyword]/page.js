"use client";

import {
  searchNewProducts,
  loadMoreProducts,
  getFilters,
  resetFiltersLoaded,
  clearProductsForNewSearch, // Import the clear action
} from "../../../../redux/serach/newSerchProdactSlice";
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import NewSingleProductCard from "../../../../main_pages/ProductPages.jsx/NewSingleProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import NewFilter from "../../../../components/searchMobile/NewFilter";
import ProductGridSkeleton from "../../../../components/ProductGridSkeleton";

/* ---------------- MEMOIZED COMPONENTS ---------------- */
const PriceSlider = memo(styled(Slider)({
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
}));

const SORTS = [
  { label: "Relevance", value: "relevance" },
  { label: "Price -- Low to High", value: "price_asc" },
  { label: "Price -- High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
];

/* ---------------- FILTER SUB-COMPONENTS ---------------- */
const FilterItem = memo(({ filter, expandedFilters, selectedFilters, onFilterChange, onToggleExpand }) => {
  const values = filter.values || [];
  const expanded = expandedFilters[filter.name];
  const visible = expanded ? values : values.slice(0, 4);
  const currentSelections = selectedFilters[filter.name] || [];
  
  if (!values || values.length === 0) return null;
  
  return (
    <div className="px-4 py-4 border-b border-gray-200">
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
            onChange={() => onFilterChange(filter.name, v)}
            className="
              w-[14px] h-[14px]
              cursor-pointer
              border-none
              outline-none
              accent-blue-600
            "
            aria-label={`Filter by ${v}`}
          />
          <span className="truncate">{v}</span>
        </label>
      ))}

      {values.length > 4 && (
        <button
          className="text-sm text-blue-600 mt-1 hover:text-blue-600"
          onClick={() => onToggleExpand(filter.name)}
          aria-expanded={expanded}
        >
          {expanded
            ? "Show Less"
            : `View ${values.length - 4} More`}
        </button>
      )}
    </div>
  );
});

FilterItem.displayName = 'FilterItem';

const SelectedFilterTag = memo(({ type, value, onRemove }) => {
  if (type === "price") {
    return (
      <div className="flex items-center gap-1 bg-gray-200 text-gray-700 text-[11px] px-2 py-[3px] rounded">
        <X 
          size={8}
          className="cursor-pointer"
          onClick={onRemove}
          aria-label={`Remove price filter ${value}`}
        />
        <span>{value}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-1 bg-gray-200 text-gray-700 text-[11px] px-2 py-[3px] rounded">
      <X 
        size={8}
        className="cursor-pointer"
        onClick={onRemove}
        aria-label={`Remove ${value} filter`}
      />
      <span>{value}</span>
    </div>
  );
});

SelectedFilterTag.displayName = 'SelectedFilterTag';

/* ---------------- MAIN COMPONENT ---------------- */
const SearchPage = memo(({ params }) => {
  const p = React.use(params);
  const searchQuery = p.keyword || "";
  const categoryTag = p.categoryTag || "";

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "relevance";

  // Redux state with selector optimization
  const {
    products,
    loading,
    total,
    filters,
    priceRange: apiPriceRange,
    loadingMore,
    loadingFilters,
    filtersLoaded,
    page: currentPage,
    limit,
    hasFetchedOnce,
    currentSearch,
  } = useSelector((state) => state.searchNew);

  // Refs
  const initialSearchDone = useRef(false);
  const previousSearchRef = useRef(null);
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

  // State
  const [selectedFilters, setSelectedFilters] = useState({ priceRange: null });
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
          if (p.price) {
            if (typeof p.price === 'object' && p.price.current) {
              return Number(p.price.current);
            }
            return Number(p.price);
          }
          return 0;
        })
        .filter(p => p > 0 && !isNaN(p));
      
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

  // Memoized values
  const validFilters = useMemo(() => 
    (filters || []).filter(filter => filter.values?.length > 0),
    [filters]
  );

  const shouldShowFilters = useMemo(
    () => filtersLoaded || loadingFilters,
    [filtersLoaded, loadingFilters]
  );

  const shouldShowPriceFilter = useMemo(
    () => shouldShowFilters && productPriceRange,
    [shouldShowFilters, productPriceRange]
  );

  // Memoized search utilities
  const buildSearchParams = useCallback((page = 1, overrideFilters = null) => ({
    q: searchQuery,
    categoryTag,
    page,
    limit: limit || 20,
    filters: overrideFilters || selectedFilters,
    sort,
  }), [searchQuery, categoryTag, limit, selectedFilters, sort]);

  // Build params for filters only
  const buildFiltersParams = useCallback((overrideFilters = null) => ({
    q: searchQuery,
    categoryTag,
    filters: overrideFilters || selectedFilters,
  }), [searchQuery, categoryTag, selectedFilters]);

  const debouncedSearch = useCallback((params) => {
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(searchNewProducts(params));
    }, 300);
  }, [dispatch]);

  const updateProducts = useCallback((params) => {
    clearTimeout(searchTimeoutRef.current);
    dispatch(searchNewProducts(params));
  }, [dispatch]);

  // Debounced filters fetch
  const debouncedFetchFilters = useCallback((params) => {
    const filtersTimeout = setTimeout(() => {
      dispatch(getFilters(params));
    }, 200);
    return () => clearTimeout(filtersTimeout);
  }, [dispatch]);

  // Initialize selected filters
  useEffect(() => {
    if (validFilters.length > 0) {
      const filterNames = validFilters.map(f => f.name);
      
      setSelectedFilters(prev => {
        const newFilterState = { ...prev };
        let hasChanges = false;

        filterNames.forEach(name => {
          if (!(name in newFilterState)) {
            newFilterState[name] = [];
            hasChanges = true;
          }
        });

        if (!("priceRange" in newFilterState)) {
          newFilterState.priceRange = null;
          hasChanges = true;
        }

        return hasChanges ? newFilterState : prev;
      });
    }
  }, [validFilters]);

  /* ---------- INITIAL SEARCH ---------- */
  useEffect(() => {
    const searchKey = `${searchQuery}-${categoryTag}`;
    if (previousSearchRef.current !== searchKey) {
      previousSearchRef.current = searchKey;

      // 🔥 CLEAR OLD DATA + SHOW LOADER
      dispatch(clearProductsForNewSearch());
      initialSearchDone.current = false;
      clearTimeout(searchTimeoutRef.current);

      dispatch(resetFiltersLoaded());
      const params = buildSearchParams(1);
      
      dispatch(searchNewProducts(params));
      dispatch(getFilters(buildFiltersParams()));
      
      initialSearchDone.current = true;
    }
  }, [searchQuery, categoryTag, dispatch, buildSearchParams, buildFiltersParams]);

  /* ---------- FILTER / SORT CHANGE ---------- */
  useEffect(() => {
    if (!initialSearchDone.current) return;
    if (currentSearch !== searchQuery) return; // Only update if we're on the correct search

    const productParams = buildSearchParams(1);
    const filterParams = buildFiltersParams();

    // Fetch products with debounce
    debouncedSearch(productParams);

    // Also update filters (and price range) based on current selection
    debouncedFetchFilters(filterParams);
  }, [
    selectedFilters,
    sort,
    debouncedSearch,
    debouncedFetchFilters,
    initialSearchDone,
    currentSearch,
    searchQuery,
    buildSearchParams,
    buildFiltersParams,
  ]);

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
          const params = buildSearchParams(nextPage);
          dispatch(loadMoreProducts(params));
        }, 200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(searchTimeoutRef.current);
    };
  }, [dispatch, loading, buildSearchParams]);

  // Event handlers
  const handleSort = useCallback((value) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (value === "relevance") {
      newParams.delete("sort");
    } else {
      newParams.set("sort", value);
    }
    
    router.push(`?${newParams.toString()}`, { scroll: false });

    if (initialSearchDone.current && currentSearch === searchQuery) {
      const params = buildSearchParams(1);
      params.sort = value;
      debouncedSearch(params);
    }
  }, [searchParams, router, buildSearchParams, debouncedSearch, currentSearch, searchQuery]);

  const handleFilterChange = useCallback((name, value) => {
    setSelectedFilters(prev => {
      const curr = prev[name] || [];
      const newFilters = {
        ...prev,
        [name]: curr.includes(value)
          ? curr.filter(v => v !== value)
          : [...curr, value],
      };

      const productParams = buildSearchParams(1, newFilters);
      updateProducts(productParams);

      return newFilters;
    });
  }, [buildSearchParams, updateProducts]);

  const removeSelected = useCallback((name, value) => {
    setSelectedFilters(prev => {
      const newFilters = {
        ...prev,
        [name]: prev[name]?.filter(v => v !== value),
      };

      const productParams = buildSearchParams(1, newFilters);
      updateProducts(productParams);

      return newFilters;
    });
  }, [buildSearchParams, updateProducts]);

  const handlePriceChange = useCallback((newRange) => {
    const range = { min: newRange[0], max: newRange[1] };
    const newFilters = {
      ...selectedFilters,
      priceRange: range,
    };

    setSelectedFilters(newFilters);

    // Fetch products with new price range
    updateProducts(buildSearchParams(1, newFilters));
  }, [selectedFilters, buildSearchParams, updateProducts]);

  const clearPriceFilter = useCallback(() => {
    const newFilters = {
      ...selectedFilters,
      priceRange: null,
    };

    setSelectedFilters(newFilters);

    // ✅ RESET TEMP PRICE RANGE TO CURRENT API/FALLBACK RANGE
    if (productPriceRange) {
      setTempPriceRange([productPriceRange.min, productPriceRange.max]);
    }

    // Fetch products with cleared price filter
    updateProducts(buildSearchParams(1, newFilters));
  }, [selectedFilters, productPriceRange, buildSearchParams, updateProducts]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters = { priceRange: null };
    
    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        if (filter.values?.length > 0) {
          clearedFilters[filter.name] = [];
        }
      });
    } else {
      Object.keys(selectedFilters).forEach(key => {
        if (key !== "priceRange") {
          clearedFilters[key] = [];
        }
      });
    }

    setSelectedFilters(clearedFilters);
    
    if (productPriceRange) {
      setTempPriceRange([productPriceRange.min, productPriceRange.max]);
    }

    const productParams = buildSearchParams(1, clearedFilters);
    updateProducts(productParams);
  }, [filters, selectedFilters, productPriceRange, buildSearchParams, updateProducts]);

  const toggleFilterExpand = useCallback((name) => {
    setExpandedFilters(prev => ({ ...prev, [name]: !prev[name] }));
  }, []);

  // Calculate selected filters
  const hasSelectedFilters = useMemo(() => 
    Object.entries(selectedFilters).some(([key, value]) => {
      if (key === "priceRange") {
        return (
          value &&
          productPriceRange &&
          (value.min !== productPriceRange.min ||
            value.max !== productPriceRange.max)
        );
      }
      return Array.isArray(value) && value.length > 0;
    }),
    [selectedFilters, productPriceRange]
  );

  // Memoized filter tags for rendering
  const selectedFilterTags = useMemo(() => {
    const tags = [];
    
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (key === "priceRange") {
        if (values && productPriceRange && (values.min !== productPriceRange.min || values.max !== productPriceRange.max)) {
          tags.push({
            key: `price-${values.min}-${values.max}`,
            type: "price",
            value: `₹${values.min} – ₹${values.max}`,
            onRemove: clearPriceFilter,
          });
        }
      } else if (Array.isArray(values) && values.length > 0) {
        values.forEach(v => {
          tags.push({
            key: `${key}-${v}`,
            type: "filter",
            value: v,
            onRemove: () => removeSelected(key, v),
          });
        });
      }
    });
    
    return tags;
  }, [selectedFilters, productPriceRange, clearPriceFilter, removeSelected]);

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
                aria-label="Clear all filters"
              >
                CLEAR ALL
              </button>
            )}
          </div>

          {/* Loading State */}
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
              {selectedFilterTags.map(tag => (
                <SelectedFilterTag
                  key={tag.key}
                  type={tag.type}
                  value={tag.value}
                  onRemove={tag.onRemove}
                />
              ))}
            </div>
          )}

          {/* PRICE FILTER */}
          {shouldShowPriceFilter && (
            <div className="px-4 py-4 border-b border-gray-200">
              <p className="text-xs font-semibold mb-2 text-gray-800">PRICE</p>
              <div className="w-[85%] mx-auto">
                <PriceSlider
                  value={tempPriceRange}
                  min={productPriceRange.min}
                  max={productPriceRange.max}
                  onChange={(e, v) => setTempPriceRange(v)}
                  onChangeCommitted={(e, v) => handlePriceChange(v)}
                  aria-label="Price range slider"
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
            validFilters.map(filter => (
              <FilterItem
                key={filter.name}
                filter={filter}
                expandedFilters={expandedFilters}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
                onToggleExpand={toggleFilterExpand}
              />
            ))
          ) : shouldShowFilters && !loadingFilters && filters?.length === 0 ? (
            <div className="px-4 py-4 text-sm text-gray-500 text-center">
              No filters available
            </div>
          ) : null}
        </div>

        {/* ---------------- PRODUCTS ---------------- */}
        <div className="flex-1 px-4">
          {/* Sort Bar */}
          <div className="hidden lg:flex bg-white border border-gray-300 px-4 py-2 mb-3 items-center text-sm">
            <div className="flex gap-3 flex-wrap">
              {SORTS.map(s => {
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
                    aria-pressed={isActive}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SHOW LOADING STATE WHEN SEARCH CHANGES */}
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
            <div className="text-center py-8 text-gray-500" role="status">
              You've reached the end
            </div>
          )}

          {/* NO PRODUCTS FOUND */}
          {hasFetchedOnce && !loading && products.length === 0 && (
            <div className="text-center py-12 text-gray-500" role="status">
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
          updateProducts(buildSearchParams(1, newFilters));
        }}
        onSortChange={handleSort}
        onTempPriceRangeChange={setTempPriceRange}
        onPriceChange={handlePriceChange}
        onClearPriceFilter={clearPriceFilter}
      />
    </div>
  );
});

SearchPage.displayName = 'SearchPage';

export default SearchPage;