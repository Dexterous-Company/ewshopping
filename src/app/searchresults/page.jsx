"use client";
import Filter from "@/components/searchMobile/Filter";
import SearchResult from "@/components/searchMobile/SearchResult";
import React, { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/redux/serach/searchProductsSlice";

const SearchPageContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { loading, results, pagination, filters, error } = useSelector(
    (state) => state.search
  );

  // Get search parameters from URL
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || 1;
  const sort = searchParams.get("sort") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.getAll("brand[]") || [];
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const color = searchParams.get("color") || "";
  const availability = searchParams.get("availability") || "";
  const subCategory = searchParams.get("subCategory") || "";
  const categoryTag = searchParams.get("categoryTag") || "";
  const rating = searchParams.get("rating") || "";

  useEffect(() => {
    const params = {
      q,
      page,
      sort,
      category,
      brand,
      minPrice,
      maxPrice,
      color,
      availability,
      rating,
      subCategory,
      categoryTag,
    };

    dispatch(searchProducts(params));
  }, [dispatch, searchParams.toString()]);

  return (
    <>
      <SearchResult
        products={results}
        loading={loading}
        pagination={pagination}
        searchQuery={q}
      />
      <div className="block sm:hidden">
        <Filter filters={filters} loading={loading} />
      </div>
    </>
  );
};

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;