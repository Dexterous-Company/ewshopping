"use client";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Cartheader from "../Home/Cartheader";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWishlist } from "@/redux/wishlist/wishlistSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signout } from "@/redux/athentication/Athentication";

// Lucide React imports
import {
  User,
  Store,
  Home,
  ShoppingCart,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Heart as HeartOutline,
} from "lucide-react";

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
    {
      icon: <Facebook size={18} />,
      url: "https://www.facebook.com/ewshopping",
    },
    { icon: <Twitter size={18} />, url: "https://x.com/ewshoppingindia" },
    {
      icon: <Linkedin size={18} />,
      url: "https://www.linkedin.com/company/ew-shopping",
    },
    {
      icon: <Instagram size={18} />,
      url: "https://www.instagram.com/ewshoppingofficial/",
    },
    { icon: <Youtube size={18} />, url: "https://www.youtube.com/@EWShopping" },
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
    router.push("/login");
  };

  const footerLinks = [
    {
      title: "Information",
      links: [
        ["My Account", isAuth ? "/accounts/profile" : "/login"],
        ["About Us", "/aboutus"],
        ["Privacy Policy", "/privacypolicy"],
        ["Terms & Conditions", "/termsandcondition"],
        ["Blogs", "/blog"],
      ],
    },
    {
      title: "My Account",
      links: [
        [isAuth ? "Sign Out" : "Sign In", isAuth ? "#" : "/login"],
        ["View Cart", "/cart"],
        ["Orders", isAuth ? "/accounts/orders" : "/login"],
      ],
    },
    {
      title: "Customer Service",
      links: [
        ["FAQ", "/faq"],
        ["Contact Us", "/contactus"],
        ["Cancellation Policy", "/cancellationpolicy"],
        ["Refund Policy", "/refundpolicy"],
        ["Career", "/carrer"],
        ["Exchange Policy", "/exchangepolicy"],
        ["Shipping Policy", "/shippingpolicy"],
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
    <div className="overflow-x-hidden w-full bg-gray-900 text-white">
      {/* Footer Top */}
      <section className="bg-gray-900 text-white py-12 hidden sm:block">
        <div className="container mx-auto px-4 grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {footerLinks.map((col, i) => (
            <div key={i} className="relative">
              <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map(([text, href]) => (
                  <li key={text}>
                    {text === "Sign Out" ? (
                      <button
                        onClick={handleLogout}
                        className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-3 group"
                      >
                        <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-white transition-colors"></div>
                        {text}
                      </button>
                    ) : (
                      <Link
                        href={href}
                        className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-3 group"
                      >
                        <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-white transition-colors"></div>
                        {text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="relative">
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3 items-center text-gray-300">
                <MapPin className="text-blue-400 flex-shrink-0 mt-1 size-4" />
                <span>Ewshopping, Rajendra Place, New Delhi, Pin - 110008</span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="text-blue-400 flex-shrink-0 size-4" />
                <Link
                  href="tel:8447282606"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +91 8447282606
                </Link>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="text-blue-400 flex-shrink-0 size-4" />
                <Link
                  href="mailto:info@ewshopping.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  info@ewshopping.com
                </Link>
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <p className="text-white mb-4 font-medium">Follow us on</p>
                <div className="flex space-x-3">
                  {socialLinks.map((item, index) => (
                    <Link
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-blue-600 text-white p-3 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      {item.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bottom */}
      <section className="bg-gray-800 border-t border-gray-700 py-6 hidden sm:block">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-center">
          {/* Payment Methods */}
          <div className="flex flex-wrap gap-3 mb-4 lg:mb-0 justify-center">
            {footerImage.map((item, index) => (
              <div
                className="h-10 w-14 bg-white rounded-lg p-1 flex items-center justify-center border border-gray-300"
                key={index}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={40}
                  height={24}
                  className="object-contain"
                  sizes="(max-width: 640px) 40px, 40px"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center lg:text-left">
            <div className="text-sm text-gray-300 flex items-center gap-2 justify-center lg:justify-start">
              © 2025 EWShopping. All rights reserved.
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Design by Dexterous Technology
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Footer Menu - ONLY TEXT COLORS CHANGED */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 shadow-2xl flex justify-between items-center  lg:hidden z-50 border-t border-gray-700">
        {/* Home */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-center group flex-1"
        >
          <div className="relative p-2 group-hover:bg-gray-800 rounded-lg transition-colors">
            <Home className="size-5 text-white group-hover:text-blue-400 transition-colors" />
          </div>
          <span className="text-xs text-white font-medium group-hover:text-blue-400 transition-colors">
            Home
          </span>
        </Link>

        {/* Shop */}
        <Link
          href="/category"
          className="flex flex-col items-center gap-1 text-center group flex-1"
        >
          <div className="relative p-2 group-hover:bg-gray-800 rounded-lg transition-colors">
            <Store className="size-5 text-white group-hover:text-blue-400 transition-colors" />
          </div>
          <span className="text-xs text-white font-medium group-hover:text-blue-400 transition-colors">
            Shop
          </span>
        </Link>

        {/* Account */}
        <Link
          href={mounted && isAuth ? "/accounts" : "/login"}
          className="flex flex-col items-center gap-1 text-center group flex-1"
        >
          <div className="relative p-2 group-hover:bg-gray-800 rounded-lg transition-colors">
            <User className="size-5 text-white group-hover:text-blue-400 transition-colors" />
          </div>
          <span className="text-xs text-white font-medium group-hover:text-blue-400 transition-colors">
            Account
          </span>
        </Link>

        {/* Wishlist */}
        <Link
          href={mounted && isAuth ? "/accounts/wishlist" : "/login"}
          className="flex flex-col items-center gap-1 text-center group relative flex-1"
        >
          <div className="relative p-2 group-hover:bg-gray-800 rounded-lg transition-colors">
            <HeartOutline className="size-5 text-white group-hover:text-blue-400 transition-colors" />

            {/* Badge container ALWAYS rendered */}
            <span
              className="absolute -top-1 -right-1 h-4 w-4
      flex items-center justify-center
      rounded-full text-[10px] font-semibold
      bg-red-500 text-white
      transition-opacity duration-200
      pointer-events-none
    "
              style={{
                opacity: wishlistItems.length > 0 ? 1 : 0,
              }}
              aria-hidden="true"
            >
              {/* Stable text width */}
              {wishlistItems.length > 0
                ? wishlistItems.length > 9
                  ? "9+"
                  : wishlistItems.length
                : "0"}
            </span>
          </div>

          <span className="text-xs text-white font-medium group-hover:text-blue-400 transition-colors">
            Wishlist
          </span>
        </Link>

        {/* Cart */}
        <div
          className="flex flex-col items-center text-center group cursor-pointer relative flex-1"
          onClick={() => router.push("/cart")}
        >
          <div className="relative p-2 group-hover:bg-gray-800 rounded-lg transition-colors">
            <ShoppingCart className="size-5 text-white group-hover:text-blue-400 transition-colors" />
            <span
              className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ${
                isMounted && CartItems.length > 0
                  ? "bg-blue-500 shadow-sm text-[10px]"
                  : "hidden"
              }`}
            >
              {isMounted && CartItems.length > 0
                ? CartItems.length > 9
                  ? "9+"
                  : CartItems.length
                : 0}
            </span>
          </div>
          <span className="text-xs text-white font-medium group-hover:text-blue-400 transition-colors">
            Cart
          </span>
        </div>
      </div>

      {/* Cart Header */}
      <Cartheader
        isCartOpen={isCartOpen}
        cartItems={CART_ITEMS}
        closeCart={closeAll}
      />
    </div>
  );
};

export default Footer;
