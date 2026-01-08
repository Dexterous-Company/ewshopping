"use client";
import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { IoIosInformationCircle } from "react-icons/io";
import { FaShippingFast } from "react-icons/fa";
import { BiSolidCoinStack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decrementCart,
  removeFromCart,
} from "../../redux/cart/CartSlice";
import { useRouter } from "next/navigation";

const CartLeft = () => {
  // Safely get cart data with fallbacks
  const cartData = useSelector((state) => state.cart);
  const {
    CartItems = [],
    TotalMrp = 0,
    TotalPrice = 0,
    amountToGetfeeDelivery = 0,
    DeliveryCharge = 0,
    amountToGetfeeDeliveryPercentage = 0,
  } = cartData || {};

  

  // Safely get authentication data with fallbacks
  const authData = useSelector((state) => state.Athentication) || {};
  const loginData = authData.loginData || {};
  const current_address = authData.current_address || null;
  

  const dispatch = useDispatch();
  const [close, setClose] = useState(true);
  const [addressModel, setAddressModel] = useState(false);
  const [Remove, setRemove] = useState(false);
  const [info, setInfo] = useState(false);
  const infoRef = useRef(null);
  const [isCoupon, setIsCoupon] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setInfo(false);
      }
    };

    if (info) {
      document.addEventListener("mousedown", handleClickOutside);
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

  // Early return for empty cart
  if (!CartItems || CartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
      </div>
    );
  }

  // Format date helper with error handling
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  // Calculate dynamic 7–10 day delivery range with error handling
  const getDeliveryRange = () => {
    try {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() + 7);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 10);

      return `${formatDate(startDate)} to ${formatDate(endDate)}`;
    } catch (error) {
      console.error("Delivery range calculation error:", error);
      return "Soon";
    }
  };

  const deliveryRange = getDeliveryRange();

  // Safe item properties access
  const getItemProperties = (item) => {
    return {
      id: item.id || item._id || Math.random().toString(36).substr(2, 9),
      name: item.name || "Product Name",
      thumbnail: item.thumbnail || "/placeholder-image.jpg",
      Mrp: item.Mrp || 0,
      Price: item.Price || 0,
      storage: item.storage || "",
      cart_Quentity: item.cart_Quentity || 1,
      discountPercentage:
        Math.round(((item.Mrp - item.Price) / item.Mrp) * 100) || 0,
    };
  };

  return (
    <>
      <div className="hidden sm:flex flex-row justify-between w-full items-center px-3 py-3 bg-white">
        <span className="text-base">From Saved Address</span>
      </div>

      {close && (
        <>
          {amountToGetfeeDeliveryPercentage === 0 || DeliveryCharge !== 0 ? (
            <div className="bg-[#fff3cd] py-2 flex justify-between items-center px-3 sm:px-5 rounded mx-2 sm:mx-0">
              <div className="flex flex-row gap-1 items-center text-xs sm:text-base">
                <FaShippingFast className="text-[#664d03] text-sm sm:text-base" />
                <span className="text-[#664d03] font-medium text-xs sm:text-sm">
                  Only ₹{amountToGetfeeDelivery} away from <b>Free Shipping</b>
                </span>
              </div>
              <RxCross2
                onClick={() => setClose(false)}
                className="cursor-pointer hover:scale-110 transition-transform text-sm sm:text-base"
              />
            </div>
          ) : (
            <div className="bg-[#d1e7dd] py-2 mb-2 flex justify-between items-center px-3 sm:px-5 rounded mx-2 sm:mx-0">
              <div className="flex flex-row gap-1 items-center text-xs sm:text-base">
                <FaShippingFast className="text-[#0f5132] text-sm sm:text-base" />
                <span className="text-[#0f5132] font-bold text-xs sm:text-sm">
                  Congratulations!
                </span>
                <span className="text-[#0f5132] text-[0.6rem] sm:text-base font-medium hidden xs:block">
                  You've got free shipping!
                </span>
              </div>
              <RxCross2
                onClick={() => setClose(false)}
                className="cursor-pointer hover:scale-110 transition-transform text-sm sm:text-base"
              />
            </div>
          )}
        </>
      )}

      {/* Current Address Section - Mobile Improved */}
      {current_address ? (
        <div className="shadow rounded-md p-3 sm:p-4 bg-white flex justify-between items-start mb-4 mx-2 sm:mx-0">
          <div className="flex flex-col gap-1 flex-1 mr-2">
            <p className="text-xs sm:text-sm text-gray-800">
              Deliver to:{" "}
              <span className="font-semibold text-cyan-800 text-xs sm:text-sm">
                {loginData?.Name || "User"}, {current_address?.Pincode || ""}
              </span>
              <span className="ml-1 px-1 py-0.5 text-[10px] sm:text-xs border rounded-sm text-gray-600 bg-gray-100">
                {current_address?.Type || "Home"}
              </span>
            </p>
            <p className="text-cyan-800 text-xs sm:text-sm flex flex-row items-center select-none line-clamp-2">
              {current_address?.HNo || ""}, {current_address?.locality || ""},{" "}
              {current_address?.City || ""}, {current_address?.State || ""}
            </p>
          </div>
          <button
            className="text-blue-600 text-xs sm:text-sm h-7 px-2 sm:px-0 sm:w-24 rounded-sm border border-[#e0e0e0] shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
            onClick={() => router.push("/accounts/address")}
          >
            Change
          </button>
        </div>
      ) : (
        <div className="shadow rounded-md p-3 sm:p-4 bg-white flex justify-between items-start mb-4 mx-2 sm:mx-0">
          <div className="flex flex-col gap-1">
            <p className="text-xs sm:text-sm text-gray-800">
              No delivery address selected
            </p>
          </div>
          <button
            className="text-blue-600 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-md border border-[#e0e0e0] shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
            onClick={() => router.push("/accounts/address")}
          >
            Add Address
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:gap-4 px-2 sm:px-0">
        {CartItems.map((item, index) => {
          const {
            id,
            name,
            thumbnail,
            Mrp,
            Price,
            storage,
            cart_Quentity,
            discountPercentage,
          } = getItemProperties(item);

          return (
            <React.Fragment key={id}>
              {/* Mobile Card Layout */}
              <div className="flex flex-col sm:flex-row p-3 sm:p-4 bg-white hover:shadow-md transition-shadow duration-300 rounded-lg shadow-sm border border-gray-100">
                {/* Product Image & Basic Info - Mobile Stacked */}
                <div className="flex flex-row sm:flex-row w-full sm:w-4/5">
                  {/* Product Image */}
                  <div className="w-1/4 sm:w-1/5 flex justify-center sm:justify-start">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                      <img
                        src={thumbnail}
                        className="w-full h-full object-contain hover:scale-105 transition-transform"
                        alt={name}
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col justify-between pl-3 sm:pl-4 w-3/4 sm:w-4/5">
                    <div className="w-full flex flex-col gap-1">
                      <div className="text-sm sm:text-[1rem] font-medium text-[#212121] line-clamp-2 leading-tight">
                        {name.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")}
                      </div>

                      {storage && (
                        <span className="text-xs text-gray-500 font-normal">
                          {storage}
                        </span>
                      )}

                      {/* Price Section */}
                      <div className="flex flex-row gap-2 items-center mt-1">
                        <span className="line-through text-gray-400 text-xs">
                          ₹{Mrp.toLocaleString()}
                        </span>
                        <span className="text-base sm:text-xl text-blue-900 font-semibold">
                          ₹{Price.toLocaleString()}
                        </span>
                        <span className="text-green-700 text-xs flex flex-row gap-1 items-center">
                          {discountPercentage}% Off
                          <IoIosInformationCircle
                            className="cursor-pointer hover:text-blue-600 text-sm"
                            onClick={() => setInfo(!info)}
                          />
                        </span>
                      </div>

                      {/* Additional Info - Mobile Compact */}
                      <div className="flex flex-col gap-0.5 mt-1">
                        <span className="text-gray-500 text-xs">
                          + ₹69 protected promise fee
                        </span>
                        <div className="flex text-xs flex-row gap-1 items-center">
                          Or Pay ₹{(Price / 12).toFixed(0)} +
                          <BiSolidCoinStack color="gold" size={12} />
                          100
                        </div>
                      </div>
                    </div>

                    {/* Mobile Delivery Info */}
                    <div className="block sm:hidden mt-2">
                      <span className="text-xs text-gray-600">
                        Delivery between <strong>{deliveryRange}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop Controls - Unchanged */}
                <div className="hidden sm:flex flex-col items-end gap-3">
                  <span className="text-sm whitespace-nowrap text-gray-600">
                    Delivery between <strong>{deliveryRange}</strong>
                  </span>

                  <div className="border border-gray-300 flex py-1.5 px-1 rounded-md flex-row gap-1 items-center hover:border-gray-400 transition-colors">
                    <FiMinus
                      className="h-4 w-4 cursor-pointer hover:text-[#143741] transition-colors"
                      onClick={() => handleDecrement(item)}
                    />
                    <span className="h-6 w-6 text-center text-sm text-[#171717] flex items-center justify-center">
                      {cart_Quentity}
                    </span>
                    <FiPlus
                      className="h-4 w-4 cursor-pointer hover:text-[#143741] transition-colors"
                      onClick={() => handleIncrement(item)}
                    />
                  </div>

                  <Button
                    variant="text"
                    size="small"
                    sx={{ color: "#d32f2f", fontWeight: 600 }}
                    onClick={() => handleRemove(item)}
                    className="hover:bg-red-50"
                  >
                    REMOVE
                  </Button>
                </div>

                {/* Mobile Controls - Full Width */}
                {/* Mobile Controls - Perfectly Centered */}
                <div className="w-full flex sm:hidden justify-center items-center flex-row mt-3 pt-3 border-t border-gray-200 gap-4">
                  {/* Quantity Controls - Centered */}
                  <div className="flex items-center justify-center">
                    <div className="border border-gray-300 flex py-2 px-4 rounded-md flex-row gap-4 items-center hover:border-gray-400 transition-colors">
                      <FiMinus
                        className="h-4 w-4 cursor-pointer hover:text-[#143741] transition-colors"
                        onClick={() => handleDecrement(item)}
                      />
                      <span className="h-4 w-4 text-center text-sm text-[#171717] flex items-center justify-center">
                        {cart_Quentity}
                      </span>
                      <FiPlus
                        className="h-4 w-4 cursor-pointer hover:text-[#143741] transition-colors"
                        onClick={() => handleIncrement(item)}
                      />
                    </div>
                  </div>

                  {/* Action Buttons - Centered */}
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: "#2874f0",
                        borderColor: "#2874f0",
                        fontWeight: 400,
                        fontSize: "0.6rem",
                        padding: "6px 12px",
                        minWidth: "auto",
                        textTransform: "none",
                      }}
                      onClick={() => handleRemove(item)}
                      className="hover:bg-blue-50"
                    >
                      Remove
                    </Button>

                    {/* Buy Now Button - Flipkart Style */}
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#fb641b",
                        color: "#fff",
                        fontWeight: 400,
                        fontSize: "0.6rem",
                        padding: "6px 16px",
                        minWidth: "auto",
                        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.2)",
                        "&:hover": {
                          backgroundColor: "#e55b17",
                          boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
                        },
                        textTransform: "none",
                        borderRadius: "2px",
                      }}
                      onClick={() => {
                        // Handle immediate purchase
                        router.push("/checkout");
                      }}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Rest of your modals remain the same */}
      {addressModel && (
        <div className="fixed inset-0 px-4 top-0 bg-black/30 z-[999] flex justify-center items-center">
          {/* Modal content */}
        </div>
      )}

      {Remove && (
        <div className="fixed inset-0 px-4 top-0 bg-black/30 z-[999] flex justify-center items-center">
          {/* Modal content */}
        </div>
      )}

      {isCoupon && (
        <div className="fixed inset-0 top-0 bg-black/30 z-[999] flex justify-center items-center px-4">
          {/* Modal content */}
        </div>
      )}
    </>
  );
};

export default CartLeft;
