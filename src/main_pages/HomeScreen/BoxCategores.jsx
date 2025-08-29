import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { getSubCategoryPromotions } from "@/redux/header/SubCategoryPromotionSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BoxCategories = () => {
  const dispatch = useDispatch();
  const router = useRouter()
  const { subCategoryPromotions, status, error } = useSelector(
    (store) => store.subCategoryPromotion
  );

  useEffect(() => {
    dispatch(getSubCategoryPromotions());
  }, [dispatch]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (status === "loading") {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!subCategoryPromotions || subCategoryPromotions.length === 0) {
    return <div className="text-center py-8">No promotions available</div>;
  }

  const handleClickCategory = (e, category) => {
    e.preventDefault();
    if (category) {
      router.push(`/searchresults?category=${category?.category}`)
    }
  }

  const handleClick = (e, subCategory) => {
    e.preventDefault();
    if (subCategory) {
      router.push(`/searchresults?subCategory=${encodeURIComponent(subCategory.name)}`)
    }
  };

  return (
    <div className="sm:m-4 mx-3 mt-2">
      <div className="flex flex-wrap -mx-2">
        {subCategoryPromotions.map((category) => (
          <div key={category._id} className="w-full md:w-1/3 px-2 mb-4">
            {/*  border-1 border-gray-300  */}
            <div className="sm:bg-white rounded-lg shadow-md sm:shadow-md flex flex-col h-full">
              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-edu font-bold text-[1rem] sm:text-xl cursor-pointer hover:text-primary transition-colors">
                    {category.category}
                  </h5>
                </div>
                <div className="flex-grow">
                  <div className="grid sm:grid-cols-2 grid-cols-3 gap-2">
                    {(category.selectedSubCategories || [])
                      .slice(0, isMobile ? 6 : 4)
                      .map((subCategory) => (
                        <div
                          key={subCategory._id}
                          onClick={(e) => handleClick(e, subCategory)}
                          className="text-center h-full rounded-md cursor-pointer shadow-sm bg-white hover:bg-white transition-all duration-200"
                        >
                          <div className="relative aspect-square mb-2">
                            <Image
                              src={
                                isMobile
                                  ? subCategory.mobileImage
                                  : subCategory.desktopImage
                              }
                              alt={`${subCategory.name} category`}
                              fill
                              className="object-contain rounded-xs"
                              sizes="(max-width: 768px) 50vw, 25vw"
                              loading="lazy"
                              quality={80}
                              decoding="async"
                            />
                          </div>
                          <p className="sm:text-sm text-xs font-normal truncate px-1 mb-2">
                            {subCategory.name}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="mt-2">
                  <button
                    // href="#"
                    onClick={(e) => handleClickCategory(e, category)}
                    className="text-white bg-[#e96f84] px-2 py-1 rounded-xs hover:bg-[#2f415d] text-xs transition-colors"
                    aria-label={`View all ${category.category} offers`}
                  >
                    {category.button_text || "See all offers"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(BoxCategories);
