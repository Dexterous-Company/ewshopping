import BrandMainPage from "@/main_pages/Brand/BrandMainPage";
import { Suspense } from "react";

function page({ params }) {
  const parsedParams = JSON.parse(JSON.stringify(params));
  return (
    <>
      <Suspense fallback={null}>
        <BrandMainPage params={parsedParams} />
      </Suspense>
    </>
  );
}

export default page;
