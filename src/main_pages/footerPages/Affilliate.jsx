
"use client";
import React, { useState } from "react";
import { FiFileText, FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";

const Affilliate = () => {
  const { fillteredCategory } = useSelector((store) => store.category)
  const sections = [
    {
      title: "Easy Signup",
      content:
        "With a simple application process and one-stop approval, it’s all aboard the bullet train to Earningtown.",
    },
    {
      title: "Potent Promotions",
      content:
        "Choose the products that click with your audience, use our gorgeous creative assets, and take advantage of our lively promo calendar.",
    },
    {
      title: "Sweet Rewards",
      content:
        "Earn up to 10% commission with a 30-day attribution window, plus bonus incentive opportunities.",
    },
  ];

  const faq = [
    {
      q: "What is Impact?",
      a: "Impact is our affiliate tracking platform that provides real-time tracking of clicks, sales, and commission in the program.",
    },
    {
      q: "What exactly is an affiliate?",
      a: "An affiliate is someone who posts links to EWShopping on their website, blog, or other digital channels, earning commission from resulting sales.",
    },
    {
      q: "How do I become an affiliate?",
      a: "Sign up on our platform. Our team will review your application and let you know if you’re a good fit. No multiple approvals needed.",
    },
  ];

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

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div
        className="w-full h-32 md:h-70 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/Affilatedmarketin.png')",
          backgroundSize: "100% 100%",
        }}
      ></div>
      {/* Content */}
      <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-16 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Sections</h2>
            <ul className="space-y-3">
              <li>
                <a
                  href="#benefits"
                  className="flex items-center hover:bg-gray-100 px-4 py-2 rounded-lg"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> Benefits
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="flex items-center hover:bg-gray-100 px-4 py-2 rounded-lg"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> FAQ
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="flex items-center hover:bg-gray-100 px-4 py-2 rounded-lg"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> Categories
                </a>
              </li>
              <li>
                <a
                  href="#why"
                  className="flex items-center hover:bg-gray-100 px-4 py-2 rounded-lg"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> Why EWShopping
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:w-3/4 bg-white rounded-xl shadow-md p-8">
          {/* Benefits */}
          <section id="benefits" className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-[#e96f84]">
              Affiliate Benefits
            </h3>
            <div className="space-y-6">
              {sections.map((sec, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-lg mb-2">{sec.title}</h4>
                  <p className="text-gray-700">{sec.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-[#2f415d]">
              Frequently Asked Questions
            </h3>
            <div className="divide-y">
              {faq.map((item, i) => (
                <div key={i} className="py-3">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex justify-between items-center w-full text-left font-medium text-gray-800"
                  >
                    {item.q}
                    <FiChevronDown
                      className={`transition-transform ${openFaq === i ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {openFaq === i && (
                    <p className="mt-2 text-gray-600">{item.a}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
          {/* Categories */}
          <section id="categories" className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-[#e96f84]">
              Top Categories
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              { fillteredCategory && fillteredCategory?.slice(0, 25).map((cat, i) => (
                <li key={i} className="p-3 bg-gray-50 rounded-lg shadow-sm">
                  {cat.name}
                </li>
              ))}
            </ul>
          </section>

          {/* Why Choose */}
          <section id="why">
            <h3 className="text-2xl font-bold mb-4 text-[#e96f84]">
              Why Choose EWShopping
            </h3>
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

export default Affilliate;