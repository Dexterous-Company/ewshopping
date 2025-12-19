import BannerSearchPage from "@/main_pages/SearchOptimization/BannerSearchPage";
import { Suspense } from "react";

export default function Page({ params }) {
  return (
    <Suspense fallback={null}>
      <BannerSearchPage params={params} />
    </Suspense>
  );
}
