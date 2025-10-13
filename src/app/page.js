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
import MobileAccessoriesIOSPhones from "@/main_pages/HomeScreen/EventProduct";

const Page = () => {
  const dispatch = useDispatch();

  return (
    <center>
      <div className="w-full sm:mt-0">
        <CategoryCarousel />
        <HomeBanner />
        <HomeProduct
          title={"one"}
          smallTitle={"Top exchange offers & new launches"}
        />
        <div className="sm:hidden block">
          <BoxCategories selectedIndexes={[2]} />
        </div>
        <BannerGrid />
        <MobileAccessoriesIOSPhones />
        <FeaturedBrand title={"Featured Brand"} />
        <div className="sm:hidden block">
          <BoxCategories selectedIndexes={[1]} />
        </div>
        <div className="sm:block hidden">
          <BoxCategories selectedIndexes={[0, 1, 2]} />
        </div>
        <HomeProduct title={"three"} border={"4"} />
        {/* <PopularItems /> -->this one 3 grids  */}
        {/* for bottom */}
        <HomeProduct title={"two"} border={"30"} />
        <div className="sm:hidden block">
          <BoxCategories selectedIndexes={[0]} />
        </div>
        <div className="block sm:hidden mt-[6rem]"></div>
      </div>
    </center>
  );
};

export default Page;
