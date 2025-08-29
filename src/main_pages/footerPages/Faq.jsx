
"use client"
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiMail, FiPhone, FiShoppingBag } from "react-icons/fi";

const Faq = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [openQuestion, setOpenQuestion] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const toggleQuestion = (index) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    const faqSections = [
        {
            title: "My Account & My Order",
            icon: <FiShoppingBag className="mr-2" />,
            questions: [
                {
                    question: "How do I place an order?",
                    answer: (
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Browse categories and add products to your cart</li>
                            <li>Click on "My Cart" and proceed to checkout</li>
                            <li>Check out as a guest or by creating an account</li>
                            <li>Select payment method and confirm your order</li>
                            <li>Receive confirmation via email and SMS</li>
                        </ol>
                    )
                },
                {
                    question: "How will I receive my order?",
                    answer: "We ship to your provided address via trusted courier services in fully sealed packages to ensure perfect condition delivery."
                }
            ]
        },
        {
            title: "Cancellation & Returns",
            icon: <FiMail className="mr-2" />,
            questions: [
                {
                    question: "What is your cancellation policy?",
                    answer: "You can cancel within 24 hours of placing the order by emailing info@EWShopping.com with your order ID."
                },
                {
                    question: "What is your return policy?",
                    answer: "We offer a 7-day return policy. Products must be unused with original tags and packaging."
                }
            ]
        },
        {
            title: "Payment Methods",
            icon: <FiPhone className="mr-2" />,
            questions: [
                {
                    question: "Are there any hidden charges?",
                    answer: "No hidden charges. You pay only the amount shown in your order summary."
                },
                {
                    question: "What if my payment fails?",
                    answer: "Check your account details and internet connection. Failed payments are automatically refunded within 7-10 business days."
                }
            ]
        }
    ];

    const popularQuestions = [
        "How do I track my order?",
        "What payment methods do you accept?",
        "How long does shipping take?",
        "Can I change my delivery address?",
        "Do you ship internationally?"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
                <div className="absolute inset-0 bg-opacity-50 bg-black">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-20"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-5xl font-bold mb-6 animate-fade-in">How can we help you?</h1>
                    {/* <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            className="w-full py-4 px-6 rounded-full shadow-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="absolute right-2 top-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div> */}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Quick Links</h2>
                            <ul className="space-y-3">
                                {faqSections.map((section, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => toggleSection(index)}
                                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition ${activeSection === index ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                                        >
                                            {section.icon}
                                            {section.title}
                                            <span className="ml-auto">
                                                {activeSection === index ? <FiChevronUp /> : <FiChevronDown />}
                                            </span>
                                        </button>
                                        {activeSection === index && (
                                            <ul className="pl-8 mt-2 space-y-2">
                                                {section.questions.map((q, qIndex) => (
                                                    <li key={qIndex}>
                                                        <a
                                                            href={`#q-${index}-${qIndex}`}
                                                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-500 transition"
                                                            onClick={() => setOpenQuestion(`${index}-${qIndex}`)}
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

                            <div className="mt-8">
                                <h3 className="font-semibold mb-4 text-gray-800">Popular Questions</h3>
                                <ul className="space-y-2">
                                    {popularQuestions.map((question, index) => (
                                        <li key={index}>
                                            <a href="#" className="text-sm text-gray-600 hover:text-blue-500 transition flex items-center">
                                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                                {question}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <h3 className="font-semibold mb-2 text-blue-800">Need more help?</h3>
                                <p className="text-sm text-gray-600 mb-3">Can't find what you're looking for?</p>
                                <button className="w-full bg-[#e96f84] hover:bg-[#2f415d] text-white py-2 px-4 rounded-lg transition flex items-center justify-center">
                                    <FiMail className="mr-2" />
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Content */}
                    <div className="lg:w-3/4">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            {/* Section Header */}
                            <div className="bg-gradient-to-r from-[#2d414d] to-[#2d414d] p-6 text-white">
                                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                                <p className="opacity-90">Find answers to common questions about our services</p>
                            </div>

                            {/* FAQ Items */}
                            <div className="divide-y divide-gray-200">
                                {faqSections.map((section, sIndex) => (
                                    <div key={sIndex} className="p-6">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                            {section.icon}
                                            {section.title}
                                        </h3>
                                        <div className="space-y-4">
                                            {section.questions.map((item, qIndex) => (
                                                <div
                                                    key={qIndex}
                                                    id={`q-${sIndex}-${qIndex}`}
                                                    className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
                                                >
                                                    <button
                                                        onClick={() => toggleQuestion(`${sIndex}-${qIndex}`)}
                                                        className={`w-full text-left p-4 flex items-center justify-between ${openQuestion === `${sIndex}-${qIndex}` ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                                    >
                                                        <span className="font-medium">{item.question}</span>
                                                        {openQuestion === `${sIndex}-${qIndex}` ? (
                                                            <FiChevronUp className="text-blue-500" />
                                                        ) : (
                                                            <FiChevronDown className="text-gray-500" />
                                                        )}
                                                    </button>
                                                    {openQuestion === `${sIndex}-${qIndex}` && (
                                                        <div className="p-4 bg-white text-gray-600 animate-fade-in">
                                                            {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
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
                        <div className="mt-8 grid md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                                        <FiMail className="text-blue-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Email Support</h3>
                                        <p className="text-gray-600 mb-3">Send us an email and we'll get back to you within 24 hours</p>
                                        <a href="mailto:support@ewshopping.com" className="text-blue-500 hover:underline">support@ewshopping.com</a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
                                <div className="flex items-start">
                                    <div className="bg-green-100 p-3 rounded-full mr-4">
                                        <FiPhone className="text-green-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Call Us</h3>
                                        <p className="text-gray-600 mb-3">Our customer service team is available 24/7</p>
                                        <a href="tel:+18005551234" className="text-green-500 hover:underline">1-800-555-1234</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Guide */}
                        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Video Guide</h3>
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition transform hover:scale-105">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-4 text-gray-600">Watch our 2-minute tutorial on how to place an order</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Styles */}
            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default Faq;