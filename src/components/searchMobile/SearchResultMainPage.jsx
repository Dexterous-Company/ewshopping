"use client";
import React, { useCallback, useRef } from "react";
import SingleProductCard from "../../main_pages/ProductPages.jsx/SingleProductCard";
import DesktopFilter from "./DesktopFilter";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SortFilterLoader from "../Loader/SingleProductCard";
import Noproducts from "../../main_pages/ProductPages.jsx/Noproducts";
import HorizontalFilterScroll from "./HorizontalFilter";

const SearchResultMainPage = ({
  products,
  loading,
  pagination,
  loadMoreProducts,
  isLoadingMore,
  availableFilters,
}) => {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "relevance";
  const observer = useRef();

  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.hasNext) {
          loadMoreProducts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, pagination.hasNext, loadMoreProducts]
  );

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price -- Low to High" },
    { value: "price_desc", label: "Price -- High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "popularity", label: "Popularity" },
  ];

  const createSortUrl = (sortValue) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    params.delete("page");
    return `?${params.toString()}`;
  };

  // Calculate showing range

  return (
    <>
      <div className="md:px-2 lg:px-2 bg-gradient-to-br from-amber-50/30 to-orange-50/30 min-h-screen">
        <div className="flex flex-col sm:flex-row w-full gap-4">
          {/* Filters Sidebar */}
          <div className="w-full sm:w-1/5 self-start sticky sm:top-20 sm:h-fit sm:block hidden my-2">
            <DesktopFilter />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="py-1 my-1 bg-white sm:px-2  rounded-lg shadow-lg">
          

              {/* Horizontal Filter Scroll - Mobile */}
              <div className="sm:hidden block">
                <HorizontalFilterScroll filters={availableFilters} />
              </div>

              {/* Desktop Sort Options */}
              <div className="sm:block hidden p-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3">
                  <span className="text-amber-800 font-semibold whitespace-nowrap flex items-center gap-2">
                    Sort By
                  </span>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-sm">
                    {sortOptions.map((option) => (
                      <Link
                        key={option.value}
                        href={createSortUrl(option.value)}
                        className={`px-4 py-1 rounded-xl transition-all duration-300 border-2 font-medium ${
                          sort === option.value
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-lg scale-105"
                            : "bg-white text-amber-700 border-amber-200 hover:border-orange-400 hover:shadow-md hover:scale-105"
                        }`}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <SortFilterLoader className="h-48 w-full rounded-2xl" />
                    <SortFilterLoader className="h-4 w-3/4" />
                    <SortFilterLoader className="h-4 w-1/2" />
                    <SortFilterLoader className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12 md:mb-0">
                  {products.map((product, index) => {
                    if (products.length === index + 1) {
                      return (
                        <div ref={lastProductElementRef} key={product._id}>
                          <SingleProductCard product={product} />
                        </div>
                      );
                    } else {
                      return (
                        <SingleProductCard
                          key={product._id}
                          product={product}
                        />
                      );
                    }
                  })}
                </div>

                {/* Loading More Indicator */}
                {isLoadingMore && (
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12 md:mb-0">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <SortFilterLoader className="h-48 w-full rounded-2xl" />
                        <SortFilterLoader className="h-4 w-3/4" />
                        <SortFilterLoader className="h-4 w-1/2" />
                        <SortFilterLoader className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                )}

                {/* End of Results Message */}
                {!pagination.hasNext && products.length > 0 && (
                  <div className="text-center py-12">
                    <div className="text-center py-8 text-gray-500">
                      You've reached the end of the products list
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Noproducts />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResultMainPage;
