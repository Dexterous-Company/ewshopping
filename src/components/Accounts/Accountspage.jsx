"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaRegUserCircle,
  FaRegAddressBook,
  FaRegHeart,
  FaQuestionCircle,
  FaHandshake,
  FaInfoCircle,
  FaStar,
} from "react-icons/fa";
import {
  MdPreview,
  MdKeyboardArrowRight,
  MdPrivacyTip,
} from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { CiBoxes } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FiPower } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../redux/athentication/Athentication";

const Accountspage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState("");
  const { loginData } = useSelector((state) => state.Athentication);
  const dispatch = useDispatch();

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(signout());
    router.push("/login");
  };

  const accountdata = [
    { Nav: "Profile", Icon: FaRegUserCircle, Path: "/accounts/profile" },
    { Nav: "Manage Address", Icon: FaRegAddressBook, Path: "/accounts/address" },
    { Nav: "Reviews & Ratings", Icon: MdPreview, Path: "/accounts/review" },
    { Nav: "My Coupons", Icon: RiCoupon2Line, Path: "/accounts/coupons" },
    { Nav: "My Wishlist", Icon: FaRegHeart, Path: "/accounts/wishlist" },
    { Nav: "My Orders", Icon: CiBoxes, Path: "/accounts/orders" },
    { Nav: "My Notifications", Icon: IoIosNotificationsOutline, Path: "/accounts/notifications" },
    { Nav: "LogOut", Icon: FiPower, Path: "/", onClick: handleLogout },
  ];

  return (
    <>
      {/* ==================== MOBILE VIEW - Updated & Super Clean ==================== */}
      <div className="min-h-screen bg-[#f0f2f5] sm:hidden pb-10">
        {/* Header - Compact Avatar + Perfectly Aligned Name */}
<div className="bg-white px-5 pt-3 pb-4 shadow-sm">
  <div className="flex items-center gap-3">
    {/* Circle Size Kam Kiya */}
    <div className="w-12 h-12 bg-gradient-to-br from-[#2874f0] to-[#1565c0] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
      <span className="text-2xl font-bold text-white">
        {loginData?.Name?.charAt(0).toUpperCase() || "P"}
      </span>
    </div>
    
    {/* Name Size Aur Spacing Adjust Kiya */}
    <h2 className="text-lg font-bold text-gray-900 leading-tight">
      Hello, {loginData?.Name || "Pooja Patil"}
    </h2>
  </div>
</div>
        {/* Quick Cards - 4 Alag Cards, Zero Gap Icon+Text, No Border Radius */}
<div className="mx-4 mt-5">
  <div className="grid grid-cols-2 gap-3">
    <QuickCard
      icon={<CiBoxes className="text-2xl text-[#2874f0]" />}
      title="Orders"
      onClick={() => router.push("/accounts/orders")}
    />
    <QuickCard
      icon={<FaRegHeart className="text-2xl text-[#2874f0]" />}
      title="Wishlist"
      onClick={() => router.push("/accounts/wishlist")}
    />
    <QuickCard
      icon={<RiCoupon2Line className="text-2xl text-[#2874f0]" />}
      title="Coupons"
      onClick={() => router.push("/accounts/coupons")}
    />
    <QuickCard
      icon={<FaStar className="text-2xl text-[#2874f0]" />}
      title="Reviews"
      onClick={() => router.push("/accounts/review")}
    />
  </div>
</div>
        {/* Account Settings */}
        <div className="mt-6 mx-4 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-2 text-xs font-extrabold text-gray-700 uppercase tracking-wider bg-gray-50">
            ACCOUNT SETTINGS
          </div>
          <MenuItem icon={FaRegUserCircle} text="Edit Profile" path="/accounts/profile" />
          <MenuItem icon={FaRegAddressBook} text="Saved Addresses" path="/accounts/address" />
          <MenuItem icon={IoIosNotificationsOutline} text="Notification Settings" path="/accounts/notifications" />
          <MenuItem icon={MdPrivacyTip} text="Privacy Center" path="/privacypolicy" />
        </div>

        <div className="mt-4 mx-4 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-2 text-xs font-extrabold text-gray-700 uppercase tracking-wider bg-gray-50">
            EARN WITH EWSHOPPING
          </div>
          <MenuItem icon={FaHandshake} text="Sell on EWShopping" external="https://seller.ewshopping.com" />
        </div>

        <div className="mt-4 mx-4 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-2 text-xs font-extrabold text-gray-700 uppercase tracking-wider bg-gray-50">
            FEEDBACK & INFORMATION
          </div>
          <MenuItem icon={FaInfoCircle} text="Terms, Policies and Licenses" path="/termsandcondition" />
          <MenuItem icon={FaQuestionCircle} text="Browse FAQs" path="/faq" />
        </div>

         {/* Logout Button – Grey Border + Super Compact (Tere Hisaab Se Perfect) */}
<div className="px-4 mt-8">
  <button
    onClick={handleLogout}
    className="w-full py-2.5 text-[#2874f0] font-medium text-xs uppercase tracking-wider border-2 border-gray-400 rounded hover:bg-[#2874f0] hover:text-white hover:border-[#2874f0] transition-all duration-300"
  >
    Logout
  </button>
</div>
      </div>

      {/* ==================== DESKTOP VIEW - 100% UNTOUCHED ==================== */}
      <div className="hidden sm:block sm:h-fit h-screen mb-[35 Remington] sm:mb-0 bg-[#f5f6fb]">
        <div className="flex flex-row items-center gap-2 w-full bg-white sm:shadow-md shadow-sm sm:px-10 px-5 py-3 sm:py-5">
         |

          <img
            src="https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
            alt="User Icon"
            className="h-14 w-14 bg-[#f5f6f7] rounded-full"
          />
          <div className="flex flex-col w-full">
            <span className="text-xs font-normal">Hello,</span>
            <span className="text-sm font-semibold">{loginData?.Name}</span>
          </div>
        </div>

        <div className="sm:px-7 sm:py-4 sm:bg-white bg-[#f5f6fb] gap-3 sm:shadow-md w-full sm:mt-0 mt-5 flex flex-col sm:gap-3">
          {accountdata.map((item, index) => {
            const isActive = activePath === item.Path;
            const IconComp = item.Icon;
            return (
              <div
                key={index}
                className={`flex sm:px-3 sm:py-0 py-3 cursor-pointer sm:mx-0 mx-3 sm:bg-none bg-white items-center gap-3 rounded-md transition-all duration-150 ${
                  isActive
                    ? "sm:bg-[#fce9ef] sm:text-[#e96184] sm:font-semibold"
                    : "sm:hover:bg-gray-100"
                }`}
                onClick={() => item.onClick ? item.onClick() : router.push(item.Path)}
              >
                <div className="flex flex-row gap-2 sm:mx-0 mx-4 justify-between w-full items-center">
                  <div className="flex flex-row gap-3 items-center">
                    <div className="rounded-full h-8 w-8 flex justify-center items-center bg-[#f5f6fb] sm:bg-none text-gray-500 sm:text-black">
                      <IconComp
                        className={`sm:text-lg text-xl ${
                          isActive ? "text-[#e96184]" : "text-gray-500 sm:text-inherit"
                        }`}
                      />
                    </div>
                    <span className="sm:text-sm sm:font-normal font-semibold">{item.Nav}</span>
                  </div>
                  <MdKeyboardArrowRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

// Tight Card - Padding Kam Kiya
const QuickCard = ({ icon, title, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center px-4 py-4"
    // rounded hata diya → ab sharp corners
    // gap-3 hata diya → ab icon aur text chipke hue
  >
    {icon}
    <p className="text-sm font-medium text-gray-800 ml-3">{title}</p>
    {/* ml-3 = 12px → Flipkart jaisa perfect tight spacing, zero nahi lekin bilkul chipka feel */}
  </div>
);
// Menu Item Component
const MenuItem = ({ icon: Icon, text, path, external }) => {
  const router = useRouter();
  const handleClick = () => (external ? window.open(external, "_blank") : router.push(path));

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition"
    >
      <div className="flex items-center gap-4">
        <Icon className="text-xl text-gray-600" />
        <span className="text-base font-medium text-gray-800">{text}</span>
      </div>
      <MdKeyboardArrowRight className="text-2xl text-gray-400" />
    </div>
  );
};

export default Accountspage;