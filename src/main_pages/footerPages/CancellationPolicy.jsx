"use client";
import React, { useState } from "react";
import {
  FiFileText,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiMail,
  FiPhone,
  FiClock,
} from "react-icons/fi";

const CancellationPolicy = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const policySections = [
    {
      title: "Eligibility for Cancellation",
      content: `You can cancel your order if:

• The order has not yet been shipped from our warehouse
• You raise the cancellation request within 24 hours of placing the order or before shipment
• Cancellation request is made directly through your EW Shopping account or via customer support

Once your order is shipped, it cannot be cancelled. However, you can still refuse the delivery or apply for a return/refund after receiving the product, as per our Return & Refund Policy.`,
    },
    {
      title: "How to Cancel Your Order",
      content: `To cancel an order, simply follow these steps:

Step 1. Log in to your EW Shopping account.

Step 2. Go to "My Orders" and select the order you wish to cancel.

Step 3. Click on the "Cancel Order" button and provide a brief reason.

Step 4. You will receive a confirmation email/SMS once your cancellation is processed.

If the online cancellation option is not available, you can also reach our support team directly for help.`,
    },
    {
      title: "Refund for Cancelled Orders",
      content: `If you've made a prepaid payment (via Credit/Debit Card, UPI, Wallet, or Net Banking), the refund will be processed to your source account within Max. 15 days after confirmation.`,
    },
    {
      title: "Exceptions to Order Cancellation",
      content: `Orders cannot be cancelled under the following circumstances:

• The order has already been shipped or handed over to the courier partner
• Items that are customised, made-to-order, or fall under non-returnable categories such as innerwear, hygiene products, or personal care items
• The order is under a flash sale, clearance sale, or any limited-time promotional offer where cancellation is not applicable`,
    },
    {
      title: "Partial Cancellation",
      content: `If you ordered more than one product, you can partially cancel one or more of them as long as they haven't shipped.

Once confirmed, you'll receive a revised invoice and an updated order summary.`,
    },
    {
      title: "Important Notes",
      content: `• EW Shopping reserves the right to cancel orders due to unforeseen circumstances such as stock unavailability, payment failure, or technical errors

• In such cases, the entire amount will be refunded automatically to your original payment method

• Customers will be notified promptly via Email/WhatsApp SMS in case of any unexpected cancellation`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white sm:mb-0 mb-20">
      {/* Hero Banner */}
      <div
        className="w-full h-32 sm:h-40 md:h-64 bg-no-repeat bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/Cancelation policy.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      ></div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-12 flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/4 sm:block hidden bg-white rounded-xl shadow-md p-4 sm:p-6 sticky top-8 h-fit">
          <h2 className="text-sm sm:text-lg font-semibold mb-4 text-[#2f415d]">
            Quick Navigation
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="#introduction"
                className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              >
                <FiFileText className="mr-2 text-[#2f415d] text-sm" />
                <span className="text-xs sm:text-sm">Introduction</span>
              </a>
            </li>
            {policySections.map((section, i) => (
              <li key={i}>
                <button
                  onClick={() => toggleSection(i)}
                  className={`w-full flex justify-between items-center text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    openSection === i
                      ? "bg-blue-100 text-[#2f415d] border-l-4 border-[#2f415d]"
                      : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center">
                    <FiFileText className="mr-2 text-[#2f415d] text-sm" />
                    <span className="text-xs sm:text-sm font-medium">
                      {section.title}
                    </span>
                  </div>
                  {openSection === i ? (
                    <FiChevronUp size={14} className="text-[#2f415d]" />
                  ) : (
                    <FiChevronDown size={14} className="text-[#2f415d]" />
                  )}
                </button>
              </li>
            ))}
            <li>
              <a
                href="#assistance"
                className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              >
                <FiFileText className="mr-2 text-[#2f415d] text-sm" />
                <span className="text-xs sm:text-sm">Need Assistance?</span>
              </a>
            </li>
          </ul>
        </aside>

        {/* Policy Content */}
        <main className="lg:w-3/4 bg-white rounded-xl shadow-md p-4 sm:p-8">
          {/* Introduction Section */}
          <section
            id="introduction"
            className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200"
          >
            <h2 className="text-lg sm:text-2xl font-bold text-[#2f415d] mb-3 sm:mb-4">
              EW Shopping Cancellation Policy
            </h2>
            <p className="text-xs sm:text-base text-gray-700 leading-relaxed">
              At EW Shopping, Our Order Cancellation Policy ensures complete
              flexibility while maintaining quick and efficient service for all
              our customers.
            </p>
          </section>

          {/* Policy Sections */}
          <div className="space-y-4 sm:space-y-6">
            {policySections.map((section, i) => (
              <section
                key={i}
                id={section.title.toLowerCase().replace(/\s+/g, "-")}
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleSection(i)}
                  className="w-full flex justify-between items-center text-left p-3 sm:p-6 hover:bg-gray-50 rounded-lg"
                >
                  <h3 className="text-sm sm:text-lg font-semibold text-[#2f415d] flex items-center">
                    <FiFileText className="mr-2 sm:mr-3 text-[#2f415d] text-sm" />
                    {section.title}
                  </h3>
                  {openSection === i ? (
                    <FiChevronUp size={16} className="text-[#2f415d]" />
                  ) : (
                    <FiChevronDown size={16} className="text-[#2f415d]" />
                  )}
                </button>
                {openSection === i && (
                  <div className="px-3 sm:px-6 pb-3 sm:pb-6 animate-fade-in">
                    <div className="text-gray-700 whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                      {section.content.split("\n").map((line, index) => {
                        if (
                          line.trim().startsWith("•") ||
                          line.trim().startsWith("-")
                        ) {
                          return (
                            <div key={index} className="flex items-start mb-2">
                              <span className="mr-2 text-[#2f415d] text-xs">
                                •
                              </span>
                              <span className="text-xs sm:text-sm">
                                {line.substring(1).trim()}
                              </span>
                            </div>
                          );
                        } else if (line.trim().startsWith("Step")) {
                          return (
                            <div key={index} className="flex items-start mb-2">
                              <span className="font-semibold text-[#2f415d] min-w-12 sm:min-w-16 text-xs sm:text-sm">
                                {line.split(".")[0]}.
                              </span>
                              <span className="text-xs sm:text-sm">
                                {line.split(".").slice(1).join(".").trim()}
                              </span>
                            </div>
                          );
                        } else if (line.trim() === "") {
                          return <br key={index} />;
                        } else {
                          return (
                            <p key={index} className="mb-3 text-xs sm:text-sm">
                              {line}
                            </p>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Assistance Section */}
          <section
            id="assistance"
            className="mt-6 sm:mt-10 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
          >
            <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-[#2f415d] flex items-center">
              <FiFileText className="mr-2 text-sm" />
              Need Assistance?
            </h3>
            <p className="text-gray-700 mb-4 text-xs sm:text-sm">
              If you face any issues while cancelling your order, contact our
              customer support team:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center p-3 bg-white rounded-lg">
                <FiMail className="text-[#2f415d] mr-3 text-sm" />
                <div>
                  <p className="font-semibold text-xs sm:text-sm">Email</p>
                  <a
                    href="mailto:support@ewshopping.com"
                    className="text-blue-600 hover:underline text-xs sm:text-sm"
                  >
                    support@ewshopping.com
                  </a>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white rounded-lg">
                <FiPhone className="text-[#2f415d] mr-3 text-sm" />
                <div>
                  <p className="font-semibold text-xs sm:text-sm">Phone</p>
                  <a
                    href="tel:+918447282606"
                    className="text-blue-600 hover:underline text-xs sm:text-sm"
                  >
                    +91 8447282606
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center p-3 bg-white rounded-lg">
              <FiClock className="text-[#2f415d] mr-3 text-sm" />
              <p className="font-semibold text-xs sm:text-sm">
                Hours: 24x7 available
              </p>
            </div>
          </section>

          {/* Quick Summary */}
          <div className="mt-6 sm:mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">
              Quick Summary
            </h4>
            <ul className="text-xs sm:text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>Cancel within 24 hours or before shipment</li>
              <li>Refunds processed within 15 days</li>
              <li>Partial cancellation available for multi-item orders</li>
              <li>24/7 customer support available</li>
            </ul>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CancellationPolicy;
