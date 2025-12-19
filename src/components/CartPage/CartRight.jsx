"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { getCartData } from "@/redux/cart/CartSlice";

const CartRight = () => {
  const [priceDetails, setPriceDetails] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    CartItems,
    DeliveryCharge,
    SmallCartFee,
    RainFee,
    HandlingFee,
    wallet,
    coupon,
    amountToGetfeeDelivery,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getCartData());
  }, [dispatch]);

  const TotalMrp = CartItems.reduce(
    (total, item) => total + (item.Product_total_Mrp || 0),
    0
  );
  const TotalPrice = CartItems.reduce(
    (total, item) => total + (item.Product_total_Price || 0),
    0
  );
  const discountAmount = Math.max(TotalMrp - TotalPrice, 0);
  const couponDiscount = coupon || 0;
  const totalSavings = discountAmount + couponDiscount;

  const calculatedTotalAmount =
    TotalPrice +
    (DeliveryCharge || 0) +
    (SmallCartFee || 0) +
    (RainFee || 0) +
    (HandlingFee || 0) -
    couponDiscount -
    (wallet || 0);

  const calculatedNetPayable = Math.max(calculatedTotalAmount, 0);

  return (
    <div className="bg-white w-full px-6 py-6 rounded-xl shadow-sm border border-gray-100 sticky top-6 self-start">
      {/* Price Details Header */}
      <div
        className="flex justify-between items-center cursor-pointer mb-6"
        onClick={() => setPriceDetails(!priceDetails)}
      >
        <span className="text-gray-900 text-lg font-semibold flex items-center gap-2">
          <span className="text-blue-600">💳</span>
          Price Summary
        </span>
        {priceDetails ? (
          <FaAngleUp className="text-gray-500" />
        ) : (
          <FaAngleDown className="text-gray-500" />
        )}
      </div>

      {priceDetails && (
        <div className="border-b py-5 border-gray-200 space-y-4">
          {/* Total MRP */}
          <div className="flex justify-between">
            <span className="text-gray-600">Total MRP</span>
            <span className="line-through text-gray-500">
              ₹{TotalMrp.toLocaleString()}
            </span>
          </div>

          {/* Total Price */}
          <div className="flex justify-between">
            <span className="text-gray-600">Total Price</span>
            <span className="text-gray-900 font-medium">
              ₹{TotalPrice.toLocaleString()}
            </span>
          </div>

          {/* Discount */}
          <div className="flex justify-between">
            <span className="text-gray-600">Discount</span>
            <span className="text-green-600 font-medium">
              -₹{discountAmount.toLocaleString()}
            </span>
          </div>

          {/* Coupon */}
          <div className="flex justify-between">
            <span className="text-gray-600">Coupon</span>
            <span
              className={`font-medium ${
                couponDiscount > 0 ? "text-green-600" : "text-gray-400"
              }`}
            >
              {couponDiscount > 0
                ? `-₹${couponDiscount.toLocaleString()}`
                : "Not Applied"}
            </span>
          </div>

          {/* Wallet */}
          {wallet > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Wallet Balance</span>
              <span className="text-green-600 font-medium">
                -₹{wallet.toLocaleString()}
              </span>
            </div>
          )}

          {/* Other Charges */}
          {DeliveryCharge > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charge</span>
              <span className="text-gray-900">
                ₹{DeliveryCharge.toLocaleString()}
              </span>
            </div>
          )}
          {SmallCartFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Small Cart Fee</span>
              <span className="text-gray-900">
                ₹{SmallCartFee.toLocaleString()}
              </span>
            </div>
          )}
          {RainFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Rain Protection Fee</span>
              <span className="text-gray-900">₹{RainFee.toLocaleString()}</span>
            </div>
          )}
          {HandlingFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Handling Fee</span>
              <span className="text-gray-900">
                ₹{HandlingFee.toLocaleString()}
              </span>
            </div>
          )}

          {/* You Saved */}
          <div className="flex justify-between text-green-600 font-medium pt-2 border-t border-gray-200">
            <span>Total Savings</span>
            <span>₹{totalSavings.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Total Amount */}
      <div className="flex justify-between my-5 py-4 border-b border-gray-200">
        <span className="text-lg font-semibold text-gray-900">
          Total Amount
        </span>
        <span className="font-semibold text-lg text-gray-900">
          ₹{calculatedTotalAmount.toLocaleString()}
        </span>
      </div>

      {/* Net Payable */}
      {calculatedNetPayable !== calculatedTotalAmount && (
        <div className="flex justify-between my-4 py-3 bg-blue-50 rounded-lg px-4">
          <span className="font-semibold text-gray-900">Net Payable</span>
          <span className="font-semibold text-blue-700">
            ₹{calculatedNetPayable.toLocaleString()}
          </span>
        </div>
      )}

      {/* Free Shipping Info */}
      {DeliveryCharge > 0 && amountToGetfeeDelivery > 0 && (
        <div className="text-center mb-5 text-sm text-blue-600 bg-blue-50 py-3 rounded-lg border border-blue-100">
          <span className="font-medium">
            🚚 Add ₹{amountToGetfeeDelivery.toLocaleString()} more for free
            shipping
          </span>
        </div>
      )}

      {/* Checkout Buttons */}
      <div className="hidden lg:block mt-6">
        <button
          onClick={() => router.push("/checkout")}
          className="w-full py-4 bg-[#2f415d] hover:bg-[#2f415d] text-white rounded-lg font-semibold text-lg shadow-sm hover:shadow-md transition-all duration-200"
        >
          Continue to Checkout
        </button>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 z-[100] px-4 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">Total Amount</div>
            <div className="font-semibold text-lg text-gray-900">
              ₹{calculatedNetPayable.toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartRight;
