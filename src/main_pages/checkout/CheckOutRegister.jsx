"use client";
import { TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    set_checkout_authentication_status,
    userRegistation,
    verifyUserEmail,
    signin
} from '../../redux/athentication/Athentication';

const CheckOutRegister = ({ setRegister }) => {
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
        // Skip overriding API error for email
        if (field === "email" && errors.email === "Email already exists") {
            return;
        }
        setErrors((prev) => ({
            ...prev,
            [field]: validateField(field, formData[field]),
        }));
    };
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "mobileNumber") {
            setErrors((prev) => ({
                ...prev,
                mobileNumber: validateField("mobileNumber", value),
            }));
        }

        if (name === "email") {
            const error = validateField("email", value);
            setErrors((prev) => ({ ...prev, email: error }));

            if (!error) {
                const response = await dispatch(verifyUserEmail(value));

                // Check the response structure based on your example
                if (response.payload.exists) {
                    // Changed from success to exists
                    setErrors((prev) => ({ ...prev, email: "Email already exists" }));
                } else {
                    setFormData((prev) => ({ ...prev, confirm_email: value }));
                }
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
        try {
            const userData = {
                Name:
                    formData.fullName.charAt(0).toUpperCase() +
                    formData.fullName.slice(1).toLowerCase(),
                Email: formData.confirm_email,
                Mobile: formData.mobileNumber,
            };
            const registrationResponse = await dispatch(userRegistation(userData));
            if (registrationResponse.payload.success) {
                const user_data = registrationResponse.payload.client;
                dispatch(
                    signin({
                        ...user_data,
                        isAuth: true,
                    })
                );
                dispatch(set_checkout_authentication_status(0));
                setRegister()
                // here chnages 
                // router.push("/");
            }
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div>
            <div className="p-6">
                <form onSubmit={handleSubmit}>
                    <div className="relative w-full">
                        {/* Full Name Field */}
                        <div className='pt-2'>
                            <TextField
                                label="Enter Full Name"
                                variant="standard"
                                fullWidth
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                onFocus={() => handleFocus("fullName")}
                                onBlur={() => handleBlur("fullName")}
                                error={!!errors.fullName}
                                helperText={errors.fullName}
                                InputLabelProps={{
                                    style: {
                                        color: errors.fullName ? "#f44336" : "#6B7280",
                                        ...(focusedFields.fullName || formData.fullName ? {
                                            transform: "translate(0, -1.5px) scale(0.75)"
                                        } : {})
                                    }
                                }}
                            />
                        </div>
                        {/* Mobile Number Field */}
                        <div className='pt-2'>
                            <TextField
                                label="Enter Mobile Number"
                                variant="standard"
                                fullWidth
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                onFocus={() => handleFocus("mobileNumber")}
                                onBlur={() => handleBlur("mobileNumber")}
                                error={!!errors.mobileNumber}
                                helperText={errors.mobileNumber}
                                InputLabelProps={{
                                    style: {
                                        color: errors.mobileNumber ? "#f44336" : "#6B7280",
                                        ...(focusedFields.mobileNumber || formData.mobileNumber ? {
                                            transform: "translate(0, -1.5px) scale(0.75)"
                                        } : {})
                                    }
                                }}
                            />
                        </div>
                        {/* Email Field */}
                        <div className='pt-2'>
                            <TextField
                                label="Enter Email Address"
                                variant="standard"
                                fullWidth
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={() => handleFocus("email")}
                                onBlur={() => handleBlur("email")}
                                error={!!errors.email}
                                helperText={errors.email}
                                InputLabelProps={{
                                    style: {
                                        color: errors.email ? "#f44336" : "#6B7280",
                                        ...(focusedFields.email || formData.email ? {
                                            transform: "translate(0, -1.5px) scale(0.75)"
                                        } : {})
                                    }
                                }}
                            />
                        </div>
                        {/* Confirm Email Field */}

                    </div>
                    <p className="text-xs text-[#878787] mt-4">
                        By continuing, you agree to Ewshopping's{" "}
                        <span className="text-[#2874f0] cursor-pointer">Terms of Use</span> and{" "}
                        <span className="text-[#2874f0] cursor-pointer">Privacy Policy</span>.
                    </p>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`mt-6 w-full ${isSubmitting ? 'bg-gray-400' : 'bg-[#e96884]'} text-white font-semibold text-sm py-3 rounded-sm hover:bg-[#2F415D] transition`}
                    >
                        {isSubmitting ? 'PROCESSING...' : 'CONTINUE'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CheckOutRegister;