// HomeProduct.js
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryCard from "./CategoryCard";
import { useRouter } from "next/navigation";

const HomeProduct = ({ title, smallTitle, border }) => {
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);

  // Get all category data from Redux
  const { CategoryPromotionOne, CategoryPromotionTwo, CategoryPromotionThree } =
    useSelector((state) => state.categoryTag);

  // Determine which category data to use based on title
  const getCategoryData = () => {
    if (title === "one") {
      return CategoryPromotionOne[0] || [];
    } else if (title === "two") {
      return CategoryPromotionTwo[0] || [];
    } else if (title === "three") {
      return CategoryPromotionThree[0] || [];
    }
    return [];
  };

  const categoryData = getCategoryData();



  return (
    <section className="-mt-5 sm:py-5 w-full">
      <div className="mb-2 text-left px-4 pt-2 sm:pb-1 pd-3">
        <h2 className="text-left normal-case text-[1rem] sm:text-base md:text-2xl font-semibold">
          {categoryData?.SubCategory}
        </h2>
        {smallTitle && <p className="text-xs text-gray-500">{smallTitle}</p>}
      </div>
      <div
        className="overflow-x-auto pb-2 w-full scrollbar-hide"
        ref={scrollContainerRef}
      >
        <div
          className={`flex md:gap-0 px-1 ${border ? `rounded-${border}` : ""}`} >
          {categoryData?.selectedProductTypes?.map((cat, index) => (
            <CategoryCard
              key={`${cat._id}-${index}`}
              name={cat.name}
              image={cat.desktopImage || cat.mobileImage}
              offer={cat.offerTags || []}
              textAlign="center"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeProduct;
