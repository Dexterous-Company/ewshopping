"use client";
import React, { useState, useEffect } from "react";
import { FaSortAmountDown, FaTimes } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useSearchParams, useRouter } from "next/navigation";

const NewFilter = ({ 
  filters, 
  loading, 
  selectedFilters, 
  onFilterChange, 
  sort, 
  onSortChange, 
  priceRange, 
  onPriceRangeChange,
  onClearAllFilters 
}) => {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [activeOption, setActiveOption] = useState(sort || "relevance");
  const [tempPriceRange, setTempPriceRange] = useState(priceRange || [0, 50000]);
  const [tempSelectedFilters, setTempSelectedFilters] = useState(selectedFilters || {});

  // Initialize from props
  useEffect(() => {
    setActiveOption(sort || "relevance");
    setTempPriceRange(priceRange || [0, 50000]);
    setTempSelectedFilters(selectedFilters || {});
  }, [sort, priceRange, selectedFilters]);

  const closeModal = () => {
    setSelected(null);
  };

  const handleApplySort = () => {
    onSortChange(activeOption);
    closeModal();
  };

  const handleApplyFilters = () => {
    const updatedFilters = {
      ...tempSelectedFilters,
      priceRange: {
        min: tempPriceRange[0],
        max: tempPriceRange[1],
        label: `₹${tempPriceRange[0].toLocaleString()} - ₹${tempPriceRange[1].toLocaleString()}`,
      },
    };
    
    onFilterChange(updatedFilters);
    onPriceRangeChange(tempPriceRange);
    closeModal();
  };

  const handleBrandToggle = (brand) => {
    setTempSelectedFilters(prev => ({
      ...prev,
      Brand: prev.Brand?.includes(brand) 
        ? prev.Brand.filter(b => b !== brand)
        : [...(prev.Brand || []), brand]
    }));
  };

  const handleColorToggle = (color) => {
    setTempSelectedFilters(prev => ({
      ...prev,
      Color: prev.Color?.includes(color) 
        ? prev.Color.filter(c => c !== color)
        : [...(prev.Color || []), color]
    }));
  };

  const handleModelToggle = (model) => {
    setTempSelectedFilters(prev => ({
      ...prev,
      Model: prev.Model?.includes(model) 
        ? prev.Model.filter(m => m !== model)
        : [...(prev.Model || []), model]
    }));
  };

  const handlePriceChange = (minValue, maxValue) => {
    setTempPriceRange([minValue, maxValue]);
  };

  const clearAllFilters = () => {
    setTempSelectedFilters({});
    setTempPriceRange([0, 50000]);
    setActiveOption("relevance");
    if (onClearAllFilters) {
      onClearAllFilters();
    }
    closeModal();
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

  // Process filter values for display
  const processFilterValues = (value) => {
    if (!value) return [];
    return [...new Set(value.split(", "))].filter((item) => item.trim());
  };

  // Get available colors, models, etc. from filters
  const colorFilter = filters?.find(filter => filter.name === "Color" || filter.name === "Option 1");
  const modelFilter = filters?.find(filter => filter.name === "Model");
  const brandFilter = filters?.find(filter => filter.name === "Brand");

  const availableColors = colorFilter ? processFilterValues(colorFilter.value) : [];
  const availableModels = modelFilter ? processFilterValues(modelFilter.value) : [];
  const availableBrands = brandFilter ? processFilterValues(brandFilter.value) : [];

  // Count active filters for badge
  const activeFilterCount = 
    (tempSelectedFilters.Color?.length || 0) +
    (tempSelectedFilters.Model?.length || 0) +
    (tempSelectedFilters.Brand?.length || 0) +
    (tempPriceRange[0] > 0 || tempPriceRange[1] < 50000 ? 1 : 0) +
    (activeOption !== "relevance" ? 1 : 0);

  // Custom Slider Component
  const CustomSlider = ({ min, max, value, onChange }) => {
    const handleMinChange = (e) => {
      const newMin = Math.min(Number(e.target.value), value[1] - 100);
      onChange(newMin, value[1]);
    };

    const handleMaxChange = (e) => {
      const newMax = Math.max(Number(e.target.value), value[0] + 100);
      onChange(value[0], newMax);
    };

    const progressLeft = (value[0] / max) * 100;
    const progressRight = 100 - (value[1] / max) * 100;

    return (
      <div className="space-y-6">
        <div className="relative h-1.5 bg-gray-100 rounded-full">
          <div
            className="absolute h-1.5 bg-gray-700 rounded-full"
            style={{
              left: `${progressLeft}%`,
              right: `${progressRight}%`,
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            onChange={handleMinChange}
            className="absolute w-full h-1.5 opacity-0 cursor-pointer z-10"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            onChange={handleMaxChange}
            className="absolute w-full h-1.5 opacity-0 cursor-pointer z-10"
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 font-medium">
            ₹{value[0].toLocaleString()}
          </span>
          <span className="text-gray-700 font-medium">
            ₹{value[1].toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 z-[99] left-0 right-0 w-full flex bg-white border-t border-gray-200 shadow-sm">
        <div className="flex justify-between w-full items-center">
          {filtering.map((item) => (
            <button
              key={item.title}
              onClick={() => setSelected(item.title)}
              className="flex flex-1 flex-col items-center py-3 gap-1 cursor-pointer transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="text-gray-600">
                {item.Icon}
              </div>
              <span className="text-xs font-medium text-gray-700">{item.title}</span>
              {item.title === "Filter" && activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
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
                    <span className={`text-sm ${
                      activeOption === opt.value ? "text-gray-900 font-medium" : "text-gray-600"
                    }`}>
                      {opt.label}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      activeOption === opt.value
                        ? "bg-gray-900 border-gray-900"
                        : "border-gray-300"
                    }`}>
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
                    className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded-md font-medium transition-colors"
                  >
                    Clear all
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

            <div className="flex-1 overflow-y-auto">
              {/* Price Section */}
              <div className="border-b border-gray-100">
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <span>💰</span> Price Range
                  </h3>
                  <CustomSlider
                    min={0}
                    max={50000}
                    value={tempPriceRange}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>

              {/* Brand Section */}
              {availableBrands.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <span>🏷️</span> Brand
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {availableBrands.slice(0, 6).map((brand, i) => (
                        <button
                          key={i}
                          onClick={() => handleBrandToggle(brand)}
                          className={`py-2 px-3 rounded-md border text-sm transition-all duration-200 ${
                            tempSelectedFilters.Brand?.includes(brand)
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Color Section */}
              {availableColors.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <span>🎨</span> Color
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {availableColors.slice(0, 6).map((color, i) => (
                        <button
                          key={i}
                          onClick={() => handleColorToggle(color)}
                          className={`py-2 px-3 rounded-md border text-sm transition-all duration-200 ${
                            tempSelectedFilters.Color?.includes(color)
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Model Section */}
              {availableModels.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <span>📱</span> Model
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {availableModels.slice(0, 6).map((model, i) => (
                        <button
                          key={i}
                          onClick={() => handleModelToggle(model)}
                          className={`py-2 px-3 rounded-md border text-sm transition-all duration-200 ${
                            tempSelectedFilters.Model?.includes(model)
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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