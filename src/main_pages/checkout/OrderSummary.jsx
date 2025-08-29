
"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { addToCart, decrementCart, removeFromCart } from "@/redux/cart/CartSlice";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { setCheckoutStep } from "@/redux/athentication/Athentication";

const OrderSummary = ({ showSummary, setContinueSumamryData ,continueSumamryData }) => {

  const { isAuth, loginData } = useSelector((store) => store.Athentication);
  const { CartItems } = useSelector((store) => store.cart);
  const [continueSumamry, setContinueSumamry] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  // Handle quantity increase
  const handleIncrement = (item) => {
    dispatch(addToCart(item));
  };

  // Handle quantity decrease
  const handleDecrement = (item) => {
    dispatch(decrementCart(item));
  };

  // Handle item removal
  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
  };
  const handleContinue = () => {
    setContinueSumamryData(true); // send true to parent
  };

  const handleCancel = () => {
    setContinueSumamryData(false); // send false to parent
  };
  useEffect(() => {
    if (CartItems.length <= 0) {
      router.push('/');
    }
  }, [CartItems, router]);

  if (!isAuth) {
    return (
      <div className="p-4 rounded mb-2 bg-[#fff]">
        <h2 className="text-[16px] font-semibold text-[#878787] flex items-center gap-1">
          <span className="h-5 w-5 bg-[#f0f0f0] text-[#e96f84] text-center flex flex-row items-center justify-center">
            3
          </span>
          ORDER SUMMARY
        </h2>
      </div>
    );
  }
  if (!showSummary) {
    return (
      <div className="p-4 rounded mb-2 bg-[#fff]">
        <h2 className="text-[16px] font-semibold text-[#878787] flex items-center gap-1">
          <span className="h-5 w-5 bg-[#f0f0f0] text-[#e96f84] text-center flex flex-row items-center justify-center">
            3
          </span>
          ORDER SUMMARY
        </h2>
      </div>
    );
  }
  return (
    <>
      {
        continueSumamryData ? (<>
          <div className="bg-white  rounded shadow-sm p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 font-medium text-sm text-[#878787]">
                <span className="h-5 w-5 bg-[#f0f0f0] text-[#2874f0] text-xs font-bold flex items-center justify-center rounded">
                  3
                </span>
                <span>ORDER SUMMARY</span>
                <span className="text-[#2874f0]">
                  <FaCheck size={14} />
                </span>
              </div>
              <div className="mt-1 text-sm text-black ml-6">
                <span className="font-semibold">{CartItems?.length || 0} items</span>

              </div>
            </div>
            <button className="text-[#2874f0] font-medium text-sm border border-[#e0e0e0] px-4 py-1 rounded hover:bg-[#f5faff]" onClick={() => handleCancel()}>
              CHANGE
            </button>
          </div>
        </>) : (<>
          <div className="rounded-md shadow-md bg-white flex flex-col gap-1">
            {/* Header */}
            <div className="bg-[#2f415d] px-6 py-3 rounded-t-md">
              <div className="flex items-center gap-2">
                <span className="bg-white text-[#2874f0] text-xs font-bold px-2 py-1 rounded">3</span>
                <span className="text-white font-semibold text-sm tracking-wide">ORDER SUMMARY</span>
              </div>
            </div>

            {/* Product Info */}
            {CartItems?.length > 0 && CartItems.map((item) => (
              <div key={item.AttributeId} className="flex flex-col sm:flex-row gap-4 p-4">
                {/* Image */}
                <Image
                  src={item.thumbnail}
                  alt={item.name}
                  width={96}
                  height={128}
                  className="w-24 h-32 object-contain"
                />

                {/* Details */}
                <div className="flex-1 gap-1">
                  <div className="font-medium text-md text-[#212121]">
                    {item.name}
                  </div>
                  <div className="text-md mt-1">
                    Seller: <span className="text-[#878787]">{item.shopName}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="line-through text-gray-500">₹{item.Mrp}</span>
                    <span className="text-black font-bold">₹{item.Price}</span>
                    <span className="text-green-600 text-sm font-semibold">
                      {Math.round(((item.Mrp - item.Price) / item.Mrp) * 100)}% Off
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex flex-row items-center border rounded-sm">
                      <button className="px-2 text-2xl py-0.5" onClick={() => handleDecrement(item)}>−</button>
                      <span className="px-5 py-1">{item.cart_Quentity}</span>
                      <button className="px-2 text-2xl py-0.5" onClick={() => handleIncrement(item)}>+</button>
                    </div>
                    <button className="text-[#212121] text-sm ml-4 font-semibold" onClick={() => handleRemove(item)}>
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Email & Continue */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-3">
              <div className="text-sm">
                Order confirmation email will be sent to{" "}
                <span className="border-b border-blue-600 px-1">
                  {loginData?.Email || "your email"}
                </span>
              </div>
              <button className="hover:bg-[#2f415d] bg-[#e96f84] text-white px-6 py-2 rounded-md font-medium" onClick={() => { handleContinue(), dispatch(setCheckoutStep(4)); }}>
                CONTINUE
              </button>
            </div>
          </div>
        </>)
      }

    </>

  );
};

export default OrderSummary;
