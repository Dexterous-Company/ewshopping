"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const FlipkartStyleSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState({ suggestions: [], categoryTags: [] });
  const [products, setProducts] = useState([]);
  const [matchingCategoryTags, setMatchingCategoryTags] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch suggestions while typing
  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions();
      setShowSuggestions(true);
    } else {
      setSuggestions({ suggestions: [], categoryTags: [] });
      setShowSuggestions(false);
    }
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4098/api/v1/searchtest/suggestions?q=${query}`
      );
      if (response.data.success) {
        setSuggestions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSearch = async (searchQuery = query, page = 1) => {
    setLoading(true);
    setShowSuggestions(false);
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        page: page,
        limit: 20,
      }).toString();

      const response = await axios.get(
        `http://localhost:4098/api/v1/searchtest?${params}`
      );
      
      if (response.data.success) {
        setProducts(response.data.products || []);
        setMatchingCategoryTags(response.data.matchingCategoryTags || []);
        setRelatedKeywords(response.data.relatedKeywords || []);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  const handleCategorySuggestionClick = (category) => {
    setQuery(category.name);
    setShowSuggestions(false);
    handleSearch(category.name);
  };

  const handleKeywordClick = (keyword) => {
    setQuery(keyword);
    handleSearch(keyword);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      handleSearch(query, newPage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left Sidebar - Filters */}
      <aside className="w-full md:w-1/4 bg-white p-4 shadow-md border-r border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Search Results</h3>

        {/* Matching Categories */}
        {matchingCategoryTags.length > 0 && (
          <div className="mb-6">
            <h4 className="text-gray-600 font-medium mb-2">Matching Categories</h4>
            <div className="space-y-3">
              {matchingCategoryTags.map((tag, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="font-medium text-gray-800">{tag.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {tag.productCount} products
                  </div>
                  {tag.matchedKeywords && tag.matchedKeywords.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">Matched keywords:</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tag.matchedKeywords.slice(0, 3).map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Keywords */}
        {relatedKeywords.length > 0 && (
          <div className="mb-6">
            <h4 className="text-gray-600 font-medium mb-2">Related Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {relatedKeywords.map((keyword, index) => (
                <span
                  key={index}
                  onClick={() => handleKeywordClick(keyword)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-blue-100 cursor-pointer transition-colors"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search Info */}
        {products.length > 0 && (
          <div className="text-sm text-gray-600">
            <div>Found in {matchingCategoryTags.length} categories</div>
            <div className="mt-1">{pagination.totalProducts} total products</div>
          </div>
        )}
      </aside>

      {/* Right Side - Search + Results */}
      <main className="flex-1 p-4 md:p-6">
        {/* Search Box */}
        <div className="relative mb-6">
          <div className="flex items-center bg-white rounded-md shadow-md overflow-hidden border border-gray-200">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length > 2 && setShowSuggestions(true)}
              placeholder="Search by keywords like electronics, fashion, home decor..."
              className="w-full px-4 py-2 text-gray-700 focus:outline-none"
            />
            <button
              onClick={() => handleSearch()}
              className="bg-blue-600 text-white px-5 py-2 font-medium hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && (suggestions.suggestions.length > 0 || suggestions.categoryTags.length > 0) && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-10 max-h-96 overflow-y-auto">
              {/* Keyword Suggestions */}
              {suggestions.suggestions.length > 0 && (
                <div className="border-b border-gray-100">
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500">
                    SUGGESTIONS
                  </div>
                  {suggestions.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 flex items-center"
                    >
                      <span className="mr-2">🔍</span>
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}

              {/* Category Suggestions */}
              {suggestions.categoryTags.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500">
                    CATEGORIES
                  </div>
                  {suggestions.categoryTags.map((category, index) => (
                    <div
                      key={index}
                      onClick={() => handleCategorySuggestionClick(category)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 flex items-center"
                    >
                      <span className="mr-2">📁</span>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">
                          {category.productCount} products
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search Results Header */}
        {products.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Showing {products.length} of {pagination.totalProducts} products
              {matchingCategoryTags.length > 0 && ` across ${matchingCategoryTags.length} categories`}
            </div>
            {query && (
              <div className="text-sm text-gray-700">
                Results for: <span className="font-semibold">"{query}"</span>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-500 py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <div className="mt-2">Searching products...</div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg border border-gray-200 transition transform hover:-translate-y-1"
                >
                  <img
                    src={product.thumbnail?.[0] || "/placeholder-image.jpg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 overflow-hidden">
                      {product.name}
                    </h3>
                    <p className="text-blue-600 font-semibold mt-1">
                      ₹{product.priceRangeInt}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.CategoryTag}
                    </p>
                    {product.Offers && (
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-1">
                        Offers Available
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className={`px-4 py-2 rounded ${
                    pagination.hasPrev
                      ? "bg-gray-200 hover:bg-gray-300"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className={`px-4 py-2 rounded ${
                    pagination.hasNext
                      ? "bg-gray-200 hover:bg-gray-300"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && products.length === 0 && query && (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-xl mb-2">No products found</div>
            <div className="text-gray-600 mb-4">
              No products found for "<span className="font-semibold">{query}</span>"
            </div>
            <div className="text-sm text-gray-500">
              Try different keywords or browse our categories
            </div>
          </div>
        )}

        {/* Initial State */}
        {!loading && products.length === 0 && !query && (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-xl mb-2">Search Products</div>
            <div className="text-gray-600">
              Enter keywords to find products across categories
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FlipkartStyleSearch;