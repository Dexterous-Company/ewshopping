"use client";
import React, { useState, useEffect } from "react";
import { FaSortAmountDown, FaTimes } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { Button, Checkbox, FormControlLabel, TextField, Box, Typography, Slider } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";

const PriceSlider = styled(Slider)(({ theme }) => ({
  color: '#e96f84',
  height: 6,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(233, 111, 132, 0.16)',
    },
    '&.Mui-active': {
      boxShadow: '0 0 0 14px rgba(233, 111, 132, 0.16)',
    },
  },
  '& .MuiSlider-valueLabel': {
    backgroundColor: '#e96f84',
    color: '#fff',
  },
}));

const Filter = () => {
  const { filters, pagination, availableFilters } = useSelector(
    (state) => state.search
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(null);
  const [activeOption, setActiveOption] = useState(
    searchParams.get("sort") || "relevance"
  );
  const [selectFilter, setSelectFilter] = useState("Category");
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 10000,
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

  // Initialize filters from URL params
  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand[]") || []);
    setSelectedColors(
      searchParams.get("color") ? [searchParams.get("color")] : []
    );
    setSelectedCategories(
      searchParams.get("category") ? [searchParams.get("category")] : []
    );
    setPriceRange([
      searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0,
      searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 10000
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
    if (selectedCategories.length) params.set("category", selectedCategories[0]);

    router.push(`?${params.toString()}`);
    closeModal();
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) => (prev.includes(color) ? [] : [color]));
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
    setPriceRange([0, 10000]);
    setActiveOption("relevance");
    const params = new URLSearchParams();
    if (searchParams.get("q")) {
      params.set("q", searchParams.get("q"));
    }
    router.push(`?${params.toString()}`);
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

  const colorOptions = [
    { name: "Black", value: "black", hex: "#000000" },
    { name: "White", value: "white", hex: "#ffffff", border: true },
    { name: "Red", value: "red", hex: "#ef4444" },
    { name: "Blue", value: "blue", hex: "#3b82f6" },
    { name: "Green", value: "green", hex: "#10b981" },
    { name: "Yellow", value: "yellow", hex: "#fbbf24" },
    { name: "Pink", value: "pink", hex: "#ec4899" },
    { name: "Purple", value: "purple", hex: "#8b5cf6" },
    { name: "Gray", value: "gray", hex: "#6b7280" },
    { name: "Brown", value: "brown", hex: "#78350f" },
    { name: "Orange", value: "orange", hex: "#f97316" },
    { name: "Gold", value: "gold", hex: "#f59e0b" },
  ];

  // Count active filters
  const activeFilterCount =
    (selectedCategories.length > 0 ? 1 : 0) +
    (selectedColors.length > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) +
    selectedBrands.length +
    (activeOption !== "relevance" ? 1 : 0);

  return (
    <>
      {/* Bottom Bar */}
      <div className="sm:hidden fixed z-10 bottom-0 left-0 right-0 mb-2 w-full flex justify-center items-center">
        <div className="flex justify-around items-center w-4/5 py-3 bg-white rounded-t-xl shadow-md">
          {filtering.map((item) => (
            <div
              key={item.title}
              onClick={() => setSelected(item.title)}
              className="flex items-center gap-1 cursor-pointer hover:text-[#e96f84]"
            >
              {item.Icon}
              <span className="text-sm font-medium">{item.title}</span>
              {item.title === "Filter" && activeFilterCount > 0 && (
                <span className="ml-1 bg-[#e96f84] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {selected === "Sort" && (
        <div className="sm:hidden fixed inset-0 z-[999] bg-black/40 flex items-end justify-center">
          <div className="w-full bg-white rounded-t-xl p-4 max-h-[70%] overflow-y-auto animate-slide-up">
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
                    className={`h-5 w-5 rounded-full border-2 ${activeOption === opt.value ? "bg-[#e96f84] border-[#e96f84]" : "border-gray-400"}`}
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
                  bgcolor: '#e96f84',
                  '&:hover': {
                    bgcolor: '#d45f74',
                  },
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {selected === "Filter" && (
        <div className="sm:hidden fixed inset-0 z-[999] bg-black/40">
          <div className="w-full h-[100%] bg-white overflow-hidden flex flex-col">
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

            <div className="flex flex-row h-full overflow-hidden">
              <div className="flex flex-col w-2/5 border-r border-r-[#e6e6e6]">
                {["Category", "Price", "Brand", "Color"].map(
                  (item, i) => (
                    <div
                      key={i}
                      className={`p-4 text-sm ${selectFilter === item ? "bg-white text-[#e96f84] font-medium border-l-2 border-[#e96f84]" : "text-gray-700"}`}
                      onClick={() => setSelectFilter(item)}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>

              <div className="w-full p-4 overflow-y-auto">
                {selectFilter === "Category" ? (
                  <div className="flex flex-col space-y-3">
                    {availableFilters.categories?.map((cat, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between py-2 ${selectedCategories.includes(cat.name) ? "text-[#e96f84]" : ""}`}
                        onClick={() => handleCategoryToggle(cat.name)}
                      >
                        <span>{cat.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">({cat.count})</span>
                          <div className={`h-5 w-5 rounded-full border-2 ${selectedCategories.includes(cat.name) ? "bg-[#e96f84] border-[#e96f84]" : "border-gray-300"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectFilter === "Price" ? (
                  <div className="flex flex-col p-2">
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
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                        mb: 2
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          ₹{priceRange[0].toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{priceRange[1].toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </div>
                ) : selectFilter === "Brand" ? (
                  <div className="flex flex-col space-y-3">
                    {availableFilters.brands?.map((brand, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between py-2 ${selectedBrands.includes(brand.name) ? "text-[#e96f84]" : ""}`}
                        onClick={() => handleBrandToggle(brand.name)}
                      >
                        <span>{brand.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">({brand.count})</span>
                          <div className={`h-5 w-5 rounded-full border-2 ${selectedBrands.includes(brand.name) ? "bg-[#e96f84] border-[#e96f84]" : "border-gray-300"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectFilter === "Color" ? (
                  <div className="grid grid-cols-3 gap-3">
                    {colorOptions.map((color, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-center p-2 rounded-lg ${selectedColors.includes(color.value) ? "bg-gray-100" : ""}`}
                        onClick={() => handleColorToggle(color.value)}
                      >
                        <div
                          className={`h-8 w-8 rounded-full mb-1 ${color.border ? "border border-gray-300" : ""}`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs">{color.name}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="p-4 border-t border-t-[#e6e6e6]">
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
                sx={{
                  bgcolor: '#0099ff',
                  '&:hover': {
                    bgcolor: '#007acc',
                  },
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Filter;