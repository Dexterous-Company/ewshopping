"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  AiTwotoneShop,
  AiOutlineHome,
  AiOutlineAppstore,
} from "react-icons/ai";
import { BsCart3 } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { LuHeart, LuUser, LuLogOut } from "react-icons/lu";
import {
  MdOutlineLogin,
  MdOutlineAppRegistration,
  MdOutlineAccountCircle,
} from "react-icons/md";
import { FaClipboardList, FaTags } from "react-icons/fa";
import Cartheader from "../Home/Cartheader";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoTrendingUp } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Header = () => {
  const [modelState, setModelState] = useState({ type: null, index: 0 });
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

  const dataItems = [
    {
      ProductTag: "Wireless Earphones",
      Image:
        "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_UF1000,1000_QL80_.jpg",
      brand: "Boat",
    },
    {
      ProductTag: "Smart Watch",
      Image:
        "https://m.media-amazon.com/images/I/61G9VC33fsL._AC_UF1000,1000_QL80_.jpg",
      subcategory: "Wearables",
      brand: "Noise",
    },
    {
      ProductTag: "Running Shoes",
      Image:
        "https://m.media-amazon.com/images/I/71K9JZg6aLL._AC_UF1000,1000_QL80_.jpg",
      subcategory: "Footwear",
      brand: "Puma",
    },
    {
      ProductTag: "Bluetooth Speaker",
      Image:
        "https://m.media-amazon.com/images/I/71Ie3JXGfVL._AC_UF1000,1000_QL80_.jpg",
      subcategory: "Audio",
      brand: "Anker",
    },
    {
      ProductTag: "Backpack",
      Image:
        "https://m.media-amazon.com/images/I/61K5PM+zvKL._AC_UF1000,1000_QL80_.jpg",
      subcategory: "Bags",
      brand: "American Tourister",
    },
    {
      ProductTag: "Wireless Mouse",
      Image:
        "https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_UF1000,1000_QL80_.jpg",
      brand: "Zebronics",
    },
    {
      ProductTag: "T-Shirt",
      Image:
        "https://m.media-amazon.com/images/I/61BE+Q4MwLL._AC_UF1000,1000_QL80_.jpg",
      subcategory: "Clothing",
      brand: "Seven Rocks",
    },
    {
      ProductTag: "Water Bottle",
      Image:
        "https://m.media-amazon.com/images/I/61NB5MINydL._AC_UF1000,1000_QL80_.jpg",
      subcategory: "Kitchen",
      brand: "Milton",
    },
    {
      ProductTag: "Power Bank",
      Image:
        "https://m.media-amazon.com/images/I/61lK8J6yAbL._AC_UF1000,1000_QL80_.jpg",
      subcategory: "Mobile Accessories",
      brand: "Ambrane",
    },
    {
      ProductTag: "Sunglasses",
      Image:
        "https://m.media-amazon.com/images/I/61XDeOOr0KL._AC_UF1000,1000_QL80_.jpg",
      brand: "Viksun",
    },
  ];
  const accountMenu = [
    { label: "Sign In", icon: <MdOutlineLogin /> },
    { label: "Register", icon: <MdOutlineAppRegistration /> },
    { label: "My Account", icon: <MdOutlineAccountCircle /> },
    { label: "Orders", icon: <FaClipboardList /> },
    { label: "Coupons", icon: <FaTags /> },
    { label: "Wishlist", icon: <LuHeart /> },
    { label: "Logout", icon: <LuLogOut /> },
  ];

  const sideMenu = [
    { label: "Home", icon: <AiOutlineHome /> },
    { label: "Categories", icon: <AiOutlineAppstore /> },
    { label: "Wishlist", icon: <LuHeart /> },
    { label: "Orders", icon: <FaClipboardList /> },
    { label: "Coupons", icon: <FaTags /> },
    { label: "My Account", icon: <MdOutlineAccountCircle /> },
    { label: "Seller", icon: <AiTwotoneShop /> },
    { label: "Logout", icon: <LuLogOut /> },
  ];
  const searchRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setModelState({ type: null, index: null });
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);
  const router = useRouter();

  return (
    <header className="sticky top-0 shadow-md z-[999]  w-full bg-white py-3 sm:py-2 px-2 sm:px-5 ">
      <div className="flex flex-row justify-between gap-3 sm:gap-7 items-center">
        {/* Logo */}
        <div className="hidden sm:block md:w-[20vw]  lg:w-[40vw]">
          <div className="md:block lg:hidden h-10">
            <img
              src="/logoe.png"
              alt="Logo Small"
              className="w-full h-10 object-contain"
            />
          </div>
          <div className="hidden lg:block h-10 ">
            <img
              src="/largelogo.png"
              alt="Logo Large"
              className="w-full h-10 object-contain"
            />
          </div>
        </div>

        {/* Search */}
        <div className="w-full relative z-[50] " ref={searchRef}>
          {/* Search box click */}
          <div className="hidden md:block lg:block">
            <div
              className="sm:py-2 py-3 flex flex-row gap-2 items-center rounded-[8px] w-full bg-blue-100/40 px-4 cursor-pointer"
              onClick={() => setModelState({ type: "Search", index: null })}
            >
              <IoSearch size={20} className="text-gray-500" />
              <input
                type="search"
                placeholder="search for product tag, brand, and more ....."
                className="w-full outline-0 text-sm sm:text-base"
              />
            </div>
          </div>
          <div
            className="block md:hidden lg:hidden"
            onClick={() => router.push("/searchmobile")}
          >
            <div className="sm:py-2 py-3 flex flex-row gap-2 items-center rounded-[8px] w-full bg-blue-100/40 px-4 cursor-pointer">
              <IoSearch size={20} className="text-gray-500" />
              <input
                type="search"
                placeholder="search for product tag, brand, and more ....."
                className="w-full outline-0 text-sm sm:text-base"
                readOnly
              />
            </div>
          </div>
          {modelState.type === "Search" && (
            <div
              className="absolute inset-0 z-100 bg-black/30 top-10 w-full"
              onMouseLeave={() => setModelState({ type: null, index: null })}
            >
              <div className="bg-white w-full shadow-xl rounded-md mt-2 px-2 py-1 flex flex-col">
                {/* <span className="text-sm font-medium">Search History</span>
                <div className="flex flex-col gap-2 my-2">
                  {Array(5)
                    .fill("Shirts")
                    .map((item, i) => (
                      <div
                        key={i}
                        className=" px-2 rounded-sm text-sm py-0.5 w-fit"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <IoTrendingUp />
                          <span>{item}</span>
                        </div>
                      </div>
                    ))}
                </div> */}
                <div className="flex flex-col gap-1">
                  {dataItems.map((item, i) => (
                    <div key={i} className="flex flex-row items-center  gap-1">
                      <img
                        src={item.Image}
                        className="h-10 w-10 object-contain"
                        loading="lazy"
                      />
                      <div className="flex flex-col ">
                        <span className="text-xs font-medium">
                          {item.ProductTag}
                        </span>
                        {item?.subcategory?.length > 0 ? (
                          <span className="text-xs font-medium text-[#2f415d]">
                            {item.subcategory}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Menu */}
        <div className="md:w-[20vw] lg:w-[70vw]  flex flex-row items-center justify-end md:justify-evenly gap-2">
          {/* Account */}
          <div className="relative md:hidden lg:block hidden">
            <button
              onMouseEnter={() =>
                setModelState({ type: "Account", index: null })
              }
              className="text-gray-700 gap-1 flex-row relative hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
              aria-label="Account"
            >
              <LuUser className="text-2xl mb-1" />
              <span className="text-[1rem] font-medium hidden lg:block">
                Login
              </span>
            </button>

            {modelState.type === "Account" && (
              <div
                onMouseLeave={() => setModelState({ type: null, index: null })}
                className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg z-[30] overflow-hidden"
              >
                {accountMenu.map((item, idx) => (
                  <button
                    key={idx}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="sm:block hidden">
            <button
              className="text-gray-700 relative gap-2 hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
              aria-label="Wishlist"
            >
              <LuHeart className="text-xl" />
              <span className="absolute -top-[.5px] left-5 gap-2 bg-[#2f415d] text-white text-[10px] sm:text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold border-2 border-white shadow-lg">
                0
              </span>
              <span className="text-[1rem] font-medium hidden lg:block">
                Wishlist
              </span>
            </button>
          </div>

          {/* Cart */}
          <div className="sm:block hidden">
            <button
              className="text-gray-700 relative gap-2 hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
              aria-label="Shopping Cart"
              onClick={() => setModelState({ type: "Cart", index: null })}
            >
              <BsCart3 className="text-xl" />
              <span className="absolute -top-[.5px] left-5 bg-[#2f415d] text-white text-[10px] sm:text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold border-2 border-white shadow-lg">
                0
              </span>
              <span className="text-[1rem] font-medium hidden lg:block">
                Cart
              </span>
            </button>
          </div>

          {/* Seller */}
          <div className="md:hidden lg:block hidden ">
            <button
              className="text-gray-700 gap-1 flex-row relative hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
              aria-label="Seller"
            >
              <AiTwotoneShop className="text-xl sm:hidden md:hidden lg:block" />
              <span className="text-[1rem] font-medium hidden lg:block">
                Seller
              </span>
            </button>
          </div>

          {/* Menu */}
          <div
            className="lg:hidden block "
            onClick={() => setModelState({ type: "Menu", index: null })}
          >
            <button
              className="text-gray-700 gap-1 flex-row relative hover:text-gray-900 transition-all duration-200 p-2 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 flex items-center"
              aria-label="Menu"
            >
              <GiHamburgerMenu className="text-2xl " />
            </button>
          </div>
        </div>
      </div>

      {/* Cart */}
      <Cartheader
        isCartOpen={modelState.type === "Cart"}
        cartItems={cartItems}
        closeCart={(e) => {
          e.stopPropagation();
          setModelState({ type: null, index: null });
        }}
      />
      {/* Sidebar Menu */}
      {modelState.type === "Menu" && (
        <div
          className="fixed inset-0 bg-black/40 z-[100]"
          onClick={() => setModelState({ type: null, index: null })}
        >
          <div
            className="w-64 bg-white h-full shadow-lg p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo & Profile */}
            <div className="flex flex-col items-center border-b pb-4 mb-4">
              {/* <img src="/logo.png" alt="EWShopping" className="h-12 mb-2" /> */}
              <div className="w-12 h-12 bg-[#2f415d] text-white flex items-center justify-center rounded-full text-lg font-bold">
                A
              </div>
              <span className="mt-2 font-semibold">Hello, Alex</span>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-2">
              {sideMenu.map((item, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-all"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
