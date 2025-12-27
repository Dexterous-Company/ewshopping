"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaExpand, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
import toast from "react-hot-toast";

const ProductImagesSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="bg-gray-100 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-4 relative">
          {/* Thumbnail Skeleton */}
          <div className="hidden lg:flex flex-col gap-3 overflow-y-auto h-[500px] py-6 px-2">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="min-w-[80px] h-[80px] bg-gray-300 rounded-lg"
              ></div>
            ))}
          </div>
          
          {/* Main Image Skeleton */}
          <div className="flex-1">
            <div className="aspect-square w-full bg-gray-300 rounded-xl"></div>
          </div>
        </div>
        
        {/* Button Skeleton */}
        <div className="p-4 bg-gray-100 border-t border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gray-300 rounded-lg"></div>
            <div className="flex-1 h-12 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
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
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

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

  const allImages = [
    currentVariant?.thumbnail || productData?.thumbnail?.[0],
    ...selectedVariantImages,
  ].filter((src, index, array) => src && array.indexOf(src) === index);

  const mainImage =
    allImages[selectedImageIndex] || "https://via.placeholder.com/300";

  const router = useRouter();

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

  const handleThumbnailClick = (index, src) => {
    setSelectedImageIndex(index);
    setselectedImage(src);
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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedImageIndex < allImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
      const newImage = allImages[selectedImageIndex + 1];
      setselectedImage(newImage);
    } else if (isRightSwipe && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
      const newImage = allImages[selectedImageIndex - 1];
      setselectedImage(newImage);
    }

    setTouchStartX(0);
    setTouchEndX(0);
  };

  const goToNextSlide = () => {
    if (selectedImageIndex < allImages.length - 1) {
      const newIndex = selectedImageIndex + 1;
      setSelectedImageIndex(newIndex);
      const newImage = allImages[newIndex];
      setselectedImage(newImage);
    }
  };

  const goToPrevSlide = () => {
    if (selectedImageIndex > 0) {
      const newIndex = selectedImageIndex - 1;
      setSelectedImageIndex(newIndex);
      const newImage = allImages[newIndex];
      setselectedImage(newImage);
    }
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
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-4 relative">
          {!isMobile && (
            <div className="relative lg:w-24">
              <div
                ref={thumbnailContainerRef}
                className="hidden lg:flex flex-col gap-3 overflow-y-auto scroll-smooth snap-y snap-mandatory h-[500px] py-6 px-2 no-scrollbar"
              >
                {/* Combine main image with slider images */}
                {allImages.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index, src)}
                    className={`min-w-[80px] h-[80px] border-2 rounded-lg overflow-hidden transition-all duration-200 flex-shrink-0 snap-start ${
                      selectedImageIndex === index
                        ? "border-blue-500 shadow-md scale-105"
                        : "border-gray-200 hover:border-blue-300"
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
              <div className="relative w-full bg-gray-50">
                {/* Mobile Image Slider */}
                <div 
                  className="relative w-full overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}
                  >
                    {allImages.map((src, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0 relative aspect-square"
                      >
                        <img
                          src={getValidImageSrc(src)}
                          alt={`Product image ${index + 1}`}
                          className="object-contain w-full h-full"
                          onClick={() => setMobileImageHigh(true)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      {selectedImageIndex > 0 && (
                        <button
                          onClick={goToPrevSlide}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                        >
                          <FaChevronLeft size={20} />
                        </button>
                      )}
                      {selectedImageIndex < allImages.length - 1 && (
                        <button
                          onClick={goToNextSlide}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
                        >
                          <FaChevronRight size={20} />
                        </button>
                      )}
                    </>
                  )}
                  
                  {/* Pagination Dots */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === selectedImageIndex
                              ? "bg-black w-6"
                              : "bg-gray-400"
                          }`}
                          onClick={() => handleThumbnailClick(index, allImages[index])}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50"
                onMouseEnter={() => setShowMagnifier(true)}
                onMouseLeave={() => setShowMagnifier(false)}
                onMouseMove={handleMouseMove}
              >
                <div ref={imageRef} className="relative w-full h-full">
                  <Image
                    src={getValidImageSrc(mainImage)}
                    alt="Main product image"
                    fill
                    className="object-cover sm:object-cover transition-opacity duration-300"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 border border-gray-200">
                    <FiZoomIn className="text-gray-700 text-xl" />
                  </button>
                </div>
              </div>
            )}

            {/* Discount Badge */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              {currentVariant.price && currentVariant.mrp && (
                <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-semibold px-3 py-1 uppercase rounded-full shadow-md">
                  {Math.round(
                    (1 - currentVariant.price / currentVariant.mrp) * 100
                  )}
                  % OFF
                </span>
              )}
            </div>

            {/* Wishlist Button - Keep as is */}
            <button
              onClick={() => handleWishlistToggle()}
              className={`absolute z-10 top-4 right-4 p-3 rounded-full shadow-md transition-all border ${
                isWishlisted
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-400"
                  : "bg-white/90 hover:bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:text-red-500"
              }`}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart className={isWishlisted ? "fill-current" : ""} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`p-4 bg-gray-50 border-t border-gray-200 ${
            isMobile
              ? "sticky bottom-0 left-0 right-0 z-[100] mt-4 hidden sm:block lg:hidden"
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
                  className={`flex-1 font-medium sm:text-base text-sm py-3 md:py-4 px-4 md:px-6 rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isOutOfStock
                      ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                  }`}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? "🛒 Out of Stock" : "🛒 ADD TO CART"}
                </button>
              ) : (
                <div
                  className={`flex-1 font-medium py-2 px-4 md:px-6 rounded-lg shadow-sm transition-all duration-300 flex items-center justify-between gap-2 
 ${
                    isOutOfStock
                      ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <button
                    onClick={handleDecrementToCart}
                    className="bg-blue-700 px-3 py-1 rounded-md hover:bg-blue-800 transition-colors"
                    disabled={isOutOfStock}
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={handleAddToCart}
                    className="bg-blue-700 px-3 py-1 rounded-md hover:bg-blue-800 transition-colors"
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
              );
            })()}

            <button
              className={`flex-1 font-medium py-3 md:py-4 px-4 md:px-6 sm:text-base text-sm rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                currentVariant?.availablestock <= 0
                  ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md"
              }`}
              onClick={handleBuyNow}
              disabled={currentVariant?.availablestock <= 0}
            >
              ⚡ BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImages;