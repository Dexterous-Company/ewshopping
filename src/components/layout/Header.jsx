"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  IoClose,
  IoLocationOutline,
  IoLogoGooglePlaystore,
  IoSearch,
} from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWishlist } from "@/redux/wishlist/wishlistSlice";
import { signout } from "@/redux/athentication/Athentication";
import {
  MdHome,
  MdOutlineAccountCircle,
  MdOutlineAppRegistration,
  MdOutlineLogin,
  MdOutlineShoppingCart,
} from "react-icons/md";
import {
  FaAngleRight,
  FaClipboardList,
  FaExchangeAlt,
  FaTags,
} from "react-icons/fa";
import { LuHeart, LuLogOut, LuUser } from "react-icons/lu";
import {
  AiOutlineAppstore,
  AiOutlineFileProtect,
  AiOutlineFileText,
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiOutlineLink,
  AiOutlinePhone,
  AiOutlineQuestionCircle,
  AiOutlineReload,
  AiOutlineStop,
  AiOutlineUserSwitch,
  AiTwotoneShop,
} from "react-icons/ai";
import Link from "next/link";
import { BsCart3 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import Cartheader from "../Home/Cartheader";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const Header = () => {
  const { current_address } = useSelector((state) => state.Athentication);
  const [isMounted, setIsMounted] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isSearchPage, setIsSearchPage] = useState(false);

  const { CartItems = [] } = useSelector((state) => state.cart) || {};
  const { loginData, isAuth } =
    useSelector((store) => store.Athentication) || {};
  const { items: wishlistItems = [] } =
    useSelector((state) => state.wishlist) || {};
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Refs
  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const cartRef = useRef(null);
  const menuRef = useRef(null);
  const suggestionsRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Utility function to truncate product names
  const truncateProductName = (name, maxLength = 50) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  // Function to extract keyword from URL
  const extractKeywordFromURL = () => {
    if (pathname.includes("/search/")) {
      const pathSegments = pathname.split("/");
      if (pathSegments.length >= 4) {
        return decodeURIComponent(pathSegments[3]);
      }
    }
    return "";
  };

  // Check if we're on a search page
  const checkIfSearchPage = () => {
    const isSearch = pathname.includes("/search/");
    setIsSearchPage(isSearch);
    return isSearch;
  };

  // Handle URL changes and update search state
  useEffect(() => {
    const isSearch = checkIfSearchPage();

    if (isSearch) {
      // We're on a search page - get keyword from URL
      const keyword = extractKeywordFromURL();
      if (keyword) {
        setSearchQuery(keyword);
      }
    } else {
      // We're NOT on a search page - clear search
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightedIndex(-1);

      // Clear any pending debounce timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        setDebounceTimeout(null);
      }
    }
  }, [pathname]);

  // Handle initial mount and browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const isSearch = checkIfSearchPage();

      if (isSearch) {
        const keyword = extractKeywordFromURL();
        if (keyword) {
          setSearchQuery(keyword);
        }
      } else {
        setSearchQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Initial setup
    const isSearch = checkIfSearchPage();
    if (isSearch) {
      const keyword = extractKeywordFromURL();
      if (keyword) {
        setSearchQuery(keyword);
      }
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  const handleLogout = () => {
    dispatch(signout());
    closeAllModals();
    router.push("/login");
  };

  const accountMenu =
    isAuth && loginData
      ? [
          {
            label: "My Account",
            icon: <MdOutlineAccountCircle />,
            path: "/accounts/profile",
          },
          {
            label: "Orders",
            icon: <FaClipboardList />,
            path: "/accounts/orders",
          },
          { label: "Coupons", icon: <FaTags />, path: "/accounts/coupons" },
          { label: "Wishlist", icon: <LuHeart />, path: "/accounts/wishlist" },
          { label: "Logout", icon: <LuLogOut />, onClick: handleLogout },
        ]
      : [
          { label: "Sign In", icon: <MdOutlineLogin />, path: "/login" },
          {
            label: "Register",
            icon: <MdOutlineAppRegistration />,
            path: "/register-page",
          },
        ];

  const sideMenu = [
    { label: "Home", icon: <AiOutlineHome />, path: "/" },
    { label: "Categories", icon: <AiOutlineAppstore />, path: "/category" },
    ...(isAuth
      ? [
          { label: "Wishlist", icon: <LuHeart />, path: "/accounts/wishlist" },
          {
            label: "Orders",
            icon: <FaClipboardList />,
            path: "/accounts/orders",
          },
          { label: "Coupons", icon: <FaTags />, path: "/accounts/coupons" },
          {
            label: "My Account",
            icon: <MdOutlineAccountCircle />,
            path: "/accounts",
          },
          {
            label: "Seller",
            icon: <AiTwotoneShop />,
            path: "https://seller.ewshopping.com/",
          },
          { label: "Logout", icon: <LuLogOut />, onClick: handleLogout },
        ]
      : [
          { label: "Sign In", icon: <MdOutlineLogin />, path: "/login" },
          {
            label: "Register",
            icon: <MdOutlineAppRegistration />,
            path: "/register-page",
          },
        ]),
    {
      label: "Privacy Policy",
      icon: <AiOutlineFileProtect />,
      path: "/privacypolicy",
    },
    {
      label: "About Us",
      icon: <AiOutlineInfoCircle />,
      path: "/aboutus",
    },
    {
      label: "Terms & Conditions",
      icon: <AiOutlineFileText />,
      path: "/termsandcondition",
    },
    {
      label: "Refund Policy",
      icon: <AiOutlineReload />,
      path: "/refundpolicy",
    },
    {
      label: "FAQ",
      icon: <AiOutlineQuestionCircle />,
      path: "/faq",
    },
    {
      label: "Contact Us",
      icon: <AiOutlinePhone />,
      path: "/contactus",
    },
    {
      label: "Cancellation Policy",
      icon: <AiOutlineStop />,
      path: "/cancellationpolicy",
    },
    {
      label: "Exchange Policy",
      icon: <FaExchangeAlt />,
      path: "/exchangepolicy",
    },
    {
      label: "Career",
      icon: <AiOutlineUserSwitch />,
      path: "/career",
    },
    {
      label: "Affiliate",
      icon: <AiOutlineLink />,
      path: "/affilliate",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handelLogin = () => {
    if (loginData) {
      router.push("/accounts/address");
    } else {
      router.push("/login");
    }
  };

  const renderLocationSection = () => {
    const addresses = loginData?.Addresses || [];

    return (
      <div className="flex items-center gap-2 w-full px-2 -mt-2">
        <div
          className="flex items-center justify-between flex-1 min-w-0 cursor-pointer select-none"
          onClick={handelLogin}
        >
          {isMounted && current_address ? (
            <div className="flex flex-row items-center gap-2 flex-1 min-w-0 select-none">
              <span className="text-blue-700 text-[14px] font-medium flex flex-row items-center select-none bg-blue-100 px-2 py-1 rounded-full">
                {current_address.Type.toUpperCase()}
              </span>
              <span className="text-slate-800 truncate text-[14px] flex flex-row items-center select-none">
                {current_address.HNo}, {current_address.Area},{" "}
                {current_address.City}{" "}
                <FaAngleRight className="ml-1 text-blue-600" />
              </span>
            </div>
          ) : !isMounted ? (
            <div className="flex flex-row items-center gap-2 flex-1 min-w-0">
              <div className="animate-pulse bg-gray-300 h-6 w-16 rounded-full flex items-center">
                <div className="bg-gray-400 h-3 w-10 mx-auto rounded"></div>
              </div>
              <div className="animate-pulse bg-gray-300 h-6 w-40 rounded-lg flex items-center">
                <div className="bg-gray-400 h-3 w-32 mx-2 rounded"></div>
              </div>
            </div>
          ) : (
            <span className="text-white font-medium text-sm flex flex-row items-center select-none bg-blue-600 px-3 py-1 rounded-lg border border-blue-700">
              Set delivery location <FaAngleRight className="ml-1 text-white" />
            </span>
          )}
        </div>
      </div>
    );
  };

  // Close all modals
  const closeAllModals = () => {
    setActiveModal(null);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  // Toggle modal
  const toggleModal = (modalName) => {
    setActiveModal(activeModal === modalName ? null : modalName);
  };

  useEffect(() => {
    if (isAuth && loginData?._id) {
      dispatch(fetchUserWishlist(loginData._id));
    }
  }, [isAuth, loginData?._id, dispatch]);

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
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
        const suggestionsData = data.success ? data.suggestions || [] : [];
        setSuggestions(suggestionsData);
        setShowSuggestions(suggestionsData.length > 0);
        setHighlightedIndex(-1); // Reset to -1, don't auto-select first item
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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setHighlightedIndex(-1); // Reset to -1 when typing

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateToSearch();
    }
  };

  // Always use "all" as the category for typed searches
  const navigateToSearch = () => {
    if (searchQuery.trim()) {
      const encodedKeyword = encodeURIComponent(searchQuery.trim());
      router.push(`/search/all/${encodedKeyword}`);
      closeAllModals();
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click with CategoryTagUrl
  const handleSuggestionClick = (suggestion) => {
    const keyword = suggestion.keyword || suggestion.name;
    setSearchQuery(keyword);
    setShowSuggestions(false);
    
    // Use the suggestion's CategoryTagUrl if available, otherwise use "all"
    const categoryTag = suggestion.CategoryTagUrl || "all";
    router.push(`/search/${categoryTag}/${encodeURIComponent(keyword)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    
    e.preventDefault();

    // If user clicked on a suggestion with mouse, highlightedIndex will be set
    // If user is just typing and pressing Enter, highlightedIndex will be -1
    const keyword =
      highlightedIndex >= 0 && suggestions[highlightedIndex]
        ? suggestions[highlightedIndex].keyword
        : searchQuery; // Use typed query when no suggestion is selected

    if (!keyword?.trim()) return;

    // Get category for the selected suggestion, otherwise use "all"
    let categoryTag = "all";
    if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      // Use CategoryTagUrl from selected suggestion
      categoryTag = suggestions[highlightedIndex].CategoryTagUrl || "all";
    }

    router.push(`/search/${categoryTag}/${encodeURIComponent(keyword.trim())}`);
    closeAllModals();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const highlightedElement =
        suggestionsRef.current.children[highlightedIndex];
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [highlightedIndex]);

  const handleClickMenu = () => {
    toggleModal("Menu");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  useEffect(() => {
    const handleClickOutsideAccount = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setActiveModal(null);
      }
    };

    if (activeModal === "Account") {
      document.addEventListener("mousedown", handleClickOutsideAccount);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAccount);
    };
  }, [activeModal]);

  return (
    <header className="fixed top-0 shadow-md z-[999] w-full py-3 px-4 sm:px-6 bg-gradient-to-r from-[#E30047] via-[#E30047] to-[#E30047] border-b border-gray-200 text-white">
      <div className="flex flex-row justify-between gap-4 sm:gap-6 items-center">
        {/* Logo */}
        <Link href="/" className="hidden sm:block md:w-[20vw] lg:w-[30vw]">
          <div className="md:block lg:hidden h-8">
            <img
              src="https://ewshoppingsellerapinew.dexterous.in/uploads/1764821273983.webp"
              alt="Logo Small"
              className="w-full h-8 object-contain"
            />
          </div>
          <div className="hidden lg:block">
            <img
              src="https://ewshoppingsellerapinew.dexterous.in/uploads/1764821273983.webp"
              alt="Logo Large"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        {/* Search */}
        <div className="w-full relative z-[50]" ref={searchRef}>
          <div className="hidden md:block lg:block">
            <div className="relative search-container no-scrollbar">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex flex-row gap-3 items-center no-scrollbar rounded-lg w-full bg-gray-100 px-4 py-2.5 border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                  <IoSearch size={18} className="text-gray-600" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for products and more..."
                    className="w-full outline-0 text-sm text-gray-800 font-medium bg-transparent placeholder-gray-500"
                    onFocus={() => {
                      if (
                        searchQuery.trim().length >= 2 &&
                        suggestions.length > 0
                      ) {
                        setShowSuggestions(true);
                      }
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Clear search"
                    >
                      {/* <IoClose size={16} /> */}
                    </button>
                  )}
                </div>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div
                  className="absolute top-full left-0 right-0 no-scrollbar bg-white shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto rounded-lg mt-1"
                  ref={suggestionsRef}
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm">Searching...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div>
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={suggestion._id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                            index === highlightedIndex
                              ? "bg-blue-50 border-l-4 border-l-blue-500"
                              : ""
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                        >
                          <div className="flex items-center">
                            {suggestion.image && (
                              <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-gray-100">
                                <img
                                  src={suggestion.image}
                                  alt={suggestion.keyword}
                                  loading="lazy"
                                  className="rounded-lg object-contain w-full h-full"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-800">
                                  {truncateProductName(suggestion.keyword, 50)}
                                </span>
                                {suggestion.CategoryTag && (
                                  <span className="text-xs text-gray-500 ml-2">
                                    in {suggestion.CategoryTag}
                                  </span>
                                )}
                              </div>
                              {suggestion.CategoryTagUrl && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Category: {suggestion.CategoryTagUrl}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div
                        className="p-3 bg-gray-50 cursor-pointer font-medium text-center text-blue-600 border-t border-gray-200 hover:bg-gray-100 transition-colors"
                        onClick={() => navigateToSearch()}
                      >
                        View all results for "{searchQuery}"
                      </div>
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-4 text-center text-gray-600 text-sm">
                      No results found for "{searchQuery}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Header Section */}
          <div className="md:hidden w-full flex flex-col gap-3">
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobile Menu */}
                <div className="lg:hidden block" ref={menuRef}>
                  <button
                    className="text-white hover:text-blue-200 transition-colors duration-200 rounded-lg hover:bg-[#ffffff20] flex items-center p-2"
                    aria-label="Menu"
                    onClick={handleClickMenu}
                  >
                    <GiHamburgerMenu className="text-xl text-white" />
                  </button>
                </div>
                <Link href={"/"}>
                  <div className="flex items-center gap-2">
                    <p className="text-lg text-white leading-none font-semibold">
                      EWShopping
                    </p>
                  </div>
                </Link>
              </div>
              <div className="flex flex-row items-center gap-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.ewsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#ffffff20] rounded-lg p-2 hover:bg-[#ffffff30] transition-colors duration-300"
                >
                  <IoLogoGooglePlaystore className="text-lg text-white" />
                </a>
                <div
                  className="flex flex-row items-center relative text-center p-2 bg-[#ffffff20] rounded-lg hover:bg-[#ffffff30] transition-colors duration-300 cursor-pointer"
                  onClick={() => setActiveModal("Cart")}
                >
                  <MdOutlineShoppingCart className="text-lg text-white" />
                  <span
                    className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                      isMounted && CartItems.length > 0
                        ? "bg-blue-600 shadow-sm"
                        : "bg-gray-400"
                    }`}
                  >
                    {isMounted ? CartItems.length || 0 : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            {renderLocationSection()}

            {/* Mobile Search - Always empty unless on search page */}
            <div
              className="block md:hidden lg:hidden"
              onClick={() => {
                // If already on search page, just focus on search
                if (pathname.includes("/search/")) {
                  return;
                }
                router.push("/searchmobile");
              }}
            >
              <div className="flex flex-row gap-2 items-center rounded-lg w-full bg-[#ffffff20] px-4 py-2.5 cursor-pointer border border-[#ffffff30]">
                <IoSearch size={18} className="text-white" />
                <input
                  type="search"
                  value={isSearchPage ? searchQuery : ""}
                  placeholder="Search for products and more..."
                  className="w-full outline-0 text-sm bg-transparent text-white placeholder-white font-medium cursor-pointer"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Menu */}
        <div className="md:w-[20vw] lg:w-[70vw] flex flex-row items-center justify-end md:justify-evenly gap-3">
          {/* Account */}
          {isMounted && (
            <div
              className="relative md:hidden lg:block hidden"
              onMouseEnter={() => setActiveModal("Account")}
              onMouseLeave={() => setActiveModal(null)}
              ref={accountRef}
            >
              <button
                onMouseEnter={() => setActiveModal("Account")}
                className="gap-1 flex items-center 
             p-2 rounded-lg
             text-white
             transition-all duration-200
             hover:scale-[1.06]
             hover:text-white
             hover:bg-[#ffffff20]"
                aria-label="Account"
              >
                <LuUser className="text-xl text-white transition-all duration-200" />

                <span className="text-sm font-medium hidden lg:block text-white transition-all duration-200">
                  {isAuth ? ` ${loginData?.Name?.split(" ")[0]}` : " Login"}
                </span>
              </button>

              {activeModal === "Account" && (
                <div
                  onMouseLeave={() => setActiveModal(null)}
                  className="absolute mt-1 w-48 bg-white shadow-lg rounded-lg z-[30] overflow-hidden border border-gray-200"
                >
                  {accountMenu.map((item, idx) =>
                    item.path ? (
                      <Link
                        key={idx}
                        href={item.path}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="text-gray-600">{item.icon}</div>
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                      </Link>
                    ) : (
                      <button
                        key={idx}
                        onClick={item.onClick}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                      >
                        <div className="text-gray-600">{item.icon}</div>
                        <span className="font-medium text-sm">
                          {item.label}
                        </span>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          <div className="sm:block hidden">
            <Link
              href="/accounts/wishlist"
              className="relative gap-1 flex items-center 
               p-2 rounded-lg
               text-white
               transition-all duration-200
               hover:scale-[1.06]
               hover:text-white
               hover:bg-[#ffffff20]"
              aria-label="Wishlist"
            >
              <LuHeart className="text-xl text-white transition-all duration-200" />

              <span
                className="absolute -top-1 -right-1 bg-white text-black 
                     text-xs rounded-full min-w-[18px] h-[18px] 
                     flex items-center justify-center font-semibold 
                     border-2 border-white transition-all duration-200"
              >
                {isMounted ? wishlistItems.length : 0}
              </span>

              <span
                className="text-sm font-medium hidden lg:block text-white
                     transition-all duration-200"
              >
                Wishlist
              </span>
            </Link>
          </div>

          {/* Cart */}
          <div className="sm:block hidden" ref={cartRef}>
            <button
              className="relative gap-1 flex items-center 
               p-2 rounded-lg
               text-white
               transition-all duration-200
               hover:scale-[1.06]
               hover:text-white
               hover:bg-[#ffffff20]"
              aria-label="Shopping Cart"
              onClick={() => toggleModal("Cart")}
            >
              <BsCart3 className="text-xl text-white transition-all duration-200" />

              <span
                className="absolute -top-1 -right-1 bg-white text-black 
                     text-xs rounded-full min-w-[18px] h-[18px] 
                     flex items-center justify-center font-semibold 
                     border-2 border-white transition-all duration-200"
              >
                {isMounted ? CartItems.length : 0}
              </span>

              <span
                className="text-sm font-medium hidden lg:block text-white
                     transition-all duration-200"
              >
                Cart
              </span>
            </button>
          </div>

          {/* Seller */}
          <div className="md:hidden lg:block hidden">
            <a
              href="https://seller.ewshopping.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1 text-white flex items-center
               p-2 rounded-lg
               transition-all duration-200
               hover:scale-[1.06]
               hover:text-white
               hover:bg-[#ffffff20]"
              aria-label="Seller"
            >
              <AiTwotoneShop className="text-xl text-white transition-all duration-200" />

              <span
                className="text-sm font-medium hidden lg:block text-white 
                     transition-all duration-200"
              >
                Seller
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <Cartheader
        isCartOpen={activeModal === "Cart"}
        cartItems={CartItems}
        closeCart={() => setActiveModal(null)}
      />

      {/* Mobile Sidebar Menu */}
      {activeModal === "Menu" && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] w-full flex justify-start"
          onClick={closeAllModals}
        >
          <div
            className="w-80 bg-white h-full shadow-xl p-4 flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
            ref={mobileMenuRef}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
              onClick={closeAllModals}
              aria-label="Close menu"
            >
              <IoClose size={20} />
            </button>

            {/* Logo & Profile */}
            <div className="flex flex-col items-center border-b border-gray-200 pb-4 mb-4 mt-8">
              <div className="w-16 h-16 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
                {isMounted && isAuth ? loginData?.Name?.charAt(0) : ""}
              </div>
              <span className="mt-3 font-semibold text-gray-800 text-lg">
                {isMounted && isAuth
                  ? `Hello, ${loginData?.Name}`
                  : "Hello, Guest"}
              </span>
              <p className="text-blue-600 text-sm mt-1">
                {isMounted && isAuth
                  ? "Welcome back!"
                  : "Sign in for better experience"}
              </p>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar flex-1">
              {sideMenu.map((item, idx) =>
                item.path ? (
                  <Link
                    key={idx}
                    href={item.path}
                    className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    onClick={closeAllModals}
                  >
                    <div className="text-gray-600 text-lg">{item.icon}</div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      closeAllModals();
                    }}
                    className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 text-left"
                  >
                    <div className="text-gray-600 text-lg">{item.icon}</div>
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;