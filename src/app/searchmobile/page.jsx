"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoClose, IoSearch, IoTrendingUp } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const SearchHeader = ({ querySearch, setQuerySearch, onBack }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-gray-600">
          <FaArrowLeft size={18} />
        </button>
        <div className="flex-1 relative">
          <form onSubmit={handleSearch}>
            <div className="flex items-center rounded-lg bg-gray-100 px-3 py-2">
              <IoSearch className="text-gray-500 mr-2" size={18} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full bg-transparent outline-none text-sm"
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
              />
              {querySearch && (
                <button
                  onClick={() => setQuerySearch("")}
                  className="text-gray-500 ml-2"
                >
                  <IoClose size={18} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SuggestionItem = ({ suggestion, onClick }) => {
  return (
    <div
      className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick(suggestion)}
    >
      {suggestion.mobileImage ? (
        <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
          <img
            src={suggestion.mobileImage}
            alt={suggestion.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <IoSearch className="text-gray-400 mr-3" size={18} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{suggestion.name}</p>
        {suggestion.category && (
          <p className="text-xs text-gray-500 mt-1">
            in {suggestion.category}
            {suggestion.subCategory && ` › ${suggestion.subCategory}`}
          </p>
        )}
      </div>
      <IoTrendingUp className="text-gray-400 ml-2" size={16} />
    </div>
  );
};

const RecentSearchItem = ({ item, onSelect, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-100">
      <div
        className="flex items-center flex-1 cursor-pointer"
        onClick={() => onSelect(item)}
      >
        <LuHistory className="text-gray-400 mr-3" size={18} />
        <span className="text-sm">{item}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item);
        }}
        className="text-gray-400"
      >
        <IoClose size={16} />
      </button>
    </div>
  );
};

const RecentSearches = ({ searches, onSelect, onClear }) => {
  if (searches.length === 0) return null;
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center px-4 mb-2">
        <h3 className="font-medium text-gray-700">Recent Searches</h3>
        <button onClick={onClear} className="text-blue-600 text-sm font-medium">
          Clear All
        </button>
      </div>
      <div className="bg-white rounded-lg overflow-hidden">
        {searches.map((item, index) => (
          <RecentSearchItem
            key={index}
            item={item}
            onSelect={onSelect}
            onRemove={(itemToRemove) => {
              const updatedSearches = searches.filter(
                (item) => item !== itemToRemove
              );
              localStorage.setItem(
                "recentSearches",
                JSON.stringify(updatedSearches)
              );
              onClear(); // This will trigger a re-render in parent
            }}
          />
        ))}
      </div>
    </div>
  );
};

const TrendingSearches = ({ trending, onSelect }) => {
  return (
    <div className="mt-6 px-4">
      <h3 className="font-medium text-gray-700 mb-3">Trending Searches</h3>
      <div className="flex flex-wrap gap-2">
        {trending.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelect(item)}
            className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm cursor-pointer"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const SearchPage = () => {
  const router = useRouter();
  const [querySearch, setQuerySearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    // Mock trending searches - in a real app, this would come from an API
    setTrendingSearches([
      "Smartphones",
      "Laptops",
      "Headphones",
      "Watches",
      "Shoes",
      "T-shirts",
      "Backpacks",
      "Skincare",
    ]);
  }, []);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${Baseurl}/api/v1/categorytag/autocomplete?q=${encodeURIComponent(
          query
        )}&limit=8`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (value) => {
    setQuerySearch(value);

    // Clear previous timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set new timeout for debounce
    if (value.trim().length >= 2) {
      const timeout = setTimeout(() => {
        fetchSuggestions(value.trim());
      }, 300);
      setDebounceTimeout(timeout);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) return;

    // Add to recent searches
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter((item) => item !== searchTerm),
    ].slice(0, 5); // Keep only 5 most recent

    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);

    // Navigate to search results
    router.push(`/searchresults?categoryTag=${encodeURIComponent(searchTerm)}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuerySearch(suggestion.name);
    handleSearch(suggestion.name);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader
        querySearch={querySearch}
        setQuerySearch={handleInputChange}
        onBack={handleBack}
      />

      <div className="p-4">
        {querySearch ? (
          // Show suggestions when query exists
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-500 text-sm">Searching...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div>
                {suggestions.map((suggestion) => (
                  <SuggestionItem
                    key={suggestion.id || suggestion._id}
                    suggestion={suggestion}
                    onClick={handleSuggestionClick}
                  />
                ))}
                <div
                  className="p-3 text-center text-blue-600 font-medium cursor-pointer border-t border-gray-100"
                  onClick={() => handleSearch(querySearch)}
                >
                  View all results for "{querySearch}"
                </div>
              </div>
            ) : querySearch.length >= 2 ? (
              <div className="p-4 text-center text-gray-500">
                No results found for "{querySearch}"
              </div>
            ) : null}
          </div>
        ) : (
          // Show recent and trending searches when no query
          <>
            <RecentSearches
              searches={recentSearches}
              onSelect={handleSearch}
              onClear={clearRecentSearches}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
