// HomeProduct.js
import { useRef } from "react";
import { useSelector } from "react-redux";
import CategoryCard from "./CategoryCard";
import CategoryCardNew from "./CategoryCardNew";

const HomeProduct = ({ title, smallTitle, border }) => {
  const scrollContainerRef = useRef(null);

  // Get all category data from Redux
  const { CategoryPromotionOne, CategoryPromotionTwo, CategoryPromotionThree } =
    useSelector((state) => state.categoryTag);

  // Get the category data based on title
  const getCategoryData = () => {
    if (title === "one") return CategoryPromotionOne[0] || {};
    if (title === "two") return CategoryPromotionTwo[0] || {};
    if (title === "three") return CategoryPromotionThree[0] || {};
    return {};
  };

  const categoryData = getCategoryData();

  // Choose which card component to render
  const CardComponent = title === "three" ? CategoryCardNew : CategoryCard;

  return (
    <section className="-mt-5 sm:py-5 w-full">
      {/* Header */}
      <div className="mb-2 text-left sm:px-4 px-2 pt-2 sm:pb-1 pd-3">
        <h2 className="text-left normal-case text-blue-950 text-[0.8rem] sm:text-base md:text-xl font-semibold">
          {categoryData?.SubCategory}
        </h2>
        {smallTitle && (
          <p className="sm:text-sm text-[9px] -mt-1 italic text-cyan-500">
            {smallTitle}
          </p>
        )}
      </div>

      {/* Scrollable Cards */}
      <div
        className="overflow-x-auto pb-2 w-full scrollbar-hide"
        ref={scrollContainerRef}
      >
        <div
          className={`flex md:gap-0 px-1 ${
            border ? `rounded-${border}` : ""
          } w-full gap-3`}
        >
          {categoryData?.selectedProductTypes?.map((cat, index) => (
            <CardComponent
              key={`${cat._id}-${index}`}
              name={cat.name}
              image={cat.desktopImage || cat.mobileImage}
              offer={cat.offerTags || []}
              price={cat.price || ""}
              textAlign="center"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeProduct;
