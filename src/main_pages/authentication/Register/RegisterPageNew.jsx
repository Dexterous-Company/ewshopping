"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  getUserByMob,
  set_checkout_authentication_status,
  signin,
  userRegistation,
  verifyUserEmail,
  verifyUserMobile,
} from "@/redux/athentication/Athentication";

const RegisterPageNew = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { otp, mob } = useSelector((state) => state.Athentication);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: mob || "",
    email: "",
    confirm_email: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    confirm_email: "",
  });

  const [focusedFields, setFocusedFields] = useState({
    fullName: false,
    mobileNumber: false,
    email: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingUser, setExistingUser] = useState(false);
  const [formValid, setFormValid] = useState(false);

  // Check if form is valid
  useEffect(() => {
    const isValid =
      formData.fullName.trim() &&
      formData.mobileNumber.length === 10 &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email) &&
      formData.confirm_email === formData.email &&
      !errors.fullName &&
      !errors.mobileNumber &&
      !errors.email &&
      !errors.confirm_email &&
      !existingUser;

    setFormValid(isValid);
  }, [formData, errors, existingUser]);

  // Fixed auto-capitalize first letter of each word in name
  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.trim() ? "" : "Full name is required";
      case "mobileNumber":
        if (!value) return "Mobile number is required";
        if (!/^\d{10}$/.test(value)) return "Mobile number must be 10 digits";
        return "";
      case "email":
        if (!value) return "Email is required";
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
          return "Invalid email format";
        return "";
      case "confirm_email":
        return value === formData.email ? "" : "Emails don't match";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: formData.fullName ? "" : "Required",
      mobileNumber: formData.mobileNumber
        ? formData.mobileNumber.length < 10
          ? "Enter valid mobile number"
          : errors.mobileNumber === "Mobile already exists"
          ? "Mobile already exists"
          : ""
        : "Required",
      email: formData.email
        ? errors.email === "Email already exists"
          ? "Email already exists"
          : ""
        : "Required",
      confirm_email: formData.confirm_email ? "" : "Required",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleFocus = (field) => {
    setFocusedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusedFields((prev) => ({ ...prev, [field]: false }));

    // Auto-capitalize name when blurring
    if (field === "fullName" && formData.fullName) {
      setFormData((prev) => ({
        ...prev,
        fullName: capitalizeName(prev.fullName),
      }));
    }

    // Skip overriding API error for email
    if (field === "email" && errors.email === "Email already exists") {
      return;
    }

    // Skip overriding API error for mobile
    if (
      field === "mobileNumber" &&
      errors.mobileNumber === "Mobile already exists"
    ) {
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formData[field]),
    }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // For mobile number field - only allow numbers and limit to 10 digits
    if (name === "mobileNumber") {
      // Remove any non-digit characters
      const numericValue = value.replace(/\D/g, "");
      // Limit to 10 digits
      const limitedValue = numericValue.slice(0, 10);

      setFormData((prev) => ({ ...prev, [name]: limitedValue }));

      // Validate mobile number
      const error = validateField("mobileNumber", limitedValue);
      setErrors((prev) => ({ ...prev, mobileNumber: error }));
      // Check if mobile number already exists
      if (!error && limitedValue.length === 10) {
        const formDataNew = { Mobile: limitedValue };
        const userDetails = await dispatch(getUserByMob(formDataNew));
        if (userDetails.payload.success === true) {
          setErrors((prev) => ({
            ...prev,
            mobileNumber: "Mobile already exists",
          }));
          setExistingUser(true);
        } else {
          setExistingUser(false);
        }
      }
      return;
    }

    // For name field, allow normal typing but capitalize on blur
    if (name === "fullName") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "email") {
      const error = validateField("email", value);
      setErrors((prev) => ({ ...prev, email: error }));

      if (!error) {
        const response = await dispatch(verifyUserEmail(value));
        if (response.payload.exists) {
          setErrors((prev) => ({ ...prev, email: "Email already exists" }));
          setExistingUser(true);
        } else {
          setFormData((prev) => ({ ...prev, confirm_email: value }));
          setExistingUser(false);
        }
      }
    }
  };

  // Prevent non-numeric input for mobile number field
  const handleKeyPress = (e) => {
    if (e.target.name === "mobileNumber") {
      // Allow only numbers (0-9) and control keys
      if (
        !/[0-9]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "Tab" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight"
      ) {
        e.preventDefault();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const isValid = validateForm();
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    // If user already exists, redirect to login
    if (existingUser) {
      dispatch(set_checkout_authentication_status(1));
      router.push("/login");
      return;
    }

    try {
      const userData = {
        Name: capitalizeName(formData.fullName),
        Email: formData.confirm_email,
        Mobile: formData.mobileNumber,
      };
      const registrationResponse = await dispatch(userRegistation(userData));
      if (registrationResponse.payload.success) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function to handle login redirection for existing users
  const handleLoginRedirect = () => {
    dispatch(set_checkout_authentication_status(1));
    router.push("/login");
  };

  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-gray-50 to-gray-100 font-poppins overflow-hidden">
      {/* Left Side - Enhanced Background Image with Overlay */}
      <div className="relative hidden lg:block h-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700 hover:scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80')",
          }}
        ></div>
        {/* Gradient Overlay */}

        {/* Welcome Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-start p-16 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                EwShopping
              </span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Discover amazing products, exclusive deals, and seamless shopping
              experience.
            </p>
            <div className="mt-8 flex space-x-4">
              <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
              <div className="w-8 h-1 bg-purple-400 rounded-full"></div>
              <div className="w-4 h-1 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Registration Form */}
      <div className="flex items-center justify-center p-8 lg:p-16 bg-white relative overflow-hidden">
        <div
          className="block sm:hidden absolute inset-0 bg-cover transform scale-105 transition-transform duration-700 hover:scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80')",
          }}
        ></div>

        <div className="relative z-10 max-w-xs sm:max-w-lg w-full">
          {/* Mobile Header */}
          <div className="hidden sm:block text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2f415d] mb-2">
              EwShopping
            </h1>
            <p className="text-gray-600">Your favorite shopping destination</p>
          </div>

          {/* Registration Form Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">Join us for an amazing experience</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Full Name Input */}
              <div className="relative group">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onFocus={() => handleFocus("fullName")}
                  onBlur={() => handleBlur("fullName")}
                  required
                  autoComplete="off"
                  className={`peer w-full px-4 py-3 border-2 ${
                    errors.fullName ? "border-red-500" : "border-gray-200"
                  } rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#2f415d]/20 focus:border-[#2f415d] transition-all duration-300 bg-gray-50/50 hover:bg-white`}
                />
                <label
                  htmlFor="fullName"
                  className={`absolute left-4 transition-all peer bg-white/80 duration-300 pointer-events-none sm:bg-white px-2 rounded ${
                    focusedFields.fullName || formData.fullName
                      ? "-top-2 text-sm text-[#2f415d] font-medium"
                      : "top-3 text-base text-gray-500"
                  }`}
                >
                  Full Name
                </label>
                <div className="absolute right-4 top-4 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Mobile Number Input - Now Editable with number restrictions */}
              <div className="relative group">
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  onFocus={() => handleFocus("mobileNumber")}
                  onBlur={() => handleBlur("mobileNumber")}
                  onKeyPress={handleKeyPress}
                  required
                  autoComplete="off"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  className={`peer w-full px-4 py-3 border-2 ${
                    errors.mobileNumber ? "border-red-500" : "border-gray-200"
                  } rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#2f415d]/20 focus:border-[#2f415d] transition-all duration-300 bg-gray-50/50 hover:bg-white`}
                />
                <label
                  htmlFor="mobileNumber"
                  className={`absolute left-4 transition-all peer bg-white/80 duration-300 pointer-events-none sm:bg-white px-2 rounded ${
                    focusedFields.mobileNumber || formData.mobileNumber
                      ? "-top-2 text-sm text-[#2f415d] font-medium"
                      : "top-3 text-base text-gray-500"
                  }`}
                >
                  Mobile Number
                </label>
                <div className="absolute right-4 top-4 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                {errors.mobileNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mobileNumber}
                  </p>
                )}
                {formData.mobileNumber.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.mobileNumber.length}/10 digits
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  required
                  autoComplete="off"
                  className={`peer w-full px-4 py-3 border-2 ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#2f415d]/20 focus:border-[#2f415d] transition-all duration-300 bg-gray-50/50 hover:bg-white`}
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all peer bg-white/80 duration-300 pointer-events-none sm:bg-white px-2 rounded ${
                    focusedFields.email || formData.email
                      ? "-top-2 text-sm text-[#2f415d] font-medium"
                      : "top-3 text-base text-gray-500"
                  }`}
                >
                  Email Address
                </label>
                <div className="absolute right-4 top-4 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}

              {/* Confirm Email Input */}
              {/* <div className="relative group">
                <input
                  type="email"
                  id="confirm_email"
                  name="confirm_email"
                  value={formData.confirm_email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("confirm_email")}
                  onBlur={() => handleBlur("confirm_email")}
                  required
                  autoComplete="off"
                  className={`peer w-full px-4 py-3 border-2 ${
                    errors.confirm_email ? "border-red-500" : "border-gray-200"
                  } rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#2f415d]/20 focus:border-[#2f415d] transition-all duration-300 bg-gray-50/50 hover:bg-white`}
                />
                <label
                  htmlFor="confirm_email"
                  className={`absolute left-4 transition-all peer bg-white/80 duration-300 pointer-events-none sm:bg-white px-2 rounded ${
                    formData.confirm_email
                      ? "-top-2 text-sm text-[#2f415d] font-medium"
                      : "top-3 text-base text-gray-500"
                  }`}
                >
                  Confirm Email Address
                </label>
                <div className="absolute right-4 top-4 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                {errors.confirm_email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirm_email}
                  </p>
                )}
              </div> */}

              {/* Enhanced Terms */}
              <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 text-center">
                <p className="text-xs text-gray-600 leading-relaxed">
                  By registering, you agree to our{" "}
                  <a
                    href="/termsAndCondition"
                    target="/_blank"
                    className="text-[#2f415d] hover:text-[#1e2a3a] underline font-medium transition-colors"
                  >
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacyPolicy"
                    target="_blank"
                    className="text-[#2f415d] hover:text-[#1e2a3a] underline font-medium transition-colors"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
              <button
                type="submit"
                disabled={!formValid || isSubmitting || existingUser}
                className={`group w-full py-4 px-8 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform ${
                  formValid && !isSubmitting && !existingUser
                    ? "bg-gradient-to-r from-[#2f415d] to-[#1e2a3a] text-white hover:from-[#1e2a3a] hover:to-[#2f415d] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
              {/* Enhanced Login Link */}
              <div className="text-center pt-6 border-t border-gray-100">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-[#2f415d] hover:text-[#1e2a3a] font-semibold underline decoration-2 underline-offset-2 hover:decoration-[#1e2a3a] transition-all duration-300"
                    onClick={() =>
                      dispatch(set_checkout_authentication_status(0))
                    }
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPageNew;
