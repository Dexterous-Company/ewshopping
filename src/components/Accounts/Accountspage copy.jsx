"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaRegUserCircle, FaRegAddressBook, FaRegHeart } from "react-icons/fa";
import {
  MdOutlinePayment,
  MdPreview,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";
import { CiBoxes } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { FiPower } from "react-icons/fi";
import { useSelector } from "react-redux";

const accountdata = [
  {
    data: [
      { Nav: "Profile", Icon: FaRegUserCircle, Path: "/accounts/profile" },
      {
        Nav: "Manage Address",
        Icon: FaRegAddressBook,
        Path: "/accounts/address",
      },
    ],
  },
  {
    data: [
      { Nav: "Reviews & Ratings", Icon: MdPreview, Path: "/accounts/review" },
    ],
  },
  {
    data: [
      { Nav: "My Coupons", Icon: RiCoupon2Line, Path: "/accounts/coupons" },
      { Nav: "My Wishlist", Icon: FaRegHeart, Path: "/accounts/wishlist" },
      { Nav: "My Orders", Icon: CiBoxes, Path: "/accounts/orders" },
    ],
  },
  {
    data: [
      {
        Nav: "My Notifications",
        Icon: IoIosNotificationsOutline,
        Path: "/accounts/notifications",
      },
    ],
  },
  {
    data: [{ Nav: "LogOut", Icon: FiPower, Path: "/" }],
  },
];

const Accountspage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activePath, setActivePath] = useState("");
  const { isAuth, loginData } = useSelector((state) => state.Athentication);
  useEffect(() => {
    setActivePath(pathname);
  }, [pathname]);

  return (
    <>
      {/* User Info */}
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

      {/* Navigation Menu */}
      <div className="sm:px-7 sm:py-4 sm:bg-white sm:shadow-md w-full sm:mt-0 mt-5 flex flex-col sm:gap-1">
        {accountdata.map((group, index) => (
          <div key={index} className="sm:mb-0 mb-2">
            {group.data.map((item, i) => {
              const isActive = activePath === item.Path;
              const IconComp = item.Icon;

              return (
                <div
                  key={i}
                  className={`flex px-3 py-2 cursor-pointer items-center gap-3 rounded-md transition-all duration-150
                    ${isActive
                      ? "sm:bg-[#fce9ef] sm:text-[#e96184] sm:font-semibold"
                      : "sm:hover:bg-gray-100"
                    }`}
                  onClick={() => router.push(item.Path)}
                >
                  <div className="flex flex-row gap-2 sm:mx-0 mx-4 justify-between w-full items-center">
                    <div className="flex flex-row gap-3 items-center">
                      <IconComp
                        className={`sm:text-lg text-xl ${isActive
                          ? "text-[#e96184]"
                          : "text-gray-500 sm:text-inherit"
                          }`}
                      />
                      <span className="text-sm">{item.Nav}</span>
                    </div>
                    <MdKeyboardArrowRight size={20} />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
};

export default Accountspage;
