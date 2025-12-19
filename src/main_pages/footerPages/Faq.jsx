"use client";
import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiPhone,
  FiShoppingBag,
  FiInfo,
  FiX,
} from "react-icons/fi";

const Faq = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqSections = [
    {
      title: "Orders & Shipping",
      icon: <FiShoppingBag className="mr-2" />,
      questions: [
        {
          question: "How do I track my order?",
          answer:
            "Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order in real-time through our website or the carrier's website.",
        },
        {
          question: "What are the shipping charges?",
          answer:
            "Shipping charges vary based on your location and order value. We offer free shipping on orders above ₹999. Exact shipping costs are displayed at checkout.",
        },
        {
          question: "How long does delivery take?",
          answer:
            "Standard delivery takes 3-7 business days. Express delivery options are available for metro cities with 1-2 day delivery. Delivery times may vary during festive seasons.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Currently, we only ship within India. We're working on expanding our international shipping services in the near future.",
        },
      ],
    },
    {
      title: "Returns & Refunds",
      icon: <FiMail className="mr-2" />,
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 7-day return policy from the delivery date. Products must be unused, in original packaging with all tags attached. Some items like innerwear, personal care products, and customized items are non-returnable.",
        },
        {
          question: "How do I initiate a return?",
          answer:
            "Log into your account → Go to 'My Orders' → Select the item → Click 'Return' → Choose reason → Schedule pickup. Our team will collect the product within 48 hours.",
        },
        {
          question: "How long do refunds take?",
          answer:
            "Refunds are processed within 7-10 business days after we receive and inspect the returned product. The time may vary depending on your payment method and bank.",
        },
        {
          question: "What if I receive a damaged product?",
          answer:
            "Contact us within 48 hours of delivery at support@ewshopping.com with photos of the damaged product and packaging. We'll arrange a replacement or refund immediately.",
        },
      ],
    },
    {
      title: "Payments & Pricing",
      icon: <FiPhone className="mr-2" />,
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major payment methods including Credit/Debit Cards, UPI, Net Banking, Wallet payments (Paytm, PhonePe), and Cash on Delivery (available for most pin codes).",
        },
        {
          question: "Is Cash on Delivery available?",
          answer:
            "Yes, Cash on Delivery is available for orders up to ₹10,000. Additional COD charges may apply depending on your location and order value.",
        },
        {
          question: "Are there any hidden charges?",
          answer:
            "No hidden charges. The price you see is the price you pay. Shipping charges and any applicable taxes are clearly displayed before you complete your purchase.",
        },
        {
          question: "My payment failed. What should I do?",
          answer:
            "Check your internet connection, ensure sufficient balance, and try again. If the problem persists, contact your bank or try an alternative payment method. Failed payments are automatically refunded within 24 hours.",
        },
      ],
    },
    {
      title: "Account & Security",
      icon: <FiShoppingBag className="mr-2" />,
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "Click on 'Sign Up' and enter your email address or mobile number. Verify through OTP and set your password. You can also sign up using your Google account for faster registration.",
        },
        {
          question: "I forgot my password. How to reset?",
          answer:
            "Click on 'Forgot Password' on the login page. Enter your registered email/mobile to receive reset instructions. Follow the link to create a new password.",
        },
        {
          question: "How do I update my personal information?",
          answer:
            "Log into your account → Go to 'My Profile' → Edit your details → Save changes. You can update your address, contact information, and preferences anytime.",
        },
        {
          question: "Is my personal information secure?",
          answer:
            "Yes, we use industry-standard SSL encryption to protect your data. We never share your personal information with third parties without your consent. Read our Privacy Policy for more details.",
        },
      ],
    },
  ];

  const popularQuestions = [
    "How do I track my order?",
    "What is your return policy?",
    "Do you offer Cash on Delivery?",
    "How long does delivery take?",
    "What payment methods do you accept?",
    "How do I create an account?",
    "Are there any hidden charges?",
    "Do you ship internationally?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Dialog */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 sm:py-20">
        <div className="absolute inset-0 bg-opacity-50 bg-black">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in">
            How can we help you?
          </h1>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 opacity-90">
            Find answers to all your questions about EW Shopping
          </p>

          {/* Dialog Trigger Button */}
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <FiInfo className="text-base sm:text-lg" />
            EW Shopping FAQs Guide
          </button>
        </div>
      </div>

      {/* FAQ Dialog Box */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            {/* <div className="bg-[#2f415d] p-4 sm:p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    EW Shopping FAQs Guide
                  </h2>
                  <p className="text-blue-100 mt-1 text-xs sm:text-sm">
                    Quick Help & Support Information
                  </p>
                </div>
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 sm:p-2 rounded-full transition-all duration-200"
                >
                  <FiX className="text-lg sm:text-xl" />
                </button>
              </div>
            </div> */}

            {/* Content */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                    Welcome to EW Shopping FAQs
                  </h3>
                  <p className="text-blue-700 text-xs sm:text-sm">
                    Find quick answers to common questions about orders,
                    shipping, returns, payments, and more. Our comprehensive FAQ
                    section is designed to help you have the best shopping
                    experience.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                      📦 Orders & Shipping
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Track orders, delivery times, shipping charges
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                      🔄 Returns & Refunds
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Return policy, refund process, damaged items
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                      💳 Payments & Pricing
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Payment methods, COD, pricing queries
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                      🔐 Account & Security
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Account management, password reset, security
                    </p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base">
                    Quick Support
                  </h4>
                  <div className="text-xs sm:text-sm text-green-700 space-y-1">
                    <p>📧 Email: support@ewshopping.com</p>
                    <p>📞 Phone: +91 8447282606</p>
                    <p>⏰ Support: 24/7 Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-3 sm:p-4 bg-gray-50">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-sm sm:text-base"
              >
                Explore FAQs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className=" ">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4 ">
            <div className=" p-2 sm:p-2 md:p-6  lg:sticky lg:top-8 h-fit">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-6 text-gray-800 border-b pb-2">
                Quick Links
              </h2>
              <ul className="space-y-1 sm:space-y-2 md:space-y-3">
                {faqSections.map((section, index) => (
                  <li key={index}>
                    <button
                      onClick={() => toggleSection(index)}
                      className={`w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded-lg flex items-center transition text-xs sm:text-sm md:text-base ${
                        activeSection === index
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {section.icon}
                      <span className="truncate">{section.title}</span>
                      <span className="ml-auto">
                        {activeSection === index ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </span>
                    </button>
                    {activeSection === index && (
                      <ul className="pl-2 sm:pl-4 md:pl-8 mt-1 sm:mt-2 space-y-0.5 sm:space-y-1 md:space-y-2">
                        {section.questions.map((q, qIndex) => (
                          <li key={qIndex}>
                            <a
                              href={`#q-${index}-${qIndex}`}
                              className="block px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-2 text-xs text-gray-600 hover:text-blue-500 transition truncate"
                              onClick={() =>
                                setOpenQuestion(`${index}-${qIndex}`)
                              }
                            >
                              {q.question}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-4 sm:mt-6 md:mt-8">
                <h3 className="font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-800 text-sm sm:text-base">
                  Popular Questions
                </h3>
                <ul className="space-y-0.5 sm:space-y-1 md:space-y-2">
                  {popularQuestions.map((question, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-xs text-gray-600 hover:text-blue-500 transition flex items-center"
                      >
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></span>
                        <span className="truncate">{question}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 sm:mt-6 md:mt-8 bg-blue-50 rounded-lg p-2 sm:p-3 md:p-4 border border-blue-100">
                <h3 className="font-semibold mb-1 sm:mb-2 text-blue-800 text-sm sm:text-base">
                  Need more help?
                </h3>
                <p className="text-xs text-gray-600 mb-2 sm:mb-3">
                  Can't find what you're looking for?
                </p>
                <button className="w-full bg-[#2f415d] hover:bg-blue-700 text-white py-1.5 sm:py-2 px-2 sm:px-3 md:px-4 rounded-lg transition flex items-center justify-center text-xs sm:text-sm md:text-base">
                  <FiMail className="mr-1 sm:mr-2" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:w-3/4">
            <div className=" overflow-hidden p-4 sm:p-2 py-3">
              {/* Section Header */}
              <div className="bg-gradient-to-r from-[#2d414d] to-[#2d414d] p-3 sm:p-4 md:p-6 text-white">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                  Frequently Asked Questions
                </h2>
                <p className="opacity-90 text-xs sm:text-sm md:text-base">
                  Find answers to common questions about EW Shopping services
                </p>
              </div>

              {/* FAQ Items */}
              <div className="divide-y divide-gray-200">
                {faqSections.map((section, sIndex) => (
                  <div key={sIndex} className="p-3 sm:p-4 md:p-6">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-800 flex items-center">
                      {section.icon}
                      {section.title}
                    </h3>
                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                      {section.questions.map((item, qIndex) => (
                        <div
                          key={qIndex}
                          id={`q-${sIndex}-${qIndex}`}
                          className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
                        >
                          <button
                            onClick={() =>
                              toggleQuestion(`${sIndex}-${qIndex}`)
                            }
                            className={`w-full text-left p-2 sm:p-3 md:p-4 flex items-center justify-between text-xs sm:text-sm md:text-base ${
                              openQuestion === `${sIndex}-${qIndex}`
                                ? "bg-blue-50 text-blue-600"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span className="font-medium text-left pr-2 sm:pr-4">
                              {item.question}
                            </span>
                            {openQuestion === `${sIndex}-${qIndex}` ? (
                              <FiChevronUp className="text-blue-500 flex-shrink-0 text-sm sm:text-base" />
                            ) : (
                              <FiChevronDown className="text-gray-500 flex-shrink-0 text-sm sm:text-base" />
                            )}
                          </button>
                          {openQuestion === `${sIndex}-${qIndex}` && (
                            <div className="p-2 sm:p-3 md:p-4 bg-white text-gray-600 animate-fade-in text-xs sm:text-sm md:text-base">
                              {typeof item.answer === "string" ? (
                                <p>{item.answer}</p>
                              ) : (
                                item.answer
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Help Section */}
            <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 border-t-4 border-blue-500">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-1.5 sm:p-2 md:p-3 rounded-full mr-2 sm:mr-3 md:mr-4">
                    <FiMail className="text-blue-600 text-base sm:text-lg md:text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                      Email Support
                    </h3>
                    <p className="text-gray-600 mb-1.5 sm:mb-2 md:mb-3 text-xs sm:text-sm">
                      Send us an email and we'll get back to you within 24 hours
                    </p>
                    <a
                      href="mailto:support@ewshopping.com"
                      className="text-blue-500 hover:underline text-xs sm:text-sm md:text-base"
                    >
                      support@ewshopping.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 border-t-4 border-green-500">
                <div className="flex items-start">
                  <div className="bg-green-100 p-1.5 sm:p-2 md:p-3 rounded-full mr-2 sm:mr-3 md:mr-4">
                    <FiPhone className="text-green-600 text-base sm:text-lg md:text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                      Call Us
                    </h3>
                    <p className="text-gray-600 mb-1.5 sm:mb-2 md:mb-3 text-xs sm:text-sm">
                      Our customer service team is available 24/7
                    </p>
                    <a
                      href="tel:+918447282606"
                      className="text-green-500 hover:underline text-xs sm:text-sm md:text-base"
                    >
                      +91 8447282606
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Guide */}
            <div className="mt-4 sm:mt-6 md:mt-8 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-800">
                  Shopping Guide
                </h3>
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden relative min-h-[150px] sm:min-h-[200px] md:min-h-[250px]">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <div className="text-center p-3 sm:p-4">
                      <FiShoppingBag className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-blue-600 mx-auto mb-2 sm:mb-3 md:mb-4" />
                      <h4 className="font-semibold text-gray-800 text-base sm:text-lg md:text-xl mb-1 sm:mb-2">
                        EW Shopping Guide
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-md">
                        Learn how to shop smarter with our comprehensive
                        shopping guides and tutorials
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 sm:mt-3 md:mt-4 text-gray-600 text-xs sm:text-sm md:text-base">
                  Explore our shopping guides for better shopping experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Faq;
