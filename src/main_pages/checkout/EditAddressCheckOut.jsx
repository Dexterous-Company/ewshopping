"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import {
    updateAddress,
    updateAddressLocally,
} from "@/redux/athentication/Athentication";

const EditAddressCheckOut = ({ editAddressObject, onClose }) => {
    const dispatch = useDispatch();
    const { loginData } = useSelector((state) => state.Athentication);

    const [focusedFields, setFocusedFields] = useState({});
    const [formData, setFormData] = useState({
        Name: "",
        Mobile: "",
        Alternative_Mobile: "",
        HNo: "",
        Area: "",
        locality: "",
        LandMark: "",
        City: "",
        State: "",
        Pincode: "",
        Type: "Home",
        clientId: "",
        addressId: ""
    });

    useEffect(() => {
        if (editAddressObject) {
            const filledData = {
                ...formData,
                ...editAddressObject,
                clientId: loginData?._id || "",
                addressId: editAddressObject._id || ""
            };
            setFormData(filledData);

            // Pre-fill focused state for non-empty fields
            const prefilledFocus = {};
            Object.keys(editAddressObject).forEach((key) => {
                if (editAddressObject[key]) {
                    prefilledFocus[key] = true;
                }
            });
            setFocusedFields(prefilledFocus);
        }
    }, [editAddressObject, loginData]);

    const handleFocus = (field) => {
        setFocusedFields((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field, value) => {
        if (!value) {
            setFocusedFields((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resp = await dispatch(updateAddress(formData));
        if (resp.payload?.success) {
            const data_address = resp.payload.client.Addresses;
            dispatch(updateAddressLocally(data_address));
            onClose();
        }
    };

    return (
        <div className="bg-white flex flex-col relative rounded-md items-center justify-center border border-gray-200 shadow-sm">
            <div className="bg-white p-6 rounded-md w-full max-w-3xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-gray-800 font-semibold text-lg flex items-center gap-2">
                        <input type="radio" checked readOnly className="h-4 w-4" />
                        EDIT ADDRESS
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close address form"
                    >
                        <RxCross2 size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* First row of inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Name", name: "Name", required: true },
                            {
                                label: "10-digit mobile number",
                                name: "Mobile",
                                required: true,
                                type: "tel",
                                maxLength: 10
                            },
                            {
                                label: "House No/Building",
                                name: "HNo",
                                required: true
                            },
                            {
                                label: "Road/Area/Colony",
                                name: "Area"
                            },
                        ].map(({ label, name, required, type = "text", maxLength }) => (
                            <div key={name} className="relative">
                                <label
                                    className={`absolute left-3 transition-all duration-200 ${focusedFields[name] || formData[name]
                                        ? "top-1 text-xs text-blue-600 bg-white px-1 -ml-1"
                                        : "top-3 text-gray-500"
                                        }`}
                                >
                                    {label} {required && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name] || ""}
                                    className={`border ${required && !formData[name] ? "border-red-500" : "border-gray-300"
                                        } px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                    onFocus={() => handleFocus(name)}
                                    onBlur={(e) => handleBlur(name, e.target.value)}
                                    onChange={(e) => {
                                        if (type === "tel") {
                                            const value = e.target.value.replace(/\D/g, "").slice(0, maxLength);
                                            setFormData(prev => ({ ...prev, [name]: value }));
                                        } else {
                                            handleChange(e);
                                        }
                                    }}
                                    maxLength={maxLength}
                                    required={required}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Second row of inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {[
                            { label: "Pincode", name: "Pincode", required: true, maxLength: 6 },
                            { label: "Locality", name: "locality", required: true },
                            {
                                label: "Alternate Phone (Optional)",
                                name: "Alternative_Mobile",
                                type: "tel",
                                maxLength: 10
                            },
                            { label: "Landmark (Optional)", name: "LandMark" },
                        ].map(({ label, name, required, type = "text", maxLength }) => (
                            <div key={name} className="relative">
                                <label
                                    className={`absolute left-3 transition-all duration-200 ${focusedFields[name] || formData[name]
                                        ? "top-1 text-xs text-blue-600 bg-white px-1 -ml-1"
                                        : "top-3 text-gray-500"
                                        }`}
                                >
                                    {label} {required && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name] || ""}
                                    className={`border ${required && !formData[name] ? "border-red-500" : "border-gray-300"
                                        } px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                    onFocus={() => handleFocus(name)}
                                    onBlur={(e) => handleBlur(name, e.target.value)}
                                    onChange={(e) => {
                                        if (type === "tel" || name === "Pincode") {
                                            const value = e.target.value.replace(/\D/g, "").slice(0, maxLength);
                                            setFormData(prev => ({ ...prev, [name]: value }));
                                        } else {
                                            handleChange(e);
                                        }
                                    }}
                                    maxLength={maxLength}
                                    required={required}
                                />
                            </div>
                        ))}
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="relative">
                            <label
                                className={`absolute left-3 transition-all duration-200 ${focusedFields.City || formData.City
                                    ? "top-1 text-xs text-blue-600 bg-white px-1 -ml-1"
                                    : "top-3 text-gray-500"
                                    }`}
                            >
                                City/District/Town <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="City"
                                value={formData.City || ""}
                                className={`border ${!formData.City ? "border-red-500" : "border-gray-300"
                                    } px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                onFocus={() => handleFocus("City")}
                                onBlur={(e) => handleBlur("City", e.target.value)}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="relative">
                            <label
                                className={`absolute left-3 transition-all duration-200 ${focusedFields.State || formData.State
                                    ? "top-1 text-xs text-blue-600 bg-white px-1 -ml-1"
                                    : "top-3 text-gray-500"
                                    }`}
                            >
                                State <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="State"
                                value={formData.State || ""}
                                className={`border ${!formData.State ? "border-red-500" : "border-gray-300"
                                    } px-3 pt-5 pb-2 rounded w-full text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                onFocus={() => handleFocus("State")}
                                onBlur={(e) => handleBlur("State", e.target.value)}
                                onChange={handleChange}
                                required
                            >
                                <option value="">--Select State--</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Telangana">Telangana</option>
                                <option value="West Bengal">West Bengal</option>
                            </select>
                        </div>
                    </div>

                    {/* Address textarea */}
                    {/* <div className="relative mt-4">
                        <label
                            className={`absolute left-3 transition-all duration-200 ${focusedFields.Address || formData.Address
                                    ? "top-1 text-xs text-blue-600 bg-white px-1 -ml-1"
                                    : "top-3 text-gray-500"
                                }`}
                        >
                            Address (Area and Street) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="Address"
                            value={formData.Address || ""}
                            className={`border ${!formData.Address ? "border-red-500" : "border-gray-300"
                                } px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                            rows={3}
                            onFocus={() => handleFocus("Address")}
                            onBlur={(e) => handleBlur("Address", e.target.value)}
                            onChange={handleChange}
                            required
                        />
                    </div> */}

                    {/* Address type */}
                    <div className="mt-4 flex gap-6">
                        {["Home", "Work", "Other"].map((type) => (
                            <label key={type} className="flex items-center text-gray-700">
                                <input
                                    type="radio"
                                    name="Type"
                                    value={type}
                                    checked={formData.Type === type}
                                    onChange={handleChange}
                                    className="mr-2 text-blue-600"
                                />
                                {type}
                            </label>
                        ))}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex items-center gap-6">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            className="text-blue-600 font-medium hover:underline"
                            onClick={onClose}
                        >
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAddressCheckOut;