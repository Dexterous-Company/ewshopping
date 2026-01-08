"use client";
import { useSearchParams } from "next/navigation";
import SellerProductsPage from "../../main_pages/sellerProduct/SellerProductsPage";

export default function SellerProductWrapper() {
  const searchParams = useSearchParams();
  const sellerName = searchParams.get("sellername");

  return <SellerProductsPage sellerName={sellerName} />;
}
