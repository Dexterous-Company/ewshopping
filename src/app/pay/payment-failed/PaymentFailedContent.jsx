"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get("error");
  const txnid = searchParams.get("txnid");
  const gateway = searchParams.get("gateway");
  const amount = searchParams.get("amount");

  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
 const errorMessages = {
    verification_failed: "Payment verification failed. The transaction could not be verified.",
    server_error: "Server error occurred during payment processing.",
    insufficient_funds: "Insufficient funds in your account.",
    transaction_declined: "Transaction was declined by your bank.",
    network_error: "Network error occurred. Please try again.",
    timeout: "Payment request timed out.",
    default: "Payment failed. Please try again or use a different payment method."
  };

  const getErrorMessage = () => {
    return errorMessages[error] || errorMessages.default;
  };

  const getErrorTitle = () => {
    const titles = {
      verification_failed: "Verification Failed",
      server_error: "Server Error",
      insufficient_funds: "Insufficient Funds",
      transaction_declined: "Transaction Declined",
      network_error: "Network Error",
      timeout: "Timeout",
      default: "Payment Failed"
    };
    return titles[error] || titles.default;
  };

  const handleRetry = () => {
    setLoading(true);
    // Simulate retry process
    setTimeout(() => {
      router.push("/checkout");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{getErrorTitle()}</h1>
            <p className="text-gray-600 mb-6">
              {getErrorMessage()}
            </p>
          </motion.div>

          {/* Transaction Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-xl p-6 mb-6"
          >
            <div className="space-y-3 text-sm">
              {txnid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium text-gray-800">{txnid}</span>
                </div>
              )}
              {amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-800">₹{amount}</span>
                </div>
              )}
              {gateway && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Gateway:</span>
                  <span className="font-medium text-gray-800">{gateway}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-red-600">Failed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium text-gray-800">
                  {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Expandable Error Details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
            >
              {showDetails ? "Hide" : "Show"} Technical Details
              <svg 
                className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-3 bg-red-50 rounded-lg text-left"
              >
                <h4 className="text-sm font-semibold text-red-800 mb-2">Technical Details:</h4>
                <div className="text-xs text-red-700 space-y-1">
                  <p><strong>Error Code:</strong> {error || "UNKNOWN_ERROR"}</p>
                  <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
                  <p><strong>Gateway:</strong> {gateway || "PayU"}</p>
                  <p><strong>Reference:</strong> {txnid || "N/A"}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Common Solutions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-xl p-4 mb-6 text-left"
          >
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Suggested Solutions:</h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Check your internet connection and try again</li>
              <li>Verify your payment details are correct</li>
              <li>Ensure sufficient balance in your account</li>
              <li>Try a different payment method</li>
              <li>Contact your bank if issues persist</li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={handleRetry}
              disabled={loading}
              className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Try Again"
              )}
            </button>

            <Link
              href="/checkout"
              className="bg-white text-gray-700 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-center"
            >
              Back to Checkout
            </Link>

            <Link
              href="/"
              className="bg-transparent text-gray-600 py-3 px-6 rounded-lg hover:text-gray-800 transition-colors font-medium text-center"
            >
              Continue Shopping
            </Link>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-500 mb-2">
              Need immediate assistance?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </Link>
              <span className="text-gray-400 hidden sm:block">•</span>
              <a href="tel:+18001234567" className="text-blue-600 hover:text-blue-700 font-medium">
                Call: +1-800-123-4567
              </a>
              <span className="text-gray-400 hidden sm:block">•</span>
              <a href="mailto:support@ewshopping.com" className="text-blue-600 hover:text-blue-700 font-medium">
                Email Support
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-xs text-gray-500">
            Your payment information is secure. We use SSL encryption to protect your data.
          </p>
        </motion.div>
      </div>
    </div>
  );
}