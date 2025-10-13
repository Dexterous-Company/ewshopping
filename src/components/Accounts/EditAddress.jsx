"use client";
import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAddress,
  updateAddressLocally,
} from "@/redux/athentication/Athentication";
import {
  FaUser,
  FaPhone,
  FaHome,
  FaMapMarkerAlt,
  FaLandmark,
  FaBuilding,
  FaFlag,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

const EditAddress = ({ onclose, addressData }) => {
  const dispatch = useDispatch();
  const { loginData } = useSelector((state) => state.Athentication);
  const router = useRouter();
  const [locationData, setLocationData] = useState(null);
  const [isPincodeValid, setIsPincodeValid] = useState(false);
  const [buttonPress, setButtonPress] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAddressNew, setShowAddressNew] = useState(false);

  const [Name, setName] = useState("");
  const [Mobile, setMobile] = useState("");
  const [Alternative_Mobile, setAlternative_Mobile] = useState("");
  const [HNo, setHNo] = useState("");
  const [Area, setArea] = useState("");
  const [locality, setLocality] = useState("");
  const [LandMark, setLandMark] = useState("");
  const [City, setCity] = useState("");
  const [State, setState] = useState("");
  const [Pincode, setPincode] = useState("");
  const [Type, setType] = useState("Home");

  // Initialize form with address data
  useEffect(() => {
    if (addressData) {
      setName(addressData.Name || "");
      setMobile(addressData.Mobile || "");
      setAlternative_Mobile(addressData.Alternative_Mobile || "");
      setHNo(addressData.HNo || "");
      setArea(addressData.Area || "");
      setLocality(addressData.locality || "");
      setLandMark(addressData.LandMark || "");
      setCity(addressData.City || "");
      setState(addressData.State || "");
      setPincode(addressData.Pincode || "");
      setType(addressData.Type || "Home");

      // Check if we should show name and mobile fields
      setShowAddressNew(addressData.Type === "Other");

      // Validate pincode if it exists
      if (addressData?.Pincode) {
        fetchCityStateByPincode(String(addressData.Pincode)).then((success) => {
          setIsPincodeValid(success);
        });
      }
    }
  }, [addressData]);

  useEffect(() => {
    if (Type === "Other") {
      setShowAddressNew(true);
    } else {
      setShowAddressNew(false);
      if (!addressData?.Name) {
        setName(loginData?.Name || "");
      }
      if (!addressData?.Mobile) {
        setMobile(loginData?.Mobile || "");
      }
    }
  }, [Type, loginData, addressData]);

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
      Name: validateField("Name", Name),
      Mobile: validateField("Mobile", Mobile),
      HNo: validateField("HNo", HNo),
      locality: validateField("locality", locality),
      City: validateField("City", City),
      State: validateField("State", State),
      Pincode: validateField("Pincode", Pincode),
      Alternative_Mobile: validateField(
        "Alternative_Mobile",
        Alternative_Mobile
      ),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
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
          setCity(districts[0] || City);
          setState(states[0] || State);
          setLocationData(data[0]);
          setErrors((prev) => ({ ...prev, Pincode: "" }));
          return true;
        } else {
          setErrors((prev) => ({ ...prev, Pincode: "Invalid Pincode" }));
          setLocationData(null);
          return false;
        }
      } catch (error) {
        console.log("Error fetching city/state:", error);
        setLocationData(null);
        setErrors((prev) => ({ ...prev, Pincode: "Error fetching data" }));
        return false;
      }
    } else {
      setLocationData(null);
      return false;
    }
  };

  const handlePincodeChange = async (text) => {
    const cleaned = text.replace(/\D/g, "");
    setPincode(cleaned);
    if (cleaned.length === 6) {
      const success = await fetchCityStateByPincode(cleaned);
      setIsPincodeValid(success);
    } else {
      setIsPincodeValid(false);
      if (!addressData?.Area) setArea("");
      if (!addressData?.City) setCity("");
      if (!addressData?.State) setState("");
    }
  };

  const handleMobileChange = (setter) => (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10);
    setter(cleaned);
  };

  const handleNameChange = (value) => {
    const cleaned = value.replace(/[^a-zA-Z\s]/g, "");
    setName(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonPress(true);
    if (validateForm()) {
      const formData = {
        Name,
        Mobile,
        Alternative_Mobile,
        HNo,
        Area,
        locality,
        LandMark,
        City,
        State,
        Pincode,
        Type,
        clientId: loginData?._id || "",
        addressId: addressData?._id || "",
      };

      try {
        const resp = await dispatch(updateAddress(formData));

        if (resp.payload?.success) {
          const client = resp.payload.client;
          const data_address = client.Addresses;
          dispatch(updateAddressLocally(data_address));
          toast.success("Address updated successfully");
          onclose();
        } else {
          toast.error("Failed to update address");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        toast.error("Error updating address");
      } finally {
        setButtonPress(false);
      }
    } else {
      setButtonPress(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/20 flex h-[100vh] items-center justify-center z-50 p-2 sm:p-4">
      <div className="w-full max-w-4xl max-h-[90vh] sm:max-h-[80vh] bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white rounded-t-xl">
          <h2 className="text-lg font-bold text-gray-900">Edit Address</h2>
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
              <div className="bg-white rounded-lg p-4">
                {showAddressNew && (
                  <>
                    <InputField
                      label="Full Name"
                      value={Name}
                      onChangeText={handleNameChange}
                      placeholder="Enter Name"
                      icon={<FaUser className="text-white text-lg" />}
                      error={errors.Name}
                      onBlur={() =>
                        setErrors({
                          ...errors,
                          Name: validateField("Name", Name),
                        })
                      }
                    />
                    <InputField
                      label="Mobile"
                      value={Mobile}
                      onChangeText={handleMobileChange(setMobile)}
                      placeholder="Enter Mobile"
                      icon={<FaPhone className="text-white text-lg" />}
                      type="tel"
                      maxLength={10}
                      error={errors.Mobile}
                      onBlur={() =>
                        setErrors({
                          ...errors,
                          Mobile: validateField("Mobile", Mobile),
                        })
                      }
                    />
                  </>
                )}

                <InputField
                  label="Alternative Mobile"
                  value={Alternative_Mobile}
                  onChangeText={handleMobileChange(setAlternative_Mobile)}
                  placeholder="Alternative Mobile"
                  icon={<FaPhone className="text-white text-lg" />}
                  type="tel"
                  maxLength={10}
                  error={errors.Alternative_Mobile}
                  onBlur={() =>
                    setErrors({
                      ...errors,
                      Alternative_Mobile: validateField(
                        "Alternative_Mobile",
                        Alternative_Mobile
                      ),
                    })
                  }
                />

                <InputField
                  label="Flat No/House No/Building No"
                  value={HNo}
                  onChangeText={setHNo}
                  placeholder="Enter House No"
                  icon={<FaHome className="text-white text-lg" />}
                  error={errors.HNo}
                  onBlur={() =>
                    setErrors({ ...errors, HNo: validateField("HNo", HNo) })
                  }
                />

                <InputField
                  label="Locality"
                  value={locality}
                  onChangeText={setLocality}
                  placeholder="Enter Locality"
                  icon={<FaMapMarkerAlt className="text-white text-lg" />}
                  error={errors.locality}
                  onBlur={() =>
                    setErrors({
                      ...errors,
                      locality: validateField("locality", locality),
                    })
                  }
                />

                <InputField
                  label="Landmark"
                  value={LandMark}
                  onChangeText={setLandMark}
                  placeholder="Enter Landmark"
                  icon={<FaLandmark className="text-white text-lg" />}
                />

                <InputField
                  label="Pincode"
                  value={Pincode}
                  onChangeText={handlePincodeChange}
                  placeholder="Enter Pincode"
                  icon={<FaMapMarkerAlt className="text-white text-lg" />}
                  type="text"
                  maxLength={6}
                  error={errors.Pincode}
                  onBlur={() =>
                    setErrors({
                      ...errors,
                      Pincode: validateField("Pincode", Pincode),
                    })
                  }
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
                          value={Area}
                          onChange={(e) => setArea(e.target.value)}
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
                      value={City}
                      onChangeText={setCity}
                      placeholder="Enter City"
                      icon={<FaBuilding className="text-white text-lg" />}
                      error={errors.City}
                      onBlur={() =>
                        setErrors({
                          ...errors,
                          City: validateField("City", City),
                        })
                      }
                    />

                    <InputField
                      label="State"
                      value={State}
                      onChangeText={setState}
                      placeholder="Enter State"
                      icon={<FaFlag className="text-white text-lg" />}
                      error={errors.State}
                      editable={false}
                      onBlur={() =>
                        setErrors({
                          ...errors,
                          State: validateField("State", State),
                        })
                      }
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
                        onClick={() => setType(t)}
                        className={`px-6 py-2 rounded-full border transition-colors ${
                          Type === t
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
            {buttonPress ? "Updating Address..." : "Update Address"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAddress;
