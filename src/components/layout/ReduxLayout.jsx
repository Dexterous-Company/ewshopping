"use client";

import { getFillteredCategory } from "@/redux/category/categorySlice";
import { getBanners } from "@/redux/header/BannerSlice";
import { getPromotionBanners } from "@/redux/header/BrandPromotionSlice";
import { fetchCardPromotions } from "@/redux/header/cardPromotionSlice";
import { getCategoryPromotionOne, getCategoryPromotionThree, getCategoryPromotionTwo } from "@/redux/header/CategoryTagSlice";
import { getSubCategory } from "@/redux/header/HeaderSubSlice";
import { getSubCategoryPromotions } from "@/redux/header/SubCategoryPromotionSlice";
import { getFillteredSubCategory } from "@/redux/subcategory/SubCategorySlice";
// import { searchProducts } from "@/redux/serach/searchProductsSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ReduxLayout({ children }) {
  const dispatch = useDispatch();
  const { lastUpdated } = useSelector((state) => state.banner);

  useEffect(() => {
    const loadData = () => {
      dispatch(getSubCategory());
      dispatch(getBanners());
      dispatch(getCategoryPromotionOne());
      dispatch(fetchCardPromotions());
      dispatch(getPromotionBanners());
      dispatch(getCategoryPromotionTwo());
      dispatch(getSubCategoryPromotions());
      dispatch(getCategoryPromotionThree());
      dispatch(getFillteredCategory());
      dispatch(getFillteredSubCategory());



      // dispatch(searchProducts());
      // dispatch(getCategoryTags_Home_Furniture_Kitchen());
    };

    // Initial load
    loadData();

    // Refresh data periodically (e.g., every hour)
    const refreshInterval = setInterval(() => {
      loadData();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  return <>{children}</>;
}