"use client";
import React from "react";
import {
  FaExchangeAlt,
  FaBan,
  FaListUl,
  FaFileContract,
  FaClock,
  FaShippingFast,
  FaHeadset,
} from "react-icons/fa";

const ExchangePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b sm:mb-0 mb-20 from-gray-50 to-white text-gray-800">
      <div
        className="w-full h-32 mt-1 md:h-60 bg-no-repeat bg-center"
        style={{
          backgroundImage:
            "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1760082144150.webp')",
          backgroundSize: "100% 100%",
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-1 py-2 sm:px-6 sm:py-14 mb-10 sm:mb-0 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4 sm:block hidden">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Sections</h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="#policy"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaExchangeAlt className="mr-2 text-[#2f415d]" />
                  Policy Overview
                </a>
              </li>
              <li>
                <a
                  href="#eligibility"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaBan className="mr-2 text-[#2f415d]" />
                  Eligibility for Exchange
                </a>
              </li>
              <li>
                <a
                  href="#request-process"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaListUl className="mr-2 text-[#2f415d]" />
                  How to Request Exchange
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaFileContract className="mr-2 text-[#2f415d]" />
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#timeline"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaClock className="mr-2 text-[#2f415d]" />
                  Exchange Timeline
                </a>
              </li>
              <li>
                <a
                  href="#self-ship"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaShippingFast className="mr-2 text-[#2f415d]" />
                  Self-Ship Option
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaHeadset className="mr-2 text-[#2f415d]" />
                  Need Assistance?
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:w-3/4 sm:space-y-10 space-y-3">
          {/* Policy Overview */}
          <section
            id="policy"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            {/* <div className="flex items-start gap-4 mb-4">
              <FaExchangeAlt className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  Exchange Policy
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  Last Update: Oct, 2025
                </p>
              </div>
            </div> */}

            <div className="text-gray-700 space-y-4 text-sm sm:text-base">
              <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-900">
                <p className="text-xs sm:text-sm font-semibold">
                  "As of now, we are not providing exchanges on any of the
                  purchased products from our website and mobile application. We
                  will soon start this service for customers."
                </p>
              </div>

              <p>
                If you received a product that does not fit your expectations,
                our Exchange Policy makes it simple and stress-free to get you
                the right product.
              </p>
            </div>
          </section>

          {/* Eligibility for Exchange */}
          <section
            id="eligibility"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <FaBan className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  1. Eligibility for Exchange
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  Conditions for exchanging your purchased products
                </p>
              </div>
            </div>

            <div className="text-gray-700 space-y-6 text-sm sm:text-base">
              <div>
                <h4 className="font-semibold mb-3">
                  You can request for an exchange if:
                </h4>
                <ul className="space-y-2 pl-5">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      The product is defective, damaged, or different from your
                      initial order
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      The size or colour does not match your preference
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      The exchange request is raised within the time period of
                      7-10 days of delivery
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      The product is unused, unwashed, and returned in its
                      original condition (with tags, packaging, and accessories)
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-rose-600">Note:</h4>
                <p className="text-gray-600">
                  Products including innerwear, cosmetics, personal hygiene, and
                  custom-made products are not eligible for exchange.
                </p>
              </div>
            </div>
          </section>

          {/* How to Request Exchange */}
          <section
            id="request-process"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <FaListUl className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  2. How to Request an Exchange
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  Follow these steps to request an exchange for your product
                </p>
              </div>
            </div>

            <div className="text-gray-700 space-y-4 text-sm sm:text-base">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-xs sm:text-base">
                    Step 1. Open your EW Shopping account
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Log in to your account on our website or mobile app
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-xs sm:text-base">
                    Step 2. Go to "My Orders"
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Choose the product you want to exchange
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-xs sm:text-base">
                    Step 3. Select "Exchange" option
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Specify the reason for return
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-xs sm:text-base">
                    Step 4. Select preferred options
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Choose size, colour, variant (if available)
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <h4 className="font-semibold mb-2 text-xs sm:text-base">
                    Step 5. Confirm request & wait for pickup
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Our courier partner will schedule pickup
                  </p>
                </div>
              </div>

              <div className="mt-6 p-3 sm:p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-900">
                <p className="text-xs sm:text-sm">
                  Once the product is picked up and passes the quality check,
                  we'll dispatch the replacement product within Max. 15 days.
                </p>
              </div>
            </div>
          </section>

          {/* Terms & Conditions */}
          <section
            id="terms"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <FaFileContract className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  3. Terms & Conditions
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  Important guidelines for exchange requests
                </p>
              </div>
            </div>

            <div className="text-gray-700 space-y-4 text-sm sm:text-base">
              <ul className="space-y-3 pl-5">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Exchanges are allowed only once per order</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    The product must pass our quality inspection before approval
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    If the desired product is out of stock, you will be given
                    the option for a refund instead
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>
                    EW Shopping reserves the right to decline exchange requests
                    that do not comply with our policies
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Exchange Timeline */}
          <section
            id="timeline"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <FaClock className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  4. Exchange Timeline
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  Expected timeframes for the exchange process
                </p>
              </div>
            </div>

            <div className="text-gray-700 space-y-6 text-sm sm:text-base">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <h5 className="font-semibold text-purple-800 text-xs sm:text-base">
                    Pickup Time
                  </h5>
                  <p className="text-xs sm:text-sm text-purple-700">
                    Within 7 - 10 days after approval from our side
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-semibold text-indigo-800 text-xs sm:text-base">
                    Quality Check & Dispatch
                  </h5>
                  <p className="text-xs sm:text-sm text-indigo-700">
                    Max. 15 days after pickup
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-lg bg-green-50 border border-green-100 text-green-900">
                <p className="text-xs sm:text-sm">
                  You'll receive real-time updates via WhatsApp, SMS or Email
                  regarding the stage of the exchange process.
                </p>
              </div>
            </div>
          </section>

          {/* Self-Ship Option */}
          <section
            id="self-ship"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <FaShippingFast className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  5. Self-Ship Option
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  Alternative shipping method for non-serviceable areas
                </p>
              </div>
            </div>

            <div className="text-gray-700 text-sm sm:text-base">
              <p>
                If your location is not serviceable for pickup, you may need to
                self-ship the product to the provided address by our support
                team. Once received and verified, your replacement product will
                be sent immediately.
              </p>
            </div>
          </section>

          {/* Need Assistance? */}
          <section
            id="contact"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-3">
              <FaHeadset className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold text-[#2f415d]">
                  6. Need Assistance?
                </h3>
                <p className="text-xs sm:text-base text-gray-700">
                  For queries or assistance with your exchange request, contact
                  us at:
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
              <a
                href="mailto:support@ewshopping.com"
                className="block p-3 sm:p-4 rounded-lg border hover:shadow transition"
              >
                <p className="font-semibold text-xs sm:text-base">Email</p>
                <p className="text-xs sm:text-base text-gray-600">
                  support@ewshopping.com
                </p>
              </a>
              <div className="p-3 sm:p-4 rounded-lg border">
                <p className="font-semibold text-xs sm:text-base">Phone</p>
                <p className="text-xs sm:text-base text-gray-600">
                  +91 8447282606
                </p>
                <p className="text-xs text-gray-500 mt-1">24x7 available</p>
              </div>
            </div>
          </section>

          {/* Important Notice */}
          <section className="bg-white rounded-xl shadow-md p-4 sm:p-8">
            <div className="p-3 sm:p-4 rounded-lg bg-orange-50 border border-orange-100 text-orange-900">
              <p className="text-xs sm:text-sm">
                <strong>Important Notice:</strong> This Exchange Policy is
                subject to change. Please check this page periodically for
                updates. The current policy applies to all exchange requests
                made on or after the last updated date.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ExchangePolicy;
