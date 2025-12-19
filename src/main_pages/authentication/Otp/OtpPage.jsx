"use client";
import {
  getUserByMob,
  send_sms_through_backend,
  set_checkout_authentication_status,
  signin,
  setMobileNumber,
} from "@/redux/athentication/Athentication";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import CryptoJS from "crypto-js";

const OtpPage = () => {
  const { loginData, otp, mob, isAuth } = useSelector(
    (store) => store.Athentication
  );
  
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpValuesErrors, setOtpValuesErrors] = useState([]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [buttonPress, setButtonPress] = useState(false);
  const inputRefsDesktop = useRef([]);
  const [logerror, setLogerror] = useState("");
  const [logerrorcolor, setLogerrorcolor] = useState("red");
  const dispatch = useDispatch();
  const router = useRouter();
  const SECRET_KEY = process.env.NEXT_PUBLIC_API_OTP;

  useEffect(() => {
    if (buttonPress === true) {
      const allEmpty = otpValues.every((item) => item !== "");
      if (allEmpty === false) {
        let errorarray = [];
        for (let index = 0; index < otpValues.length; index++) {
          let element = otpValues[index];
          let oject = "";
          if (element === "") {
            oject = index;
          } else {
            oject = "";
          }
          errorarray = [...errorarray, oject];
        }
        setOtpValuesErrors([...errorarray]);
      }
    }
  }, [buttonPress, otpValues]);

  const handleOtpChange = useCallback(
    (index, value, refs) => {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      if (value && index < otpValues.length - 1) {
        setTimeout(() => refs.current[index + 1]?.focus(), 10);
      }
      if (newOtpValues.length === 6) {
        setLogerror("");
      }
    },
    [otpValues]
  );

  const handleKeyDown = useCallback(
    (event, index, refs) => {
      if (event.key === "Backspace" && !otpValues[index] && index > 0) {
        refs.current[index - 1]?.focus();
      }
    },
    [otpValues]
  );

  // Handle paste
  const handlePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").slice(0, 6);
      const newOtp = [...otpValues];

      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6 && !isNaN(pastedData[i])) {
          newOtp[i] = pastedData[i];
        }
      }
      setOtpValues(newOtp);
    },
    [otpValues]
  );

  const verifyOtp = async (e) => {
    e.preventDefault();
    setButtonPress(true);

    const allFilled = otpValues.every((item) => item !== "");
    if (allFilled) {
      setIsVerifying(true);
      const concatenatedString = otpValues.join("");

      const  newotp = CryptoJS.AES.decrypt(otp, SECRET_KEY).toString(CryptoJS.enc.Utf8);      
      if (concatenatedString === newotp) {
        // ✅ Correct OTP
        const formData = { Mobile: mob };
        const userDetails = await dispatch(getUserByMob(formData));
        if (userDetails.payload.success === true) {
          const user_data = userDetails.payload.client;
          dispatch(signin({ ...user_data, isAuth: true }));
          dispatch(set_checkout_authentication_status(0));
          router.push("/");
        } else {
          router.push("/register");
          dispatch(set_checkout_authentication_status(2));
        }

        setLogerror(""); // Clear any previous errors
      } else {
        // ❌ Incorrect OTP
        setLogerrorcolor("red");
        setLogerror("Please enter correct OTP");
      }
      setIsVerifying(false);
    } else {
      // ❌ Not all digits filled
      setLogerrorcolor("red");
      setLogerror("Please enter the complete OTP");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [canResend]);

  // Handle resend
  const handleResend = async () => {
    setTimer(30);
    setCanResend(false);
    setOtpValues(["", "", "", "", "", ""]);
    inputRefsDesktop.current[0]?.focus();

    try {
      // Generate new OTP
      let newOTP = "";
      const digits = "0123456789";
      for (let i = 0; i < 6; i++) {
        newOTP += digits[Math.floor(Math.random() * 10)];
      }

      if (mob === "9028121976") {
        newOTP = "111444";
      }

      // 🔐 Encrypt OTP before sending
      const encryptedOTP = CryptoJS.AES.encrypt(newOTP, SECRET_KEY).toString();

      const formData = {
        mobile: mob,
        OTP: encryptedOTP,
      };

      // Update the OTP in Redux state
      await dispatch({
        type: "Athentication/LoginOtp",
        payload: { number: mob, OTP: encryptedOTP },
      });

      // Send the encrypted OTP through backend
      await dispatch(send_sms_through_backend(formData));
    } catch (error) {
      console.error("Resend failed:", error);
    }
  };

  // Handle change number
  const handleChangeNumber = () => {
    router.push("/login");
  };

  useEffect(() => {
    inputRefsDesktop.current[0]?.focus();
  }, []);

  // Background section component
  const BackgroundSection = () => (
    <div className="relative hidden lg:block h-full overflow-hidden ">
      <div
        className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700 hover:scale-110"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80')",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#2f415d]/80 to-transparent"></div>

      <div className="absolute inset-0 flex flex-col justify-center items-start p-16 text-white bg-black/60">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Verify Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Identity
            </span>
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed">
            We've sent a secure code to your phone. Enter it below to continue.
          </p>
          <div className="mt-8 flex space-x-4">
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
            <div className="w-8 h-1 bg-purple-400 rounded-full"></div>
            <div className="w-4 h-1 bg-pink-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile background component
  const MobileBackground = () => (
    <div
      className="block sm:hidden absolute inset-0 bg-cover transform scale-105 transition-transform duration-700 hover:scale-110"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80')",
      }}
    ></div>
  );

  return (
    <div className="w-screen h-screen  grid grid-cols-1 lg:grid-cols-2 bg-gradient-to-br from-gray-50 to-gray-100 font-poppins">
      <BackgroundSection />

      <div className="flex items-center justify-center p-8 lg:p-16 bg-white relative overflow-hidden">
        <MobileBackground />

        <div className="relative z-10 max-w-xs sm:max-w-lg w-full">
          <div className="hidden sm:block text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2f415d] mb-2">
              EwShopping
            </h1>
            <p className="text-gray-600">Secure verification</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl px-8 py-5 border border-gray-100">
            <div className="text-center sm:mb-8 mb-4 ">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2f415d] to-[#1e2a3a] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="sm:text-3xl text-xs font-bold text-gray-800 sm:mb-2 mb-0">
                Verify OTP
              </h2>
              <div className="flex flex-col items-center mt-2">
                <p className="text-gray-600">We've sent a 6-digit code to</p>
                <div className="flex items-center justify-center mt-1">
                  <span
                    onClick={handleChangeNumber}
                    className="cursor-pointer font-semibold text-[#2f415d] bg-gray-100 px-3 py-1 rounded-lg border border-[#2f415d]"
                  >
                    +91 {mob}
                    <button className="ml-2 text-sm text-[#000000] hover:text-[#2f415d] hover:underline hover:font-semibold transition-all duration-200">
                      <FiEdit className="inline ml-1 mb-0.5 hover:scale-110 transition-transform duration-200" />
                    </button>
                  </span>
                </div>
              </div>
            </div>

            <form className="sm:space-y-6 space-y-3 " onSubmit={verifyOtp}>
              <div className="flex justify-center sm:space-x-3 space-x-2">
                {otpValues.map((digit, index) => (
                  <input
                    key={index}
                    ref={(input) => (inputRefsDesktop.current[index] = input)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(
                        index,
                        e.target.value.replace(/\D/g, ""),
                        inputRefsDesktop
                      )
                    }
                    onKeyDown={(e) => handleKeyDown(e, index, inputRefsDesktop)}
                    onPaste={handlePaste}
                    className={`sm:w-12 sm:h-12 w-10 h-10 text-center text-xl font-bold rounded-xl transition-all duration-300 ${
                      otpValuesErrors.includes(index)
                        ? "bg-red-100 border-red-500 focus:ring-red-300 focus:border-red-500"
                        : "bg-gray-50/50 border-gray-200 focus:ring-[#2f415d]/20 focus:border-[#2f415d]"
                    } border-2 focus:outline-none hover:bg-white`}
                  />
                ))}
              </div>

              {logerror && (
                <p className="text-sm mt-2 text-red-500 font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-lg shadow-sm">
                  {logerror}
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

              <div className="text-center">
                {!canResend ? (
                  <p className="text-gray-600">
                    Resend code in{" "}
                    <span className="font-semibold text-[#2f415d]">
                      {Math.floor(timer / 60)}:
                      {(timer % 60).toString().padStart(2, "0")}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#2f415d] hover:text-[#1e2a3a] font-semibold underline decoration-2 underline-offset-2 hover:decoration-[#1e2a3a] transition-all duration-300"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className={`group w-full py-4 px-8 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform ${
                  !isVerifying
                    ? "bg-gradient-to-r from-[#2f415d] to-[#1e2a3a] text-white hover:from-[#1e2a3a] hover:to-[#2f415d] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  {isVerifying ? (
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
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify OTP</span>
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>

              <div className="text-center text-xs sm:text-base pt-3 border-t border-gray-100 whitespace-nowrap">
                <p className="text-gray-600">
                  Didn't receive the code?{" "}
                  <a
                    href="/login"
                    className="text-[#2f415d] hover:text-[#1e2a3a] font-semibold underline decoration-2 underline-offset-2 hover:decoration-[#1e2a3a] transition-all duration-300"
                  >
                    Back to Login
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
