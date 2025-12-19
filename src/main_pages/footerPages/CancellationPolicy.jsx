"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { FiFileText } from "react-icons/fi";

const CancellationPolicy = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute("data-index");
            setActiveSection(parseInt(index));
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 sm:mb-0  to-white ">
      {/* Hero Section */}
      <div className="md:block hidden">
        <div
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765946171388.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        ></div>
      </div>
      <div className="md:hidden block">
        <div
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765946131503.webp')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className=" flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar Navigation */}
        <aside
          aria-label="Cancellation policy navigation"
          className="lg:w-1/4 p-2 sm:p-2 lg:sticky lg:top-8 h-fit"
        >
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#000]">
            Quick Navigation
          </h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => scrollToSection(0)}
                aria-current={activeSection === 0 ? "true" : undefined}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 0
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText
                  aria-hidden="true"
                  className="mr-2 sm:mr-3 text-[#000]"
                />
                <span className="text-xs sm:text-sm font-medium">
                  Introduction
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(1)}
                aria-current={activeSection === 1 ? "true" : undefined}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 1
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText
                  aria-hidden="true"
                  className="mr-2 sm:mr-3 text-[#000]"
                />
                <span className="text-xs sm:text-sm font-medium">
                  Eligibility for Cancellation
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(2)}
                aria-current={activeSection === 2 ? "true" : undefined}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 2
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText
                  aria-hidden="true"
                  className="mr-2 sm:mr-3 text-[#000]"
                />
                <span className="text-xs sm:text-sm font-medium">
                  How to Cancel Your Order
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(3)}
                aria-current={activeSection === 3 ? "true" : undefined}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 3
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText
                  aria-hidden="true"
                  className="mr-2 sm:mr-3 text-[#000]"
                />
                <span className="text-xs sm:text-sm font-medium">
                  Refund for Cancelled Orders
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(4)}
                aria-current={activeSection === 4 ? "true" : undefined}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 4
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText
                  aria-hidden="true"
                  className="mr-2 sm:mr-3 text-[#000]"
                />
                <span className="text-xs sm:text-sm font-medium">
                  Exceptions to Cancellation
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(5)}
                aria-current={activeSection === 5 ? "true" : undefined}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 5
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText
                  aria-hidden="true"
                  className="mr-2 sm:mr-3 text-[#000]"
                />
                <span className="text-xs sm:text-sm font-medium">
                  Partial Cancellation
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(6)}
                aria-current={activeSection === 6 ? "true" : undefined}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 6
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText
                  aria-hidden="true"
                  className="mr-2 sm:mr-3 text-[#000]"
                />
                <span className="text-xs sm:text-sm font-medium">
                  Important Notes
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(7)}
                aria-current={activeSection === 7 ? "true" : undefined}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 7
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText
                  aria-hidden="true"
                  className="mr-2 sm:mr-3 text-[#000]"
                />
                <span className="text-xs sm:text-sm font-medium">
                  Need Assistance?
                </span>
              </button>
            </li>
          </ul>
        </aside>

        {/* Policy Content - Full Document */}
        <main className="lg:w-3/4 p-4 sm:p-2">
          {/* H1 - Main Document Title */}
          <header className="mb-2 sm:mb-4 pb-4 000">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#000] mb-2">
              EW Shopping Cancellation Policy
            </h1>
            <p className="text-base sm:text-lg mb-1">
              <span className="font-semibold">Last Update:</span>
              <span> Oct, 2025</span>
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              At EW Shopping, Our Order Cancellation Policy ensures complete
              flexibility while maintaining quick and efficient service for all
              our customers.
            </p>
          </header>

          {/* Full Document Content - All Sections Visible */}
          <div className="space-y-4 sm:space-y-2">
            {/* Introduction */}
            <section
              id="section-0"
              data-index="0"
              ref={(el) => (sectionRefs.current[0] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                Introduction
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  At EW Shopping, we understand that sometimes plans change. Our
                  Order Cancellation Policy ensures complete flexibility while
                  maintaining quick and efficient service for all our customers.
                </p>
              </div>
            </section>

            {/* Eligibility for Cancellation */}
            <section
              id="section-1"
              data-index="1"
              ref={(el) => (sectionRefs.current[1] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                1. Eligibility for Cancellation
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">You can cancel your order if:</p>

                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    The order has <b>not yet been shipped</b> from our warehouse
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    You raise the cancellation request <b>within 24 hours</b> of
                    placing the order or before shipment
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Cancellation request is made directly through your{" "}
                    <b>EW Shopping account</b> or via customer support
                  </span>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <span className="font-semibold text-black mb-2">Note:</span>
                  <span className="text-black">
                    Once your order is shipped, it cannot be cancelled. However,
                    you can still refuse the delivery or apply for a
                    return/refund after receiving the product, as per our Return
                    & Refund Policy.
                  </span>
                </div>
              </div>
            </section>

            {/* How to Cancel Your Order */}
            <section
              id="section-2"
              data-index="2"
              ref={(el) => (sectionRefs.current[2] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                2. How to Cancel Your Order
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  To cancel an order, simply follow these steps:
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start mb-3">
                    <span className="font-bold text-black mr-2">Step 1 .</span>
                    <span className="">
                      Log in to your <b>EW Shopping account</b>
                    </span>
                  </div>
                  <div className="flex items-start mb-3">
                    <span className="font-bold text-black mr-2">Step 2 .</span>
                    <span className="">
                      Go to <b>"My Orders"</b> and select the order you wish to
                      cancel
                    </span>
                  </div>
                  <div className="flex items-start mb-3">
                    <span className="font-bold text-black mr-2">Step 3 .</span>
                    <span className="">
                      Click on the <b>"Cancel Order"</b> button and provide a
                      brief reason
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-black mr-2">Step 4 .</span>
                    <span className="">
                      You will receive a <b>confirmation email/SMS</b> once your
                      cancellation is processed
                    </span>
                  </div>
                </div>

                <p className="mb-2">
                  If the online cancellation option is not available, you can
                  also reach our support team directly for help.
                </p>
              </div>
            </section>

            {/* Refund for Cancelled Orders */}
            <section
              id="section-3"
              data-index="3"
              ref={(el) => (sectionRefs.current[3] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                3. Refund for Cancelled Orders
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  If you've made a prepaid payment (via Credit/Debit Card, UPI,
                  Wallet, or Net Banking), the refund will be processed to your
                  source account within <b>Max. 15 days</b> after confirmation.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <span className="font-semibold text-black mb-2">
                    Refund Processing:
                  </span>
                  <div className="flex items-start mb-1 ml-4">
                    <span className="mr-2">●</span>
                    <span>Credit/Debit Cards: 7-10 business days</span>
                  </div>
                  <div className="flex items-start mb-1 ml-4">
                    <span className="mr-2">●</span>
                    <span>UPI/Wallet: 24-48 hours</span>
                  </div>
                  <div className="flex items-start ml-4">
                    <span className="mr-2">●</span>
                    <span>Net Banking: 3-5 business days</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Exceptions to Cancellation */}
            <section
              id="section-4"
              data-index="4"
              ref={(el) => (sectionRefs.current[4] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                4. Exceptions to Order Cancellation
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  Orders cannot be cancelled under the following circumstances:
                </p>

                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    The order has already been <b>shipped or handed over</b> to
                    the courier partner
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Items that are <b>customised, made-to-order</b>,{" "}
                    <b>or fall under non-returnable categories</b> such as{" "}
                    <b>innerwear, hygiene products, or personal care items</b>
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    The order is under a <b>flash sale, clearance sale</b>,{" "}
                    <b>
                      or any limited-time promotional offer where cancellation
                      is not applicable
                    </b>
                  </span>
                </div>
              </div>
            </section>

            {/* Partial Cancellation */}
            <section
              id="section-5"
              data-index="5"
              ref={(el) => (sectionRefs.current[5] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                5. Partial Cancellation
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  If you ordered more than one product, you can{" "}
                  <b>partially cancel</b> one or more of them as long as they
                  haven't shipped.
                </p>
                <p className="mb-2">
                  Once confirmed, you'll receive a <b>revised invoice</b> and an{" "}
                  <b>updated order summary</b>.
                </p>
              </div>
            </section>

            {/* Important Notes */}
            <section
              id="section-6"
              data-index="6"
              ref={(el) => (sectionRefs.current[6] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                6. Important Notes
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    EW Shopping reserves the right to cancel orders due to
                    unforeseen circumstances such as{" "}
                    <b>
                      stock unavailability, payment failure, or technical errors
                    </b>
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    In such cases, the{" "}
                    <b>entire amount will be refunded automatically</b> to your
                    original payment method
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Customers will be notified promptly via{" "}
                    <b>Email/WhatsApp SMS</b> in case of any unexpected
                    cancellation
                  </span>
                </div>
              </div>
            </section>

            {/* Need Assistance? */}
            <section
              id="section-7"
              data-index="7"
              ref={(el) => (sectionRefs.current[7] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4 last:border-b-0"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                7. Need Assistance?
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  If you face any issues while cancelling your order, contact
                  our customer support team at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2 text-sm sm:text-base">
                    <span className="font-semibold">Email:</span>
                    <a
                      href="mailto:support@ewshopping.com"
                      className="text-blue-600 underline ml-2"
                    >
                      support@ewshopping.com
                    </a>
                  </p>
                  <p className="mb-2 text-sm sm:text-base">
                    <span className="font-semibold">Phone:</span> +91 8447282606
                  </p>
                  <p className="mb-2 text-sm sm:text-base">
                    <span className="font-semibold">Hours:</span> 24x7 available
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <footer className="mt-8 sm:mt-12 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm sm:text-base text-black text-center">
              If you have any questions about this Cancellation Policy, please
              contact us at{" "}
              <a
                href="mailto:support@ewshopping.com"
                className="text-blue-600 underline font-semibold hover:underline"
              >
                support@ewshopping.com
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default CancellationPolicy;
