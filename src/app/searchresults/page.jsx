"use client";
import Filter from "@/components/searchMobile/Filter";
import SearchResult from "@/components/searchMobile/SearchResult";
import React, { useEffect, Suspense, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import {
  searchProducts,
  loadMoreProducts,
} from "@/redux/serach/searchProductsSlice";

const SearchPageContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { loading, results, pagination, filters, error, availableFilters } = useSelector(
    (state) => state.search
  );


  // Get search parameters from URL
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.getAll("brand[]") || [];
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const color = searchParams.get("color") || "";
  const availability = searchParams.get("availability") || "";
  const subCategory = searchParams.get("subCategory") || "";
  const productTag = searchParams.get("productTag") || "";
  const categoryTag = searchParams.get("categoryTag") || "";
  const rating = searchParams.get("rating") || "";

  // State to track if we're loading more products
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const params = {
      q,
      page: 1, 
      sort,
      category,
      brand,
      minPrice,
      maxPrice,
      availability,
      rating,
      subCategory,
      productTag,
      categoryTag,
    };

    dispatch(searchProducts(params));
  }, [dispatch, searchParams.toString()]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !pagination.hasNext) return;

    setIsLoadingMore(true);

    const nextPage = pagination.currentPage + 1;
    const params = {
      q,
      page: nextPage,
      sort,
      category,
      brand,
      minPrice,
      maxPrice,
      availability,
      rating,
      subCategory,
      productTag,
      categoryTag,
    };

    try {
      await dispatch(loadMoreProducts(params));
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    dispatch,
    isLoadingMore,
    pagination,
    q,
    sort,
    category,
    brand,
    minPrice,
    maxPrice,
    color,
    availability,
    rating,
    subCategory,
    productTag,
    categoryTag,
  ]);

  return (
    <>
      <SearchResult
        products={results}
        loading={loading}
        pagination={pagination}
        searchQuery={q}
        loadMoreProducts={handleLoadMore}
        isLoadingMore={isLoadingMore}
      />
        <Filter filters={availableFilters} loading={loading} />
   
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
