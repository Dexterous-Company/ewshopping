"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWishlist } from "@/redux/wishlist/wishlistSlice";
import { signout } from "@/redux/athentication/Athentication";
import { MdOutlineAccountCircle, MdOutlineAppRegistration, MdOutlineLogin } from "react-icons/md";
import { FaClipboardList, FaTags } from "react-icons/fa";
import { LuHeart, LuLogOut, LuUser } from "react-icons/lu";
import { AiOutlineAppstore, AiOutlineHome, AiTwotoneShop } from "react-icons/ai";
import Link from "next/link";
import { BsCart3 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import Cartheader from "../Home/Cartheader";

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Track highlighted suggestion
  const { CartItems = [] } = useSelector((state) => state.cart) || {};
  const { loginData, isAuth } =
    useSelector((store) => store.Athentication) || {};
  const { items: wishlistItems = [] } =
    useSelector((state) => state.wishlist) || {};
  const dispatch = useDispatch();
  const router = useRouter();

  // Refs
  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const cartRef = useRef(null);
  const menuRef = useRef(null);
  const suggestionsRef = useRef(null);

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
            path: "/register",
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
            path: "/register",
          },
        ]),
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        activeModal === "Search" &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        closeAllModals();
      }
      if (
        activeModal === "Account" &&
        accountRef.current &&
        !accountRef.current.contains(e.target)
      ) {
        closeAllModals();
      }
      if (
        activeModal === "Cart" &&
        cartRef.current &&
        !cartRef.current.contains(e.target)
      ) {
        closeAllModals();
      }
      if (
        activeModal === "Menu" &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        closeAllModals();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeModal]);

  useEffect(() => {
    if (isAuth && loginData?._id) {
      dispatch(fetchUserWishlist(loginData._id));
    }
  }, [isAuth, loginData?._id, dispatch]);

  // Debounced API call
  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${Baseurl}/api/v1/categorytag/autocomplete/simple?q=${encodeURIComponent(
          query
        )}&limit=8`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
        setHighlightedIndex(0); // Highlight first suggestion by default
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setHighlightedIndex(-1); // Reset highlight when typing

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

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    navigateToSearch();
  };

  const navigateToSearch = () => {
    if (searchQuery.trim()) {
      router.push(
        `/searchresults?categoryTag=${encodeURIComponent(searchQuery.trim())}`
      );
      closeAllModals();
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          // Navigate to highlighted suggestion
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          // Navigate to search results
          navigateToSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    router.push(
      `/searchresults?categoryTag=${encodeURIComponent(suggestion.name)}`
    );
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

  return (
    <header className="sticky top-0 shadow-md z-[999] w-full bg-white py-3 sm:py-2 px-2 sm:px-5">
      <div className="flex flex-row justify-between gap-3 sm:gap-7 items-center">
        {/* Logo */}
        <Link href="/" className="hidden sm:block md:w-[20vw] lg:w-[40vw]">
          <div className="md:block lg:hidden h-10">
            <img
              src="/Logoe.png"
              alt="Logo Small"
              className="w-full h-10 object-contain"
            />
          </div>
          <div className="hidden lg:block h-10">
            <img
              src="/largelogo.png"
              alt="Logo Large"
              className="w-full h-10 object-contain"
            />
          </div>
        </Link>

        {/* Search */}
        <div className="w-full relative z-[50]" ref={searchRef}>
          <div className="hidden md:block lg:block">
            <div className="relative search-container no-scrollbar">
              <form onSubmit={handleSearch} className="relative">
                <div className="sm:py-2 py-3 flex flex-row gap-2 items-center no-scrollbar rounded-[8px] w-full bg-blue-100/40 px-4">
                  <IoSearch size={20} className="text-gray-500" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for product tag, brand, and more..."
                    className="w-full outline-0 text-sm sm:text-base bg-transparent"
                    onFocus={() => setShowSuggestions(searchQuery.length >= 2)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <IoClose size={20} />
                    </button>
                  )}
                </div>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div
                  className="absolute top-full left-0 right-0 no-scrollbar bg-white shadow-lg z-50 max-h-90 overflow-y-auto"
                  ref={suggestionsRef}
                >
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2">Searching...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div>
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={suggestion.id || suggestion._id}
                          className={`p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            index === highlightedIndex ? "bg-blue-100" : ""
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                        >
                          <div className="flex items-center">
                            {suggestion.mobileImage && (
                              <div className="flex items-center justify-center w-12 h-12 mr-3 ">
                                <img
                                  src={suggestion.mobileImage}
                                  alt={suggestion.name}
                                  loading="lazy"
                                  className="rounded-full object-contain h-48 w-48"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-800">
                                  {suggestion.name}
                                </span>
                              </div>

                              {suggestion.category && (
                                <p className="text-sm text-gray-600 mt-1">
                                  in {suggestion.category}
                                  {suggestion.subCategory &&
                                    ` › ${suggestion.subCategory}`}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div
                        className="p-3 hover:bg-blue-50 cursor-pointer border-t border-gray-200 font-medium text-center text-blue-600"
                        onClick={navigateToSearch}
                      >
                        View all results for "{searchQuery}"
                      </div>
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-4 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Mobile search remains the same */}
        </div>
        {/* Right Menu */}
        <div className="md:w-[20vw] lg:w-[70vw] flex flex-row items-center justify-end md:justify-evenly gap-2">
          {/* Account - Only render when mounted */}
          {isMounted && (
            <div
              className="relative md:hidden lg:block hidden"
              ref={accountRef}
            >
              <button
                onMouseEnter={() => setActiveModal("Account")}
                className="text-gray-700 gap-1 flex-row relative hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
                aria-label="Account"
              >
                <LuUser className="text-2xl mb-1" />
                <span className="text-[1rem] font-medium hidden lg:block">
                  {isAuth ? `${loginData?.Name?.split(" ")[0]}` : "Login"}
                </span>
              </button>

              {activeModal === "Account" && (
                <div
                  onMouseLeave={closeAllModals}
                  className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg z-[30] overflow-hidden"
                >
                  {accountMenu.map((item, idx) =>
                    item.path ? (
                      <Link
                        key={idx}
                        href={item.path}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all"
                        onClick={closeAllModals}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        key={idx}
                        onClick={item.onClick}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all text-left"
                      >
                        {item.icon}
                        <span>{item.label}</span>
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
              className="text-gray-700 relative gap-2 hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
              aria-label="Wishlist"
            >
              <LuHeart className="text-xl" />
              <span className="absolute -top-[.5px] left-5 gap-2 bg-[#2f415d] text-white text-[10px] sm:text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold border-2 border-white shadow-lg">
                {isMounted ? wishlistItems.length : 0}
              </span>
              <span className="text-[1rem] font-medium hidden lg:block">
                Wishlist
              </span>
            </Link>
          </div>

          {/* Cart with safe count display */}
          <div className="sm:block hidden" ref={cartRef}>
            <button
              className="text-gray-700 relative gap-2 hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
              aria-label="Shopping Cart"
              onClick={() => toggleModal("Cart")}
            >
              <BsCart3 className="text-xl" />
              <span className="absolute -top-[.5px] left-5 bg-[#2f415d] text-white text-[10px] sm:text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold border-2 border-white shadow-lg">
                {isMounted ? CartItems.length : 0}
              </span>
              <span className="text-[1rem] font-medium hidden lg:block">
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
              className="text-gray-700 gap-1 flex-row relative hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
              aria-label="Seller"
            >
              <AiTwotoneShop className="text-xl sm:hidden md:hidden lg:block" />
              <span className="text-[1rem] font-medium hidden lg:block">
                Seller
              </span>
            </a>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden block" ref={menuRef}>
            <button
              className="text-gray-700 gap-1 flex-row relative hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
              aria-label="Menu"
              onClick={handleClickMenu}
            >
              <GiHamburgerMenu className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      <Cartheader
        isCartOpen={activeModal === "Cart"}
        cartItems={CartItems}
        closeCart={closeAllModals}
      />

      {/* Mobile Sidebar Menu */}
      {activeModal === "Menu" && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] w-full flex justify-start"
          onClick={closeAllModals}
        >
          <div
            className="w-64 bg-white h-full shadow-lg p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            ref={menuRef}
          >
            {/* Logo & Profile */}
            <div className="flex flex-col items-center border-b pb-4 mb-4">
              <div className="w-12 h-12 bg-[#2f415d] text-white flex items-center justify-center rounded-full text-lg font-bold">
                {isMounted && isAuth ? loginData?.Name?.charAt(0) : "G"}
              </div>
              <span className="mt-2 font-semibold">
                {isMounted && isAuth
                  ? `Hello, ${loginData?.Name}`
                  : "Hello, Guest"}
              </span>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-2">
              {sideMenu.map((item, idx) =>
                item.path ? (
                  <Link
                    key={idx}
                    href={item.path}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-all"
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      } else {
                        closeAllModals();
                      }
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={idx}
                    onClick={item.onClick}
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-all text-left"
                  >
                    {item.icon}
                    <span>{item.label}</span>
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
