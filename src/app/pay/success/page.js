"use client";
import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
