"use client";
import React, { useEffect, useState } from "react";
import ProductLayout from "./ProductLayout";
import { useDispatch } from "react-redux";
import { getSingleApprovedProductDetails } from "@/redux/product/productSlice";
import RelatedProducts from "./RelatedProducts";

const ProductMainPage = ({ slug }) => {
  console.log("slug-->", slug);
  
  const dispatch = useDispatch();
  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        console.log("arbaz--->", slug);
        
        await dispatch(getSingleApprovedProductDetails(slug));
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };
    fetchProduct();
  }, [slug]);

  return (
   <div className="bg-[#F1F2F4]  md:bg-transparent mb-10 px-0 sm:px-10">
      <ProductLayout />
      <RelatedProducts />
    </div>
  );
};

export default ProductMainPage;
