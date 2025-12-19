
import { Suspense } from "react";
import SearchResultMainPage from "./SearchResultMainPage";

export default function SearchResult({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultMainPage params={params} />
    </Suspense>
  );
}
