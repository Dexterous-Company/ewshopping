"use client"
import { clearCart, getCartData, getCartTotal } from "@/redux/cart/CartSlice";
import { newOrder, setcurrentOrder } from "@/redux/order/OrderSlice";
import { useRouter } from "next/navigation";

import React, { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaClock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const PaymentOptions = ({ continueSumamryData, showSummary }) => {
  const { loginData, otp, mob, current_address, isAuth } = useSelector(
    (store) => store.Athentication
  );

  const {
    CartItems,
    amountToGetfeeDelivery,
    amountToGetfeeDeliveryPercentage,
    TotalPrice,
    TotalAmount,
    HandlingFee,
    coupon,
    DeliveryCharge,
    rainStatus,
    RainFee,
    Netpayable,
    SmallCartFee,
    wallet,
    TotalMrp,
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter()
  const [showConfirmOrder, setShowConfirmOrder] = useState(false)
  const [buttonPress, setbuttonPress] = useState(false);
  const [orderComment, setorderComment] = useState("")

  const [selectedPayment, setSelectedPayment] = useState("COD");
  useEffect(() => {
    dispatch(getCartData())
  }, [dispatch])

  useEffect(() => {
    if (selectedPayment === "COD") {
      setShowConfirmOrder(true)
    } else {
      setShowConfirmOrder(false)
    }
  }, [selectedPayment])

  const handleSelect = (method, e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (method !== "COD") {
      toast.error("Currently, only Cash on Delivery (COD) is available");
      return;
    }
    setSelectedPayment(method);
    setShowConfirmOrder(true);
  };

  const [timeLeft, setTimeLeft] = useState(13 * 60 + 31); // 13 min 31 sec

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs} : ${mins} : ${secs}`;
  };

  const cash_on_delivery_press = async (e) => {
    e.preventDefault();
    setbuttonPress(true);
    try {
      if (CartItems.length > 0 && current_address !== "") {
        const address_values = Object.values(current_address);
        const address_string = address_values.join(",");
        var date = new Date();
        date.setDate(date.getDate() + 4);
        var today_date = new Date();
        today_date.setDate(today_date.getDate());
        let all_post_orders = [];
        for (let index = 0; index < CartItems.length; index++) {
          let cartItem = CartItems[index];
          let order_form = {};
          try {
            order_form = {
              Mrp: cartItem?.Mrp,
              Price: cartItem?.Price,
              Product_total_Mrp: cartItem?.Product_total_Mrp,
              Product_total_Price: cartItem?.Product_total_Price,
              Product_total_Saving: cartItem?.Product_total_Saving,
              cart_Quentity: Number(cartItem?.cart_Quentity),
              ProductName: cartItem?.name,
              ProductId: cartItem?.AttributeId,
              shopId: cartItem?.shopId,
              shopName: cartItem?.shopName,
              slugurl: cartItem?.slugurl,
              thumbnail: cartItem?.thumbnail,
              userId: loginData._id,
              UserName: loginData.Name,
              UserEmail: loginData.Email,
              UserMobile: loginData.Mobile,
              Address: address_string,
              TotalMrp: cartItem.Product_total_Mrp,
              TotalPrice: cartItem.Product_total_Price,
              SmallCartFee: SmallCartFee,
              HandllingFee: HandlingFee,
              RainFee: RainFee,
              DeliveryCharge: DeliveryCharge,
              wallet: wallet,
              coupon: coupon,
              Saving: cartItem.Product_total_Mrp - cartItem.Product_total_Price,
              TotalAmount:
                cartItem.Product_total_Price +
                SmallCartFee +
                HandlingFee +
                RainFee +
                DeliveryCharge,
              Netpayable:
                cartItem.Product_total_Mrp +
                SmallCartFee +
                HandlingFee +
                RainFee +
                DeliveryCharge -
                wallet -
                coupon,
              PaymentMode: "Cash on Delivery",
              PaymentStatus: "Not Paid",
              TxnId: "",
              ExpectedDelDate: date,
              OrderComment: orderComment,
              OrderprocessDate: {
                OrderBookedDate: today_date,
                OrderBookedDateShow: true,
              },
            };

            const order_post_respo = await dispatch(newOrder(order_form));
            if (order_post_respo.payload.success) {
              setbuttonPress(true);
              const order_respo = order_post_respo.payload.order;
              all_post_orders = [...all_post_orders, order_respo]
              router.push('/OrderSuccess')
              setbuttonPress(false);
            }
          } catch (error) {
            setbuttonPress(false);
          }
        }
      }
    } catch (error) {
      setbuttonPress(false);
    }
  };

  return (
    <>
      {isAuth && continueSumamryData && showSummary ? (
        <div className="rounded-md shadow-md bg-white flex flex-col gap-2">
          {/* Header */}
          <div>
            <div className="bg-[#2f415d] text-white px-4 py-2 rounded-t-md font-semibold flex items-center gap-2">
              <span className="h-5 w-5 flex items-center justify-center text-[#e96f84] bg-white rounded text-xs">
                4
              </span>
              PAYMENT OPTIONS
            </div>
            {/* Timer */}
            <div className="bg-[#ffffe6] px-4 py-2 text-sm text-gray-800">
              <span className="flex items-center gap-2">
                <FaClock className="text-red-500" />
                Complete payment in{" "}
                <span className="font-semibold">{formatTime(timeLeft)}</span>
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4 bg-[#fff]">
            {/* Payment Methods */}
            {["UPI", "Card", "NetBanking", "COD", "EMI"].map((method) => (
              <div
                key={method}
                className={`border rounded p-3 cursor-pointer ${
                  selectedPayment === method
                    ? "bg-blue-50 border-[#c2c2c2]"
                    : "border-transparent"
                }`}
              >
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === method}
                    onChange={(e) => handleSelect(method, e)}
                    className="cursor-pointer"
                  />
                  <div className="flex-1">
                    {method === "UPI" && (
                      <>
                        <div className="flex items-center gap-2">
                          <img
                            src="/assets/images/upi.jpg"
                            alt="upi"
                            className="w-10 h-10 cover"
                          />
                          <span className="font-semibold text-[#212121]">UPI</span>
                        </div>
                        <div className="pl-6 mt-2 space-y-1">
                          <p className="font-semibold text-sm text-[#212121]">
                            Choose an option
                          </p>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="radio" name="upiOption" />
                            Your UPI ID
                            <span className="text-[#212121]">Pay by any UPI app</span>
                          </label>
                        </div>
                      </>
                    )}
                    {method === "Card" && (
                      <>
                        <p className="text-[#212121]">Credit / Debit / ATM Card</p>
                        <p className="text-sm text-[#878787]">
                          Add and secure cards as per RBI guidelines
                        </p>
                      </>
                    )}
                    {method === "NetBanking" && (
                      <>
                        <p className="text-[#212121]">Net Banking</p>
                        <p className="text-sm text-[#878787]">
                          This instrument has low success, use UPI or cards for better
                          experience
                        </p>
                      </>
                    )}
                    {method === "COD" && (
                      <>
                        <span className="text-[#212121]">Cash on Delivery</span>
                        {showConfirmOrder && (
                          <div className="w-full flex justify-end items-center mt-2">
                            <button 
                              className="bg-[#2f415d] text-white px-4 py-2 rounded hover:bg-[#24324a]" 
                              onClick={(e) => cash_on_delivery_press(e)}
                              disabled={buttonPress}
                            >
                              {buttonPress ? "Processing..." : "Confirm Order"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                    {method === "EMI" && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#212121]">EMI (Easy Installments)</span>
                        <span className="text-gray-400 text-sm">Not applicable</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}

            {/* Add Gift Card */}
            <div className="px-4 py-3 border-t cursor-pointer text-blue-600 font-semibold text-sm flex items-center gap-2">
              <span className="text-lg font-bold">+</span> Add Gift Card
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded mb-2 bg-[#ffff]">
          <h2 className="text-[16px] font-semibold text-[#878787] flex flex-row items-center gap-1">
            <span className="h-5 w-5 bg-[#f0f0f0] text-[#e96f84] text-center flex flex-row items-center justify-center">
              4
            </span>
            PAYMENT OPTIONS
          </h2>
        </div>
      )}
    </>
  );
};

export default PaymentOptions;