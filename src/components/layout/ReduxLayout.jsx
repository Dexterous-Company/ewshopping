"use client";
import { getBanners } from "@/redux/header/BannerSlice";
import { getPromotionBanners } from "@/redux/header/BrandPromotionSlice";
import { fetchCardPromotions } from "@/redux/header/cardPromotionSlice";
import {
  getCategoryPromotionOne,
  getCategoryPromotionThree,
  getCategoryPromotionTwo,
} from "@/redux/header/CategoryTagSlice";
import { getSubCategory } from "@/redux/header/HeaderSubSlice";
import { getSubCategoryPromotions } from "@/redux/header/SubCategoryPromotionSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function ReduxLayout({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = () => {
      dispatch(getSubCategory());
      dispatch(getBanners());
      dispatch(getPromotionBanners());
      dispatch(getSubCategoryPromotions());
      dispatch(fetchCardPromotions());
      dispatch(getCategoryPromotionOne());
      dispatch(getCategoryPromotionTwo());
      dispatch(getCategoryPromotionThree());
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
