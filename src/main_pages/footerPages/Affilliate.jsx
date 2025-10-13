"use client";
import React, { useState } from "react";
import { FiFileText, FiChevronDown } from "react-icons/fi";
import { useSelector } from "react-redux";

const Affilliate = () => {
  const { fillteredCategory } = useSelector((store) => store.category);
  const sections = [
    {
      title: "Fast & Easy Signup",
      content:
        "No complicated steps. Just apply, get approved, and start promoting.",
    },
    {
      title: "Big Commissions",
      content: "Earn great commissions on successful sales.",
    },
    {
      title: "30-Day Attribution Window",
      content:
        "Users who click your link and purchase within 30 days provide you with credit.",
    },
    {
      title: "Wide Product Catalogue",
      content:
        "Access EWShopping's vast catalogue of electronics, fashion, accessories, home décor, and more.",
    },
    {
      title: "Creative Assets & Promo Support",
      content:
        "For Banners, product feeds, and seasonal campaigns, we'll provide the tools to drive conversions.",
    },
    {
      title: "Bonus & Incentive Programs",
      content:
        "Boost your earnings from time to time through extra rewards or contests.",
    },
    {
      title: "Reliable & Trusted Brand",
      content:
        "EWShopping is dedicated to authenticity, quality, secure payments, and excellent customer support.",
    },
  ];

  const programSteps = [
    {
      step: "1",
      title: "Apply",
      description: "Complete our simple and short affiliate registration",
    },
    {
      step: "2",
      title: "Get Approved",
      description:
        "After successful verification, you can access your affiliate dashboard",
    },
    {
      step: "3",
      title: "Promote",
      description:
        "Use your individual affiliate links, banners, and widgets to promote EW Shopping",
    },
    {
      step: "4",
      title: "Earn",
      description:
        "When someone buys from your link within a time frame (approx. 30 days), you get commission.",
    },
    {
      step: "5",
      title: "Get Paid",
      description:
        "Commissions are distributed on a regular basis per program (e.g. monthly)",
    },
  ];

  const faq = [
    {
      q: "What is an affiliate?",
      a: "An affiliate is someone who promotes products (through blogs, social media, websites, etc.) and earns a commission when sales are made via their links.",
    },
    {
      q: "How do I become an affiliate?",
      a: "Fill out the application form, provide your website or promotional channel details, and await approval.",
    },
    {
      q: "Which products can I promote?",
      a: "You can promote across all categories: electronics, fashion, home décor, accessories, and more. (Your affiliate dashboard will provide the full product catalogue or feed.)",
    },
    {
      q: "How and when do I get paid?",
      a: "We issue payments according to the payout schedule defined in your affiliate agreement. (E.g., monthly, minimum payout threshold.)",
    },
    {
      q: "Are there any restrictions?",
      a: "➔ No self-referrals or purchases using your own links.\n➔ Must adhere to EWShopping's brand & marketing guidelines.\n➔ Commissions may not apply to discounted or promotional pricing beyond standard levels (depends on terms).",
    },
  ];

  const whyPromote = [
    "Trusted Brand & Infrastructure - With secure payments, transparent policies, and committed customer support, we maintain strong brand trust.",
    "Massive Reach & Diverse Catalogue - Covering fashion, electronics, home goods, and more, multiple niches for your audience.",
    "Marketing & Seasonal Push - From festival sales to special launch events, we run campaigns so you can utilise them to increase sales conversions.",
    "Fair & Transparent Payouts - Clear commission structure, 30-day window, and reporting tools to track your performance.",
  ];

  const termsConditions = [
    "Affiliates must provide accurate promotional details and follow all usage guidelines.",
    "No misleading claims or misrepresentations.",
    "Refunds or order cancellations may affect commission eligibility.",
    "EWShopping reserves the right to suspend or terminate accounts violating policies.",
    "Full detailed terms will be provided in your affiliate agreement/contract.",
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white sm:mb-0 mb-20">
      {/* Hero Banner */}
      <div
        className="w-full h-32 md:h-70 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/Affilatedmarketin.png')",
          backgroundSize: "100% 100%",
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-2 py-4 sm:px-6 sm:py-16 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-1/4 sm:block hidden">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 sticky top-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 border-b pb-2">
              Sections
            </h2>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#welcome"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg text-sm"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> Welcome
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg text-sm"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> Benefits
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg text-sm"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> How It Works
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg text-sm"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> FAQ
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg text-sm"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> Categories
                </a>
              </li>
              <li>
                <a
                  href="#why-promote"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg text-sm"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> Why Promote
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg text-sm"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> Terms &
                  Conditions
                </a>
              </li>
              <li>
                <a
                  href="#get-started"
                  className="flex items-center hover:bg-gray-100 px-3 py-2 rounded-lg text-sm"
                >
                  <FiFileText className="mr-2 text-[#2f415d]" /> Get Started
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:w-3/4 bg-white rounded-xl shadow-md p-4 sm:p-8">
          {/* Welcome Section */}
          <section id="welcome" className="mb-6 sm:mb-10">
            <h1 className="text-lg sm:text-3xl font-bold mb-3 sm:mb-4 text-[#2f415d]">
              EWShopping Affiliate Program
            </h1>
            <p className="text-xs sm:text-base text-gray-700 mb-4 sm:mb-6">
              Welcome to the EW Shopping Affiliate Program. Your gateway to
              earning commissions by promoting India's best e-commerce platform.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6">
              <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2 text-[#e96f84]">
                Why Become an EWShopping Affiliate?
              </h3>
              <p className="text-xs sm:text-base text-gray-700">
                Partnering with EW Shopping means joining a growing e-commerce
                marketplace and earning from product promotions. This affiliate
                program is created with simplicity, transparency, and big
                rewards in mind.
              </p>
            </div>
          </section>

          {/* Benefits */}
          <section id="benefits" className="mb-6 sm:mb-10">
            <h3 className="text-base sm:text-2xl font-bold mb-4 sm:mb-6 text-[#e96f84]">
              Benefits of Becoming an EW Shopping Affiliate
            </h3>
            <p className="text-xs sm:text-base text-gray-700 mb-4 sm:mb-6">
              Becoming an EW Shopping Affiliate brings several benefits for you,
              such as:
            </p>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {sections.map((sec, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <h4 className="font-semibold text-sm sm:text-lg mb-2 sm:mb-3 text-[#2f415d]">
                    {sec.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="mb-6 sm:mb-10">
            <h3 className="text-base sm:text-2xl font-bold mb-4 sm:mb-6 text-[#2f415d]">
              How Affiliate Program Works?
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {programSteps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start p-3 sm:p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex-shrink-0 w-5 h-5 sm:w-8 sm:h-8 bg-[#e96f84] text-white rounded-full flex items-center justify-center font-bold mr-3 text-xs sm:text-base">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm sm:text-lg text-[#2f415d]">
                      {step.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-6 sm:mb-10">
            <h3 className="text-base sm:text-2xl font-bold mb-4 sm:mb-6 text-[#2f415d]">
              Frequently Asked Questions
            </h3>
            <div className="divide-y border border-gray-200 rounded-lg">
              {faq.map((item, i) => (
                <div key={i} className="p-3 sm:p-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-[#e96f84]"
                  >
                    <span className="text-sm sm:text-lg">{item.q}</span>
                    <FiChevronDown
                      className={`transition-transform ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg whitespace-pre-line">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section id="categories" className="mb-6 sm:mb-10">
            <h3 className="text-base sm:text-2xl font-bold mb-4 sm:mb-6 text-[#e96f84]">
              Top Categories
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {fillteredCategory &&
                fillteredCategory?.slice(0, 25).map((cat, i) => (
                  <li
                    key={i}
                    className="p-2 sm:p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 text-center text-xs sm:text-sm"
                  >
                    {cat.name}
                  </li>
                ))}
            </ul>
          </section>

          {/* Why Promote */}
          <section id="why-promote" className="mb-6 sm:mb-10">
            <h3 className="text-base sm:text-2xl font-bold mb-4 sm:mb-6 text-[#e96f84]">
              Why Promote EW Shopping?
            </h3>
            <div className="bg-gray-50 p-3 sm:p-6 rounded-lg border border-gray-200">
              <ul className="space-y-2 sm:space-y-3">
                {whyPromote.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-[#e96f84] mr-2 text-xs sm:text-sm">
                      ●
                    </span>
                    <span className="text-xs sm:text-sm text-gray-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Terms & Conditions */}
          <section id="terms" className="mb-6 sm:mb-10">
            <h3 className="text-base sm:text-2xl font-bold mb-4 sm:mb-6 text-[#2f415d]">
              Affiliate Terms & Conditions
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-6">
              <ul className="text-gray-700 space-y-2 sm:space-y-3">
                {termsConditions.map((term, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-[#e96f84] mr-2 text-xs sm:text-sm">
                      {i + 1}.
                    </span>
                    <span className="text-xs sm:text-sm">{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Get Started */}
          <section
            id="get-started"
            className="text-center py-4 sm:py-8 bg-gradient-to-r from-[#2f415d] to-[#e96f84] rounded-lg text-white"
          >
            <h3 className="text-base sm:text-2xl font-bold mb-2 sm:mb-4">
              Ready to Get Started?
            </h3>
            <p className="mb-4 sm:mb-6 text-xs sm:text-lg">
              If you're ready to monetise your content or audience, join the
              EWShopping affiliate network now. Sign up, promote, and earn.
            </p>
            <button className="bg-white text-[#2f415d] px-4 sm:px-8 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors text-xs sm:text-base">
              Apply Now → Affiliate Registration Link
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Affilliate;
