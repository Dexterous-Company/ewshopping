import React from "react";
import dynamic from "next/dynamic";

// ✅ ABOVE THE FOLD (SSR ENABLED)
const CategoryCarousel = dynamic(
  () => import("@/main_pages/HomeScreen/CategoryCarousel")
);

const HomeBanner = dynamic(
  () => import("@/main_pages/HomeScreen/HomeBanner")
);

const HomeProduct = dynamic(
  () => import("@/main_pages/HomeScreen/HomeProduct")
);

// 🔥 BELOW THE FOLD (STILL SSR, BUT CODE-SPLIT)
const BannerGrid = dynamic(
  () => import("@/main_pages/HomeScreen/BannerGrid")
);

const BoxCategories = dynamic(
  () => import("@/main_pages/HomeScreen/BoxCategores")
);

const MobileAccessoriesIOSPhones = dynamic(
  () => import("@/main_pages/HomeScreen/EventProduct")
);

const HomePage = () => {
  return (
    <center className="bg-white">
      <div className="w-full flex flex-col sm:pt-2">
        {/* Top Sections */}
        <CategoryCarousel />
        <HomeBanner />

        {/* HomeProduct - Women */}
        <HomeProduct
          title="Women's Fashion"
          border="4"
          categoryUrl="womens-fashion"
        />
        <BannerGrid />


        {/* Mobile Categories */}
        <div className="sm:hidden py-2">
          <BoxCategories title="Mobile Collection" singleCategory="Mobile" showAllPromotions />
        </div>


        {/* Home Decor */}
        <HomeProduct
          title="Home Decor"
          smallTitle="Top exchange offers & new launches"
          border="8"
          categoryUrl="home-decor"
        />
        
        {/* Desktop Categories */}
        <div className="hidden sm:flex py-2">
          <BoxCategories title="HeadPhones Collection" singleCategory="HeadPhones" showAllPromotions />
          <BoxCategories title="Mobile Collection" singleCategory="Mobile" showAllPromotions />
          <BoxCategories title="LED TV Collection" singleCategory="LED" showAllPromotions />
        </div>

        {/* Grocery */}
        <HomeProduct
          title="Staples Cooking Essentials"
          border="30"
          categoryUrl="staples-cooking-essentials"
        />

        {/* Kitchen */}
        <HomeProduct
          title="Kitchen Cookware Serveware"
          border="8"
          categoryUrl="kitchen-cookware-serveware"
        />

        {/* Mens */}
        <HomeProduct
          title="Mens Fashion"
          border="12"
          categoryUrl="mens-fashion"
        />

        {/* Gardening */}
        <HomeProduct
          title="Gardening"
          border="12"
          categoryUrl="gardening"
        />

        {/* Event Products */}
        <MobileAccessoriesIOSPhones />

        {/* Bath */}
        <HomeProduct
          title="Bath Body Care"
          border="12"
          categoryUrl="bath-body-care"
        />

        {/* Makeup */}
        <HomeProduct
          title="Makeup Cosmetics"
          border="12"
          categoryUrl="makeup-cosmetics"
        />
      </div>

      {/* Mobile spacing */}
      <div className="block sm:hidden mt-[5.3rem]" />
    </center>
  );
};

export default HomePage;
