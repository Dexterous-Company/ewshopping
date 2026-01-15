"use client";
import React, { useState, useEffect } from "react";
import RightSideCheckOut from "./RightSideCheckOut";
import CheckoutLogin from "./CheckoutLogin";
import OrderSummary from "./OrderSummary";
import PaymentOptions from "./PaymentOptionsCheckOut";
import { useSelector } from "react-redux";
import CheckOutAddress from "./CheckoutAddress";
import { motion, AnimatePresence } from "framer-motion";
import useCartPriceUpdater from "../../hooks/useCartPriceUpdater";
import CouponSection from "./CouponSection"; // Import the new coupon component

const CheckoutPage = () => {
  const { isAuth } = useSelector((store) => store.Athentication);
  const { CartItems } = useSelector((state) => state.cart);
  const [showSummary, setShowSummary] = useState(false);
  const [continueSumamryData, setContinueSumamryData] = useState(false);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  
  const updateCartPrices = useCartPriceUpdater();

  // Update prices when component mounts
  useEffect(() => {
    const updatePrices = async () => {
      if (CartItems && CartItems.length > 0) {
        setIsUpdatingPrices(true);
        try {
          const updatedPrices = await updateCartPrices();
          
          // Show toast if prices changed
          if (updatedPrices) {
            const priceChanges = CartItems.filter(item => {
              const updatedItem = updatedPrices.find(up => up.AttributeId === item.AttributeId);
              return updatedItem && (updatedItem.Price !== item.Price || updatedItem.Mrp !== item.Mrp);
            });
            
            if (priceChanges.length > 0) {
              // Optional: Show notification about price changes
            }
          }
        } catch (error) {
          console.error("Price update failed:", error);
        } finally {
          setIsUpdatingPrices(false);
        }
      }
    };

    updatePrices();
  }, []); // Run once when component mounts

  // Define the 4-step progression
  const steps = [
    {
      step: 1,
      label: "Login",
      active: true,
      completed: isAuth,
    },
    {
      step: 2,
      label: "Address",
      active: isAuth,
      completed: showSummary,
    },
    {
      step: 3,
      label: "Summary",
      active: showSummary,
      completed: continueSumamryData,
    },
    {
      step: 4,
      label: "Payment",
      active: continueSumamryData,
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-1 pt-1 sm:py-6 lg:py-8">
      <div className="sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Price Update Banner */}
        <AnimatePresence>
          {isUpdatingPrices && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-blue-800 font-medium">
                    Updating cart prices...
                  </span>
                </div>
                <span className="text-blue-600 text-sm">
                  Please wait while we fetch the latest prices
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Checkout Progress</h2>
            {isUpdatingPrices && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Updating Prices
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.completed
                        ? "bg-green-500 text-white"
                        : step.active
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step.completed ? "✓" : step.step}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      step.active || step.completed
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      steps[index + 1].active || steps[index + 1].completed
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-2 sm:gap-6 lg:gap-8 sm:mb-0 mb-13">
          {/* Left section - Main content */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4 sm:gap-6">
            {/* Login Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <CheckoutLogin />
            </motion.div>

            {/* Address Section */}
            <AnimatePresence>
              {isAuth && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-sm border -mt-4 border-gray-200 shadow-sm overflow-hidden"
                >
                  <CheckOutAddress setShowSummary={setShowSummary} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Order Summary */}
            <AnimatePresence>
              {isAuth && showSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <OrderSummary
                    showSummary={showSummary}
                    setContinueSumamryData={setContinueSumamryData}
                    continueSumamryData={continueSumamryData}
                    isUpdatingPrices={isUpdatingPrices}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Payment Options */}
            <AnimatePresence>
              {isAuth && continueSumamryData && showSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-xl border -mt-2 border-gray-200 shadow-sm overflow-hidden"
                >
                  <PaymentOptions
                    continueSumamryData={continueSumamryData}
                    showSummary={showSummary}
                    isUpdatingPrices={isUpdatingPrices}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right section - Sticky sidebar */}
          <div className="w-full lg:w-1/3 lg:min-w-[350px]">
            <div className="space-y-4 sm:space-y-6">
              {/* Coupon Section - Now separate and before Order Summary */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <CouponSection />
              </motion.div>

              {/* Order Summary Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      Order Summary
                    </h3>
                    {isUpdatingPrices && (
                      <div className="flex items-center text-yellow-600 text-xs">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
                        Updating
                      </div>
                    )}
                  </div>
                </div>
                <RightSideCheckOut isUpdatingPrices={isUpdatingPrices} />
              </motion.div>

              {/* Security Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">🔒</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Secure Checkout
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;