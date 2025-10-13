"use client";
import React, { useState, useEffect } from "react";
import { FaSortAmountDown, FaTimes } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { Button, Box, Typography, Slider } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

const PriceSlider = styled(Slider)(({ theme }) => ({
  color: "#e96f84",
  height: 6,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:hover, &.Mui-focusVisible": {
      boxShadow: "0 0 0 8px rgba(233, 111, 132, 0.16)",
    },
    "&.Mui-active": {
      boxShadow: "0 0 0 14px rgba(233, 111, 132, 0.16)",
    },
  },
  "& .MuiSlider-valueLabel": {
    backgroundColor: "#e96f84",
    color: "#fff",
  },
}));

const Filter = ({ filters, loading }) => {
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

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
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
    { title: "Sort", Icon: <FaSortAmountDown size={15} /> },
    { title: "Filter", Icon: <BsFilter size={15} /> },
  ];
  // Count active filters
  const activeFilterCount =
    (selectedCategories.length > 0 ? 1 : 0) +
    (selectedColors.length > 0 ? 1 : 0) +
    (selectedDiscounts.length > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    selectedBrands.length +
    (activeOption !== "relevance" ? 1 : 0);

  return (
    <>
      {/* Mobile Bottom Bar - Always visible on mobile */}
      <div className="lg:hidden fixed bottom-0 z-[99] whitespace-nowrap left-0 right-0 w-full p-4 flex justify-center items-center">
        <div className="flex justify-evenly items-center gap-6 px-5 py-4 h-full w-70 bg-white rounded-t-xl shadow-md">
          {filtering.map((item) => (
            <div
              key={item.title}
              onClick={() => setSelected(item.title)}
              className="flex flex-row items-center text-sm justify-center gap-1 h-full cursor-pointer hover:text-[#e96f84]"
            >
              {item.Icon}
              <span className="text-md font-medium">{item.title}</span>
              {item.title === "Filter" && activeFilterCount > 0 && (
                <span className="mt-1 bg-[#e96f84] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
          <div className="w-full bg-white rounded-t-xl p-4 max-h-[50vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{selected} By</h2>
              <button onClick={closeModal}>
                <IoClose size={24} />
              </button>
            </div>

            <ul className="space-y-3">
              {options[selected]?.map((opt, idx) => (
                <li
                  key={idx}
                  onClick={() => setActiveOption(opt.value)}
                  className="text-sm flex flex-row justify-between items-center text-gray-800 hover:text-[#e96f84] cursor-pointer py-2"
                >
                  {opt.label}
                  <div
                    className={`h-5 w-5 rounded-full border-2 ${
                      activeOption === opt.value
                        ? "bg-[#e96f84] border-[#e96f84]"
                        : "border-gray-400"
                    }`}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
                sx={{
                  bgcolor: "#e96f84",
                  "&:hover": {
                    bgcolor: "#d45f74",
                  },
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {selected === "Filter" && (
        <div className="lg:hidden fixed inset-0 z-[9999] bg-black/40 bottom-0 flex items-end justify-center overflow-hidden">
          <div className="w-full max-h-[60vh] bg-white flex flex-col rounded-t-xl overflow-hidden">
            <div className="w-full max-h-[60vh] overflow-y-auto bg-white flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-b-[#e6e6e6]">
                <h2 className="text-lg font-semibold">Filters</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-[#e96f84] hover:underline"
                  >
                    Clear all
                  </button>
                  <button onClick={closeModal}>
                    <IoClose size={24} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col h-full overflow-y-auto">
                {/* Price Section */}
                <div className="border-b border-b-[#e6e6e6]">
                  <div className="p-4 font-medium text-gray-800">Price</div>
                  <div className="px-4 pb-4">
                    <Box sx={{ px: 1, py: 2 }}>
                      <PriceSlider
                        value={priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `₹${value}`}
                        min={0}
                        max={10000}
                        step={100}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          ₹{priceRange[0].toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{priceRange[1].toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </div>
                </div>

                {/* Brand Section */}
                <div className="border-b border-b-[#e6e6e6]">
                  <div className="p-4 font-medium text-gray-800">Brand</div>
                  <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                    {availableFilters.brands?.slice(0, 6).map((brand, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between py-2 px-3 rounded-lg border ${
                          selectedBrands.includes(brand.name)
                            ? "border-[#e96f84] bg-pink-50"
                            : "border-gray-300"
                        }`}
                        onClick={() => handleBrandToggle(brand.name)}
                      >
                        <span
                          className={`text-sm ${
                            selectedBrands.includes(brand.name)
                              ? "text-[#e96f84] font-medium"
                              : ""
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
                <div className="border-b border-b-[#e6e6e6]">
                  <div className="p-4 font-medium text-gray-800">Category</div>
                  <div className="px-4 pb-4">
                    {availableFilters.categories?.map((cat, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between py-3 border-b border-b-gray-100 ${
                          selectedCategories.includes(cat.name)
                            ? "text-[#e96f84]"
                            : ""
                        }`}
                        onClick={() => handleCategoryToggle(cat.name)}
                      >
                        <span>{cat.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            ({cat.count})
                          </span>
                          <div
                            className={`h-5 w-5 rounded-full border-2 ${
                              selectedCategories.includes(cat.name)
                                ? "bg-[#e96f84] border-[#e96f84]"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-t-[#e6e6e6] bg-white">
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleApplyFilters}
                  sx={{
                    bgcolor: "#e96f84",
                    "&:hover": {
                      bgcolor: "#d45f74",
                    },
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Filter;
