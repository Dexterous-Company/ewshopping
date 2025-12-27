"use client";
import React, { useEffect, useRef, useState } from "react";
import ProductImages from "./ProductImages";
import ProductDetails from "./ProductDetails";
import { useDispatch, useSelector } from "react-redux";
import SkeletonLoader from "./SkeletonLoader";
import { fetchReviews } from "@/redux/reviews/reviewSlice";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const colorOptions = [
  {
    name: "Olive",
    src: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/b/h/b/m-artical-dn-2-texure-n-and-j-original-imahbzxgzeqhgtr6.jpeg?q=70&crop=false",
  },
  {
    name: "Blue",
    src: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/n/r/s/s-artical-dn-2-texure-n-and-j-original-imahdq43g4dzzzgw.jpeg?q=70",
  },
  {
    name: "Orange",
    src: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/i/a/b/s-artical-dn-2-texure-n-and-j-original-imahdq82uhndkdgg.jpeg?q=70",
  },
  {
    name: "Green",
    src: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/l/v/v/xxl-artical-dn-2-texure-n-and-j-original-imahbzxgwpmmnda3.jpeg?q=70",
  },
];

export default function wwProductLayout() {
  const { product, status, error, selectedVariant } = useSelector(
    (state) => state.info
  );

  const [mobileImageHigh, setMobileImageHigh] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const sliderRef = useRef(null);
  const productData = product?.[0] || {};
  const variants = productData?.simpleAttributes || [];
  const currentVariant = variants[selectedVariant] || {};

  const selectedVariantImages = currentVariant?.slider || [];
  const mainImage =
    selectedVariantImages[selectedImageIndex] ||
    currentVariant?.thumbnail ||
    productData?.thumbnail?.[0];
  const getValidImageSrc = (src) => {
    return src && src.trim() !== "" ? src : "https://via.placeholder.com/300";
  };

  const handleSlideChange = (index) => {
    setSelectedImageIndex(index);
  };

  const goToNextSlide = () => {
    if (selectedImageIndex < selectedVariantImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  if (status === "loading") {
    return <SkeletonLoader />;
  }
  
  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].name);
  const selectedColorData = colorOptions.find(
    (color) => color.name === selectedColor
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const dispatch = useDispatch();

  useEffect(() => {
    if (product?._id) {
      dispatch(fetchReviews(product?._id));
    }
  }, [dispatch, product?._id]);

  // 🔍 Zoom and drag states
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const lastTapRef = useRef(null);
  const imageContainerRef = useRef(null);

  const handleZoom = (e, target) => {
    let clientX, clientY, rect;
    rect = target.getBoundingClientRect();

    if ("clientX" in e) {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      // Touch event
      clientX = e.pageX;
      clientY = e.pageY;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    if (!isZoomed) {
      setZoomPosition({ x, y });
      setDragPosition({ x: 0, y: 0 }); // Reset drag position when zooming in
      setIsZoomed(true);
    } else {
      setIsZoomed(false);
      setDragPosition({ x: 0, y: 0 }); // Reset drag position when zooming out
    }
  };

  const handleDragStart = (e) => {
    if (!isZoomed) return;

    setIsDragging(true);
    if (e.type === "touchstart") {
      setDragStart({
        x: e.touches[0].clientX - dragPosition.x,
        y: e.touches[0].clientY - dragPosition.y,
      });
    } else {
      setDragStart({
        x: e.clientX - dragPosition.x,
        y: e.clientY - dragPosition.y,
      });
    }
  };

  const handleDrag = (e) => {
    if (!isDragging || !isZoomed) return;

    let clientX, clientY;

    if (e.type === "touchmove") {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;

    // Calculate boundaries to prevent dragging beyond image edges
    const container = imageContainerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const maxX = rect.width / 4; // Since we're zoomed 2x, max drag is half the container
      const maxY = rect.height / 4;

      // Apply boundaries
      const boundedX = Math.min(Math.max(newX, -maxX), maxX);
      const boundedY = Math.min(Math.max(newY, -maxY), maxY);

      setDragPosition({ x: boundedX, y: boundedY });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Magnifier state
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [selectedImage, setselectedImage] = useState("");

  // Add event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDrag);
      document.addEventListener("touchend", handleDragEnd);

      return () => {
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", handleDragEnd);
        document.removeEventListener("touchmove", handleDrag);
        document.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [isDragging]);

  const [scroll, setScroll] = useState(null);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Touch swipe for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    if (!mobileImageHigh) return;
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!mobileImageHigh) return;
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!mobileImageHigh) return;
    const threshold = 50;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left
        goToNextSlide();
      } else {
        // Swipe right
        goToPrevSlide();
      }
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <>
      <div className="container mx-auto md:px-4 sm:px-2 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-3">
          {/* Images section - Sticky */}
          <div
            id="product-images"
            className={`w-full lg:w-1/2 xl:w-5/12 lg:sticky ${
              scroll ? "lg:top-19" : "lg:top-0"
            } self-start`}
          >
            <ProductImages
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              colors={colorOptions}
              product={product}
              mobileImageHigh={mobileImageHigh}
              setMobileImageHigh={setMobileImageHigh}
              showMagnifier={showMagnifier}
              setShowMagnifier={setShowMagnifier}
              imageRef={imageRef}
              setCursorPosition={setCursorPosition}
              setMagnifierPosition={setMagnifierPosition}
              cursorPosition={cursorPosition}
              setselectedImage={setselectedImage}
            />
          </div>

          {/* Details section - Scrolls normally */}
          <div className="w-full lg:w-1/2 xl:w-7/12">
            <ProductDetails
              colors={colorOptions}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>
        </div>
      </div>

      {mobileImageHigh && (
        <div
          className="fixed inset-0 z-[999999] bg-white transition-opacity duration-300 ease-in-out opacity-100"
          style={{ animation: "fadeIn 0.3s" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Cross button */}
          <button
            className="absolute top-10 z-10 right-10 text-4xl font-bold text-gray-700 hover:text-red-500 transition-colors duration-200"
            onClick={() => {
              setMobileImageHigh(false);
              setIsZoomed(false);
              setDragPosition({ x: 0, y: 0 });
            }}
          >
            ✕
          </button>

          {/* Previous Button */}
          {selectedImageIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              onClick={goToPrevSlide}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next Button */}
          {selectedImageIndex < selectedVariantImages.length - 1 && (
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
              onClick={goToNextSlide}
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Image Container */}
          <div
            ref={imageContainerRef}
            className="relative h-full w-full overflow-hidden"
          >
            <div
              className="h-full w-full transition-transform duration-300 ease-in-out"
              style={{
                transformOrigin: isZoomed
                  ? `${zoomPosition.x}% ${zoomPosition.y}%`
                  : "center",
                transform: isZoomed
                  ? `scale(2) translate(${dragPosition.x}px, ${dragPosition.y}px)`
                  : "scale(1)",
                cursor: isZoomed
                  ? isDragging
                    ? "grabbing"
                    : "grab"
                  : "zoom-in",
              }}
              onClick={(e) => {
                if (e.detail === 2) {
                  handleZoom(e, e.currentTarget);
                }
              }}
              onTouchEnd={(e) => {
                const now = Date.now();
                if (lastTapRef.current && now - lastTapRef.current < 300) {
                  handleZoom(e.changedTouches[0], e.currentTarget);
                }
                lastTapRef.current = now;
              }}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <Image
                src={getValidImageSrc(selectedVariantImages[selectedImageIndex] || productData?.thumbnail?.[0])}
                alt={`Product image ${selectedImageIndex + 1}`}
                fill
                className="object-contain select-none transition-transform duration-300 ease-in-out"
                priority={selectedImageIndex === 0}
                draggable={false}
              />
            </div>
          </div>

          {/* Pagination Dots */}
          {selectedVariantImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
              {selectedVariantImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === selectedImageIndex
                      ? "bg-black w-6"
                      : "bg-gray-400"
                  }`}
                  onClick={() => handleSlideChange(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Magnifier Preview */}
      {showMagnifier && selectedImage && (
        <div
          className={`
            fixed
            top-1/2
            right-0
            translate-x-1/2
            md:top-1/4
            md:right-1/3
            flex
            justify-center
            overflow-hidden
            z-[999]
            w-[150px] h-[150px]    
            sm:w-[250px] sm:h-[250px]
            md:w-[200px] md:h-[200px]
            lg:w-[350px] lg:h-[250px]
          `}
          style={{
            backgroundImage: `url(${getValidImageSrc(selectedImage)})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "200%",
            backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
            transform: "scale(1.5)",
            opacity: cursorPosition.x === 0 && cursorPosition.y === 0 ? 0 : 1,
            transition: "opacity 0.2s ease",
          }}
        />
      )}
    </>
  );
}