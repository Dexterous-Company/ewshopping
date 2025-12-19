"use client";

import {
  searchNewProducts,
  loadMoreProducts,
} from "@/redux/serach/newSerchProdactSlice";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import NewSingleProductCard from "@/main_pages/ProductPages.jsx/NewSingleProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import NewFilter from "@/components/searchMobile/NewFilter";

/* ---------------- PRICE SLIDER (COMPACT + FLIPKART STYLE) ---------------- */
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
  const searchQuery = p.keyword || "";
  const categoryTag = p.categoryTag || "";

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "relevance";

  const {
    products,
    total,
    filters,
    loadingMore,
    page: currentPage,
    limit,
  } = useSelector((state) => state.searchNew);

  const initialSearchDone = useRef(false);
  const searchTimeoutRef = useRef(null);

  const [selectedFilters, setSelectedFilters] = useState({
    colors: [],
    models: [],
    rating: [],
    priceRange: null,
  });

  const [expandedFilters, setExpandedFilters] = useState({});
  const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);

  const processFilterValues = (value) =>
    value ? [...new Set(value.split(", "))] : [];

  const toggleFilterExpand = (name) =>
    setExpandedFilters((p) => ({ ...p, [name]: !p[name] }));

  const buildSearchParams = (page = 1, overrideFilters = null) => ({
    q: searchQuery,
    categoryTag,
    page,
    limit: limit || 20,
    sort: sort !== "relevance" ? sort : "",
    filters: overrideFilters || selectedFilters,
  });

  const debouncedSearch = useCallback(
    (params) => {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        dispatch(searchNewProducts(params));
      }, 300);
    },
    [dispatch]
  );

  /* ---------- INITIAL SEARCH ---------- */
  useEffect(() => {
    if (initialSearchDone.current) return;
    dispatch(searchNewProducts(buildSearchParams(1)));
    initialSearchDone.current = true;
  }, [searchQuery, categoryTag]);

  /* ---------- FILTER / SORT CHANGE ---------- */
  useEffect(() => {
    if (!initialSearchDone.current) return;
    debouncedSearch(buildSearchParams(1));
  }, [selectedFilters, sort]);

  const handleSort = (value) => {
    const p = new URLSearchParams(searchParams.toString());
    value === "relevance" ? p.delete("sort") : p.set("sort", value);
    router.push(`?${p.toString()}`);
  };

  useInfiniteScroll(() => {
    if (!loadingMore && products.length < total) {
      dispatch(loadMoreProducts(buildSearchParams(currentPage + 1)));
    }
  }, 300);

  const handleFilterChange = (name, value) => {
    setSelectedFilters((p) => {
      const curr = p[name] || [];
      return {
        ...p,
        [name]: curr.includes(value)
          ? curr.filter((v) => v !== value)
          : [...curr, value],
      };
    });
  };

  const removeSelected = (name, value) => {
    setSelectedFilters((p) => ({
      ...p,
      [name]: p[name]?.filter((v) => v !== value),
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      colors: [],
      models: [],
      rating: [],
      priceRange: null,
    });
    setTempPriceRange([0, 1000]);
  };

  /* ---------- FIXED hasSelectedFilters ---------- */
  const hasSelectedFilters =
    Object.values(selectedFilters).some(
      (v) => Array.isArray(v) && v.length
    ) ||
    (selectedFilters.priceRange &&
      (selectedFilters.priceRange.min !== 0 ||
        selectedFilters.priceRange.max !== 1000));

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
        </div>
      </div>

      {/* MOBILE FILTER UNCHANGED */}
      <NewFilter
        filters={filters}
        selectedFilters={selectedFilters}
        sort={sort}
        onFilterChange={setSelectedFilters}
        onSortChange={handleSort}
      />
    </div>
  );
};

export default SearchPage;
