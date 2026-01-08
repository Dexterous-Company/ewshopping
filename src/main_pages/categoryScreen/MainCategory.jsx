import React from "react";
import PageHeader from "./PageHeader";
import ShowingCategories from "./ShowingCategories";
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
