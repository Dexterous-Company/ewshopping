
import { Suspense } from "react";
import CatTagPage from "./categoryTag";

export default function Page({ params }) {
  return (
    <Suspense fallback={null}>
      <CatTagPage params={params} />
    </Suspense>
  );
}
