"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add_Address } from '@/redux/athentication/Athentication';
import { RxCross2 } from 'react-icons/rx';

const AddAddressForm = ({ setShowAddress }) => {
  const dispatch = useDispatch();
  const { loginData } = useSelector((state) => state.Athentication);
  const [formData, setFormData] = useState({
    Name: loginData?.Name || "",
    Mobile: loginData?.Mobile || "",
    Alternative_Mobile: "",
    HNo: "",
    Area: "",
    locality: "",
    LandMark: "",
    City: "",
    State: "",
    Pincode: "",
    Type: "Home",
    clientId: loginData?._id || ""
  });

  const [focusedFields, setFocusedFields] = useState({
    Name: false,
    Mobile: false,
    HNo: false,
    locality: false,
    City: false,
    State: false,
    Pincode: false,
    Alternative_Mobile: false
  });

  const [errors, setErrors] = useState({
    Name: "",
    Mobile: "",
    HNo: "",
    locality: "",
    City: "",
    State: "",
    Pincode: ""
  });

  const handleFocus = (field) => {
    setFocusedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field, value) => {
    if (!value) {
      setFocusedFields(prev => ({ ...prev, [field]: false }));
    }
    validateField(field, value);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "Name":
        if (!value.trim()) error = "Name is required";
        else if (!/^[a-zA-Z ]+$/.test(value))
          error = "Name should contain only letters";
        break;
      case "Mobile":
        if (!value) error = "Mobile is required";
        else if (!/^[0-9]{10}$/.test(value))
          error = "Invalid mobile number (10 digits required)";
        break;
      case "Alternative_Mobile":
        if (value && !/^[0-9]{10}$/.test(value))
          error = "Invalid mobile number (10 digits required)";
        break;
      case "HNo":
        if (!value.trim()) error = "House number is required";
        break;
      case "locality":
        if (!value.trim()) error = "Locality is required";
        break;
      case "City":
        if (!value.trim()) error = "City is required";
        else if (!/^[a-zA-Z ]+$/.test(value))
          error = "City should contain only letters";
        break;
      case "State":
        if (!value) error = "State is required";
        break;
      case "Pincode":
        if (!value) error = "Pincode is required";
        else if (!/^\d{6}$/.test(value))
          error = "Pincode must be exactly 6 digits";
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let isValid = true;
    const newErrors = { ...errors };

    Object.keys(formData).forEach(key => {
      if (key in newErrors) {
        const error = validateField(key, formData[key]);
        if (error) isValid = false;
      }
    });

    if (!isValid) return;

    const addressData = {
      ...formData,
      clientId: loginData?._id || ""
    };

    dispatch(add_Address(addressData))
      .unwrap()
      .then(() => setShowAddress(false))
      .catch((error) => console.error("Error adding address:", error));
  };

  return (
    <div className='bg-white flex flex-col relative rounded-md items-center justify-center border border-gray-200 shadow-sm'>
      <div className="bg-white p-6 rounded-md w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-800 font-semibold text-lg flex items-center gap-2">
            <input type="radio" checked readOnly className="h-4 w-4" />
            ADD A NEW ADDRESS
          </h2>
          <button
            onClick={() => setShowAddress(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close address form"
          >
            <RxCross2 size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Field */}
            <div className="relative">
              <label
                className={`absolute left-3 transition-all duration-200 ${focusedFields.Name || formData.Name ? 'top-1 text-xs text-blue-600 bg-white px-1 -ml-1' : 'top-3 text-gray-500'}`}
              >
                Name {errors.Name && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="Name"
                className={`border ${errors.Name ? 'border-red-500' : 'border-gray-300'} px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                onFocus={() => handleFocus('Name')}
                onBlur={(e) => handleBlur('Name', e.target.value)}
                onChange={handleChange}
                value={formData.Name}
              />
              {errors.Name && <p className="text-red-500 text-xs mt-1">{errors.Name}</p>}
            </div>

            {/* Mobile Field */}
            <div className="relative">
              <label
                className={`absolute left-3 transition-all duration-200 ${focusedFields.Mobile || formData.Mobile ? 'top-1 text-xs text-blue-600 bg-white px-1 -ml-1' : 'top-3 text-gray-500'}`}
              >
                10-digit mobile number {errors.Mobile && <span className="text-red-500">*</span>}
              </label>
              <input
                type="tel"
                name="Mobile"
                className={`border ${errors.Mobile ? 'border-red-500' : 'border-gray-300'} px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                onFocus={() => handleFocus('Mobile')}
                onBlur={(e) => handleBlur('Mobile', e.target.value)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData(prev => ({ ...prev, Mobile: value }));
                }}
                value={formData.Mobile}
              />
              {errors.Mobile && <p className="text-red-500 text-xs mt-1">{errors.Mobile}</p>}
            </div>

            {/* House Number Field */}
            <div className="relative">
              <label
                className={`absolute left-3 transition-all duration-200 ${focusedFields.HNo || formData.HNo ? 'top-1 text-xs text-blue-600 bg-white px-1 -ml-1' : 'top-3 text-gray-500'}`}
              >
                House No/Building {errors.HNo && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="HNo"
                className={`border ${errors.HNo ? 'border-red-500' : 'border-gray-300'} px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                onFocus={() => handleFocus('HNo')}
                onBlur={(e) => handleBlur('HNo', e.target.value)}
                onChange={handleChange}
                value={formData.HNo}
              />
              {errors.HNo && <p className="text-red-500 text-xs mt-1">{errors.HNo}</p>}
            </div>

            {/* Area Field */}
            <div className="relative">
              <label
                className={`absolute left-3 transition-all duration-200 ${focusedFields.Area || formData.Area ? 'top-1 text-xs text-blue-600 bg-white px-1 -ml-1' : 'top-3 text-gray-500'}`}
              >
                Road/Area/Colony
              </label>
              <input
                type="text"
                name="Area"
                className="border border-gray-300 px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                onFocus={() => handleFocus('Area')}
                onBlur={(e) => handleBlur('Area', e.target.value)}
                onChange={handleChange}
                value={formData.Area}
              />
            </div>

            {/* Pincode Field */}
            <div className="relative">
              <label
                className={`absolute left-3 transition-all duration-200 ${focusedFields.Pincode || formData.Pincode ? 'top-1 text-xs text-blue-600 bg-white px-1 -ml-1' : 'top-3 text-gray-500'}`}
              >
                Pincode {errors.Pincode && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="Pincode"
                className={`border ${errors.Pincode ? 'border-red-500' : 'border-gray-300'} px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                onFocus={() => handleFocus('Pincode')}
                onBlur={(e) => handleBlur('Pincode', e.target.value)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setFormData(prev => ({ ...prev, Pincode: value }));
                }}
                value={formData.Pincode}
              />
              {errors.Pincode && <p className="text-red-500 text-xs mt-1">{errors.Pincode}</p>}
            </div>

            {/* Locality Field */}
            <div className="relative">
              <label
                className={`absolute left-3 transition-all duration-200 ${focusedFields.locality || formData.locality ? 'top-1 text-xs text-blue-600 bg-white px-1 -ml-1' : 'top-3 text-gray-500'}`}
              >
                Locality {errors.locality && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="locality"
                className={`border ${errors.locality ? 'border-red-500' : 'border-gray-300'} px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                onFocus={() => handleFocus('locality')}
                onBlur={(e) => handleBlur('locality', e.target.value)}
                onChange={handleChange}
                value={formData.locality}
              />
              {errors.locality && <p className="text-red-500 text-xs mt-1">{errors.locality}</p>}
            </div>
          </div>

          {/* Landmark Field */}
          <div className="relative mt-4">
            <label
              className={`absolute left-3 transition-all duration-200 ${focusedFields.LandMark || formData.LandMark ? 'top-1 text-xs text-blue-600 bg-white px-1 -ml-1' : 'top-3 text-gray-500'}`}
            >
              Landmark (Optional)
            </label>
            <input
              type="text"
              name="LandMark"
              className="border border-gray-300 px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onFocus={() => handleFocus('LandMark')}
              onBlur={(e) => handleBlur('LandMark', e.target.value)}
              onChange={handleChange}
              value={formData.LandMark}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* City Field */}
            <div className="relative">
              <label
                className={`absolute left-3 transition-all duration-200 ${focusedFields.City || formData.City ? 'top-1 text-xs text-blue-600 bg-white px-1 -ml-1' : 'top-3 text-gray-500'}`}
              >
                City/District/Town {errors.City && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="City"
                className={`border ${errors.City ? 'border-red-500' : 'border-gray-300'} px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                onFocus={() => handleFocus('City')}
                onBlur={(e) => handleBlur('City', e.target.value)}
                onChange={handleChange}
                value={formData.City}
              />
              {errors.City && <p className="text-red-500 text-xs mt-1">{errors.City}</p>}
            </div>

            {/* State Field */}
            <div className="relative">
              <label
                className={`absolute left-3 transition-all duration-200 ${focusedFields.State || formData.State ? 'top-1 text-xs text-blue-600 bg-white px-1 -ml-1' : 'top-3 text-gray-500'}`}
              >
                State {errors.State && <span className="text-red-500">*</span>}
              </label>
              <select
                name="State"
                className={`border ${errors.State ? 'border-red-500' : 'border-gray-300'} px-3 pt-5 pb-2 rounded w-full text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                onFocus={() => handleFocus('State')}
                onBlur={(e) => handleBlur('State', e.target.value)}
                onChange={handleChange}
                value={formData.State}
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
              {errors.State && <p className="text-red-500 text-xs mt-1">{errors.State}</p>}
            </div>

            {/* Alternate Phone Field */}
            <div className="relative">
              <label
                className={`absolute left-3 transition-all duration-200 ${focusedFields.Alternative_Mobile || formData.Alternative_Mobile ? 'top-1 text-xs text-blue-600 bg-white px-1 -ml-1' : 'top-3 text-gray-500'}`}
              >
                Alternate Phone (Optional)
              </label>
              <input
                type="tel"
                name="Alternative_Mobile"
                className={`border ${errors.Alternative_Mobile ? 'border-red-500' : 'border-gray-300'} px-3 pt-5 pb-2 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                onFocus={() => handleFocus('Alternative_Mobile')}
                onBlur={(e) => handleBlur('Alternative_Mobile', e.target.value)}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData(prev => ({ ...prev, Alternative_Mobile: value }));
                }}
                value={formData.Alternative_Mobile}
              />
              {errors.Alternative_Mobile && <p className="text-red-500 text-xs mt-1">{errors.Alternative_Mobile}</p>}
            </div>
          </div>

          <div className="mt-4 flex gap-6">
            <label className="flex items-center text-gray-700">
              <input
                type="radio"
                name="Type"
                className="mr-2 text-blue-600"
                value="Home"
                checked={formData.Type === "Home"}
                onChange={handleChange}
              />
              Home
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="radio"
                name="Type"
                className="mr-2 text-blue-600"
                value="Work"
                checked={formData.Type === "Work"}
                onChange={handleChange}
              />
              Work
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="radio"
                name="Type"
                className="mr-2 text-blue-600"
                value="Other"
                checked={formData.Type === "Other"}
                onChange={handleChange}
              />
              Other
            </label>
          </div>

          <div className="mt-6 flex items-center gap-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
            >
              SAVE AND DELIVER HERE
            </button>
            <button
              type="button"
              className="text-blue-600 font-medium hover:underline"
              onClick={() => setShowAddress(false)}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressForm;