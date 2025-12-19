"use client";

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { FaHome, FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import {
  deleteAddress,
  removeAddress,
  setCurrentAddress,
} from "@/redux/athentication/Athentication";

import AddAddress from "./AddAddress";
import EditAddress from "./EditAddress";
import EmptyAddress from "../EmptyPages/EmptyAddress";
import toast from "react-hot-toast";

const ManageAddress = () => {
  const { user_address, current_address, loginData } = useSelector(
    (state) => state.Athentication
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const [select, setSelect] = useState(
    current_address
      ? user_address.findIndex((a) => a._id === current_address._id)
      : 0
  );

  const [modalState, setModalState] = useState({
    type: null, // add | edit | editCardOptions | remove | options
    index: null,
    data: null,
  });

  const handleSelectAddress = (i) => {
    // Only set as default if it's a Home address
    if (user_address[i].Type === "Home") {
      setSelect(i);
      dispatch(setCurrentAddress(user_address[i]));
      toast.success("Default address updated! 🎯");
    }
  };

  const handleRemoveAddress = async (id) => {
    const resp = await dispatch(
      deleteAddress({ addressId: id, ClientId: loginData._id })
    );

    if (resp.payload.success) {
      dispatch(removeAddress({ _id: id }));
      toast.success("Address deleted successfully 🗑️");
      setModalState({ type: null });
      
      // Reset selection if deleted address was the default
      if (current_address && current_address._id === id) {
        const homeAddress = user_address.find(addr => addr.Type === "Home" && addr._id !== id);
        if (homeAddress) {
          const newIndex = user_address.findIndex(a => a._id === homeAddress._id);
          setSelect(newIndex);
          dispatch(setCurrentAddress(homeAddress));
        }
      }
    } else {
      toast.error("Error deleting address ❌");
    }
  };

  // Get icon based on address type
  const getAddressIcon = (type) => {
    switch (type) {
      case "Home":
        return <FaHome className="text-green-600 text-sm" />;
      case "Work":
        return <FaBuilding className="text-blue-600 text-sm" />;
      default:
        return <FaMapMarkerAlt className="text-purple-600 text-sm" />;
    }
  };

  // Get border color based on address type
  const getBorderColor = (type, isSelected) => {
    if (isSelected) return "border-green-500";
    switch (type) {
      case "Home":
        return "border-green-300";
      case "Work":
        return "border-blue-300";
      default:
        return "border-purple-300";
    }
  };

  // Get hover border color based on address type
  const getHoverBorderColor = (type) => {
    switch (type) {
      case "Home":
        return "hover:border-green-500";
      case "Work":
        return "hover:border-blue-500";
      default:
        return "hover:border-purple-500";
    }
  };

  // Get type badge color
  const getTypeColor = (type) => {
    switch (type) {
      case "Home":
        return "bg-green-100 text-green-800 border-green-300";
      case "Work":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-purple-100 text-purple-800 border-purple-300";
    }
  };

  return (
    <div className="sm:px-4 py-3 w-full relative overflow-y-auto min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-300">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (modalState.type) setModalState({ type: null });
              else router.back();
            }}
            className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
          >
            <IoIosArrowRoundBack size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Manage Addresses</h1>
            <p className="text-gray-600 text-xs mt-1">
              Manage your delivery addresses
            </p>
          </div>
        </div>
      </div>

      {/* ADD NEW ADDRESS BUTTON */}
      {modalState.type !== "edit" && (
        <div
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer flex items-center justify-center gap-3 shadow-md transition-all duration-300 mb-6 group border border-blue-700"
          onClick={() => setModalState({ type: "add" })}
        >
          <FaPlus className="text-white group-hover:scale-110 transition-transform duration-300" />
          <span className="font-semibold text-sm">Add New Address</span>
        </div>
      )}

      {/* ADDRESS LIST */}
      {modalState.type !== "edit" && (
        <div className="grid gap-4">
          {user_address.length ? (
            user_address.map((a, i) => (
              <div
                key={a._id}
                className={`relative p-4 rounded-lg transition-all duration-300 border-2 bg-white cursor-pointer
                  ${getBorderColor(a.Type, select === i)} 
                  ${getHoverBorderColor(a.Type)}
                  ${select === i ? "shadow-md" : "shadow-sm hover:shadow-md"}`}
                onClick={() => handleSelectAddress(i)}
              >
                {/* Default Badge - Only for selected Home addresses */}
                {select === i && a.Type === "Home" && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <TiTick className="text-white" size={12} />
                    DEFAULT
                  </div>
                )}

                <div className="flex justify-between items-start">
                  
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${getTypeColor(a.Type)}`}>
                        {getAddressIcon(a.Type)}
                        <span>{a.Type}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold text-gray-800">{a.Name}</div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="text-blue-600 font-medium text-sm">{a.Mobile}</div>
                      </div>

                      <div className="text-xs text-gray-700 space-y-1">
                        <p className="font-medium">{a.HNo}</p>
                        <p>{a.locality}, {a.City}</p>
                        <p>{a.State} - {a.Pincode}</p>
                        {a.LandMark && (
                          <p className="text-gray-600">
                            <span className="text-orange-500">📍</span> Near {a.LandMark}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* THREE DOTS MENU */}
                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setModalState({
                          type: "options",
                          index: i,
                          data: a,
                        })
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 border border-gray-300 hover:border-gray-400"
                    >
                      <HiOutlineDotsVertical size={16} className="text-gray-600" />
                    </button>

                    {modalState.type === "options" &&
                      modalState.index === i && (
                        <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded-lg shadow-lg w-32 py-1 z-10">
                          <div
                            onClick={() =>
                              setModalState({
                                type: "edit",
                                index: i,
                                data: a,
                              })
                            }
                            className="px-3 py-2 text-xs cursor-pointer hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 text-gray-700"
                          >
                            <span>✏️</span>
                            Edit
                          </div>

                          <div
                            onClick={() =>
                              setModalState({
                                type: "remove",
                                index: i,
                                data: a,
                              })
                            }
                            className="px-3 py-2 text-xs cursor-pointer hover:bg-red-50 transition-all duration-200 flex items-center gap-2 text-red-600 border-t border-gray-200"
                          >
                            <span>🗑️</span>
                            Delete
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyAddress />
          )}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {modalState.type === "remove" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-[999]">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-300">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-200">
                <span className="text-xl">🗑️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Address?</h3>
            </div>

            {/* Address Preview */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`px-2 py-1 rounded text-xs font-bold ${getTypeColor(modalState.data?.Type)}`}>
                  {modalState.data?.Type}
                </div>
                {modalState.data?.Type === "Home" && select === user_address.findIndex(a => a._id === modalState.data?._id) && (
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                    DEFAULT
                  </div>
                )}
              </div>
              <p className="font-semibold text-gray-800 text-sm">{modalState.data?.Name}</p>
              <p className="text-gray-600 text-xs">{modalState.data?.HNo}, {modalState.data?.locality}</p>
              <p className="text-gray-600 text-xs">{modalState.data?.City}, {modalState.data?.State} - {modalState.data?.Pincode}</p>
            </div>

            <p className="text-gray-600 text-xs text-center mb-4">
              Are you sure you want to delete this address?
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium text-sm transition-all duration-300"
                onClick={() => setModalState({ type: null })}
              >
                Cancel
              </button>

              <button
                onClick={() => handleRemoveAddress(modalState.data._id)}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ADDRESS POPUP */}
      {modalState.type === "add" && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center px-4 z-[999]">
          <AddAddress onclose={() => setModalState({ type: null })} />
        </div>
      )}

      {/* EDIT MODE */}
      {modalState.type === "edit" && (
        <div className="mt-4 space-y-6">
          {/* EDIT FORM */}
          <EditAddress
            addressData={modalState.data}
            onclose={() => setModalState({ type: null })}
          />

          {/* PREVIEW CARD BELOW */}
          <div className={`p-4 rounded-lg border-2 ${getBorderColor(modalState.data.Type, select === modalState.index)} bg-white shadow-sm`}>
            <div className="flex justify-between items-start">
              
              {/* LEFT SIDE */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${getTypeColor(modalState.data.Type)}`}>
                    {getAddressIcon(modalState.data.Type)}
                    <span>{modalState.data.Type}</span>
                  </div>
                  {modalState.data.Type === "Home" && select === modalState.index && (
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      DEFAULT
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-gray-800">{modalState.data.Name}</div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="text-blue-600 font-medium text-sm">{modalState.data.Mobile}</div>
                  </div>

                  <div className="text-xs text-gray-700 space-y-1">
                    <p className="font-medium">{modalState.data.HNo}</p>
                    <p>{modalState.data.locality}, {modalState.data.City}</p>
                    <p>{modalState.data.State} - {modalState.data.Pincode}</p>
                    {modalState.data.LandMark && (
                      <p className="text-gray-600">
                        <span className="text-orange-500">📍</span> Near {modalState.data.LandMark}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAddress;