"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { LuUser, LuHeart } from "react-icons/lu";
import { BsCart3 } from "react-icons/bs";
import { MdOutlineMenu, MdClose } from "react-icons/md";
import Cartheader from "../Home/Cartheader";
import { FiUser, FiLogIn, FiLogOut, FiHeart, FiRepeat } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchUserWishlist } from "../../redux/wishlist/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";

const Header = () => {
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { loginData, otp, mob, isAuth } = useSelector((store) => store.Athentication);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const accountRef = useRef(null);
  const searchRef = useRef(null);
  const accountTimeoutRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch()

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Women Sandals",
      variant: "Black / XL",
      price: 54.0,
      image: "/assets/images/products/cart-product-img1.jpg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Sleeve Round T-Shirt",
      variant: "Yellow / M",
      price: 99.0,
      oldPrice: 114.0,
      image: "/assets/images/products/cart-product-img2.jpg",
      quantity: 1,
    },
  ]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = 2;

  const handleClickOutside = useCallback((event) => {
    if (accountRef.current && !accountRef.current.contains(event.target)) {
      setIsAccountOpen(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsSearchOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (accountTimeoutRef.current) {
        clearTimeout(accountTimeoutRef.current);
      }
    };
  }, [handleClickOutside]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  const toggleAccount = () => {
    setIsAccountOpen(!isAccountOpen);
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsCartOpen(false);
    setIsAccountOpen(false);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsCartOpen(false);
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeAll = () => {
    setIsCartOpen(false);
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleAccountMouseEnter = () => {
    if (window.innerWidth >= 890) {
      if (accountTimeoutRef.current) {
        clearTimeout(accountTimeoutRef.current);
      }
      setIsAccountOpen(true);
    }
  };

  const handleAccountMouseLeave = () => {
    if (window.innerWidth >= 890) {
      accountTimeoutRef.current = setTimeout(() => {
        setIsAccountOpen(false);
      }, 200);
    }
  };
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isAuth && loginData?._id) {
      dispatch(fetchUserWishlist(loginData._id));
    }
  }, [isAuth, loginData?._id, dispatch]);
  return (
    <div className="sticky top-0 z-[999] w-full h-12 ">
      {/* <Marquee /> */}
      <header className="sticky top-0 z-50 bg-white shadow-lg shadow-gray-200/50">
        <div className="w-full min-h-[40px] flex flex-row justify-between items-center px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/assets/images/ew-rbg.png"
              className="w-40 h-10 xs:w-28 xs:h-7 sm:w-32 sm:h-8 md:w-36 md:h-9 lg:w-40 lg:h-10 xl:w-44 xl:h-11 2xl:w-48 2xl:h-12 object-fill"
              loading="lazy"
              alt="Logo"
            />
          </div>

          {/* Navigation Links */}
          <nav className="hidden min-[890px]:flex flex-row gap-2 lg:gap-4 xl:gap-6 2xl:gap-8 text-sm lg:text-base font-medium text-gray-700 flex-1 justify-center">
            <Link
              href="#"
              className="relative hover:text-gray-900 transition-all duration-200 whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-50 group"
              aria-label="Mobile & Accessories"
            >
              Mobile & Accessories
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#2f415d] transition-all duration-300 group-hover:w-4/5 transform -translate-x-1/2"></span>
            </Link>
            <Link
              href="#"
              className="relative hover:text-gray-900 transition-all duration-200 whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-50 group"
              aria-label="Men's Footwear"
            >
              Men's Footwear
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#2f415d] transition-all duration-300 group-hover:w-4/5 transform -translate-x-1/2"></span>
            </Link>
            <Link
              href="#"
              className="relative hover:text-gray-900 transition-all duration-200 whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-50 group"
              aria-label="Women's Footwear"
            >
              Women's Footwear
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#2f415d] transition-all duration-300 group-hover:w-4/5 transform -translate-x-1/2"></span>
            </Link>
            <Link
              href="#"
              className="relative hover:text-gray-900 transition-all duration-200 whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-50 group"
              aria-label="Kids"
            >
              Kids
              <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[#2f415d] transition-all duration-300 group-hover:w-4/5 transform -translate-x-1/2"></span>
            </Link>
          </nav>

          {/* Icons Section */}
          <div className="flex flex-row items-center justify-end sm:gap-2 md:gap-3 lg:gap-4 flex-shrink-0">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => router.push("/searchmobile")}
                className=" min-[500px]:flex text-gray-700 hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95"
                aria-label="Search"
              >
                <IoSearchOutline className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* Account */}
            <div
              className="relative group"
              ref={accountRef}
              onMouseEnter={handleAccountMouseEnter}
              onMouseLeave={handleAccountMouseLeave}
            >
              <button
                onClick={toggleAccount}
                className="text-gray-700 hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
                aria-label="Account"
                aria-expanded={isAccountOpen}
              >
                <LuUser className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div
                className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 transform transition-all duration-200 ease-out ${isAccountOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
                  }`}
                aria-hidden={!isAccountOpen}
              >
                <div className="absolute -top-2 right-5 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                <div className="py-2">
                  <Link
                    href="/login"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 hover:translate-x-1"
                    onClick={closeAll}
                  >
                    <FiLogIn className="mr-3 w-4 h-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 hover:translate-x-1"
                    onClick={closeAll}
                  >
                    <FiUser className="mr-3 w-4 h-4" />
                    Register
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 hover:translate-x-1"
                    onClick={closeAll}
                  >
                    <FiUser className="mr-3 w-4 h-4" />
                    My Account
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 hover:translate-x-1"
                    onClick={closeAll}
                  >
                    <FiHeart className="mr-3 w-4 h-4" />
                    Wishlist
                  </Link>
                  <Link
                    href="/compare"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 hover:translate-x-1"
                    onClick={closeAll}
                  >
                    <FiRepeat className="mr-3 w-4 h-4" />
                    Compare
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <Link
                    href="/login"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-all duration-150 hover:translate-x-1"
                    onClick={closeAll}
                  >
                    <FiLogOut className="mr-3 w-4 h-4" />
                    Sign out
                  </Link>
                </div>
              </div>
            </div>

            {/* Wishlist */}
            <div className="relative hidden sm:block">
              <Link
                href="/wishlist"
                className="text-gray-700 hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
                aria-label="Wishlist"
              >
                <LuHeart className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute -top-[1px] -right-[1px] bg-[#2f415d] text-white text-[10px] sm:text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold border-2 border-white shadow-lg">
                  {/* {wishlistCount} */}
                  {isMounted ? (wishlistItems.length > 0 ? wishlistItems.length : 0) : 0}
                </span>
              </Link>
            </div>

            {/* Cart */}
            <div className="relative">
              <button
                onClick={toggleCart}
                className="text-gray-700 hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
                aria-label="Shopping Cart"
                aria-expanded={isCartOpen}
              >
                <BsCart3 className="w-5 h-5 md:w-6 md:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-[1px] -right-[1px] bg-[#2f415d] text-white text-[10px] sm:text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold border-2 border-white shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            <div className="min-[890px]:hidden ">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-gray-900 transition-all duration-200  rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95"
                aria-label="Menu"
                aria-expanded={isMobileMenuOpen}
              >
                {!isMobileMenuOpen ? (
                  <div>
                    <MdOutlineMenu className="w-10 h-7 mt-1" />
                  </div>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`min-[890px]:hidden fixed inset-0 z-[999] bg-white transition-transform duration-300 ease-in-out ${isMobileMenuOpen
          ? "transform translate-x-0"
          : "transform translate-x-full"
          }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="h-full overflow-hidden ">
          <div className="px-4 h-full py-2 space-y-1">
            <div className="flex flex-row justify-between mt-4">
              <span className="text-[1rem]">Menu</span>
              <MdClose
                className="w-6 h-6"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
            <div>
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Categories
              </h3>
              <Link
                href="/mobile-accessories"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:translate-x-1 active:scale-95 text-base font-medium"
                onClick={closeAll}
              >
                Mobile & Accessories
              </Link>
              <Link
                href="/mens-footwear"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:translate-x-1 active:scale-95 text-base font-medium"
                onClick={closeAll}
              >
                Men's Footwear
              </Link>
              <Link
                href="/womens-footwear"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:translate-x-1 active:scale-95 text-base font-medium"
                onClick={closeAll}
              >
                Women's Footwear
              </Link>
              <Link
                href="/kids"
                className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 hover:translate-x-1 active:scale-95 text-base font-medium"
                onClick={closeAll}
              >
                Kids
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(isMobileMenuOpen || isAccountOpen || isSearchOpen) && (
        <div
          className="fixed inset-0 bg-black/25 z-20 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeAll}
          aria-hidden="true"
        />
      )}

      {/* Cart */}
      <Cartheader
        isCartOpen={isCartOpen}
        cartItems={cartItems}
        closeCart={closeAll}
      />
    </div>
  );
};

export default Header;
