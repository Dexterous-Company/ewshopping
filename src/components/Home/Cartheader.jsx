"use client";
import { FiX, FiTruck, FiCheck } from "react-icons/fi";
import { BsCart3, BsBag } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  decrementCart,
  removeFromCart,
} from "@/redux/cart/CartSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import useCartPriceUpdater from "../../hooks/useCartPriceUpdater";

const Cartheader = ({ isCartOpen, closeCart }) => {
  const dispatch = useDispatch();
  const updateCartPrices = useCartPriceUpdater();
  const { CartItems, TotalMrp, TotalPrice, TotalAmount } = useSelector((state) => state.cart);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isFooterOpen, setIsFooterOpen] = useState(true);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const updatePrices = async () => {
      if (CartItems && CartItems.length > 0) {
        setIsUpdatingPrices(true);
        try {
          const updatedPrices = await updateCartPrices();
          
          // Check if any prices changed and show toast
          if (updatedPrices) {
            const priceChanges = CartItems.filter(item => {
              const updatedItem = updatedPrices.find(up => up.AttributeId === item.AttributeId);
              return updatedItem && (updatedItem.Price !== item.Price || updatedItem.Mrp !== item.Mrp);
            });
          }
          console.log("Cart prices updated successfully");
        } catch (error) {
          console.error("Price update failed:", error);
        } finally {
          setIsUpdatingPrices(false);
        }
      }
    };

    if (isCartOpen) {
      updatePrices();
    }
  }, [isCartOpen]); // Run when cart opens

  // Use Redux state for totals instead of calculating manually
  const totalSavings = TotalMrp - TotalPrice;
  const totalItems = isMounted
    ? CartItems?.reduce((sum, item) => sum + item.cart_Quentity, 0) || 0
    : 0;

  // Calculate free shipping threshold
  const freeShippingThreshold = 500;
  const amountToFreeShipping = isMounted
    ? Math.max(0, freeShippingThreshold - TotalPrice)
    : freeShippingThreshold;
  const progressPercentage = Math.min(
    (TotalPrice / freeShippingThreshold) * 100,
    100
  );

  const handleIncrement = (item) => {
    const cartItem = {
      AttributeId: item.AttributeId,
      ProductId: item.ProductId,
      Mrp: item.Mrp,
      Price: item.Price,
      productName: item.productName || item.name,
      productImage: item.productImage || item.thumbnail,
      availableStock: item.availableStock,
      maximumQuantity: item.maximumQuantity,
      size: item.size,
      color: item.color,
      shopId: item.shopId,
      shopName: item.shopName,
      slugurl: item.slugurl,
    };
    dispatch(addToCart(cartItem));
  };

  const handleDecrement = (item) => {
    const cartItem = {
      AttributeId: item.AttributeId,
      ProductId: item.ProductId,
      Mrp: item.Mrp,
      Price: item.Price,
      productName: item.productName || item.name,
      productImage: item.productImage || item.thumbnail,
      availableStock: item.availableStock,
      maximumQuantity: item.maximumQuantity,
      size: item.size,
      color: item.color,
      shopId: item.shopId,
      shopName: item.shopName,
      slugurl: item.slugurl,
    };
    dispatch(decrementCart(cartItem));
    
    if (item.cart_Quentity === 1) {
    
    } else {
    
    }
  };

  const handleRemove = (item) => {
    const cartItem = {
      AttributeId: item.AttributeId,
      ProductId: item.ProductId,
      Mrp: item.Mrp,
      Price: item.Price,
      productName: item.productName || item.name,
      productImage: item.productImage || item.thumbnail,
      availableStock: item.availableStock,
      maximumQuantity: item.maximumQuantity,
      size: item.size,
      color: item.color,
      shopId: item.shopId,
      shopName: item.shopName,
      slugurl: item.slugurl,
    };
    dispatch(removeFromCart(cartItem));
  };

  const handleViewCart = () => {
    closeCart();
    router.push("/cart");
  };

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <div
      className={`fixed inset-0 z-[1000] overflow-hidden transition-all duration-300 ${
        isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={closeCart}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"></div>

      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-r from-[#2f415d] to-[#1e2a3a] text-white">
          <div className="flex items-center">
            <BsCart3 className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">
              Your Cart ({isMounted ? CartItems?.length || 0 : 0})
              {isUpdatingPrices && (
                <span className="text-xs ml-2 text-yellow-300">(Updating...)</span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="h-[calc(100%-220px)] overflow-y-auto p-4 bg-gray-50">
          {!isMounted ? (
            // Loading state during initial render
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <div className="animate-pulse">
                <BsCart3 className="w-16 h-16 mb-4 mx-auto text-gray-300" />
              </div>
              <p className="mb-4">Loading your cart...</p>
            </div>
          ) : !CartItems || CartItems.length <= 0 ? (
            // Empty cart state
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <BsBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added anything to your cart yet
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push("/");
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#e96f84] to-[#e96f84] text-white rounded-lg hover:from-[#2f415d] hover:to-[#1e2a3a] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            // Cart items list
            <ul className="space-y-2 mb-20">
              {CartItems.map((item) => (
                <li
                  key={item?.AttributeId}
                  className="flex gap-4 p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.productImage || item.thumbnail}
                    alt={item.productName || item.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${encodeURIComponent(item.slugurl)}`}
                      onClick={closeCart}
                      className="hover:text-[#e96f84] transition-colors"
                    >
                      <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
                        {item.productName || item.name}
                      </h3>
                    </Link>
                    <div className="flex items-center mt-0.5">
                      <span className="text-sm font-semibold text-gray-800">
                        ₹{item?.Price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 line-through ml-2">
                        ₹{item?.Mrp?.toLocaleString()}
                      </span>
                      <span className="text-xs text-green-600 font-medium ml-2">
                        Save ₹{(item?.Mrp - item?.Price).toLocaleString()}
                      </span>
                    </div>

                    {/* Size and Color Info */}
                    {(item.size || item.color) && (
                      <div className="flex gap-2 mt-1">
                        {item.size && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            Color: {item.color}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleDecrement(item)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.cart_Quentity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-sm font-medium bg-gray-50 min-w-[2rem] text-center">
                          {item?.cart_Quentity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.cart_Quentity >= item.maximumQuantity}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart Footer - Only show when there are items */}
        {CartItems && CartItems.length > 0 && isMounted && isCartOpen && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
            {/* ===== Toggle Header ===== */}
            <div
              className="flex justify-between items-center p-4 cursor-pointer select-none bg-gray-50"
              onClick={() => setIsFooterOpen((prev) => !prev)}
            >
              <div className="flex flex-col">
                <span className="text-base font-semibold text-[#2f415d]">
                  Total: ₹{TotalPrice?.toLocaleString()}
                </span>
                {isUpdatingPrices && (
                  <span className="text-xs text-yellow-600 mt-1">
                    Updating prices...
                  </span>
                )}
              </div>
              {isFooterOpen ? (
                <FiChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <FiChevronUp className="w-5 h-5 text-gray-600" />
              )}
            </div>

            {/* ===== Collapsible Content ===== */}
            {isFooterOpen && (
              <div className="p-4 space-y-4 transition-all duration-300">
                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({totalItems} items):
                    </span>
                    <span className="text-gray-900 font-medium">
                      ₹{TotalMrp?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="text-green-600 font-medium">
                      -₹{totalSavings?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-base font-semibold">Total:</span>
                    <span className="text-base font-bold text-[#2f415d]">
                      ₹{TotalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {TotalPrice < freeShippingThreshold && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex justify-between text-sm text-blue-800 mb-1">
                      <span>Add ₹{amountToFreeShipping} for free shipping!</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleViewCart}
                    className="flex-1 py-3 px-4 border border-[#2f415d] text-[#2f415d] rounded-lg font-medium hover:bg-[#2f415d] hover:text-white transition-all duration-300"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-[#e96f84] to-[#e96f84] text-white rounded-lg font-medium hover:from-[#2f415d] hover:to-[#1e2a3a] transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cartheader;