"use client";
import React, { useEffect, useState } from "react";
import ProductLayout from "./ProductLayout";
import { useDispatch, useSelector } from "react-redux";
import { getSingleApprovedProductDetails } from "@/redux/product/productSlice";
import RelatedProducts from "./RelatedProducts";

const ProductMainPage = ({ slug }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Optional: Get product loading state from Redux if available
  const { status, error: productError } = useSelector((state) => state.product || {});

  useEffect(() => {
    // Early return if no slug
    if (!slug) {
      setError("No product specified");
      setLoading(false);
      return;
    }
    
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(getSingleApprovedProductDetails(slug));
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [slug, dispatch]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F2F4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || productError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F2F4]">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            {error || "Failed to load product"}
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for might not exist or there was an error loading it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show product when loaded
  return (
    <div className="bg-[#F1F2F4] md:bg-transparent mb-10 px-0 sm:px-10">
      <ProductLayout />
      <RelatedProducts />
    </div>
  );
};

export default ProductMainPage;