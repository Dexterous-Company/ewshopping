"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add_Address } from "@/redux/athentication/Athentication";
import { RxCross2 } from "react-icons/rx";
import {
  FaUser,
  FaPhone,
  FaHome,
  FaMapMarkerAlt,
  FaLandmark,
  FaBuilding,
  FaFlag,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";
import useGoogleMapsAutocomplete from "@/hooks/useGoogleMapsAutocomplete";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  keyboardType = "text",
  maxLength,
  error,
  onBlur,
  editable = true,
  type = "text",
}) => {
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {error && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className={`relative flex items-center rounded-lg border ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-l-lg">
          {icon}
        </div>
        <input
          type={type}
          className="flex-1 px-3 py-3 text-gray-900 bg-transparent outline-none"
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={placeholder}
          onBlur={onBlur}
          disabled={!editable}
          maxLength={maxLength}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

const AddAddress = ({ onclose }) => {
  const dispatch = useDispatch();
  const { loginData } = useSelector((state) => state.Athentication);

  const GOOGLE_MAPS_API_KEY = "AIzaSyD9On5PRHixcY4UO4T-0DowNTcDyBhMrlI";
  const {
    isLoaded,
    loadError,
    isGettingLocation,
    locationError,
    initAutocomplete,
    getCurrentLocation,
    reverseGeocode,
    fillAddressFields,
    setLocationError,
  } = useGoogleMapsAutocomplete(GOOGLE_MAPS_API_KEY);

  const autocompleteInputRef = useRef(null);
  const autocompleteInstanceRef = useRef(null);

  const [searchMode, setSearchMode] = useState(true);
  const [locationData, setLocationData] = useState(null);
  const [currentLocationLoading, setCurrentLocationLoading] = useState(false);
  const [buttonPress, setbuttonPress] = useState(false);
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [showAddressNew, setShowAddressNew] = useState(false);

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
    clientId: loginData?._id || "",
  });

  const [errors, setErrors] = useState({
    Name: "",
    Mobile: "",
    Alternative_Mobile: "",
    HNo: "",
    locality: "",
    City: "",
    State: "",
    Pincode: "",
  });

  // Initialize Google Maps Autocomplete when loaded
  useEffect(() => {
    if (
      isLoaded &&
      autocompleteInputRef.current &&
      !autocompleteInstanceRef.current
    ) {
      const autocomplete = initAutocomplete(autocompleteInputRef.current);

      if (autocomplete) {
        autocompleteInstanceRef.current = autocomplete;

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.address_components) {
            const addressData = fillAddressFields(place);
            updateFormWithAddressData(addressData);
          }
        });
      }
    }
  }, [isLoaded, initAutocomplete, fillAddressFields]);

  const updateFormWithAddressData = async (addressData) => {
    const updatedData = {
      ...formData,
      HNo: addressData.HNo || formData.HNo,
      Area: addressData.Area || formData.Area,
      locality: addressData.locality || formData.locality,
      City: addressData.City || formData.City,
      State: addressData.State || formData.State,
      Pincode: addressData.Pincode || formData.Pincode,
      LandMark: addressData.LandMark || formData.LandMark,
    };

    setFormData(updatedData);

    // Also update the search input with the formatted address
    if (autocompleteInputRef.current && addressData.formatted_address) {
      autocompleteInputRef.current.value = addressData.formatted_address;
    }

    if (addressData.Pincode && addressData.Pincode.length === 6) {
      const success = await fetchCityStateByPincode(addressData.Pincode);
      setIsPincodeValid(success);
    } else {
      setIsPincodeValid(false);
      setFormData((prev) => ({ ...prev, City: "", State: "", Area: "" }));
    }
  };

  // const handleUseCurrentLocation = async () => {
  //   try {
  //     setCurrentLocationLoading(true);
  //     setLocationError(null);
  //     const position = await getCurrentLocation();
  //     const place = await reverseGeocode(position.lat, position.lng);

  //     if (place) {
  //       const addressData = fillAddressFields(place);
  //       addressData.formatted_address = place.formatted_address;
  //       updateFormWithAddressData(addressData);

  //       // Also update the search input with the formatted address
  //       if (autocompleteInputRef.current) {
  //         autocompleteInputRef.current.value = place.formatted_address;
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error getting current location:", error);
  //     setLocationError(error.message);
  //     toast.error(error.message);
  //   } finally {
  //     setCurrentLocationLoading(false);
  //   }
  // };

  const handleUseCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your device.");
      return;
    }

    try {
      setCurrentLocationLoading(true);
      setLocationError(null);

      // Ask for permission explicitly
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "denied") {
        toast.error(
          "Location access denied. Please enable it in your browser settings."
        );
        setCurrentLocationLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const place = await reverseGeocode(latitude, longitude);

          if (place) {
            const addressData = fillAddressFields(place);
            addressData.formatted_address = place.formatted_address;
            updateFormWithAddressData(addressData);

            if (autocompleteInputRef.current) {
              autocompleteInputRef.current.value = place.formatted_address;
            }
          }
          setCurrentLocationLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(error.message || "Unable to access location.");
          toast.error(error.message || "Unable to access location.");
          setCurrentLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while accessing location.");
      setCurrentLocationLoading(false);
    }
  };

  useEffect(() => {
    if (formData.Type === "Other") {
      setShowAddressNew(true);
      setFormData((prev) => ({ ...prev, Name: "", Mobile: "" }));
    } else {
      setShowAddressNew(false);
      setFormData((prev) => ({
        ...prev,
        Name: loginData?.Name || "",
        Mobile: loginData?.Mobile || "",
      }));
    }
  }, [formData.Type, loginData]);

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
    return error;
  };

  const validateForm = () => {
    const newErrors = {
      Name: validateField("Name", formData.Name),
      Mobile: validateField("Mobile", formData.Mobile),
      HNo: validateField("HNo", formData.HNo),
      locality: validateField("locality", formData.locality),
      City: validateField("City", formData.City),
      State: validateField("State", formData.State),
      Pincode: validateField("Pincode", formData.Pincode),
      Alternative_Mobile: validateField(
        "Alternative_Mobile",
        formData.Alternative_Mobile
      ),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setbuttonPress(true);

    if (validateForm()) {
      try {
        const add_address_post = await dispatch(add_Address(formData));

        if (add_address_post.payload?.success) {
          // const client = add_address_post.payload.client;
          // const data_address = client.Addresses;
          // await dispatch(add_Address(data_address));
          toast.success("Address added successfully");
          onclose();
          // Reset form
          setFormData({
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
            clientId: loginData?._id || "",
          });
        }
      } catch (error) {
        console.error("Error adding address:", error);
        toast.error("Failed to add address");
      } finally {
        setbuttonPress(false);
      }
    } else {
      setbuttonPress(false);
    }
  };

  const fetchCityStateByPincode = async (pincode) => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await response.json();

        if (data[0].Status === "Success" && data[0].PostOffice?.length) {
          const districts = [
            ...new Set(data[0].PostOffice.map((po) => po.Division)),
          ];
          const states = [...new Set(data[0].PostOffice.map((po) => po.State))];

          setFormData((prev) => ({
            ...prev,
            City: districts[0] || "",
            State: states[0] || "",
          }));

          setLocationData(data[0]);
          setErrors((prev) => ({ ...prev, Pincode: "" }));
          return true;
        } else {
          setErrors((prev) => ({ ...prev, Pincode: "Invalid Pincode" }));
          setFormData((prev) => ({ ...prev, City: "", State: "" }));
          setLocationData(null);
          return false;
        }
      } catch (error) {
        console.log("Error fetching city/state:", error);
        setFormData((prev) => ({ ...prev, City: "", State: "" }));
        setLocationData(null);
        setErrors((prev) => ({ ...prev, Pincode: "Error fetching data" }));
        return false;
      }
    } else {
      setFormData((prev) => ({ ...prev, City: "", State: "" }));
      setLocationData(null);
      return false;
    }
  };

  const handlePincodeChange = async (text) => {
    const cleaned = text.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, Pincode: cleaned }));

    if (cleaned.length === 6) {
      const success = await fetchCityStateByPincode(cleaned);
      setIsPincodeValid(success);
    } else {
      setIsPincodeValid(false);
      setFormData((prev) => ({ ...prev, City: "", State: "", Area: "" }));
    }
  };

  const handleMobileChange = (field) => (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, [field]: cleaned }));
  };

  const handleNameChange = (value) => {
    const cleaned = value.replace(/[^a-zA-Z\s]/g, "");
    setFormData((prev) => ({ ...prev, Name: cleaned }));
  };

  const handleInputChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => () => {
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex h-[100vh] items-center justify-center z-50 p-2 sm:p-4">
      <div className="w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            Add Shipping Address
          </h2>
          <button
            onClick={onclose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <RxCross2 size={20} />
          </button>
        </div>
        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Address Selection Mode Toggle */}
              {/* <div className="mb-4">
                <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-4">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                      searchMode
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSearchMode(true)}
                  >
                    <FaSearch size={16} />
                    Search & Select
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
                      !searchMode
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSearchMode(false)}
                  >
                    <FaMapMarkerAlt size={16} />
                    Use Live Location
                  </button>
                </div>
                {searchMode && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="relative mb-2">
                      <input
                        ref={autocompleteInputRef}
                        type="text"
                        id="autocomplete-search"
                        className="border-2 border-blue-300 px-3 py-3 rounded w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                        placeholder="Start typing your address..."
                      />
                    </div>
                    {loadError && (
                      <p className="text-red-500 text-xs mt-1">
                        Google Maps loading failed: {loadError}
                      </p>
                    )}
                    {!isLoaded && !loadError && (
                      <p className="text-blue-600 text-xs mt-1 flex items-center gap-2">
                        <FaSpinner className="animate-spin" />
                        Loading Google Maps...
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      💡 Start typing your address and select from Google Maps
                      suggestions to auto-fill the form
                    </p>
                  </div>
                )}

                {!searchMode && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-center">
                      <FaMapMarkerAlt
                        size={32}
                        className="text-green-500 mx-auto mb-3"
                      />
                      <h3 className="font-semibold text-green-800 mb-2">
                        Use Your Current Location
                      </h3>
                      <p className="text-sm text-green-600 mb-4">
                        We'll use your device's GPS to automatically fill your
                        address details.
                      </p>

                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={currentLocationLoading}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {currentLocationLoading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Detecting Location...
                          </>
                        ) : (
                          <>
                            <FaMapMarkerAlt />
                            Detect My Location
                          </>
                        )}
                      </button>

                      {locationError && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm">
                            {locationError}
                          </p>
                          <button
                            type="button"
                            onClick={() => setLocationError(null)}
                            className="text-red-500 hover:text-red-700 text-xs mt-1"
                          >
                            Dismiss
                          </button>
                        </div>
                      )}

                      {currentLocationLoading && (
                        <div className="mt-3">
                          <p className="text-green-600 text-sm flex items-center justify-center gap-2">
                            <FaSpinner className="animate-spin" />
                            Accessing your location... Please allow location
                            access if prompted.
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500 mt-3">
                        🔒 Your location data is only used to fill the address
                        form and is not stored.
                      </p>
                    </div>
                  </div>
                )}
              </div> */}
              <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  className={`flex-1 py-2 sm:py-3 text-sm sm:text-base ${
                    searchMode
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSearchMode(true)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaSearch size={14} />
                    Search
                  </div>
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 sm:py-3 text-sm sm:text-base ${
                    !searchMode
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSearchMode(false)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaMapMarkerAlt size={14} />
                    Live Location
                  </div>
                </button>
              </div>

              {/* Search Mode */}
              {searchMode && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    ref={autocompleteInputRef}
                    type="text"
                    className="border-2 border-blue-300 px-3 py-2 sm:py-3 rounded w-full focus:border-blue-500 bg-white text-sm sm:text-base"
                    placeholder="Start typing your address..."
                  />
                </div>
              )}

              {/* Live Mode */}
              {!searchMode && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={currentLocationLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {currentLocationLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <FaMapMarkerAlt />
                        Detect My Location
                      </>
                    )}
                  </button>
                  {locationError && (
                    <p className="text-red-500 text-xs mt-2">{locationError}</p>
                  )}
                </div>
              )}
              <div className="bg-white rounded-lg p-4">
                {showAddressNew && (
                  <>
                    <InputField
                      label="Full Name"
                      value={formData.Name}
                      onChangeText={handleNameChange}
                      placeholder="Enter Name"
                      icon={<FaUser className="text-white text-lg" />}
                      error={errors.Name}
                      onBlur={handleBlur("Name")}
                    />
                    <InputField
                      label="Mobile"
                      value={formData.Mobile}
                      onChangeText={handleMobileChange("Mobile")}
                      placeholder="Enter Mobile"
                      icon={<FaPhone className="text-white text-lg" />}
                      type="tel"
                      maxLength={10}
                      error={errors.Mobile}
                      onBlur={handleBlur("Mobile")}
                    />
                  </>
                )}

                <InputField
                  label="Alternative Mobile"
                  value={formData.Alternative_Mobile}
                  onChangeText={handleMobileChange("Alternative_Mobile")}
                  placeholder="Alternative Mobile"
                  icon={<FaPhone className="text-white text-lg" />}
                  type="tel"
                  maxLength={10}
                  error={errors.Alternative_Mobile}
                  onBlur={handleBlur("Alternative_Mobile")}
                />

                <InputField
                  label="Flat No/House No/Building No"
                  value={formData.HNo}
                  onChangeText={handleInputChange("HNo")}
                  placeholder="Enter House No"
                  icon={<FaHome className="text-white text-lg" />}
                  error={errors.HNo}
                  onBlur={handleBlur("HNo")}
                />

                <InputField
                  label="Locality"
                  value={formData.locality}
                  onChangeText={handleInputChange("locality")}
                  placeholder="Enter Locality"
                  icon={<FaMapMarkerAlt className="text-white text-lg" />}
                  error={errors.locality}
                  onBlur={handleBlur("locality")}
                />

                <InputField
                  label="Landmark"
                  value={formData.LandMark}
                  onChangeText={handleInputChange("LandMark")}
                  placeholder="Enter Landmark"
                  icon={<FaLandmark className="text-white text-lg" />}
                />

                <InputField
                  label="Pincode"
                  value={formData.Pincode}
                  onChangeText={handlePincodeChange}
                  placeholder="Enter Pincode"
                  icon={<FaMapMarkerAlt className="text-white text-lg" />}
                  type="text"
                  maxLength={6}
                  error={errors.Pincode}
                  onBlur={handleBlur("Pincode")}
                />

                {isPincodeValid && (
                  <>
                    {/* Area Dropdown */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Town/Village/Area
                      </label>
                      <div className="relative flex items-center rounded-lg border border-gray-300 bg-gray-50">
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-l-lg">
                          <FaMapMarkerAlt className="text-white text-lg" />
                        </div>
                        <select
                          value={formData.Area}
                          onChange={(e) =>
                            handleInputChange("Area")(e.target.value)
                          }
                          className="flex-1 px-3 py-3 text-gray-900 bg-transparent outline-none appearance-none"
                        >
                          <option value="">Select Area</option>
                          {locationData?.PostOffice?.length > 0 ? (
                            locationData.PostOffice.map((po, index) => (
                              <option key={index} value={po.Name}>
                                {po.Name}
                              </option>
                            ))
                          ) : (
                            <option value="">No areas available</option>
                          )}
                        </select>
                        <div className="absolute right-3 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <InputField
                      label="City"
                      value={formData.City}
                      onChangeText={handleInputChange("City")}
                      placeholder="Enter City"
                      icon={<FaBuilding className="text-white text-lg" />}
                      error={errors.City}
                      onBlur={handleBlur("City")}
                    />

                    <InputField
                      label="State"
                      value={formData.State}
                      onChangeText={handleInputChange("State")}
                      placeholder="Enter State"
                      icon={<FaFlag className="text-white text-lg" />}
                      error={errors.State}
                      editable={false}
                      onBlur={handleBlur("State")}
                    />
                  </>
                )}

                {/* Address Type Selection */}
                <div className="mb-4">
                  <label className="block text-base font-semibold text-gray-900 mb-3">
                    Save as
                  </label>
                  <div className="flex gap-3">
                    {["Home", "Work", "Other"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, Type: t }))
                        }
                        className={`px-6 py-2 rounded-full border transition-colors ${
                          formData.Type === t
                            ? "bg-[#e26f4e] border-[#e26f4e] text-white"
                            : "border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* Footer Button */}
        <div className="border-t border-gray-200 bg-white p-5 rounded-b-xl">
          <button
            onClick={handleSubmit}
            disabled={buttonPress}
            className="w-full py-3 mb-2 bg-[#2f415d] text-white rounded-lg font-bold text-lg hover:bg-[#1e2e45] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {buttonPress ? "Adding Address..." : "Add Address"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
