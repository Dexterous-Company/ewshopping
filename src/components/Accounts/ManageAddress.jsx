"use client";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import AddAddress from "./AddAddress";
import EditAddress from "./EditAddress";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteAddress,
  removeAddress,
  setCurrentAddress,
} from "@/redux/athentication/Athentication";
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
      ? user_address.findIndex((addr) => addr._id === current_address._id)
      : 0
  );
  const [modalState, setModalState] = useState({
    type: null, // 'add' | 'edit' | 'remove'
    index: null,
    data: null,
  });

  const handleSelectAddress = (index) => {
    setSelect(index);
    dispatch(setCurrentAddress(user_address[index]));
  };

  const handleRemoveAddress = async (addressId) => {
    const formData = { addressId: addressId, ClientId: loginData._id };
    const resp = await dispatch(deleteAddress(formData));

    if (resp.payload.success) {
      dispatch(removeAddress({ _id: addressId }));
      setModalState({ type: null, index: null, data: null });
      toast.success("Address deleted successfully!");
    } else {
      toast.error("Failed to delete address!");
    }
    // Reset selected address if removing the current one
    if (user_address[select]?._id === addressId) {
      setSelect(0);
    }
  };

  // Close modal and handle back navigation for mobile
  const handleCloseModal = () => {
    setModalState({ type: null, index: null, data: null });
  };

  return (
    <div className="sm:px-4 relative py-2 w-full sm:h-[70vh] sm:mb-0 mb-10 overflow-y-auto">
      <h1 className="font-semibold flex flex-row items-center gap-2 text-lg text-[#2f415d] mb-4">
        <span
          className="block sm:hidden cursor-pointer"
          onClick={() => {
            if (modalState.type) {
              // If modal is open, close it first
              handleCloseModal();
            } else {
              // Otherwise go back
              router.back();
            }
          }}
        >
          <IoIosArrowRoundBack size={30} />
        </span>
        <span>Manage Your Addresses</span>
      </h1>

      {/* Add New Address Button */}
      <div className="w-full">
        <div
          className="w-full shadow-md px-4 border border-gray-300 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
          onClick={() =>
            setModalState({ type: "add", index: null, data: null })
          }
        >
          <FaPlus className="text-[#2f415d]" />
          <span className="text-[#2f415d] font-semibold text-sm">
            Add New Address
          </span>
        </div>
      </div>

      {/* Address List */}
      <div className="sm:mt-5 mt-3 sm:px-4 px-2 py-3 sm:shadow-md shadow-sm w-full flex flex-col gap-4">
        {user_address.length > 0 ? (
          user_address.map((address, index) => (
            <div
              key={address._id}
              onClick={() => handleSelectAddress(index)}
              className={`flex justify-between items-start border p-4 rounded-md transition-all duration-150 ${
                select === index
                  ? "bg-gray-100 border-[#e96184]"
                  : "hover:bg-gray-50 border-gray-300"
              } cursor-pointer`}
            >
              {/* Address Info */}
              <div className="flex flex-col gap-1 sm:mt-0 mt-2">
                <h5 className="text-xs text-gray-500 font-semibold uppercase">
                  {address.Type}
                </h5>
                <div className="text-sm font-semibold flex gap-2">
                  <span>{address.Name}</span>
                  <span>{address.Mobile}</span>
                </div>
                <div className="text-sm font-normal text-gray-600">
                  {address.HNo}, {address.locality}, {address.City},{" "}
                  {address.State} - {address.Pincode}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-end justify-between h-full gap-2">
                <div className="flex gap-2">
                  <button
                    className="bg-[#e96184] px-3 py-1 sm:text-sm text-xs text-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalState({
                        type: "remove",
                        index,
                        data: address,
                      });
                    }}
                  >
                    Remove
                  </button>
                  <button
                    className="bg-[#2f415d] px-3 py-1 sm:text-sm text-xs text-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalState({
                        type: "edit",
                        index,
                        data: address,
                      });
                    }}
                  >
                    Edit
                  </button>
                </div>
                {select === index && (
                  <TiTick className="h-5 w-5 bg-green-600 text-white rounded-full mt-1" />
                )}
              </div>
            </div>
          ))
        ) : (
          <>
            <EmptyAddress
              onClick={() =>
                setModalState({ type: "add", index: null, data: null })
              }
            />
          </>
        )}
      </div>

      {/* Modal Section - For both desktop and mobile */}
      {modalState.type === "remove" && (
        <div className="fixed w-full px-2 inset-0 flex rounded-sm justify-center items-center top-0 z-[999] bg-black/50">
          <div className="sm:w-1/3 w-full bg-white px-6 py-6 rounded shadow-lg">
            <div className="flex items-center flex-row justify-between">
              <span className="font-medium text-lg">
                Are you sure you want to delete this address?
              </span>
              <RxCross2
                size={20}
                className="cursor-pointer"
                onClick={handleCloseModal}
              />
            </div>
            <div className="mt-6 flex flex-row justify-between ">
              <button
                className="px-5 py-1 cursor-pointer bg-[#e96184] text-white"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="px-5 cursor-pointer py-1 bg-[#2f415d] text-white"
                onClick={() => handleRemoveAddress(modalState.data._id)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {modalState.type === "add" && (
        <div className="fixed px-2 w-full inset-0 flex rounded-sm justify-center items-center top-0 z-[999] bg-black/50">
          <AddAddress onclose={handleCloseModal} />
        </div>
      )}

      {modalState.type === "edit" && (
        <div className="fixed px-2 w-full inset-0 flex rounded-sm justify-center items-center top-0 z-[999] bg-black/50">
          <div onClick={(e) => e.stopPropagation()}>
            <EditAddress
              addressData={modalState.data}
              onclose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAddress;
