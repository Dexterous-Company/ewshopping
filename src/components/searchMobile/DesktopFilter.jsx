"use client";
import React, { useState, useEffect } from "react";
import { FaAngleDown, FaChevronUp, FaTimes } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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

const DesktopFilter = () => {
  const { filters, pagination, availableFilters } = useSelector(
    (state) => state.search
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenBrands, setIsOpenBrands] = useState(true);
  const [isOpenColor, setIsOpenColor] = useState(true);
  const [isOpenPrice, setIsOpenPrice] = useState(true);
  const [isOpenCategory, setIsOpenCategory] = useState(true);
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  
  // Get actual price range from available filters or use defaults
  const minPriceFromFilters = availableFilters?.priceRange?.min || 0;
  const maxPriceFromFilters = availableFilters?.priceRange?.max || 10000;
  
  const [priceRange, setPriceRange] = useState(() => [
    Number(searchParams.get('minPrice')) || minPriceFromFilters,
    Number(searchParams.get('maxPrice')) || maxPriceFromFilters,
  ]);

  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.getAll("brand[]") || []
  );
  const [selectedColors, setSelectedColors] = useState(
    searchParams.get("color") ? [searchParams.get("color")] : []
  );

  // Initialize filters from URL params and available filters
  useEffect(() => {
    setSelectedBrands(searchParams.getAll("brand[]") || []);
    setSelectedColors(
      searchParams.get("color") ? [searchParams.get("color")] : []
    );
    
    // Set price range from URL params or use available filter range
    const urlMinPrice = searchParams.get('minPrice');
    const urlMaxPrice = searchParams.get('maxPrice');
    
    setPriceRange([
      urlMinPrice ? Number(urlMinPrice) : minPriceFromFilters,
      urlMaxPrice ? Number(urlMaxPrice) : maxPriceFromFilters
    ]);
  }, [searchParams, minPriceFromFilters, maxPriceFromFilters]);

  // Active filters for display
  const activeFilters = [
    ...(searchParams.get("category")
      ? [{ id: "category", value: searchParams.get("category") }]
      : []),
    ...(searchParams.get("color")
      ? [{ id: "color", value: searchParams.get("color") }]
      : []),
    ...(searchParams.get("minPrice") || searchParams.get("maxPrice")
      ? [
          {
            id: "price",
            value: `₹${searchParams.get("minPrice") || minPriceFromFilters}-₹${
              searchParams.get("maxPrice") || maxPriceFromFilters
            }`,
          },
        ]
      : []),
    ...selectedBrands.map((brand) => ({ id: `brand-${brand}`, value: brand })),
  ];

  // Filter handlers
  const handleBrandToggle = (brand) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(newBrands);
    updateUrlParams({ brands: newBrands });
  };

  const handleColorToggle = (color) => {
    const newColors = selectedColors.includes(color) ? [] : [color];
    setSelectedColors(newColors);
    updateUrlParams({ color: newColors[0] || null });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceApply = () => {
    updateUrlParams({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    });
  };

  const handlePriceReset = () => {
    setPriceRange([minPriceFromFilters, maxPriceFromFilters]);
    updateUrlParams({
      minPrice: null,
      maxPrice: null,
    });
  };

  const updateUrlParams = (updates) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page"); // Reset to first page when filters change

    if ("brands" in updates) {
      params.delete("brand[]");
      updates.brands.forEach((brand) => params.append("brand[]", brand));
    }

    if ("color" in updates) {
      if (updates.color) {
        params.set("color", updates.color);
      } else {
        params.delete("color");
      }
    }

    if ("minPrice" in updates) {
      if (updates.minPrice) {
        params.set("minPrice", updates.minPrice);
      } else {
        params.delete("minPrice");
      }
    }

    if ("maxPrice" in updates) {
      if (updates.maxPrice) {
        params.set("maxPrice", updates.maxPrice);
      } else {
        params.delete("maxPrice");
      }
    }

    router.push(`?${params.toString()}`);
  };

  const removeFilter = (filter) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (filter.id === "category") {
      params.delete("category");
    } else if (filter.id === "color") {
      params.delete("color");
    } else if (filter.id === "price") {
      params.delete("minPrice");
      params.delete("maxPrice");
      // Reset local price range state
      setPriceRange([minPriceFromFilters, maxPriceFromFilters]);
    } else if (filter.id.startsWith("brand-")) {
      const brandValue = filter.value;
      params.delete("brand[]");
      selectedBrands
        .filter((b) => b !== brandValue)
        .forEach((brand) => params.append("brand[]", brand));
    }

    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get("q")) {
      params.set("q", searchParams.get("q"));
    }
    // Reset local price range state
    setPriceRange([minPriceFromFilters, maxPriceFromFilters]);
    router.push(`?${params.toString()}`);
  };

  const createCategoryLink = (category) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    params.delete("page");
    return `?${params.toString()}`;
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="hidden sm:block w-full">
      <div className="flex flex-col gap-4">
        {/* Active Filters Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h2 className="text-sm font-bold uppercase text-gray-800">
              FILTERS
            </h2>
            <span className="text-gray-500">
              {isOpen ? <FaChevronUp size={14} /> : <FaAngleDown size={14} />}
            </span>
          </div>

          {isOpen && (
            <div className="mt-2">
              {activeFilters.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter) => (
                      <span
                        key={filter.id}
                        className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm"
                      >
                        {filter.value}
                        <button
                          onClick={() => removeFilter(filter)}
                          className="text-gray-500 hover:text-[#e96f84]"
                        >
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="mt-2 text-xs text-[#e96f84] hover:underline"
                  >
                    Clear all filters
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-500">No filters applied</p>
              )}
            </div>
          )}
        </div>

        {/* Categories Filter */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsOpenCategory(!isOpenCategory)}
          >
            <h2 className="text-sm font-bold uppercase text-gray-800">
              CATEGORIES
            </h2>
            <span className="text-gray-500">
              {isOpenCategory ? (
                <FaChevronUp size={14} />
              ) : (
                <FaAngleDown size={14} />
              )}
            </span>
          </div>

          {isOpenCategory && (
            <div className="mt-3 space-y-2">
              {availableFilters.categories
                ?.slice(0, showMoreCategories ? undefined : 5)
                .map((category) => (
                  <Link
                    key={category.name}
                    href={createCategoryLink(category.name)}
                    className={`flex justify-between items-center py-1 px-1 rounded hover:bg-gray-50 ${
                      searchParams.get("category") === category.name
                        ? "text-[#e96f84] font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">
                      ({category.count})
                    </span>
                  </Link>
                ))}

              {availableFilters.categories?.length > 5 && (
                <button
                  onClick={() => setShowMoreCategories(!showMoreCategories)}
                  className="text-xs text-[#e96f84] hover:underline mt-1"
                >
                  {showMoreCategories ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsOpenPrice(!isOpenPrice)}
          >
            <h2 className="text-sm font-bold uppercase text-gray-800">
              PRICE RANGE
            </h2>
            <span className="text-gray-500">
              {isOpenPrice ? (
                <FaChevronUp size={14} />
              ) : (
                <FaAngleDown size={14} />
              )}
            </span>
          </div>

          {isOpenPrice && (
            <Box sx={{ px: 2, py: 2 }}>
              <PriceSlider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatPrice(value)}
                min={minPriceFromFilters}
                max={maxPriceFromFilters}
                step={Math.max(1, Math.floor((maxPriceFromFilters - minPriceFromFilters) / 100))}
              />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                mt: 1,
                mb: 2
              }}>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(priceRange[0])}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(priceRange[1])}
                </Typography>
              </Box>
              <div className="flex gap-2">
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handlePriceApply}
                  sx={{
                    bgcolor: '#e96f84',
                    '&:hover': {
                      bgcolor: '#d45f74',
                    },
                  }}
                >
                  Apply
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handlePriceReset}
                  sx={{
                    color: '#e96f84',
                    borderColor: '#e96f84',
                    '&:hover': {
                      borderColor: '#d45f74',
                      bgcolor: 'rgba(233, 111, 132, 0.04)',
                    },
                  }}
                >
                  Reset
                </Button>
              </div>
            </Box>
          )}
        </div>

        {/* Brands Filter */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsOpenBrands(!isOpenBrands)}
          >
            <h2 className="text-sm font-bold uppercase text-gray-800">
              BRANDS
            </h2>
            <span className="text-gray-500">
              {isOpenBrands ? (
                <FaChevronUp size={14} />
              ) : (
                <FaAngleDown size={14} />
              )}
            </span>
          </div>

          {isOpenBrands && (
            <div className="mt-3 space-y-2">
              {availableFilters.brands
                ?.slice(0, showMoreBrands ? undefined : 5)
                .map((brand) => (
                  <label
                    key={brand.name}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandToggle(brand.name)}
                      className="h-4 w-4 text-[#e96f84] border-gray-300 rounded focus:ring-[#e96f84]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-[#e96f84]">
                      {brand.name}{" "}
                      <span className="text-gray-400">({brand.count})</span>
                    </span>
                  </label>
                ))}

              {availableFilters.brands?.length > 5 && (
                <button
                  onClick={() => setShowMoreBrands(!showMoreBrands)}
                  className="text-xs text-[#e96f84] hover:underline mt-1"
                >
                  {showMoreBrands ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopFilter;