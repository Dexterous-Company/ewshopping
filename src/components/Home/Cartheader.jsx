"use client";
import { FiX } from "react-icons/fi";
import { BsCart3 } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, decrementCart, removeFromCart } from "@/redux/cart/CartSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Cartheader = ({ isCartOpen, closeCart }) => {
  const dispatch = useDispatch();
  const { CartItems } = useSelector((state) => state.cart);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate totals only when mounted
  const totalMrp = isMounted ? (CartItems?.reduce((sum, item) => sum + item.Product_total_Mrp, 0) || 0) : 0;
  const totalPrice = isMounted ? (CartItems?.reduce((sum, item) => sum + item.Product_total_Price, 0) || 0) : 0;
  const totalSavings = isMounted ? (CartItems?.reduce((sum, item) => sum + item.Product_total_Saving, 0) || 0) : 0;
  const totalItems = isMounted ? (CartItems?.reduce((sum, item) => sum + item.cart_Quentity, 0) || 0) : 0;

  // Calculate free shipping threshold
  const freeShippingThreshold = 500;
  const amountToFreeShipping = isMounted ? Math.max(0, freeShippingThreshold - totalPrice) : freeShippingThreshold;
  const progressPercentage = Math.min((totalPrice / freeShippingThreshold) * 100, 100);

  const handleIncrement = (item) => {
    const cartItem = {
      AttributeId: item.AttributeId,
      Mrp: item.Mrp,
      Price: item.Price,
      name: item.name,
      thumbnail: item.thumbnail,
      shopId: item.shopId,
      shopName: item.shopName,
      slugurl: item.slugurl,
    };
    dispatch(addToCart(cartItem));
  };

  const handleDecrement = (item) => {
    const cartItem = {
      AttributeId: item.AttributeId,
      Mrp: item.Mrp,
      Price: item.Price,
      name: item.name,
      thumbnail: item.thumbnail,
      shopId: item.shopId,
      shopName: item.shopName,
      slugurl: item.slugurl,
    };
    dispatch(decrementCart(cartItem));
  };

  const handleRemove = (item) => {
    const cartItem = {
      AttributeId: item.AttributeId,
      Mrp: item.Mrp,
      Price: item.Price,
      name: item.name,
      thumbnail: item.thumbnail,
      shopId: item.shopId,
      shopName: item.shopName,
      slugurl: item.slugurl,
    };
    dispatch(removeFromCart(cartItem));
  };

  return (
    <div
      className={`fixed inset-0 z-[1000] overflow-hidden transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none" }`} onClick={closeCart} >
      <div
        className="absolute inset-0 bg-black/30 bg-opacity-50"
      ></div>
      <div
        className={`absolute top-0 right-0 h-full sm:w-1/4 w-70 max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out
           ${isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        onClick={(e) => e.stopPropagation()}  // ✅ Add this line
>
        {/* Cart Header */}
        <div className="flex justify-between items-center py-2 sm:px-4 px-2 border-b border-gray-300">
          <h2 className="sm:text-lg text-xs font-medium uppercase">
            Your cart ({isMounted ? (CartItems?.length || 0) : 0}){" "}
            {isMounted
              ? CartItems?.length === 1
                ? "Item"
                : "Items"
              : "Items"}
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="h-[calc(100%-220px)] overflow-y-auto sm:px-6 px-3 py-5">
          {!isMounted ? (
            // Loading state during initial render
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <BsCart3 className="w-16 h-16 mb-4" />
              <p className="mb-4">Loading cart...</p>
            </div>
          ) : !CartItems || CartItems.length <= 0 ? (
            // Empty cart state
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <BsCart3 className="w-16 h-16 mb-4" />
              <p className="mb-4">No Products in the Cart</p>
              <button
                onClick={() => {
                  closeCart()
                }}

                className="px-4 py-2 bg-[#e96f84] text-white rounded hover:bg-[#2f415d]"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            // Cart items list
            <ul className="space-y-6">
              {CartItems.map((item) => (
                <li
                  key={item?.AttributeId}
                  className="flex gap-4 pb-4 border-b border-gray-200"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="sm:w-20 sm:h-24 w-20 h-15 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link
                      href={`/product/${encodeURIComponent(item.slugurl)}`}
                      onClick={closeCart}
                      className="hover:text-blue-600 transition-colors"
                    >
                      <h3 className="font-medium text-gray-800 text-xs sm:text-lg">
                        {item?.name?.length > 20
                          ? `${item?.name.slice(0, 20)}...`
                          : item?.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <span className="sm:text-sm text-xs text-gray-500 line-through mr-2">
                          ₹{item?.Mrp?.toLocaleString()}
                        </span>
                        <span className="font-medium sm:text-sm text-2xs text-gray-800">
                          ₹{item?.Price?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="sm:text-sm text-xs text-green-600 my-1">
                      You save ₹{(item?.Mrp - item?.Price).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm">{item?.cart_Quentity}</span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {
          CartItems.length > 0 && (
            isMounted && isCartOpen && (
              <div className="absolute bottom-0 left-0 right-0 py-2 px-4 border-t border-gray-300 bg-white">
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gray-600 h-3 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {amountToFreeShipping > 0 ? (
                      <>
                        Only ₹{amountToFreeShipping.toLocaleString()} away from
                        <span className="font-bold text-black">
                          &nbsp;Free Shipping
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-black">
                        Congratulations! You've got Free Shipping
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total MRP:</span>
                  <span className="text-sm">₹{totalMrp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <span className="text-sm text-green-600">
                    -₹{totalSavings.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4 border-t border-gray-200 pt-2">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">₹{totalPrice.toLocaleString()}</span>
                </div>

                <div className="flex items-center mb-4 text-sm">
                  <input
                    id="prTearm"
                    type="checkbox"
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  />
                  <label htmlFor="prTearm" className="text-gray-600">
                    I agree with the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms & conditions
                    </a>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => {
                    router.push('/checkout');
                    closeCart();
                  }} className="flex-1 bg-[#e96f84] hover:bg-[#2f415d] text-white py-2 rounded font-medium">
                    CHECK OUT
                  </button>
                  <button
                    className="flex-1 bg-[#2f415d] text-white hover:bg-[#e96f84] py-2 rounded font-medium"
                    onClick={() => {
                      router.push('/cart');
                      closeCart();
                    }}
                  >
                    VIEW CART
                  </button>
                </div>
              </div>
            )
          )
        }

      </div>
    </div>
  );
};

export default Cartheader;