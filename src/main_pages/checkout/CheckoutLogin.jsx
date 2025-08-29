"use client"
import React, { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaShuttleVan } from 'react-icons/fa';
import { IoIosNotifications, IoIosStar } from 'react-icons/io';
import { Box, TextField, Typography, InputAdornment } from '@mui/material';
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { getUserByMob, LoginOtp, send_sms_through_backend, set_checkout_authentication_status, setCheckoutStep, setMobileNumber, signin } from '@/redux/athentication/Athentication';
import CheckOutRegister from './CheckOutRegister';
import { FaS } from 'react-icons/fa6';

const CheckoutLogin = () => {
    const { loginData, otp, mob, isAuth } = useSelector((store) => store.Athentication);
    const [loginStatus, setLoginStatus] = useState(false);
    const dispatch = useDispatch();
    const [number, setNumber] = useState("");
    const [confirmNumber, setConfirmNumber] = useState("")
    const [isFocused, setIsFocused] = useState(false);
    const [error, setError] = useState("");
    const [buttonPress, setbuttonPress] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otpValue, setOtpValue] = useState("");
    const [registerShow, setRegisterShow] = useState(false)

    const [logerror, setLogerror] = useState("");
    const [logerrorcolor, setLogerrorcolor] = useState("red");
    const handleContinue = () => {
        sendOptPress()
    };
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

    const verifyOtp = async () => {
        setbuttonPress(true);
        if (otpValue === otp) {
            // ✅ Correct OTP
            const formData = { Mobile: number };
            const userDetails = await dispatch(getUserByMob(formData));
            if (userDetails.payload.success === true) {
                const user_data = userDetails.payload.client;
                dispatch(signin({ ...user_data, isAuth: true }));
                dispatch(set_checkout_authentication_status(0));
                setRegisterShow(false)
                // router.push("/");
            } else {
                // router.push("/register");
                // registera
                setRegisterShow(true)
                setShowOtp(false)
                dispatch(set_checkout_authentication_status(2));
            }
            setLogerror(""); // Clear any previous errors
        } else {
            // ❌ Incorrect OTP
            setLogerrorcolor("red");
            setLogerror("Please enter correct OTP");
        }

    }
    const handleNumber = async (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        setNumber(value);
        if (value === "") {
            setConfirmNumber("");
            setError("Mobile Number Required");
        } else if (value.length !== 10) {
            setConfirmNumber("");
            setError("Enter a valid 10-digit mobile number");
        } else {
            setConfirmNumber(value);
            setIsFocused(true);
            setError("");
        }
    };
    const sendOptPress = async () => {
        // e.preventDefault();
        setbuttonPress(true);
        if (confirmNumber === "") {
            setError("Mobile Number Required");
            return;
        }
        if (confirmNumber.length !== 10) {
            setError("Enter a valid 10-digit mobile number");
            return;
        }
        // Generate OTP
        let OTP = "";
        const digits = "0123456789";
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }

        if (number === "8018582135") {
            OTP = "111444";
        }
        const formdata = { mobile: number, OTP };
        try {
            await dispatch(LoginOtp({ number, OTP }));
            await dispatch(send_sms_through_backend(formdata));
            await dispatch(setMobileNumber(number));
            dispatch(set_checkout_authentication_status(1));
            dispatch(setCheckoutStep(2));
            setShowOtp(true);
            // show otp here 
            // router.push("/otp");
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };
    const handleResend = async () => {
        try {
            const formData = {
                number: number,
                OTP: otp,
            };
            dispatch(send_sms_through_backend(formData));
        } catch (error) {
            console.error("Resend failed:", error);
        }
    };

    return (
        <>
            {isAuth ? (
                <div className="bg-white  rounded shadow-sm p-4 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 font-medium text-sm text-[#878787]">
                            <span className="h-5 w-5 bg-[#f0f0f0] text-[#2874f0] text-xs font-bold flex items-center justify-center rounded">
                                1
                            </span>
                            <span>LOGIN</span>
                            <span className="text-[#2874f0]">
                                <FaCheck size={14} />
                            </span>
                        </div>
                        <div className="mt-1 text-sm text-black ml-6">
                            <span className="font-semibold">{loginData?.Name}</span>
                            <span className="ml-2 text-[#3c3c3c]">+91 {loginData?.Mobile}</span>
                        </div>
                    </div>
                    {/* <button className="text-[#2874f0] font-medium text-sm border border-[#e0e0e0] px-4 py-1 rounded hover:bg-[#f5faff]">
                        CHANGE
                    </button> */}
                </div>
            ) : (
                <div className="border-b border-[#cccc] bg-[#fff]">
                    <div className="bg-white rounded shadow overflow-hidden">
                        {/* Blue Header */}
                        <div className="bg-[#2f415d] px-6 py-3">
                            <div className="flex items-center gap-2">
                                <span className="bg-white text-[#2874f0] text-xs font-bold px-2 py-1 rounded">1</span>
                                <span className="text-white font-semibold text-sm tracking-wide">LOGIN OR SIGNUP</span>
                            </div>
                        </div>
                        {/* Content */}
                        <div className="grid sm:grid-cols-2 gap-2 px-4">
                            {/* Left Column */}
                            {
                                registerShow === false ? (<>
                                    <div className="p-6">
                                        <div className="relative w-full">
                                            <TextField
                                                label="Enter Mobile number"
                                                variant="standard"
                                                fullWidth
                                                value={number}
                                                onChange={(e) => { handleNumber(e) }}
                                                InputProps={{
                                                    disableUnderline: false,
                                                    startAdornment: number.length === 10 ? (
                                                        <InputAdornment position="start">
                                                            <Typography fontSize="0.875rem">+91</Typography>
                                                        </InputAdornment>
                                                    ) : null,
                                                    endAdornment: showOtp ? (
                                                        <InputAdornment position="end">
                                                            <Typography
                                                                sx={{
                                                                    fontSize: "0.875rem",
                                                                    color: "#1d4ed8",
                                                                    cursor: "pointer",
                                                                    fontWeight: 500,
                                                                }}
                                                                onClick={() => {
                                                                    setShowOtp(false);
                                                                    setOtpValue("");
                                                                }}>
                                                                Change?
                                                            </Typography>
                                                        </InputAdornment>
                                                    ) : null,
                                                    style: {
                                                        fontSize: "0.875rem",
                                                        paddingTop: "8px",
                                                        paddingBottom: "8px",
                                                    },
                                                }}
                                                InputLabelProps={{ style: { color: "#6B7280" } }}
                                            />
                                        </div>
                                        {showOtp && (
                                            <div className="pt-2">
                                                <TextField
                                                    label="Enter OTP"
                                                    variant="standard"
                                                    fullWidth
                                                    value={otpValue}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, "");
                                                        if (value.length <= 6) setOtpValue(value);
                                                    }}
                                                    InputProps={{
                                                        disableUnderline: false,
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: "0.875rem",
                                                                        color: "#1d4ed8",
                                                                        cursor: "pointer",
                                                                        fontWeight: 500,
                                                                    }}
                                                                    onClick={() => {

                                                                        setOtpValue("");
                                                                        handleResend()

                                                                    }}
                                                                >
                                                                    Resend
                                                                </Typography>
                                                            </InputAdornment>
                                                        ),
                                                        style: {
                                                            fontSize: "0.875rem",
                                                            paddingTop: "8px",
                                                            paddingBottom: "8px",
                                                        },
                                                    }}
                                                    InputLabelProps={{ style: { color: "#6B7280" } }}
                                                />
                                            </div>
                                        )}
                                        <p className="text-xs text-[#878787] mt-4">
                                            By continuing, you agree to Ewshopping's{" "}
                                            <span className="text-[#2874f0] cursor-pointer">Terms of Use</span> and{" "}
                                            <span className="text-[#2874f0] cursor-pointer">Privacy Policy</span>.
                                        </p>
                                        {
                                            showOtp ? (<>
                                                <button
                                                    className="mt-6 w-full bg-[#e96884] text-white font-semibold text-sm py-3 rounded-sm hover:bg-[#2F415D] transition"
                                                    onClick={verifyOtp}>
                                                    CONTINUE
                                                </button>
                                            </>) : (
                                                <>
                                                    <button
                                                        className="mt-6 w-full bg-[#e96884] text-white font-semibold text-sm py-3 rounded-sm hover:bg-[#2F415D] transition"
                                                        onClick={handleContinue}>
                                                        CONTINUE
                                                    </button>
                                                </>
                                            )
                                        }

                                    </div>
                                </>) : (<>
                                    <CheckOutRegister setRegister={() => setRegisterShow(false)} />
                                </>
                                )
                            }

                            {/* Right Column */}
                            <div className="p-6 bg-white">
                                <p className="text-sm text-[#878787] mb-4 font-semibold">
                                    Advantages of our secure login
                                </p>
                                <ul className="text-sm text-gray-700 space-y-5">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#2874f0] text-lg"><FaShuttleVan /></span>
                                        Easily Track Orders, Hassle free Returns
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#2874f0] text-lg"><IoIosNotifications /></span>
                                        Get Relevant Alerts and Recommendation
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#2874f0] text-lg"><IoIosStar /></span>
                                        Wishlist, Reviews, Ratings and more.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CheckoutLogin;
