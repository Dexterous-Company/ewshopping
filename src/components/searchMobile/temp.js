import { Suspense } from "react";
import TempMainPage from "./tempMainPage";

export default function DesktopFilter({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TempMainPage params={params} />
    </Suspense>
  );
}
