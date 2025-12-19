"use client";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { FiFileText } from "react-icons/fi";

const PrivacyPolicy = () => {
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
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center bg-cover "
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765886038154.webp')",
           // backgroundSize: "contain",
           // backgroundPosition: "center center",
          }}
        ></div>
      </div>
      <div className="md:hidden block">
        <div
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765944710368.webp')",
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
                  Information/Data we collect
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
                  Purpose of Data Collection
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
                  Cookies and Tracking Technologies
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
                  Data Security
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
                  Data Retention
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
                  Sharing of Information
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
                  Your Rights
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
                  Privacy Policy for children and minors
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
                  External Links
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
                  Responsibility limitations
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
                  Jurisdiction and Governing Law
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
                  Updates in this Privacy Policy
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
                  Grievance Settlement & Contact Information
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
              EW Shopping Privacy Policy
            </h1>
            <p className="text-base sm:text-lg mb-1">
              <span className="font-semibold">Last Update:</span>
              <span> Oct, 2025:</span>
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Protecting your privacy is our priority. This policy outlines how
              we collect, use, and safeguard your information.
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
                  This Privacy Policy explains how <b>EW Shopping</b>, operating
                  under the company name{" "}
                  <b>
                    Elderwise Shopping India Pvt. Ltd. ("Company", "we", "us",
                    or "our")
                  </b>
                  , collects, uses, discloses and safeguards your personal
                  data/information whenever you visit or purchase through our
                  website{" "}
                  <Link href="/" className="text-blue-600 underline">
                    www.ewshopping.com
                  </Link>{" "}
                  and mobile application.
                </p>
                <p className="mb-2">
                  By using our platform, you confirm that you have read,
                  understood, and agree to the standards described in this
                  Privacy Policy.
                </p>
              </div>
            </section>

            {/* Information/Data we collect */}
            <section
              id="section-1"
              data-index="1"
              ref={(el) => (sectionRefs.current[1] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                1. Information/Data we collect
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  We may collect and process the following information/data to
                  provide and improve our services:
                </p>

                <div className="font-semibold text-lg sm:text-xl text-black mt-4 mb-2">
                  1.1 Personal Information
                </div>
                <p className="mb-3">
                  We may collect information that defines personal identity.
                  This may include:
                </p>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Full Name</span>
                </div>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Contact details (Email, address (billing & shipping), phone
                    number)
                  </span>
                </div>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Gender, D.O.B (if provided)</span>
                </div>
                <div className="flex items-start mb-4 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Payment information (through 3rd party gateways)</span>
                </div>

                <div className="font-semibold text-black mt-4 mb-2 text-lg sm:text-xl">
                  1.2 Non-personal Information
                </div>
                <p className="mb-3">
                  We may collect information that does not directly identify
                  you, including:
                </p>
                <div className="flex items-start mb-2 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>Browser type & IP address</span>
                </div>
                <div className="flex items-start mb-4 font-bold ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Website usage data, include visited pages and duration
                  </span>
                </div>

                <div className="font-semibold text-black mt-2 mb-2 text-lg sm:text-xl">
                  1.3 Information from 3rd parties
                </div>
                <p className="mb-2">
                  We may collect data from marketing partners, analytics
                  providers and social media channels to improve our services
                  and personalise your experience.
                </p>
              </div>
            </section>

            {/* Purpose of Data Collection */}
            <section
              id="section-2"
              data-index="2"
              ref={(el) => (sectionRefs.current[2] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-3 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                2. Purpose of Data Collection
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  Your information and data are collected and processed only for
                  legitimate business purposes, including:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Processing, shipping, and delivering orders</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Managing your EW Shopping account</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Providing customer support and assistance</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Sending order updates, promotional offers, and personalised
                    recommendations
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Enhancing platform performance and user experience
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Preventing fraud, unauthorised access, and misuse</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Complying with legal obligations and resolving disputes
                  </span>
                </div>
              </div>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section
              id="section-3"
              data-index="3"
              ref={(el) => (sectionRefs.current[3] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                3. Cookies and Tracking Technologies
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  We may use cookies and similar technologies to enhance user
                  experience. Cookies help us to remember user preferences,
                  track website performance, and show you relevant content or
                  Ads.
                </p>
                <p className="mb-2">
                  You have full authority to disable cookies through your
                  browser settings. But doing so may limit your access to
                  certain features of our platform.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section
              id="section-4"
              data-index="4"
              ref={(el) => (sectionRefs.current[4] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                4. Data Security
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  We utilise severe physical, electronic, and administrative
                  safeguards to protect your personal data from unauthorised
                  access, disclosure, alteration, or destruction.
                </p>
                <p className="mb-2">
                  All transactions are encrypted and processed through secure
                  3rd-party payment gateways compliant with current data
                  security standards. While we take all the necessary
                  precautions, no online transaction is completely secure, and
                  users are advised to take caution when sharing personal
                  information online.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section
              id="section-5"
              data-index="5"
              ref={(el) => (sectionRefs.current[5] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                5. Data Retention
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  We keep your personal information/data for as long as
                  necessary for the purposes outlined in this Privacy Policy.
                  Once data is no longer required, it will be deleted securely.
                </p>
              </div>
            </section>

            {/* Sharing of Information */}
            <section
              id="section-6"
              data-index="6"
              ref={(el) => (sectionRefs.current[6] = el)}
              className="scroll-mt-20 000 pb-3 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                6. Sharing of Information
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  We may share your information/data in the following
                  circumstances:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Service Providers</b>: With logistics, payment, and
                    customer support partners who help us deliver our services.
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Affiliates</b>: With group companies or subsidiaries of
                    <b> Elderwise Shopping India Pvt. Ltd.</b>
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Legal Compliance</b>: When required by law, government
                    authorities, or to protect EW Shopping legal rights.
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    <b>Business Transfers</b>: In case of a <b>merger</b>,{" "}
                    <b>acquisition</b>, or
                    <b>restructuring</b>, your information/data may be
                    transferred to the new entity under the same terms of
                    protection.
                  </span>
                </div>
                <p className="text-sm sm:text-base text-black">
                  <b>Note</b>: We don't sell, rent, or lease your personal data
                  to third parties for marketing purposes.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section
              id="section-7"
              data-index="7"
              ref={(el) => (sectionRefs.current[7] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-2 sm:mb-4 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                7. Your Rights
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">As a user, you have several rights:</p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    You can access, correct, or update your personal
                    information/data
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    You can withdraw consent for marketing communications
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    You can request for deletion of your account or personal
                    data/information
                  </span>
                </div>
                <div className="flex items-start mb-4 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    If you feel your rights have been violated, you can file a
                    complaint with the data protection authorities
                  </span>
                </div>
                <p className="mb-2">
                  You may use these user rights by contacting us at
                  <a
                    href="mailto:info@ewshopping.com"
                    className="text-blue-600 underline font-semibold hover:underline ml-2"
                  >
                    info@ewshopping.com
                  </a>
                </p>
              </div>
            </section>

            {/* Privacy Policy for children and minors */}
            <section
              id="section-8"
              data-index="8"
              ref={(el) => (sectionRefs.current[8] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                8. Privacy Policy for children and minors
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  All of our services are intended for users aged 18 and above.
                  EW Shopping does not intentionally collect or process personal
                  information/data from minors. If any of the information is
                  mistakenly collected from our side. It will be deleted
                  immediately.
                </p>
              </div>
            </section>

            {/* External Links */}
            <section
              id="section-9"
              data-index="9"
              ref={(el) => (sectionRefs.current[9] = el)}
              className="scroll-mt-20 000 pb-4 sm:pb-5"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                9. External Links
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  Our platform may contain external links to 3rd-party websites.
                  We are not responsible for the privacy practices or content of
                  such external sites. We highly recommend that you carefully
                  read their privacy policies before giving any information or
                  data.
                </p>
              </div>
            </section>

            {/* Responsibility limitations */}
            <section
              id="section-10"
              data-index="10"
              ref={(el) => (sectionRefs.current[10] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                10. Responsibility limitations
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  While we do our best to ensure data security, we shall not be
                  responsible for the following:
                </p>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>Any unauthorised access outside our control</span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Breach or misuse of data caused by third-party service
                    providers or user error
                  </span>
                </div>
                <div className="flex items-start mb-2 ml-4">
                  <span className="mr-2">●</span>
                  <span>
                    Technical failures, cyberattacks, or natural disasters
                    affecting our systems
                  </span>
                </div>
              </div>
            </section>

            {/* Jurisdiction and Governing Law */}
            <section
              id="section-11"
              data-index="11"
              ref={(el) => (sectionRefs.current[11] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                11. Jurisdiction and Governing Law
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  This Privacy Policy is governed by the laws of India. Any
                  conflicts that arise from this Privacy Policy shall be subject
                  to the jurisdiction of the New Delhi court, India.
                </p>
              </div>
            </section>

            {/* Updates in this Privacy Policy */}
            <section
              id="section-12"
              data-index="12"
              ref={(el) => (sectionRefs.current[12] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                12. Updates in this Privacy Policy
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-2">
                  We may update this Privacy Policy from time to time to reflect
                  changes in business or legal requirements. The revised Privacy
                  Policy will be effective after posting on this page.
                </p>
              </div>
            </section>

            {/* Grievance Settlement & Contact Information */}
            <section
              id="section-13"
              data-index="13"
              ref={(el) => (sectionRefs.current[13] = el)}
              className="scroll-mt-20 000 pb-2 sm:pb-4 last:border-b-0"
            >
              <h2 className="text-xl sm:text-xl font-bold text-[#000] mb-4 sm:mb-6 flex items-center">
                <FiFileText className="mr-3 text-[#000] flex-shrink-0" />
                13. Grievance Settlement & Contact Information
              </h2>
              <div className="text-black whitespace-pre-line text-sm sm:text-base leading-relaxed">
                <p className="mb-4">
                  For any of your concerns, queries or grievances related to
                  this Privacy Policy or our data handling procedure, you may
                  contact our designated grievance officer:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2 text-sm sm:text-base">
                    <span className="font-semibold">Name:</span> Grievance
                    Officer – EW Shopping
                  </p>
                  <p className="mb-2 text-sm sm:text-base">
                    <span className="font-semibold">Company:</span> Elderwise
                    Shopping India Pvt. Ltd.
                  </p>
                  <p className="mb-2 text-sm sm:text-base">
                    <span className="font-semibold">Address:</span> Rajendra
                    Place, New Delhi, India – 110008
                  </p>
                  <p className="mb-2 text-sm sm:text-base">
                    <span className="font-semibold">Phone:</span> +91 8447282606
                  </p>
                  <p className="mb-2 text-sm sm:text-base">
                    <span>Email:</span>
                    <a
                      href="mailto:info@ewshopping.com"
                      className="font-semibold text-blue-600 underline"
                    >
                      info@ewshopping.com
                    </a>{" "}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <footer className="mt-8 sm:mt-12 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm sm:text-base text-black text-center">
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:info@ewshopping.com"
                className="text-blue-600 underline font-semibold hover:underline"
              >
                info@ewshopping.com
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
