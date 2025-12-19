"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  AiTwotoneShop,
  AiOutlineHome,
  AiOutlineAppstore,
} from "react-icons/ai";
import { BsCart3 } from "react-icons/bs";
import { IoSearch, IoTrendingUp } from "react-icons/io5";
import { LuHeart, LuUser, LuLogOut } from "react-icons/lu";
import {
  MdOutlineLogin,
  MdOutlineAppRegistration,
  MdOutlineAccountCircle,
} from "react-icons/md";
import { FaClipboardList, FaTags } from "react-icons/fa";
import Cartheader from "../Home/Cartheader";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWishlist } from "@/redux/wishlist/wishlistSlice";
import { signout } from "@/redux/athentication/Athentication";

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { CartItems = [] } = useSelector((state) => state.cart) || {};
  const { loginData, isAuth } =
    useSelector((store) => store.Athentication) || {};
  const { items: wishlistItems = [] } = useSelector((state) => state.wishlist) || {};
  const dispatch = useDispatch();
  const router = useRouter();

  // Refs for click outside detection
  const searchRef = useRef(null);
  const accountRef = useRef(null);
  const cartRef = useRef(null);
  const menuRef = useRef(null);

  const handleLogout = () => {
    dispatch(signout());
    closeAllModals();
    router.push("/login");
  };

  // Dynamic data
  const [trendingSearches] = useState([
    "Wireless Earphones",
    "Smart Watch",
    "Running Shoes",
    "Bluetooth Speaker",
    "Backpack",
    "Wireless Mouse",
    "T-Shirt",
    "Water Bottle",
    "Power Bank",
    "Sunglasses",
  ]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeAllModals();
    }
  };

  // Handle trending search click
  const handleTrendingSearchClick = (searchTerm) => {
    setSearchQuery(searchTerm);
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    closeAllModals();
  };

  const accountMenu =
    isAuth && loginData ? [
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
        // {
        //   label: "My Account",
        //   icon: <MdOutlineAccountCircle />,
        //   path: "/accounts",
        // },
        // {
        //   label: "Orders",
        //   icon: <FaClipboardList />,
        //   path: "/accounts/orders",
        // },
        // { label: "Coupons", icon: <FaTags />, path: "/accounts/coupons" },
        // { label: "Wishlist", icon: <LuHeart />, path: "/accounts/wishlist" },
      ];

  const sideMenu = [
    { label: "Home", icon: <AiOutlineHome />, path: "/" },
    { label: "Categories", icon: <AiOutlineAppstore />, path: "/category" },
    { label: "Wishlist", icon: <LuHeart />, path: "/accounts/wishlist" },
    { label: "Orders", icon: <FaClipboardList />, path: "/accounts/orders" },
    { label: "Coupons", icon: <FaTags />, path: "/accounts/coupons" },
    { label: "My Account", icon: <MdOutlineAccountCircle />, path: "/accounts" },
    { label: "Seller", icon: <AiTwotoneShop />, path: "https://seller.ewshopping.com/" },
    { label: "Logout", icon: <LuLogOut />, path: "/", onClick: handleLogout },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close all modals
  const closeAllModals = (e) => {
    e.stopPropagation();
    setActiveModal(null);
  }

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

  // Fetch wishlist if authenticated
  useEffect(() => {
    if (isAuth && loginData?._id) {
      dispatch(fetchUserWishlist(loginData._id));
    }
  }, [isAuth, loginData?._id, dispatch]);



  const handleClickMenu = () => {
    if (loginData) {
      setActiveModal("Menu")
    } else {
      setActiveModal("null")
      router.push('/login')
    }
  }
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
            <form onSubmit={handleSearch} className="relative">
              <div className="sm:py-2 py-3 flex flex-row gap-2 items-center rounded-[8px] w-full bg-blue-100/40 px-4">
                <IoSearch size={20} className="text-gray-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for product tag, brand, and more..."
                  className="w-full outline-0 text-sm sm:text-base bg-transparent"
                  onFocus={() => setActiveModal("Search")}
                />
              </div>
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 w-0 h-0"
                aria-label="Search"
              />
            </form>
          </div>

          {/* Mobile search */}
          <div
            className="block md:hidden lg:hidden"
            onClick={() => router.push("/searchmobile")}
          >
            <div className="sm:py-2 py-3 flex flex-row gap-2 items-center rounded-[8px] w-full bg-blue-100/40 px-4 cursor-pointer">
              <IoSearch size={20} className="text-gray-500" />
              <input
                type="search"
                placeholder="Search for product tag, brand, and more..."
                className="w-full outline-0 text-sm sm:text-base"
                readOnly
              />
            </div>
          </div>


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
                  {isAuth ? `${loginData?.Name}` : "Login"}
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
              onClick={() => setActiveModal("Cart")}
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
              onClick={() => handleClickMenu()}
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
          className="fixed inset-0 bg-black/40 z-[100]"
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
                {isMounted && isAuth ? `Hello, ${loginData?.Name}` : "Hello, Guest"}
              </span>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-2">
              {sideMenu.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.path}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-all"
                  onClick={(e) => {
                    closeAllModals();
                    if (item.label === "Logout") {
                      e.preventDefault();
                      handleLogout();
                    }
                  }}
                  target={item.label === "Seller" ? "_blank" : "_self"}
                  rel={item.label === "Seller" ? "noopener noreferrer" : ""}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;