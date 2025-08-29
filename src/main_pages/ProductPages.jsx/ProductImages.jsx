"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaExpand, FaHeart } from "react-icons/fa";
import { FiZoomIn } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { addToCart, decrementCart } from "@/redux/cart/CartSlice";
import { addToWishlistLocal, addToWishlistServer, fetchUserWishlist, removeFromWishlistLocal, removeFromWishlistServer } from "@/redux/wishlist/wishlistSlice";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const ProductImagesSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Image Gallery Skeleton */}
        <div className="flex flex-col lg:flex-row gap-1 relative">
          {/* Thumbnail Navigation Skeleton - Desktop Only */}
          <div className="relative lg:w-24 hidden lg:block">
            <div className="absolute top-0 left-0 right-0 bg-gray-200 z-10 p-1 flex justify-center rounded-t-md h-6"></div>

            <div className="hidden lg:flex flex-col gap-2 overflow-y-auto h-[400px] lg:h-[500px] py-6 px-1">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="min-w-[80px] h-[80px] bg-gray-200 rounded-lg flex-shrink-0"
                ></div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gray-200 z-10 p-1 flex justify-center rounded-b-md h-6"></div>
          </div>

          {/* Main Image Skeleton */}
          <div className="relative flex-1">
            <div className="relative aspect-square w-full bg-gray-200 rounded-lg"></div>

            {/* Product Badges Skeleton */}
            <div className="hidden absolute top-4 left-4 md:flex gap-2 z-10">
              <div className="bg-gray-300 h-6 w-20 rounded-full"></div>
              <div className="bg-gray-300 h-6 w-16 rounded-full hidden sm:block"></div>
            </div>

            {/* Wishlist Button Skeleton */}
            <div className="absolute top-4 right-4 p-3 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="sm:p-4 absolute bg-gray-50 border-t border-gray-200">
          <div className="flex flex-row gap-3">
            {/* Add to Cart Skeleton */}
            <div className="flex-1 h-12 rounded-lg bg-gray-200 flex items-center justify-center gap-2">
              <div className="h-5 w-5 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
            {/* Buy Now Skeleton */}
            <div className="flex-1 h-12 rounded-lg bg-gray-200 flex items-center justify-center gap-2">
              <div className="h-5 w-5 bg-gray-300 rounded"></div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductImages = ({
  selectedColor,
  setSelectedColor,
  colors,
  product,
}) => {
  const dispatch = useDispatch();
  const { loginData, otp, mob, isAuth } = useSelector(
    (store) => store.Athentication
  );
  const { selectedVariant, status, } = useSelector((state) => state.info);

  const { CartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [isMobile, setIsMobile] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);
  const swiperRef = useRef(null);
  // ProductImagesSkeleton

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const getValidImageSrc = (src) => {
    return src && src.trim() !== "" ? src : "https://via.placeholder.com/300";
  };

  const productData = product?.[0] || {};
  const variants = productData?.simpleAttributes || [];
  const currentVariant = variants[selectedVariant] || {};

  const selectedVariantImages = currentVariant?.slider || [];
  const mainImage =
    selectedVariantImages[selectedImageIndex] ||
    currentVariant?.thumbnail ||
    productData?.thumbnail?.[0];

  const scrollThumbnails = (direction) => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = direction === "up" ? -100 : 100;
      thumbnailContainerRef.current.scrollBy({
        top: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const [isWishlisted, setIsWishlisted] = useState(false)
  useEffect(() => {
    if (currentVariant?._id && productData?._id) {
      const isInWishlist = wishlistItems.some(
        item => item.ProductId === productData._id && item.AttributeId === currentVariant._id)
      setIsWishlisted(isInWishlist);
    }
  }, [wishlistItems, currentVariant, productData]);

  const router = useRouter()
  const handleWishlistToggle = async () => {
    if (!loginData?._id) {
      return router.push('/login');
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
        await dispatch(removeFromWishlistServer({
          userId: loginData._id,
          ProductId: productData._id,
          AttributeId: currentVariant._id
        })).unwrap();
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

  const handleAddToCart = () => {
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
    dispatch(addToCart(cartItem));
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
  };
  // if (status === "loading" || selectedVariant==="" || selectedVariant === undefined || selectedVariant == null) {
  //   return <ProductImagesSkeleton />;
  // }
  if (status === "loading" || !currentVariant || !productData || !product || product.length === 0) {
    return <ProductImagesSkeleton />;
  }
  return (
    <div className="w-full ">
      {/* Main Product Display */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden ">
        {/* Image Gallery */}
        <div className="flex flex-col lg:flex-row gap-1 relative ">
          {/* Thumbnail Navigation - Desktop Only */}
          {!isMobile && (
            <div className="relative lg:w-24">
              {/* <button
                onClick={() => scrollThumbnails("up")}
                className="absolute top-0 left-0 right-0 bg-white/80 text-gray-600 z-10 p-1 flex justify-center rounded-t-md hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button> */}

              <div
                ref={thumbnailContainerRef}
                className="hidden lg:flex flex-col gap-2 overflow-y-auto scroll-smooth snap-y snap-mandatory h-[400px] lg:h-[500px] py-6 px-1 no-scrollbar"
              >
                {selectedVariantImages.map((src, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`min-w-[80px] h-[80px] border-2 rounded-lg overflow-hidden transition-all duration-200 flex-shrink-0 snap-start ${selectedImageIndex === index
                      ? "border-rose-500 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <Image
                      src={getValidImageSrc(src || productData?.thumbnail?.[0])}
                      alt={`Thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {/* 
              <button
                onClick={() => scrollThumbnails("down")}
                className="absolute bottom-0 left-0 right-0 bg-white/80 text-gray-600 z-10 p-1 flex justify-center rounded-b-md hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button> */}
            </div>
          )}

          {/* Main Image */}
          <div className="relative flex-1 group">
            {isMobile ? (
              <div className="relative h-100 w-full bg-gray-100">
                <Swiper
                  ref={swiperRef}
                  initialSlide={selectedImageIndex}
                  onSlideChange={handleSlideChange}
                  pagination={{
                    dynamicBullets: true,
                  }}
                  modules={[Pagination]}
                  className="h-full w-full"
                >
                  {selectedVariantImages.map((src, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative h-full w-full ">
                        <Image
                          src={getValidImageSrc(src || productData?.thumbnail?.[0])}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-contain"
                          priority={index === 0}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
                <Image
                  src={getValidImageSrc(mainImage || productData?.thumbnail?.[0])}
                  alt="Main product image"
                  fill
                  className="object-cover sm:object-contain transition-opacity duration-300"
                  priority
                />
                <button className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                  <FiZoomIn className="text-gray-700 text-xl" />
                </button>
              </div>
            )}

            {/* Product Badges */}
            <div className="hidden absolute top-4 left-4 md:flex gap-2 z-10">
              <span className="bg-cyan-500 text-white text-xs font-semibold px-3 py-1 uppercase rounded-full shadow-md animate-pulse">
                New Arrival
              </span>
              <span className="hidden sm:block bg-rose-600 text-white text-xs font-semibold px-3 py-1 uppercase rounded-full shadow-md">
                {Math.round(
                  (1 - currentVariant.price / currentVariant.mrp) * 100
                )}
                % OFF
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => handleWishlistToggle()}
              className={`absolute z-10 top-4 right-4 p-3 rounded-full shadow-md transition-all ${isWishlisted
                ? "bg-rose-500 text-white"
                : "bg-white/90 hover:bg-white text-gray-700"
                }`}
            >
              <FaHeart className={isWishlisted ? "fill-current" : ""} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sm:p-3  bg-gray-50 border-t border-gray-200">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    ADD TO CART
                  </button>
                );
              } else {
                return (
                  <div className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 my-3 sm:my-0 sm:py-4 sm:px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleDecrementToCart()}
                      className="bg-rose-600 px-3 py-1 rounded-lg" >
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

            <button className="flex-1  bg-[#2f415d] my-3 sm:my-0  hover:bg-[#2f415d] text-white font-medium py-4 px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              onClick={() => {
                handleAddToCart()
                router.push('/cart')
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImages;