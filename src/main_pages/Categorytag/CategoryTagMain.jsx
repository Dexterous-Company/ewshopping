import { Suspense } from "react";
import CategoryTagScreenMainImp from "./CategoryTagScreenMainImp";

export default function SearchPage({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryTagScreenMainImp params={params} />
    </Suspense>
  );
}
