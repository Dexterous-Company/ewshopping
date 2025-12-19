import { Suspense } from "react";
import CategoryPageMain from "./CategoryPageMain";

export default function CategoryPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryPageMain params={params} />
    </Suspense>
  );
}

