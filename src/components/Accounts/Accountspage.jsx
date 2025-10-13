"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaRegUserCircle,
  FaRegAddressBook,
  FaRegHeart,
  FaCrown,
  FaInfoCircle,
  FaHandshake,
  FaBan,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  MdOutlinePayment,
  MdPreview,
  MdKeyboardArrowRight,
  MdPrivacyTip,
  MdWork,
  MdContactPhone,
} from "react-icons/md";
import { RiCoupon2Line, RiFileList3Line } from "react-icons/ri";
import { CiBoxes } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FiPower } from "react-icons/fi";
import { TbTruckReturn } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "@/redux/athentication/Athentication";

const Accountspage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState("");
  const { isAuth, loginData } = useSelector((state) => state.Athentication);
  const dispatch = useDispatch();

  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  const handleLogout = () => {
    dispatch(signout());
    router.push("/login");
  };

  // ---------------- MAIN ACCOUNT MENU ----------------
  const accountdata = [
    { Nav: "Profile", Icon: FaRegUserCircle, Path: "/accounts/profile" },
    { Nav: "Manage Address", Icon: FaRegAddressBook, Path: "/accounts/address" },
    { Nav: "Reviews & Ratings", Icon: MdPreview, Path: "/accounts/review" },
    { Nav: "My Coupons", Icon: RiCoupon2Line, Path: "/accounts/coupons" },
    { Nav: "My Wishlist", Icon: FaRegHeart, Path: "/accounts/wishlist" },
    { Nav: "My Orders", Icon: CiBoxes, Path: "/accounts/orders" },
    {
      Nav: "My Notifications",
      Icon: IoIosNotificationsOutline,
      Path: "/accounts/notifications",
    },
    { Nav: "LogOut", Icon: FiPower, Path: "/", onClick: handleLogout },
  ];

  // ---------------- NEW SECTION: Earn with EwShopping ----------------
  const accountMobileDataa = [
    {
      Nav: "Sell on Ew shopping",
      Icon: FaHandshake,
      Path: "https://seller.ewshopping.com/", // or external link e.g. "https://seller.ewshopping.com"
    },
  ];

  // ---------------- OTHER PAGES ----------------
  const accountMobileData = [
    {
      Nav: "Terms & Conditions",
      Icon: RiFileList3Line,
      Path: "/termsAndCondition",
    },
    {
      Nav: "Return & Refund",
      Icon: TbTruckReturn,
      Path: "/refundPolicy",
    },
    {
      Nav: "Privacy Policy",
      Icon: MdPrivacyTip,
      Path: "/privacyPolicy",
    },
    {
      Nav: "About Us",
      Icon: FaInfoCircle,
      Path: "/aboutus",
    },
    {
      Nav: "Affiliate",
      Icon: FaHandshake,
      Path: "/affiliate",
    },
    {
      Nav: "Cancellation Policy",
      Icon: FaBan,
      Path: "/cancellationPolicy",
    },
    {
      Nav: "FAQ",
      Icon: FaQuestionCircle,
      Path: "/faq",
    },
    {
      Nav: "Contact Us",
      Icon: MdContactPhone,
      Path: "/contactUs",
    },
    {
      Nav: "Career",
      Icon: MdWork,
      Path: "/career",
    },
  ];

  return (
    <div className="sm:h-fit h-screen mb-[35rem] sm:mb-0 bg-[#f5f6fb]">
      {/* ---------------- DESKTOP USER INFO ---------------- */}
      <div className="hidden sm:block">
        <div className="flex flex-row items-center gap-2 w-full bg-white sm:shadow-md shadow-sm sm:px-10 px-5 py-3 sm:py-5">
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
      </div>

      {/* ---------------- MOBILE USER INFO ---------------- */}
      <div className="block sm:hidden w-full bg-[#2f415d] px-4 py-2 rounded-xl shadow-md text-white">
        <div className="flex flex-row relative gap-3">
          <div className="h-18 w-18 rounded-full flex justify-center items-center bg-white">
            <span className="text-3xl bg-gradient-to-l from-[#2f415d] to-gray-500 bg-clip-text text-transparent font-bold">
              {loginData?.Name?.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-[1.1rem]">{loginData?.Name}</span>
            <span className="text-xs">{loginData?.Email}</span>
            <span className="text-xs">View Activity</span>
          </div>
        </div>
        <div className="border-b border-gray-100/30 my-3"></div>
      </div>

      {/* ---------------- DESKTOP ACCOUNT MENU ---------------- */}
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
              onClick={() =>
                item.onClick ? item.onClick() : router.push(item.Path)
              }
            >
              <div className="flex flex-row gap-2 sm:mx-0 mx-4 justify-between w-full items-center">
                <div className="flex flex-row gap-3 items-center">
                  <div className="rounded-full h-8 w-8 flex justify-center items-center bg-[#f5f6fb] sm:bg-none text-gray-500 sm:text-black">
                    <IconComp
                      className={`sm:text-lg text-xl ${
                        isActive
                          ? "text-[#e96184]"
                          : "text-gray-500 sm:text-inherit"
                      }`}
                    />
                  </div>
                  <span className="sm:text-sm sm:font-normal font-semibold">
                    {item.Nav}
                  </span>
                </div>
                <MdKeyboardArrowRight size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- MOBILE EXTRA SECTION: Earn with EwShopping ---------------- */}
      <div className="block sm:hidden bg-white mt-5">
        <div className="bg-white gap-3 w-full flex flex-col">
          <div className="mt-2">
            <span className="border-l-2 py-1 border-[#2f415d] px-2 mx-3 font-semibold">
              Earn with EwShopping
            </span>
          </div>

          {accountMobileDataa.map((item, index) => {
            const IconComp = item.Icon;
            return (
              <div
                key={index}
                className="flex cursor-pointer mx-3 items-center rounded-md transition-all duration-150 hover:bg-gray-100"
                onClick={() => router.push(item.Path)}
              >
                <div className="flex flex-row mx-4 justify-between w-full items-center">
                  <div className="flex flex-row gap-3 items-center">
                    <div className="rounded-full h-8 w-8 flex justify-center items-center bg-[#f5f6fb]">
                      <IconComp className="text-xl text-gray-500" />
                    </div>
                    <span className="text-sm font-semibold">{item.Nav}</span>
                  </div>
                  <MdKeyboardArrowRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- MOBILE EwShopping Section ---------------- */}
      <div className="block sm:hidden bg-white">
        <div className="bg-white gap-3 w-full mt-5 flex flex-col">
          <div className="mt-2">
            <span className="border-l-2 py-1 border-[#2f415d] px-2 mx-3 font-semibold">
              EwShopping
            </span>
          </div>

          {accountMobileData.map((item, index) => {
            const isActive = activePath === item.Path;
            const IconComp = item.Icon;
            return (
              <div
                key={index}
                className="flex cursor-pointer mx-3 items-center rounded-md transition-all duration-150 hover:bg-gray-100"
                onClick={() => router.push(item.Path)}
              >
                <div className="flex flex-row mx-4 justify-between w-full items-center">
                  <div className="flex flex-row gap-3 items-center">
                    <div className="rounded-full h-8 w-8 flex justify-center items-center bg-[#f5f6fb]">
                      <IconComp
                        className={`text-xl ${
                          isActive
                            ? "text-[#e96184]"
                            : "text-gray-500 sm:text-inherit"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-semibold">{item.Nav}</span>
                  </div>
                  <MdKeyboardArrowRight size={20} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Accountspage;
