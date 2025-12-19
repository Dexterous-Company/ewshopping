"use client";

import Image from "next/image";
import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSubCategory,
  resetSubCategories,
  getCategoryTags,
} from "@/redux/header/HeaderSubSlice";
import { useRouter } from "next/navigation";

const CategoryCarousel = () => {
  const scrollContainerRef = useRef(null);
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isHoveringModal, setIsHoveringModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const categoryItemRefs = useRef({});
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const {
    subCategories = [],
    categoryTags = [],
    status,
    categoryTagsStatus,
    error,
    categoryTagsError,
  } = useSelector((state) => state.subCat);

  // Check scroll position and update button states
  const updateScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // Scroll handler for desktop
  const handleWheelScroll = useCallback(
    (e) => {
      if (!isMobile && scrollContainerRef.current) {
        // Prevent vertical scrolling, only allow horizontal
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
          e.preventDefault();
          scrollContainerRef.current.scrollLeft += e.deltaY * 2; // Scroll more for trackpad
        }
        updateScrollButtons();
      }
    },
    [isMobile, updateScrollButtons]
  );

  // Scroll to left
  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
      setTimeout(updateScrollButtons, 300);
    }
  }, [updateScrollButtons]);

  // Scroll to right
  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
      setTimeout(updateScrollButtons, 300);
    }
  }, [updateScrollButtons]);

  useEffect(() => {
    dispatch(resetSubCategories());
    dispatch(getSubCategory());
    setIsMounted(true);

    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowScrollButtons(!mobile); // Show scroll buttons only on desktop
    };

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Add scroll listener to update button states
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateScrollButtons);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", updateScrollButtons);
      }
    };
  }, [dispatch, updateScrollButtons]);

  // Add wheel event listener for desktop scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && !isMobile) {
      container.addEventListener("wheel", handleWheelScroll, {
        passive: false,
      });

      // Initialize scroll button states
      updateScrollButtons();

      return () => {
        container.removeEventListener("wheel", handleWheelScroll);
      };
    }
  }, [isMobile, handleWheelScroll, updateScrollButtons]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setHoveredCategory(null);
        setIsHoveringModal(false);
      }
    };

    if (hoveredCategory && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hoveredCategory, isMobile]);

  const router = useRouter();

  // Handle mouse enter with delay and position calculation - DESKTOP ONLY
  const handleMouseEnter = async (category) => {
    // Skip hover effects on mobile
    if (isMobile) return;

    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    const timeout = setTimeout(async () => {
      if (category) {
        // Calculate position for the dropdown
        const categoryElement = categoryItemRefs.current[category._id];
        if (categoryElement) {
          const rect = categoryElement.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + window.scrollY + 10, // 10px gap below the category item
            left: rect.left + window.scrollX,
          });
        }

        setHoveredCategory(category);
        // Fetch category tags for the hovered subcategory
        try {
          await dispatch(getCategoryTags(category.slugUrl)).unwrap();
        } catch (error) {
          console.error("Failed to fetch category tags:", error);
        }
      }
    }, 300); // 300ms delay before showing modal

    setHoverTimeout(timeout);
  };

  // Handle mouse leave from category item with delay - DESKTOP ONLY
  const handleMouseLeave = () => {
    if (isMobile) return;

    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    const timeout = setTimeout(() => {
      // Only close if not hovering over modal
      if (!isHoveringModal) {
        setHoveredCategory(null);
      }
    }, 300);

    setHoverTimeout(timeout);
  };

  // Handle mouse enter for modal - DESKTOP ONLY
  const handleModalMouseEnter = () => {
    if (isMobile) return;

    setIsHoveringModal(true);
    // Clear any timeout that would close the modal
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
  };

  // Handle mouse leave from modal - DESKTOP ONLY
  const handleModalMouseLeave = () => {
    if (isMobile) return;

    setIsHoveringModal(false);

    const timeout = setTimeout(() => {
      setHoveredCategory(null);
      setIsHoveringModal(false);
    }, 300);

    setHoverTimeout(timeout);
  };

  const handleCategoryTagClick = (categoryTag) => {
    if (hoveredCategory) {
      router.push(
        `/${hoveredCategory.categoryUrl}/${encodeURIComponent(
          hoveredCategory.slugUrl
        )}?tag=${categoryTag.slugUrl}`
      );
      setHoveredCategory(null);
      setIsHoveringModal(false);
    }
  };

  const handleCloseCategoryTags = () => {
    setHoveredCategory(null);
    setIsHoveringModal(false);
  };

  const handleNavigateWithoutTag = () => {
    if (hoveredCategory) {
      router.push(
        `/${hoveredCategory.categoryUrl}/${encodeURIComponent(
          hoveredCategory.slugUrl
        )}`
      );
      setHoveredCategory(null);
      setIsHoveringModal(false);
    }
  };

  const handleCategoryClick = (category) => {
    // On mobile, directly navigate without showing dropdown
    if (isMobile) {
      router.push(
        `/${category.categoryUrl}/${encodeURIComponent(category.slugUrl)}`
      );
    } else {
      // On desktop, only navigate when clicked (hover will show dropdown)
      router.push(
        `/${category.categoryUrl}/${encodeURIComponent(category.slugUrl)}`
      );
      setHoveredCategory(null);
      setIsHoveringModal(false);
    }
  };

  // Set ref for each category item
  const setCategoryItemRef = (element, categoryId) => {
    if (element) {
      categoryItemRefs.current[categoryId] = element;
    }
  };

  // Modern floating elements background with deterministic values for hydration
  const modernElements = useMemo(() => {
    // Use deterministic values for all properties
    const elements = [];
    const colors = [
      "from-emerald-100 to-teal-200",
      "from-violet-100 to-purple-200",
      "from-amber-100 to-orange-200",
      "from-rose-100 to-pink-200",
      "from-cyan-100 to-blue-200",
    ];

    const shapes = ["square", "circle", "square", "circle", "square", "circle"];
    const blurs = ["blur-md", "blur-sm", "blur-md"];

    for (let i = 0; i < 16; i++) {
      elements.push({
        id: i,
        size: 20 + (i % 5) * 10, // Deterministic sizes: 20, 30, 40, 50, 60
        left: (i * 6.25) % 100, // Spread evenly across 100%
        animationDelay: (i % 5) * 1.2, // Deterministic delays: 0, 1.2, 2.4, 3.6, 4.8
        animationDuration: 10 + (i % 6) * 2, // 10-20 seconds
        shape: shapes[i % shapes.length],
        color: colors[i % colors.length],
        opacity: 0.08 + (i % 5) * 0.02, // 0.08-0.16
        blur: blurs[i % blurs.length],
      });
    }
    return elements;
  }, []);

  // Loading skeletons with deterministic values for hydration
  const loadingSkeletons = useMemo(() => {
    // Use deterministic widths instead of random ones
    const line1Widths = [65, 72, 58, 68, 74, 62, 70, 66, 64, 69, 61, 67];
    const line2Widths = [50, 55, 45, 44, 46, 50, 59, 56, 48, 44, 41, 56];

    return Array(12)
      .fill(0)
      .map((_, i) => (
        <div
          key={`loading-${i}`}
          className="flex-shrink-0 flex flex-col items-center justify-center text-center relative z-10 min-w-[80px] sm:min-w-[100px] animate-pulse"
          style={{ width: 100, height: 160 }}
        >
          {/* Image circle - Flipkart style gray circle */}
          <div
            className="rounded-full bg-gray-200 mx-auto relative overflow-hidden"
            style={{ width: 90, height: 90 }}
          >
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
          </div>

          {/* Text lines - Flipkart uses two lines for skeleton */}
          <div className="mt-3 w-full px-2 space-y-2">
            {/* First line (longer) */}
            <div
              className="bg-gray-200 rounded-full mx-auto"
              style={{
                width: `${line1Widths[i % line1Widths.length]}%`,
                height: 12,
              }}
            />
            {/* Second line (shorter) - for price/tag */}
            <div
              className="bg-gray-200 rounded-full mx-auto"
              style={{
                width: `${line2Widths[i % line2Widths.length]}%`,
                height: 10,
              }}
            />
          </div>

          {/* Maintain layout spacing */}
          <div className="absolute -bottom-1 w-6 h-1" />
        </div>
      ));
  }, []);

  // // Category Tags Loading Skeleton
  // const categoryTagsLoading = useMemo(
  //   () =>
  //     Array(6)
  //       .fill(0)
  //       .map((_, i) => (
  //         <div
  //           key={`tag-loading-${i}`}
  //           className="px-4 py-3 bg-slate-100 rounded-lg animate-pulse shadow-sm"
  //         >
  //           <div className="h-4 bg-slate-300 rounded w-20"></div>
  //         </div>
  //       )),
  //   []
  // );

  if (status === "failed") {
    return (
      <div className="my-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 overflow-hidden">
          {modernElements.slice(0, 4).map((element) => (
            <div
              key={`error-${element.id}`}
              className={`absolute bg-gradient-to-br from-rose-100 to-rose-200 animate-float-slow ${
                element.shape === "square" ? "rounded-xl" : "rounded-full"
              } ${element.blur}`}
              style={{
                width: element.size,
                height: element.size,
                left: `${element.left}%`,
                top: `${(element.id * 12) % 100}%`,
                opacity: element.opacity,
                animationDelay: `${element.animationDelay}s`,
                animationDuration: `${element.animationDuration}s`,
              }}
            />
          ))}
        </div>
        <div className="relative z-10">
          <p className="text-rose-700 font-medium text-sm">
            Failed to load categories: {error || "Unknown error"}
          </p>
          <button
            onClick={() => dispatch(getSubCategory())}
            className="mt-3 px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="my-1 relative overflow-hidden">
        <div
          className="flex overflow-x-auto px-4 no-scrollbar scroll-smooth relative z-10"
          style={{ scrollbarWidth: "none" }}
        >
          {loadingSkeletons}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full relative overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-100 shadow-inner">
        {/* Modern Animated Background with light yellow tones */}
        <div className="absolute inset-0 overflow-hidden">
          {modernElements.map((element) => (
            <div
              key={element.id}
              className={`absolute bg-gradient-to-br animate-float-slow ${
                element.color
              } ${element.shape === "square" ? "rounded-xl" : "rounded-full"} ${
                element.blur
              }`}
              style={{
                width: element.size,
                height: element.size,
                left: `${element.left}%`,
                top: `${(element.id * 6.25) % 100}%`,
                opacity: element.opacity,
                animationDelay: `${element.animationDelay}s`,
                animationDuration: `${element.animationDuration}s`,
              }}
            />
          ))}
        </div>

        {/* Carousel */}
        <div className="relative z-10">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto no-scrollbar px-2 scroll-smooth py-3 gap-3"
            style={{
              scrollbarWidth: "none",
              cursor: isMobile ? "grab" : "default",
            }}
          >
            {status === "loading"
              ? loadingSkeletons
              : subCategories.map((category) => (
                  <div
                    key={category._id}
                    ref={(el) => setCategoryItemRef(el, category._id)}
                    className="flex flex-col items-center justify-center text-center cursor-pointer group min-w-[80px] sm:min-w-[100px] relative"
                    onMouseEnter={() => !isMobile && handleMouseEnter(category)}
                    onMouseLeave={() => !isMobile && handleMouseLeave()}
                    onClick={() => handleCategoryClick(category)}
                    // Add touch events for better mobile experience
                    onTouchStart={() => isMobile && setHoveredCategory(null)}
                  >
                    <div
                      className="relative rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 ease-out"
                      style={{
                        width: 85,
                        height: 85,
                      }}
                    >
                      <Image
                        src={
                          category.desktopImage ||
                          category.mobileImage ||
                          "/default-category-image.jpg"
                        }
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                        sizes="70px"
                        
                        quality={85}
                        priority
                        fetchPriority="high"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-400/30 to-cyan-400/30 blur-md" />
                    </div>

                    <p
                      className="mt-3 text-[11px] sm:text-[13px] md:text-[14px] font-bold text-slate-800 group-hover:text-purple-700 whitespace-nowrap transition-all duration-300 px-2 rounded-lg group-hover:shadow-sm"
                      style={{ height: 20 }} // FIX CLS
                    >
                      {category.name.length > 10
                        ? category.name.slice(0, 13)
                        : category.name}
                    </p>

                    {/* Animated underline */}
                    <div className="absolute -bottom-1 w-6 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110" />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(CategoryCarousel);
