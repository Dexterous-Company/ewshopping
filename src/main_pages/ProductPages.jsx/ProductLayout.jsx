"use client";
import React, { useEffect, useState } from "react";
import ProductImages from "./ProductImages";
import ProductDetails from "./ProductDetails"; // Assume this is implemented
import { useDispatch, useSelector } from "react-redux";
import SkeletonLoader from "./SkeletonLoader";
import { fetchReviews } from "@/redux/reviews/reviewSlice";

const colorOptions = [
  {
    name: "Olive",
    src: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/b/h/b/m-artical-dn-2-texure-n-and-j-original-imahbzxgzeqhgtr6.jpeg?q=70&crop=false",
  },
  {
    name: "Blue",
    src: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/n/r/s/s-artical-dn-2-texure-n-and-j-original-imahdq43g4dzzzgw.jpeg?q=70",
  },
  {
    name: "Orange",
    src: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/i/a/b/s-artical-dn-2-texure-n-and-j-original-imahdq82uhndkdgg.jpeg?q=70",
  },
  {
    name: "Green",
    src: "https://rukminim2.flixcart.com/image/832/832/xif0q/shirt/l/v/v/xxl-artical-dn-2-texure-n-and-j-original-imahbzxgwpmmnda3.jpeg?q=70",
  },
];

export default function ProductLayout() {
  const { product, status, error } = useSelector((state) => state.info);
  const { CartItems } = useSelector((state) => state.cart);

  if (status === "loading") {
    <SkeletonLoader />;
  }
  if (status === "failed") {
    <div>Error: {error}</div>;
  }

  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].name);
  const selectedColorData = colorOptions.find(
    (color) => color.name === selectedColor
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const dispatch = useDispatch()

  useEffect(() => {
    if (product?._id) {
      dispatch(fetchReviews(product?._id));
    }
  }, [dispatch, product?._id]);

  return (
    <>
      {/* <div className="container mx-auto px-2 md:px-4 sm:px-2 py-6">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-0">
          <div id="product-images" className="w-full  lg:w-1/2 xl:w-5/12 ">
            <ProductImages
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              colors={colorOptions}
              product={product}
            />
          </div>
          <div className="w-full lg:w-1/2 xl:w-7/12">
            <ProductDetails
              colors={colorOptions}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>
        </div>
      </div> */}

      <div className="container mx-auto px-2 md:px-4 sm:px-2 sm:py-6 py-2">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-3">
          {/* Images section - Sticky */}
          <div
            id="product-images"
            className="w-full lg:w-1/2 xl:w-5/12 lg:sticky lg:top-4 self-start h-fit"
          >
            <ProductImages
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              colors={colorOptions}
              product={product}
            />
          </div>

          {/* Details section - Scrolls normally */}
          <div className="w-full lg:w-1/2 xl:w-7/12">
            <ProductDetails
              colors={colorOptions}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>
        </div>
      </div>

    </>
  );
}
