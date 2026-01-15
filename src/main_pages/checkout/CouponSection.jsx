"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  removeCoupon,
  clearCouponError,
  fetchCouponByCode,
} from "../../redux/cart/CartSlice";

const CouponSection = () => {
  const [couponInput, setCouponInput] = useState("");
  const dispatch = useDispatch();

  const {
    coupon,
    couponData,
    couponError,
    couponLoading,
    appliedCouponCode,
    amountToGetfeeDelivery,
    CartItems,
    DeliveryCharge,
    TotalPrice,
  } = useSelector((state) => state.cart);

  // Check if coupon provides free delivery
  const isFreeDeliveryFromCoupon = couponData?.freeDelivery || false;

  // Calculate amount needed for free delivery
  const amountNeededForFreeDelivery =
    amountToGetfeeDelivery ||
    (TotalPrice < 500 ? Math.max(0, 500 - TotalPrice) : 0);

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const couponCode = couponInput.trim().toUpperCase();

    if (appliedCouponCode === couponCode) {
      toast.info("This coupon is already applied");
      return;
    }

    try {
      const result = await dispatch(fetchCouponByCode(couponCode));

      if (result.meta.requestStatus === "fulfilled") {
        setCouponInput("");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponInput("");
    dispatch(clearCouponError());
  };

  return (
    <div className="bg-white w-full px-3 py-3 rounded-sm mb-4 border border-gray-200 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-700 font-semibold text-lg">
            Apply Coupon
          </span>
          <span className="text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded">
            Save More
          </span>
        </div>

        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value.toUpperCase());
                if (couponError) {
                  dispatch(clearCouponError());
                }
              }}
              placeholder="Enter coupon code"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                couponError
                  ? "border-red-500"
                  : appliedCouponCode
                  ? "border-green-500"
                  : "border-gray-300"
              }`}
              disabled={appliedCouponCode || couponLoading}
              onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
            />
            {appliedCouponCode && !couponLoading && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                <span className="text-green-600 text-sm font-medium">
                  ✓ Applied
                </span>
              </div>
            )}
            {couponLoading && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>

          {!appliedCouponCode ? (
            <button
              onClick={handleApplyCoupon}
              disabled={!couponInput.trim() || couponLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors min-w-24 flex items-center justify-center ${
                !couponInput.trim() || couponLoading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[#143741] hover:bg-[#0e2a33] text-white"
              }`}
            >
              {couponLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                "Apply"
              )}
            </button>
          ) : (
            <button
              onClick={handleRemoveCoupon}
              disabled={couponLoading}
              className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg font-medium transition-colors min-w-24"
            >
              Remove
            </button>
          )}
        </div>

        {couponError && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {couponError}
          </p>
        )}

        {/* Free Delivery Progress */}
        {!isFreeDeliveryFromCoupon && amountNeededForFreeDelivery > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-800">
                Add ₹{amountNeededForFreeDelivery} more for FREE delivery!
              </span>
              <span className="text-xs text-blue-600">
                Current: ₹{TotalPrice}
              </span>
            </div>
            <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${Math.min((TotalPrice / 500) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {isFreeDeliveryFromCoupon && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-700">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">
                Free Delivery Applied! (Save ₹40)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponSection;