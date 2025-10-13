"use client";
import Brands from "@/main_pages/categoryScreen/Brands";
import OffersProducts from "@/main_pages/categoryScreen/OffersProducts";
import ProductTagsSkeleton from "@/main_pages/categoryScreen/ProductTagsSkeleton";
import ShowingCategories from "@/main_pages/categoryScreen/ShowingCategories";
import React, { useEffect, useState } from "react";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;

const ProductTags = ({ slug }) => {
  const [prodType, setProdType] = useState([]);
  const [prods, setProds] = useState([]);
  const [brandData, setbrandData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryResponse, productsResponse, brandResponse] =
          await Promise.all([
            fetch(`${Baseurl}/api/v1/categorytag/subcat/${slug}`),
            fetch(
              `${Baseurl}/api/v1/approve_card/getProductBySubCatUrl/${slug}`
            ),
            fetch(`${Baseurl}/api/v1/brandPromotion/getTopBrands`),
          ]);

        const categoryData = await categoryResponse.json();
        const productsData = await productsResponse.json();
        const brandData = await brandResponse.json();
        setProdType(categoryData);
        setProds(productsData.product || []);
        setbrandData(brandData.topBrand || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    // return <div className="flex justify-center items-center h-64">Loading...</div>;
    return <ProductTagsSkeleton />;
  }

  return (
    <div className="sm:pb-0 pb-25">
      <ShowingCategories prodType={prodType} />
      <div className="text-lg font-medium px-5 sm:py-4 py-2 sm:text-2xl">
        Offers Products
      </div>
      <div className="px-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {prods.length > 0 ? (
          prods
            .filter(
              (product) => product.slugUrl !== "a3x-ocean-green,-64-gb-4gb-ram-"
            )
            .map((product) => (
              <OffersProducts key={product._id} product={product} />
            ))
        ) : (
          <div className="col-span-full text-center py-8">
            No products found in this category
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTags;
