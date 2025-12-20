"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { FiFileText } from "react-icons/fi";

const RefundPolicy = () => {
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
      element.focus({ preventScroll: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 sm:mb-0 mb-20 to-white">
      {/* Hero Section */}
      <div className="md:block hidden">
        <div
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765946423602.webp')",
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
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765946385002.webp')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/4 p-2 sm:p-2 lg:sticky lg:top-8 h-fit">
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
                  Eligibility for Returns
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
                  How to Initiate a Return
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
                  Return Verification Process
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
                  Refund Process and Timeline
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
                  Damaged or Defective Products
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
                  Contact Us
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(8)}
                aria-current={activeSection === 8 ? "true" : undefined}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 8
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText
                  aria-hidden="true"
                  className="mr-2 sm:mr-3 text-[#000]"
                />
                <span className="text-xs sm:text-sm font-medium">
                  Updates to This Policy
                </span>
              </button>
            </li>
          </ul>
        </aside>

        {/* Policy Content - Full Document */}
        <main className="lg:w-3/4 bg-white p-4 sm:p-2">
          {/* H1 - Main Document Title */}
          <header className="mb-2 sm:mb-4 pb-4 000">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#000] mb-2">
              EW Shopping Returns & Refund Policy
            </h1>
            <p className="text-base sm:text-lg mb-1">
              <span className="font-semibold">Last Update:</span>
              <span> Oct, 2025</span>
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Your satisfaction is our priority. This policy outlines our return
              and refund procedures to ensure a seamless experience.
            </p>
          </header>

          {/* Full Document Content - All Sections Visible */}
          <div className="space-y-4 sm:space-y-2">
            {/* Introduction */}
            <section
              id="section-0"
              tabIndex={-1}
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
                  At <b>EW Shopping</b>, your (customer) satisfaction is our
                  priority. We take careful precautions to deliver products that
                  match high-quality standards. If you are not satisfied with
                  your purchased product, this Return & Refund Policy will
                  explain your available options and our process of handling
                  such requests.
                </p>
                <p className="mb-2">
                  This policy applies to all orders placed on{" "}
                  <Link href="/" className="text-blue-600 underline">
                    www.ewshopping.com
                  </Link>{" "}
                  and the EW Shopping mobile app.
                </p>
              </div>
            </section>

            {/* Eligibility for Returns */}
            <section
              id="section-1"
              data-index="1"
              tabIndex={-1}
              ref={(el) => (sectionRefs.current[1] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                1. Eligibility for Returns
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  You may request a return under these conditions:
                </p>

                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    The purchased product must be unused, unworn, and not
                    damaged
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    The product must be intact with its original packaging,
                    price tags, labels, and accessories
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Return requests must be raised within a week of delivery
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Once received purchased product must pass our process of
                    quality inspection
                  </span>
                </div>

                <div className="font-semibold text-lg sm:text-xl text-black mt-4 mb-2">
                  Non-Returnable Items:
                </div>
                <p className="mb-3">
                  The following items cannot be returned due to hygienic and
                  safety concerns:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Beauty and personal care products</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Innerwear, socks, and undergarments</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Customised, personalised, or different products</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Hazardous items and food products</span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>Gift cards, coupons, and online vouchers</span>
                </div>
              </div>
            </section>

            {/* How to Initiate a Return */}
            <section
              id="section-2"
              data-index="2"
              tabIndex={-1}
              ref={(el) => (sectionRefs.current[2] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-3 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                2. How to Initiate a Return
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  Start your return process with these simple steps:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Open your <b>EW Shopping account</b>
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Go to <b>"My Orders"</b> and select the product you want to
                    return
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Click on <b>"Request Return"</b> and give your reason behind
                    the return
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Once your request is generated and verified, our courier
                    partner will schedule pickup within Max. 15 days.
                  </span>
                </div>
                <p className="mt-4 mb-2 text-sm sm:text-base text-black">
                  <b>
                    Make sure the product is packed securely in its original
                    packaging before pickup.
                  </b>
                </p>
              </div>
            </section>

            {/* Return Verification Process */}
            <section
              id="section-3"
              data-index="3"
              tabIndex={-1}
              ref={(el) => (sectionRefs.current[3] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                3. Return Verification Process
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  After receiving your returned product, it will go through a
                  quality check procedure:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>If approved</b>, we will initiate your refund of your
                    payment into the source account within Max.15 days.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>If rejected</b>, the item will be shipped back to your
                    registered address
                  </span>
                </div>
              </div>
            </section>

            {/* Refund Process and Timeline */}
            <section
              id="section-4"
              data-index="4"
              tabIndex={-1}
              ref={(el) => (sectionRefs.current[4] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                4. Refund Process and Timeline
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <div className="font-semibold text-lg sm:text-xl text-black mt-4 mb-2">
                  4.1 Refund Modes
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Prepaid Orders:</b> Refunds will be credited to your
                    original payment method (Card, UPI, or Wallet).
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Cash on Delivery Orders:</b> Refunds will be issued
                    through bank transfer after you share your account details.
                  </span>
                </div>

                <div className="font-semibold text-lg sm:text-xl text-black mt-4 mb-2">
                  4.2 Timeline of Refund:
                </div>
                <p className="mb-4">
                  Refunds are usually processed within Max. 15 days after the
                  product passes our quality inspection. In case of high volume
                  of requests, it may take a little longer.
                </p>

                <div className="font-semibold text-lg sm:text-xl text-black mt-4 mb-2">
                  4.3 Non-Refundable Elements:
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Shipping or convenience fees (if any)</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Charges incurred due to an incorrect or incomplete delivery
                    address
                  </span>
                </div>
              </div>
            </section>

            {/* Damaged or Defective Products */}
            <section
              id="section-5"
              data-index="5"
              tabIndex={-1}
              ref={(el) => (sectionRefs.current[5] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                5. Damaged or Defective Products
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  If you receive a damaged, defective, or wrong product:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Immediately raise a complaint within 2 days of delivery by
                    contacting our customer support team
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Attach clear images of the product, invoice, and packaging
                  </span>
                </div>
                <p className="mt-4 mb-2">
                  After successful verification, we'll arrange an exchange or
                  refund, as per your preference.
                </p>
              </div>
            </section>

            {/* Important Notes */}
            <section
              id="section-6"
              data-index="6"
              tabIndex={-1}
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
                <p className="mb-4">
                  All users must clearly read the following:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Refunds are issued only after successful inspection of
                    returned products
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Returns are dependent on pickup service availability in your
                    delivery area
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    EW Shopping reserves the right to refuse or delay refunds in
                    case of fraudulent, repeated, or invalid claims.
                  </span>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section
              id="section-7"
              data-index="7"
              tabIndex={-1}
              ref={(el) => (sectionRefs.current[7] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                7. Contact Us
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  For any questions related to refunds or returns, please reach
                  out to our customer support team:
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
                    <span className="font-semibold">Hours:</span> 24x7
                  </p>
                  <p className="mb-2 text-sm sm:text-base">
                    <span className="font-semibold">Address:</span> Elderwise
                    Shopping India Pvt. Ltd., Rajendra Place, New Delhi – 110008
                  </p>
                </div>
              </div>
            </section>

            {/* Updates to This Policy */}
            <section
              id="section-8"
              data-index="8"
              tabIndex={-1}
              ref={(el) => (sectionRefs.current[8] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4 last:border-b-0"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText
                  aria-hidden="true"
                  className="mr-3 text-[#000] flex-shrink-0"
                />
                8. Updates to This Policy
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  EW Shopping reserves the right to modify or update this Refund
                  & Return Policy from time to time. All changes will be posted
                  on this page with the latest effective date.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <footer className="mt-8 sm:mt-12 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm sm:text-base text-black text-center">
              If you have any questions about this Returns & Refund Policy,
              please contact us at{" "}
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

export default RefundPolicy;
