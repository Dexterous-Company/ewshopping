// import CategoryPageMain from "./categoryPage";

// export default function Page({ params }) {
//   return <CategoryPageMain params={params} />;
// }

import { Suspense } from "react";
import CategoryPageMain from "./categoryPage";

export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryPageMain params={params} />
    </Suspense>
  );
}
