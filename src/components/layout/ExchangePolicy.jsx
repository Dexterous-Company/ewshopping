"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { FiFileText } from "react-icons/fi";

const ExchangePolicy = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 sm:mb-0 mb-20  to-white">
      {/* Hero Section */}
      <div className="md:block hidden">
        <div
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765945490611.webp')",
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
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765945415332.webp')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className=" flex flex-col lg:flex-row gap-4 sm:gap-6 my-2">
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/4 p-2 sm:p-2 lg:sticky lg:top-8 h-fit">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#000]">
            Quick Navigation
          </h2>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => scrollToSection(0)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 0
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Introduction
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(1)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 1
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Eligibility for Exchange
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(2)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 2
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  How to Request an Exchange
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(3)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 3
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Terms & Conditions
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(4)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 4
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Exchange Timeline
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(5)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 5
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Self-Ship Option
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(6)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 6
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
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
              EW Shopping Exchange Policy
            </h1>
            <p className="text-base sm:text-lg mb-1">
              <span className="font-semibold">Last Update:</span>
              <span> Oct, 2025</span>
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              If you received a product that does not fit your expectations, our
              Exchange Policy makes it simple and stress-free to get you the
              right product.
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
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                Introduction
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4 text-sm sm:text-base font-medium bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  "As of now, we are not providing exchanges on any of the
                  purchased products from our website and mobile application. We
                  will soon start this service for customers."
                </p>
                <p className="mb-2">
                  If you received a product that does not fit your expectations,
                  our Exchange Policy makes it simple and stress-free to get you
                  the right product.
                </p>
              </div>
            </section>

            {/* Eligibility for Exchange */}
            <section
              id="section-1"
              data-index="1"
              ref={(el) => (sectionRefs.current[1] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                1. Eligibility for Exchange
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">You can request for an exchange if:</p>

                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    The product is <b>defective</b>, <b>damaged</b>, or{" "}
                    <b>different</b> from your initial order
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>The size or colour does not match your preference</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    The exchange request is raised within the time period of
                    7-10 days of delivery
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    The product is unused, unwashed, and returned in its
                    original condition (with tags, packaging, and accessories)
                  </span>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <span className="font-semibold text-black mb-2">Note:</span>
                  <span className="text-black">
                    {" "}
                    Products including innerwear, cosmetics, personal hygiene,
                    and custom-made products are{" "}
                    <b>not eligible for exchange</b>.
                  </span>
                </div>
              </div>
            </section>

            {/* How to Request an Exchange */}
            <section
              id="section-2"
              data-index="2"
              ref={(el) => (sectionRefs.current[2] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-3 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                2. How to Request an Exchange
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  Follow these steps to request an exchange for your product:
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-2">
                  <div className="flex items-start mb-3">
                    <span className="font-bold text-black mr-2">Step 1 .</span>
                    <span className="">
                      Open your <b>EW Shopping account</b>
                    </span>
                  </div>
                  <div className="flex items-start mb-3">
                    <span className="font-bold text-black mr-2">Step 2 .</span>
                    <span className="">
                      Go to <b>"My Orders"</b> and choose the product you want
                      to exchange
                    </span>
                  </div>
                  <div className="flex items-start mb-3">
                    <span className="font-bold text-black mr-2">Step 3 .</span>
                    <span className="">
                      Select the <b>"Exchange"</b> option and specify the reason
                      for return
                    </span>
                  </div>
                  <div className="flex items-start mb-3">
                    <span className="font-bold text-black mr-2">Step 4 .</span>
                    <span className="">
                      Select preferred size, colour, variant (if available)
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold text-black mr-2">Step 5 .</span>
                    <span className="">
                      Confirm your request and wait for pickup scheduling by our
                      courier partner
                    </span>
                  </div>
                </div>

                <span className="mb-2">
                  Once the product is picked up and passes the quality check,
                  we'll dispatch the replacement product within Max. 15 days.
                </span>
              </div>
            </section>

            {/* Terms & Conditions */}
            <section
              id="section-3"
              data-index="3"
              ref={(el) => (sectionRefs.current[3] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                3. Terms & Conditions
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Exchanges are allowed <b>only once per order</b>
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    The product must pass <b>our quality inspection</b> before
                    approval
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    If the desired product is out of stock, you will be given
                    the <b>option for a refund instead</b>
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    EW Shopping reserves the{" "}
                    <b>right to decline exchange requests</b> that{" "}
                    <b>do not comply with our policies</b>
                  </span>
                </div>
              </div>
            </section>

            {/* Exchange Timeline */}
            <section
              id="section-4"
              data-index="4"
              ref={(el) => (sectionRefs.current[4] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                4. Exchange Timeline
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <span className="font-semibold">Pickup time:</span> Within 7
                    - 10 days after approval from our side
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <span className="font-semibold">
                      Quality check & dispatch:
                    </span>{" "}
                    Max. 15 days after pickup
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    You'll receive real-time updates via{" "}
                    <b>WhatsApp SMS or Email</b>
                    regarding the stage of the exchange process
                  </span>
                </div>
              </div>
            </section>

            {/* Self-Ship Option */}
            <section
              id="section-5"
              data-index="5"
              ref={(el) => (sectionRefs.current[5] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                5. Self-Ship Option
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  If your location <b>is not serviceable for pickup</b>, you may
                  need to <b>self-ship the product</b> to the provided address
                  by our support team. Once received and verified, your
                  replacement product will be sent immediately.
                </p>
              </div>
            </section>

            {/* Need Assistance? */}
            <section
              id="section-6"
              data-index="6"
              ref={(el) => (sectionRefs.current[6] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4 last:border-b-0"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                6. Need Assistance?
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  For queries or assistance with your exchange request, contact
                  us at:
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
              If you have any questions about this Exchange Policy, please
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

export default ExchangePolicy;
