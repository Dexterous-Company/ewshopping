import SellerProductWrapper from "../../main_pages/sellerProduct/SellerProductWrapper";
import { Suspense } from "react";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading seller products...</div>}>
      <SellerProductWrapper />
    </Suspense>
  );
}
