"use client";
import Filter from "@/components/searchMobile/Filter";
import SearchResult from "@/components/searchMobile/SearchResult";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchProducts,
  loadMoreProducts,
} from "@/redux/serach/searchProductsSlice";
import { useSearchParams } from "next/navigation";

const KeywordsMainPage = ({ params }) => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { loading, results, pagination, availableFilters } = useSelector(
    (state) => state.search
  );

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasInitialSearch, setHasInitialSearch] = useState(false);

  // Extract from params and search params
  const searchQuery = params?.keyword || "";
  const categoryTag = params?.categoryTag || "";

  // Get all filter parameters from URL
  const sort = searchParams.get("sort") || "relevance";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const brand = searchParams.getAll("brand");
  const color = searchParams.get("color");
  const category = searchParams.get("category");

  // Create a stable search params object for comparison
  const currentSearchParams = JSON.stringify({
    q: searchQuery,
    categoryTag,
    sort,
    minPrice,
    maxPrice,
    brand: brand.sort().join(","), // Sort brands for consistent comparison
    color,
    category,
  });

  const prevSearchParams = useRef("");

  // Initial search - only run when search parameters actually change
  useEffect(() => {
    // Only search if we have a query and parameters have actually changed
    if (
      (searchQuery || categoryTag) &&
      prevSearchParams.current !== currentSearchParams
    ) {
      const searchParamsObj = {
        q: searchQuery,
        categoryTag: categoryTag || undefined,
        page: 1,
        sort,
        ...(minPrice && { minPrice: parseInt(minPrice) }),
        ...(maxPrice && { maxPrice: parseInt(maxPrice) }),
        ...(brand.length > 0 && { brand }),
        ...(color && { color }),
        ...(category && { category }),
      };

      prevSearchParams.current = currentSearchParams;

      dispatch(searchProducts(searchParamsObj));
      setHasInitialSearch(true);
    }
  }, [
    dispatch,
    searchQuery,
    categoryTag,
    currentSearchParams, // Use the stringified version for comparison
    sort,
    minPrice,
    maxPrice,
    brand,
    color,
    category,
  ]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !pagination?.hasNext) return;

    setIsLoadingMore(true);
    try {
      await dispatch(
        loadMoreProducts({
          q: searchQuery,
          categoryTag: categoryTag || undefined,
          page: pagination.currentPage + 1,
          sort,
          ...(minPrice && { minPrice: parseInt(minPrice) }),
          ...(maxPrice && { maxPrice: parseInt(maxPrice) }),
          ...(brand.length > 0 && { brand }),
          ...(color && { color }),
          ...(category && { category }),
        })
      );
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    dispatch,
    isLoadingMore,
    pagination,
    searchQuery,
    categoryTag,
    sort,
    minPrice,
    maxPrice,
    brand,
    color,
    category,
  ]);

  return (
    <>
      <SearchResult
        products={results || []}
        loading={loading}
        pagination={pagination || {}}
        searchQuery={searchQuery}
        loadMoreProducts={handleLoadMore}
        isLoadingMore={isLoadingMore}
        availableFilters={availableFilters || {}}
      />
      <Filter filters={availableFilters || {}} loading={loading} />
    </>
  );
};

export default KeywordsMainPage;
