import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Brands = ({ brandData }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let animationFrameId;

    const smoothScroll = () => {
      if (scrollContainer && !isPaused) {
        scrollContainer.scrollLeft += 0.5;
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    animationFrameId = requestAnimationFrame(smoothScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  // Create infinite brands array for seamless scrolling
  const infiniteBrands =
    brandData && brandData.length > 0 ? [...brandData, ...brandData] : [];

  const handleScroll = (direction) => {
    if (!scrollRef.current || isScrolling) return;

    setIsPaused(true);
    setIsScrolling(true);

    scrollRef.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });

    setTimeout(() => {
      setIsPaused(false);
      setIsScrolling(false);
    }, 800);
  };

  // Show loading state if no brand data
  if (!brandData || brandData.length === 0) {
    return (
      <div className="px-5 mt-8 mb-6">
        <h2 className="font-bold sm:text-2xl text-lg md:text-3xl text-gray-800 mb-4 relative inline-block after:absolute after:left-0 after:-bottom-2 after:h-1 after:w-10 after:bg-blue-500 after:rounded-full">
          Top Brands
        </h2>
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-gray-500 mb-2">No brands available</div>
          <p className="text-sm text-gray-400">Check back later for updates</p>
        </div>
      </div>
    );
  }

  const handleClick = (e, brand) => {
    e.preventDefault();
    if (brand) {
      router.push(
        `/search?brand%5B%5D=${encodeURIComponent(brand.name)}`
      );
    }
  };

  return (
    <div className="px-5 sm:mt-8 mt-4">
      <h2 className="font-bold text-lg md:text-3xl text-gray-800 mb-6 relative inline-block after:absolute after:left-0 after:-bottom-2 after:h-1 after:w-10 after:bg-blue-500 after:rounded-full">
        Top Brands
      </h2>

      <div className="relative group">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        {/* Left Button */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-blue-50 shadow-lg p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-xl"
          onClick={() => handleScroll("left")}
          aria-label="Scroll left"
        >
          <FaChevronLeft size={18} className="text-blue-600" />
        </button>

        {/* Scrollable Brand List */}
        <div
          ref={scrollRef}
          className="flex flex-row items-center overflow-x-auto w-full gap-6 scrollbar-hide scroll-smooth py-3"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-x-auto w-full scrollbar-hide">
            <div className="flex gap-3 px-2">
              {infiniteBrands.map((brand, index) => (
                <div
                  key={`${brand._id}-${index}`}
                  onClick={(e) => handleClick(e, brand)}
                  className="relative flex flex-col items-center justify-end rounded-xl p-5 transition-all duration-300 cursor-pointer flex-shrink-0 
                   w-1/3 sm:w-1/4 md:w-52 h-20 sm:h-40 group/item overflow-hidden"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/item:scale-110"
                    style={{
                      backgroundImage: brand.desktopImage
                        ? `url(${brand.desktopImage})`
                        : "none",
                      filter: "brightness(0.85)",
                    }}
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                    {/* Fallback if no image */}
                    {!brand.desktopImage && (
                      <div
                        className="h-full w-full flex items-center justify-center 
                            bg-gradient-to-br from-blue-100 to-indigo-200"
                      >
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700">
                          {brand.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="relative z-10 text-center text-white">
                    <h3 className="sm:text-lg text-sm font-bold truncate  drop-shadow-md">
                      {brand.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Button */}
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-blue-50 shadow-lg p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-xl"
          onClick={() => handleScroll("right")}
          aria-label="Scroll right"
        >
          <FaChevronRight size={18} className="text-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default Brands;
