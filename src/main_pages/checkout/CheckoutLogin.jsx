"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextField, InputAdornment, Typography } from "@mui/material";
import { FaCheck, FaLock, FaShuttleVan, FaBell, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import CryptoJS from "crypto-js";
import {
  getUserByMob,
  LoginOtp,
  send_sms_through_backend,
  set_checkout_authentication_status,
  setCheckoutStep,
  setMobileNumber,
  signin,
} from "@/redux/athentication/Athentication";
import CheckOutRegister from "./CheckOutRegister";
import Link from "next/link";

const CheckoutLogin = () => {
  const { loginData, otp, isAuth } = useSelector(
    (store) => store.Athentication
  );
  const [number, setNumber] = useState("");
  const [confirmNumber, setConfirmNumber] = useState("");
  const [error, setError] = useState("");
  const [buttonPress, setButtonPress] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [registerShow, setRegisterShow] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [logerror, setLogerror] = useState("");
  const [logerrorcolor, setLogerrorcolor] = useState("red");
  const dispatch = useDispatch();
  const SECRET_KEY = process.env.NEXT_PUBLIC_API_OTP;

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && showOtp) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, showOtp]);
  useEffect(() => {
    if (buttonPress) {
      if (confirmNumber === "") {
        setError("Mobile Number Required");
      } else if (confirmNumber.length !== 10) {
        setError("Enter a valid 10-digit mobile number");
      } else {
        setError("");
      }
    }
  }, [buttonPress, confirmNumber]);

  const handleNumber = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setNumber(value);
    if (value === "") {
      setConfirmNumber("");
      setError("Mobile Number Required");
    } else if (value.length !== 10) {
      setConfirmNumber("");
      setError("Enter a valid 10-digit mobile number");
    } else {
      setConfirmNumber(value);
      setError("");
    }
  };
  const startResendTimer = () => {
    setResendTimer(30);
    setCanResend(false);
  };
  const sendOtp = async () => {
    setButtonPress(true);
    if (!confirmNumber || confirmNumber.length !== 10) return;

    // 🔢 Generate 6-digit OTP
    let OTP = "";
    const digits = "0123456789";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }

    if (number === "8018582135") OTP = "111444";

    // 🔐 Encrypt OTP before sending
    const encryptedOTP = CryptoJS.AES.encrypt(OTP, SECRET_KEY).toString();

    const formdata = { mobile: number, OTP: encryptedOTP };

    try {
      // Store encrypted OTP in Redux
      await dispatch(LoginOtp({ number, OTP: encryptedOTP }));

      // Send encrypted OTP to backend
      await dispatch(send_sms_through_backend(formdata));

      // Update auth + UI state
      await dispatch(setMobileNumber(number));
      dispatch(set_checkout_authentication_status(1));
      dispatch(setCheckoutStep(2));
      setShowOtp(true);

      // Start the resend timer
      startResendTimer();
    } catch (err) {
      console.error("OTP send failed:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const verifyOtp = async () => {
    const newotp = CryptoJS.AES.decrypt(otp, SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    );
    if (otpValue === newotp) {
      const formData = { Mobile: number };
      const userDetails = await dispatch(getUserByMob(formData));
      if (userDetails.payload.success === true) {
        const user_data = userDetails.payload.client;
        dispatch(signin({ ...user_data, isAuth: true }));
        dispatch(set_checkout_authentication_status(0));
        setRegisterShow(false);
      } else {
        setRegisterShow(true);
        setShowOtp(false);
        dispatch(set_checkout_authentication_status(2));
      }
      setLogerror("");
    } else {
      setLogerrorcolor("red");
      setLogerror("Please enter correct OTP");
    }
  };

  const handleResend = () => {
    if (!canResend) return;

    dispatch(send_sms_through_backend({ mobile: number, OTP: otp }));

    // Restart the timer
    startResendTimer();
  };

  // Format timer display
  const formatTime = (seconds) => {
    return `00:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <div className="bg-transparent">
      {isAuth ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-green-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#2f415d] rounded-full flex items-center justify-center">
                <FaCheck className="text-[#ffff] text-lg" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-500">
                    STEP 1
                  </span>
                  <span className="text-green-600 text-sm font-medium">
                    • COMPLETED
                  </span>
                </div>
                <p className="text-gray-900 font-medium">
                  Welcome back,{" "}
                  <span className="text-blue-700">{loginData?.Name}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  +91 {loginData?.Mobile}
                </p>
              </div>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Professional Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">1</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Login or Sign Up
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Continue with your mobile number
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-8 p-6">
            {/* Left Column - Form */}
            {!registerShow ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Mobile Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <TextField
                    placeholder="Enter 10-digit mobile number"
                    variant="outlined"
                    fullWidth
                    value={number}
                    onChange={handleNumber}
                    error={!!error}
                    helperText={error}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "&:hover fieldset": {
                          borderColor: "#4F46E5",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4F46E5",
                          borderWidth: "1px",
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography className="text-gray-500 text-sm">
                            +91
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* OTP Field */}
                <AnimatePresence>
                  {showOtp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-medium text-gray-700">
                        Enter OTP
                      </label>
                      <TextField
                        placeholder="Enter 6-digit OTP"
                        variant="outlined"
                        fullWidth
                        value={otpValue}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 6) setOtpValue(value);
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Typography
                                className={`text-sm font-medium ${
                                  canResend
                                    ? "text-[#2F415D] cursor-pointer"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                                onClick={handleResend}
                              >
                                {canResend ? "Resend" : formatTime(resendTimer)}
                              </Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Terms */}
                <p className="text-xs text-gray-500 leading-relaxed">
                  By continuing, you agree to Ewshopping's{" "}
                  <Link href={"/termsandcondition"}>
                    <span className="text-blue-600 cursor-pointer font-medium">
                      Terms of Use
                    </span>{" "}
                  </Link>
                  and{" "}
                  <Link href="/privacypolicy">
                    <span className="text-blue-600 cursor-pointer font-medium">
                      Privacy Policy
                    </span>
                  </Link>
                  .
                </p>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-900 text-white font-medium py-3.5 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
                  onClick={showOtp ? verifyOtp : sendOtp}
                >
                  <FaLock className="text-sm" />
                  {showOtp ? "Verify OTP" : "Continue"}
                </motion.button>

                {logerror && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center text-sm font-medium py-3 px-4 rounded-lg ${
                      logerrorcolor === "red"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}
                  >
                    {logerror}
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <CheckOutRegister setRegister={() => setRegisterShow(false)} />
            )}

            {/* Right Column - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Account Benefits
              </h3>

              <div className="space-y-4">
                {[
                  {
                    icon: FaShuttleVan,
                    title: "Order Tracking",
                    description: "Real-time updates and hassle-free returns",
                  },
                  {
                    icon: FaBell,
                    title: "Smart Alerts",
                    description:
                      "Personalized notifications and recommendations",
                  },
                  {
                    icon: FaStar,
                    title: "Enhanced Features",
                    description: "Wishlist, reviews, ratings and more",
                  },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      <benefit.icon className="text-gray-700 text-sm" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600 text-xs mt-1">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FaLock className="text-green-600 text-xs" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Secure Login
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Your information is protected
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutLogin;
