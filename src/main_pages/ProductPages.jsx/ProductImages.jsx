"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaExpand, FaHeart } from "react-icons/fa";
import { FiZoomIn } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { addToCart, decrementCart } from "@/redux/cart/CartSlice";
import {
  addToWishlistLocal,
  addToWishlistServer,
  fetchUserWishlist,
  removeFromWishlistLocal,
  removeFromWishlistServer,
} from "@/redux/wishlist/wishlistSlice";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import toast from "react-hot-toast";

const ProductImagesSkeleton = () => {
  // ... (keep the same skeleton code)
};

const ProductImages = ({
  product,
  setselectedImage,
  setMobileImageHigh,
  setShowMagnifier,
  showMagnifier,
  imageRef,
  setCursorPosition,
  setMagnifierPosition,
  cursorPosition,
}) => {
  const dispatch = useDispatch();
  const { loginData, isAuth } = useSelector((store) => store.Athentication);
  const { selectedVariant, status } = useSelector((state) => state.info);

  const { CartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [isMobile, setIsMobile] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const getValidImageSrc = (src) =>
    src && src.trim() !== "" ? src : "https://via.placeholder.com/300";

  // Safely extract product data with proper fallbacks
  const productData = product?.[0] || {};
  const variants = productData?.simpleAttributes || [];
  const currentVariant = variants[selectedVariant] || {};

  // FIX: Ensure selectedVariantImages is always an array
  const selectedVariantImages = Array.isArray(currentVariant?.slider)
    ? currentVariant.slider
    : [];

  const mainImage =
    selectedVariantImages[selectedImageIndex] ||
    currentVariant?.thumbnail ||
    productData?.thumbnail?.[0] ||
    "https://via.placeholder.com/300";

  const handleBuyNow = async () => {
    const cartItem = CartItems.find(
      (item) => item.AttributeId === currentVariant._id
    );

    if (!cartItem) {
      await handleAddToCart();
    }

    router.push("/cart");
  };

  // ✅ Send current main image to parent
  useEffect(() => {
    if (mainImage) {
      setselectedImage(mainImage);
    }
  }, [mainImage, setselectedImage]);

  const [isWishlisted, setIsWishlisted] = useState(false);
  useEffect(() => {
    if (currentVariant?._id && productData?._id) {
      const isInWishlist = wishlistItems.some(
        (item) =>
          item.ProductId === productData._id &&
          item.AttributeId === currentVariant._id
      );
      setIsWishlisted(isInWishlist);
    }
  }, [wishlistItems, currentVariant, productData]);

  const router = useRouter();

  const handleWishlistToggle = async () => {
    if (!loginData?._id) {
      return router.push("/login");
    }
    if (!productData || !currentVariant || !loginData?._id) return;

    const wishlistItem = {
      userId: loginData._id,
      UserName: loginData.Name,
      UserEmail: loginData.Email,
      UserMobile: loginData.Mobile,
      ProductId: productData._id,
      ProductName: productData.name,
      AttributeId: currentVariant._id,
      Mrp: currentVariant.mrp,
      Price: currentVariant.price,
      thumbnail: currentVariant.thumbnail || productData.thumbnail?.[0],
      shopId: productData.shopId || "4567898765456789",
      shopName: productData.shopName || "demooo",
      productSlug: productData.slugUrl,
    };

    try {
      if (isWishlisted) {
        await dispatch(
          removeFromWishlistServer({
            userId: loginData._id,
            ProductId: productData._id,
            AttributeId: currentVariant._id,
          })
        ).unwrap();
        dispatch(removeFromWishlistLocal(wishlistItem));
      } else {
        await dispatch(addToWishlistServer(wishlistItem)).unwrap();
        dispatch(addToWishlistLocal(wishlistItem));
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    }
  };

  useEffect(() => {
    if (isAuth && loginData?._id) {
      dispatch(fetchUserWishlist(loginData._id));
    }
  }, [isAuth, loginData?._id, dispatch]);

  const handleAddToCart = async () => {
    if (!productData || !currentVariant) return;

    const cartItemInStore = CartItems.find(
      (item) => item.AttributeId === currentVariant._id
    );
    const quantity = cartItemInStore?.cart_Quentity || 0;
    if (quantity >= currentVariant.maximumQuantity) {
      toast.error(
        `Maximum ${currentVariant.maximumQuantity} products allowed!`
      );
      return;
    }
    const cartItem = {
      AttributeId: currentVariant._id,
      Mrp: currentVariant.mrp,
      Price: currentVariant.price,
      name: productData.name,
      thumbnail: currentVariant.thumbnail,
      shopId: productData.shopId,
      shopName: productData.shopName,
      slugurl: productData.slugUrl,
      availableStock: currentVariant?.availablestock,
      maximumQuantity: currentVariant?.maximumQuantity,
    };
    return dispatch(addToCart(cartItem));
  };

  const handleDecrementToCart = () => {
    if (!productData || !currentVariant) return;
    const cartItem = {
      AttributeId: currentVariant._id,
      Mrp: currentVariant.mrp,
      Price: currentVariant.price,
      name: productData.name,
      thumbnail: currentVariant.thumbnail,
      shopId: productData.shopId,
      shopName: productData.shopName,
      slugurl: productData.slugUrl,
    };
    dispatch(decrementCart(cartItem));
  };

  const handleSlideChange = (swiper) => {
    setSelectedImageIndex(swiper.activeIndex);
    // ✅ update parent when mobile swiper changes
    const newImage =
      selectedVariantImages[swiper.activeIndex] ||
      currentVariant?.thumbnail ||
      productData?.thumbnail?.[0] ||
      "https://via.placeholder.com/300";
    setselectedImage(newImage);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const image = imageRef.current;
    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    setCursorPosition({ x, y });
    setMagnifierPosition({ x: xPercent, y: yPercent });
  };

  if (
    status === "loading" ||
    !currentVariant ||
    !productData ||
    !product ||
    product.length === 0
  ) {
    return <ProductImagesSkeleton />;
  }

  return (
    <div className="w-full ">
      <div className="bg-white sm:rounded-xl shadow-sm overflow-hidden ">
        <div className="flex flex-col lg:flex-row gap-1 relative ">
          {!isMobile && (
            <div className="relative lg:w-24">
              <div
                ref={thumbnailContainerRef}
                className="hidden lg:flex flex-col gap-2 overflow-y-auto scroll-smooth snap-y snap-mandatory h-[400px] lg:h-[500px] py-6 px-1 no-scrollbar"
              >
                {selectedVariantImages.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`min-w-[80px] h-[80px] border-2 rounded-lg overflow-hidden transition-all duration-200 flex-shrink-0 snap-start ${
                      selectedImageIndex === index
                        ? "border-rose-500 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={getValidImageSrc(src)}
                      alt={`Thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative flex-1 group">
            {isMobile ? (
              <div
                className="relative h-auto w-full bg-gray-100"
                onClick={() => setMobileImageHigh(true)}
              >
                <Swiper
                  ref={swiperRef}
                  initialSlide={selectedImageIndex}
                  onSlideChange={handleSlideChange}
                  pagination={{ dynamicBullets: true }}
                  modules={[Pagination]}
                  className="h-full w-full"
                >
                  {selectedVariantImages.map((src, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative h-full w-full">
                        <img
                          src={getValidImageSrc(src)}
                          alt={`Product image ${index + 1}`}
                          className="object-contain max-h-full w-full"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div
                className="relative aspect-square w-full overflow-hidden rounded-lg bg-white"
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onMouseMove={handleMouseMove}
              >
                <div ref={imageRef} className="relative w-full h-full">
                  <Image
                    src={getValidImageSrc(mainImage)}
                    alt="Main product image"
                    fill
                    className="object-cover sm:object-contain transition-opacity duration-300"
                    priority
                  />
                  {showMagnifier && (
                    <div
                      className="absolute bg-white/40 bg-opacity-30 pointer-events-none z-20"
                      style={{
                        width: "150px",
                        height: "100px",
                        left: `${cursorPosition.x - 75}px`,
                        top: `${cursorPosition.y - 75}px`,
                        display:
                          cursorPosition.x === 0 && cursorPosition.y === 0
                            ? "none"
                            : "block",
                      }}
                    />
                  )}
                  <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                    <FiZoomIn className="text-gray-700 text-xl" />
                  </button>
                </div>
              </div>
            )}

            <div className="hidden absolute top-4 left-4 md:flex gap-2 z-10">
              <span className="bg-cyan-500 text-white text-xs font-semibold px-3 py-1 uppercase rounded-full shadow-md animate-pulse">
                New Arrival
              </span>
              {currentVariant.price && currentVariant.mrp && (
                <span className="hidden sm:block bg-rose-600 text-white text-xs font-semibold px-3 py-1 uppercase rounded-full shadow-md">
                  {Math.round(
                    (1 - currentVariant.price / currentVariant.mrp) * 100
                  )}
                  % OFF
                </span>
              )}
            </div>

            <button
              onClick={() => handleWishlistToggle()}
              className={`absolute z-10 top-4 right-4 p-3 rounded-full shadow-md transition-all ${
                isWishlisted
                  ? "bg-rose-500 text-white"
                  : "bg-white/90 hover:bg-white text-gray-700"
              }`}
            >
              <FaHeart className={isWishlisted ? "fill-current" : ""} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div
          className={`sm:p-3 bg-gray-50 border-t border-gray-200 
            ${
              isMobile
                ? "fixed bottom-0 left-0 right-0 z-[100] px-10"
                : "sticky bottom-0"
            }
          `}
        >
          <div className="flex flex-row gap-3">
            {(() => {
              const cartItem = CartItems.find(
                (item) => item.AttributeId === currentVariant._id
              );
              const quantity = cartItem?.cart_Quentity || 0;
              if (quantity === 0) {
                return (
                  <button
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 my-3 sm:my-0 sm:py-4 sm:px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => handleAddToCart()}
                  >
                    ADD TO CART
                  </button>
                );
              } else {
                return (
                  <div className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 my-3 sm:my-0 sm:py-4 sm:px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleDecrementToCart()}
                      className="bg-rose-600 px-3 py-1 rounded-lg"
                    >
                      -
                    </button>
                    <span className="text-lg">{quantity}</span>
                    <button
                      onClick={() => handleAddToCart()}
                      className="bg-rose-600 px-3 py-1 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                );
              }
            })()}

            <button
              className="flex-1 bg-[#2f415d] my-3 sm:my-0 hover:bg-[#2f415d] text-white font-medium py-4 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              onClick={handleBuyNow}
            >
              BUY NOW
            </button>
          </div>
        </div> */}
        {/* <div
          className={`sm:p-3 bg-gray-50 border-t border-gray-200 
    ${
      isMobile
        ? "fixed bottom-0 left-0 right-0 z-[100] px-10"
        : "sticky bottom-0"
    }
  `}
        >
          <div className="flex flex-row gap-3">
            {(() => {
              const cartItem = CartItems.find(
                (item) => item.AttributeId === currentVariant._id
              );
              const quantity = cartItem?.cart_Quentity || 0;
              const isOutOfStock = currentVariant?.availablestock <= 0;

              if (quantity === 0) {
                return (
                  <button
                    className={`flex-1 font-medium py-2 my-3 sm:my-0 sm:py-4 sm:px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
                      isOutOfStock
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-rose-500 hover:bg-rose-600 text-white"
                    }`}
                    onClick={() => handleAddToCart()}
                    disabled={isOutOfStock}
                  >
                    {isOutOfStock ? "Out of Stock" : "ADD TO CART"}
                  </button>
                );
              } else {
                return (
                  <div
                    className={`flex-1 font-medium py-3 my-3 sm:my-0 sm:py-4 sm:px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-between gap-2 ${
                      isOutOfStock
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-rose-500 hover:bg-rose-600 text-white"
                    }`}
                  >
                    <button
                      onClick={() => handleDecrementToCart()}
                      className="bg-rose-600 px-3 py-1 rounded-lg"
                      disabled={isOutOfStock}
                    >
                      -
                    </button>
                    <span className="text-lg">{quantity}</span>
                    <button
                      onClick={() => handleAddToCart()}
                      className="bg-rose-600 px-3 py-1 rounded-lg"
                      disabled={isOutOfStock}
                    >
                      +
                    </button>
                  </div>
                );
              }
            })()}

            <button
              className={`flex-1 font-medium py-4 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
                currentVariant?.availablestock <= 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#2f415d] hover:bg-[#2f415d] text-white"
              }`}
              onClick={handleBuyNow}
              disabled={currentVariant?.availablestock <= 0}
            >
              BUY NOW
            </button>
          </div>
        </div> */}

        {/* <div
          className={`sm:p-3 bg-gray-50 border-t border-gray-200 ${
            isMobile
              ? "fixed bottom-0 left-0 right-0 z-[100] px-10"
              : "sticky bottom-0"
          }`}
        >
          <div className="flex flex-row gap-3">
            {(() => {
              const cartItem = CartItems.find(
                (item) => item.AttributeId === currentVariant._id
              );
              const quantity = cartItem?.cart_Quentity || 0;
              const isOutOfStock = currentVariant?.availablestock >= 0;

              return quantity === 0 ? (
                <button
                  className={`flex-1 font-medium py-4 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? "bg-gray-300 cursor-not-allowed text-gray-700"
                      : "bg-rose-500 hover:bg-rose-600 text-white"
                  }`}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? "Out of Stock" : "ADD TO CART"}
                </button>
              ) : (
                <div
                  className={`flex-1 font-medium py-4 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-between gap-2 ${
                    isOutOfStock
                      ? "bg-gray-300 cursor-not-allowed text-gray-700"
                      : "bg-rose-500 hover:bg-rose-600 text-white"
                  }`}
                >
                  <button
                    onClick={handleDecrementToCart}
                    className="bg-rose-600 px-3 py-1 rounded-lg"
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={handleAddToCart}
                    className="bg-rose-600 px-3 py-1 rounded-lg"
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
              );
            })()}

            <button
              className={`flex-1 font-medium py-4 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
                currentVariant?.availablestock >= 0
                  ? "bg-gray-300 cursor-not-allowed text-gray-700"
                  : "bg-[#2f415d] hover:bg-[#2f415d] text-white"
              }`}
              onClick={handleBuyNow}
              disabled={currentVariant?.availablestock >= 0}
            >
              BUY NOW
            </button>
          </div>
        </div> */}

        <div
          className={`p-3 bg-gray-50 border-t border-gray-200 ${
            isMobile
              ? "fixed bottom-0 left-0 right-0 z-[100] "
              : "sticky bottom-0"
          }`}
        >
          <div className="flex flex-row gap-3 mb-1">
            {(() => {
              const cartItem = CartItems.find(
                (item) => item.AttributeId === currentVariant._id
              );
              const quantity = cartItem?.cart_Quentity || 0;
              const isOutOfStock = currentVariant?.availablestock <= 0;
              return quantity === 0 ? (
                <button
                  className={`flex-1 font-medium sm:text-base text-[0.7rem] py-4 px-6 rounded-sm shadow-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? "bg-rose-500  text-white cursor-not-allowed opacity-60"
                      : "bg-rose-500 hover:bg-rose-600 text-white"
                  }`}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? "Out of Stock" : "ADD TO CART"}
                </button>
              ) : (
                <div
                  className={`flex-1 font-medium py-2 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-between gap-2 ${
                    isOutOfStock
                      ? "bg-rose-500 text-white cursor-not-allowed opacity-60"
                      : "bg-rose-500 hover:bg-rose-600 text-white"
                  }`}
                >
                  <button
                    onClick={handleDecrementToCart}
                    className="bg-rose-600 px-3 py-1 rounded-lg"
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={handleAddToCart}
                    className="bg-rose-600 px-3 py-1 rounded-lg"
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
              );
            })()}

            <button
              className={`flex-1 font-medium py-4 px-6 sm:text-base text-[0.7rem] rounded-sm shadow-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                currentVariant?.availablestock <= 0
                  ? "bg-[#2f415d] text-white cursor-not-allowed opacity-60"
                  : "bg-[#2f415d] hover:bg-[#2f415d] text-white"
              }`}
              onClick={handleBuyNow}
              disabled={currentVariant?.availablestock <= 0}
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
