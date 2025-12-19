

import { Suspense } from "react";
import HorizontalFilterMain from "./HorizontalFilterMain";

export default function HorizontalFilterScroll({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HorizontalFilterMain params={params} />
    </Suspense>
  );
}
