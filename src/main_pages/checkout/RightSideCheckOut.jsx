"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { getCartData } from "../../redux/cart/CartSlice";

const RightSideCheckOut = () => {
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
    <div className="bg-white w-full px-3 py-3 rounded-sm">
      {/* Price Details Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setPriceDetails(!priceDetails)}
      >
        <span className="text-gray-700 sm:text-xl text-md font-semibold">
          Price Details
        </span>
        {priceDetails ? <FaAngleUp /> : <FaAngleDown />}
      </div>

      {priceDetails && (
        <div className="border-b py-3 border-gray-200 space-y-2">
          <div className="grid grid-cols-2">
            <span>Total MRP</span>
            <span className="flex justify-end">
              ₹{TotalMrp.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2">
            <span>Total Price</span>
            <span className="flex justify-end">
              ₹{TotalPrice.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2">
            <span>Discount</span>
            <span className="flex justify-end text-green-600">
              -₹{discountAmount.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2">
            <span>Coupon</span>
            <span
              className={`flex justify-end ${
                couponDiscount > 0 ? "text-green-600" : "text-gray-400"
              }`}
            >
              {couponDiscount > 0
                ? `-₹${couponDiscount.toLocaleString()}`
                : "Not Available"}
            </span>
          </div>

          {wallet > 0 && (
            <div className="grid grid-cols-2">
              <span>Wallet Balance</span>
              <span className="flex justify-end text-green-600">
                -₹{wallet.toLocaleString()}
              </span>
            </div>
          )}

          {DeliveryCharge > 0 && (
            <div className="grid grid-cols-2">
              <span>Delivery Charge</span>
              <span className="flex justify-end">
                ₹{DeliveryCharge.toLocaleString()}
              </span>
            </div>
          )}
          {SmallCartFee > 0 && (
            <div className="grid grid-cols-2">
              <span>Small Cart Fee</span>
              <span className="flex justify-end">
                ₹{SmallCartFee.toLocaleString()}
              </span>
            </div>
          )}
          {RainFee > 0 && (
            <div className="grid grid-cols-2">
              <span>Rain Protection Fee</span>
              <span className="flex justify-end">
                ₹{RainFee.toLocaleString()}
              </span>
            </div>
          )}
          {HandlingFee > 0 && (
            <div className="grid grid-cols-2">
              <span>Handling Fee</span>
              <span className="flex justify-end">
                ₹{HandlingFee.toLocaleString()}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 text-green-600">
            <span>You Saved</span>
            <span className="flex justify-end">
              ₹{totalSavings.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 my-4 py-2 border-b border-gray-200">
        <span className="text-sm sm:text-lg font-semibold">Total Amount</span>
        <span className="flex justify-end font-semibold text-lg">
          ₹{calculatedTotalAmount.toLocaleString()}
        </span>
      </div>

      {calculatedNetPayable !== calculatedTotalAmount && (
        <div className="grid grid-cols-2 my-2">
          <span className="font-semibold">Net Payable</span>
          <span className="flex justify-end font-semibold">
            ₹{calculatedNetPayable.toLocaleString()}
          </span>
        </div>
      )}

      {DeliveryCharge > 0 && amountToGetfeeDelivery > 0 && (
        <div className="text-center mb-4 text-sm text-gray-600">
          Add ₹{amountToGetfeeDelivery.toLocaleString()} more for free shipping
        </div>
      )}

      {/* <div className="hidden lg:block mt-4">
        <button
          onClick={() => router.push("/checkout")}
          className="w-full py-3 bg-[#143741] hover:bg-[#0e2a33] text-white rounded-sm transition-colors"
        >
          Proceed To Checkout
        </button>
      </div> */}

      <div className="lg:hidden fixed bottom-0 left-0 z-[100] px-4 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-between items-center px-7 py-2">
            <div className="text-xs">Total Amount</div>
          <div>
            <div className="font-semibold text-sm">
              ₹{calculatedNetPayable.toLocaleString()}
            </div>
          </div>
          {/* <buttonk
            onClick={() => router.push("/checkout")}
            className="px-7 py-2 bg-[#143741] hover:bg-[#0e2a33] text-white text-sm transition-colors"
          >
            Place Order
          </buttonk> */}
        </div>
      </div>
    </div>
  );
};

export default RightSideCheckOut;