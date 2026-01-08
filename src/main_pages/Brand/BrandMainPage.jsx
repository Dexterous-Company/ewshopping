import { Suspense } from "react";
import BrandMainNewPage from "./BrandMainNewPage";

export default function BrandMainPage({ params }) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading brand...</div>}>
      <BrandMainNewPage params={params} />
    </Suspense>
  );
}