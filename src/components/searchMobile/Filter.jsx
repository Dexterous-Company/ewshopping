import { Suspense } from "react";
import FilterMainPage from "./FilterMainPage";

export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FilterMainPage params={params} />
    </Suspense>
  );
}
