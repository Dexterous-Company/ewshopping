
"use client";
import { IoIosArrowRoundBack } from "react-icons/io";
import React, { useEffect, useState } from "react";
import { IoSearchSharp, IoCart } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Leftcategory = ({ select, setSelect, categories, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col">
                {[...Array(8)].map((_, i) => (
                    // border-b rounded-3 border-b-gray-200
                    //  py-2
                    <div key={i} className="cursor-pointer relative  flex flex-col items-center justify-between">
                        <div className="h-15 w-15 rounded-full mb-1 bg-gray-200 animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
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
                    //  border-b rounded-3 border-b-gray-200 
                    className={`cursor-pointer relative py-2 flex flex-col items-center border-l-5 border-l-transparent border-r-transparent justify-between ${select === category._id ? "border-l-5" : ""}`}
                >
                    {select === category._id && (
                        <div className="absolute left-0 rounded-r-2xl top-0 h-full w-1 bg-[#e96f84] z-10"></div>
                    )}
                    <div className="h-15 w-15 rounded-full mb-1">
                        <img
                            src={category.mobileImage || "https://via.placeholder.com/60"}
                            alt={category.name}
                            className="h-full w-full object-cover rounded-full"
                        />
                    </div>
                    <span className={`text-xs ${select === category._id ? "text-[#e96f84] font-medium" : "text-gray-600"} text-center`}>
                        {category?.name.length > 20 ? `${category?.name?.slice(0, 20)}...` : category?.name}
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
        if (subcat) {
            router.push(`/searchresults?subCategory=${subcat.name}`);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 p-2">
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
                <div className="grid sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 grid-cols-3 gap-2">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="sm:h-20 h-15 w-15 sm:w-20 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!subcategories || subcategories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-6 p-2">
                <div className="text-center py-10 text-gray-500">
                    No subcategories found for this category
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-2">
            <div>
                <div className="gap-1">
                    <div className="mb-4">
                        <span className="font-semibold text-[1.1rem] mb-2 block">
                            {selectedCategory?.name || "Subcategories"}
                        </span>
                        <div className="grid sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 grid-cols-3 gap-2">
                            {subcategories.map((subcat, j) => (
                                <div
                                    key={`${subcat._id}-${j}`}
                                    className="flex flex-col items-center"
                                    onClick={(e) => handleClick(e, subcat)}
                                >
                                    <img
                                        src={subcat.mobileImage || "https://via.placeholder.com/80"}
                                        className="sm:h-20 h-15 w-15 sm:w-20 object-fill rounded-full bg-[#f5f6fb]"
                                        alt={subcat.name}
                                    />
                                    <span className="text-xs text-center py-2">
                                        {subcat.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CategoryPage = () => {
    const { fillteredCategory, status: categoryStatus } = useSelector((store) => store.category);
    const { fillteredSubCategory, status: subcategoryStatus } = useSelector((store) => store.subcategory);
    const { CartItems } = useSelector((store) => store.cart);

    const [select, setSelect] = useState('');
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (fillteredCategory?.length > 0 && !select) {
            setSelect(fillteredCategory[0]._id);
        }
    }, [fillteredCategory, select]);

    const selectedCategory = fillteredCategory?.find(cat => cat._id === select);

    const filteredSubcategoriesNew = fillteredSubCategory?.filter(subcat => subcat?.categoryId === selectedCategory?._id);
    const isCategoryLoading = categoryStatus === 'loading';
    const isSubcategoryLoading = subcategoryStatus === 'loading';
    const isLoading = isCategoryLoading || isSubcategoryLoading;

    return (
        <div className="mt-0">
            <div className="h-13 flex justify-between items-center fixed top-0 z-10 w-full bg-white shadow-sm p-3 mb-2">
                <div className="flex items-center flex-row gap-2">
                    <IoIosArrowRoundBack size={25} onClick={() => router.back()} />
                    <span>All Categories</span>
                </div>
                <div className="flex items-center gap-2 mr-3">
                    <IoSearchSharp size={20} onClick={() => router.push("/searchmobile")} />
                    <div className="relative" onClick={() => router.push('/cart')}>
                        <IoCart size={20} />
                        {isMounted && (
                            <span className="absolute text-white text-xs h-4 w-4 flex justify-center items-center -top-2 -right-2 bg-[#e96f84] rounded-full">
                                {CartItems?.length || 0}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 mt-1 h-screen">
                <div className="sm:col-span-1 col-span-3 border-r border-r-gray-200 h-full overflow-y-auto no-scrollbar">
                    <Leftcategory
                        select={select}
                        setSelect={setSelect}
                        categories={fillteredCategory}
                        isLoading={isCategoryLoading}
                    />
                </div>
                <div className="sm:col-span-11 col-span-9 h-full overflow-y-auto no-scrollbar">
                    <RightCategory
                        subcategories={filteredSubcategoriesNew}
                        selectedCategory={selectedCategory}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;