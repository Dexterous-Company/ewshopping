import ProductMainPage from "@/main_pages/ProductPages.jsx/ProductMainPage";

export default function Page({ params }) {
  return <ProductMainPage slug={params?.slug} />;
}