"use client";

import {
  searchNewProducts,
  loadMoreProducts,
} from "@/redux/serach/newSerchProdactSlice";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const SearchPage = ({ params }) => {
  // const p = React.use(params);
  // const searchQuery = p.keyword || "";
  // const categoryTag = p.categoryTag || "";

  const searchQuery = params?.keyword || "";
  const categoryTag = params?.categoryTag || "";
  const dispatch = useDispatch();

  const {
    loading,
    query,
    total,
    limit,
    products,
    totalPages,
    filters,
    sort,
    loadingMore,
    page: currentPage,
  } = useSelector((state) => state.searchNew);

  // State for selected filters and sort
  const [selectedFilters, setSelectedFilters] = useState({
    colors: [],
    models: [],
    priceRange: null,
  });
  const [sortOption, setSortOption] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Build search parameters
  const buildSearchParams = useCallback(
    (page = 1, isLoadMore = false) => {
      const params = {
        q: searchQuery,
        categoryTag,
        page,
        limit,
      };

      // Add filters if any selected
      if (
        selectedFilters.colors.length > 0 ||
        selectedFilters.models.length > 0 ||
        selectedFilters.priceRange
      ) {
        params.filters = {};

        if (selectedFilters.colors.length > 0) {
          params.filters.colors = selectedFilters.colors;
        }
        if (selectedFilters.models.length > 0) {
          params.filters.models = selectedFilters.models;
        }
        if (selectedFilters.priceRange) {
          params.filters.priceRange = {
            min: selectedFilters.priceRange.min,
            max: selectedFilters.priceRange.max,
          };
        }
      }

      // Add sort option
      if (sortOption) {
        params.sort = sortOption;
      }

      return params;
    },
    [searchQuery, categoryTag, limit, selectedFilters, sortOption]
  );

  // Search products when filters, sort, or search query changes
  useEffect(() => {
    dispatch(searchNewProducts(buildSearchParams(1)));
  }, [dispatch, buildSearchParams]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    dispatch(loadMoreProducts(buildSearchParams(nextPage, true)));
  };

  // Handle filter changes
  const handleColorFilter = (color) => {
    setSelectedFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleModelFilter = (model) => {
    setSelectedFilters((prev) => ({
      ...prev,
      models: prev.models.includes(model)
        ? prev.models.filter((m) => m !== model)
        : [...prev.models, model],
    }));
  };

  const handlePriceRangeFilter = (range) => {
    setSelectedFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange?.label === range.label ? null : range,
    }));
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      colors: [],
      models: [],
      priceRange: null,
    });
    setSortOption("");
  };

  // Extract filter options
  const colorFilter = filters.find(
    (filter) => filter.name === "Color" || filter.name === "Option 1"
  );
  const modelFilter = filters.find((filter) => filter.name === "Model");
  const connectorFilter = filters.find(
    (filter) => filter.name === "Connector Type"
  );

  // Process colors - split and remove duplicates
  const availableColors = colorFilter
    ? [...new Set(colorFilter.value.split(", "))].filter((color) =>
        color.trim()
      )
    : [];

  // Process models - split and remove duplicates
  const availableModels = modelFilter
    ? [...new Set(modelFilter.value.split(", "))].filter((model) =>
        model.trim()
      )
    : [];

  // Price range options
  const priceRanges = [
    { label: "Under ₹20,000", min: 0, max: 20000 },
    { label: "₹20,000 - ₹30,000", min: 20000, max: 30000 },
    { label: "₹30,000 - ₹50,000", min: 30000, max: 50000 },
    { label: "Over ₹50,000", min: 50000, max: null },
  ];

  // Sort options
  const sortOptions = [
    { value: "", label: "Relevance" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
  ];

  if (loading && !loadingMore) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Search Results for: "{searchQuery}"
        </h1>
        {total > 0 && (
          <p className="text-gray-600 mt-2">
            Found {total} product{total !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div
          className={`
          ${isFilterOpen ? "block" : "hidden"} 
          lg:block lg:w-1/4 bg-white p-6 rounded-lg shadow-md border h-fit
        `}
        >
          {/* Filters Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            {(selectedFilters.colors.length > 0 ||
              selectedFilters.models.length > 0 ||
              selectedFilters.priceRange ||
              sortOption) && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Sort Options */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Sort By</h3>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color Filter */}
          {availableColors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Color</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableColors.map((color, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.colors.includes(color)}
                      onChange={() => handleColorFilter(color)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {color}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Model Filter */}
          {availableModels.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Model</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableModels.map((model, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.models.includes(model)}
                      onChange={() => handleModelFilter(model)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {model}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Connector Type Filter */}
          {connectorFilter && connectorFilter.value && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Connector Type</h3>
              <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                {connectorFilter.value}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <label
                  key={index}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedFilters.priceRange?.label === range.label}
                    onChange={() => handlePriceRangeFilter(range)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(selectedFilters.colors.length > 0 ||
            selectedFilters.models.length > 0 ||
            selectedFilters.priceRange ||
            sortOption) && (
            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Active Filters</h3>
              <div className="flex flex-wrap gap-2">
                {selectedFilters.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                  >
                    Color: {color}
                    <button
                      onClick={() => handleColorFilter(color)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedFilters.models.map((model) => (
                  <span
                    key={model}
                    className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                  >
                    Model: {model}
                    <button
                      onClick={() => handleModelFilter(model)}
                      className="hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedFilters.priceRange && (
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                    Price: {selectedFilters.priceRange.label}
                    <button
                      onClick={() =>
                        setSelectedFilters((prev) => ({
                          ...prev,
                          priceRange: null,
                        }))
                      }
                      className="hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {sortOption && (
                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    Sort:{" "}
                    {sortOptions.find((opt) => opt.value === sortOption)?.label}
                    <button
                      onClick={() => setSortOption("")}
                      className="hover:text-orange-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      {product.thumbnail && product.thumbnail[0] ? (
                        <img
                          src={product.thumbnail[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/300/300";
                          }}
                        />
                      ) : (
                        <div className="text-gray-400">No Image</div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{product.priceRange?.toLocaleString()}
                        </span>
                        {product.mrpRange &&
                          product.mrpRange > product.priceRange && (
                            <span className="text-lg text-gray-500 line-through">
                              ₹{product.mrpRange.toLocaleString()}
                            </span>
                          )}
                      </div>

                      {/* Specifications */}
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        {product.name.match(/\d+gb.*ram/i) && (
                          <div>
                            <strong>Storage:</strong>{" "}
                            {product.name.match(/\d+gb/i)?.[0]} |
                            <strong> RAM:</strong>{" "}
                            {
                              product.name
                                .match(/\d+gb.*ram/i)?.[0]
                                .match(/\d+gb ram/i)?.[0]
                            }
                          </div>
                        )}

                        {product.filteredFields && (
                          <div>
                            <strong>Colors:</strong>{" "}
                            {product.filteredFields.find(
                              (field) =>
                                field.name === "Color" ||
                                field.name === "Option 1"
                            )?.value || "Multiple colors available"}
                          </div>
                        )}
                      </div>

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-600 mb-4">
                No products found for "{searchQuery}"
              </h2>
              <p className="text-gray-500">
                Try adjusting your search terms or browse other categories.
              </p>
            </div>
          )}

          {/* Loading More Indicator */}
          {loadingMore && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading more products...</p>
            </div>
          )}

          {/* Load More Button */}
          {!loadingMore && products && products.length < total && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
