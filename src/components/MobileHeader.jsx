import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MobileHeader = () => {
  const { CartItems = [] } = useSelector((state) => state.cart) || {};
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="py-2 px-4 bg-[#cfebfe] sticky top-0 z-[9999] w-full">
      <div className="flex flex-row items-center w-full gap-2">
        <div className="flex p-3 rounded-xl bg-[#f5f6fb] w-full  flex-row justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className=" rounded-full hover:bg-gray-200 w-10"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 26 26"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <Link
            href={"/searchmobile"}
            className="flex flex-row justify-between items-center w-full"
          >
            <input
              type="search"
              placeholder="Search for product tag, brand, and more..."
              className="w-full outline-0 text-[0.8rem] sm:text-base bg-transparent"
              readOnly
            />
            {/* <div className="flex flex-row items-center">
              <IoSearch size={20} className="text-gray-500" />
            </div> */}
          </Link>
        </div>

        <Link
          href={"/cart"}
          className="flex flex-row items-center relative text-center p-3 rounded-lg bg-[#f5f6fb]"
        >
          <MdOutlineShoppingCart className="text-xl" />
          <span
            className={`absolute top-0 -right-1 bg-blue-950 text-white text-xs  rounded-full h-4 w-4 flex items-center justify-center  ${
              CartItems.length > 0 ? "bg-blue-950" : null
            }`}
          >
            {isMounted ? (CartItems.length > 0 ? CartItems.length : 0) : 0}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default MobileHeader;
