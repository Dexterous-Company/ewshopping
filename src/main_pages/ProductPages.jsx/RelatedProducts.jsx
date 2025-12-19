"use client";
import { fetchRelatedProducts } from "@/redux/product/RelatedProductsSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewSingleProductCard from "./NewSingleProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RelatedProducts() {
  const dispatch = useDispatch();
  const productId = "6926ebc80adfa8f1b015ca16";
  const scrollContainerRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const scrollIntervalRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { relatedProducts, loading, error } = useSelector(
    (state) => state.relatedProducts
  );

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (productId) {
      dispatch(fetchRelatedProducts(productId));
    }
  }, [dispatch, productId]);

  // Auto-scroll function
  const startAutoScroll = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerWidth = container.scrollWidth;
    const visibleWidth = container.clientWidth;
    
    if (containerWidth <= visibleWidth) return;

    clearInterval(scrollIntervalRef.current);

    // Faster scroll on mobile, slower on desktop
    const scrollSpeed = isMobile ? 20 : 30;

    scrollIntervalRef.current = setInterval(() => {
      if (!container || isHovered) return;
      
      if (container.scrollLeft >= containerWidth - visibleWidth - 10) {
        // Reset to start
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: 1, behavior: "auto" });
      }
    }, scrollSpeed);
  };

  // Stop auto-scroll
  const stopAutoScroll = () => {
    clearInterval(scrollIntervalRef.current);
  };

  useEffect(() => {
    // Start auto-scroll automatically
    startAutoScroll();

    return () => {
      stopAutoScroll();
    };
  }, [relatedProducts, isHovered, isMobile]);

  // Check if scroll buttons are needed
  useEffect(() => {
    const checkScroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const hasHorizontalScroll = container.scrollWidth > container.clientWidth;
        // Only show buttons on desktop
        setShowScrollButtons(hasHorizontalScroll && !isMobile);
      }
    };

    if (relatedProducts && relatedProducts.length > 0) {
      setTimeout(checkScroll, 100);
    }

    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [relatedProducts, isMobile]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? -200 : -300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      stopAutoScroll();
      // Resume auto-scroll after 3 seconds
      setTimeout(() => {
        if (!isHovered) startAutoScroll();
      }, 3000);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 200 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      stopAutoScroll();
      // Resume auto-scroll after 3 seconds
      setTimeout(() => {
        if (!isHovered) startAutoScroll();
      }, 3000);
    }
  };

  // Handle hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => {
      if (!isHovered) startAutoScroll();
    }, 500);
  };

  // Show loading state - Mobile responsive
  if (loading) {
    return (
      <div className="mt-12 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
          Related Products
        </h2>
        <div className="flex gap-4 md:gap-5 overflow-hidden">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="w-[180px] md:w-[250px] h-[380px] md:h-[450px] bg-white rounded-xl border border-gray-200 p-2 flex-shrink-0"
            >
              <div className="w-full h-48 md:h-60 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="mt-3 h-3 md:h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="mt-2 h-3 md:h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
              <div className="mt-3 h-5 md:h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 px-4 md:px-0">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Related Products
        </h2>
      </div>

      <div className="relative group">
        {/* Scroll buttons - Only show on desktop */}
        {showScrollButtons && (
          <>
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-gray-300 rounded-full p-2.5 shadow-xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-2xl hidden md:block"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90  border border-gray-300 rounded-full p-2.5 shadow-xl transition-all opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-2xl hidden md:block"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </button>
          </>
        )}

        {/* Products container - Responsive card sizes */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4 md:mx-0 md:px-0"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={stopAutoScroll}
          onTouchEnd={() => {
            setTimeout(() => {
              if (!isHovered) startAutoScroll();
            }, 2000);
          }}
        >
          {relatedProducts.map((product) => (
            <div
              key={product._id}
              // Responsive widths: Smaller on mobile, larger on desktop
              className="w-[180px] sm:w-[200px] md:w-[220px] lg:w-[250px] flex-shrink-0"
            >
              <NewSingleProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Gradient fade effects on edges - Only on desktop */}
        <div className="absolute z-10 hidden md:block"></div>
        <div className="absolute  md:block"></div>

        {/* Scroll progress indicator - Only on desktop */}
        {showScrollButtons && (
          <div className="hidden md:flex justify-center mt-4">
            <div className="h-1 w-24 md:w-32 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (scrollContainerRef.current?.scrollLeft /
                      (scrollContainerRef.current?.scrollWidth -
                        scrollContainerRef.current?.clientWidth)) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Mobile scroll indicator dots */}
        {isMobile && relatedProducts.length > 0 && (
          <div className="flex justify-center mt-4 gap-2 md:hidden">
            {[...Array(Math.min(5, relatedProducts.length))].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}