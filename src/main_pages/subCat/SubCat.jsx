import { Suspense } from "react";
import SubCatMain from "./SubCatMain";

export default function SubCat({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading products...
        </div>
      }
    >
      <SubCatMain params={params} />
    </Suspense>
  );
}
