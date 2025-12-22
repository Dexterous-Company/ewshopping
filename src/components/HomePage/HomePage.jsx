"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";

// ✅ ABOVE THE FOLD (NORMAL IMPORTS)
import CategoryCarousel from "@/main_pages/HomeScreen/CategoryCarousel";
import HomeBanner from "@/main_pages/HomeScreen/HomeBanner";
import HomeProduct from "@/main_pages/HomeScreen/HomeProduct";

// 🔥 BELOW THE FOLD (DYNAMIC)
const BannerGrid = dynamic(
  () => import("@/main_pages/HomeScreen/BannerGrid"),
  { ssr: false }
);

const BoxCategories = dynamic(
  () => import("@/main_pages/HomeScreen/BoxCategores"),
  { ssr: false }
);

const MobileAccessoriesIOSPhones = dynamic(
  () => import("@/main_pages/HomeScreen/EventProduct"),
  { ssr: false }
);

const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const HomePage = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = React.useState([]);
  const [productsTwo, setProductsTwo] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingTwo, setLoadingTwo] = React.useState(true); // Separate loading state
  const [error, setError] = React.useState(null);
  const [errorTwo, setErrorTwo] = React.useState(null); // Separate error state

  // First useEffect for products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${Baseurl}/api/v1/product/getEventProduct/mobile-accessories-ios-phones`
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        if (data.success) setProducts(data.product);
        else throw new Error("API returned unsuccessful response");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Second useEffect for productsTwo
  useEffect(() => {
    const fetchProductsTwo = async () => {
      try {
        setLoadingTwo(true);
        const response = await fetch(
          `${Baseurl}/api/v1/product/getEventProduct/mobile-accessories-ios-phones`
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        if (data.success) setProductsTwo(data.product);
        else throw new Error("API returned unsuccessful response");
      } catch (err) {
        setErrorTwo(err.message);
      } finally {
        setLoadingTwo(false);
      }
    };
    fetchProductsTwo();
  }, []);

  // Fix: Closing div was missing for the first div wrapper
  return (
    <center className="bg-white ">
      <div className="w-full sm:mt-0 flex flex-col sm:pt-2 ">
        {/* Top Sections */}
        <CategoryCarousel />
        <HomeBanner />

        {/* HomeProduct 2 - Women Fashion */}
        <HomeProduct
          title="Women's Fashion"
          border="4"
          categoryUrl="womens-fashion"
        />

        {/* Event Products */}
        <MobileAccessoriesIOSPhones
          products={products}
          loading={loading}
          error={error}
          bgGradient="bg-gradient-to-br from-amber-500 to-rose-600"
        />

        {/* 📍 SINGLE CATEGORY BOXES - Desktop */}
        <div className="hidden sm:flex flex-row gap-1 py-2">
          {/* 1. HeadPhones Category */}
          <BoxCategories
            title="HeadPhones Collection"
            singleCategory="HeadPhones"
            showAllPromotions={true}
          />
          {/* 2. Mobile Category */}
          <BoxCategories
            title="Mobile Collection"
            singleCategory="Mobile"
            showAllPromotions={true}
          />
          {/* 3. LED Category */}
          <BoxCategories
            title="LED TV Collection"
            singleCategory="LED"
            showAllPromotions={true}
          />
        </div>

        {/* 📍 SINGLE CATEGORY BOXES - Mobile */}
        <div className="sm:hidden block py-2">
          {/* 2. Mobile Category */}
          <BoxCategories
            title="Mobile Collection"
            singleCategory="Mobile"
            showAllPromotions={true}
          />
        </div>

        <BannerGrid />

        {/* HomeProduct 1 - Home Decor */}
        <HomeProduct
          title="Home Decor"
          smallTitle="Top exchange offers & new launches"
          border="8"
          categoryUrl="home-decor"
        />
        <div className="sm:hidden block py-2">
          {/* 1. HeadPhones Category */}
          <BoxCategories
            title="HeadPhones Collection"
            singleCategory="HeadPhones"
            showAllPromotions={true}
          />
        </div>
        {/* HomeProduct 3 - Grocery & Foods */}
        <HomeProduct
          title="Staples Cooking Essentials"
          border="30"
          categoryUrl="staples-cooking-essentials"
        />
        <div className="sm:hidden block py-2">
          <BoxCategories
            title="LED TV Collection"
            singleCategory="LED"
            showAllPromotions={true}
          />
        </div>

        {/* HomeProduct 4 - Kitchen & Cookware */}
        <HomeProduct
          title="Kitchen Cookware Serveware"
          border="8"
          categoryUrl="kitchen-cookware-serveware"
        />
        <div className="sm:hidden block py-2">
          {/* 4. Refrigerators Category */}
          <BoxCategories
            title="Refrigerators Collection"
            singleCategory="Refrigerators"
            showAllPromotions={true}
          />
        </div>
        {/* 📍 SINGLE CATEGORY BOXES - Desktop */}
        <div className="hidden sm:flex flex-row gap-1 py-2">
          {/* 4. Refrigerators Category */}
          <BoxCategories
            title="Refrigerators Collection"
            singleCategory="Refrigerators"
            showAllPromotions={true}
          />

          {/* 5. Home Theater Category */}
          <BoxCategories
            title="Home Theater Collection"
            singleCategory="Home Theater"
            showAllPromotions={true}
          />

          {/* 6. Washing Machine Category */}
          <BoxCategories
            title="Washing Machine Collection"
            singleCategory="Washing Machine"
            showAllPromotions={true}
          />
        </div>

        {/* HomeProduct - Mens Fashion */}
        <HomeProduct
          title="Mens Fashion"
          border="12"
          categoryUrl="mens-fashion"
        />

        {/* Second Event Products Section */}
        <MobileAccessoriesIOSPhones
          products={productsTwo}
          loading={loadingTwo} // Use loadingTwo
          error={errorTwo} // Use errorTwo
          bgGradient="bg-gradient-to-br from-indigo-800 via-gray-900 to-indigo-900"
        />

        {/* HomeProduct 5 - Gardening */}
        <HomeProduct title="Gardening" border="12" categoryUrl="gardening" />
        <div className="sm:hidden block space-y-4">
          {/* 5. Home Theater Category */}
          <BoxCategories
            title="Home Theater Collection"
            singleCategory="Home Theater"
            showAllPromotions={true}
          />
        </div>

        {/* HomeProduct - Bath Body Care */}
        <HomeProduct
          title="Bath Body Care"
          border="12"
          categoryUrl="bath-body-care"
        />
        <div className="sm:hidden block py-2">
          {/* 6. Washing Machine Category */}
          <BoxCategories
            title="Washing Machine Collection"
            singleCategory="Washing Machine"
            showAllPromotions={true}
          />
        </div>

        {/* HomeProduct - Makeup Cosmetics */}
        <HomeProduct
          title="Makeup Cosmetics"
          border="12"
          categoryUrl="makeup-cosmetics"
        />
      </div>

      {/* Mobile spacing */}
      <div className="block sm:hidden mt-[5.3rem]"></div>
    </center>
  );
};

export default HomePage;
