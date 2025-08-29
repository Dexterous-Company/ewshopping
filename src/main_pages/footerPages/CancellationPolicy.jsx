
"use client";
import React from "react";
import { FiFileText } from "react-icons/fi";

const CancellationPolicy = () => {
  const categories = [
    "Electronics", "Mobile & Tablets", "Women's Fashion", "Men's Fashion", "Beauty & Health",
    "Toys & Kids Fashion", "Home & Kitchen", "Sports & Fitness", "Car & Motorbike", "Computers & Gaming", "Books, Media & Music"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div
        className="w-full h-32 md:h-70 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/Cancelation policy.png')",
          backgroundSize: "100% 100%",
        }}
      ></div>
      {/* Content */}
      <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">Sections</h2>
            <ul className="space-y-3">
              <li><a href="#policy" className="flex items-center hover:bg-gray-100 px-4 py-2 rounded-lg"><FiFileText className="mr-2 text-[#2f415d]" /> Policy</a></li>
              <li><a href="#categories" className="flex items-center hover:bg-gray-100 px-4 py-2 rounded-lg"><FiFileText className="mr-2 text-[#2f415d]" /> Categories</a></li>
              <li><a href="#why" className="flex items-center hover:bg-gray-100 px-4 py-2 rounded-lg"><FiFileText className="mr-2 text-[#2f415d]" /> Why EWShopping</a></li>
            </ul>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:w-3/4 bg-white rounded-xl shadow-md p-8">
          {/* Policy */}
          <section id="policy" className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-[#2f415d]">Our Cancellation Policy</h3>
            <p className="text-gray-700">
              While there is no option to cancel the order as we process the orders within 24 hours post order confirmation,
              you can get in touch with our customer support team for a cancellation request. We will cancel the order if the
              same is not shipped from our warehouse. In such a case, we will refund any payments already made by you.
            </p>
          </section>

          {/* Categories */}
          <section id="categories" className="mb-10">
            <h3 className="text-2xl font-bold mb-4 text-[#2f415d]">Top Categories</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat, i) => (
                <li key={i} className="p-3 bg-gray-50 rounded-lg shadow-sm">{cat}</li>
              ))}
            </ul>
          </section>

          {/* Why Choose */}
          <section id="why">
            <h3 className="text-2xl font-bold mb-4 text-[#2f415d]">Why Choose EWShopping</h3>
            <p className="text-gray-700">
              Indiawide Shipping • EWShopping Promise • Secure Payments • Free Returns • 24/7 Dedicated Support
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CancellationPolicy;