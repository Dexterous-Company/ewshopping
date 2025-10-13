"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getCartData } from "@/redux/cart/CartSlice";
import { newOrder } from "@/redux/order/OrderSlice";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

// Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentOptions = ({ continueSumamryData, showSummary }) => {
  const { loginData, current_address, isAuth } = useSelector(
    (store) => store.Athentication
  );
  const {
    CartItems,
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
  const router = useRouter();

  const [selectedPayment, setSelectedPayment] = useState("RAZORPAY");
  const [showConfirmOrder, setShowConfirmOrder] = useState(false);
  const [buttonPress, setbuttonPress] = useState(false);
  const [orderComment, setorderComment] = useState("");
  const [timeLeft, setTimeLeft] = useState(13 * 60 + 31);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    dispatch(getCartData());
    loadRazorpay().then(setRazorpayLoaded);
  }, [dispatch]);

  useEffect(() => {
    if (selectedPayment === "COD") setShowConfirmOrder(true);
    else setShowConfirmOrder(false);
  }, [selectedPayment]);

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
    return `${hrs}:${mins}:${secs}`;
  };

  const decreaseProductStock = async (slugurl, quantity, variantId) => {
    try {
      await fetch(`${Baseurl}/api/v1/product/available_stock/${slugurl}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availablestock: quantity,
          variantId: variantId, // Add the variant ID
        }),
      });
    } catch (error) {
      console.error("Stock update failed:", error);
    }
  };

  const handleSelect = async (method, e) => {
    e.stopPropagation();
    if (method === "RAZORPAY") {
      if (!razorpayLoaded) {
        toast.error("Payment gateway is loading. Please try again.");
        return;
      }
      setSelectedPayment(method);
      await handleRazorpayPayment();
      return;
    }
    if (method !== "COD") {
      w;
      toast.error(
        "Currently, only Cash on Delivery (COD) and Online Payment are available"
      );
      return;
    }
    setSelectedPayment(method);
    setShowConfirmOrder(true);
  };

  const sendOrderSMS = async (mobile, orderId, ProductName) => {
    try {
      const smsResponse = await fetch(`${Baseurl}/api/v1/client/sendSMSOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobile,
          orderId: orderId + " for product " + ProductName +"...",
        }),
      });

      const smsResult = await smsResponse.json();
      console.log("SMS sent:", smsResult);
      return smsResult;
    } catch (error) {
      console.error("Failed to send SMS:", error);
      return { success: false, error: error.message };
    }
  };

  // Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    try {
      setbuttonPress(true);
      if (!razorpayLoaded) {
        toast.error("Payment gateway not loaded");
        setbuttonPress(false);
        return;
      }
      if (CartItems.length <= 0 || !current_address) {
        toast.error("Please select address and add items to cart");
        setbuttonPress(false);
        return;
      }

      const ordersArray = prepareOrderData();

      const razorpayOrderResponse = await fetch(
        `${Baseurl}/api/v1/order/razorpay/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Netpayable,
            // amount: 1,
            receipt: `receipt_${Date.now()}`,
            notes: {
              userId: loginData._id,
              cartItems: CartItems.length,
            },
          }),
        }
      );

      const razorpayOrderData = await razorpayOrderResponse.json();
      if (!razorpayOrderData.success) {
        throw new Error(
          razorpayOrderData.message || "Failed to create payment order"
        );
      }

      const options = {
        key: "rzp_live_RP3WMS74GDFC0c",
        amount: razorpayOrderData.order.amount,
        // amount: 1,
        currency: razorpayOrderData.order.currency,
        name: "Ewshopping",
        description: "Order Payment",
        image: "https://ewshopping.com/Logoe.png",
        order_id: razorpayOrderData.order.id,
        handler: async function (response) {
          console.log(ordersArray, "ordersArray,,,,");
          const verificationResponse = await verifyRazorpayPayment(
            response,
            ordersArray
          );

          if (verificationResponse.success) {
            // ✅ Decrease stock for each item
            for (const item of CartItems) {
              const availableStock = Number(item.availableStock);
              const cartQuantity = Number(item.cart_Quentity);
              console.log({ availableStock, cartQuantity });
              const newStock = availableStock - cartQuantity;
              console.log(newStock, "newstock");
              console.log(item.slugurl, newStock, item.AttributeId);

              if (availableStock !== 0) {
                await decreaseProductStock(
                  item.slugurl,
                  newStock,
                  item.AttributeId
                );
              }
            }

            // ✅ Send SMS for each order
            if (
              verificationResponse.orders &&
              verificationResponse.orders.length > 0
            ) {
              for (const order of verificationResponse.orders) {
                console.log(order, "order details");
                
                await sendOrderSMS(loginData.Mobile, order.ProductId.slice(-6), order.ProductName.slice(0, 9));
              }
            } else {
              // Fallback: Generate a simple order ID
              const fallbackOrderId = `ORD${Date.now()}`;
              await sendOrderSMS(loginData.Mobile, fallbackOrderId);
            }

            toast.success("Payment successful! Order placed.");
            router.push("/OrderSuccess");
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: loginData.Name,
          email: loginData.Email,
          contact: loginData.Mobile,
        },
        notes: { address: "Ewshopping Order" },
        theme: { color: "#2f415d" },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setbuttonPress(false);
      });
      razorpayInstance.open();
      setbuttonPress(false);
    } catch (error) {
      console.error("Razorpay payment error:", error);
      toast.error(error.message || "Payment initialization failed");
      setbuttonPress(false);
    }
  };

  // In verifyRazorpayPayment function, add logging:
  const verifyRazorpayPayment = async (response, ordersArray) => {
    console.log("Sending verification request with data:", {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      orderData: ordersArray,
    });

    try {
      const verifyResponse = await fetch(
        `${Baseurl}/api/v1/order/razorpay/verify-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: ordersArray,
          }),
        }
      );

      const result = await verifyResponse.json();
      console.log("Verification response:", result);
      return result;
    } catch (error) {
      console.error("Verification error:", error);
      return { success: false, message: error.message };
    }
  };

  // Updated prepareOrderData function in PaymentOptions component
  const prepareOrderData = () => {
    const address_string = current_address
      ? Object.values(current_address)
          .filter((val) => val)
          .join(", ")
      : "Address not provided";

    const today_date = new Date();
    const expected_date = new Date();
    expected_date.setDate(expected_date.getDate() + 4);

    return CartItems.map((item) => {
      // Calculate values with fallbacks
      const mrp = Number(item.Mrp) || 0;
      const price = Number(item.Price) || 0;
      const quantity = Number(item.cart_Quentity) || 1;
      const productTotalMrp = mrp * quantity;
      const productTotalPrice = price * quantity;
      const saving = productTotalMrp - productTotalPrice;
      return {
        // Product details
        Mrp: mrp,
        Price: price,
        Product_total_Mrp: productTotalMrp,
        Product_total_Price: productTotalPrice,
        Product_total_Saving: Math.max(saving, 0),
        cart_Quentity: quantity,
        ProductName: item?.name || "Product",
        ProductId: item?.AttributeId || item?.ProductId || "",
        shopId: item?.shopId || "",
        shopName: item?.shopName || "",
        slugurl: item?.slugurl || "",
        thumbnail: item?.thumbnail || "",

        // User details
        userId: loginData?._id || "",
        UserName: loginData?.Name || "",
        UserEmail: loginData?.Email || "",
        UserMobile: loginData?.Mobile || "",
        Address: address_string,

        // Pricing
        TotalMrp: productTotalMrp,
        TotalPrice: productTotalPrice,
        SmallCartFee: Number(SmallCartFee) || 0,
        HandllingFee: Number(HandlingFee) || 0,
        RainFee: Number(RainFee) || 0,
        DeliveryCharge: Number(DeliveryCharge) || 0,
        wallet: Number(wallet) || 0,
        coupon: Number(coupon) || 0,
        Saving: saving,

        // Calculations
        TotalAmount:
          productTotalPrice +
          (Number(SmallCartFee) || 0) +
          (Number(HandlingFee) || 0) +
          (Number(RainFee) || 0) +
          (Number(DeliveryCharge) || 0),

        Netpayable:
          productTotalPrice +
          (Number(SmallCartFee) || 0) +
          (Number(HandlingFee) || 0) +
          (Number(RainFee) || 0) +
          (Number(DeliveryCharge) || 0) -
          (Number(wallet) || 0) -
          (Number(coupon) || 0),

        // Payment info
        PaymentMode: "Online Payment",
        PaymentStatus: "Paid",
        TxnId: "",

        // Dates
        ExpectedDelDate: expected_date,
        OrderComment: orderComment || "",
        OrderprocessDate: {
          OrderBookedDate: today_date,
          OrderBookedDateShow: true,
        },
      };
    });
  };

  // COD Handler for multiple orders
  const cash_on_delivery_press = async (e) => {
    e.preventDefault();
    setbuttonPress(true);
    if (
      !CartItems.length ||
      !current_address ||
      !Object.keys(current_address).length
    ) {
      toast.error("Please select a valid address and cart items");
      setbuttonPress(false);
      return;
    }

    try {
      const ordersArray = prepareOrderData();
      const orderResults = [];

      for (const order of ordersArray) {
        const res = await dispatch(newOrder(order));
        if (!res?.payload?.success) {
          toast.error(res?.payload?.message || "Order failed");
          setbuttonPress(false);
          return;
        }

        orderResults.push(res.payload);

        const cartItem = CartItems.find(
          (i) => i.AttributeId === order.ProductId
        );
        console.log(cartItem, "cartitem");

        if (cartItem) {
          const newStock =
            Number(cartItem.availablestock) - Number(cartItem.cart_Quentity);
          console.log(newStock, "newStock");

          await decreaseProductStock(
            cartItem.slugurl,
            newStock,
            cartItem.AttributeId
          );
        }
      }

      // ✅ Send SMS for each successful order
      for (const result of orderResults) {
        if (result.order && result.order._id) {
          await sendOrderSMS(loginData.Mobile, result.order._id);
        } else if (result.orderId) {
          await sendOrderSMS(loginData.Mobile, result.orderId);
        } else {
          // Fallback order ID
          const fallbackOrderId = `ORD${Date.now()}`;
          await sendOrderSMS(loginData.Mobile, fallbackOrderId);
        }
      }

      toast.success("All orders placed successfully!");
      router.push("/OrderSuccess");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setbuttonPress(false);
    }
  };

  const paymentMethods = [
    {
      id: "RAZORPAY",
      label: "UPI / Credit Card / Debit Card / NetBanking",
      available: true,
    },
    // { id: "COD", label: "Cash on Delivery", available: true },
  ];

  return (
    <>
      {isAuth && continueSumamryData && showSummary ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl shadow-lg bg-white overflow-hidden"
        >
          <div className="bg-[#2f415d] text-white px-5 py-3 flex items-center gap-3 font-semibold text-lg">
            <span className="h-6 w-6 flex items-center justify-center text-[#e96f84] bg-white rounded-full text-sm font-bold">
              4
            </span>
            PAYMENT OPTIONS
          </div>

          <div className="bg-[#fff9db] px-5 py-2 text-sm text-gray-800 flex items-center font-semibold gap-2">
            <FaClock className="text-green-600 " />
            Complete Payment in{" "}
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>

          <div className="p-5 space-y-4">
            {paymentMethods.map((method) => (
              <motion.div
                key={method.id}
                whileHover={{ scale: method.available ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
                className={`border rounded-xl p-4 transition-shadow ${
                  method.available
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                } ${
                  selectedPayment === method.id
                    ? "bg-blue-50 border-blue-300 shadow-md"
                    : "border-gray-200 hover:shadow-sm"
                }`}
                onClick={(e) => method.available && handleSelect(method.id, e)}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === method.id}
                    onChange={(e) =>
                      method.available && handleSelect(method.id, e)
                    }
                    className="cursor-pointer accent-[#2f415d]"
                    disabled={!method.available}
                  />
                  <div className="flex-1">
                    {method.id === "RAZORPAY" && (
                      <div className="flex items-center gap-3">
                        <img
                          src="/assets/images/upi.jpg"
                          alt="Razorpay"
                          className="w-10 h-6 object-contain"
                        />
                        <span className="font-semibold text-gray-800">
                          {method.label}
                        </span>
                      </div>
                    )}
                    {method.id === "COD" && (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">
                            {method.label}
                          </span>
                          <AnimatePresence>
                            {showConfirmOrder && (
                              <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                onClick={(e) => cash_on_delivery_press(e)}
                                className="bg-[#2f415d] text-white px-4 py-2 rounded-lg hover:bg-[#e96f84] transition"
                                disabled={buttonPress}
                              >
                                {buttonPress
                                  ? "Processing..."
                                  : "Confirm Order"}
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </motion.div>
            ))}
          </div>

          <div className="px-5 py-3 border-t text-blue-600 font-semibold text-sm flex items-center gap-2 cursor-pointer hover:text-blue-800">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={(e) => handleSelect("RAZORPAY", e)}
              className="bg-[#2f415d] text-white px-4 py-2 rounded-lg hover:bg-[#e96f84] transition"
              disabled={buttonPress}
            >
              {buttonPress ? "Processing..." : "Pay Now"}
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <span></span>
      )}
    </>
  );
};
export default PaymentOptions;
