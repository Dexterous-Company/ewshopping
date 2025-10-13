import React from "react";
import PageHeader from "./PageHeader";
import MainSection from "./MainSection";
import ShowingCategories from "./ShowingCategories";
import SideFilteringCode from "./SideFilteringCode";
import CategoryRelatedProducts from "./CategoryRelatedProducts";

const MainCategory = () => {
  return (
    <div>
      <PageHeader />
      {/* <MainSection /> */}
      <div className="container">
        <ShowingCategories />
        <div>
          <SideFiltewringCode />
          <CategoryRelatedProducts />
        </div>
      </div>
    </div>
  );
};

export default MainCategory;
