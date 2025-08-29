"use client";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Cartheader from "../Home/Cartheader";
import { FaRegHeart } from "react-icons/fa";
import { PiGridFourLight } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa6";
import { AiOutlineHome } from "react-icons/ai";
import { BsCart3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWishlist } from "@/redux/wishlist/wishlistSlice";
import { FaFacebookF, FaTwitter, FaPinterestP, FaLinkedinIn, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signout } from "@/redux/athentication/Athentication";
const Footer = () => {
  const { CartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { loginData, otp, mob, isAuth } = useSelector((store) => store.Athentication);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch()
  const router = useRouter()

  const socialLinks = [
    { icon: <FaFacebookF />, url: "#" },
    { icon: <FaTwitter />, url: "#" },
    { icon: <FaPinterestP />, url: "#" },
    { icon: <FaLinkedinIn />, url: "#" },
    { icon: <FaInstagram />, url: "#" },
    { icon: <FaYoutube />, url: "#" },
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
      title: "Informations",
      links: [
        ["My Account", "/accounts/profile"],
        ["About us", "/aboutus"],
        ["Login", "/login"],
        ["Privacy policy", "/privacyPolicy"],
        ["Terms & condition", "/termsAndCondition"],
      ],
    },
    {
      title: "My Account",
      links: [
        // ...(isAuth ? [["Sign Out", "#"]] : [["Sign in", "/login"]]),
        ...(mounted && isAuth ? [["Sign Out", "#"]] : [["Sign in", "/login"]]),
        ["View Cart", "/cart"],
        ["Order", "/accounts/orders"],
      ],
    },
    {
      title: "Customer Services",
      links: [
        ["Affilate", "/affilliate"],
        ["FAQ's", "/faq"],
        ["Contact Us", "/contactUs"],
        ["cancellation Policy", "/cancellationPolicy"],
        ["Refund Policy", "/refundPolicy"],
        ['carrer', '/carrer']
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
      src: "/assets/images/footer/amex.png",
      alt: "Footer Logo",
    },
    {
      src: "/assets/images/footer/jcb.png",
      alt: "Footer Logo",
    },
    {
      src: "/assets/images/footer/amex.png",
      alt: "Footer Logo",
    },
    {
      src: "/assets/images/footer/mastercard.png",
      alt: "Footer Logo",
    },
    {
      src: "/assets/images/footer/paypal.png",
      alt: "Footer Logo",
    },
    {
      src: "/assets/images/footer/stripe.png",
      alt: "Footer Logo",
    },
    {
      src: "/assets/images/footer/visa.png",
      alt: "Footer Logo",
    },
  ]
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
                    {/* <Link
                      href={href}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {text}
                    </Link> */}
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
            <p className="mb-2 flex gap-1 tems-center"><FaMapMarkerAlt /> Ewshopping, Rajendra Palace, New Delhi, Pin -110008</p>
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
                <Link key={index} href={item.url} className="hover:text-blue-400">
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
            {
              footerImage.map((item, index) => (
                <div className="h-6 w-8  rounded-base  object-contain" key={index}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="h-6 w-8 rounded-base object-contain"
                  />
                </div>
              ))
            }
          </div>
          <div className="text-sm">© 2024 EWShopping. All Rights Reserved. | Design by Dexterous Technology.</div>
        </div>
      </section>

      {/* Mobile Footer Menu */}
      <div className="fixed bottom-0 left-0 right-0 font-medium bg-white shadow-lg flex justify-between items-center px-10 py-3 lg:hidden z-50">
        {[
          ["Home", "/", <AiOutlineHome key="home" />],
          ["Shop", "/category", <PiGridFourLight key="shop" />],
          ["Account", "/accounts", <FaRegUser key="account" />],
          [
            "Wishlist",
            "/accounts/wishlist",
            <FaRegHeart key="wishlist" className="relative" />,
          ],
        ].map(([label, link, icon]) => (
          <Link
            key={label}
            href={link}
            className="flex flex-col items-center gap-1 text-center relative"
          >
            {icon}
            {label === "Wishlist" && (
              <span className="absolute -top-2 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {isMounted ? (wishlistItems.length > 0 ? wishlistItems.length : 0) : 0}
              </span>
            )}
            <span className="text-xs">{label}</span>
          </Link>
        ))}
        <div
          className="flex flex-col items-center relative text-center"
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          <BsCart3 />
          <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {isMounted ? (CartItems.length > 0 ? CartItems.length : 0) : 0}
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
