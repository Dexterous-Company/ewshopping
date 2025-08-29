"use client";
import { Button, FormControl, TextField } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { FiPlus, FiMinus } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { RiCoinFill } from "react-icons/ri";
import { IoIosInformationCircle } from "react-icons/io";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaShippingFast } from "react-icons/fa";
import { BiSolidCoinStack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementCart, removeFromCart } from "@/redux/cart/CartSlice";
import { useRouter } from "next/navigation";
const CartLeft = () => {
  const { CartItems, TotalMrp, TotalPrice, amountToGetfeeDelivery, DeliveryCharge, amountToGetfeeDeliveryPercentage } = useSelector((state) => state.cart);
  const { loginData, isAuth, user_address, current_address } = useSelector((store) => store.Athentication);
  const dispatch = useDispatch()
  const [close, setClose] = useState(true);
  const [count, setCount] = useState(1);
  const [addressModel, setAddressModel] = useState(false);
  const [Remove, setRemove] = useState(false);
  const [info, setInfo] = useState(false);
  const infoRef = useRef(null);
  const [isCoupon, setIsCoupon] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setInfo(false);
      }
    };
    if (info) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("mouseleave", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [info]);

  const handleIncrement = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecrement = (item) => {
    dispatch(decrementCart(item));
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
  };

  if (!CartItems || CartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
      </div>
    );
  }

  const formatInTZ = (date, timeZone = "Asia/Kolkata") =>
    new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone,
    }).format(date);
  const deliveryTime = "11:00 PM"
  const { today, tomorrow, after3Days } = useMemo(() => {
    const now = new Date();
    const t = (d) => new Date(d.getTime()); // clone
    const today = t(now);
    const tomorrow = t(now); tomorrow.setDate(tomorrow.getDate() + 1);
    const after3Days = t(now); after3Days.setDate(after3Days.getDate() + 3);
    return { today, tomorrow, after3Days };
  }, []);
  return (
    <>
      <div className="hidden sm:flex flex-row justify-between w-full items-center px-3 py-3 bg-white">
        <span className="text-base ">From Saved Address</span>
        <div className="whitespace-nowrap text-xs">
          <Button
            type="submit"
            variant="outlined"
            size="small"
            onClick={() => setAddressModel(!addressModel)}
            className="hover:bg-[#143741] hover:text-white transition-colors duration-300"
          >
            Enter Delivery Pincode
          </Button>
        </div>
      </div>

      {close && (
        <>
          {amountToGetfeeDeliveryPercentage === 0 || DeliveryCharge !== 0 ? (
            <div className="bg-[#fff3cd] py-1.5 flex justify-between items-center px-5 rounded">
              <div className="flex flex-row gap-1 items-center text-sm lg:text-base">
                <FaShippingFast className="text-[#664d03]" />
                <span className="text-[#664d03] font-medium">
                  Only ₹{amountToGetfeeDelivery} away from <b>Free Shipping</b>
                </span>
              </div>
              <RxCross2
                onClick={() => setClose(!close)}
                className="cursor-pointer hover:scale-110 transition-transform"
              />
            </div>
          ) : (
            <div className="bg-[#d1e7dd] py-1.5 flex justify-between items-center px-5 rounded">
              <div className="flex flex-row gap-1 items-center text-sm lg:text-base">
                <FaShippingFast className="text-[#0f5132]" />
                <span className="text-[#0f5132] font-bold">Congratulations!</span>
                <span className="text-[#0f5132] text-[0.7rem] sm:text-base font-medium">
                  You've got free shipping!
                </span>
              </div>
              <RxCross2
                onClick={() => setClose(!close)}
                className="cursor-pointer hover:scale-110 transition-transform"
              />
            </div>
          )}
        </>
      )}

      {/* current_address */}
      {/* {current_address?.HNo}, {current_address?.locality}, {current_address?.City},{" "}
                      {current_address?.State} - {current_address?.Pincode} */}
      {
        current_address &&
        <div className="shadow rounded-md p-4 bg-white flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <p className="text-[12px] sm:text-sm text-gray-800  checkOutStyles">
              Deliver to:{" "}
              <span className="font-semibold text-[#111112] checkOutStyles">{loginData?.Name}, {current_address?.Pincode}</span>
              <span className="ml-2 px-1 pppo9y-0.5 text-[10px] sm:text-xs border rounded-sm text-gray-600 bg-gray-100">
                {current_address?.Type}
              </span>
            </p>
            <p className=" text-[10px] sm:text-sm text-[#717478] mt-1 checkOutStyles">
              {current_address?.HNo}, {current_address?.locality}, {current_address?.City},
              {current_address?.State} 
            </p>
          </div>
          <button className="text-blue-600 text-sm h-7 w-20 sm:h-10 sm:w-23 rounded-sm border border-[#e0e0e0] shadow-sm checkOutStyles" onClick={()=>router.push("/accounts/address")}>
            Change
          </button>
        </div>
      }


      <div className="flex flex-col g-0">
        {CartItems?.length > 0 &&

          CartItems.map((item, index) => (

            <React.Fragment key={index}>
              <div className="flex flex-row p-3 bg-white hover:shadow-md transition-shadow duration-300 rounded-sm shadow">
                {/* Product Image + Quantity */}
                <div className="w-1/5 flex flex-col items-center gap-5">
                  <div>
                    <img
                      src={item.thumbnail}
                      className="w-30 h-30 object-contain hover:scale-105 transition-transform"
                      alt={item.name}
                    />
                  </div>
                  <div className="border lg:ml-0 ml-4 border-[#ddd] flex py-1.5 rounded-sm flex-row gap-3 lg:px-2 px-1 items-center hover:border-[#ddd]">
                    <FiMinus
                      className="h-3 w-3 cursor-pointer hover:text-[#143741]"
                      onClick={() => handleDecrement(item)}
                    />
                    <span className="h-6 lg:w-6 w-2 text-center text-sm text-[#171717] flex items-center justify-center">
                      {item.cart_Quentity}
                    </span>
                    <FiPlus
                      className="h-3 w-3 cursor-pointer hover:text-[#143741]"
                      onClick={() => handleIncrement(item)}
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-between pl-8 w-3/4">
                  <div className="w-full flex flex-col">
                    <span className="text-[1rem] hidden sm:block text-black font-medium text-[#212121]">
                      {item.name}
                    </span>
                    <span className="text-[1rem] block sm:hidden text-black font-medium">
                      {item.name.slice(0, 20)}...
                    </span>
                    <span className="text-[.9rem] text-gray-600 font-normal">
                      {item.storage || "Variant Info"}
                    </span>
                    <span className="text-[.8rem] text-gray-600">
                      Seller : {item.shopName}
                    </span>

                    {/* Price Section */}
                    <div className="flex flex-row gap-2 items-center ">
                      <span className="line-through tex-gray-400 text-sm">
                        ₹{item.Mrp.toLocaleString()}
                      </span>
                      <span className="text-xl text-[#212121] font-semibold">
                        ₹{item.Price.toLocaleString()}
                      </span>
                      <span className="text-green-700 text-sm flex flex-row gap-2 items-center">
                        {Math.round(
                          ((item.Mrp - item.Price) / item.Mrp) * 100
                        )}
                        % Off{" "}
                        <IoIosInformationCircle onClick={() => setInfo(!info)} />
                      </span>
                    </div>

                    <div className="flex flex-row gap-2 items-center">
                      <span className=" tex-gray-400 text-sm">
                        + ₹69 protected promise fee
                      </span>
                    </div>
                    <div className="flex text-sm flex-row gap-2 items-center">
                      Or Pay ₹ {(item.Price / 12).toFixed(0)} +
                      <BiSolidCoinStack color="yellow" />100
                    </div>
                  </div>
                  {/* Mobile Delivery Info */}
                  <div className="block lg:hidden ">
                    <span className="text-xs text-center whitespace-nowrap">
                      <strong className="text-sm">Delivery on{" "}{formatInTZ(tomorrow)}</strong>
                    </span>
                  </div>
                  {/* Buttons */}
                  <div className="hidden lg:block">
                    <div className="flex flex-row gap-2">
                      {/* <Button
                        type="submit"
                        variant="text"
                        size="small"
                        sx={{ color: "black", fontWeight: 600 }}
                        className="hover:bg-gray-100"
                      >
                        SAVE FOR LATER
                      </Button> */}
                      <Button
                        type="submit"
                        variant="text"
                        size="small"
                        sx={{ color: "#212121", fontWeight: 600 }}
                        onClick={() => handleRemove(item)}
                        className="hover:bg-red-50"
                      >
                        REMOVE
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Desktop Delivery Info */}
                <div className="hidden lg:block">
                  <span className="text-sm whitespace-nowrap">
                    {/* Delivery by 11 PM, Tomorrow */}
                    <strong className="text-sm">Delivery on {formatInTZ(tomorrow)}</strong>
                  </span>
                </div>
              </div>

              {/* Mobile Buttons Row */}
              <div className="w-full bg-white lg:px-5 flex lg:text-base text-xs justify-between items-center gap-1 flex-row sm:h-0 h-12 lg:my-0.5 border-b border-[#f0f0f0]">
                {/* <span className="block lg:hidden cursor-pointer border-gray-300 border-r text-black lg:w-[25%] w-[35%] px-2 flex justify-center items-center h-full flex-row text-center hover:bg-gray-100">
                  Save For Later
                </span> */}
                <span
                  onClick={() => handleRemove(item)}
                  className=" lg:hidden cursor-pointer border-gray-300 border-r text-black lg:w-[25%] w-[35%] px-2 flex justify-center items-center h-full flex-row text-center hover:bg-gray-100"
                >
                  Remove
                </span>
                <div className="block lg:hidden align-center text-center justift-center">
                  <span
                    onClick={() => setIsCoupon(!isCoupon)}
                    className="cursor-pointer mr-3 rounded-sm text-black flex justify-center items-center h-full flex-row text-center hover:bg-gray-100 transition-colors"
                  >
                    Apply Coupon
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
      </div>

      {/* <div className="w-full bg-[#fff] h-20 flex  justify-end items-center">
        <button className="uppercase w-40 h-12 rounded-sm bg-[#e96f84] text-[#ffff]">Place order</button>
      </div> */}
      {/* Address Modal */}
      {addressModel && (
        <div className="inset-0 px-4 top-0 fixed bg-black/30 z-[999] flex justify-center items-center">
          <div className="w-full max-w-md p-5 bg-white rounded-lg animate-fadeIn">
            <div>
              <div className="flex flex-row justify-between w-full checkOutStyles">
                <span>Select Delivery address</span>
                <RxCross2
                  size={15}
                  onClick={() => setAddressModel(!addressModel)}
                  className="cursor-pointer hover:rotate-90 transition-transform"
                />
              </div>
              <div className="my-3 flex flex-col gap-3 h-[30vh] overflow-y-auto pr-2">
                {[1, 2, 3, 4, 5, 7].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <div className="w-4 h-4 min-w-4 border border-gray-500 rounded-full mt-1 hover:border-[#143741]"></div>
                    <div className="flex flex-col text-sm">
                      <span className="flex flex-wrap items-center font-medium">
                        Customer Name, Pincode&nbsp;
                        <span className="text-[.6rem] text-gray-500 font-normal">
                          HOME
                        </span>
                      </span>
                      <div className="my-2">
                        <span className="text-xs text-black/70 leading-tight">
                          Sharada complex near Ratnadeep, SR Nagar, Hyderabad
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span>Use Pincode to check delivery Info</span>
              <div className="flex flex-row gap-2 my-3">
                <TextField
                  placeholder="Enter Pincode"
                  fullWidth
                  size="small"
                  className="hover:border-[#143741]"
                />
                <Button
                  type="submit"
                  variant="contained"
                  className="hover:bg-[#0e2a33]"
                >
                  Submit
                </Button>
              </div>
              <span className="text-[1rem] text-[#143741] items-center flex flex-row gap-2 cursor-pointer hover:text-[#0e2a33]">
                <FaMapLocationDot size={15} />
                use my current Location
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Remove Modal */}
      {Remove && (
        <div className="inset-0 px-4 top-0 fixed bg-black/30 z-[999] flex justify-center items-center">
          <div className="w-full max-w-md p-5 bg-white rounded-lg animate-fadeIn">
            <div>
              <div className="flex flex-row justify-between cursor-pointer w-full whitespace-nowrap">
                <span>Are you sure you want to remove from the cart</span>
                <RxCross2
                  size={15}
                  onClick={() => setRemove(!Remove)}
                  className="hover:rotate-90 transition-transform"
                />
              </div>
              <div className="flex flex-row gap-2 mt-4 justify-between items-center">
                <Button
                  type="reset"
                  variant="outlined"
                  className="hover:border-[#143741] hover:text-[#143741]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="hover:bg-[#0e2a33]"
                >
                  ok
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isCoupon && (
        <div
          px-4
          className="inset-0 top-0 fixed bg-black/30 z-[999] flex justify-center items-center"
        >
          <div className="w-full max-w-md p-5 bg-white rounded-lg animate-fadeIn">
            <div className="w-full justify-between flex mb-3 items-center">
              <span className="text-[1rem] font-semibold">Coupon</span>
              <RxCross2
                onClick={() => setIsCoupon(false)}
                className="cursor-pointer hover:rotate-90 transition-transform"
              />
            </div>
            <span className="text-[1rem] font-medium">
              Enter your coupon code if you have one
            </span>
            <div className="mt-2">
              <FormControl fullWidth>
                <TextField
                  placeholder="Enter Coupon Code"
                  size="small"
                  className="hover:border-[#143741]"
                />
              </FormControl>
            </div>
            <div className="w-[90%] mt-3 items-center flex flex-row justify-end">
              <Button
                type="submit"
                variant="contained"
                disabled
                className="hover:bg-[#0e2a33]"
              >
                Verify
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartLeft;
