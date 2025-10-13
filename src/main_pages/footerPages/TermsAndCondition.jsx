"use client";
import React from "react";
import {
  FaBook,
  FaUser,
  FaShieldAlt,
  FaInfoCircle,
  FaMoneyBillWave,
  FaShippingFast,
  FaUndo,
  FaBan,
  FaLink,
  FaBalanceScale,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      <div
        className="w-full h-32 md:h-60 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/termsandcondition.jpg')",
          backgroundSize: "100% 100%",
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-3  sm:px-4 md:px-6 py-4 sm:py-8 md:py-14 mb-20 sm:mb-0 flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4 sm:block hidden">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-5 md:p-6 sticky top-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5 md:mb-6 border-b pb-2 text-sm sm:text-base md:text-lg">
              Sections
            </h2>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#introduction"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaBook className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Introduction
                </a>
              </li>
              <li>
                <a
                  href="#definitions"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaInfoCircle className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Definitions
                </a>
              </li>
              <li>
                <a
                  href="#eligibility"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaUser className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Eligibility
                </a>
              </li>
              <li>
                <a
                  href="#account"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaShieldAlt className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Account Responsibility
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaInfoCircle className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Product Information
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaMoneyBillWave className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Pricing & Payment
                </a>
              </li>
              <li>
                <a
                  href="#shipping"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaShippingFast className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a
                  href="#returns"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaUndo className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href="#intellectual"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaBan className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Intellectual Property
                </a>
              </li>
              <li>
                <a
                  href="#conduct"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaUser className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  User Conduct
                </a>
              </li>
              <li>
                <a
                  href="#liability"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaBalanceScale className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Liability
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-xs sm:text-sm"
                >
                  <FaEnvelope className="mr-2 text-[#2f415d] text-sm sm:text-base" />
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:w-3/4 space-y-6 sm:space-y-8 md:space-y-10">
          {/* Header */}
          <section className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaBook className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Terms & Conditions
                </h1>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                  Last Update: Oct, 2025
                </p>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base md:text-lg">
                Welcome to EW Shopping, a brand owned and operated by Elderwise
                Shopping India Pvt. Ltd. By accessing or using our website
                (www.ewshopping.com), you agree to these Terms & Conditions.
                Please read them carefully before using our services.
              </p>
            </div>
          </section>

          {/* Introduction */}
          <section
            id="introduction"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaBook className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Introduction
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                EW Shopping is India's most trusted e-commerce platform offering
                fashion, lifestyle, electronics, home essentials and more. By
                visiting our website or placing an order, you agree to the
                following terms, which govern your access, use, and interaction
                with our platform.
              </p>
              <div className="p-3 sm:p-4 rounded-lg bg-yellow-50 border border-yellow-100 text-yellow-900">
                <p className="text-xs sm:text-sm font-semibold">
                  If you do not agree to these terms, please refrain from using
                  our website or services.
                </p>
              </div>
            </div>
          </section>

          {/* Definitions */}
          <section
            id="definitions"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaInfoCircle className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Definitions
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    <strong>"Website"</strong> refers to www.ewshopping.com.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    <strong>"User", "You", or "Customer"</strong> refers to any
                    individual accessing or making a purchase through the
                    Website.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    <strong>"We", "Us", or "Our"</strong> refers to Elderwise
                    Shopping India Pvt. Ltd., operating under the brand name EW
                    Shopping.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    <strong>"Products"</strong> refer to any items listed, sold,
                    or delivered through the Website.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Eligibility */}
          <section
            id="eligibility"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaUser className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Eligibility
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                To use EW Shopping, you must:
              </p>
              <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Be at least 18 years old or access the website under the
                    supervision of a parent or legal guardian.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Provide accurate, complete, and up-to-date personal details.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Do not use the site for any illegal or unauthorised purpose.
                  </span>
                </li>
              </ul>
              <div className="p-3 sm:p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-900">
                <p className="text-xs sm:text-sm">
                  We reserve the right to terminate or restrict access to any
                  user account found in violation of our policies.
                </p>
              </div>
            </div>
          </section>

          {/* Account Responsibility */}
          <section
            id="account"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaShieldAlt className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Account Responsibility
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                When you create your account with EW Shopping, you are
                responsible for:
              </p>
              <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Maintaining the confidentiality of your login credentials.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    All activities are conducted under your registered account.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Notifying us immediately in case of any unauthorised access
                    or misuse.
                  </span>
                </li>
              </ul>
              <div className="p-3 sm:p-4 rounded-lg bg-red-50 border border-red-100 text-red-900">
                <p className="text-xs sm:text-sm font-semibold">
                  EW Shopping shall not be liable for any loss or damage
                  resulting from your failure to protect your account details.
                </p>
              </div>
            </div>
          </section>

          {/* Product Information */}
          <section
            id="products"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaInfoCircle className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Product Information
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                We try our best to provide accurate and updated product details,
                including descriptions, pricing, and availability. However,
                minor variations may occur due to photos, lighting, or display
                settings.
              </p>

              <p className="text-sm sm:text-base">
                <strong>EW Shopping reserves the right to:</strong>
              </p>
              <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Modify product information at any time without notice.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Correct any grammatical or pricing errors.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Discontinue products or categories based on stock or vendor
                    availability.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Pricing and Payment */}
          <section
            id="pricing"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaMoneyBillWave className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Pricing and Payment
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                All prices listed on EW Shopping are in Indian Rupees (₹) (INR)
                and inclusive of applicable taxes.
              </p>

              <p className="text-sm sm:text-base">
                <strong>We accept multiple payment modes, including:</strong>
              </p>
              <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Credit/Debit Cards
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">Net Banking</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">UPI & Wallets</span>
                </li>
              </ul>
              <div className="p-3 sm:p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-900">
                <p className="text-xs sm:text-sm">
                  In case of any payment failure or transaction issue, EW
                  Shopping reserves the right to cancel the order and issue a
                  refund as per the Refund Policy.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section
            id="shipping"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaShippingFast className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Shipping and Delivery
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                Delivery dates may vary depending on location, product type, and
                availability.
              </p>

              <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Orders are generally processed within a week.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Shipping updates and tracking details are provided via
                    WhatsApp SMS and Email.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    In rare cases of delay due to unexpected events, we'll keep
                    you updated promptly.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Returns, Refunds, Exchanges and Cancellations */}
          <section
            id="returns"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaUndo className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Returns, Refunds, Exchanges and Cancellations
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                EW Shopping follows a transparent and customer-friendly Return,
                Refund, Exchange, and Cancellation Policy. Please refer to our
                individual policy pages for complete details:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-[#2f415d] text-sm sm:text-base">
                    Refund & Return Policy
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Our comprehensive refund and return guidelines
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-[#2f415d] text-sm sm:text-base">
                    Exchange Policy
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Product exchange procedures and conditions
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-[#2f415d] text-sm sm:text-base">
                    Order Cancellation Policy
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Rules and timelines for order cancellations
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-[#2f415d] text-sm sm:text-base">
                    Privacy Policy
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    How we protect and use your personal information
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section
            id="intellectual"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaBan className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Intellectual Property
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                All information available on EW Shopping, including text,
                graphics, logos, product images, design, and software, is the
                exclusive property of Elderwise Shopping India Pvt. Ltd. or its
                affiliates.
              </p>

              <p className="text-sm sm:text-base">
                <strong>You may not:</strong>
              </p>
              <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Copy, reuse, distribute, or exploit any part of the website
                    without prior authorised consent.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Use our trademarks or brand assets for commercial purposes
                    without authorisation.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* User Conduct */}
          <section
            id="conduct"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaUser className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  User Conduct
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                <strong>While using EW Shopping, you agree not to:</strong>
              </p>
              <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Engage in fraudulent transactions or provide false
                    information.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Attempt to gain unauthorised access to our systems.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Upload or share harmful content such as viruses, spam, or
                    malicious code.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Post defamatory or abusive comments about our brand or other
                    customers.
                  </span>
                </li>
              </ul>
              <div className="p-3 sm:p-4 rounded-lg bg-red-50 border border-red-100 text-red-900">
                <p className="text-xs sm:text-sm font-semibold">
                  Violations may result in immediate account suspension or legal
                  action.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section
            id="liability"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaBalanceScale className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Limitation of Liability
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                <strong>EW Shopping is not responsible for:</strong>
              </p>
              <ul className="space-y-2 sm:space-y-3 pl-4 sm:pl-5">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Indirect, accidental, or related damages resulting from
                    product use or website access.
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-[#2f415d] font-semibold mt-1 text-sm">
                    •
                  </span>
                  <span className="text-sm sm:text-base">
                    Delays or failures due to events beyond our fair control.
                  </span>
                </li>
              </ul>
              <div className="p-3 sm:p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-900">
                <p className="text-xs sm:text-sm">
                  Our maximum liability, under any circumstances, shall be
                  limited to the amount paid for the order in question.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Us */}
          <section
            id="contact"
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <FaEnvelope className="text-xl sm:text-2xl md:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-[#2f415d]">
                  Contact Us
                </h2>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base">
                If you have any queries regarding these Terms, please reach out
                to us at:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaEnvelope className="text-[#2f415d] text-sm sm:text-base" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        Email
                      </p>
                      <a
                        href="mailto:support@ewshopping.com"
                        className="text-gray-600 hover:text-[#2f415d] text-xs sm:text-sm"
                      >
                        support@ewshopping.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FaPhone className="text-[#2f415d] text-sm sm:text-base" />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        Phone
                      </p>
                      <a
                        href="tel:+918447282606"
                        className="text-gray-600 hover:text-[#2f415d] text-xs sm:text-sm"
                      >
                        +91 8447282606
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Updates to Terms */}
          <section className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
            <div className="p-3 sm:p-4 rounded-lg bg-orange-50 border border-orange-100 text-orange-900">
              <p className="text-xs sm:text-sm">
                <strong>Updates to Terms:</strong> EW Shopping reserves the
                right to modify these Terms & Conditions at any time. All
                updates will be posted on this page, and continued use of the
                website indicates your acceptance of such changes.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TermsAndConditions;
