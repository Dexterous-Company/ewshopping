"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  IoClose,
  IoLocationOutline,
  IoLogoGooglePlaystore,
  IoSearch,
} from "react-icons/io5";
import { useRouter } from "next/navigation";
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
import { FaAngleRight, FaClipboardList, FaTags } from "react-icons/fa";
import { LuHeart, LuLogOut, LuUser } from "react-icons/lu";
import {
  AiOutlineAppstore,
  AiOutlineHome,
  AiTwotoneShop,
} from "react-icons/ai";
import Link from "next/link";
import { BsCart3 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import Cartheader from "../Home/Cartheader";

import { HiOutlineMenu } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { FiPhone } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;
import { Home } from "lucide-react";
import { IoIosArrowBack } from "react-icons/io";

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
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

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
  const mobileMenuRef = useRef(null); // New ref for mobile menu

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
    // const defaultAddress =
    //   addresses.find((addr) => addr.prime === true) || current_address;

    return (
      <div className="flex items-center gap-2 w-full px-2 -mt-2">
        <MdHome className="text-lg text-[#2874f0] shrink-0" />
        <div
          className="flex items-center justify-between flex-1 min-w-0 cursor-pointer select-none"
          onClick={handelLogin}
        >
          {isMounted && current_address ? (
            <div className="flex flex-row items-center gap-2 flex-1 min-w-0 select-none">
              <span className="text-cyan-800 text-[14px]  flex flex-row items-center select-none">
                {current_address.Type.toUpperCase()}
              </span>
              <span className="text-blue-900 truncate text-[14px] flex flex-row items-center select-none">
                {current_address.HNo}, {current_address.Area},{" "}
                {current_address.City} <FaAngleRight />
              </span>
            </div>
          ) : (
            <span className="text-gray-500 font-medium text-sm flex flex-row items-center select-none">
              Set delivery location <FaAngleRight />
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
        const suggestionsData = data.data?.suggestions || [];
        setSuggestions(suggestionsData);
        setShowSuggestions(suggestionsData.length > 0);
        setHighlightedIndex(suggestionsData.length > 0 ? 0 : -1);
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
    setHighlightedIndex(-1);

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
      router.push(`/searchresults?q=${encodeURIComponent(searchQuery.trim())}`);
      closeAllModals();
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        if (!showSuggestions) return;
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        if (!showSuggestions) return;
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (
          showSuggestions &&
          highlightedIndex >= 0 &&
          suggestions[highlightedIndex]
        ) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        } else {
          navigateToSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    router.push(`/searchresults?q=${encodeURIComponent(suggestion.name)}`);
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
    <header className="fixed top-0 shadow-md z-[999] w-full bg-[#fff]  py-2 sm:py-2 px-2 sm:px-20 ">
      <div className="flex flex-row justify-between gap-3 sm:gap-7 items-center w-full">
        {/* Logo */}
        <Link href="/" className="hidden sm:block md:w-[20vw] lg:w-[30vw]">
          <div className="md:block lg:hidden h-10">
            <img
              src="/largelogo.png"
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
                          key={index}
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

          {/* Mobile Header Section */}
          <div className="md:hidden lg:hidden w-full flex flex-col p-1 gap-2">
            {/* Top Row */}
            <div className="flex items-center  justify-between ">
              <div className="flex items-center gap-3">
                <Link href={"/"} className="flex flex-row items-center gap-2">
                  <img
                    src="/Logoe.png"
                    alt="Home"
                    className="h-6 w-10 object-cover rounded-full"
                  />
                  <p
                    className="text-xl text-[#000000] leading-none italic"
                    style={{ fontFamily: "Times New Roman, Times, serif" }}
                  >
                    EWShopping
                  </p>
                </Link>
              </div>

              <div className="flex flex-row items-center gap-2">
                <a
                  href="https://play.google.com/store/apps/details?id=com.ewsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f5f6fb] rounded-lg p-2"
                >
                  <IoLogoGooglePlaystore className="text-xl text-green-600 hover:scale-110 transition-transform duration-200" />
                </a>
                <div
                  className="flex flex-row items-center relative text-center p-2 bg-[#f5f6fb] rounded-lg"
                  onClick={() => setActiveModal("Cart")}
                >
                  <MdOutlineShoppingCart className="text-xl" />
                  <span
                    className={`absolute -top-2 -right-1  text-white text-xs  rounded-full h-4 w-4 flex items-center justify-center  ${
                      isMounted
                        ? CartItems.length > 0
                          ? "bg-blue-950"
                          : null
                        : null
                    }`}
                  >
                    {isMounted
                      ? CartItems.length > 0
                        ? CartItems.length
                        : 0
                      : 0}
                  </span>
                </div>
                {/* Mobile Menu */}
                <div className="lg:hidden block bg-[#f5f6fb] p-2" ref={menuRef}>
                  <button
                    className="text-gray-700 gap-1 flex-row  relative hover:text-gray-900 transition-all duration-200 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
                    aria-label="Menu"
                    onClick={handleClickMenu}
                  >
                    <GiHamburgerMenu className="text-xl" />
                  </button>
                </div>
              </div>
            </div>

            {/* Location */}
            {renderLocationSection()}

            {/* Search */}
            <div
              className="block md:hidden lg:hidden"
              onClick={() => router.push("/searchmobile")}
            >
              <div className="sm:py-2 py-3 flex flex-row gap-2 items-center rounded-[8px] w-full bg-blue-100/40 px-4 cursor-pointer">
                <IoSearch size={20} className="text-gray-500" />
                <input
                  type="search"
                  placeholder="Search for product tag, brand, and more..."
                  className="w-full outline-0 text-sm sm:text-base bg-transparent"
                  readOnly
                />
              </div>
            </div>
            {/* <div className="flex flex-row items-center justify-between w-full gap-2">
              <div className="flex p-3 rounded-xl bg-[#f5f6fb] flex-row justify-between items-center w-full">
                <button
                  onClick={() => window.history.back()}
                  className=" rounded-full hover:bg-gray-200"
                  aria-label="Go back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-800"
                    fill="none"
                    viewBox="0 0 26 26"
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
                <input
                  type="search"
                  placeholder="Search for product tag, brand, and more..."
                  className="w-full outline-0 text-sm sm:text-base bg-transparent"
                  readOnly
                />
                <div className="flex flex-row items-center">
                  <IoSearch size={20} className="text-gray-500" />
                </div>
              </div>

              <div className="flex flex-row items-center relative text-center p-3 rounded-lg bg-[#f5f6fb]">
                <MdOutlineShoppingCart className="text-xl" />
                <span
                  className={`absolute top-0 -right-1 bg-blue-950 text-white text-xs  rounded-full h-4 w-4 flex items-center justify-center  ${
                    CartItems.length > 0 ? "bg-blue-950" : null
                  }`}
                >
                  {isMounted
                    ? CartItems.length > 0
                      ? CartItems.length
                      : 0
                    : 0}
                </span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Menu */}
        <div className="md:w-[20vw] lg:w-[70vw] flex flex-row items-center justify-end md:justify-evenly gap-2">
          {/* Account */}
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
                  onMouseLeave={() => setActiveModal(null)}
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

          {/* Cart */}
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
              className="text-gray-700 gap-1 flex-row relative hover:text-gray-900 select-none transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
              aria-label="Seller"
            >
              <AiTwotoneShop className="text-xl sm:hidden md:hidden lg:block" />
              <span className="text-[1rem] font-medium hidden lg:block">
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
          className="fixed inset-0 bg-black/40 z-[100] w-full flex justify-start"
          onClick={closeAllModals}
        >
          <div
            className="w-64 bg-white h-full shadow-lg p-4 flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
            ref={mobileMenuRef}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeAllModals}
              aria-label="Close menu"
            >
              <IoClose size={24} />
            </button>

            {/* Logo & Profile */}
            <div className="flex flex-col items-center border-b pb-4 mb-4 mt-6">
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
                    onClick={closeAllModals}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      closeAllModals();
                    }}
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
