import { Suspense } from "react";
import DesktopFilterMain from "./DesktopFilterMain";

export default function DesktopFilter({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DesktopFilterMain params={params} />
    </Suspense>
  );
}
