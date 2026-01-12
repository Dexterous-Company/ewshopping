"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getBanners } from "../../redux/header/BannerSlice";
import { getPromotionBanners } from "../../redux/header/BrandPromotionSlice";
import { fetchCardPromotions } from "../../redux/header/cardPromotionSlice";
import {
  getCategoryPromotionOne,
  getCategoryPromotionTwo,
  getCategoryPromotionThree,
} from "../../redux/header/CategoryTagSlice";
import { getSubCategoryPromotions } from "../../redux/header/SubCategoryPromotionSlice";

export default function ReduxLayout({ children }) {
  const dispatch = useDispatch();
useEffect(() => {
  console.log("🔥 ReduxLayout mounted");
  return () => console.log("❌ ReduxLayout unmounted");
}, []);

  useEffect(() => {
    dispatch(getBanners());
    dispatch(getPromotionBanners());
    dispatch(getSubCategoryPromotions());
    dispatch(fetchCardPromotions());
    dispatch(getCategoryPromotionOne());
    dispatch(getCategoryPromotionTwo());
    dispatch(getCategoryPromotionThree());

    const refreshInterval = setInterval(() => {
      dispatch(getBanners());
      dispatch(getPromotionBanners());
    }, 60 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  return <>{children}</>;
}
