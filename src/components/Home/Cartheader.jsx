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
  const { CartItems, TotalMrp, TotalPrice, TotalAmount } = useSelector(
    (state) => state.cart
  );
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
          if (updatedPrices) {
            const priceChanges = CartItems.filter((item) => {
              const updatedItem = updatedPrices.find(
                (up) => up.AttributeId === item.AttributeId
              );
              return (
                updatedItem &&
                (updatedItem.Price !== item.Price ||
                  updatedItem.Mrp !== item.Mrp)
              );
            });
          }
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
  }, [isCartOpen]);

  const totalSavings = TotalMrp - TotalPrice;
  const totalItems = isMounted
    ? CartItems?.reduce((sum, item) => sum + item.cart_Quentity, 0) || 0
    : 0;

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
      {/* Modern Dark Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300" />

      {/* Main Cart Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="relative p-6 border-b border-gray-100 bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative">
                <BsCart3 className="w-6 h-6 mr-3 text-gray-800" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Shopping Cart
                </h2>
                <p className="text-sm text-gray-500">
                  {isMounted ? CartItems?.length || 0 : 0} items
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Cart Content */}
        <div className="h-[calc(100%-100px)] overflow-y-auto p-6  bg-gray-50">
          {!isMounted ? (
            // Modern Loading State
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center animate-pulse">
                  <BsCart3 className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <p className="text-gray-700 font-medium mb-2">
                Loading your cart...
              </p>
              <p className="text-gray-500 text-sm">
                Please wait a moment
              </p>
            </div>
          ) : !CartItems || CartItems.length <= 0 ? (
            // Modern Empty Cart State
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl flex items-center justify-center">
                  <BsBag className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Start adding items to your cart
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push("/");
                }}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            // Modern Cart Items List
            <ul className="space-y-4 mb-20">
              {CartItems.map((item) => (
                <li
                  key={item?.AttributeId}
                  className="flex gap-2 p-2 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={item.productImage || item.thumbnail}
                      alt={item.productName || item.name}
                      className="w-15 h-15 object-cover rounded-lg border border-gray-200"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div>
                      <Link
                        href={`/product/${encodeURIComponent(item.slugurl)}`}
                        onClick={closeCart}
                        className="hover:text-blue-600 transition-colors group"
                      >
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-[#2f415d]">
                          {item.productName || item.name}
                        </h3>
                      </Link>
                    </div>
                    
                    {/* Price and Quantity Controls Row */}
                    <div className="flex items-center justify-between mt-2">
                      {/* Price Section */}
                      <div className="flex items-center">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{item?.Price?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₹{item?.Mrp?.toLocaleString()}
                        </span>
                        {/* <span className="text-xs bg-green-100 text-green-700 font-medium ml-2 px-2 py-1 rounded">
                          Save ₹{(item?.Mrp - item?.Price).toLocaleString()}
                        </span> */}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={item.cart_Quentity <= 1}
                          >
                            −
                          </button>
                          <span className="px-2 py-1 text-sm font-bold bg-gray-50 min-w-[1rem] text-center text-gray-900 border-l border-r border-gray-300">
                            {item?.cart_Quentity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            disabled={item.cart_Quentity >= item.maximumQuantity}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemove(item)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Remove item"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Size and Color Info */}
                    {(item.size || item.color) && (
                      <div className="flex mt-2">
                        {item.size && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded ml-1">
                            Color: {item.color}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Modern Cart Footer */}
        {CartItems && CartItems.length > 0 && isMounted && isCartOpen && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
            {/* Toggle Header */}
            <div
              className="flex justify-between items-center p-6 cursor-pointer select-none bg-gray-50 hover:bg-gray-100 transition-colors"
              onClick={() => setIsFooterOpen((prev) => !prev)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900">
                    Total: ₹{TotalPrice?.toLocaleString()}
                  </span>
                  {isUpdatingPrices && (
                    <span className="text-xs text-blue-600 mt-1 flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                      Updating prices...
                    </span>
                  )}
                </div>
                <button
                  onClick={handleCheckout}
                  className="py-2 px-6 bg-[#2f415d] text-white rounded-lg font-semibold hover:bg-[#2f415d] transition-all duration-200 shadow-lg hover:shadow-xl ml-4"
                >
                  Checkout
                </button>
              </div>
              {isFooterOpen ? (
                <FiChevronDown className="w-6 h-6 text-gray-600 ml-4" />
              ) : (
                <FiChevronUp className="w-6 h-6 text-gray-600 ml-4" />
              )}
            </div>

            {/* Collapsible Content */}
            {isFooterOpen && (
              <div className="p-6 space-y-4 transition-all duration-300">
                {/* Order Summary */}
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
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
                    <span className="text-green-600 font-bold">
                      -₹{totalSavings?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-base pt-3 border-t border-gray-200">
                    <span className="font-bold text-gray-900">
                      Total Amount:
                    </span>
                    <span className="font-bold text-gray-900 text-lg">
                      ₹{TotalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {/* {TotalPrice < freeShippingThreshold && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex justify-between text-sm text-blue-800 mb-2 font-medium">
                      <span>
                        Add ₹{amountToFreeShipping} for FREE Shipping!
                      </span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )} */}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleViewCart}
                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    View Cart
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