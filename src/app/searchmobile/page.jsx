"use client";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoClose, IoSearch, IoTrendingUp } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";
import { FaAngleLeft } from "react-icons/fa";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const SearchHeader = ({ querySearch, setQuerySearch, onBack, onKeyDown }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="sticky top-0 bg-gradient-to-r from-[#E30047] to-[#a00033] z-10 px-4 py-3 border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <form onSubmit={handleSearch}>
            <div className="flex items-center rounded-xl bg-gray-100 px-4 py-3 border border-gray-200 transition-all duration-300 focus-within:bg-white focus-within:border-blue-500 focus-within:shadow-md">
              <FaAngleLeft
                className="text-gray-500 mr-3 cursor-pointer hover:text-gray-700 transition-colors"
                size={20}
                onClick={onBack}
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for products ..."
                className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500 font-medium"
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                onKeyDown={onKeyDown}
              />
              {querySearch && (
                <button
                  onClick={() => setQuerySearch("")}
                  className="text-gray-500 ml-2 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-200"
                >
                  <IoClose size={20} />
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
  // Map API data to component expected format
  const mappedSuggestion = {
    name: suggestion.keyword,
    category: suggestion.CategoryTag,
    subCategory: suggestion.subCategory,
    mobileImage: suggestion.image,
    score: suggestion.score,
    type: "suggestion",
    productCount: suggestion.keywordCount,
    originalTag: {
      slugUrl: suggestion.CategoryTagUrl,
    },
  };

  return (
    <div
      className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 group ${
        isHighlighted
          ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-sm"
          : "hover:bg-gray-50 hover:shadow-sm"
      }`}
      onClick={() => onClick(mappedSuggestion)}
    >
      {mappedSuggestion.mobileImage ? (
        <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 flex-shrink-0 border border-gray-200 group-hover:border-gray-300 transition-all duration-300 shadow-sm group-hover:shadow-md">
          <img
            src={mappedSuggestion.mobileImage}
            alt={mappedSuggestion.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4 border border-gray-200 group-hover:border-gray-300 transition-all duration-300 shadow-sm group-hover:shadow-md">
          <IoSearch
            className="text-gray-500 group-hover:text-gray-700 transition-colors"
            size={20}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
          {mappedSuggestion.name}
        </p>
        {mappedSuggestion.category && (
          <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-700 transition-colors">
            in {mappedSuggestion.category}
            {mappedSuggestion.subCategory &&
              ` › ${mappedSuggestion.subCategory}`}
          </p>
        )}
        {mappedSuggestion.score && (
          <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">
            Score: {mappedSuggestion.score}
          </p>
        )}
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <IoSearch className="text-blue-500 ml-2" size={18} />
      </div>
    </div>
  );
};

const RecentSearchItem = ({ item, onSelect, onRemove, isHighlighted }) => {
  return (
    <div
      className={`flex flex-col items-center p-3 relative group flex-shrink-0 transition-all duration-300 ${
        isHighlighted
          ? "bg-blue-50 rounded-lg shadow-md scale-105"
          : "hover:bg-white hover:shadow-lg hover:scale-105"
      }`}
      style={{ minWidth: "90px" }}
    >
      <div
        className="flex flex-col items-center cursor-pointer w-full"
        onClick={() => onSelect(item)}
      >
        {item.mobileImage ? (
          <div className="w-16 h-16 rounded-lg overflow-hidden mb-2 flex-shrink-0 border border-gray-200 group-hover:border-blue-300 transition-all duration-300 shadow-md group-hover:shadow-xl relative">
            <img
              src={item.mobileImage}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-2 border border-gray-200 group-hover:border-blue-300 transition-all duration-300 shadow-md group-hover:shadow-lg">
            <LuHistory
              className="text-gray-500 group-hover:text-blue-600 transition-colors"
              size={24}
            />
          </div>
        )}

        <div className="text-center w-full max-w-20">
          <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
            {item.name}
          </p>
          {item.category && (
            <p className="text-xs text-gray-600 mt-1 truncate group-hover:text-gray-700 transition-colors">
              in {item.category}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item);
        }}
        className="absolute -top-1 -right-1 bg-gray-300 hover:bg-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
      >
        <IoClose
          size={12}
          className="text-gray-700 hover:text-white transition-colors"
        />
      </button>
    </div>
  );
};

const RecentSearches = ({
  searches,
  onSelect,
  onClear,
  onRemove,
  highlightedIndex,
}) => {
  if (searches.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center px-4">
        <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
          <LuHistory className="text-gray-600" />
          Recent Searches
        </h3>
        <button
          onClick={onClear}
          className="text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors px-3 py-1 rounded-lg hover:bg-gray-100"
        >
          Clear All
        </button>
      </div>
      <div className="px-4 mt-3">
        <div className="flex flex-row gap-4 overflow-x-auto hide-scrollbar">
          {searches.map((item, index) => (
            <RecentSearchItem
              key={`${item.name}-${index}`}
              item={item}
              onSelect={onSelect}
              onRemove={onRemove}
              isHighlighted={index === highlightedIndex}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

const TrendingSearches = ({ trending, onSelect, highlightedIndex }) => {
  if (trending.length === 0) return null;

  return (
    <div className="mt-6 px-4">
      <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
        <IoTrendingUp className="text-gray-600" />
        Trending Searches
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {trending.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelect(item)}
            className={`bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 group ${
              index === highlightedIndex
                ? "ring-2 ring-blue-500 shadow-lg scale-105"
                : "hover:shadow-xl hover:scale-105 hover:border-blue-300"
            }`}
          >
            <div className="p-3">
              <div className="flex justify-center mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <IoTrendingUp
                    className="text-blue-600 group-hover:text-blue-700 transition-colors"
                    size={18}
                  />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800 truncate text-center group-hover:text-blue-600 transition-colors">
                {item.name}
              </p>
              {item.category && (
                <p className="text-xs text-gray-600 mt-1 text-center group-hover:text-gray-700 transition-colors">
                  in {item.category}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopCategoryHandler = ({ category, onSelect, highlightedIndex }) => {
  if (!category || category.length === 0) return null;

  return (
    <div className="mt-6 px-4">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
          <IoSearch className="text-gray-600" />
          Top Categories
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {category.map((item, index) => (
          <div
            key={item._id || index}
            onClick={() => onSelect(item)}
            className={`bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 group ${
              index === highlightedIndex
                ? "ring-2 ring-blue-500 shadow-xl scale-105"
                : "hover:shadow-2xl hover:scale-105 hover:border-blue-300"
            }`}
          >
            <div className="relative w-full pt-[100%] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              {item.mobileImage ? (
                <>
                  <img
                    src={item.mobileImage}
                    alt={item.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 shadow-sm group-hover:shadow-md">
                    <IoSearch
                      className="text-blue-600 group-hover:text-blue-700 transition-colors"
                      size={18}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3">
              <p className="text-sm font-medium text-gray-800 truncate text-center group-hover:text-blue-600 transition-colors">
                {item.name}
              </p>
              {item.productCount && (
                <p className="text-xs text-gray-600 mt-1 text-center group-hover:text-gray-700 transition-colors">
                  {item.productCount} items
                </p>
              )}
            </div>
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
  const [topCatagory, setTopCatagory] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [activeSection, setActiveSection] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      setActiveSection("");
      return;
    }

    setIsLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `${Baseurl}/api/v1/search/autocomplete?q=${encodeURIComponent(
          query
        )}&limit=8`,
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
        // Handle both response formats
        const suggestionsData =
          data.data?.suggestions || data.suggestions || [];
        setSuggestions(suggestionsData);
        setShowSuggestions(suggestionsData.length > 0);

        if (suggestionsData.length > 0) {
          setHighlightedIndex(0);
          setActiveSection("suggestions");
        } else {
          setHighlightedIndex(-1);
          setActiveSection("");
        }
      } else {
        throw new Error(`API error: ${response.status}`);
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

  const handleInputChange = (value) => {
    setQuerySearch(value);
    setHighlightedIndex(-1); // Reset to -1 instead of 0
    setActiveSection("");

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

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
  const navigateToSearch = (searchTerm, isSuggestion = false) => {
    let searchData;
    let categoryTag = "all";

    if (isSuggestion && typeof searchTerm === "object") {
      searchData = {
        name: searchTerm.name,
        category: searchTerm.category || null,
        mobileImage: searchTerm.mobileImage || null,
        score: searchTerm.score || null,
        type: searchTerm.type || null,
        productCount: searchTerm.productCount || null,
        superCategory: searchTerm.superCategory || null,
        originalTag: searchTerm.originalTag || null,
      };

      categoryTag =
        searchTerm.originalTag?.slugUrl || searchTerm?.slugUrl || "all";
    } else {
      searchData = {
        name: typeof searchTerm === "string" ? searchTerm : searchTerm.name,
        category: null,
        mobileImage: null,
        score: null,
        type: null,
        productCount: null,
        superCategory: null,
        originalTag: null,
      };
    }

    if (!searchData.name.trim()) return;

    const existingSearches = JSON.parse(
      localStorage.getItem("suggestionSearches") || "[]"
    );
    const searchesArray = Array.isArray(existingSearches)
      ? existingSearches
      : [];

    const updatedSearches = [
      searchData,
      ...searchesArray.filter((item) => item.name !== searchData.name),
    ].slice(0, 8);

    localStorage.setItem("suggestionSearches", JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);

    const encodedKeyword = encodeURIComponent(searchData.name.trim());
    const encodedCategory = encodeURIComponent(categoryTag);
    router.push(`/search/${encodedCategory}/${encodedKeyword}`);
  };

  const handleSuggestionClick = (suggestion) => {
    navigateToSearch(suggestion, true);
  };

  useEffect(() => {
    const savedSearches = localStorage.getItem("suggestionSearches");
    if (savedSearches) {
      try {
        const parsedSearches = JSON.parse(savedSearches);
        const searchesArray = Array.isArray(parsedSearches)
          ? parsedSearches
          : [parsedSearches];

        const formattedSearches = searchesArray
          .filter((item) => item && item.name)
          .map((item) => ({
            name: item.name,
            category: item.category || null,
            mobileImage: item.mobileImage || null,
            score: item.score || null,
            type: item.type || null,
            productCount: item.productCount || null,
            superCategory: item.superCategory || null,
            originalTag: item.originalTag || null,
          }));

        setRecentSearches(formattedSearches);
      } catch (error) {
        console.error("Error parsing suggestion searches:", error);
        setRecentSearches([]);
      }
    }

    // Generate trending searches from actual iPhone data
    const generateTrendingSearches = () => {
      const trendingKeywords = [
        "iPhone 16",
        "samsung mobile phone",
        "womens ethnic wear",
        "t-shirts",
      ];

      return trendingKeywords.map((keyword) => ({
        name: keyword,
      }));
    };

    setTrendingSearches(generateTrendingSearches());
  }, []);

  const clearRecentSearches = () => {
    localStorage.removeItem("suggestionSearches");
    setRecentSearches([]);
    setHighlightedIndex(-1);
    setActiveSection("");
  };

  const removeSingleSearch = (itemToRemove) => {
    const updatedSearches = recentSearches.filter(
      (item) => item.name !== itemToRemove.name
    );
    localStorage.setItem("suggestionSearches", JSON.stringify(updatedSearches));
    setRecentSearches(updatedSearches);

    if (updatedSearches.length === 0) {
      setHighlightedIndex(-1);
      setActiveSection("");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleKeyDown = (e) => {
    // Helper: ENTER always goes to /search/all
    const goToAllSearch = (keyword) => {
      if (!keyword) return;

      router.push(`/search/all/${encodeURIComponent(keyword)}`);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      setActiveSection("");
    };

    switch (e.key) {
      case "Enter":
        e.preventDefault();

        // Only navigate to highlighted item if user explicitly selected it
        if (highlightedIndex >= 0 && activeSection) {
          if (
            activeSection === "suggestions" &&
            suggestions[highlightedIndex]
          ) {
            // Get the keyword from suggestion object
            const keyword =
              suggestions[highlightedIndex].keyword ||
              suggestions[highlightedIndex].name;
            goToAllSearch(keyword);
          } else if (
            activeSection === "recent" &&
            recentSearches[highlightedIndex]
          ) {
            const keyword =
              typeof recentSearches[highlightedIndex] === "string"
                ? recentSearches[highlightedIndex]
                : recentSearches[highlightedIndex].name;
            goToAllSearch(keyword);
          } else if (
            activeSection === "trending" &&
            trendingSearches[highlightedIndex]
          ) {
            const keyword =
              typeof trendingSearches[highlightedIndex] === "string"
                ? trendingSearches[highlightedIndex]
                : trendingSearches[highlightedIndex].name;
            goToAllSearch(keyword);
          } else if (
            activeSection === "category" &&
            topCatagory[highlightedIndex]
          ) {
            const keyword =
              typeof topCatagory[highlightedIndex] === "string"
                ? topCatagory[highlightedIndex]
                : topCatagory[highlightedIndex].name;
            goToAllSearch(keyword);
          }
        } else {
          // If no highlighted item, just use the typed query
          goToAllSearch(querySearch.trim());
        }

        break;

      case "ArrowDown":
        e.preventDefault();
        if (!showSuggestions && suggestions.length > 0) {
          // First down arrow - show suggestions and highlight first item
          setShowSuggestions(true);
          setHighlightedIndex(0);
          setActiveSection("suggestions");
        } else if (showSuggestions) {
          let newIndex = highlightedIndex + 1;
          let newSection = activeSection;

          // Calculate which section to navigate to
          if (activeSection === "suggestions") {
            if (newIndex < suggestions.length + 1) {
              // +1 for "View all results"
              setHighlightedIndex(newIndex);
            } else {
              // Move to recent searches if available
              if (recentSearches.length > 0) {
                setHighlightedIndex(0);
                setActiveSection("recent");
              } else if (trendingSearches.length > 0) {
                setHighlightedIndex(0);
                setActiveSection("trending");
              } else if (topCatagory.length > 0) {
                setHighlightedIndex(0);
                setActiveSection("category");
              } else {
                setHighlightedIndex(0);
                setActiveSection("suggestions");
              }
            }
          } else if (activeSection === "recent") {
            if (newIndex < recentSearches.length) {
              setHighlightedIndex(newIndex);
            } else {
              // Move to trending
              if (trendingSearches.length > 0) {
                setHighlightedIndex(0);
                setActiveSection("trending");
              } else if (topCatagory.length > 0) {
                setHighlightedIndex(0);
                setActiveSection("category");
              } else {
                // Loop back to suggestions
                setHighlightedIndex(0);
                setActiveSection("suggestions");
              }
            }
          } else if (activeSection === "trending") {
            if (newIndex < trendingSearches.length) {
              setHighlightedIndex(newIndex);
            } else {
              // Move to category
              if (topCatagory.length > 0) {
                setHighlightedIndex(0);
                setActiveSection("category");
              } else {
                // Loop back to suggestions
                setHighlightedIndex(0);
                setActiveSection("suggestions");
              }
            }
          } else if (activeSection === "category") {
            if (newIndex < topCatagory.length) {
              setHighlightedIndex(newIndex);
            } else {
              // Loop back to suggestions
              setHighlightedIndex(0);
              setActiveSection("suggestions");
            }
          }
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (showSuggestions) {
          let newIndex = highlightedIndex - 1;
          let newSection = activeSection;

          if (activeSection === "suggestions") {
            if (newIndex >= 0) {
              setHighlightedIndex(newIndex);
            } else {
              // Move to category (last section) if available
              if (topCatagory.length > 0) {
                setHighlightedIndex(topCatagory.length - 1);
                setActiveSection("category");
              } else if (trendingSearches.length > 0) {
                setHighlightedIndex(trendingSearches.length - 1);
                setActiveSection("trending");
              } else if (recentSearches.length > 0) {
                setHighlightedIndex(recentSearches.length - 1);
                setActiveSection("recent");
              } else {
                setHighlightedIndex(suggestions.length);
                setActiveSection("suggestions");
              }
            }
          } else if (activeSection === "recent") {
            if (newIndex >= 0) {
              setHighlightedIndex(newIndex);
            } else {
              // Move to suggestions
              setHighlightedIndex(suggestions.length + 1 - 1); // Last item in suggestions
              setActiveSection("suggestions");
            }
          } else if (activeSection === "trending") {
            if (newIndex >= 0) {
              setHighlightedIndex(newIndex);
            } else {
              // Move to recent
              if (recentSearches.length > 0) {
                setHighlightedIndex(recentSearches.length - 1);
                setActiveSection("recent");
              } else {
                // Move to suggestions
                setHighlightedIndex(suggestions.length + 1 - 1);
                setActiveSection("suggestions");
              }
            }
          } else if (activeSection === "category") {
            if (newIndex >= 0) {
              setHighlightedIndex(newIndex);
            } else {
              // Move to trending
              if (trendingSearches.length > 0) {
                setHighlightedIndex(trendingSearches.length - 1);
                setActiveSection("trending");
              } else if (recentSearches.length > 0) {
                setHighlightedIndex(recentSearches.length - 1);
                setActiveSection("recent");
              } else {
                // Move to suggestions
                setHighlightedIndex(suggestions.length + 1 - 1);
                setActiveSection("suggestions");
              }
            }
          }
        }
        break;

      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        setActiveSection("");
        break;
    }
  };

  
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

  useEffect(() => {
    const fetchTopCategory = async () => {
      try {
        const response = await fetch(
          `${Baseurl}/api/v1/categorytag/topCategoryLimit`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch top categories");
        }
        const data = await response.json();
        const categoryData = data?.categoryTag || data || [];
        setTopCatagory(Array.isArray(categoryData) ? categoryData : []);
      } catch (error) {
        console.error("Error fetching top categories:", error);
        setTopCatagory([]);
      }
    };

    fetchTopCategory();
  }, []);

  useEffect(() => {
    if (highlightedIndex >= 0) {
      const highlightedElement = document.querySelector(
        '[data-highlighted="true"]'
      );
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="min-h-screen search-container bg-gradient-to-br from-gray-50 to-blue-50">
      <SearchHeader
        querySearch={querySearch}
        setQuerySearch={handleInputChange}
        onBack={handleBack}
        onKeyDown={handleKeyDown}
      />

      <div className="pb-8">
        {querySearch && showSuggestions ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-4 mt-2 border border-gray-200">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3 text-gray-600 text-sm font-medium">
                  Searching...
                </p>
              </div>
            ) : suggestions.length > 0 ? (
              <div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion._id || index}
                    data-highlighted={
                      index === highlightedIndex &&
                      activeSection === "suggestions"
                    }
                  >
                    <SuggestionItem
                      suggestion={suggestion}
                      onClick={handleSuggestionClick}
                      isHighlighted={
                        index === highlightedIndex &&
                        activeSection === "suggestions"
                      }
                    />
                  </div>
                ))}
                <div
                  className={`p-4 text-center text-blue-600 font-semibold cursor-pointer border-t border-gray-100 transition-all duration-300 group ${
                    highlightedIndex === suggestions.length &&
                    activeSection === "suggestions"
                      ? "bg-blue-50"
                      : "hover:bg-blue-50 hover:shadow-inner"
                  }`}
                  onClick={() => {
                    const matchedSuggestion = suggestions.find(
                      (s) =>
                        s.keyword.toLowerCase() === querySearch.toLowerCase()
                    );
                    if (matchedSuggestion) {
                      const mappedSuggestion = {
                        name: matchedSuggestion.keyword,
                        category: matchedSuggestion.CategoryTag,
                        subCategory: matchedSuggestion.subCategory,
                        mobileImage: matchedSuggestion.image,
                        score: matchedSuggestion.score,
                        type: "suggestion",
                        productCount: matchedSuggestion.keywordCount,
                        originalTag: {
                          slugUrl: matchedSuggestion.CategoryTagUrl,
                        },
                      };
                      navigateToSearch(mappedSuggestion, true);
                    } else {
                      navigateToSearch(querySearch, false);
                    }
                  }}
                  onMouseEnter={() => {
                    setHighlightedIndex(suggestions.length);
                    setActiveSection("suggestions");
                  }}
                >
                  <span className="group-hover:underline transition-all duration-300">
                    View all results for "{querySearch}"
                  </span>
                </div>
              </div>
            ) : querySearch.length >= 2 ? (
              <div className="p-6 text-center text-gray-600">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <IoSearch className="text-gray-400" size={24} />
                </div>
                <p className="font-medium">
                  No results found for "{querySearch}"
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Try different keywords
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            <RecentSearches
              searches={recentSearches}
              onSelect={(searchTerm) => navigateToSearch(searchTerm, true)}
              onClear={clearRecentSearches}
              onRemove={removeSingleSearch}
              highlightedIndex={
                activeSection === "recent" ? highlightedIndex : -1
              }
            />
            <TrendingSearches
              trending={trendingSearches}
              onSelect={(searchTerm) => navigateToSearch(searchTerm, true)}
              highlightedIndex={
                activeSection === "trending" ? highlightedIndex : -1
              }
            />
            {topCatagory.length > 0 && (
              <TopCategoryHandler
                category={topCatagory}
                onSelect={(categoryItem) =>
                  navigateToSearch(categoryItem, true)
                }
                highlightedIndex={
                  activeSection === "category" ? highlightedIndex : -1
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
