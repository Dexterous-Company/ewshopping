import SingleProductCard from "@/main_pages/ProductPages.jsx/SingleProductCard";
import React from "react";

const page = () => {
  const products = [
    {
      id: 1,
      label: "Best seller",
      sponsored: "Sponsored",
      title: "Foldable Duffel Bag",
      subtitle: "Denim Blue, True Wireless",
      price: "₹299.00",
      oldPrice: "₹450.00",
      rating: 3.5,
      images: {
        default: "/assets/images/products/bag-product4-1.jpg",
        hover: "/assets/images/products/bag-product4.jpg",
      },
      colors: ["#6b7280", "#ef4444", "#fdba74", "#fde047"],
      sold: 34,
      available: 16,
    },
    {
      id: 2,
      label: "SALE",
      sponsored: "Sponsored",
      title: "GOBOULT W40 with Quad Mic ENC, 48H Battery Life, Low La",
      subtitle: "Denim Blue, True Wireless",
      price: "₹299.00",
      oldPrice: "₹450.00",
      rating: 3.5,
      images: {
        default: "/assets/images/products/fw-product4-1.jpg",
        hover: "/assets/images/products/fw-product4.jpg",
      },
      colors: ["#6b7280", "#ef4444", "#fdba74", "#fde047"],
      sold: 34,
      available: 16,
    },
    {
      id: 3,
      label: "NEW",
      sponsored: "Sponsored",
      title: "Foldable Duffel Bag",
      subtitle: "Denim Blue, True Wireless",
      price: "₹299.00",
      oldPrice: "₹450.00",
      rating: 3.5,
      images: {
        default: "/assets/images/products/furniture-product8-1.jpg",
        hover: "/assets/images/products/furniture-product8.jpg",
      },
      colors: ["#6b7280", "#ef4444", "#fdba74", "#fde047"],
      sold: 34,
      available: 16,
    },
    {
      id: 4,
      label: "NEW",
      sponsored: "Sponsored",
      title: "Wireless Headphones",
      subtitle: "Black, Noise Cancelling",
      price: "₹1,299.00",
      oldPrice: "₹1,999.00",
      rating: 4.5,
      images: {
        default: "/assets/images/products/product7-1.jpg",
        hover: "/assets/images/products/product7.jpg",
      },
      colors: ["#1f2937", "#111827", "#6b7280"],
      sold: 120,
      available: 30,
    },
    {
      id: 5,
      label: "Best seller",
      sponsored: "Sponsored",
      title: "Smart Watch Series 5",
      subtitle: "Black, Fitness Tracker",
      price: "₹2,499.00",
      oldPrice: "₹3,999.00",
      rating: 4,
      images: {
        default: "/assets/images/products/fw-product4-1.jpg",
        hover: "/assets/images/products/fw-product4.jpg",
      },
      colors: ["#1f2937", "#dc2626", "#2563eb"],
      sold: 89,
      available: 11,
    },
    {
      id: 6,
      label: "SALE",
      sponsored: "Sponsored",
      title: "Bluetooth Speaker",
      subtitle: "Portable, Waterproof",
      price: "₹999.00",
      oldPrice: "₹1,499.00",
      rating: 4.2,
      images: {
        default: "/assets/images/products/product11.jpg",
        hover: "/assets/images/products/product11-1.jpg",
      },
      colors: ["#1e40af", "#1e3a8a", "#9333ea"],
      sold: 56,
      available: 24,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {products.map((product) => (
          <SingleProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default page;
