"use client";
import React, { useEffect, useState } from "react";
import ProductLayout from "./ProductLayout";
import TabsListing from "./TabsListing";
import { useDispatch } from "react-redux";
import { getSingleApprovedProductDetails } from "@/redux/product/productSlice";

const ProductMainPage = ({ slug }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        await dispatch(getSingleApprovedProductDetails(slug));
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };
    fetchProduct();
  }, [slug]);

  return (
   <div className="bg-[#F1F2F4] md:bg-transparent mb-10">
      <ProductLayout />
      {/* <TabsListing /> */}
    </div>
  );
};

export default ProductMainPage;
