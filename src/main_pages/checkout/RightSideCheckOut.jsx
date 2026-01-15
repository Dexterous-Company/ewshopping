"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { 
  getCartTotal, // Add this import
  removeCoupon, 
  clearCouponError,
  // fetchCouponByCode,
  hydrateAllData 
} from "../../redux/cart/CartSlice";
import toast from "react-hot-toast";

const RightSideCheckOut = () => {
  const [priceDetails, setPriceDetails] = useState(true);
  const [couponInput, setCouponInput] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  // Get all cart state including coupon data
  const {
    CartItems,
    DeliveryCharge,
    SmallCartFee,
    RainFee,
    HandlingFee,
    coupon,
    couponData,
    couponError,
    couponLoading,
    appliedCouponCode,
    amountToGetfeeDelivery,
    TotalMrp,
    TotalPrice,
    TotalAmount,
    Netpayable,
    all_amount_data // Add this
  } = useSelector((state) => state.cart);

  useEffect(() => {
    // Hydrate all data including cart and coupon
    dispatch(hydrateAllData());
    // Recalculate totals
    dispatch(getCartTotal());
  }, [dispatch]);

  // Parse all_amount_data for savings
  const amountData = all_amount_data ? JSON.parse(all_amount_data) : null;
  const totalSavingsFromData = amountData?.totalSavings || 0;

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
      
      if (result.meta.requestStatus === 'fulfilled') {
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

  // Calculate values based on current state
  const calculatedTotalMrp = CartItems.reduce(
    (total, item) => total + (item.Product_total_Mrp || 0),
    0
  );
  const calculatedTotalPrice = CartItems.reduce(
    (total, item) => total + (item.Product_total_Price || 0),
    0
  );
  
  // Use state values when available, fallback to calculated
  const displayTotalMrp = TotalMrp || calculatedTotalMrp;
  const displayTotalPrice = TotalPrice || calculatedTotalPrice;
  
  // Discount on MRP
  const discountOnMrp = Math.max(displayTotalMrp - displayTotalPrice, 0);
  
  // Coupon discount
  const couponDiscount = coupon || 0;
  
  // Check if coupon provides free delivery
  const isFreeDeliveryFromCoupon = couponData?.freeDelivery || false;
  
  // Calculate delivery savings (if delivery is free when it would normally cost ₹40)
  const deliverySavings = (displayTotalPrice < 500 && DeliveryCharge === 0) ? 40 : 0;
  
  // Calculate total savings - MATCHING YOUR IMAGE LOGIC
  const totalSavings = discountOnMrp + couponDiscount + deliverySavings;
  
  // Calculate amount needed for free delivery
  const amountNeededForFreeDelivery = amountToGetfeeDelivery || 
    (displayTotalPrice < 500 ? Math.max(0, 500 - displayTotalPrice) : 0);

  // Calculate subtotal before coupon (for display)
  const subtotalBeforeCoupon = displayTotalPrice + DeliveryCharge + RainFee + HandlingFee + SmallCartFee;
  
  // Get final amounts from state
  const finalTotalAmount = TotalAmount || subtotalBeforeCoupon;
  const finalNetPayable = Netpayable || (subtotalBeforeCoupon - couponDiscount);

  return (
    <div className="bg-white w-full px-3 py-3 rounded-sm">
      {/* Coupon Section (keep as is) */}


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
              {displayTotalMrp.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2">
            <span>Total Price</span>
            <span className="flex justify-end">
              {displayTotalPrice.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2">
            <span>Discount on MRP</span>
            <span className="flex justify-end text-green-600">
              -{discountOnMrp.toLocaleString()}
            </span>
          </div>

          {/* Show coupon discount if applied */}
          {couponDiscount > 0 && (
            <div className="grid grid-cols-2">
              <span>Coupon Discount ({appliedCouponCode})</span>
              <span className="flex justify-end text-green-600">
                -{couponDiscount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Delivery Charge - MATCHING YOUR IMAGE FORMAT */}
          <div className="grid grid-cols-2">
            <span>Delivery Charge</span>
            <span className={`flex justify-end ${DeliveryCharge === 0 ? "text-green-600" : ""}`}>
              {DeliveryCharge === 0 ? "FREE" : `${DeliveryCharge.toLocaleString()}`}
              {DeliveryCharge > 0 && !isFreeDeliveryFromCoupon && (
                <span className="text-xs text-gray-500 ml-1">
                
                </span>
              )}
            </span>
          </div>

          {/* Show other fees if they exist */}
          {SmallCartFee > 0 && (
            <div className="grid grid-cols-2">
              <span>Small Cart Fee</span>
              <span className="flex justify-end">
                {SmallCartFee.toLocaleString()}
            </span>
            </div>
          )}
          {RainFee > 0 && (
            <div className="grid grid-cols-2">
              <span>Rain Protection Fee</span>
              <span className="flex justify-end">
                {RainFee.toLocaleString()}
            </span>
            </div>
          )}
          {HandlingFee > 0 && (
            <div className="grid grid-cols-2">
              <span>Handling Fee</span>
              <span className="flex justify-end">
                {HandlingFee.toLocaleString()}
              </span>
            </div>
          )}

          {/* Show Total Amount (after all charges, before coupon) - MATCHING YOUR IMAGE */}
          <div className="grid grid-cols-2 font-semibold border-t pt-2 mt-2">
            <span>Total Amount</span>
            <span className="flex justify-end">
              {subtotalBeforeCoupon.toLocaleString()}
            </span>
          </div>

          {/* Show Net Payable (after coupon) - MATCHING YOUR IMAGE */}
          <div className="grid grid-cols-2 font-bold text-lg border-t pt-2">
            <span>Net Payable</span>
            <span className="flex justify-end text-[#143741]">
              {finalNetPayable.toLocaleString()}
            </span>
          </div>

          {/* Show Total Savings - MATCHING YOUR IMAGE */}
          <div className="grid grid-cols-2 text-green-600 pt-2 border-t">
            <span>Total Savings</span>
            <span className="flex justify-end">
              {totalSavingsFromData || totalSavings.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* This should show Net Payable, not Total Amount - MATCHING YOUR IMAGE */}
      <div className="grid grid-cols-2 my-4 py-2 border-b border-gray-200">
        <span className="text-sm sm:text-lg font-semibold">Net Payable</span> {/* Changed from Total Amount */}
        <span className="flex justify-end font-semibold text-lg">
          {finalNetPayable.toLocaleString()}
        </span>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 z-[100] px-4 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-between items-center px-7 py-2">
          <div className="text-xs">Net Payable</div>
          <div>
            <div className="font-semibold text-sm">
              {finalNetPayable.toLocaleString()}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            if (CartItems.length === 0) {
              toast.error("Your cart is empty");
              return;
            }
            router.push("/checkout");
          }}
          className={`w-full py-3 rounded-sm font-semibold text-white transition-colors ${
            CartItems.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#143741] hover:bg-[#0e2a33]"
          }`}
          disabled={CartItems.length === 0}
        >
          {CartItems.length === 0 ? "Cart is Empty" : "Checkout"}
        </button>
      </div>
    </div>
  );
};

export default RightSideCheckOut;