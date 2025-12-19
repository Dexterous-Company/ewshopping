import { Suspense } from "react";
import ProductTagsMainPage from "./ProductTagsMainPage";

export default function SearchPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductTagsMainPage params={params} />
    </Suspense>
  );
}
