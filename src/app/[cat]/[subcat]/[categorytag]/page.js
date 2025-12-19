
import SubCategoryPage from "@/main_pages/SearchOptimization/SubCategoryPage";
import { Suspense } from "react";

export default function Page({ params }) {
  return (
    <Suspense fallback={null}>
      <SubCategoryPage params={params} />
    </Suspense>
  );
}
