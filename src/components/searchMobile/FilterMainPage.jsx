"use client";
import React, { useState, useEffect } from "react";
import { FaSortAmountDown, FaTimes } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useSearchParams, useRouter } from "next/navigation";

// Diwali color theme - lightweight and festive
const diwaliColors = {
  primary: "#ff6b35", // Diwali Orange
  secondary: "#ffd166", // Diwali Gold
  accent: "#ef476f", // Festive Pink/Red
  light: "#fff9e6", // Light Yellow Background
  dark: "#8b4513", // Brown for text
};

const FilterMainPage = ({ filters, loading }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(null);
  const [activeOption, setActiveOption] = useState(
    searchParams.get("sort") || "relevance"
  );
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 10000,
  ]);
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.getAll("brand[]") || []
  );
  const [selectedColors, setSelectedColors] = useState(
    searchParams.get("color") ? [searchParams.get("color")] : []
  );
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? [searchParams.get("category")] : []
  );
  const [selectedDiscounts, setSelectedDiscounts] = useState(
    searchParams.get("discount") ? [searchParams.get("discount")] : []
  );

  // Get available filters from props or use empty defaults
  const availableFilters = filters || {
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 10000 },
  };

  // Initialize filters from URL params
  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand[]") || []);
    setSelectedCategories(
      searchParams.get("category") ? [searchParams.get("category")] : []
    );
    setPriceRange([
      searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
      searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : 10000,
    ]);
    setActiveOption(searchParams.get("sort") || "relevance");
  }, [searchParams]);

  const closeModal = () => {
    setSelected(null);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("page"); // Reset to first page when filters change

    // Clear existing filter params
    params.delete("sort");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("brand[]");
    params.delete("color");
    params.delete("category");
    params.delete("discount");

    // Add new filter params
    if (selected === "Sort" && activeOption) {
      params.set("sort", activeOption);
    }

    if (priceRange[0] > 0 || priceRange[1] < 10000) {
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());
    }

    selectedBrands.forEach((brand) => {
      params.append("brand[]", brand);
    });

    if (selectedColors.length) params.set("color", selectedColors[0]);
    if (selectedCategories.length)
      params.set("category", selectedCategories[0]);
    if (selectedDiscounts.length) params.set("discount", selectedDiscounts[0]);

    router.push(`?${params.toString()}`);
    closeModal();
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? [] : [category]
    );
  };

  const handlePriceChange = (minValue, maxValue) => {
    setPriceRange([minValue, maxValue]);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedCategories([]);
    setSelectedDiscounts([]);
    setPriceRange([0, 10000]);
    setActiveOption("relevance");
    const params = new URLSearchParams();
    if (searchParams.get("q")) {
      params.set("q", searchParams.get("q"));
    }
    router.push(`?${params.toString()}`);
    closeModal();
  };

  const options = {
    Sort: [
      { value: "relevance", label: "Relevance" },
      { value: "price_asc", label: "Price: Low to High" },
      { value: "price_desc", label: "Price: High to Low" },
      { value: "newest", label: "Newest First" },
      { value: "popularity", label: "Popularity" },
    ],
  };

  const filtering = [
    { title: "Sort", Icon: <FaSortAmountDown size={14} /> },
    { title: "Filter", Icon: <BsFilter size={16} /> },
  ];

  // Count active filters
  const activeFilterCount =
    (selectedCategories.length > 0 ? 1 : 0) +
    (selectedColors.length > 0 ? 1 : 0) +
    (selectedDiscounts.length > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    selectedBrands.length +
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
      <div className="space-y-4">
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-gradient-to-r from-[#ff6b35] to-[#ffd166] rounded-full"
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
            className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            onChange={handleMaxChange}
            className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#ff6b35] font-semibold">
            ₹{value[0].toLocaleString()}
          </span>
          <span className="text-[#ff6b35] font-semibold">
            ₹{value[1].toLocaleString()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Bottom Bar - Always visible on mobile */}
      <div className="lg:hidden fixed bottom-0 z-[99] whitespace-nowrap left-0 right-0 w-full flex bg-white justify-between items-center border-t border-orange-100 shadow-lg">
        <div className="flex justify-between w-full items-center gap-6 py-4 h-full">
          {filtering.map((item) => (
            <div
              key={item.title}
              onClick={() => setSelected(item.title)}
              className="flex flex-row items-center text-xl border-r border-orange-100 justify-center w-full gap-2 h-full cursor-pointer transition-all duration-200 hover:text-[#ff6b35] active:scale-95"
            >
              {item.Icon}
              <span className="text-[14px] font-medium">{item.title}</span>
              {item.title === "Filter" && activeFilterCount > 0 && (
                <span className="bg-gradient-to-r from-[#ff6b35] to-[#ffd166] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
                  {activeFilterCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sort Modal */}
      {selected === "Sort" && (
        <div className="lg:hidden fixed inset-0 z-[9999] bg-black/40 flex items-end justify-center">
          <div className="w-full bg-gradient-to-b from-[#fff9e6] to-white rounded-t-xl p-4 max-h-[50vh] overflow-y-auto animate-slide-up shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#8b4513]">
                {selected} By
              </h2>
              <button
                onClick={closeModal}
                className="text-[#ff6b35] hover:scale-110 transition-transform"
              >
                <IoClose size={24} />
              </button>
            </div>

            <ul className="space-y-3">
              {options[selected]?.map((opt, idx) => (
                <li
                  key={idx}
                  onClick={() => setActiveOption(opt.value)}
                  className="text-sm flex flex-row justify-between items-center text-gray-800 hover:text-[#ff6b35] cursor-pointer py-2 px-2 rounded-lg transition-all duration-200 hover:bg-orange-50"
                >
                  {opt.label}
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      activeOption === opt.value
                        ? "bg-[#ff6b35] border-[#ff6b35]"
                        : "border-gray-400"
                    }`}
                  >
                    {activeOption === opt.value && (
                      <div className="h-2 w-2 bg-white rounded-full" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <button
                onClick={handleApplyFilters}
                className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ffd166] text-white py-3 px-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
              >
                Apply Sort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {selected === "Filter" && (
        <div className="lg:hidden fixed inset-0 z-[9999] bg-black/40 bottom-0 flex items-end justify-center overflow-hidden">
          <div className="w-full max-h-[70vh] bg-gradient-to-b from-[#fff9e6] to-white flex flex-col rounded-t-xl overflow-hidden shadow-2xl">
            <div className="w-full max-h-[70vh] overflow-y-auto flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-b-orange-200 bg-white/80 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-[#8b4513]">
                  Filters
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm bg-gradient-to-r from-[#ff6b35] to-[#ffd166] text-white px-3 py-1 rounded-full font-medium hover:shadow-md transition-all duration-200"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={closeModal}
                    className="text-[#ff6b35] hover:scale-110 transition-transform"
                  >
                    <IoClose size={24} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col h-full overflow-y-auto">
                {/* Price Section */}
                <div className="border-b border-b-orange-100 bg-white/50">
                  <div className="p-4 font-medium text-[#8b4513] flex items-center gap-2">
                    <span>🎯</span> Price Range
                  </div>
                  <div className="px-4 pb-4">
                    <CustomSlider
                      min={0}
                      max={10000}
                      value={priceRange}
                      onChange={handlePriceChange}
                    />
                  </div>
                </div>

                {/* Brand Section */}
                <div className="border-b border-b-orange-100 bg-white/50">
                  <div className="p-4 font-medium text-[#8b4513] flex items-center gap-2">
                    <span>🏷️</span> Brand
                  </div>
                  <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                    {availableFilters.brands?.slice(0, 6).map((brand, i) => (
                      <div
                        key={i}
                        onClick={() => handleBrandToggle(brand.name)}
                        className={`flex items-center justify-between py-2 px-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                          selectedBrands.includes(brand.name)
                            ? "border-[#ff6b35] bg-orange-50 shadow-sm"
                            : "border-gray-300 hover:border-orange-300"
                        }`}
                      >
                        <span
                          className={`text-sm ${
                            selectedBrands.includes(brand.name)
                              ? "text-[#ff6b35] font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {brand.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({brand.count})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Section */}
                <div className="border-b border-b-orange-100 bg-white/50">
                  <div className="p-4 font-medium text-[#8b4513] flex items-center gap-2">
                    <span>📦</span> Category
                  </div>
                  <div className="px-4 pb-4">
                    {availableFilters.categories?.map((cat, i) => (
                      <div
                        key={i}
                        onClick={() => handleCategoryToggle(cat.name)}
                        className={`flex items-center justify-between py-3 border-b border-b-orange-50 cursor-pointer transition-all duration-200 ${
                          selectedCategories.includes(cat.name)
                            ? "text-[#ff6b35] font-medium"
                            : "text-gray-700 hover:text-[#ff6b35]"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            ({cat.count})
                          </span>
                          <div
                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                              selectedCategories.includes(cat.name)
                                ? "bg-[#ff6b35] border-[#ff6b35]"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedCategories.includes(cat.name) && (
                              <div className="h-2 w-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-t-orange-200 bg-white/80 backdrop-blur-sm">
                <button
                  onClick={handleApplyFilters}
                  className="w-full bg-gradient-to-r from-[#ff6b35] to-[#ffd166] text-white py-3 px-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterMainPage;
