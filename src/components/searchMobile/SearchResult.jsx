"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import SingleProductCard from "@/main_pages/ProductPages.jsx/SingleProductCard";
import DesktopFilter from "./DesktopFilter";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SortFilterLoader from "../Loader/SingleProductCard";
import Noproducts from "@/main_pages/ProductPages.jsx/Noproducts";

const SearchResult = ({
  products,
  loading,
  pagination,
  searchQuery,
  loadMoreProducts,
  isLoadingMore,
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
    params.delete("page"); // Reset to first page when changing sort
    return `?${params.toString()}`;
  };

  // Calculate showing range
  const showingFrom = 1;
  const showingTo = products.length;
  const totalProducts = pagination?.total || 0;

  return (
    <>
      <div className="mx-3 md:mx-6 lg:mx-8">
        <div className="flex flex-col sm:flex-row w-full gap-4 ">
          {/* Filters Sidebar */}
          <div className="w-full sm:w-1/5">
            <DesktopFilter />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className=" bg-white p-4 rounded-lg shadow-sm">
              
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Showing</span> {showingFrom} –{" "}
                {showingTo} of{" "}
                <span className="font-medium">
                  {totalProducts.toLocaleString()}
                </span>{" "}
                results for "
                <span className="font-medium text-[#e96f84]">
                  {searchQuery || "all products"}
                </span>
                "
              </p>
              <div className="sm:block hidden" >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <span className="text-gray-700 font-medium whitespace-nowrap">
                    Sort By
                  </span>
                  <div className="flex flex-wrap gap-2 sm:gap-4 text-sm">
                    {sortOptions.map((option) => (
                      <Link
                        key={option.value}
                        href={createSortUrl(option.value)}
                        className={`px-3 py-1 rounded-full transition-colors ${
                          sort === option.value
                            ? "bg-[#e96f84] text-white font-medium"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <SortFilterLoader className="h-48 w-full rounded-lg" />
                    <SortFilterLoader className="h-4 w-3/4" />
                    <SortFilterLoader className="h-4 w-1/2" />
                    <SortFilterLoader className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 gap-2 ">
                  {products.map((product, index) => {
                    console.log(products, "products in search result");
                    
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

                {/* Loading indicator for infinite scroll */}
                {isLoadingMore && (
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <SortFilterLoader className="h-48 w-full rounded-lg" />
                        <SortFilterLoader className="h-4 w-3/4" />
                        <SortFilterLoader className="h-4 w-1/2" />
                        <SortFilterLoader className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                )}

                {/* End of results message */}
                {!pagination.hasNext && products.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    You've reached the end of the results
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

export default SearchResult;
