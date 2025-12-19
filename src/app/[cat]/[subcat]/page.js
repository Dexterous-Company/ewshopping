// import Subcatmain from "./Subcategory";

// export default function Page({ params }) {
//   return <Subcatmain params={params} />;
// }

import { Suspense } from "react";
import Subcatmain from "./Subcategory";

export default function Page({ params }) {
  return (
    <Suspense fallback={null}>
      <Subcatmain params={params} />
    </Suspense>
  );
}
