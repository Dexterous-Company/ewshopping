"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

const ShowingCategories = ({ prodType }) => {
  const router = useRouter();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Check if prodType exists and has categoryTag array
  if (!prodType || !prodType.categoryTag) {
    return <div className="p-4">No categories available</div>;
  }

  const handleClick = (e, category) => {
    e.preventDefault();
    if (category) {
      router.push(
        `/search?categoryTag=${encodeURIComponent(category.name)}`
      );
    }
  };
  return (
    <>

      {
        prodType?.categoryTag?.length > 0 && (
          <div className="relative sm:py-8 py-2 px-4">
            {/* Buttons */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full"
            >
              <FaChevronRight />
            </button>

            {/* Scrollable list */}
            {
              prodType?.categoryTag?.length > 0 && (
                <div
                  ref={scrollRef}
                  className="flex overflow-x-auto gap-4 no-scrollbar scroll-smooth px-0"
                >
                  {prodType?.categoryTag.map((category) => (
                    <div
                      key={category._id}
                      onClick={(e) => handleClick(e, category)}
                      className="min-w-[150px] sm:min-w-[200px] bg-[#f3f3f3] rounded-lg overflow-hidden"
                    >
                      <div>
                        <Image
                          className="w-full h-[150px] md:h-[230px] object-fill"
                          src={category.mobileImage || "/assets/images/placeholder.jpg"}
                          alt={category.name}
                          title={category.name}
                          width={365}
                          height={200}
                        />
                      </div>
                      <div className="text-center mt-3">
                        <h4 className="text-lg font-bold mb-1">{category.name}</h4>
                        <p className="text-gray-600 text-sm pb-1">
                          {category.productCount || 0} Items
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }

          </div>
        )
      }
    </>

  );
};

export default ShowingCategories;
