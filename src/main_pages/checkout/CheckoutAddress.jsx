
"use client";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import AddAddressForm from "./AddAddressForm";
import { useSelector, useDispatch } from "react-redux";
import EditAddressCheckOut from "./EditAddressCheckOut";
import { setCheckoutStep, setCurrentAddress } from "@/redux/athentication/Athentication";

const CheckOutAddress = ({ setShowSummary }) => {
  const { loginData, isAuth, user_address, current_address } = useSelector((store) => store.Athentication);
  const dispatch = useDispatch();

  const [edit, setIsedit] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [deliveryToHereShow, setDeliveryToHereShow] = useState(false);

  // Initialize selected address with current_address or first address if available
  const [selectedAddress, setSelectedAddress] = useState(
    current_address ? current_address._id : (user_address.length > 0 ? user_address[0]._id : null)
  );

  const handleDeliverHere = () => {
    // Set the current address in Redux before proceeding
    if (selectedAddress) {
      const address = user_address.find(addr => addr._id === selectedAddress);
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
    // Optionally update current address in Redux immediately when selected
    const address = user_address.find(addr => addr._id === addressId);
    if (address) {
      dispatch(setCurrentAddress(address));
    }
  };

  const [editAddressObject, setEditAddressObject] = useState("");

  return (
    <>
      {isAuth ? (
        <>
          {deliveryToHereShow ? (
            <>
              <div className="bg-white rounded shadow-sm p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-medium text-sm text-[#878787]">
                    <span className="h-5 w-5 bg-[#f0f0f0] text-[#2874f0] text-xs font-bold flex items-center justify-center rounded">
                      2
                    </span>
                    <span>DELIVERY ADDRESS</span>
                    <span className="text-[#2874f0]">
                      <FaCheck size={14} />
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-black ml-6">
                    <span className="font-semibold">{loginData?.Name}</span>
                    <span className="ml-2 text-[#3c3c3c]">
                      {current_address?.HNo}, {current_address?.locality}, {current_address?.City},{" "}
                      {current_address?.State} - {current_address?.Pincode}
                    </span>
                  </div>
                </div>
                <button
                  className="text-[#2874f0] font-medium text-sm border border-[#e0e0e0] px-4 py-1 rounded hover:bg-[#f5faff]"
                  onClick={() => {
                    setDeliveryToHereShow(false);
                    setShowSummary(false)
                  }}
                >
                  CHANGE
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#fff] flex flex-col relative rounded-md">
                <div className="bg-[#2f415d] px-6 py-3 rounded-t-md">
                  <div className="flex items-center gap-2">
                    <span className="bg-white text-[#2874f0] text-xs font-bold px-2 py-1 rounded">2</span>
                    <span className="text-white font-semibold text-sm tracking-wide">DELIVERY ADDRESS</span>
                  </div>
                </div>

                {/* Dynamic Address List */}
                {user_address?.length > 0 && user_address.map((address) => (
                  <div
                    key={address._id}
                    className={`p-4 rounded mb-2 ${selectedAddress === address._id ? 'bg-blue-50 border border-[#dfe3e6]' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={selectedAddress === address._id}
                          onChange={() => handleAddressSelect(address._id)}
                          className="accent-blue-600"
                        />
                        <p className="font-bold text-[#212121]">{address.Name}</p>
                        <span className="text-xs bg-[#f0f0f0] text-[#878787] px-1 py-0.5 rounded-sm">
                          {address.Type.toUpperCase()}
                        </span>
                        <span className="font-semibold text-[#212121] ml-1">{address.Mobile}</span>
                      </div>
                      <button
                        className="text-blue-600 text-sm font-medium"
                        onClick={() => {
                          setIsedit(true);
                          setEditAddressObject(address);
                        }}
                      >
                        EDIT
                      </button>
                    </div>
                    <p className="text-sm text-[#212121] leading-snug pl-5">
                      {address.HNo}, {address.Area}, {address.locality}, {address.LandMark},<br />
                      {address.City}, {address.State} - <span className="font-semibold">{address.Pincode}</span>
                    </p>
                    {selectedAddress === address._id && (
                      <button
                        className="bg-[#e96f84] hover:bg-[#2f415d] text-white font-semibold text-sm py-2 px-6 rounded mt-4"
                        onClick={handleDeliverHere}
                      >
                        DELIVER HERE
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {edit && (
                <EditAddressCheckOut
                  editAddressObject={editAddressObject}
                  onClose={() => setIsedit(false)}
                  onUpdateSelected={(id) => {
                    setSelectedAddress(id);
                    const updatedAddress = user_address.find(addr => addr._id === id);
                    if (updatedAddress) {
                      dispatch(setCurrentAddress(updatedAddress));
                    }
                  }}
                />
              )}

              {/* Add New Address */}
              {showAddress ? (
                <AddAddressForm
                  setShowAddress={setShowAddress}
                  onAddressAdded={(newAddress) => {
                    setSelectedAddress(newAddress._id);
                    dispatch(setCurrentAddress(newAddress));
                  }}
                />
              ) : (
                <div className="p-4 rounded mb-2 bg-[#fff] shadow">
                  <button
                    className="text-blue-600 text-base mt-2 flex items-center flex-row gap-3"
                    onClick={() => setShowAddress(true)}
                  >
                    <span><FaPlus /></span>
                    <span>Add a new address</span>
                  </button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="p-4 rounded mb-2 bg-[#fff]">
          <h2 className="text-[16px] font-semibold text-[#878787] flex items-center gap-1">
            <span className="h-5 w-5 bg-[#f0f0f0] text-[#e96f84] text-center flex flex-row items-center justify-center">
              2
            </span>
            DELIVERY ADDRESS
          </h2>
        </div>
      )}
    </>
  );
};

export default CheckOutAddress;