"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add_Address } from "../../redux/athentication/Athentication";
import { RxCross2 } from "react-icons/rx";
import {
  FaUser, FaPhone, FaHome, FaMapMarkerAlt, FaLandmark,
  FaBuilding, FaFlag, FaSearch, FaSpinner
} from "react-icons/fa";
import toast from "react-hot-toast";
import useGoogleMapsAutocomplete from "../../hooks/useGoogleMapsAutocomplete";

const InputField = ({
  label, value, onChangeText, placeholder, icon, maxLength,
  error, onBlur, editable = true, type = "text"
}) => {
  return (
    <div className="w-full mb-3">
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
        {error && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className={`relative flex items-center rounded-md border ${error ? "border-red-500" : "border-gray-300"}`}>
        <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-l-md">
          {React.cloneElement(icon, { className: "text-white text-base" })}
        </div>
        <input
          type={type}
          className="flex-1 px-3 py-2 text-sm text-gray-900 bg-transparent outline-none"
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
    isLoaded, loadError, initAutocomplete, reverseGeocode,
    fillAddressFields, setLocationError, locationError
  } = useGoogleMapsAutocomplete(GOOGLE_MAPS_API_KEY);

  const autocompleteInputRef = useRef(null);
  const [searchMode, setSearchMode] = useState(true);
  const [locationData, setLocationData] = useState(null);
  const [currentLocationLoading, setCurrentLocationLoading] = useState(false);
  const [buttonPress, setbuttonPress] = useState(false);
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [showAddressNew, setShowAddressNew] = useState(false);

  const [formData, setFormData] = useState({
    Name: loginData?.Name || "",
    Mobile: loginData?.Mobile || "",
    Alternative_Mobile: "", HNo: "", Area: "", locality: "",
    LandMark: "", City: "", State: "", Pincode: "",
    Type: "Home", clientId: loginData?._id || ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isLoaded && autocompleteInputRef.current) {
      const autocomplete = initAutocomplete(autocompleteInputRef.current);
      autocomplete?.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.address_components) {
          const addressData = fillAddressFields(place);
          addressData.formatted_address = place.formatted_address;
          updateFormWithAddressData(addressData);
        }
      });
    }
  }, [isLoaded, initAutocomplete, fillAddressFields]);

  const updateFormWithAddressData = async (data) => {
    setFormData(prev => ({
      ...prev,
      HNo: data.HNo || prev.HNo,
      Area: data.Area || prev.Area,
      locality: data.locality || prev.locality,
      City: data.City || prev.City,
      State: data.State || prev.State,
      Pincode: data.Pincode || prev.Pincode,
      LandMark: data.LandMark || prev.LandMark,
    }));
    if (autocompleteInputRef.current) {
      autocompleteInputRef.current.value = data.formatted_address || "";
    }
    if (data.Pincode?.length === 6) {
      await fetchCityStateByPincode(data.Pincode);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");

    setCurrentLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const place = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
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
      (err) => {
        setLocationError(err.message);
        toast.error("Location access denied or failed");
        setCurrentLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (formData.Type === "Other") {
      setShowAddressNew(true);
      setFormData(prev => ({ ...prev, Name: "", Mobile: "" }));
    } else {
      setShowAddressNew(false);
      setFormData(prev => ({ ...prev, Name: loginData?.Name || "", Mobile: loginData?.Mobile || "" }));
    }
  }, [formData.Type, loginData]);

  const validateField = (name, value) => {
    if (!value.trim() && ["Name", "Mobile", "HNo", "locality", "City", "State", "Pincode"].includes(name))
      return `${name === "HNo" ? "House/Flat" : name} is required`;
    if (name === "Mobile" && !/^\d{10}$/.test(value)) return "10 digits required";
    if (name === "Pincode" && !/^\d{6}$/.test(value)) return "6 digits required";
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    ["Name", "Mobile", "HNo", "locality", "City", "State", "Pincode"].forEach(field => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every(e => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setbuttonPress(true);
    try {
      const res = await dispatch(add_Address(formData));
      if (res.payload?.success) {
        toast.success("Address added successfully!");
        onclose();
      }
    } catch (err) {
      toast.error("Failed to add address");
    } finally {
      setbuttonPress(false);
    }
  };

  const fetchCityStateByPincode = async (pincode) => {
    if (pincode.length !== 6) return false;
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        setFormData(prev => ({
          ...prev,
          City: data[0].PostOffice[0].Division || "",
          State: data[0].PostOffice[0].State || ""
        }));
        setLocationData(data[0]);
        setIsPincodeValid(true);
        return true;
      }
    } catch (err) { }
    setIsPincodeValid(false);
    return false;
  };

  const handlePincodeChange = (val) => {
    const num = val.replace(/\D/g, "").slice(0, 6);
    setFormData(prev => ({ ...prev, Pincode: num }));
    if (num.length === 6) fetchCityStateByPincode(num);
  };

  const handleMobileChange = (field) => (val) => {
    const num = val.replace(/\D/g, "").slice(0, 10);
    setFormData(prev => ({ ...prev, [field]: num }));
  };

  const handleNameChange = (val) => {
    setFormData(prev => ({ ...prev, Name: val.replace(/[^a-zA-Z\s]/g, "") }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col h-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-5 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Add Shipping Address</h2>
          <button onClick={onclose} className="p-1 hover:bg-gray-200 rounded">
            <RxCross2 size={22} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-4">
            {/* Search / Location Toggle */}
            <div className="flex border rounded-lg overflow-hidden mb-4">
              <button
                onClick={() => setSearchMode(true)}
                className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-medium ${searchMode ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              >
                <FaSearch /> Search
              </button>
              <button
                onClick={() => setSearchMode(false)}
                className={`flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-medium ${!searchMode ? "bg-green-600 text-white" : "bg-gray-100"}`}
              >
                <FaMapMarkerAlt /> Live Location
              </button>
            </div>

            {/* Search Mode */}
            {searchMode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <input
                  ref={autocompleteInputRef}
                  type="text"
                  placeholder="Search your address..."
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {!isLoaded && <p className="text-sm text-blue-600 mt-2"><FaSpinner className="inline animate-spin" /> Loading maps...</p>}
              </div>
            )}

            {/* Live Location Mode */}
            {!searchMode && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                <button
                  onClick={handleUseCurrentLocation}
                  disabled={currentLocationLoading}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg flex items-center gap-2 mx-auto disabled:opacity-60"
                >
                  {currentLocationLoading ? (
                    <>Detecting... <FaSpinner className="animate-spin" /></>
                  ) : (
                    <>Detect My Location <FaMapMarkerAlt /></>
                  )}
                </button>
                {locationError && <p className="text-red-600 text-sm mt-3">{locationError}</p>}
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              {/* Left Column */}
              <div className="space-y-3">
                {showAddressNew && (
                  <>
                    <InputField label="Full Name" value={formData.Name} onChangeText={handleNameChange} placeholder="Name" icon={<FaUser />} error={errors.Name} onBlur={() => setErrors(prev => ({ ...prev, Name: validateField("Name", formData.Name) }))} />
                    <InputField label="Mobile" value={formData.Mobile} onChangeText={handleMobileChange("Mobile")} placeholder="10-digit mobile" icon={<FaPhone />} maxLength={10} error={errors.Mobile} onBlur={() => setErrors(prev => ({ ...prev, Mobile: validateField("Mobile", formData.Mobile) }))} />
                  </>
                )}
                <InputField label="Alternate Mobile" value={formData.Alternative_Mobile} onChangeText={handleMobileChange("Alternative_Mobile")} placeholder="Optional" icon={<FaPhone />} maxLength={10} />
                <InputField label="Flat/House No" value={formData.HNo} onChangeText={(v) => setFormData(prev => ({ ...prev, HNo: v }))} placeholder="e.g. A-12" icon={<FaHome />} error={errors.HNo} onBlur={() => setErrors(prev => ({ ...prev, HNo: validateField("HNo", formData.HNo) }))} />
                <InputField label="Locality/Area" value={formData.locality} onChangeText={(v) => setFormData(prev => ({ ...prev, locality: v }))} placeholder="e.g. Sector 62" icon={<FaMapMarkerAlt />} error={errors.locality} onBlur={() => setErrors(prev => ({ ...prev, locality: validateField("locality", formData.locality) }))} />
                <InputField label="City/District" value={formData.City} onChangeText={(v) => setFormData(prev => ({ ...prev, City: v }))} placeholder="City" icon={<FaBuilding />} error={errors.City} onBlur={() => setErrors(prev => ({ ...prev, City: validateField("City", formData.City) }))} />
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <InputField label="Landmark (Optional)" value={formData.LandMark} onChangeText={(v) => setFormData(prev => ({ ...prev, LandMark: v }))} placeholder="Near temple" icon={<FaLandmark />} />
                <InputField label="Pincode" value={formData.Pincode} onChangeText={handlePincodeChange} placeholder="6 digits" icon={<FaMapMarkerAlt />} maxLength={6} error={errors.Pincode} onBlur={() => setErrors(prev => ({ ...prev, Pincode: validateField("Pincode", formData.Pincode) }))} />
                <InputField label="State" value={formData.State} onChangeText={() => {}} placeholder="Auto-filled" icon={<FaFlag />} editable={false} error={errors.State} />

                {isPincodeValid && locationData?.PostOffice?.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Area / Village</label>
                    <select
                      value={formData.Area}
                      onChange={(e) => setFormData(prev => ({ ...prev, Area: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">Select Area</option>
                      {locationData.PostOffice.map((po, i) => (
                        <option key={i} value={po.Name}>{po.Name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-4">
                  <label className="block text-sm font-semibold mb-2">Save as</label>
                  <div className="flex gap-3 flex-wrap">
                    {["Home", "Work", "Other"].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, Type: type }))}
                        className={`px-5 py-2 rounded-full text-sm font-medium border ${formData.Type === type ? "bg-orange-500 text-white border-orange-500" : "border-gray-300"}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Fixed Bottom Button */}
        <div className="border-t bg-white p-4 sticky bottom-0">
          <button
            onClick={handleSubmit}
            disabled={buttonPress}
            className="w-full py-3.5 bg-[#2f415d] hover:bg-[#1e2e45] text-white font-bold rounded-lg text-lg transition disabled:opacity-60"
          >
            {buttonPress ? "Adding Address..." : "Add Address"}
          </button>
        </div>


      </div>
    </div>
  );
};

export default AddAddress;