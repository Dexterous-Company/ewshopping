"use client";
import { IoIosArrowRoundBack } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { IoSearchSharp, IoCart } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  getFillteredCategory,
  getAllCategoryTagsAllCategories,
} from "@/redux/category/categorySlice";
import { getFillteredSubCategory } from "@/redux/subcategory/SubCategorySlice";

// ✅ Detect ALL mobile devices (any size)
const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
    navigator.userAgent
  );
};

const Leftcategory = ({ select, setSelect, categories, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="cursor-pointer relative flex flex-col items-center justify-between py-3"
          >
            <div className="h-12 w-12 sm:h-15 sm:w-15 rounded-full mb-1 bg-gray-200 animate-pulse"></div>
            <div className="h-3 w-12 sm:h-4 sm:w-16 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {categories?.map((category, i) => (
        <div
          key={category._id}
          onClick={() => setSelect(category._id)}
          className={`cursor-pointer relative py-3 flex flex-col items-center border-l-4 border-transparent justify-between transition-all duration-200 ${
            select === category._id
              ? "bg-blue-50 border-l-blue-500"
              : "hover:bg-gray-50"
          }`}
        >
          <div className="h-12 w-12 sm:h-15 sm:w-15 rounded-full mb-1 overflow-hidden">
            <img
              src={category.mobileImage || category.desktopImage || "/placeholder-category.png"}
              alt={category.name}
              className="h-full w-full object-cover rounded-full border border-gray-200"
              onError={(e) => {
                e.target.src = "/placeholder-category.png";
              }}
            />
          </div>
          <span
            className={`text-xs px-1 text-center leading-tight ${
              select === category._id
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
          >
            {category?.name?.length > 12
              ? `${category?.name?.slice(0, 12)}...`
              : category?.name || "Category"}
          </span>
        </div>
      ))}
    </div>
  );
};

const RightCategory = ({ subcategories, selectedCategory, isLoading }) => {
  const router = useRouter();

  const handleClick = (e, subcat) => {
    e.preventDefault();
    if (subcat?.slugUrl) {
      router.push(`/search?subCategory=${subcat.slugUrl}`);
    } else if (subcat?.name) {
      // Use encodeURIComponent to handle special characters
      router.push(`/search?subCategory=${encodeURIComponent(subcat.name)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-3 sm:p-4">
        <div className="h-5 w-40 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="h-3 w-12 sm:h-4 sm:w-14 bg-gray-200 animate-pulse rounded mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="text-gray-500 text-sm sm:text-base">
          No subcategories found for this category
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4">
      <div className="mb-2">
        <span className="font-semibold text-lg sm:text-xl text-gray-800 block">
          {selectedCategory?.name || "Subcategories"}
        </span>
        {selectedCategory?.description && (
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            {selectedCategory.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {subcategories.map((subcat, j) => {
          // Check if subcat has required data
          if (!subcat?.name) return null;

          return (
            <div
              key={`${subcat._id || j}-${j}`}
              className="flex flex-col items-center cursor-pointer group"
              onClick={(e) => handleClick(e, subcat)}
            >
              <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 rounded-full overflow-hidden border border-gray-200 group-hover:border-blue-300 transition-colors duration-200 bg-white p-1">
                <img
                  src={
                    subcat.mobileImage ||
                    subcat.desktopImage ||
                    "/placeholder-subcategory.png"
                  }
                  className="h-full w-full object-cover rounded-full"
                  alt={subcat.name}
                  onError={(e) => {
                    e.target.src = "/placeholder-subcategory.png";
                  }}
                />
              </div>
              <span className="text-xs text-center py-2 text-gray-700 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                {subcat.name.length > 12
                  ? `${subcat.name.slice(0, 12)}...`
                  : subcat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CategoryPage = () => {
  const dispatch = useDispatch();

  const { fillteredCategory, status: categoryStatus } = useSelector(
    (store) => store.category
  );

  const { fillteredSubCategory, status: subcategoryStatus } = useSelector(
    (store) => store.subcategory
  );

  const { CartItems } = useSelector((store) => store.cart);

  const [select, setSelect] = useState("");
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [filteredCategoriesWithSubCategory, setFilteredCategoriesWithSubCategory] = useState([]);
  const [filteredSubcategoriesNew, setFilteredSubcategoriesNew] = useState([]);

  // ✅ MOBILE ONLY → Fetch categories and subcategories
  useEffect(() => {
    if (isMobileDevice()) {
      dispatch(getFillteredCategory());
      dispatch(getFillteredSubCategory());
    }
  }, [dispatch]);

  // ✅ Filter categories to only show those with subcategories
  useEffect(() => {
    if (fillteredCategory?.length > 0 && fillteredSubCategory?.length > 0) {
      // Get unique category IDs from subcategories
      const categoryIdsFromSubcats = new Set();
      
      fillteredSubCategory?.forEach((subCat) => {
        if (subCat?.categoryId) {
          categoryIdsFromSubcats.add(subCat.categoryId.toString());
        }
      });

      // Filter categories that have subcategories
      const filteredCats = fillteredCategory.filter((cat) =>
        categoryIdsFromSubcats.has(cat._id.toString())
      );

      setFilteredCategoriesWithSubCategory(filteredCats);

      // Auto-select first category if none selected and we have categories
      if (filteredCats.length > 0 && !select) {
        setSelect(filteredCats[0]._id);
      }
    }
  }, [fillteredCategory, fillteredSubCategory, select]);

  // ✅ Filter subcategories based on selected category
  useEffect(() => {
    if (select && fillteredSubCategory?.length > 0) {
      // Find the category URL from the selected category
      const selectedCat = filteredCategoriesWithSubCategory.find(cat => cat._id === select);
      
      if (selectedCat?.categoryUrl) {
        // Filter subcategories that belong to this category via categoryUrl
        const filtered = fillteredSubCategory.filter(subcat => 
          subcat.categoryUrl === selectedCat.categoryUrl
        );
        setFilteredSubcategoriesNew(filtered);
      } else {
        // Fallback: filter by categoryId
        const filtered = fillteredSubCategory.filter(subcat => 
          subcat.categoryId === select
        );
        setFilteredSubcategoriesNew(filtered);
      }
    } else {
      setFilteredSubcategoriesNew([]);
    }
  }, [select, fillteredSubCategory, filteredCategoriesWithSubCategory]);

  // ✅ MOBILE ONLY → Fetch tags of each category
  useEffect(() => {
    if (isMobileDevice() && filteredCategoriesWithSubCategory?.length > 0) {
      filteredCategoriesWithSubCategory.forEach((cat) => {
        if (cat.categoryUrl) {
          dispatch(getAllCategoryTagsAllCategories(cat.categoryUrl));
        }
      });
    }
  }, [filteredCategoriesWithSubCategory, dispatch]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const selectedCategory = filteredCategoriesWithSubCategory?.find(
    (cat) => cat._id === select
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="h-14 flex justify-between items-center fixed top-0 z-10 w-full bg-white shadow-sm px-4 border-b border-gray-200">
        <div className="flex items-center flex-row gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center"
          >
            <IoIosArrowRoundBack size={24} className="text-gray-700" />
          </button>
          <span className="font-medium text-gray-800 text-lg">Categories</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/searchmobile")}>
            <IoSearchSharp size={20} className="text-gray-700" />
          </button>

          <div className="relative" onClick={() => router.push("/cart")}>
            <IoCart size={20} className="text-gray-700" />
            {isMounted && CartItems?.length > 0 && (
              <span className="absolute text-white text-xs h-5 w-5 flex justify-center items-center -top-2 -right-2 bg-red-500 rounded-full font-medium">
                {CartItems?.length > 99 ? "99+" : CartItems?.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="pt-1 grid grid-cols-12 h-[calc(100vh-56px)]">
        <div className="col-span-3 sm:col-span-2 border-r border-gray-200 h-full overflow-y-auto bg-white">
          <Leftcategory
            select={select}
            setSelect={setSelect}
            categories={filteredCategoriesWithSubCategory}
            isLoading={categoryStatus === "loading"}
          />
        </div>

        <div className="col-span-9 sm:col-span-10 h-full overflow-y-auto bg-white">
          <RightCategory
            subcategories={filteredSubcategoriesNew}
            selectedCategory={selectedCategory}
            isLoading={subcategoryStatus === "loading"}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;