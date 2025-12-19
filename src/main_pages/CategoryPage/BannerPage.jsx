import { Suspense } from "react";
import BannerPageMain from "./BannerPageMain";

export default function SearchPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BannerPageMain params={params} />
    </Suspense>
  );
}
