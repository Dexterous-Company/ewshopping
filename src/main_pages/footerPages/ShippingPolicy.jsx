"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiFileText } from "react-icons/fi";

const ShippingPolicy = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 sm:mb-0 mb-20 to-white">
      {/* Hero Section */}
      <div className="md:block hidden">
        <div
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765946257504.webp')",
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
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765946313006.webp')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="py-2 flex flex-col lg:flex-row gap-4 sm:gap-6">
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
                  Policy Overview
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
                  Delivery Areas & Serviceability
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
                  Shipping Timeframes
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
                  Shipping Costs
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
                  Order Tracking & Updates
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
                  Important Notes
                </span>
              </button>
            </li>
          </ul>
        </aside>

        {/* Policy Content - Full Document */}
        <main className="lg:w-3/4  p-4 sm:p-2">
          {/* H1 - Main Document Title */}
          <header className="mb-2 sm:mb-4 pb-4 000">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#000] mb-2">
              EW Shopping Shipping & Delivery Policy
            </h1>
            <p className="text-base sm:text-lg mb-1">
              <span className="font-semibold">Last Update:</span>
              <span> Oct, 2025</span>
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Reliable and efficient shipping services across India.
            </p>
          </header>

          {/* Full Document Content - All Sections Visible */}
          <div className="space-y-4 sm:space-y-2">
            {/* Policy Overview */}
            <section
              id="section-0"
              data-index="0"
              ref={(el) => (sectionRefs.current[0] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                Policy Overview
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  At EW Shopping, we are committed to providing reliable and
                  efficient shipping services to ensure your orders reach you
                  safely and on time. This policy outlines our shipping
                  procedures, delivery timelines, and related information.
                </p>
                <p className="mb-2">
                  This policy applies to all orders placed on{" "}
                  <a
                    href="https://www.ewshopping.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    www.ewshopping.com
                  </a>{" "}
                  and the EW Shopping mobile app across India.
                </p>
              </div>
            </section>

            {/* Delivery Areas & Serviceability */}
            <section
              id="section-1"
              data-index="1"
              ref={(el) => (sectionRefs.current[1] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                1. Delivery Areas & Serviceability
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">We currently deliver to:</p>

                <div className="font-semibold text-lg sm:text-xl text-black mt-4 mb-2">
                  1.1 Standard Delivery
                </div>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>All major metropolitan cities</span>
                </div>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Tier 1 & Tier 2 cities</span>
                </div>
                <div className="flex items-start mb-4 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Most Tier 3 cities</span>
                </div>

                <div className="font-semibold text-black mt-4 mb-2 text-lg sm:text-xl">
                  1.2 Extended Delivery
                </div>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Selected remote areas</span>
                </div>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Some border regions</span>
                </div>
                <div className="flex items-start mb-4 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Special economic zones</span>
                </div>

                <p className="text-sm sm:text-base text-black mb-2">
                  <b>Note:</b> Serviceability is automatically checked during
                  checkout. If your pin code is not serviceable, you will be
                  notified before order placement.
                </p>
              </div>
            </section>

            {/* Shipping Timeframes */}
            <section
              id="section-2"
              data-index="2"
              ref={(el) => (sectionRefs.current[2] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-3 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                2. Shipping Timeframes
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  Estimated delivery times for your orders:
                </p>

                <div className="font-semibold text-lg sm:text-xl text-black mt-4 mb-2">
                  2.1 Delivery Options
                </div>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Standard Delivery:</b> 5-7 business days from order
                    confirmation
                  </span>
                </div>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Express Delivery:</b> 2-3 business days from order
                    confirmation (Additional charges apply)
                  </span>
                </div>
                <div className="flex items-start mb-4 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Same Day Delivery:</b> Same day for orders placed before
                    12 PM (Selected pin codes only)
                  </span>
                </div>

                <div className="font-semibold text-black mt-2 mb-2 text-lg sm:text-xl">
                  2.2 Factors Affecting Delivery Time
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Delivery location and pin code serviceability</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Product availability in nearest warehouse</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Weather conditions and unforeseen circumstances</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Public holidays and festivals</span>
                </div>
              </div>
            </section>

            {/* Shipping Costs */}
            <section
              id="section-3"
              data-index="3"
              ref={(el) => (sectionRefs.current[3] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                3. Shipping Costs
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  Understanding delivery charges and free shipping:
                </p>

                <div className="font-semibold text-lg sm:text-xl text-black mt-4 mb-2">
                  3.1 Free Shipping
                </div>
                <p className="mb-4 ml-4">On orders above ₹499 across India</p>

                <div className="font-semibold text-black mt-4 mb-2 text-lg sm:text-xl">
                  3.2 Standard Shipping
                </div>
                <p className="mb-4 ml-4">₹49 for orders below ₹499</p>

                <div className="font-semibold text-black mt-2 mb-2 text-lg sm:text-xl">
                  3.3 Additional Charges
                </div>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Express Delivery: ₹99 additional</span>
                </div>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Same Day Delivery: ₹149 additional</span>
                </div>
                <div className="flex items-start mb-4 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Remote areas: Additional ₹50-100 based on location
                  </span>
                </div>

                <p className="text-sm sm:text-base text-black">
                  <b>Note:</b> All shipping charges are clearly displayed during
                  checkout before payment.
                </p>
              </div>
            </section>

            {/* Order Tracking & Updates */}
            <section
              id="section-4"
              data-index="4"
              ref={(el) => (sectionRefs.current[4] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                4. Order Tracking & Updates
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  How to track your order and stay updated:
                </p>

                <div className="font-semibold text-lg sm:text-xl text-black mt-4 mb-2">
                  4.1 Real-time Tracking
                </div>
                <p className="mb-4 ml-4">
                  Track your order through your EW Shopping account with live
                  updates
                </p>

                <div className="font-semibold text-black mt-4 mb-2 text-lg sm:text-xl">
                  4.2 SMS & Email Alerts
                </div>
                <p className="mb-4 ml-4">
                  Receive automatic updates at key delivery milestones
                </p>

                <div className="font-semibold text-black mt-2 mb-2 text-lg sm:text-xl">
                  4.3 Tracking Steps
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Order Confirmed</b> - Within 2 hours of payment
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Order Shipped</b> - Within 24 hours with tracking number
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Out for Delivery</b> - On the delivery day
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Delivered</b> - Order successfully delivered
                  </span>
                </div>
              </div>
            </section>

            {/* Important Notes */}
            <section
              id="section-5"
              data-index="5"
              ref={(el) => (sectionRefs.current[5] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4 last:border-b-0"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                5. Important Notes
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Delivery attempts will be made twice before returning to
                    warehouse
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Please ensure someone is available at the delivery address
                    during delivery hours
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    In case of failed deliveries, additional shipping charges
                    may apply for re-delivery
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    We are not responsible for delays due to incorrect address
                    or recipient unavailability
                  </span>
                </div>

                <div className="font-semibold text-black mt-4 mb-2 text-lg sm:text-xl">
                  Updates to This Policy
                </div>
                <p className="mb-2">
                  EW Shopping reserves the right to modify or update this
                  Shipping & Delivery Policy from time to time. All changes will
                  be posted on this page with the latest effective date.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <footer className="mt-8 sm:mt-12 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm sm:text-base text-black text-center">
              If you have any questions about this Shipping Policy, please
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

export default ShippingPolicy;