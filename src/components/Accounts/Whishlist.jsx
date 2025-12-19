// File: components/Wishlist.jsx
"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoIosArrowRoundBack, IoMdHeartDislike } from "react-icons/io";
import { MdDelete, MdShoppingCart } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserWishlist,
  removeFromWishlistServer,
} from "@/redux/wishlist/wishlistSlice";
import Link from "next/link";
import { addToCart } from "@/redux/cart/CartSlice";
import { getSingleApprovedProductDetails } from "@/redux/product/productSlice";

/**
 * LocalStorage format used (Option A):
 * localStorage.setItem("wish_collections", JSON.stringify({
 *   "My Wishlist": ["prodId1", "prodId2"],
 *   "Kurti Collection": ["prodId3"]
 * }))
 *
 * Note: product identifier stored is: item.ProductId || item.productSlug
 */

const STORAGE_KEY = "wish_collections";
const DEFAULT_COLLECTION = "My Wishlist";

const Wishlist = () => {
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { CartItems } = useSelector((state) => state.cart);
  const [wishlistProducts, setWishlistProducts] = useState([]);

  const { loginData, isAuth } = useSelector((store) => store.Athentication);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSaveCollection, setShowSaveCollection] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isMounted, setIsMounted] = useState(false);

  // Collections state (object: collectionName -> array of productIds)
  const [collections, setCollections] = useState({});
  // UI state for creating new collection
  const [creating, setCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  // local checkbox state for sheet (collectionName -> boolean)
  const [checkedMap, setCheckedMap] = useState({});
  // Toast
  const [toast, setToast] = useState({ visible: false, msg: "" });

  useEffect(() => {
    setIsMounted(true);
    loadCollectionsFromStorage();
  }, []);

  useEffect(() => {
    if (isAuth && loginData?._id) {
      dispatch(fetchUserWishlist(loginData._id));
    }
  }, [isAuth, loginData?._id, dispatch]);

  useEffect(() => {
    if (wishlistItems.length === 0) return;

    const fetchAllProducts = async () => {
      try {
        const productsData = await Promise.all(
          wishlistItems.map(async (item) => {
            const response = await dispatch(
              getSingleApprovedProductDetails(item.productSlug)
            ).unwrap();
            return response;
          })
        );
        setWishlistProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
      }
    };

    fetchAllProducts();
  }, [wishlistItems, dispatch]);

  // ------------------- LocalStorage helpers -------------------
  const loadCollectionsFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // initialize with default collection (empty)
        const init = { [DEFAULT_COLLECTION]: [] };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
        setCollections(init);
        return;
      }
      const parsed = JSON.parse(raw) || {};
      // ensure default exists
      if (!parsed[DEFAULT_COLLECTION]) parsed[DEFAULT_COLLECTION] = [];
      setCollections(parsed);
    } catch (e) {
      console.error("Failed to load collections:", e);
      setCollections({ [DEFAULT_COLLECTION]: [] });
    }
  };

  const saveCollectionsToStorage = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setCollections(next);
    } catch (e) {
      console.error("Failed to save collections:", e);
    }
  };

  // Utility to get product id used in collections
  const productIdForItem = (item) => {
    // prefer ProductId, fallback to slug
    return item?.ProductId ? String(item.ProductId) : String(item?.productSlug || "");
  };

  // ------------------- Toast helper -------------------
  const showToast = (msg, ms = 2000) => {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: "" }), ms);
  };

  // ------------------- Delete from wishlist (existing) -------------------
  const handleDelete = async (item) => {
    if (item && loginData?._id) {
      try {
        await dispatch(
          removeFromWishlistServer({
            userId: loginData._id,
            ProductId: item.ProductId,
            AttributeId: item.AttributeId,
          })
        ).unwrap();
        dispatch(fetchUserWishlist(loginData._id));
        // show flipkart like toast
        showToast("Item removed from wishlist");
      } catch (error) {
        console.error("Failed to remove from wishlist:", error);
        showToast("Failed to remove item");
      }
    } else {
      // If not logged in or missing, still close UI
      showToast("Item removed from wishlist");
    }

    setShowMobileMenu(false);
    setSelectedItem(null);
    setShowSaveCollection(false);
  };

  // ------------------- Add to cart (existing) -------------------
  const handleAddToCart = (item) => {
    if (item) {
      const cartItem = {
        AttributeId: item?.AttributeId,
        Mrp: item?.Mrp,
        Price: item?.Price,
        name: item?.ProductName,
        thumbnail: item?.thumbnail,
        shopId: item?.shopId,
        shopName: item?.shopName,
        slugurl: item?.productSlug,
      };
      dispatch(addToCart(cartItem));
      router.push("/cart");
    }
  };

  // ------------------- Save sheet open handler -------------------
  const openSaveSheetForItem = (item) => {
    if (!item) return;
    setSelectedItem(item);
    // build checkedMap from collections
    const id = productIdForItem(item);
    const map = {};
    Object.keys(collections).forEach((cName) => {
      map[cName] = Array.isArray(collections[cName]) && collections[cName].includes(id);
    });
    setCheckedMap(map);
    setShowSaveCollection(true);
  };

  // ------------------- Checkbox toggle in sheet -------------------
  const toggleCollectionForSelectedItem = (collectionName) => {
    if (!selectedItem) return;
    const id = productIdForItem(selectedItem);
    const current = { ...collections };
    const arr = Array.isArray(current[collectionName]) ? [...current[collectionName]] : [];

    const already = arr.includes(id);
    if (already) {
      // remove
      const nextArr = arr.filter((x) => x !== id);
      current[collectionName] = nextArr;
      showToast(`Removed from "${collectionName}"`);
    } else {
      // add
      arr.push(id);
      current[collectionName] = arr;
      showToast(`Saved to "${collectionName}"`);
    }

    saveCollectionsToStorage(current);

    // update checked map
    setCheckedMap((prev) => ({ ...prev, [collectionName]: !already }));
  };

  // ------------------- Create new collection (localStorage) -------------------
  const createNewCollection = () => {
    const name = (newCollectionName || "").trim();
    if (!name) {
      showToast("Enter collection name");
      return;
    }
    // avoid duplicate name
    if (collections[name]) {
      showToast("Collection already exists");
      return;
    }
    const next = { ...collections, [name]: [] };
    saveCollectionsToStorage(next);
    setNewCollectionName("");
    setCreating(false);

    // If currently a selectedItem, automatically add item to new collection
    if (selectedItem) {
      const id = productIdForItem(selectedItem);
      next[name] = [id];
      saveCollectionsToStorage(next);
      setCheckedMap((prev) => ({ ...prev, [name]: true }));
      showToast(`Saved to "${name}"`);
    } else {
      showToast(`Collection "${name}" created`);
    }
  };

  // ------------------- Done (close sheet) -------------------
  const handleDone = () => {
    // You can send the updated collections to backend here if needed
    // Example: POST /user/:id/collections
    setShowSaveCollection(false);
    setSelectedItem(null);
    setCreating(false);
    setNewCollectionName("");
    showToast("Collections updated");
  };

  // ------------------- Render -------------------
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-6 lg:px-8">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.2s ease-out;
        }
        /* simple toast style */
        .wish-toast {
          transition: all 0.18s ease;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 bg-white hover:bg-gray-100 text-gray-600 rounded-lg shadow-sm border border-gray-200"
          >
            <IoIosArrowRoundBack size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Wishlist</h1>
            <p className="text-gray-600 text-sm mt-1">
              Your saved favorites and loved items
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                <FaHeart />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">All Wishlist</span>
                <span className="text-lg font-bold text-gray-800">
                  {isMounted ? wishlistItems.length : 0}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-gray-500 to-slate-600 text-white">
                <IoMdHeartDislike />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-600">Expired</span>
                <span className="text-lg font-bold text-gray-800">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wishlist Items Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Wishlist Items ({wishlistItems.length})
            </h2>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4">
                {wishlistItems.map((item, index) => {
                  const productDetails = wishlistProducts?.find(
                    (prod) => prod?.product[0]?.slugUrl === item.productSlug
                  );
                  const availableStock =
                    productDetails?.product[0]?.availablestock || 0;
                  const isInCart = CartItems.some(
                    (cartItem) => cartItem.AttributeId === item.AttributeId
                  );
                  const discountPercentage = Math.round(
                    ((item.Mrp - item.Price) / item.Mrp) * 100
                  );

                  return (
                    <div key={index} className="relative">
                      {/* Mobile View */}
                      <div className="sm:hidden">
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                          <div className="flex gap-4">
                            {/* Image */}
                            <div className="relative flex-shrink-0">
                              <img
                                src={item?.thumbnail}
                                className="h-24 w-24 rounded-lg object-cover"
                                alt={item.ProductName}
                              />
                              {discountPercentage > 0 && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                  {discountPercentage}% OFF
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <Link href={`/product/${item.productSlug}`}>
                                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                                  {item.ProductName}
                                </h3>
                              </Link>

                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex text-yellow-400 text-xs">
                                  <span>★</span>
                                  <span>★</span>
                                  <span>★</span>
                                  <span>★</span>
                                  <span>★</span>
                                </div>
                                <span className="text-xs text-gray-500">(1,499)</span>
                              </div>

                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-bold text-gray-900">
                                  ₹{item.Price}
                                </span>
                                <span className="text-sm line-through text-gray-400">
                                  ₹{item.Mrp}
                                </span>
                                <span className="text-xs text-green-600 font-semibold">
                                  Save ₹{item.Mrp - item.Price}
                                </span>
                              </div>

                              <div
                                className={`text-xs px-2 py-1 rounded-full inline-block ${
                                  availableStock <= 0
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {availableStock <= 0 ? "Out of Stock" : "In Stock"}
                              </div>
                            </div>
                          </div>

                          {/* Bottom Actions - Mobile */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <button
                              className={`flex-1 px-4 py-2.5 font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${
                                availableStock <= 0
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : isInCart
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : "bg-blue-500 hover:bg-blue-600 text-white"
                              }`}
                              onClick={() => {
                                if (availableStock > 0) {
                                  if (!isInCart) {
                                    handleAddToCart(item);
                                  } else {
                                    router.push("/cart");
                                  }
                                }
                              }}
                            >
                              <MdShoppingCart size={16} />
                              {availableStock <= 0
                                ? "Out of Stock"
                                : isInCart
                                ? "Go to Cart"
                                : "Add to Cart"}
                            </button>

                            {/* Three Dots Menu - Mobile */}
                            <div className="relative ml-3">
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowMobileMenu(true);
                                }}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all"
                              >
                                <HiDotsVertical size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop View - untouched */}
                      <div className="hidden sm:block">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                          <div className="flex gap-6">
                            {/* Left: Image */}
                            <div className="relative flex-shrink-0">
                              <img
                                src={item?.thumbnail}
                                className="h-40 w-40 rounded-lg object-cover"
                                alt={item.ProductName}
                              />
                              {discountPercentage > 0 && (
                                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                                  {discountPercentage}% OFF
                                </div>
                              )}
                            </div>

                            {/* Middle: Product Details */}
                            <div className="flex-1 min-w-0">
                              <Link href={`/product/${item.productSlug}`}>
                                <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors mb-2">
                                  {item.ProductName}
                                </h3>
                              </Link>

                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex text-yellow-400 text-sm">
                                  <span>★</span>
                                  <span>★</span>
                                  <span>★</span>
                                  <span>★</span>
                                  <span>★</span>
                                </div>
                                <span className="text-sm text-gray-500">1,499 Ratings</span>
                              </div>

                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl font-bold text-gray-900">
                                  ₹{item.Price}
                                </span>
                                <span className="text-lg line-through text-gray-400">
                                  ₹{item.Mrp}
                                </span>
                                <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                                  Save ₹{item.Mrp - item.Price}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 mb-4">
                                <div
                                  className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                                    availableStock <= 0
                                      ? "bg-red-100 text-red-600"
                                      : "bg-green-100 text-green-600"
                                  }`}
                                >
                                  {availableStock <= 0 ? "Out of Stock" : "In Stock"}
                                </div>

                                {availableStock > 0 && (
                                  <div className="text-sm text-gray-600">Delivery by Tomorrow</div>
                                )}
                              </div>
                            </div>

                            {/* Right: Action Buttons - Desktop */}
                            <div className="flex flex-col items-end gap-4 min-w-[200px]">
                              <div className="flex gap-3">
                                <button
                                  className={`px-6 py-3 font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                                    availableStock <= 0
                                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                      : isInCart
                                      ? "bg-green-500 hover:bg-green-600 text-white"
                                      : "bg-blue-500 hover:bg-blue-600 text-white"
                                  }`}
                                  onClick={() => {
                                    if (availableStock > 0) {
                                      if (!isInCart) {
                                        handleAddToCart(item);
                                      } else {
                                        router.push("/cart");
                                      }
                                    }
                                  }}
                                >
                                  <MdShoppingCart size={16} />
                                  {availableStock <= 0 ? "Out of Stock" : isInCart ? "Go to Cart" : "Add to Cart"}
                                </button>

                                {/* Delete Button - Desktop (Direct Delete) */}
                                <button
                                  onClick={() => handleDelete(item)}
                                  className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all"
                                  title="Remove from wishlist"
                                >
                                  <MdDelete size={18} />
                                </button>
                              </div>

                              {availableStock > 0 && !isInCart && (
                                <div className="text-xs text-gray-500 text-right">Free delivery on orders above ₹499</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6">
                <FaRegHeart className="text-4xl text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Your wishlist is empty</h3>
              <p className="text-gray-500 text-sm mb-8 max-w-md">
                Save items you love for later. When you add your favorite products, they'll appear here.
              </p>
              <Link href="/">
                <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-all shadow-sm hover:shadow">
                  Continue Shopping
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu - Three dots */}
      {showMobileMenu && selectedItem && (
        <div
          className="fixed inset-0 z-50 sm:hidden"
          onClick={() => setShowMobileMenu(false)}
        >
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Bottom sheet with options */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl animate-fadeInUp" onClick={(e) => e.stopPropagation()}>
            <div className="py-2">
              {/* Save to other collections */}
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  // open sheet: prepare checked map from current collections
                  openSaveSheetForItem(selectedItem);
                }}
                className="flex items-center gap-4 w-full px-6 py-4 text-sm font-normal text-gray-800 hover:bg-gray-100 transition-all border-b border-gray-100"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {/* Bookmark Icon */}
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                  </svg>
                </div>
                <span className="text-left">Save to other collections</span>
              </button>

              {/* Remove from wishlist */}
              <button
                onClick={() => handleDelete(selectedItem)}
                className="flex items-center gap-4 w-full px-6 py-4 text-sm font-normal text-gray-800 hover:bg-red-50 transition-all"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  {/* Delete Icon */}
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </div>
                <span className="text-left">Remove from wishlist</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save to Collections Sheet (Flipkart style) */}
      {showSaveCollection && selectedItem && (
        <div
          className="fixed inset-0 z-50 sm:hidden"
          onClick={() => setShowSaveCollection(false)}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl animate-fadeInUp p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Manage item</h2>

            {/* Product preview row */}
            <div className="flex items-center gap-3 mb-4">
              <img src={selectedItem.thumbnail} alt={selectedItem.ProductName} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{selectedItem.ProductName}</p>
                <p className="text-xs text-gray-500">₹{selectedItem.Price} · {selectedItem.Mrp ? `₹${selectedItem.Mrp}` : ""}</p>
              </div>
            </div>

            {/* Create a new collection (toggle to input) */}
            {!creating ? (
              <button
                onClick={() => {
                  setCreating(true);
                  setTimeout(() => {
                    const el = document.getElementById("new-collection-input");
                    if (el) el.focus();
                  }, 50);
                }}
                className="w-full flex items-center gap-3 py-4 px-3 rounded-lg border border-gray-300 mb-4"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 text-xl">+</div>
                <span className="font-medium text-gray-700">Create a new collection</span>
              </button>
            ) : (
              <div className="mb-4">
                <input
                  id="new-collection-input"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name"
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={createNewCollection}
                    className="flex-1 bg-blue-600 text-white py-2 rounded"
                  >
                    Create & Save
                  </button>
                  <button
                    onClick={() => {
                      setCreating(false);
                      setNewCollectionName("");
                    }}
                    className="flex-1 border rounded py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Collections list (map dynamic collections) */}
            <div className="space-y-3 max-h-56 overflow-y-auto mb-4">
              {Object.keys(collections).map((cName) => {
                // display each collection row with checkbox
                const isChecked = !!checkedMap[cName];
                // basic meta count
                const count = Array.isArray(collections[cName]) ? collections[cName].length : 0;
                return (
                  <div key={cName} className="flex items-center justify-between py-3 px-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-500">❤️</div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{cName}</p>
                        <p className="text-xs text-gray-500">{count} items</p>
                      </div>
                    </div>

                    <div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCollectionForSelectedItem(cName)}
                        className="w-5 h-5"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Done button */}
            <button
              onClick={handleDone}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium tracking-wide"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        aria-live="polite"
        className="fixed left-1/2 -translate-x-1/2 bottom-8 z-60"
      >
        <div
          className={`wish-toast px-4 py-2 rounded shadow ${toast.visible ? "opacity-100" : "opacity-0 pointer-events-none"} bg-gray-800 text-white`}
          role="status"
        >
          {toast.msg}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
