import { configureStore } from "@reduxjs/toolkit";
import subCatReducer from "./header/HeaderSubSlice";
import bannerSlice from "./header/BannerSlice";
import categoryTagReducer from "./header/CategoryTagSlice";
import threeSliderReducer from "./header/ThreeSliderSlice";
import AthenticationReducer from "./athentication/Athentication";
import promotionBannerSlice from "./header/BrandPromotionSlice";
import promotionCardSlice from "./header/cardPromotionSlice";
import searchSlice from "./serach/searchProductsSlice";
import newSearchSlice from "./serach/newSerchProdactSlice";
import subCategoryPromotionReducer from "./header/SubCategoryPromotionSlice";
import infoSlice from "./product/productSlice";
import orderSlice from "./order/OrderSlice";
import cartSlice from "./cart/CartSlice";
import reviewReducer from "./reviews/reviewSlice";
import couponReducer from "./coupon/couponSlice";
import wishlistReducer from "./wishlist/wishlistSlice";
import subCategoryReducer from "../redux/subcategory/SubCategorySlice";
import categoryReducer from "../redux/category/categorySlice";
import shopProductsReducer from "../redux/sellerProduct/SellerProductSlice";
import contactReducer from "../redux/contactUs/ContactUsSlice";
import categoryTagProductReducer from "../redux/categoryTag/CategoryTagProductSlice";

export const store = configureStore({
  reducer: {
    subCat: subCatReducer,
    banner: bannerSlice,
    categoryTag: categoryTagReducer,
    threeSlider: threeSliderReducer,
    Athentication: AthenticationReducer,
    bPromotion: promotionBannerSlice,
    cPromotion: promotionCardSlice,
    search: searchSlice,
    searchNew: newSearchSlice,
    subCategoryPromotion: subCategoryPromotionReducer,
    info: infoSlice,
    order: orderSlice,
    cart: cartSlice,
    reviews: reviewReducer,
    coupon: couponReducer,
    wishlist: wishlistReducer,
    subcategory: subCategoryReducer,
    category: categoryReducer,
    shopProducts: shopProductsReducer,
    contacts: contactReducer,
    categoryTagProduct: categoryTagProductReducer,
  },
});
