"use client";
import React, { useState } from "react";
import { FaSortAmountDown } from "react-icons/fa";
import { BsFilter } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";

const Filter = ({ filters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(null);
  const [activeOption, setActiveOption] = useState(
    searchParams.get("sort") || ""
  );
  const [selectFilter, setSelectFilter] = useState("");
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("minPrice") || "",
    max: searchParams.get("maxPrice") || "",
  });
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.getAll("brand[]") || []
  );
  const [selectedColors, setSelectedColors] = useState(
    searchParams.get("color") ? [searchParams.get("color")] : []
  );
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? [searchParams.get("category")] : []
  );

  const closeModal = () => {
    setSelected(null);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams);

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

    if (priceRange.min) params.set("minPrice", priceRange.min);
    if (priceRange.max) params.set("maxPrice", priceRange.max);

    selectedBrands.forEach((brand) => {
      params.append("brand[]", brand);
    });

    if (selectedColors.length) params.set("color", selectedColors[0]);
    if (selectedCategories.length)
      params.set("category", selectedCategories[0]);

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

  return (
    <>
      {/* Bottom Bar */}
      <div className="fixed z-10 bottom-0 mb-2 w-full flex justify-center items-center ">
        <div className="flex justify-around items-center w-1/2 py-3 bg-white rounded-t-xl shadow-md">
          {filtering.map((item) => (
            <div
              key={item.title}
              onClick={() => setSelected(item.title)}
              className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
            >
              {item.Icon}
              <span className="text-sm font-medium">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {selected === "Sort" && (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-end justify-center">
          <div className="w-full sm:w-[90%] bg-white rounded-t-xl p-4 max-h-[70%] overflow-y-auto animate-slide-up">
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
                  className="text-sm flex flex-row justify-between items-center text-gray-800 hover:text-blue-600 cursor-pointer"
                >
                  {opt.label}
                  <div
                    className={`h-4 w-4 rounded-full border border-gray-400 ${
                      activeOption === opt.value ? "bg-red-400" : ""
                    }`}
                  />
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Button
                fullWidth
                variant="contained"
                onClick={handleApplyFilters}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {selected === "Filter" && (
        <div className="fixed w-full inset-0 z-[999] bg-black/40 ">
          <div className="w-full bg-white p-4 h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4 fixed w-[90%] z-[999]">
              <h2 className="text-lg font-semibold">{selected} Options</h2>
              <button onClick={closeModal}>
                <IoClose size={24} />
              </button>
            </div>
            <div className="w-full flex flex-row mt-12 flex-nowrap">
              <div className="flex flex-col w-1/2 px-3 bg-blue-100/10 space-y-6 py-4 overflow-y-auto text-[1rem] font-normal">
                {["Category", "Price", "Brand", "Availability"].map(
                  (item, i) => (
                    <div
                      key={i}
                      className={`${selectFilter === item && "text-blue-400"}`}
                      onClick={() => setSelectFilter(item)}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
              <div className="w-full">
                {selectFilter === "Category" ? (
                  <div className="flex flex-col">
                    {filters?.available?.categories?.map((cat, i) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            checked={selectedCategories.includes(cat.name)}
                            onChange={() => handleCategoryToggle(cat.name)}
                          />
                        }
                        label={`${cat.name} (${cat.count})`}
                      />
                    ))}
                  </div>
                ) : selectFilter === "Price" ? (
                  <div className="flex flex-col p-4">
                    <div className="flex gap-4 mb-4">
                      <TextField
                        label="Min Price"
                        type="number"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, min: e.target.value })
                        }
                        size="small"
                        fullWidth
                      />
                      <TextField
                        label="Max Price"
                        type="number"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange({ ...priceRange, max: e.target.value })
                        }
                        size="small"
                        fullWidth
                      />
                    </div>
                  </div>
                ) : selectFilter === "Brand" ? (
                  <div className="flex flex-col">
                    <TextField
                      placeholder="Search Brand"
                      size="small"
                      sx={{ marginBottom: 2 }}
                    />
                    <span className="text-sm mb-2">Popular Filters</span>
                    {filters?.available?.brands?.map((brand, i) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            checked={selectedBrands.includes(brand.name)}
                            onChange={() => handleBrandToggle(brand.name)}
                          />
                        }
                        label={`${brand.name} (${brand.count})`}
                      />
                    ))}
                  </div>
                ) : selectFilter === "Availability" ? (
                  <div className="flex flex-col">
                    <FormControlLabel
                      control={<Checkbox name="in_stock" />}
                      label="In Stock Only"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Select a filter category
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="fixed bottom-0 flex w-full px-5 py-2 z-[999] bg-white shadow-md">
            <div className="justify-center flex flex-between w-full">
              <div className="flex flex-col w-full items-center space-y-0.5">
                <span className="flex w-full">
                  {filters?.pagination?.total || 0}
                </span>
                <span className="flex w-full">Products Found</span>
              </div>
              <div className="flex w-full">
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  onClick={handleApplyFilters}
                >
                  Apply
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
