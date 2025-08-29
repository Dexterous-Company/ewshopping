
"use client";
import React from "react";
import { FiFileText } from "react-icons/fi";

const TermsAndCondition = () => {
  const sections = [
    {
      title: "Introduction",
      content: `Creativity. Community. And sweet, sweet cash. Sell your products on high-quality products to a global audience. It’s fun, easy, and quick to get started.`,
    },
    {
      title: "How EWShopping Works",
      content: `Create what you love, and connect with people who love it too. From India, millions of visitors come to EWShopping looking for their unique items.
      
      1. You upload your designs to products in your shop.
      2. Customers find and purchase products featuring your designs.
      3. Products are produced to order and shipped across India.
      4. Customers receive awesome products, with less waste thanks to print-on-demand.`,
    },
    {
      title: "Join Thousands of Successful Sellers",
      content: `Sellers are the heart of the EWShopping marketplace. From professionals to hobbyists, thousands are earning money every day.

      - Complete control over pricing
      - Anti-piracy and watermark protection
      - 24/7 customer support`,
    },
    {
      title: "Top Categories",
      content: `We offer a wide range of categories for online shopping:
      - Electronics
      - Mobile & Tablets
      - Women's Fashion
      - Men's Fashion
      - Beauty & Health
      - Toys & Kids Fashion
      - Home & Kitchen
      - Sports & Fitness
      - Car & Motorbike
      - Computers & Gaming
      - Books, Media & Music`,
    },
    {
      title: "Why Choose EWShopping",
      content: `Worldwide Shipping • EWShopping Promise • Secure Payments • Free Returns • 24/7 Dedicated Support`,
    },
    {
      title: "Best Online Shopping Site for Fashion & Lifestyle",
      content: `EWShopping offers the latest fashion trends for men, women, and kids at affordable prices. One-stop destination for all your shopping needs.`,
    },
    {
      title: "About",
      content: `About Us • Privacy Policy • Careers • Contact Us • My Account • Sign in • View Cart • Customer Services`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b mb-[6rem] sm:mb-[0rem] from-gray-50 to-white">
      <div
        className="w-full h-32 md:h-70 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/termsandcondition.jpg')",
          backgroundSize: "100% 100%",
        }}
      ></div>
      {/* Content */}
      <div className="container mx-auto px-3 py-5 sm:px-6 sm:py-16 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Sections</h2>
            <ul className="space-y-3">
              {sections.map((sec, index) => (
                <li key={index}>
                  <a
                    href={`#section-${index}`}
                    className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <FiFileText className="mr-2 text-[#e96f84]" />
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:w-3/4 bg-white rounded-xl shadow-md p-8">
          {sections.map((sec, index) => (
            <section id={`section-${index}`} key={index} className="mb-10">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#2f415d]">
                {sec.title}
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{sec.content}</p>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default TermsAndCondition;