"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

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
        `${Baseurl}/api/v1/searchtest/suggestions?q=${query}`
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
        `${Baseurl}/api/v1/searchtest?${params}`
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



  const handleKeywordClick = (keyword) => {
    setQuery(keyword);
    handleSearch(keyword);
  };


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Left Sidebar - Filters */}
      <aside className="w-full md:w-1/4 bg-white p-4 shadow-md border-r border-gray-200">
       

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
      </aside>
    </div>
  );
};

export default FlipkartStyleSearch;