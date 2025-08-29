"use client";

import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchSharp, IoCart } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CategorySkeleton = () => {
  return (
    <div className="flex flex-col animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="border-b border-gray-200 py-2 flex flex-col items-center"
        >
          <div className="bg-gray-200 h-14 w-14 rounded-full mb-1"></div>
          <div className="h-3 w-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

const CategoryItemSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 p-2 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <div className="h-4 w-28 bg-gray-300 mb-2 rounded"></div>
          <div className="grid sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 grid-cols-3 gap-2">
            {[...Array(7)].map((_, j) => (
              <div key={`${i}-${j}`} className="flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-3 w-14 bg-gray-200 mt-2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const items = [
  {
    title: "Minimal Lamp",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80",
  },
  // ... other items
];

const itemsdata = [];

const Leftcategory = ({ select, setSelect }) => {
  if (items.length === 0) return <CategorySkeleton />;
  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div
          key={i}
          onClick={() => setSelect(item.title)}

          // border-b rounded-3 border-b-gray-200
          className={`cursor-pointer relative  py-2 flex flex-col items-center justify-between ${select === item.title && " bg-gray-50"
            }`}
        >
          {select === item.title && (
            <div className="absolute left-0 rounded-r-2xl top-0 h-full w-1 bg-[#e96f84] z-10"></div>
          )}

          <div className="h-15 w-15 rounded-full mb-1">
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover rounded"
            />
          </div>
          <span
            className={`text-xs ${select === item.title
                ? "text-[#e96f84] font-medium"
                : "text-gray-600"
              }`}
          >
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
};

const RightCategory = () => {
  if (itemsdata.length === 0) return <CategoryItemSkeleton />;

  return (
    <div className="flex flex-col gap-6 p-2">
      {itemsdata.map((item, i) => (
        <div key={i} className="mb-4">
          <span className="font-semibold text-[1.1rem] mb-2 block">
            {item.title}
          </span>
          <div className="grid sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 grid-cols-3 gap-2">
            {item.tags.map((tag, j) => (
              <div key={`${i}-${j}`} className="flex flex-col items-center">
                <img
                  src={tag.img}
                  className="sm:h-20 h-15 w-15 sm:w-20 object-fill rounded-full bg-[#f5f6fb]"
                  alt={tag.name}
                />
                <span className="text-xs text-center py-2">{tag.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const Page = () => {
  const { CartItems, TotalMrp, TotalPrice, amountToGetfeeDelivery, DeliveryCharge, amountToGetfeeDeliveryPercentage } = useSelector((state) => state.cart);

  const [select, setSelect] = useState(items[0]?.title || "");
  const router = useRouter();




  return (
    <div className="mt-2">
      {/* Top Bar */}
      <div className="h-12 flex justify-between items-center fixed top-0 z-10 w-full bg-white shadow-sm p-3 mb-2">
        <div className="flex items-center flex-row gap-2 ">
          <IoIosArrowRoundBack size={25} onClick={() => router.back()} />
          <span>All Categories</span>
        </div>
        <div className="flex items-center gap-2 mr-3">
          <IoSearchSharp
            size={20}
            onClick={() => router.push("/searchmobile")}
          />
          <div className="relative">
            <IoCart size={20} />
            <span className="absolute text-white text-xs h-4 w-4 flex justify-center items-center -top-2 -right-2 bg-[#e96f84] rounded-full">
              {CartItems?.length > 0 ? CartItems?.length : 0}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 mt-13 h-screen">
        {/* Left Section */}
        <div className="sm:col-span-1 col-span-3 border-r border-r-gray-200 h-full overflow-y-auto no-scrollbar">
          <Leftcategory select={select} setSelect={setSelect} />
        </div>
        {/* Right Section */}
        <div className="sm:col-span-11 col-span-9 h-full overflow-y-auto no-scrollbar">
          <RightCategory />
        </div>
      </div>
    </div>
  );
};

export default Page;
