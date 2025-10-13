"use client";
import React from "react";
import {
  FaMoneyBillWave,
  FaBan,
  FaEnvelopeOpenText,
  FaListUl,
  FaTags,
  FaShieldAlt,
  FaHeadset,
} from "react-icons/fa";

const RefundPolicy = () => {
  const categories = [
    "Electronics",
    "Mobile & Tablets",
    "Women's Fashion",
    "Men's Fashion",
    "Beauty & Health",
    "Toys & Kids Fashion",
    "Home & Kitchen",
    "Sports & Fitness",
    "Car & Motorbike",
    "Computers & Gaming",
    "Books, Media & Music",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">
      <div
        className="w-full h-32 md:h-60 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/refund.jpg')",
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
                  <FaMoneyBillWave className="mr-2 text-[#2f415d]" />
                  Policy Overview
                </a>
              </li>
              <li>
                <a
                  href="#eligibility"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaBan className="mr-2 text-[#2f415d]" />
                  Eligibility for Returns
                </a>
              </li>
              <li>
                <a
                  href="#return-process"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaListUl className="mr-2 text-[#2f415d]" />
                  How to Initiate Return
                </a>
              </li>
              <li>
                <a
                  href="#refund-process"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaMoneyBillWave className="mr-2 text-[#2f415d]" />
                  Refund Process
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaEnvelopeOpenText className="mr-2 text-[#2f415d]" />
                  Contact & Support
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
            <div className="flex items-start gap-4 mb-4">
              <FaShieldAlt className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  Returns & Refund Policy
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  Last Update: Oct, 2025
                </p>
              </div>
            </div>

            <div className="text-gray-700 space-y-4 text-sm sm:text-base">
              <p>
                At EW Shopping, your (customer) satisfaction is our priority. We
                take careful precautions to deliver products that match
                high-quality standards. If you are not satisfied with your
                purchased product, this Return & Refund Policy will explain your
                available options and our process of handling such requests.
              </p>

              <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-100 text-blue-900">
                <p className="text-xs sm:text-sm">
                  This policy applies to all orders placed on www.ewshopping.com
                  and the EW Shopping mobile app.
                </p>
              </div>
            </div>
          </section>

          {/* Eligibility for Returns */}
          <section
            id="eligibility"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <FaBan className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  1. Eligibility for Returns
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  Conditions for returning your purchased products
                </p>
              </div>
            </div>

            <div className="text-gray-700 space-y-6 text-sm sm:text-base">
              <div>
                <h4 className="font-semibold mb-3">
                  You may request a return under these conditions:
                </h4>
                <ul className="space-y-2 pl-5">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      The purchased product must be unused, unworn, and not
                      damaged
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      The product must be intact with its original packaging,
                      price tags, labels, and accessories
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      Return requests must be raised within a week of delivery
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      Once received purchased product must pass our process of
                      quality inspection
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-rose-600">
                  Non-Returnable Items:
                </h4>
                <p className="text-gray-600 mb-3">
                  The following items cannot be returned due to hygienic and
                  safety concerns:
                </p>
                <ul className="space-y-2 pl-5">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Beauty and personal care products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Innerwear, socks, and undergarments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Customised, personalised, or different products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Hazardous items and food products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Gift cards, coupons, and online vouchers</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Initiate a Return */}
          <section
            id="return-process"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <FaListUl className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  2. How to Initiate a Return
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  Start your return process with these simple steps
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
                    Select the product you want to return
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-xs sm:text-base">
                    Step 3. Click on "Request Return"
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Give your reason behind the return
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-xs sm:text-base">
                    Step 4. Schedule Pickup
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Our courier partner will schedule pickup within Max. 15 days
                  </p>
                </div>
              </div>

              <div className="mt-6 p-3 sm:p-4 rounded-lg bg-yellow-50 border border-yellow-100 text-yellow-900">
                <p className="text-xs sm:text-sm">
                  Make sure the product is packed securely in its original
                  packaging before pickup.
                </p>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section
            id="refund-process"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-4">
              <FaMoneyBillWave className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  3. Refund Process and Timeline
                </h3>
                <p className="text-xs sm:text-base text-gray-600">
                  How and when you'll receive your refund
                </p>
              </div>
            </div>

            <div className="text-gray-700 space-y-6 text-sm sm:text-base">
              <div>
                <h4 className="font-semibold mb-3">Refund Modes:</h4>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-800 text-xs sm:text-base">
                      Prepaid Orders
                    </h5>
                    <p className="text-xs sm:text-sm text-blue-700">
                      Refunds will be credited to your original payment method
                      (Card, UPI, or Wallet).
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-800 text-xs sm:text-base">
                      Cash on Delivery Orders
                    </h5>
                    <p className="text-xs sm:text-sm text-green-700">
                      Refunds will be issued through bank transfer after you
                      share your account details.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Timeline of Refund:</h4>
                <p>
                  Refunds are usually processed within Max. 15 days after the
                  product passes our quality inspection. In case of high volume
                  of requests, it may take a little longer.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-rose-600">
                  Non-Refundable Elements:
                </h4>
                <ul className="space-y-2 pl-5">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Shipping or convenience fees (if any)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      Charges incurred due to an incorrect or incomplete
                      delivery address
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact & Support */}
          <section
            id="contact"
            className="bg-white rounded-xl shadow-md p-4 sm:p-8"
          >
            <div className="flex items-start gap-4 mb-3">
              <FaHeadset className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold text-[#2f415d]">
                  Contact Us
                </h3>
                <p className="text-xs sm:text-base text-gray-700">
                  For any questions related to refunds or returns, please reach
                  out to our customer support team
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
                <p className="text-xs text-gray-500 mt-1">24x7 Support</p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg border sm:col-span-2">
                <p className="font-semibold text-xs sm:text-base">Address</p>
                <p className="text-xs sm:text-base text-gray-600">
                  Elderwise Shopping India Pvt. Ltd., Rajendra Place, New Delhi
                  – 110008
                </p>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section className="bg-white rounded-xl shadow-md p-4 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <FaShieldAlt className="text-xl sm:text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className="text-sm sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  Important Notes
                </h3>
              </div>
            </div>

            <div className="text-gray-700 space-y-3 text-sm sm:text-base">
              <p>All users must clearly read the following:</p>
              <ul className="space-y-2 pl-5">
                <li className="flex items-start gap-2">
                  <span>➔</span>
                  <span>
                    Refunds are issued only after successful inspection of
                    returned products
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>➔</span>
                  <span>
                    Returns are dependent on pickup service availability in your
                    delivery area
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>➔</span>
                  <span>
                    EW Shopping reserves the right to refuse or delay refunds in
                    case of fraudulent, repeated, or invalid claims
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="bg-white rounded-xl shadow-md p-4 sm:p-8">
            <div className="p-3 sm:p-4 rounded-lg bg-orange-50 border border-orange-100 text-orange-900">
              <p className="text-xs sm:text-sm">
                <strong>Updates to This Policy:</strong> EW Shopping reserves
                the right to modify or update this Refund & Return Policy from
                time to time. All changes will be posted on this page with the
                latest effective date.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default RefundPolicy;
