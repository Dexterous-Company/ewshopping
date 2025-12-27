"use client";
import React, { useState, useEffect } from "react";
import { FaSortAmountDown, FaTimes } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

/* ---------------- PRICE SLIDER FOR MOBILE ---------------- */
const MobilePriceSlider = styled(Slider)({
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

const NewFilter = ({
  filters,
  loadingFilters,
  selectedFilters,
  sort,
  productPriceRange,
  tempPriceRange,
  onFilterChange,
  onSortChange,
  onTempPriceRangeChange,
}) => {
  const [selected, setSelected] = useState(null);
  const [activeOption, setActiveOption] = useState(sort || "relevance");
  const [mobileTempPriceRange, setMobileTempPriceRange] = useState(
    tempPriceRange || [productPriceRange?.min || 0, productPriceRange?.max || 1000]
  );
  const [mobileSelectedFilters, setMobileSelectedFilters] = useState(
    selectedFilters || {}
  );
  const [expandedFilters, setExpandedFilters] = useState({});

  // Initialize from props
  useEffect(() => {
    setActiveOption(sort || "relevance");
    setMobileTempPriceRange(
      tempPriceRange || [productPriceRange?.min || 0, productPriceRange?.max || 1000]
    );
    setMobileSelectedFilters(selectedFilters || {});
  }, [sort, tempPriceRange, productPriceRange, selectedFilters]);

  const closeModal = () => {
    setSelected(null);
  };

  const toggleFilterExpand = (name) =>
    setExpandedFilters((p) => ({ ...p, [name]: !p[name] }));

  const handleApplySort = () => {
    onSortChange(activeOption);
    closeModal();
  };

  const handleApplyFilters = () => {
    const priceRangeMin = productPriceRange?.min || 0;
    const priceRangeMax = productPriceRange?.max || 1000;
    
    // Apply price range if it's different from default
    const priceRangeFilter = 
      mobileTempPriceRange[0] !== priceRangeMin || 
      mobileTempPriceRange[1] !== priceRangeMax
        ? { min: mobileTempPriceRange[0], max: mobileTempPriceRange[1] }
        : null;

    const updatedFilters = {
      ...mobileSelectedFilters,
      priceRange: priceRangeFilter,
    };

    onFilterChange(updatedFilters);
    closeModal();
  };

  const handleFilterChange = (name, value) => {
    setMobileSelectedFilters((prev) => {
      const curr = prev[name] || [];
      return {
        ...prev,
        [name]: curr.includes(value)
          ? curr.filter((v) => v !== value)
          : [...curr, value],
      };
    });
  };

  const removeSelected = (name, value) => {
    setMobileSelectedFilters((prev) => ({
      ...prev,
      [name]: prev[name]?.filter((v) => v !== value),
    }));
  };

  const clearAllFilters = () => {
    const priceRangeMin = productPriceRange?.min || 0;
    const priceRangeMax = productPriceRange?.max || 1000;
    
    const clearedFilters = { priceRange: null };
    
    // Initialize all filter categories to empty arrays
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.values && filter.values.length > 0) {
          clearedFilters[filter.name] = [];
        }
      });
    }
    
    setMobileSelectedFilters(clearedFilters);
    setMobileTempPriceRange([priceRangeMin, priceRangeMax]);
  };

  const handlePriceChange = (e, newValue) => {
    setMobileTempPriceRange(newValue);
  };

  const handlePriceChangeCommitted = (e, newValue) => {
    setMobileTempPriceRange(newValue);
  };

  const options = {
    Sort: [
      { value: "relevance", label: "Relevance" },
      { value: "price_asc", label: "Price: Low to High" },
      { value: "price_desc", label: "Price: High to Low" },
      { value: "newest", label: "Newest First" },
    ],
  };

  const filtering = [
    { title: "Sort", Icon: <FaSortAmountDown size={16} /> },
    { title: "Filter", Icon: <BsFilter size={16} /> },
  ];

  // Filter out empty filter values
  const validFilters = (filters || []).filter(
    (filter) => filter.values && filter.values.length > 0
  );

  // Count active filters for badge
  const getActiveFilterCount = () => {
    const priceRangeMin = productPriceRange?.min || 0;
    const priceRangeMax = productPriceRange?.max || 1000;
    
    let count = 0;
    
    // Count price filter
    if (mobileSelectedFilters.priceRange || 
        (mobileTempPriceRange[0] !== priceRangeMin || 
         mobileTempPriceRange[1] !== priceRangeMax)) {
      count++;
    }
    
    // Count other filters
    Object.entries(mobileSelectedFilters).forEach(([key, value]) => {
      if (key !== "priceRange" && Array.isArray(value) && value.length > 0) {
        count += value.length;
      }
    });
    
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const priceRangeMin = productPriceRange?.min || 0;
  const priceRangeMax = productPriceRange?.max || 1000;

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 z-[99] left-0 right-0 w-full flex bg-white border-t border-gray-200 shadow-sm">
        <div className="flex justify-between w-full items-center">
          {filtering.map((item) => (
            <button
              key={item.title}
              onClick={() => setSelected(item.title)}
              className="flex flex-1 flex-col items-center py-3 gap-1 cursor-pointer transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100 relative"
            >
              <div className="text-gray-600">{item.Icon}</div>
              <span className="text-xs font-medium text-gray-700">
                {item.title}
              </span>
              {item.title === "Filter" && activeFilterCount > 0 && (
                <span className="absolute top-1 right-6 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Modal */}
      {selected === "Sort" && (
        <div className="lg:hidden fixed inset-0 z-[9999] bg-black/50 flex items-end justify-center">
          <div className="w-full bg-white rounded-t-xl max-h-[60vh] overflow-hidden shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Sort By</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <IoClose size={24} />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto">
              <ul className="space-y-2">
                {options[selected]?.map((opt, idx) => (
                  <li
                    key={idx}
                    onClick={() => setActiveOption(opt.value)}
                    className="flex items-center justify-between py-3 px-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <span
                      className={`text-sm ${
                        activeOption === opt.value
                          ? "text-gray-900 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        activeOption === opt.value
                          ? "bg-gray-900 border-gray-900"
                          : "border-gray-300"
                      }`}
                    >
                      {activeOption === opt.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={handleApplySort}
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors active:scale-95"
              >
                Apply Sort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {selected === "Filter" && (
        <div className="lg:hidden fixed inset-0 z-[9999] bg-black/50 flex items-end justify-center">
          <div className="w-full bg-white rounded-t-xl max-h-[80vh] overflow-hidden flex flex-col shadow-xl">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md font-medium transition-colors"
                  >
                    CLEAR ALL
                  </button>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <IoClose size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Filters Display */}
            {(() => {
              const hasSelectedFilters = Object.entries(mobileSelectedFilters).some(
                ([key, value]) => {
                  if (key === "priceRange") {
                    return value && (value.min !== priceRangeMin || value.max !== priceRangeMax);
                  }
                  return Array.isArray(value) && value.length > 0;
                }
              );

              return hasSelectedFilters ? (
                <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-gray-300 bg-gray-100">
                  {Object.entries(mobileSelectedFilters).map(([key, values]) => {
                    if (key === "priceRange") {
                      if (values && (values.min !== priceRangeMin || values.max !== priceRangeMax)) {
                        return (
                          <div
                            key={`price-${values.min}-${values.max}`}
                            className="flex items-center gap-1 bg-gray-200 text-gray-700 text-[11px] px-2 py-[3px] rounded"
                          >
                            <FaTimes
                              size={8}
                              className="cursor-pointer"
                              onClick={() => {
                                setMobileSelectedFilters((p) => ({
                                  ...p,
                                  priceRange: null,
                                }));
                                setMobileTempPriceRange([priceRangeMin, priceRangeMax]);
                              }}
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
                          <FaTimes
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
              ) : null;
            })()}

            <div className="flex-1 overflow-y-auto">
              {/* Price Section */}
              <div className="border-b border-gray-100">
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-4">PRICE</h3>
                  <div className="w-[90%] mx-auto">
                    <MobilePriceSlider
                      value={mobileTempPriceRange}
                      min={priceRangeMin}
                      max={priceRangeMax}
                      onChange={handlePriceChange}
                      onChangeCommitted={handlePriceChangeCommitted}
                    />
                    <div className="flex justify-between text-xs text-gray-600 mt-2">
                      <span>₹{priceRangeMin}</span>
                      <span>₹{priceRangeMax}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loadingFilters && validFilters.length === 0 && (
                <div className="px-4 py-4 border-b border-gray-200">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              )}

              {/* Dynamic Filters */}
              {validFilters.length > 0 ? (
                validFilters.map((filter) => {
                  const values = filter.values || [];
                  if (!values || values.length === 0) return null;

                  const expanded = expandedFilters[filter.name];
                  const visible = expanded ? values : values.slice(0, 4);
                  const currentSelections = mobileSelectedFilters[filter.name] || [];

                  return (
                    <div
                      key={filter.name}
                      className="border-b border-gray-100"
                    >
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-2">
                          {(filter.name === "ProductType"
                            ? "PRODUCT TYPE"
                            : filter.name
                          ).toUpperCase()}
                        </h3>

                        {visible.map((v) => (
                          <label
                            key={v}
                            className="flex gap-2 text-sm mb-2 text-gray-600 cursor-pointer items-center"
                          >
                            <input
                              type="checkbox"
                              checked={currentSelections.includes(v)}
                              onChange={() => handleFilterChange(filter.name, v)}
                              className="cursor-pointer h-4 w-4"
                            />
                            <span className="truncate">{v}</span>
                          </label>
                        ))}

                        {values.length > 4 && (
                          <button
                            className="text-sm text-blue-600 mt-1 hover:text-blue-800 font-medium"
                            onClick={() => toggleFilterExpand(filter.name)}
                          >
                            {expanded
                              ? "Show Less"
                              : `View ${values.length - 4} More`}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : !loadingFilters && filters?.length === 0 ? (
                <div className="px-4 py-4 text-sm text-gray-500 text-center">
                  No filters available
                </div>
              ) : null}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <button
                onClick={handleApplyFilters}
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors active:scale-95"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewFilter;