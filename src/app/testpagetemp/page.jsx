import { Suspense } from "react";
import TestPageTempMainPage from "@/main_pages/SearchOptimization/TestPageTempMainPage";

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestPageTempMainPage />
    </Suspense>
  );
};

export default SearchPage;