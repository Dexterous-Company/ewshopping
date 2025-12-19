"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { FiFileText } from "react-icons/fi";

const TermsAndConditions = () => {
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
      <div className="md:block hidden mt-2">
        <div
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center  justify-center "
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765887592708.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center ",
          }}
        ></div>
      </div>
      <div className="md:hidden block">
        <div
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765944876689.webp')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
        ></div>
      </div>
      {/* Main Content */}
      <div className=" flex flex-col lg:flex-row gap-4 sm:gap-6">
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
                  Definitions
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
                  Eligibility
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
                  Account Responsibility
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
                  Product Information
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
                  Pricing and Payment
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
                  Shipping and Delivery
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(7)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 7
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Returns, Refunds, Exchanges and Cancellations
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(8)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 8
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Intellectual Property
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(9)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 9
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  User Conduct
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(10)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 10
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Third-Party Links
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(11)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 11
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Limitation of Liability
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(12)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 12
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Termination of Access
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(13)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 13
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Governing Law and Jurisdiction
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(14)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 14
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Updates to Terms
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection(15)}
                className={`w-full flex items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                  activeSection === 15
                    ? "bg-blue-100 text-[#000] border-l-4 border-[#000]"
                    : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                }`}
              >
                <FiFileText className="mr-2 sm:mr-3 text-[#000]" />
                <span className="text-xs sm:text-sm font-medium">
                  Contact Us
                </span>
              </button>
            </li>
          </ul>
        </aside>

        {/* Policy Content - Full Document */}
        <main className="lg:w-3/4   p-4 sm:p-2">
          {/* H1 - Main Document Title */}
          <header className="mb-2 sm:mb-4 pb-4 000">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#000] mb-2">
              EW Shopping Terms & Conditions
            </h1>
            <p className="text-base sm:text-lg mb-1">
              <span className="font-semibold">Last Update:</span>
              <span> Oct, 2025</span>
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Welcome to <b>EW Shopping</b>, a brand owned and operated by{" "}
              <b>Elderwise Shopping India Pvt. Ltd.</b> By accessing or using
              our website{" "}
              <Link href="/" className="text-blue-600 underline">
                www.ewshopping.com
              </Link>
              , you agree to these Terms & Conditions. Please read them
              carefully before using our services.
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
                <p className="mb-4">
                  EW Shopping is India's{" "}
                  <b>
                    most trusted e-commerce platform offering fashion,
                    lifestyle, electronics, home essentials and more.
                  </b>{" "}
                  By visiting our website or placing an order, you agree to the
                  following terms, which govern your access, use, and
                  interaction with our platform.
                </p>
                <p className="mb-2">
                  If you do not agree to these terms, please refrain from using
                  our website or services.
                </p>
              </div>
            </section>

            {/* Definitions */}
            <section
              id="section-1"
              data-index="1"
              ref={(el) => (sectionRefs.current[1] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                1. Definitions
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>"Website"</b> refers to www.ewshopping.com.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>"User"</b>, <b>"You"</b>, or <b>"Customer"</b> refers to
                    any individual accessing or making a purchase through the
                    Website.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>"We"</b>, <b>"Us"</b>, or <b>"Our"</b> refers to{" "}
                    <b>Elderwise Shopping India Pvt. Ltd.,</b> operating under
                    the brand name <b>EW Shopping.</b>
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>"Products"</b> refer to any items listed, sold, or
                    delivered through the Website.
                  </span>
                </div>
              </div>
            </section>

            {/* Eligibility */}
            <section
              id="section-2"
              data-index="2"
              ref={(el) => (sectionRefs.current[2] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-3 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                2. Eligibility
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">To use EW Shopping, you must:</p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Be at least 18 years old</b> or access the website under
                    the supervision of a parent or legal guardian.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Provide accurate, complete, and up-to-date personal details.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Do not use the site for any illegal or unauthorised purpose.
                  </span>
                </div>
                <p className="mt-4">
                  We reserve the right to terminate or restrict access to any
                  user account found in violation of our policies.
                </p>
              </div>
            </section>

            {/* Account Responsibility */}
            <section
              id="section-3"
              data-index="3"
              ref={(el) => (sectionRefs.current[3] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                3. Account Responsibility
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  When you create your account with EW Shopping, you are
                  responsible for:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Maintaining the <b>confidentiality</b> of your login
                    credentials.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    All activities are conducted{" "}
                    <b>under your registered account.</b>
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Notifying us immediately in case of any{" "}
                    <b>unauthorised access or misuse.</b>
                  </span>
                </div>
                <p className="mt-4">
                  EW Shopping shall not be liable for any loss or damage
                  resulting from your failure to protect your account details.
                </p>
              </div>
            </section>

            {/* Product Information */}
            <section
              id="section-4"
              data-index="4"
              ref={(el) => (sectionRefs.current[4] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                4. Product Information
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  We try our best to provide accurate and updated product
                  details, including descriptions, pricing, and availability.
                  However, minor variations may occur due to photos, lighting,
                  or display settings.
                </p>
                <p className="mb-4">EW Shopping reserves the right to:</p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Modify product information at any time without notice.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Correct any grammatical or pricing errors.</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Discontinue products or categories based on stock or vendor
                    availability.
                  </span>
                </div>
              </div>
            </section>

            {/* Pricing and Payment */}
            <section
              id="section-5"
              data-index="5"
              ref={(el) => (sectionRefs.current[5] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                5. Pricing and Payment
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  All prices listed on EW Shopping are in Indian Rupees (₹)
                  (INR) and inclusive of applicable taxes.
                </p>
                <p className="mb-4">
                  We accept multiple payment modes, including:
                </p>
                <div className="flex items-start mb-2 ml-4 font-bold">
                  <span className="mr-2">●</span>
                  <span>Credit/Debit Cards</span>
                </div>
                <div className="flex items-start mb-2 ml-4 font-bold">
                  <span className="mr-2">●</span>
                  <span>Net Banking</span>
                </div>
                <div className="flex items-start mb-4 ml-4 font-bold">
                  <span className="mr-2">●</span>
                  <span>UPI & Wallets</span>
                </div>
                <p>
                  In case of any payment failure or transaction issue, EW
                  Shopping reserves the right to cancel the order and issue a
                  refund as per the Refund Policy.
                </p>
              </div>
            </section>

            {/* Shipping and Delivery */}
            <section
              id="section-6"
              data-index="6"
              ref={(el) => (sectionRefs.current[6] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                6. Shipping and Delivery
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  Delivery dates may vary{" "}
                  <b>depending on location, product type, and availability.</b>
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Orders are generally processed <b>within a week.</b>
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Shipping updates and tracking details are provided{" "}
                    <b> via WhatsApp SMS and Email.</b>
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    In rare cases of delay due to unexpected events, we'll keep
                    you updated promptly.
                  </span>
                </div>
              </div>
            </section>

            {/* Returns, Refunds, Exchanges and Cancellations */}
            <section
              id="section-7"
              data-index="7"
              ref={(el) => (sectionRefs.current[7] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                7. Returns, Refunds, Exchanges and Cancellations
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  EW Shopping follows a transparent and customer-friendly
                  <b>Return</b>, <b>Refund</b>, <b>Exchange</b>, and{" "}
                  <b>Cancellation Policy</b>. Please refer to our individual
                  policy pages for complete details:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <Link
                    href="/refundpolicy"
                    className="text-blue-600 underline"
                  >
                    Refund & Return Policy
                  </Link>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <Link
                    href="/exchangepolicy"
                    className="text-blue-600 underline"
                  >
                    Exchange Policy
                  </Link>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <Link
                    href="/cancellationpolicy"
                    className="text-blue-600 underline"
                  >
                    Order Cancellation Policy
                  </Link>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <Link
                    href="/privacypolicy"
                    className="text-blue-600 underline"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section
              id="section-8"
              data-index="8"
              ref={(el) => (sectionRefs.current[8] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                8. Intellectual Property
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  All information available on EW Shopping, including{" "}
                  <b>text</b>,<b>graphics</b>, <b>logos</b>,{" "}
                  <b>product images</b>, <b>design, and software</b>, is the
                  exclusive property of Elderwise Shopping India Pvt. Ltd. or
                  its affiliates.
                </p>
                <p className="mb-4">You may not:</p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Copy, reuse, distribute, or exploit any part of the website
                    without prior authorised consent.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Use our trademarks or brand assets for commercial purposes
                    without authorisation.
                  </span>
                </div>
              </div>
            </section>

            {/* User Conduct */}
            <section
              id="section-9"
              data-index="9"
              ref={(el) => (sectionRefs.current[9] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                9. User Conduct
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  While using EW Shopping, you agree not to:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Engage in fraudulent transactions or provide false
                    information.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Attempt to gain unauthorised access to our systems.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Upload or share harmful content such as viruses, spam, or
                    malicious code.
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Post defamatory or abusive comments about our brand or other
                    customers.
                  </span>
                </div>
                <p>
                  Violations may result in immediate account suspension or legal
                  action.
                </p>
              </div>
            </section>

            {/* Third-Party Links */}
            <section
              id="section-10"
              data-index="10"
              ref={(el) => (sectionRefs.current[10] = el)}
              className="scroll-mt-20 000 pb-4 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                10. Third-Party Links
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  EW Shopping may contain links to third-party websites or
                  services for your convenience. We do not control or recommend
                  these external platforms and are not responsible for their
                  content, privacy practices, or policies.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section
              id="section-11"
              data-index="11"
              ref={(el) => (sectionRefs.current[11] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                11. Limitation of Liability
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">EW Shopping is not responsible for:</p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Indirect, accidental, or related damages resulting from
                    product use or website access.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Delays or failures due to events beyond our fair control.
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Our maximum liability, under any circumstances, shall be
                    limited to the amount paid for the order in question.
                  </span>
                </div>
              </div>
            </section>

            {/* Termination of Access */}
            <section
              id="section-12"
              data-index="12"
              ref={(el) => (sectionRefs.current[12] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                12. Termination of Access
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  We may suspend or terminate your account if we suspect any
                  unauthorised, illegal, or abusive behaviour. You may also
                  deactivate your account anytime by contacting the customer
                  support team.
                </p>
              </div>
            </section>

            {/* Governing Law and Jurisdiction */}
            <section
              id="section-13"
              data-index="13"
              ref={(el) => (sectionRefs.current[13] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                13. Governing Law and Jurisdiction
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  These Terms & Conditions are{" "}
                  <b>governed by the laws of India,</b>
                  and any disputes shall be subject to the exclusive
                  jurisdiction of the courts in New Delhi, India.
                </p>
              </div>
            </section>

            {/* Updates to Terms */}
            <section
              id="section-14"
              data-index="14"
              ref={(el) => (sectionRefs.current[14] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                14. Updates to Terms
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  EW Shopping reserves the right to modify these Terms &
                  Conditions at any time. All updates will be posted on this
                  page, and continued use of the website indicates your
                  acceptance of such changes.
                </p>
              </div>
            </section>

            {/* Contact Us */}
            <section
              id="section-15"
              data-index="15"
              ref={(el) => (sectionRefs.current[15] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4 last:border-b-0"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                15. Contact Us
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  If you have any queries regarding these Terms, please reach
                  out to us at:
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
              If you have any questions about these Terms & Conditions, please
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

export default TermsAndConditions;
