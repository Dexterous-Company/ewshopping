import BrandSubPage from "@/main_pages/SearchOptimization/BrandSubPage";
import { Suspense } from "react";

export default function Page({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading products...
        </div>
      }>
      <BrandSubPage params={params} />
    </Suspense>
  );
}
