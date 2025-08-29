
"use client";
import { Checkbox, FormControlLabel } from "@mui/material";
import { FaShippingFast } from "react-icons/fa";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartData, hydrateCart } from "@/redux/cart/CartSlice";

const CartRight = () => {
  const [priceDetails, setPriceDetails] = useState(true);
  const router = useRouter();

  // Get cart state from Redux store
  const {
    CartItems,
    TotalMrp,
    TotalPrice,
    TotalAmount,
    Netpayable,
    SmallCartFee,
    DeliveryCharge,
    RainFee,
    HandlingFee,
    wallet,
    coupon,
    amountToGetfeeDelivery
  } = useSelector((state) => state.cart);

  // Calculate values
  const itemCount = CartItems.reduce((total, item) => total + item.cart_Quentity, 0);
  const discountAmount = TotalMrp - TotalPrice;
  const totalSavings = discountAmount + (coupon || 0) + (DeliveryCharge === 0 ? 40 : 0);
  const freeShippingThreshold = 500; // Your threshold for free shipping

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCartData());
  }, [dispatch]);
  return (
    <div className="bg-white w-full px-3 py-3 rounded-sm">
      <div
        className="flex flex-row justify-between items-center cursor-pointer"
        onClick={() => setPriceDetails(!priceDetails)}
      >
        <span className="text-gray-700 text-xl">Price Details</span>
        {priceDetails ? <FaAngleUp /> : <FaAngleDown />}
      </div>

      {priceDetails && (
        <div className="border-b py-3 border-gray-200">
          <div className="grid grid-cols-2 my-2">
            <span>Price ({CartItems?.length} {CartItems?.length === 1 ? 'item' : 'items'})</span>
            <span className="flex justify-end">₹{TotalMrp.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-2 my-2">
            <span>Discount</span>
            <span className="flex justify-end text-green-600">
              -₹{discountAmount.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 my-2">
            <span className="flex items-center gap-2">Shipping</span>
            <span className={`flex justify-end ${DeliveryCharge === 0 ? 'text-green-600' : ''}`}>
              {DeliveryCharge === 0 ? 'FREE' : `₹${DeliveryCharge.toLocaleString()}`}
            </span>
          </div>

          {SmallCartFee > 0 && (
            <div className="grid grid-cols-2 my-2">
              <span>Small Cart Fee</span>
              <span className="flex justify-end">₹{SmallCartFee.toLocaleString()}</span>
            </div>
          )}

          {RainFee > 0 && (
            <div className="grid grid-cols-2 my-2">
              <span>Rain Protection Fee</span>
              <span className="flex justify-end">₹{RainFee.toLocaleString()}</span>
            </div>
          )}

          <div className="grid grid-cols-2 my-2">
            <span>Handling Fee</span>
            <span className="flex justify-end">₹{HandlingFee.toLocaleString()}</span>
          </div>

          {coupon > 0 && (
            <div className="grid grid-cols-2 my-2">
              <span>Coupon Discount</span>
              <span className="flex justify-end text-green-600">
                -₹{coupon.toLocaleString()}
              </span>
            </div>
          )}

          {wallet > 0 && (
            <div className="grid grid-cols-2 my-2">
              <span>Wallet Balance</span>
              <span className="flex justify-end text-green-600">
                -₹{wallet.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 my-4 py-2 border-b border-gray-200">
        <span className="font-semibold text-lg">Total Amount</span>
        <span className="flex justify-end font-semibold text-lg">
          ₹{TotalAmount.toLocaleString()}
        </span>
      </div>

      {Netpayable !== TotalAmount && (
        <div className="grid grid-cols-2 my-2">
          <span className="font-semibold">Net Payable</span>
          <span className="flex justify-end font-semibold">
            ₹{Netpayable.toLocaleString()}
          </span>
        </div>
      )}

      <div className="text-center my-4">
        <span className="font-semibold text-green-600">
          You saved ₹{totalSavings.toLocaleString()}
        </span>
      </div>

      {DeliveryCharge > 0 && amountToGetfeeDelivery > 0 && (
        <div className="text-center mb-4 text-sm text-gray-600">
          Add ₹{amountToGetfeeDelivery.toLocaleString()} more for free shipping
        </div>
      )}

      <div className="flex flex-col gap-2 text-gray-600">
        <div className="flex items-center gap-2">
          <FaShippingFast size={18} />
          <span>Shipping & taxes calculated at checkout</span>
        </div>
        <FormControlLabel
          control={<Checkbox required />}
          label="I agree with terms and conditions"
        />
      </div>

      {/* Desktop Checkout Button */}
      <div className="hidden lg:block mt-4">
        <button
          onClick={() => router.push("/checkout")}
          className="w-full py-3 bg-[#143741] hover:bg-[#0e2a33] text-white rounded-sm transition-colors"
        >
          Proceed To Checkout
        </button>
      </div>
      {/* Mobile Checkout Button */}
      <div className="lg:hidden fixed bottom-0 left-0 z-[100]  right-0 bg-white border-t border-gray-200 py-2 px-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm">Total Amount</div>
            <div className="font-semibold">₹{Netpayable.toLocaleString()}</div>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="px-6 py-2 bg-[#143741] hover:bg-[#0e2a33] text-white rounded-sm text-sm transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartRight;