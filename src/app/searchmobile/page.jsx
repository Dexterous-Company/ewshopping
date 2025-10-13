"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoClose, IoSearch, IoTrendingUp } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const SearchHeader = ({ querySearch, setQuerySearch, onBack, onKeyDown }) => {
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
        {/* <button onClick={onBack} className="text-gray-600">
          <FaArrowLeft size={18} />
        </button> */}
        <div className="flex-1 relative">
          <form onSubmit={handleSearch}>
            <div className="flex items-center rounded-lg bg-gray-100 px-3 py-3">
              <IoSearch className="text-gray-500 mr-2" size={18} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full bg-transparent outline-none text-sm"
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                onKeyDown={onKeyDown}
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

const SuggestionItem = ({ suggestion, onClick, isHighlighted }) => {
  return (
    <div
      className={`flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
        isHighlighted ? "bg-blue-50" : ""
      }`}
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

const RecentSearchItem = ({ item, onSelect, onRemove, isHighlighted }) => {
  return (
    <div
      className={`flex items-center justify-between p-3 border-b border-gray-100 ${
        isHighlighted ? "bg-blue-50" : ""
      }`}
    >
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

const RecentSearches = ({ searches, onSelect, onClear, highlightedIndex }) => {
  if (searches.length === 0) return null;

  return (
    <div className="">
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
            isHighlighted={index === highlightedIndex}
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

const TrendingSearches = ({ trending, onSelect, highlightedIndex }) => {
  return (
    <div className="mt-2 px-4">
      <h3 className="font-medium text-gray-700 mb-3">Trending Searches</h3>
      <div className="flex flex-wrap gap-2">
        {trending.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelect(item)}
            className={`bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm cursor-pointer ${
              index === highlightedIndex ? "ring-2 ring-blue-500" : ""
            }`}
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [activeSection, setActiveSection] = useState(""); // "suggestions", "recent", "trending"
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    setTrendingSearches([
      "iPhone 13",
      "iPhone 12",
      "iPhone 11",
      "iPhone 8",
      "iPhone 7",
    ]);
  }, []);

  // Enhanced API call
  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setHighlightedIndex(-1);
      setActiveSection("");
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${Baseurl}/api/v1/search/autocomplete?q=${encodeURIComponent(
          query
        )}&limit=12`,
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const suggestionsData = data.data?.suggestions || [];
        setSuggestions(suggestionsData);
        setShowSuggestions(true);

        if (suggestionsData.length > 0) {
          setHighlightedIndex(0);
          setActiveSection("suggestions");
        } else {
          setHighlightedIndex(-1);
          setActiveSection("");
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = (value) => {
    setQuerySearch(value);
    setHighlightedIndex(-1);
    setActiveSection("");

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
      setShowSuggestions(false);
    }
  };

  const handleSearch = (searchTerm, isSuggestion = false) => {
    if (!searchTerm.trim()) return;

    // Add to recent searches
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter((item) => item !== searchTerm),
    ].slice(0, 5); // Keep only 5 most recent

    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);

    // Navigate to search results with appropriate parameter
    if (isSuggestion) {
      // Use productTag for suggestions
      router.push(
        `/searchresults?q=${encodeURIComponent(searchTerm)}`
      );
    } else {
      // Use q for direct searches
      router.push(
        `/searchresults?q=${encodeURIComponent(searchTerm)}`
      );
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion.name, true);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
    setHighlightedIndex(-1);
    setActiveSection("");
  };

  const handleBack = () => {
    router.back();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (suggestions.length > 0 && showSuggestions) {
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          setActiveSection("suggestions");
        } else if (recentSearches.length > 0 && !querySearch) {
          setHighlightedIndex((prev) =>
            prev < recentSearches.length - 1 ? prev + 1 : 0
          );
          setActiveSection("recent");
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (suggestions.length > 0 && showSuggestions) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          setActiveSection("suggestions");
        } else if (recentSearches.length > 0 && !querySearch) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : recentSearches.length - 1
          );
          setActiveSection("recent");
        }
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (
            activeSection === "suggestions" &&
            suggestions[highlightedIndex]
          ) {
            handleSuggestionClick(suggestions[highlightedIndex]);
          } else if (
            activeSection === "recent" &&
            recentSearches[highlightedIndex]
          ) {
            handleSearch(recentSearches[highlightedIndex], false);
          }
        } else if (querySearch.trim()) {
          // Check if the query matches any suggestion
          const matchedSuggestion = suggestions.find(
            (s) => s.name.toLowerCase() === querySearch.toLowerCase()
          );

          if (matchedSuggestion) {
            handleSearch(matchedSuggestion.name, true);
          } else {
            handleSearch(querySearch, false);
          }
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle clicking outside the search to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        setActiveSection("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 search-container">
      <div className="flex flex-row items-center px-4 py-3 gap-3">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page Title */}
        <h1 className="text-lg font-semibold text-gray-800">Search Page</h1>
      </div>
      <SearchHeader
        querySearch={querySearch}
        setQuerySearch={handleInputChange}
        onBack={handleBack}
        onKeyDown={handleKeyDown}
      />

      <div className="px-4 py-1">
        {querySearch && showSuggestions ? (
          // Show suggestions when query exists
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-500 text-sm">Searching...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div>
                {suggestions.map((suggestion, index) => (
                  <SuggestionItem
                    key={suggestion.id || index}
                    suggestion={suggestion}
                    onClick={handleSuggestionClick}
                    isHighlighted={
                      index === highlightedIndex &&
                      activeSection === "suggestions"
                    }
                  />
                ))}
                <div
                  className={`p-3 text-center text-blue-600 font-medium cursor-pointer border-t border-gray-100 ${
                    highlightedIndex === suggestions.length &&
                    activeSection === "suggestions"
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => {
                    // Check if the query matches any suggestion
                    const matchedSuggestion = suggestions.find(
                      (s) => s.name.toLowerCase() === querySearch.toLowerCase()
                    );

                    if (matchedSuggestion) {
                      handleSearch(matchedSuggestion.name, true);
                    } else {
                      handleSearch(querySearch, false);
                    }
                  }}
                  onMouseEnter={() => {
                    setHighlightedIndex(suggestions.length);
                    setActiveSection("suggestions");
                  }}
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
              onSelect={(searchTerm) => handleSearch(searchTerm, false)}
              onClear={clearRecentSearches}
              highlightedIndex={
                activeSection === "recent" ? highlightedIndex : -1
              }
            />
            <TrendingSearches
              trending={trendingSearches}
              onSelect={(searchTerm) => handleSearch(searchTerm, false)}
              highlightedIndex={
                activeSection === "trending" ? highlightedIndex : -1
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
