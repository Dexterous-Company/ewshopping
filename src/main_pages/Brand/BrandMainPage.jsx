import { Suspense } from "react";
import BrandMainNewPage from "./BrandMainNewPage";

export default function BrandMainPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrandMainNewPage params={params} />
    </Suspense>
  );
}
