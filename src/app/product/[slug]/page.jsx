import ProductMainPage from "@/main_pages/ProductPages.jsx/ProductMainPage";

export default async function Page({ params }) {
  const { slug } = await params;
  return <ProductMainPage slug={slug} />;
}
