"use client";
import React, { useState } from "react";
import {
  FaPlus,
  FaCheck,
  FaEdit,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaBriefcase,
  FaTruck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import AddAddressForm from "./AddAddressForm";
import EditAddressCheckOut from "./EditAddressCheckOut";
import {
  setCheckoutStep,
  setCurrentAddress,
} from "@/redux/athentication/Athentication";

const CheckOutAddress = ({ setShowSummary }) => {
  const { loginData, isAuth, user_address, current_address } = useSelector(
    (store) => store.Athentication
  );
  const dispatch = useDispatch();

  const [edit, setIsedit] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [deliveryToHereShow, setDeliveryToHereShow] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(
    current_address
      ? current_address._id
      : user_address.length > 0
      ? user_address[0]._id
      : null
  );

  const handleDeliverHere = () => {
    if (selectedAddress) {
      const address = user_address.find((addr) => addr._id === selectedAddress);
      if (address) {
        dispatch(setCurrentAddress(address));
        dispatch(setCheckoutStep(3));
      }
    }
    setShowSummary(true);
    setDeliveryToHereShow(true);
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    const address = user_address.find((addr) => addr._id === addressId);
    if (address) {
      dispatch(setCurrentAddress(address));
    }
  };

  const [editAddressObject, setEditAddressObject] = useState("");

  // Professional address type configuration
  const addressTypeConfig = {
    home: {
      icon: FaHome,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      label: "Home",
    },
    work: {
      icon: FaBriefcase,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      label: "Work",
    },
    office: {
      icon: FaBuilding,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      label: "Office",
    },
    other: {
      icon: FaMapMarkerAlt,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      label: "Other",
    },
  };

  const getAddressConfig = (type) => {
    const normalizedType = type?.toLowerCase() || "other";
    return addressTypeConfig[normalizedType] || addressTypeConfig.other;
  };

  return (
    <>
      {isAuth ? (
        <>
          {deliveryToHereShow ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xs border border-green-200 shadow-xs p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#212121] rounded-full flex items-center justify-center">
                    <FaCheck className="text-[#ffff] text-lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-500">
                        STEP 2
                      </span>
                      <span className="text-green-600 text-sm font-medium">
                        • CONFIRMED
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      Deliver to:{" "}
                      <span className="text-gray-700">{loginData?.Name}</span>
                    </p>
                    <div className="text-sm text-gray-600 mt-1 sm:max-w-none w-48">
                      {current_address?.HNo}, {current_address?.locality},{" "}
                      {current_address?.City}, {current_address?.State} -{" "}
                      {current_address?.Pincode}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setDeliveryToHereShow(false);
                    setShowSummary(false);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-300 transition-colors"
                >
                  Change
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
              {/* Professional Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Delivery Address
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Select your preferred delivery location
                    </p>
                  </div>
                </div>
              </div>

              {/* Address List */}
              <div className="sm:p-6 p-2">
                <AnimatePresence>
                  {user_address?.length > 0 ? (
                    <div className="space-y-4">
                      {user_address.map((address, index) => {
                        const config = getAddressConfig(address.Type);
                        const IconComponent = config.icon;

                        return (
                          <motion.div
                            key={address._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              selectedAddress === address._id
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => handleAddressSelect(address._id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                {/* Radio Button */}
                                <div className="mt-1">
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      selectedAddress === address._id
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {selectedAddress === address._id && (
                                      <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                  </div>
                                </div>

                                {/* Address Content */}
                                <div className="flex-1">
                                  <div className="flex sm:items-center sm:flex-row flex-col gap-3 mb-3">
                                    <div
                                      className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} ${config.borderColor} border`}
                                    >
                                      <IconComponent
                                        className={`text-sm w-fit ${config.color}`}
                                      />
                                      <span className="text-xs font-medium text-gray-700">
                                        {config.label} • {address.Name} •{" "}
                                        {address.Mobile}
                                      </span>
                                    </div>
                                    {/* <span className="text-sm text-gray-500">
                                      •
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {address.Name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      •
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      {address.Mobile}
                                    </span> */}
                                  </div>

                                  <div className="space-y-1 text-gray-700">
                                    <p className="text-sm leading-relaxed font-semibold">
                                      {address.HNo}, {address.Area},{" "}
                                      {address.locality}
                                      {address.LandMark &&
                                        `, ${address.LandMark}`}
                                      {address.City}, {address.State} -{" "}
                                      {address.Pincode}
                                    </p>
                                  </div>

                                  {/* Mobile Action Button */}
                                  {selectedAddress === address._id && (
                                    <div className="mt-4 flex gap-3">
                                      <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="bg-gray-900 text-white text-sm font-medium py-2 px-6 rounded-lg flex-1 text-center"
                                        onClick={handleDeliverHere}
                                      >
                                        Deliver to this Address
                                      </motion.button>
                                      {/* <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setIsedit(true);
                                            setEditAddressObject(address);
                                          }}
                                          className="text-gray-600 hover:text-gray-700 p-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                                        >
                                          <FaEdit className="text-sm" />
                                        </button> */}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Desktop Actions */}
                              <div className="hidden lg:flex items-center gap-3 ml-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsedit(true);
                                    setEditAddressObject(address);
                                  }}
                                  className="text-gray-600 hover:text-gray-700 text-sm font-medium px-3 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                                >
                                  Edit
                                </button>
                                {selectedAddress === address._id && (
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-gray-900 text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
                                    onClick={handleDeliverHere}
                                  >
                                    Deliver Here
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaMapMarkerAlt className="text-gray-400 text-xl" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No addresses saved
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Add your first delivery address to continue
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Add New Address */}
                {!showAddress && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <button
                      onClick={() => setShowAddress(true)}
                      className="w-full flex items-center justify-center gap-3 text-gray-700 hover:text-gray-900 font-medium py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <FaPlus className="text-sm" />
                      </div>
                      <span>Add New Address</span>
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Add Address Form */}
              {showAddress && (
                <div className="border-t border-gray-200">
                  <AddAddressForm
                    setShowAddress={setShowAddress}
                    onAddressAdded={(newAddress) => {
                      setSelectedAddress(newAddress._id);
                      dispatch(setCurrentAddress(newAddress));
                    }}
                  />
                </div>
              )}

              {/* Edit Modal */}
              {edit && (
                <EditAddressCheckOut
                  editAddressObject={editAddressObject}
                  onClose={() => setIsedit(false)}
                  onUpdateSelected={(id) => {
                    setSelectedAddress(id);
                    const updatedAddress = user_address.find(
                      (addr) => addr._id === id
                    );
                    if (updatedAddress) {
                      dispatch(setCurrentAddress(updatedAddress));
                    }
                  }}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Delivery Address</h3>
              <p className="text-sm text-gray-600 mt-1">
                Please login to manage your addresses
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckOutAddress;
