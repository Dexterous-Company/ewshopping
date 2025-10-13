"use client";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Cartheader from "../Home/Cartheader";
import { FaHome, FaRegHeart } from "react-icons/fa";
import { PiGridFourLight } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa6";
import { AiOutlineHome } from "react-icons/ai";
import { BsCart3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWishlist } from "@/redux/wishlist/wishlistSlice";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signout } from "@/redux/athentication/Athentication";
import { red } from "@mui/material/colors";
import { MdCardTravel, MdHome, MdOutlineShoppingCart } from "react-icons/md";
const Footer = () => {
  const { CartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { loginData, otp, mob, isAuth } = useSelector(
    (store) => store.Athentication
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const socialLinks = [
    { icon: <FaFacebookF />, url: "https://www.facebook.com/ewshopping" },
    { icon: <FaTwitter />, url: "https://x.com/ewshoppingindia" },
    {
      icon: <FaPinterestP />,
      url: "https://in.pinterest.com/EWShoppingPortal/",
    },
    {
      icon: <FaLinkedinIn />,
      url: "https://www.linkedin.com/company/ew-shopping",
    },
    {
      icon: <FaInstagram />,
      url: "https://www.instagram.com/ewshoppingofficial/",
    },
    { icon: <FaYoutube />, url: "https://www.youtube.com/@EWShopping" },
  ];

  const CART_ITEMS = [
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
  ];

  const closeAll = useCallback(() => setIsCartOpen(false), []);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const handleLogout = () => {
    dispatch(signout());
    // closeAllModals();
    router.push("/login");
  };

  const footerLinks = [
    {
      title: "Information",
      links: [
        ...(mounted && isAuth
          ? [["My Account", "/accounts/profile"]]
          : [["Login", "/login"]]),
        ["About Us", "/aboutus"],
        ["Privacy Policy", "/privacyPolicy"],
        ["Terms & Conditions", "/termsAndCondition"],
      ],
    },
    {
      title: "My Account",
      links: [
        ...(mounted && isAuth ? [["Sign Out", "#"]] : [["Sign In", "/login"]]),
        ["View Cart", "/cart"],
        ...(mounted && isAuth ? [["Orders", "/accounts/orders"]] : []),
      ],
    },
    {
      title: "Customer Service",
      links: [
        ["Affiliate", "/affilliate"],
        ["FAQ", "/faq"],
        ["Contact Us", "/contactUs"],
        ["Cancellation Policy", "/cancellationPolicy"],
        ["Refund Policy", "/refundPolicy"],
        ["Career", "/carrer"],
      ],
    },
  ];

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isAuth && loginData?._id) {
      dispatch(fetchUserWishlist(loginData._id));
    }
  }, [isAuth, loginData?._id, dispatch]);

  const footerImage = [
    {
      src: "https://ewshoppingsellerapinew.dexterous.in/uploads/1759926836359.webp",
      alt: "Footer Logo",
    },
    {
      src: "https://ewshoppingsellerapinew.dexterous.in/uploads/1759926843168.webp",
      alt: "Footer Logo",
    },
    {
      src: "https://ewshoppingsellerapinew.dexterous.in/uploads/1759926849614.webp",
      alt: "Footer Logo",
    },
    {
      src: "https://ewshoppingsellerapinew.dexterous.in/uploads/1759926856761.webp",
      alt: "Footer Logo",
    },
    {
      src: "https://ewshoppingsellerapinew.dexterous.in/uploads/1759926866378.webp",
      alt: "Footer Logo",
    },
    {
      src: "https://ewshoppingsellerapinew.dexterous.in/uploads/1759927031194.webp",
      alt: "Footer Logo",
    },
  ];
  return (
    <div className="overflow-x-hidden w-full bg-[#2f415d]">
      {/* Footer Top */}
      <section className="bg-[#2f415d] text-white py-8 hidden sm:block">
        <div className="container mx-auto px-4 grid md:grid-cols-4 sm:grid-cols-2 gap-8">
          {footerLinks.map((col, i) => (
            <div key={i}>
              <h4 className="text-lg font-bold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([text, href]) => (
                  <li key={text}>
                    {text === "Sign Out" ? (
                      <button
                        onClick={handleLogout}
                        className="hover:text-blue-400 transition-colors"
                      >
                        {text}
                      </button>
                    ) : (
                      <Link
                        href={href}
                        className="hover:text-blue-400 transition-colors"
                      >
                        {text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <p className="mb-2 flex gap-1 tems-center">
              <FaMapMarkerAlt /> Ewshopping, Rajendra Place, New Delhi, Pin
              -110008
            </p>
            <p className="mb-2 flex gap-1 items-center">
              <FaPhoneAlt />{" "}
              <Link href="tel:8447282606" className="hover:text-blue-400">
                +91 8447282606
              </Link>
            </p>
            <p className="mb-4 flex gap-1 tems-center">
              <FaEnvelope />
              <Link
                href="mailto:info@ewshopping.com"
                className="hover:text-blue-400"
              >
                info@ewshopping.com
              </Link>
            </p>
            <div className="flex space-x-3 text-xl">
              {socialLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  target="_blank" // opens in new tab
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bottom */}
      <section className="bg-[#2f415d] text-gray-300 py-4 hidden sm:block">
        <div className="container mx-auto px-4 flex flex-col md:flex-row-reverse justify-between items-center">
          <div className="flex space-x-1 mb-2 md:mb-0">
            {footerImage.map((item, index) => (
              <div
                className="h-6 w-8  rounded-base  object-contain"
                key={index}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-6 w-8 rounded-base object-contain"
                />
              </div>
            ))}
          </div>
          <div className="text-sm">
            © 2024 EWShopping. All Rights Reserved. | Design by Dexterous
            Technology.
          </div>
        </div>
      </section>

      {/* Mobile Footer Menu */}
      <div className="fixed bottom-0 left-0 right-0 font-medium bg-[#cfebfe] shadow-lg flex justify-between items-center px-8 py-2 lg:hidden z-50">
        {/* 🏠 Home */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-center relative "
        >
          {/* <img
            src="/Logoe.png"
            alt="Home"
            className="w-8 h-8 p-1 object-contain bg-[#2f415d] rounded-full"
          /> */}
          <AiOutlineHome className="text-2xl" />
          <span className="text-xs">Home</span>
        </Link>

        {/* 🛍️ Shop */}
        <Link
          href="/category"
          className="flex flex-col items-center gap-1 text-center relative "
        >
          <PiGridFourLight className="text-2xl" />
          <span className="text-xs">Shop</span>
        </Link>

        {/* 👤 Account */}
        <Link
          href={mounted && isAuth ? "/accounts" : "/login"}
          className="flex flex-col items-center gap-1 text-center relative mt-2"
        >
          <FaRegUser className="text-[1rem]" />
          <span className="text-xs">Account</span>
        </Link>

        {/* ❤️ Wishlist */}
        <Link
          href={mounted && isAuth ? "/accounts/wishlist" : "/login"}
          className="flex flex-col items-center gap-1 text-center relative mt-2"
        >
          <FaRegHeart className="relative text-[1rem]" />
          <span
            className={`absolute -top-2 right-1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ${
              isMounted
                ? wishlistItems.length > 0
                  ? "bg-blue-950"
                  : null
                : null
            }`}
          >
            {isMounted
              ? wishlistItems.length > 0
                ? wishlistItems.length
                : null
              : null}
          </span>
          <span className="text-xs">Wishlist</span>
        </Link>

        {/* 🛒 Cart */}
        <div
          className="flex flex-col items-center relative text-center mt-2"
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          <MdOutlineShoppingCart className="text-[1.2rem]" />
          <span
            className={`absolute -top-2 -right-1 text-xs rounded-full h-4 w-4 flex items-center justify-center ${
              isMounted
                ? CartItems.length > 0
                  ? "bg-blue-950 text-white"
                  : null
                : null
            }
            `}
          >
            {isMounted
              ? CartItems.length > 0
                ? CartItems.length
                : null
              : null}
          </span>
          <span className="text-xs">Cart</span>
        </div>
      </div>

      {/* Cart Header */}
      <Cartheader
        isCartOpen={isCartOpen}
        cartItems={CART_ITEMS}
        closeCart={closeAll}
      />

      {/* Scroll to Top */}
      <div
        id="site-scroll"
        className="fixed bottom-20 right-4 bg-gray-800 text-white p-2 rounded-full cursor-pointer hidden"
      >
        ⬆️
      </div>
    </div>
  );
};

export default Footer;
