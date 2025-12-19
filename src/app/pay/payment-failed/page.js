"use client";
import { Suspense } from "react";
import PaymentFailedContent from "./PaymentFailedContent";

export default function PaymentFailed() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
