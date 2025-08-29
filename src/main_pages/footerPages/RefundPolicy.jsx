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
      <div className="container mx-auto px-4 py-1 sm:px-6 sm:py-14 mb-10 sm:mb-0 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4">
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
                  href="#contact"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaEnvelopeOpenText className="mr-2 text-[#2f415d]" />
                  Contact & Support
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaListUl className="mr-2 text-[#2f415d]" />
                  Top Categories
                </a>
              </li>
              <li>
                <a
                  href="#why"
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  <FaShieldAlt className="mr-2 text-[#2f415d]" />
                  Why EWShopping
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:w-3/4 space-y-10">
          {/* Policy Overview */}
          <section id="policy" className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-start gap-4 mb-4">
              <FaBan className="text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className=" text-base sm:text-2xl font-bold mb-1 text-[#2f415d]">
                  Policy Overview (EW Shopping)
                </h3>
                <p className="text-gray-600">
                  Please review the following points before placing your order.
                </p>
              </div>
            </div>

            <ol className="list-decimal pl-6 space-y-4 text-gray-700">
              <li>
                We know you’ll love your purchase, but we understand that
                sometimes things come up. We want you to have all the
                information you need to make an informed decision.
              </li>
              <li className="flex items-start gap-3">
                <FaBan className="mt-1 shrink-0 text-rose-600" />
                <span>
                  Products purchased through our website are{" "}
                  <strong>non-refundable</strong>. We do not offer refunds, so
                  please double-check the requirements of the product before
                  purchasing.
                </span>
              </li>
              <li>
                We are dedicated to providing the best products possible and
                believe you will be happy with your purchase. For any
                concerns/questions please email us at{" "}
                <a
                  href="mailto:info@ewshopping.com"
                  className="text-[#2f415d] font-medium hover:underline"
                >
                  info@ewshopping.com
                </a>
                .
              </li>
            </ol>

            <div className="mt-6 p-4 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900">
              <p className="text-sm">
                Note: This Refund Policy applies to purchases made directly on
                EWShopping’s website. Other policies (e.g., returns, exchanges)
                may be listed separately where applicable.
              </p>
            </div>
          </section>

          {/* Contact & Support */}
          <section id="contact" className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-start gap-4 mb-3">
              <FaHeadset className="text-3xl text-[#2f415d] mt-1" />
              <div>
                <h3 className=" text-base sm:text-2xl font-bold text-[#2f415d]">
                  Need Assistance?
                </h3>
                <p className="text-gray-700">
                  Our support team is here to help with any questions about your
                  order.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <a
                href="mailto:info@ewshopping.com"
                className="block p-4 rounded-lg border hover:shadow transition"
              >
                <p className="font-semibold">Email</p>
                <p className="text-gray-600">info@ewshopping.com</p>
              </a>
              <div className="p-4 rounded-lg border">
                <p className="font-semibold">24/7 Dedicated Support</p>
                <p className="text-gray-600">
                  Fast responses for order and policy queries.
                </p>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section id="categories" className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-start gap-4 mb-4">
              <FaTags className="text-3xl text-[#2f415d] mt-1" />
              <h3 className="text-base sm:text-2xl font-bold text-[#2f415d]">
                Our Top Categories
              </h3>
            </div>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat, i) => (
                <li
                  key={i}
                  className="p-3 bg-gray-50 rounded-lg shadow-sm text-center"
                >
                  {cat}
                </li>
              ))}
            </ul>
          </section>

          {/* Why Choose */}
          <section id="why" className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-start gap-4 mb-3">
              <FaShieldAlt className="text-3xl text-[#2f415d] mt-1" />
              <h3 className="text-base sm:text-2xl font-bold text-[#2f415d]">
                Why Choose EWShopping
              </h3>
            </div>
            <p className="text-gray-700">
              Worldwide Shipping • EWShopping Promise • Secure Payments • Free
              Returns • 24/7 Dedicated Support
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default RefundPolicy;
