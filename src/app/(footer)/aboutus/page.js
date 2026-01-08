import AboutUs from "../../../main_pages/footerPages/AboutUs";
import React, { Suspense } from "react";

export const metadata = {
  title: "About EW Shopping: Top online shop for electronics to essentials",
  description:
    "Discover EW Shopping | Top online shopping website in India featuring safe payments, original products, amazing deals and fast deliveries on all products",
  keywords:
    "Top online shopping website in India, EW Shopping India, online shopping site for fashion & electronics, affordable online shopping India, genuine products online India, safe payment methods, fast online delivery services, original products, reliable online shopping platform, easy online returns, online product local sellers, branded online shopping, secure e-commerce shopping platform",
  alternates: {
    canonical: "https://ewshopping.com/aboutus",
  },
};

const Page = () => {
  return (
    <Suspense fallback={<div />}>
      <AboutUs />
    </Suspense>
  );
};

export default Page;
