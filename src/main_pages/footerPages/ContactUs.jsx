"use client";
import React, { useState, useEffect } from "react";
import { FormControl } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  contactPost,
  clearContactState,
} from "../../redux/contactUs/ContactUsSlice";

const ContactUs = () => {
  const dispatch = useDispatch();
  const { contactLoading, success, error } = useSelector(
    (state) => state.contacts
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  });

  const [localErrors, setLocalErrors] = useState({});

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Allow only digits and limit to 10 characters
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData({
        ...formData,
        [name]: cleaned,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear local error when user starts typing
    if (localErrors[name]) {
      setLocalErrors({
        ...localErrors,
        [name]: "",
      });
    }
  };

  // Simplified validation - only check required fields
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";

    // 📱 Phone number validation (10 digits only)
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";

    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(contactPost(formData));
    }
  };

  // Handle reset
  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      subject: "",
      message: "",
    });
    setLocalErrors({});
    dispatch(clearContactState());
  };

  // Auto-clear success message and reset form after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearContactState());
        handleReset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Clear error after 8 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearContactState());
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Map component
  const MapView = () => {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.489240333236!2d77.1653102753375!3d28.647647175656044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0292aa1e4c9d%3A0x5e664816f32b7c8c!2sRajendra%20Place%2C%20New%20Delhi%2C%20Delhi%20110008!5e0!3m2!1sen!2sin!4v1698765432100!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="EWShopping Location Map"
        ></iframe>
      </div>
    );
  };

  return (
    <div className="bg-white text-gray-800 sm:mb-0 mb-10">
      <div className="md:block hidden">
        <div
          className="w-full h-50 md:h-60 bg-no-repeat bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1763032629259.webp')",
            backgroundSize: "cover",
          }}
        ></div>
      </div>
      <div className="md:hidden block">
        <div
          className="w-full h-40 md:h-60 bg-no-repeat bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1764049753183.webp')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
      <div className="flex items-center justify-center w-full bg-gray-100 p-1 sm:p-6 md:p-9 min-h-screen">
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Section - Contact Info & Map */}
          <div className="min-h-[400px] md:min-h-[600px] flex flex-col">
            {/* Contact Info Card */}
            <div className="bg-gradient-to-br from-[#2f415d] to-[#1e2a3a] text-white p-1">
              <div className="space-y-1">
                <div className="flex items-start gap-4 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <span className="text-xl mt-0.5 flex-shrink-0">📍</span>
                  <div>
                    <p className="font-semibold text-blue-200">Our Address</p>
                    <p className="text-sm mt-1">
                      Ewshopping Rajendra Place, New Delhi, Pin-110008
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <span className="text-xl mt-0.5 flex-shrink-0">📞</span>
                  <div>
                    <p className="font-semibold text-blue-200">Phone Number</p>
                    <a
                      href="tel:+918447282606"
                      className="text-sm mt-0.5 hover:text-blue-100 transition-colors"
                    >
                      +91 8447282606
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <span className="text-xl mt-0.5 flex-shrink-0">✉</span>
                  <div>
                    <p className="font-semibold text-blue-200">Email Address</p>
                    <a
                      href="mailto:info@ewshopping.com"
                      className="text-sm mt-1 hover:text-blue-100 transition-colors"
                    >
                      info@ewshopping.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="flex-1 relative">
              <MapView />
            </div>
          </div>

          {/* Right Form Section */}
          <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Send Us a Message
            </h1>

            {/* Success Message */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                ✅ Your message has been sent successfully!
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                ❌{" "}
                {error.message ||
                  error.errors?.[0] ||
                  "Something went wrong. Please try again."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormControl fullWidth>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base ${
                    localErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {localErrors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {localErrors.name}
                  </p>
                )}
              </FormControl>

              <FormControl fullWidth>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base ${
                    localErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {localErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {localErrors.email}
                  </p>
                )}
              </FormControl>

              <FormControl fullWidth>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="number"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength={10}
                  required
                  className={`w-full border rounded-lg px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base ${
                    localErrors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {localErrors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {localErrors.phoneNumber}
                  </p>
                )}
              </FormControl>

              <FormControl fullWidth>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter the subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base ${
                    localErrors.subject ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {localErrors.subject && (
                  <p className="text-red-500 text-xs mt-1">
                    {localErrors.subject}
                  </p>
                )}
              </FormControl>

              <FormControl fullWidth>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Message *
                </label>
                <textarea
                  name="message"
                  placeholder="Enter your message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={`w-full border rounded-lg px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm sm:text-base ${
                    localErrors.message ? "border-red-500" : "border-gray-300"
                  }`}
                ></textarea>
                {localErrors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {localErrors.message}
                  </p>
                )}
              </FormControl>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="flex-1 bg-[#2f415d] text-white py-2 sm:py-3 px-4 hover:bg-[#e96f84] transition-all text-sm sm:text-base disabled:opacity-70 rounded-lg font-medium"
                >
                  {contactLoading ? "Sending..." : "Send Message"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={contactLoading}
                  className="flex-1 bg-gray-600 text-white py-2 sm:py-3 px-4 hover:bg-gray-700 transition-all text-sm sm:text-base disabled:opacity-70 rounded-lg font-medium"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
