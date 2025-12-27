import ProductMainPage from "@/main_pages/ProductPages.jsx/ProductMainPage";

export default async function Page({ params }) {
  // Await the params properly
  const { slug } = await params;
  
  // Return loading state while slug is being resolved
  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return <ProductMainPage slug={slug} />;
}