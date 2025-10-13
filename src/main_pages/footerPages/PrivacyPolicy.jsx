"use client";
import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiCalendar,
} from "react-icons/fi";

const PrivacyPolicy = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const policySections = [
    {
      title: "Introduction",
      content: `This Privacy Policy explains how EW Shopping, operating under the company name Elderwise Shopping India Pvt. Ltd. ("Company", "we", "us", or "our"), collects, uses, discloses and safeguards your personal data/information whenever you visit or purchase through our website www.ewshopping.com and mobile application.

By using our platform, you confirm that you have read, understood, and agree to the standards described in this Privacy Policy.`,
    },
    {
      title: "Information/Data we collect",
      content: `We may collect and process the following information/data to provide and improve our services:

1.1 Personal Information
We may collect information that defines personal identity. This may include:
• Full Name
• Contact details (Email, address (billing & shipping), phone number)
• Gender, D.O.B (if provided)
• Payment information (through 3rd party gateways)

1.2 Non-personal Information
We may collect information that does not directly identify you, including:
• Browser type & IP address
• Website usage data, include visited pages and duration

1.3 Information from 3rd parties
We may collect data from marketing partners, analytics providers and social media channels to improve our services and personalise your experience.`,
    },
    {
      title: "Purpose of Data Collection",
      content: `Your information and data are collected and processed only for legitimate business purposes, including:

• Processing, shipping, and delivering orders
• Managing your EW Shopping account
• Providing customer support and assistance
• Sending order updates, promotional offers, and personalised recommendations
• Enhancing platform performance and user experience
• Preventing fraud, unauthorised access, and misuse
• Complying with legal obligations and resolving disputes`,
    },
    {
      title: "Cookies and Tracking Technologies",
      content: `We may use cookies and similar technologies to enhance user experience. Cookies help us to remember user preferences, track website performance, and show you relevant content or Ads.

You have full authority to disable cookies through your browser settings. But doing so may limit your access to certain features of our platform.`,
    },
    {
      title: "Data Security",
      content: `We utilise severe physical, electronic, and administrative safeguards to protect your personal data from unauthorised access, disclosure, alteration, or destruction.

All transactions are encrypted and processed through secure 3rd party payment gateways compliant with current data security standards. While we take all the necessary precautions, no online transaction is completely secure, and users are advised to take caution when sharing personal information online.`,
    },
    {
      title: "Data Retention",
      content: `We keep your personal information/data for as long as necessary for the purposes outlined in this Privacy Policy. Once data is no longer required, it will be deleted securely.`,
    },
    {
      title: "Sharing of Information",
      content: `We may share your information/data in the following circumstances:

• Service Providers: With logistics, payment, and customer support partners who help us deliver our services.

• Affiliates: With group companies or subsidiaries of Elderwise Shopping India Pvt. Ltd.

• Legal Compliance: When required by law, government authorities, or to protect EW Shopping legal rights.

• Business Transfers: In case of a merger, acquisition, or restructuring, your information/data may be transferred to the new entity under the same terms of protection.

Note: We don't sell, rent, or lease your personal data to third parties for marketing purposes.`,
    },
    {
      title: "Your Rights",
      content: `As a user, you have several rights:

• You can access, correct, or update your personal information/data
• You can withdraw consent for marketing communications
• You can request for deletion of your account or personal data/information
• If you feel your rights have been violated, you can file a complaint with the data protection authorities

You may use these user rights by contacting us at info@ewshopping.com.`,
    },
    {
      title: "Privacy Policy for children and minors",
      content: `All of our services are intended for users aged 18 and above. EW Shopping does not intentionally collect or process personal information/data from minors. If any of the information is mistakenly collected from our side. It will be deleted immediately.`,
    },
    {
      title: "External Links",
      content: `Our platform may contain external links to 3rd party websites. We are not responsible for the privacy practices or content of such external sites. We highly recommend that you carefully read their privacy policies before giving any information or data.`,
    },
    {
      title: "Responsibility limitations",
      content: `While we do our best to ensure data security, we shall not be responsible for the following:

• Any unauthorised access outside our control
• Breach or misuse of data caused by third-party service providers or user error
• Technical failures, cyberattacks, or natural disasters affecting our systems`,
    },
    {
      title: "Jurisdiction and Governing Law",
      content: `This Privacy Policy is governed by the laws of India. Any conflicts that arise from this Privacy Policy shall be subject to the jurisdiction of the New Delhi court, India.`,
    },
    {
      title: "Updates in this Privacy Policy",
      content: `We may update this Privacy Policy from time to time to reflect changes in business or legal requirements. The revised Privacy Policy will be effective after posting on this page.`,
    },
    {
      title: "Grievance Settlement & Contact Information",
      content: `For any of your concerns, queries or grievances related to this Privacy Policy or our data handling procedure, you may contact our designated grievance officer:

Name: Grievance Officer – EW Shopping
Company: Elderwise Shopping India Pvt. Ltd.
Address: Rajendra Place, New Delhi, India – 110008
Phone: +91 8447282606
Email: info@ewshopping.com`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 sm:mb-0 mb-20 to-white">
      {/* Hero Section */}
      <div
        className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/privacy.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      ></div>

      {/* Main Content */}
      <div className="container mx-auto px-1 sm:px-6 sm:py-8 py-2 flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Sidebar Navigation */}
        <aside className="sm:w-1/4 bg-white sm:block hidden rounded-xl shadow-md p-4 sm:p-6 sm:sticky sm:top-8 h-fit">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#2f415d]">
            Quick Navigation
          </h2>
          <ul className="space-y-2">
            {policySections.map((section, i) => (
              <li key={i}>
                <button
                  onClick={() => toggleSection(i)}
                  className={`w-full flex justify-between items-center text-left px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 ${
                    openSection === i
                      ? "bg-blue-100 text-[#2f415d] border-l-4 border-[#2f415d]"
                      : "hover:bg-gray-100 hover:border-l-4 hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm sm:text-base font-medium">
                    {section.title}
                  </span>
                  {openSection === i ? (
                    <FiChevronUp size={16} />
                  ) : (
                    <FiChevronDown size={16} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Policy Content */}
        <main className="sm:w-3/4 bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="mb-4 sm:mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2f415d] mb-2">
              EW Shopping Privacy Policy
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Protecting your privacy is our priority. This policy outlines how
              we collect, use, and safeguard your information.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {policySections.map((section, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleSection(i)}
                  className="w-full flex justify-between items-center text-left p-3 sm:p-4 hover:bg-gray-50 rounded-lg"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-[#2f415d] flex items-center">
                    <FiFileText className="mr-2 sm:mr-3 text-[#2f415d]" />
                    {section.title}
                  </h3>
                  {openSection === i ? (
                    <FiChevronUp size={18} className="text-[#2f415d]" />
                  ) : (
                    <FiChevronDown size={18} className="text-[#2f415d]" />
                  )}
                </button>
                {openSection === i && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4 animate-fade-in">
                    <div className="text-gray-700 whitespace-pre-line text-base sm:text-lg leading-relaxed">
                      {section.content.split("\n").map((line, index) => {
                        if (
                          line.trim().startsWith("•") ||
                          line.trim().startsWith("-")
                        ) {
                          return (
                            <div
                              key={index}
                              className="flex items-start mb-1 sm:mb-2"
                            >
                              <span className="mr-2">•</span>
                              <span>{line.substring(1).trim()}</span>
                            </div>
                          );
                        } else if (/^\d+\.\d+/.test(line.trim())) {
                          // For numbered sub-sections like 1.1, 1.2
                          return (
                            <div
                              key={index}
                              className="font-semibold text-gray-800 mt-2 sm:mt-3 mb-1 sm:mb-2"
                            >
                              {line}
                            </div>
                          );
                        } else if (line.trim() === "") {
                          return <br key={index} />;
                        } else {
                          return (
                            <p key={index} className="mb-2 sm:mb-3">
                              {line}
                            </p>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-base sm:text-lg text-gray-700 text-center">
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:info@ewshopping.com"
                className="text-[#2f415d] font-semibold hover:underline"
              >
                info@ewshopping.com
              </a>
            </p>
          </div>
        </main>
      </div>

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
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
