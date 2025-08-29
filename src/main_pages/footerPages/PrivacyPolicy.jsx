"use client";
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiFileText } from "react-icons/fi";

const PrivacyPolicy = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const policySections = [
    {
      title: "Introduction",
      content: `Elderwise Shopping India Pvt Ltd, operating as EwShopping,
      respects the privacy of its users accessing www.EwShopping.com. This policy outlines
      what data we collect, how we use it, and how we protect it.`,
    },
    {
      title: "What We Collect",
      content: `
      We may collect personal information such as:
      - Username & password
      - Name, address, phone number, email
      - Date of birth, gender
      - Transaction details & purchase history
      - Payment information (securely processed, not stored)
      - IP address
      - Information from third-party sources like social media
      `,
    },
    {
      title: "Non-Personal Information",
      content: `
      Includes geographic location, ISP details, browser type, OS,
      last visited site, time spent, and analytics data collected
      through cookies.`,
    },
    {
      title: "How We Use Information",
      content: `
      - Internal record keeping
      - Improving products & services
      - Sending promotional emails (with consent)
      - Contacting for surveys or research
      - Customizing website experience`,
    },
    {
      title: "Cookies",
      content: `
      Cookies help us analyze site usage and tailor services to your preferences.
      You can accept or decline cookies via your browser settings.`,
    },
    {
      title: "Advertising",
      content: `
      We use third-party ads without sharing personal info. Aggregate data
      may be used to display relevant ads.`,
    },
    {
      title: "Security",
      content: `
      We implement physical, electronic, and managerial safeguards
      to secure your data from unauthorized access.`,
    },
    {
      title: "Your Rights",
      content: `
      You may request, update, or delete your personal information by contacting us.
      Email: info@ewshopping.com
      `,
    },
    {
      title: "Contact Information",
      content: `
      Company: EwShopping
      Address: [Your Address]
      Phone: [Your Number]
      Email: info@ewshopping.com
      `,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero - Made responsive with different heights for mobile and desktop */}
      <div
        className="w-full h-40 md:h-64 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/privacy.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center"
        }}
      ></div>

      {/* Main container with adjusted padding for mobile */}
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12 flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Sidebar - Full width on mobile, hidden on small screens if needed */}
        <aside className="lg:w-1/4 bg-white rounded-xl shadow-md p-4 md:p-6 lg:sticky lg:top-8">
          <h2 className="text-lg font-semibold mb-3 md:mb-4">Quick Navigation</h2>
          <ul className="space-y-2">
            {policySections.map((section, i) => (
              <li key={i}>
                <button
                  onClick={() => toggleSection(i)}
                  className={`w-full flex justify-between items-center text-left px-3 py-2 md:px-4 md:py-2 rounded-lg transition ${openSection === i
                      ? "bg-blue-100 text-[#2f415d]"
                      : "hover:bg-gray-100"
                    }`}
                >
                  <span className="text-sm md:text-base">{section.title}</span>
                  {openSection === i ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content - Full width on mobile */}
        <main className="lg:w-3/4 bg-white rounded-xl shadow-md p-4 md:p-6">
          {policySections.map((section, i) => (
            <div
              key={i}
              className="border-b border-gray-200 last:border-0 py-3 md:py-4"
            >
              <button
                onClick={() => toggleSection(i)}
                className="w-full flex justify-between items-center text-left"
              >
                <h3 className="text-lg md:text-xl font-semibold flex items-center">
                  <FiFileText className="mr-2 text-[#2f415d]" />
                  {section.title}
                </h3>
                {openSection === i ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
              </button>
              {openSection === i && (
                <div className="mt-2 md:mt-3 text-gray-700 whitespace-pre-line animate-fade-in text-sm md:text-base">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;