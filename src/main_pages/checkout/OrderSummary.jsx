// export default OrderSummary;
"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  addToCart,
  decrementCart,
  removeFromCart,
} from "../../redux/cart/CartSlice";
import { useRouter } from "next/navigation";
import { FaCheck, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { setCheckoutStep } from "../../redux/athentication/Athentication";
import { motion, AnimatePresence } from "framer-motion";

const OrderSummary = ({
  showSummary,
  setContinueSumamryData,
  continueSumamryData,
}) => {
  const { isAuth, loginData } = useSelector((store) => store.Athentication);
  const { CartItems } = useSelector((store) => store.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleIncrement = (item) => dispatch(addToCart(item));
  const handleDecrement = (item) => dispatch(decrementCart(item));
  const handleRemove = (item) => dispatch(removeFromCart(item));

  const handleContinue = () => setContinueSumamryData(true);
  const handleCancel = () => setContinueSumamryData(false);

  useEffect(() => {
    if (CartItems.length <= 0) router.push("/");
  }, [CartItems, router]);

  if (!isAuth || !showSummary) {
    return null;
  }


  // Calculate total
  const totalItems = CartItems.reduce(
    (sum, item) => sum + item.cart_Quentity,
    0
  );
  const totalMRP = CartItems.reduce(
    (sum, item) => sum + item.Mrp * item.cart_Quentity,
    0
  );
  const totalPrice = CartItems.reduce(
    (sum, item) => sum + item.Price * item.cart_Quentity,
    0
  );
  const totalDiscount = totalMRP - totalPrice;

  return (
    <>
      {continueSumamryData ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-green-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#2f415d] rounded-full flex items-center justify-center">
                <FaCheck className="text-[#ffff] text-lg" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-500">
                    STEP 3
                  </span>
                  <span className="text-green-600 text-sm font-medium">
                    • CONFIRMED
                  </span>
                </div>
                <p className="text-gray-900 font-medium">
                  Order Summary:{" "}
                  <span className="text-blue-700">{totalItems} items</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Total: ₹{totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
            >
              Change
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Professional Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">3</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Summary
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Review your items and quantities
                </p>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="sm:p-6 p-2">
            <AnimatePresence>
              {CartItems?.length > 0 ? (
                <div className="space-y-4">
                  {CartItems.map((item, index) => (
                    <motion.div
                      key={item.AttributeId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex gap-4 p-4 wrounded-lg hover:border-gray-300 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            Seller:{" "}
                            <span className="text-gray-500">
                              {item.shopName}
                            </span>
                          </p>

                          {/* Pricing */}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-semibold text-gray-900">
                              ₹{item.Price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{item.Mrp.toLocaleString()}
                            </span>
                            <span className="text-xs font-medium text-green-600">
                              {Math.round(
                                ((item.Mrp - item.Price) / item.Mrp) * 100
                              )}
                              % off
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleDecrement(item)}
                                className="p-2 hover:bg-gray-100 transition-colors text-gray-600"
                              >
                                <FaMinus className="w-3 h-3" />
                              </button>
                              <span className="px-3 py-1 text-sm font-medium text-gray-900 min-w-8 text-center">
                                {item.cart_Quentity}
                              </span>
                              <button
                                onClick={() => handleIncrement(item)}
                                className="p-2 hover:bg-gray-100 transition-colors text-gray-600"
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemove(item)}
                            className="text-gray-500 hover:text-red-600 transition-colors p-2"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Add items to proceed with checkout
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Order Total Summary */}
            {CartItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Price</span>
                    <span className="text-gray-900">
                      ₹{totalPrice.toLocaleString()}
                      
                    </span>
                  </div>
                  
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          {CartItems.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600 text-center sm:text-left">
                  Order confirmation will be sent to{" "}
                  <span className="font-medium text-gray-900">
                    {loginData?.Email || "your registered email"}
                  </span>
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleContinue();
                    dispatch(setCheckoutStep(4));
                  }}
                  className="bg-[#2f415d] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#2f415d]-800 transition-colors whitespace-nowrap"
                >
                  Continue to Payment
                </motion.button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OrderSummary;
