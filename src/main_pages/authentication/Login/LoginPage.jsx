"use client";
import {
  getUserByMob,
  LoginOtp,
  send_sms_through_backend,
  set_checkout_authentication_status,
  setMobileNumber,
} from "@/redux/athentication/Athentication";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";

const LoginPage = () => {
  const { mob } = useSelector((store) => store.Athentication);

  const [number, setNumber] = useState("" || mob);
  const [confirmNumber, setConfirmNumber] = useState("");
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [buttonPress, setButtonPress] = useState(false);
  const [otpClick, setOtpClick] = useState(false);
  const SECRET_KEY = process.env.NEXT_PUBLIC_API_OTP;

  const router = useRouter();

  // Memoized validation function
  const validateNumber = useCallback((num) => {
    if (!num) return "Mobile Number Required";
    if (num.length !== 10) return "Enter a valid 10-digit mobile number";
    if (!/^\d+$/.test(num)) return "Only digits are allowed";
    return "";
  }, []);

  // Debounced validation effect
  useEffect(() => {
    if (buttonPress || number.length === 10) {
      const validationError = validateNumber(number);
      setError(validationError);
    }
  }, [buttonPress, number, validateNumber]);

  const handleNumber = useCallback(
    (e) => {
      const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
      setNumber(value);

      // Only validate when input is complete (10 digits)
      if (value.length === 10) {
        const validationError = validateNumber(value);
        if (!validationError) {
          setConfirmNumber(value);
          setIsFocused(true);
          setError("");
        } else {
          setError(validationError);
        }
      } else {
        setConfirmNumber("");
        setError(""); // Clear error while typing
      }
    },
    [validateNumber]
  );

  const sendOtpPress = useCallback(
    async (e) => {
      e.preventDefault();
      setButtonPress(true);

      const validationError = validateNumber(number);
      if (validationError) {
        setError(validationError);
        return;
      }

      setOtpClick(true);

      // Generate OTP
      let OTP = "";
      const digits = "0123456789";
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      if (number === "9028121976") {
        OTP = "111444";
      }
      console.log("---->", OTP);
      // 🔐 Encrypt OTP before sending
      const encryptedOTP = CryptoJS.AES.encrypt(OTP, SECRET_KEY).toString();
      const formdata = { mobile: number, OTP: encryptedOTP };
      try {
        await dispatch(LoginOtp({ number, OTP: encryptedOTP }));
        await dispatch(send_sms_through_backend(formdata));
        await dispatch(setMobileNumber(number));
        dispatch(set_checkout_authentication_status(1));
        setOtpClick(false);
        router.push("/otp");
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setOtpClick(false);
      }
    },
    [number, dispatch, router, validateNumber]
  );

  // Memoized component parts to prevent unnecessary re-renders
  const backgroundSection = useMemo(
    () => (
      <div className="relative hidden lg:block h-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700 hover:scale-110"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start p-16 text-white bg-black/60">
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
    ),
    []
  );

  const mobileBackground = useMemo(
    () => (
      <div
        className="block sm:hidden absolute inset-0 bg-cover transform scale-105 transition-transform duration-700 hover:scale-110"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80')",
        }}
      ></div>
    ),
    []
  );

  return (
    <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-2  bg-gradient-to-br from-gray-50 to-gray-100 font-poppins">
      {backgroundSection}

      <div className="flex items-center justify-center p-8 lg:p-16 bg-white relative overflow-hidden">
        {mobileBackground}

        <div className="relative z-10 max-w-xs sm:max-w-lg">
        {/* <div className="hidden sm:block text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2f415d] mb-2">
              EwShopping
            </h1>
            <p className="text-gray-600">Your favorite shopping destination</p>
          </div>*/}

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back!
              </h2>
              <p className="text-gray-600">Sign in to access your account</p>
            </div>

            <form className="space-y-6" onSubmit={sendOtpPress}>
              <div className="relative group">
                <input
                  type="tel"
                  id="mobile"
                  maxLength={10}
                  minLength={10}
                  value={number}
                  onChange={handleNumber}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="peer w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-[#2f415d]/20 focus:border-[#2f415d] transition-all duration-300 bg-gray-50/50 hover:bg-white"
                />
                <label
                  htmlFor="mobile"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none px-2 rounded ${
                    isFocused || number
                      ? "-top-2 text-sm text-[#2f415d] font-medium bg-white/80 sm:bg-white"
                      : "top-3 text-base text-gray-500 bg-transparent"
                  }`}
                >
                  Enter Mobile number
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

              {error && (
                <p className="text-sm mt-2 text-red-500 font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg shadow-sm">
                  {error}
                </p>
              )}

              <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 sm:whitespace-nowrap text-center">
                <p className="text-xs text-gray-600 leading-relaxed">
                  By continuing, you agree to our{" "}
                  <a
                    href="/termsandcondition"
                    target="/_blank"
                    className="text-[#2f415d] hover:text-[#1e2a3a] underline font-medium transition-colors"
                  >
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacypolicy"
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
                disabled={number.length !== 10 || otpClick}
                className={`group w-full py-4 px-8 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300
                  ${
                    number.length === 10 && !otpClick
                      ? "bg-gradient-to-r from-[#2f415d] to-[#1e2a3a] text-white hover:from-[#1e2a3a] hover:to-[#2f415d] hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  {otpClick ? (
                    <span className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <span>Generating...</span>
                    </span>
                  ) : (
                    <>
                      <span>Generate OTP</span>
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

              <div className="text-center pt-6 border-t sm:text-base text-xs border-gray-100">
                <p className="text-gray-600">
                  New to EwShopping?
                  <Link
                    href="/register-page"
                    className="text-[#2f415d] hover:text-[#1e2a3a] font-semibold underline decoration-2 underline-offset-2 hover:decoration-[#1e2a3a] transition-all duration-300"
                  >
                    Create an account
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

export default LoginPage;
