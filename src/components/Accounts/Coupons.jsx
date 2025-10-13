"use client";
import React, { useEffect, useState } from "react";
import { RiCoupon5Fill, RiCoupon3Fill, RiCoupon2Fill } from "react-icons/ri";
import { BiSolidCoupon } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUserCoupons } from "@/redux/coupon/couponSlice";

const data = [
  {
    Name: "All Coupon",
    count: 5,
    Icon: <RiCoupon2Fill />,
  },
  {
    Name: "Expired Coupon",
    count: 5,
    Icon: <BiSolidCoupon />,
  },
  {
    Name: "Available Coupon",
    count: 5,
    Icon: <RiCoupon5Fill />,
  },
  {
    Name: "Used Coupon",
    count: 5,
    Icon: <RiCoupon3Fill />,
  },
];

const qa = [
  {
    question: "What is the offer ? ",
    Answer: ["Flat 12% off upto 100"],
  },
  {
    question: "What are the offer benefits ? ",
    Answer: ["Flat 12% off upto 100"],
  },
  {
    question: "What is the offer duration ? ",
    Answer: ["Still the stock losts"],
  },
  {
    question: "Other Terms & Cinditions ",
    Answer: [
      "This Offer valids until stocks last or till the offer ends",
      "Final price is Inclusive of the offer",
      "Offer is applicable on selected products & brands",
    ],
  },
];

const Coupons = () => {
  const dispatch = useDispatch();
  const { loginData } = useSelector((state) => state.Athentication);
  useEffect(() => {
    dispatch(getUserCoupons(loginData._id));
  }, [dispatch, loginData._id]);
  const { availableCoupons } = useSelector((state) => state.coupon);
  const router = useRouter();
  const [modal, setModal] = useState({ type: null, index: null });
  // Format date to display in a user-friendly way
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  return (
    <div className="sm:px-4 px-2 relative py-2 w-full sm:h-[70vh] sm:mb-0 mb-10 overflow-y-auto">
      <div className="font-semibold flex flex-row justify-between items-center gap-2 text-lg text-[#2f415d] mb-4">
        <div className="block sm:hidden">
          <span
            className=" flex flex-row gap-2"
            onClick={() => router.back("")}
          >
            <IoIosArrowRoundBack size={30} />
            <span>Manage Your Coupons</span>
          </span>
        </div>
        <div
          className="block sm:hidden"
          onClick={() => setModal({ type: "Add", index: null })}
        >
          <button className="bg-[#2f415d] px-4 py-1.5 text-sm text-white">
            Add Coupon
          </button>
        </div>
      </div>
      <div className="grid sm:grid-cols-4 grid-cols-2 sm:gap-4 gap-3 whitespace-nowrap">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl text-[#2f415d]">{item.Icon}</div>
              <div className="flex flex-col">
                <span className="sm:text-sm text-xs font-medium text-[#2f415d]">
                  {item.Name}
                </span>
                <span className="text-xs text-gray-500">
                  Total: {availableCoupons?.length || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className=" sm:mt-5 mt-3 px-4 py-3 sm:shadow-md shadow-sm w-full flex flex-col gap-4">
        {availableCoupons?.map((item, index) => (
          <div
            key={index}
            className={`flex justify-between w-full items-start border  border-gray-300 p-4 rounded-md transition-all duration-150 cursor-pointer hover:shadow-md hover:bg-gray-50`}
          >
            <div className="flex flex-col gap-2 items-start w-full">
              <div className="flex flex-row justify-between w-full items-center">
                <span className="text-green-600 font-medium text-xs sm:text-[1rem]">
                  {item.discountValue}% {item.discountType === 'percentage' ? 'off' : 'discount'} (Max ₹{item.maxDiscount})
                </span>
                <span className="text-gray-500 font-medium text-[0.55rem] sm:text-[1rem]">
                  Valid till {formatDate(item.validUntil)}
                </span>
              </div>
              <div className="flex flex-row justify-between sm:w-full items-center">
                <span className="text-black font-medium text-xs sm:text-sm">
                  Code: {item.code} | Min purchase: ₹{item.minPurchase}
                </span>
                <span
                  onClick={() => setModal({ type: "View", index })}
                  className="text-[#e96184] font-semibold text-xs whitespace-nowrap ml-3 w-1/5 items-end flex flex-row justify-end sm:text-sm"
                >
                  View T&C
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal.type === "Add" && (
        <div
          className="fixed flex flex-col justify-end bg-black/20 inset-0 z-[99]"
          onClick={() => setModal({ type: null })}
        >
          <div
            className="bg-white p-4 flex flex-col gap-2 py-2 rounded shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-4">
              <FormControl fullWidth size="small">
                <InputLabel shrink>Enter Coupon Code</InputLabel>
                <TextField
                  placeholder="Enter coupon code"
                  variant="outlined"
                  size="small"
                />
              </FormControl>
            </div>
            <button className="w-full bg-[#2f415d] text-sm py-2 text-white flex flex-row justify-center items-center">
              Add Coupon
            </button>
          </div>
        </div>
      )}
      {modal.type === "View" && modal.index !== null && availableCoupons?.[modal.index] && (
        <div
          onClick={() => setModal({ type: null, index: null })}
          className="inset-0 z-[50] sm:px-0 px-4 fixed justify-center items-center flex w-full bg-black/20"
        >
          <div className="bg-white p-4 flex flex-col max-h-[50vh] overflow-y-auto gap-2 sm:w-1/4 w-full" onClick={(e) => e.stopPropagation()}>
            <div className="font-semibold text-sm bg-[#2f415d] px-3 py-2 text-white">Terms and Conditions</div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm">What is the offer?</span>
              <span className="text-xs font-medium">
                {availableCoupons[modal.index].discountValue}% {availableCoupons[modal.index].discountType === 'percentage' ? 'off' : 'discount'} (Max ₹{availableCoupons[modal.index].maxDiscount})
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm">What is the offer duration?</span>
              <span className="text-xs font-medium">
                Valid from {formatDate(availableCoupons[modal.index].validFrom)} to {formatDate(availableCoupons[modal.index].validUntil)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm">Other Terms & Conditions</span>
              <div className="text-xs font-medium flex flex-col gap-0.5">
                {availableCoupons[modal.index].termsAndConditions?.map((term, i) => (
                  <span key={i}>- {term}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;