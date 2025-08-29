"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import BannerGrid from "@/main_pages/HomeScreen/BannerGrid";
import BoxCategories from "@/main_pages/HomeScreen/BoxCategores";
import CategoryCarousel from "@/main_pages/HomeScreen/CategoryCarousel";
import FeaturedBrand from "@/main_pages/HomeScreen/FeaturedBrand";
import HomeBanner from "@/main_pages/HomeScreen/HomeBanner";
import HomeProduct from "@/main_pages/HomeScreen/HomeProduct";
import PopularItems from "@/main_pages/HomeScreen/PopularItems";

const Page = () => {
  const dispatch = useDispatch();
  return (
    <>
      <CategoryCarousel />
      <HomeBanner />
      <HomeProduct title={"three"} border={"4"} />
      <BannerGrid />
      <FeaturedBrand title={"Featured Brand"} />
      <HomeProduct
        title={"one"}
        smallTitle={"Top exchange offers & new launches"}
      />
      {/* <PopularItems /> -->this one 3 grids  */}
      <BoxCategories />
      {/* for bottom */}
      <HomeProduct title={"two"} border={"30"} />
      <div className="block sm:hidden mt-[6rem]"></div>
    </>
  );
};

export default Page;
