"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "@/redux/athentication/Athentication";
import Cartheader from "./Home/Cartheader";

// Lucide React imports
import {
  Home,
  User,
  UserPlus,
  ShoppingCart,
  X,
  Search,
  Menu,
  Play,
  ChevronRight,
  Grid3x3,
  Shield,
  FileText,
  Info,
  Link as LinkIcon,
  Phone,
  HelpCircle,
  RotateCcw,
  Ban,
  Users,
  Heart,
  LogOut,
  List,
  LogOutIcon,
  User2,
  Tag,
  Store,
} from "lucide-react";

const HomeMobileHeader = () => {
  const router = useRouter();
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const mobileMenuRef = useRef();
  const [isScrolled, setIsScrolled] = useState(false);

  const { current_address } = useSelector((state) => state.Athentication);
  const { loginData, isAuth } = useSelector((state) => state.Athentication);
  const { CartItems = [] } = useSelector((state) => state.cart) || {};

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handelLogin = () => {
    if (loginData) {
      router.push("/accounts/address");
    } else {
      router.push("/login");
    }
  };

  const handleLogout = () => {
    dispatch(signout());
    setActiveModal(null);
    router.push("/login");
  };

  const sideMenu = [
    { label: "Home", icon: <Home />, path: "/" },
    { label: "Categories", icon: <Grid3x3 />, path: "/category" },
    ...(isAuth
      ? [
          { label: "Wishlist", icon: <Heart />, path: "/accounts/wishlist" },
          {
            label: "Orders",
            icon: <List />,
            path: "/accounts/orders",
          },
          { label: "Coupons", icon: <Tag />, path: "/accounts/coupons" },
          {
            label: "My Account",
            icon: <User />,
            path: "/accounts",
          },
          {
            label: "Seller",
            icon: <Store />,
            path: "https://seller.ewshopping.com/",
          },
          { label: "Logout", icon: <LogOutIcon />, onClick: handleLogout },
        ]
      : [
          {
            label: "Sign In",
            icon: <User />,
            path: "/login",
          },
          {
            label: "Register",
            icon: <UserPlus />,
            path: "/register-page",
          },
        ]),
    {
      label: "Privacy Policy",
      icon: <Shield />,
      path: "/privacypolicy",
    },
    {
      label: "About Us",
      icon: <Info />,
      path: "/aboutus",
    },
    {
      label: "Terms & Conditions",
      icon: <FileText />,
      path: "/termsandcondition",
    },
    {
      label: "Refund Policy",
      icon: <RotateCcw />,
      path: "/refundpolicy",
    },
    {
      label: "FAQ",
      icon: <HelpCircle />,
      path: "/faq",
    },
    {
      label: "Contact Us",
      icon: <Phone />,
      path: "/contactus",
    },
    {
      label: "Cancellation Policy",
      icon: <Ban />,
      path: "/cancellationpolicy",
    },
    {
      label: "Exchange Policy",
      icon: <RotateCcw />, // Using RotateCcw for exchange as closest match
      path: "/exchangepolicy",
    },
    {
      label: "Career",
      icon: <Users />,
      path: "/carrer",
    },
    {
      label: "Affiliate",
      icon: <LinkIcon />,
      path: "/affilliate",
    },
  ];

  const handleClickMenu = () => {
    setActiveModal(activeModal === "Menu" ? null : "Menu");
  };

  const renderLocationSection = () => {
    return (
      <div className="flex items-center gap-2 w-full px-2 -mt-4">
        <div className="relative">
          <Home className="size-5 text-white shrink-0" />
        </div>
        <div
          className="flex items-center justify-between flex-1 min-w-0 cursor-pointer select-none"
          onClick={handelLogin}
        >
          {isMounted && current_address ? (
            <div className="flex flex-row items-center gap-2 flex-1 min-w-0 select-none">
              <span className="text-white truncate text-[12px] flex flex-row items-center select-none">
                {current_address.HNo}, {current_address.Area},{" "}
                {current_address.City}{" "}
                <ChevronRight className="ml-1 text-white size-4" />
              </span>
            </div>
          ) : (
            <span className="text-white font-medium text-sm flex flex-row items-center select-none">
              Set delivery location <ChevronRight className="ml-1 text-white size-4" />
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ------------------- NON-STICKY HEADER (FIXED) ------------------- */}
      <div
        className="md:hidden lg:hidden w-full flex flex-col gap-2 px-2 bg-[#E30047] shadow-sm transition-all duration-300"
      >
        {/* Top Row */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <div className="lg:hidden block" ref={menuRef}>
              <button
                className="text-white gap-1 flex-row relative hover:text-white/80 transition-all duration-200 rounded-lg hover:bg-white/10 flex items-center p-2"
                aria-label="Menu"
                onClick={handleClickMenu}
              >
                <Menu className="size-5" />
              </button>
            </div>

            <Link href={"/"}>
              <div className="flex items-center gap-2">
                <p
                  className="text-xl text-white leading-none font-bold italic"
                  style={{ fontFamily: "Times New Roman, serif" }}
                >
                  Ewshopping
                </p>
              </div>
            </Link>
          </div>

          <div className="flex flex-row items-center gap-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.ewsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 rounded-lg p-2 hover:bg-white/30 transition-all duration-300"
            >
              <Play className="size-5 text-white" />
            </a>

            <div
              className="flex flex-row items-center relative text-center p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all duration-300 cursor-pointer"
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="size-5 text-white" />
              <span
                className={`absolute -top-2 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
                  isMounted && CartItems.length > 0
                    ? "bg-white/30 border border-white/50"
                    : "bg-white/20"
                }`}
              >
                {isMounted ? CartItems.length || 0 : 0}
              </span>
            </div>
          </div>
        </div>

        {/* Location Section */}
        {renderLocationSection()}
      </div>

      {/* ------------------- STICKY SEARCH BAR (ONLY THIS IS FIXED) ------------------- */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-[#E30047] shadow-lg border-b border-white/20 fixed top-0 z-[99999] w-full"
            : "bg-[#E30047] shadow-sm w-full"
        }`}
      >
        <div
          className="block md:hidden lg:hidden px-4 py-2"
          onClick={() => router.push("/searchmobile")}
        >
          <div className="flex flex-row gap-2 items-center rounded-xl w-full bg-white px-4 cursor-pointer hover:bg-gray-50 transition-all duration-300 border border-gray-300 shadow-sm hover:shadow-md">
            <Search size={20} className="text-gray-600" />
            <input
              type="search"
              placeholder="Search for products and more..."
              className="w-full outline-0 text-sm sm:text-base bg-transparent py-3 text-gray-800 placeholder-gray-500 font-normal"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* SIDE MENU */}
      {activeModal === "Menu" && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] w-full flex justify-start"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-72 overflow-y-auto bg-white h-full shadow-2xl p-4 flex flex-col relative border-r border-gray-200"
            onClick={(e) => e.stopPropagation()}
            ref={mobileMenuRef}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8A2BE2] to-[#9C27B0]"></div>

            {/* Close */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:scale-110 transition-all duration-300 p-1 rounded-lg hover:bg-gray-100"
              onClick={() => setActiveModal(null)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>

            {/* Logo & Profile */}
            <div className="flex flex-col items-center border-b border-gray-200 pb-4 mb-4 mt-8">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8A2BE2] to-[#9C27B0] text-white flex items-center justify-center rounded-full text-xl font-bold shadow-lg">
                {isMounted && isAuth ? loginData?.Name?.charAt(0) : "G"}
              </div>

              <span className="mt-3 font-semibold text-gray-900 text-lg">
                {isMounted && isAuth
                  ? ` Hello, ${loginData?.Name?.slice(0, 30)}`
                  : "Hello, Guest"}
              </span>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar flex-1">
              {sideMenu.map((item, idx) =>
                item.path ? (
                  <Link
                    key={idx}
                    href={item.path}
                    className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200"
                    onClick={() => setActiveModal(null)}
                  >
                    <div className="text-gray-500 size-5">{item.icon}</div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setActiveModal(null);
                    }}
                    className="flex items-center gap-3 px-3 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200 text-left"
                  >
                    <div className="text-gray-500 size-5">{item.icon}</div>
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      <Cartheader
        isCartOpen={activeModal === "Cart"}
        cartItems={CartItems}
        closeCart={() => setActiveModal(null)}
      />
    </>
  );
};

export default HomeMobileHeader;