"use client";
import React from "react";
// import Header from "../layout/MobileHeader";
import SingleProductCard from "@/main_pages/ProductPages.jsx/SingleProductCard";
import DesktopFilter from "./DesktopFilter";
import ShowingCategories from "@/main_pages/categoryScreen/ShowingCategories";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SortFilterLoader from "../Loader/SingleProductCard";
import Noproducts from "@/main_pages/ProductPages.jsx/Noproducts";

const SearchResult = ({ products, loading, pagination, searchQuery }) => {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "relevance";
  const page = searchParams.get("page") || 1;

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

  const createPageUrl = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum);
    return `?${params.toString()}`;
  };

  // Calculate showing range
  const showingFrom = (pagination?.currentPage - 1) * pagination?.limit + 1;
  const showingTo = Math.min(
    pagination?.currentPage * pagination?.limit,
    pagination?.total
  );

  return (
    <>
      {/* <Header /> */}
      <div className="mx-3 md:mx-6 lg:mx-8">
        {/* <ShowingCategories /> */}
        <div className="flex flex-col sm:flex-row w-full gap-4 ">
          {/* Filters Sidebar */}
          <div className="w-full sm:w-1/5">
            <DesktopFilter />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="hidden sm:block bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="text-gray-600 mb-3">
                <span className="font-medium">Showing</span> {showingFrom || 0} – {showingTo || 0} of{" "}
                <span className="font-medium">{pagination?.total?.toLocaleString() || 0}</span> results for "
                <span className="font-medium text-[#e96f84]">
                  {searchQuery || "all products"}
                </span>
                "
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <span className="text-gray-700 font-medium whitespace-nowrap">Sort By</span>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-sm">
                  {sortOptions.map((option) => (
                    <Link
                      key={option.value}
                      href={createSortUrl(option.value)}
                      className={`px-3 py-1 rounded-full transition-colors ${sort === option.value
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

            {/* Products Grid */}
            {loading ? (
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
            ) : products?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <SingleProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              // <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              //   <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
              //   <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              // </div>
              <>
                <Noproducts />
              </>
            )}

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  {/* Previous Button */}
                  <Link
                    href={createPageUrl(pagination.currentPage - 1)}
                    className={`px-3 py-1 rounded border ${!pagination.hasPrevious
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                      }`}
                    aria-disabled={!pagination.hasPrevious}
                    tabIndex={!pagination.hasPrevious ? -1 : undefined}
                  >
                    &larr; Previous
                  </Link>

                  {/* First Page */}
                  {pagination.currentPage > 3 && (
                    <>
                      <Link
                        href={createPageUrl(1)}
                        className="px-3 py-1 rounded border hover:bg-gray-100"
                      >
                        1
                      </Link>
                      {pagination.currentPage > 4 && (
                        <span className="px-2">...</span>
                      )}
                    </>
                  )}

                  {/* Page Numbers */}
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <Link
                          key={pageNum}
                          href={createPageUrl(pageNum)}
                          className={`px-3 py-1 rounded border ${pageNum === pagination.currentPage
                            ? "bg-[#e96f84] text-white border-[#e96f84]"
                            : "hover:bg-gray-100"
                            }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    }
                  )}

                  {/* Last Page */}
                  {pagination.currentPage < pagination.totalPages - 2 && (
                    <>
                      {pagination.currentPage < pagination.totalPages - 3 && (
                        <span className="px-2">...</span>
                      )}
                      <Link
                        href={createPageUrl(pagination.totalPages)}
                        className="px-3 py-1 rounded border hover:bg-gray-100"
                      >
                        {pagination.totalPages}
                      </Link>
                    </>
                  )}

                  {/* Next Button */}
                  <Link
                    href={createPageUrl(pagination.currentPage + 1)}
                    className={`px-3 py-1 rounded border ${!pagination.hasNext
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                      }`}
                    aria-disabled={!pagination.hasNext}
                    tabIndex={!pagination.hasNext ? -1 : undefined}
                  >
                    Next &rarr;
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResult;