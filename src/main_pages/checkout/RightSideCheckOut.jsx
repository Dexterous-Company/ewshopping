"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown, FaAngleUp, FaTag, FaTimes } from "react-icons/fa";
import { getCartData, clearAppliedCoupon, applyValidatedCoupon } from "../../redux/cart/CartSlice";
import { validateCouponForCart, clearCoupon, clearCouponError } from "../../redux/coupon/couponSlice";

const RightSideCheckOut = () => {
  const [priceDetails, setPriceDetails] = useState(true);
  const [showCouponDetails, setShowCouponDetails] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Get cart state from Redux
  const cartState = useSelector((state) => state.cart);
  const couponState = useSelector((state) => state.coupon);

  const {
    CartItems = [], // Default to empty array
    DeliveryCharge = 0,
    SmallCartFee = 0,
    RainFee = 0,
    HandlingFee = 0,
    coupon = {},
    TotalMrp = 0,
    TotalPrice = 0,
    TotalAmount = 0,
    Subtotal = 0,
    SubtotalAfterCoupon = 0,
    Netpayable = 0,
    CouponDiscount = 0,
    amountToGetfeeDelivery = 0,
    amountToGetfeeDeliveryPercentage = 0,
    discountBreakdown = {}
  } = cartState;

  useEffect(() => {
    dispatch(getCartData());
  }, [dispatch]);

  // Clear any coupon errors when component mounts or coupon input changes
  useEffect(() => {
    if (couponCodeInput === "") {
      dispatch(clearCouponError());
    }
  }, [couponCodeInput, dispatch]);

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) {
      alert("Please enter a coupon code");
      return;
    }

    const code = couponCodeInput.toUpperCase().trim();
    setApplyingCoupon(true);
    
    try {
      // Step 1: Validate coupon with cart data
      const validationResult = await dispatch(
        validateCouponForCart({
          couponCode: code,
          cartAmount: TotalPrice,
          cartItems: CartItems
        })
      ).unwrap();

      console.log("Validation Result:", validationResult);

      if (validationResult.valid) {
        // Step 2: Apply the validated coupon to cart
        dispatch(applyValidatedCoupon({
          coupon: validationResult.coupon,
          discountAmount: validationResult.discountAmount,
          code: code
        }));
        
        // Clear input
        setCouponCodeInput("");
        
        // Show success message
        toast.success(validationResult.message || "Coupon applied successfully!");
      } else {
        // Show error message from validation
        toast.error(validationResult.message || "Invalid coupon");
      }
      
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error(error.message || "Failed to apply coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Simple toast function
  const toast = {
    success: (message) => {
      alert(`✅ ${message}`);
    },
    error: (message) => {
      alert(`❌ ${message}`);
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = () => {
    dispatch(clearAppliedCoupon());
    dispatch(clearCoupon());
    setShowCouponDetails(false);
    setCouponCodeInput("");
    toast.success("Coupon removed successfully!");
  };

  // Calculate display values - with safe defaults
  const productSavings = discountBreakdown?.productSavings || 0;
  const couponDiscountAmount = coupon?.discountAmount || 0;
  const couponApplied = coupon?.applied || false;
  const totalSavings = productSavings + couponDiscountAmount;

  // Function to get discount type display text
  const getDiscountTypeDisplay = () => {
    if (!couponApplied || !coupon.details) return "Discount applied";
    
    const discountType = (coupon.discountType || "").toLowerCase();
    const discountValue = coupon.details.discountValue || 0;
    
    switch (discountType) {
      case 'percentage':
      case 'percent':
        return `${discountValue}% OFF`;
      case 'fixed':
      case 'flat':
      case 'amount':
        return `Flat ₹${discountValue} OFF`;
      case 'product_specific':
        return `Product Specific Discount`;
      default:
        return `₹${discountValue} OFF`;
    }
  };

  // Function to get coupon description
  const getCouponDescription = () => {
    if (!couponApplied || !coupon.details) return "Discount applied";
    
    const desc = coupon.details.description || "";
    if (desc) return desc;
    
    const discountType = (coupon.discountType || "").toLowerCase();
    const discountValue = coupon.details.discountValue || 0;
    const maxDiscount = coupon.details.maxDiscount || 0;
    
    if (discountType === 'percentage' || discountType === 'percent') {
      if (maxDiscount > 0) {
        return `Get ${discountValue}% off (max ₹${maxDiscount})`;
      }
      return `Get ${discountValue}% off`;
    } else if (discountType === 'fixed' || discountType === 'flat' || discountType === 'amount') {
      return `Get ₹${discountValue} off`;
    }
    
    return "Special discount applied";
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Function to check if coupon has details to show
  const hasCouponDetails = () => {
    return couponApplied && coupon.details && (
      coupon.details.maxDiscount > 0 ||
      (coupon.details.minPurchase || coupon.details.minCartValue) > 0 ||
      coupon.details.validUntil ||
      coupon.details.usageLimit ||
      coupon.details.applicableProducts?.length > 0 ||
      coupon.details.applicableCategories?.length > 0
    );
  };

  // FIXED: Ensure CartItems is always an array
  const safeCartItems = Array.isArray(CartItems) ? CartItems : [];
  const isCheckoutDisabled = safeCartItems.length === 0;

  // Handle checkout click
  const handleCheckout = () => {
    if (!isCheckoutDisabled) {
      router.push("/checkout");
    } else {
      alert("Your cart is empty. Add items to proceed to checkout.");
    }
  };

  return (
    <div className="bg-white w-full px-4 py-4 rounded-lg shadow-sm border border-gray-100">
      {/* Price Details Header */}
      <div
        className="flex justify-between items-center cursor-pointer mb-4"
        onClick={() => setPriceDetails(!priceDetails)}
      >
        <span className="text-gray-800 text-lg font-semibold flex items-center gap-2">
          <span className="text-blue-600">💰</span>
          Price Details
        </span>
        {priceDetails ? (
          <FaAngleUp className="text-gray-500" />
        ) : (
          <FaAngleDown className="text-gray-500" />
        )}
      </div>

      {priceDetails && (
        <div className="border-b py-4 border-gray-200 space-y-3">
          {/* 1. Total MRP */}
          <div className="flex justify-between">
            <span className="text-gray-600">Total MRP</span>
            <span className="line-through text-gray-500">
              ₹{TotalMrp.toLocaleString()}
            </span>
          </div>

          {/* 2. Total Price (After product discounts) */}
          <div className="flex justify-between">
            <span className="text-gray-600">Total Price</span>
            <span className="text-gray-900 font-medium">
              ₹{TotalPrice.toLocaleString()}
            </span>
          </div>

          {/* 3. Product Discount */}
          {productSavings > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Product Discount</span>
              <span className="text-green-600 font-medium">
                -₹{productSavings.toLocaleString()}
              </span>
            </div>
          )}

          {/* 4. Coupon Section */}
          {couponApplied ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaTag className="text-green-600 text-sm" />
                  <span className="text-gray-600">Coupon Discount</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-medium">
                    -₹{couponDiscountAmount.toLocaleString()}
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-gray-400 hover:text-red-500 text-sm transition-colors"
                    aria-label="Remove coupon"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Coupon Details Card */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-2 rounded-md">
                      <FaTag className="text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-green-800">
                          {coupon.code || "COUPON"}
                        </span>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          {getDiscountTypeDisplay()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {getCouponDescription()}
                      </p>
                    </div>
                  </div>
                  
                  {hasCouponDetails() && (
                    <button
                      onClick={() => setShowCouponDetails(!showCouponDetails)}
                      className="text-green-600 text-xs font-medium hover:text-green-700 transition-colors"
                    >
                      {showCouponDetails ? "Hide" : "Details"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Apply Coupon Section */
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Apply Coupon</span>
                <span className="text-gray-400 text-xs">Not Applied</span>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 uppercase"
                  disabled={applyingCoupon}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCodeInput.trim() || applyingCoupon}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    !couponCodeInput.trim() || applyingCoupon
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {applyingCoupon ? "..." : "Apply"}
                </button>
              </div>
              
              {/* Error Message */}
              {couponState.validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-md text-xs">
                  <div className="flex items-center gap-1">
                    <span>❌</span>
                    <span>{couponState.validationError}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. Fees Section */}
          <div className="pt-2 space-y-2">
            {/* Delivery Charge */}
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Charge</span>
              <span className="text-gray-900">
                {DeliveryCharge === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  `₹${DeliveryCharge.toLocaleString()}`
                )}
              </span>
            </div>

            {/* Rain Protection Fee */}
            {RainFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Rain Protection Fee</span>
                <span className="text-gray-900">₹{RainFee.toLocaleString()}</span>
              </div>
            )}

            {/* Handling Fee */}
            {HandlingFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Handling Fee</span>
                <span className="text-gray-900">
                  ₹{HandlingFee.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* 6. Subtotal (Before Coupon) */}
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-600 font-medium">Subtotal</span>
            <span className="font-medium text-gray-900">
              ₹{Subtotal.toLocaleString()}
            </span>
          </div>

          {/* 7. Subtotal After Coupon */}
          {couponApplied && (
            <div className="flex justify-between">
              <span className="text-gray-600">After Coupon Discount</span>
              <span className="font-medium text-gray-900">
                ₹{SubtotalAfterCoupon.toLocaleString()}
              </span>
            </div>
          )}

          {/* 8. Total Savings */}
          {totalSavings > 0 && (
            <div className="flex justify-between text-green-600 font-medium pt-3 border-t border-gray-200">
              <span className="flex items-center gap-1">
                <span>🎉</span>
                <span>Total Savings</span>
              </span>
              <span>₹{totalSavings.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {/* 9. Total Amount */}
      <div className="flex justify-between my-4 py-3 border-b border-gray-200">
        <span className="text-lg font-semibold text-gray-900">
          Total Amount
        </span>
        <span className="font-semibold text-lg text-gray-900">
          ₹{TotalAmount.toLocaleString()}
        </span>
      </div>

      {/* 10. Net Payable (same as Total Amount without wallet) */}
      {Netpayable !== TotalAmount && (
        <div className="flex justify-between mb-3">
          <span className="text-gray-700 font-medium">Net Payable</span>
          <span className="font-semibold text-gray-900">
            ₹{Netpayable.toLocaleString()}
          </span>
        </div>
      )}

      {/* 11. Free Shipping Info */}
      {DeliveryCharge > 0 && amountToGetfeeDelivery > 0 && (
        <div className="text-center mb-3 text-xs text-blue-600 bg-blue-50 py-2 rounded-md border border-blue-100">
          <span className="font-medium">
            🚚 Add ₹{amountToGetfeeDelivery.toLocaleString()} more for free shipping
          </span>
        </div>
      )}

      {/* Desktop Checkout Button REMOVED as requested */}
      
      {/* Mobile Bottom Bar (Only mobile checkout button remains) */}
      <div className="lg:hidden fixed bottom-0 left-0 z-[100] px-4 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">Total Amount</div>
            <div className="font-semibold text-lg text-gray-900">
              ₹{Netpayable.toLocaleString()}
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isCheckoutDisabled}
            className={`px-6 py-2 font-semibold rounded-lg shadow-sm transition-all duration-200 ${
              isCheckoutDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }`}
          >
            {isCheckoutDisabled ? "Empty Cart" : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSideCheckOut;