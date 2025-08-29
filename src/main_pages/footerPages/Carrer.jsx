"use client";
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiBriefcase, FiMail, FiPhone } from "react-icons/fi";

const Career = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const jobSections = [
    {
      title: "Human Resources",
      icon: <FiBriefcase className="mr-2" />,
      jobs: [
        {
          role: "H.R (Min Exp - 5 Years in Corporate Company)",
          gender: "Male/Female",
          salary: "30k - 50k",
        },
      ],
    },
    {
      title: "E-Commerce Management",
      icon: <FiBriefcase className="mr-2" />,
      jobs: [
        {
          role: "B-B Handling Portal (Min Exp 5-10 Years in E-Commerce)",
          gender: "Male/Female",
          salary: "30k - 50k",
        },
        {
          role: "B-C (Min Exp 5-10 Years in E-Commerce)",
          gender: "Male/Female",
          salary: "30k - 50k",
        },
      ],
    },
    {
      title: "Logistics",
      icon: <FiBriefcase className="mr-2" />,
      jobs: [
        {
          role: "Logistic Handler (Min Exp of 5 Years in E-Commerce Sector)",
          gender: "Male/Female",
          salary: "25k - 40k",
        },
      ],
    },
    {
      title: "Customer Service",
      icon: <FiBriefcase className="mr-2" />,
      jobs: [
        {
          role: "Tele-Caller (Min Exp 5 Years)",
          gender: "Male/Female",
          salary: "8k - 12k",
        },
      ],
    },
    {
      title: "Sales & Marketing",
      icon: <FiBriefcase className="mr-2" />,
      jobs: [
        {
          role: "Business Development Manager (Min Exp 5 Years in Sales & Marketing)",
          gender: "Male/Female",
          salary: "20k - 30k",
          extra: "100 posts available (From every district of Bihar)",
        },
        {
          role: "Business Development Manager (Min Exp 5 Years in Sales & Marketing)",
          gender: "Male/Female",
          salary: "30k - 40k",
          extra: "38 posts (For every district in Bihar)",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="absolute inset-0  bg-opacity-30" style={{
          backgroundImage: "url('/contact.avif')",
        }}></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            Elderwise Shopping India Pvt Ltd — Grow with us and shape the future of e-commerce in India
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto  px-4 py-10 sm:px-6 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                Departments
              </h2>
              <ul className="space-y-3">
                {jobSections.map((section, index) => (
                  <li key={index}>
                    <button
                      onClick={() => toggleSection(index)}
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition ${activeSection === index
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-gray-100"
                        }`}
                    >
                      {section.icon}
                      {section.title}
                      <span className="ml-auto">
                        {activeSection === index ? <FiChevronUp /> : <FiChevronDown />}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h3 className="font-semibold mb-2 text-[#2f615d]">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">Reach out to our HR team for job applications.</p>
                <button className="w-full bg-[#2f415d] hover:bg-[#e96f84] text-white py-2 px-4 transition flex items-center justify-center">
                  <FiMail className="mr-2" />
                  Contact HR
                </button>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#2f415d] to-[#2f415d] p-6 text-white">
                <h2 className="text-2xl font-bold">Current Openings</h2>
                <p className="opacity-90">Explore opportunities and apply now</p>
              </div>

              <div className="divide-y divide-gray-200">
                {jobSections.map((section, sIndex) => (
                  <div key={sIndex} className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                      {section.icon}
                      {section.title}
                    </h3>
                    <div className="space-y-4">
                      {section.jobs.map((job, jIndex) => (
                        <div
                          key={jIndex}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
                        >
                          <h4 className="font-medium text-lg text-[#2f415d]-600">{job.role}</h4>
                          <p className="text-gray-600">Gender: {job.gender}</p>
                          <p className="text-gray-600">Salary: {job.salary}</p>
                          {job.extra && <p className="text-gray-600">{job.extra}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact HR Section */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#2f415d]">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FiMail className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Email HR</h3>
                    <p className="text-gray-600 mb-3">
                      Send us your resume and we’ll get back to you.
                    </p>
                    <a href="mailto:hr@ewshopping.com" className="text-blue-500 hover:underline">
                      hr@ewshopping.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#e96f84]">
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FiPhone className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Call HR</h3>
                    <p className="text-gray-600 mb-3">
                      Our HR team is available Mon–Sat, 9 AM to 6 PM
                    </p>
                    <a href="tel:+9118005551234" className="text-green-500 hover:underline">
                      1-800-555-1234
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;