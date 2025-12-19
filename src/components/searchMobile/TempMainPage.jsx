"use client";
import React, { useState } from "react";
import { FaAngleDown, FaChevronUp } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";

const TempMainPage = () => {
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
  const [showMore, setShowMore] = useState(false);
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

  const activeFilters = [
    ...(searchParams.get("category")
      ? [{ id: 1, value: searchParams.get("category") }]
      : []),
    ...(searchParams.get("color")
      ? [{ id: 2, value: searchParams.get("color") }]
      : []),
    ...(searchParams.get("minPrice")
      ? [
          {
            id: 3,
            value: `₹${searchParams.get("minPrice")}-₹${searchParams.get(
              "maxPrice"
            )}`,
          },
        ]
      : []),
    ...selectedBrands.map((brand, i) => ({ id: 4 + i, value: brand })),
  ];

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors((prev) => (prev.includes(color) ? [] : [color]));
  };

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams);

    if (priceRange.min) {
      params.set("minPrice", priceRange.min);
    } else {
      params.delete("minPrice");
    }

    if (priceRange.max) {
      params.set("maxPrice", priceRange.max);
    } else {
      params.delete("maxPrice");
    }

    router.push(`?${params.toString()}`);
  };

  const handleBrandApply = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("brand[]");

    selectedBrands.forEach((brand) => {
      params.append("brand[]", brand);
    });

    router.push(`?${params.toString()}`);
  };

  const handleColorApply = () => {
    const params = new URLSearchParams(searchParams);

    if (selectedColors.length) {
      params.set("color", selectedColors[0]);
    } else {
      params.delete("color");
    }

    router.push(`?${params.toString()}`);
  };

  const removeFilter = (filter) => {
    const params = new URLSearchParams(searchParams);

    if (filter.value === searchParams.get("category")) {
      params.delete("category");
    } else if (filter.value === searchParams.get("color")) {
      params.delete("color");
    } else if (filter.value.includes("₹") && searchParams.get("minPrice")) {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else if (selectedBrands.includes(filter.value)) {
      const newBrands = selectedBrands.filter((b) => b !== filter.value);
      params.delete("brand[]");
      newBrands.forEach((brand) => params.append("brand[]", brand));
    }

    router.push(`?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("color");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("brand[]");
    router.push(`?${params.toString()}`);
  };

  const createCategoryLink = (category) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    params.delete("page"); // Reset to first page when changing category
    return `?${params.toString()}`;
  };

  return (
    <div className="hidden sm:block overflow-hidden">
      <div className="flex flex-col gap-2">
        <div
          className="border border-gray-300 bg-white px-2 py-3 rounded-sm shadow"
          style={{ backgroundColor: "#fff" }}
        >
          <div
            className="flex flex-row items-center justify-between cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h2 className="text-sm font-bold text-black uppercase mb-3">
              FILTER BY
            </h2>
            <span className="mb-3">
              {isOpen ? <FaChevronUp /> : <FaAngleDown />}
            </span>
          </div>

          {isOpen && (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {activeFilters.map((item, index) => (
                  <span
                    key={item.id + index}
                    className="border border-gray-300 hover:text-[#e96f84] rounded-sm px-3 py-1 text-sm flex items-center transition-colors"
                  >
                    {item.value}
                    <svg
                      className="w-3 h-3 ml-1 text-gray-500 cursor-pointer"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      onClick={() => removeFilter(item)}
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                ))}
              </div>

              <button
                onClick={clearAllFilters}
                className="text-[0.8rem] underline font-medium text-black hover:text-[#e96f84] py-0.5 hover:underline"
              >
                CLEAR ALL
              </button>
            </>
          )}
        </div>

        {/* Categories Filter */}
        <div className="border border-gray-300 bg-white px-2 py-3 rounded-sm shadow">
          <div
            className="flex flex-row items-center justify-between cursor-pointer"
            onClick={() => setIsOpenCategory(!isOpenCategory)}
          >
            <h2 className="text-sm font-bold text-black uppercase mb-3">
              CATEGORIES
            </h2>
            <span className="mb-3">
              {isOpenCategory ? <FaChevronUp /> : <FaAngleDown />}
            </span>
          </div>

          {isOpenCategory && (
            <div>
              <ul className="space-y-2">
                {availableFilters.categories
                  ?.slice(0, showMore ? undefined : 5)
                  .map((category, i) => (
                    <li key={i}>
                      <Link
                        href={createCategoryLink(category.name)}
                        className="flex justify-between items-center py-1 hover:text-[#e96f84]"
                      >
                        <span>{category.name}</span>
                        <span className="text-gray-500">
                          ({category.count})
                        </span>
                      </Link>
                    </li>
                  ))}

                {filters?.available?.categories?.length > 5 && (
                  <li onClick={() => setShowMore(!showMore)}>
                    <button className="flex justify-between items-center py-1 text-[#6c757d] hover:text-[#e96f84] w-full">
                      <span>{showMore ? "Show Less" : "Show More"}</span>
                      <span>◇</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="border border-gray-300 bg-white px-2 py-3 rounded-sm shadow">
          <div
            className="flex flex-row items-center justify-between cursor-pointer"
            onClick={() => setIsOpenPrice(!isOpenPrice)}
          >
            <h2 className="text-sm font-bold text-black uppercase mb-3">
              Price
            </h2>
            <span className="mb-3">
              {isOpenPrice ? <FaChevronUp /> : <FaAngleDown />}
            </span>
          </div>

          {isOpenPrice && (
            <div className="mt-2">
              <div className="flex gap-4 mb-4">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="border border-gray-300 px-2 py-1 text-sm w-1/2 rounded-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="border border-gray-300 px-2 py-1 text-sm w-1/2 rounded-sm"
                />
              </div>
              <button
                onClick={handlePriceApply}
                className="bg-[#2c3e50] text-white px-4 py-2 text-sm w-full"
              >
                APPLY
              </button>
            </div>
          )}
        </div>

        {/* Color Filter */}
        <div className="border border-gray-300 bg-white px-2 py-3 rounded-sm shadow">
          <div
            className="flex flex-row items-center justify-between cursor-pointer"
            onClick={() => setIsOpenColor(!isOpenColor)}
          >
            <h2 className="text-sm font-bold text-black uppercase mb-3">
              Color
            </h2>
            <span className="mb-3">
              {isOpenColor ? <FaChevronUp /> : <FaAngleDown />}
            </span>
          </div>

          {isOpenColor && (
            <div className="grid grid-cols-6 gap-2 mt-4">
              {[
                "black",
                "red",
                "blue",
                "pink",
                "gray",
                "green",
                "orange",
                "yellow",
                "white",
                "purple",
                "brown",
                "gold",
              ].map((color, i) => (
                <span
                  key={i}
                  title={color}
                  className={`w-6 h-6 border border-[#ddd] inline-block cursor-pointer ${
                    selectedColors.includes(color)
                      ? "ring-2 ring-offset-1 ring-[#e96f84]"
                      : ""
                  }`}
                  style={{
                    backgroundColor: color === "yellow" ? "#ffff99" : color,
                  }}
                  onClick={() => {
                    handleColorToggle(color);
                    handleColorApply();
                  }}
                ></span>
              ))}
            </div>
          )}
        </div>

        {/* Brands Filter */}
        <div className="border border-gray-300 bg-white px-2 py-3 rounded-sm shadow">
          <div
            className="flex flex-row items-center justify-between cursor-pointer"
            onClick={() => setIsOpenBrands(!isOpenBrands)}
          >
            <h2 className="text-sm font-bold text-black uppercase mb-3">
              Brands
            </h2>
            <span className="mb-3">
              {isOpenBrands ? <FaChevronUp /> : <FaAngleDown />}
            </span>
          </div>

          {isOpenBrands && (
            <div className="space-y-2 mt-1">
              {availableFilters.brands
                ?.slice(0, showMore ? undefined : 5)
                .map((brand, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => {
                        handleBrandToggle(brand.name);
                        handleBrandApply();
                      }}
                      className="accent-pink-500 border border-gray-300 rounded-sm w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {brand.name} ({brand.count})
                    </span>
                  </label>
                ))}

              {filters?.available?.brands?.length > 5 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-sm mt-2 underline text-gray-600"
                >
                  {showMore ? "Show Less" : "View all"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TempMainPage;
