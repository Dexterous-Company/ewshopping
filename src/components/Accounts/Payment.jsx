"use client";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { TbCreditCardPay } from "react-icons/tb";
import { MdOutlineSensorOccupied } from "react-icons/md";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const paymentData = [
  {
    id: 1,
    type: "UPI",
    provider: "Google Pay",
    upiId: "username@ok",
    isDefault: true,
  },
  {
    id: 2,
    type: "Card",
    provider: "Visa",
    cardNumber: "**** **** **** 1234",
    expiry: "08/27",
    nameOnCard: "John Doe",
    isDefault: false,
  },
  {
    id: 1,
    type: "UPI",
    provider: "Google Pay",
    upiId: "username@ok",
    isDefault: true,
  },
  {
    id: 2,
    type: "Card",
    provider: "Visa",
    cardNumber: "**** **** **** 1234",
    expiry: "08/27",
    nameOnCard: "John Doe",
    isDefault: false,
  },
  {
    id: 1,
    type: "UPI",
    provider: "Google Pay",
    upiId: "username@ok",
    isDefault: true,
  },
  {
    id: 2,
    type: "Card",
    provider: "Visa",
    cardNumber: "**** **** **** 1234",
    expiry: "08/27",
    nameOnCard: "John Doe",
    isDefault: false,
  },
];

const totalData = [
  {
    Name: "CARDS",
    count: 5,
    Icon: <TbCreditCardPay />,
  },
  {
    Name: "UPI",
    count: 5,
    Icon: <MdOutlineSensorOccupied />,
  },
];

const getProviderIcon = (provider) => {
  if (!provider) return "";
  const name = provider.toLowerCase();
  if (name.includes("visa")) {
    return "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png";
  } else if (name.includes("mastercard")) {
    return "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";
  } else if (name.includes("google")) {
    return "https://upload.wikimedia.org/wikipedia/commons/5/5b/Google_Pay_Logo.svg";
  } else if (name.includes("phonepe")) {
    return "https://upload.wikimedia.org/wikipedia/commons/f/f5/PhonePe_Logo.png";
  } else if (name.includes("paytm")) {
    return "https://upload.wikimedia.org/wikipedia/commons/5/55/Paytm_logo.png";
  } else {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Credit_card_font_awesome.svg/512px-Credit_card_font_awesome.svg.png";
  }
};

const Payment = () => {
  const [payments, setPayments] = useState(paymentData);
  const [modalState, setModalState] = useState({
    type: null, // 'add' | 'edit' | 'remove'
    index: null,
    data: null,
  });
  const router = useRouter();

  const handleDeletePayment = () => {
    setModalState({ type: null, index: null, data: null });
  };

  const handleAddPayment = (e) => {
    setModalState({ type: null, index: null, data: null });
  };

  const handleEditPayment = (e) => {
    setModalState({ type: null, index: null, data: null });
  };

  return (
    <div className="sm:px-4 px-2 relative py-2 w-full sm:h-[70vh] sm:mb-0 mb-10 overflow-y-auto">
      <h1 className="font-semibold flex flex-row items-center gap-2 text-lg text-[#2f415d] mb-4">
        <span className="block sm:hidden" onClick={() => router.back("")}>
          <IoIosArrowRoundBack size={30} />
        </span>
        <span>Manage Your Payments</span>
      </h1>
      <div
        className="w-full shadow-md px-4 border border-gray-300 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
        onClick={() => setModalState({ type: "add", index: null, data: null })}
      >
        <FaPlus className="text-[#2f415d]" />
        <span className="text-[#2f415d] font-semibold text-sm">
          Add New Payment
        </span>
      </div>

      <div className="grid sm:grid-cols-5 grid-cols-3 mt-3 gap-4">
        {totalData.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-xl p-3 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl text-[#2f415d]">{item.Icon}</div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#2f415d]">
                  {item.Name}
                </span>
                <span className="text-xs text-gray-500">
                  Total: {item.count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className=" sm:mt-5 mt-3 px-4 py-3 sm:shadow-md shadow-sm w-full flex flex-col gap-4">
        {payments.map((payment, index) => (
          <div
            key={index}
            className={`flex justify-between items-start border  border-gray-300 p-4 rounded-md transition-all duration-150 cursor-pointer hover:shadow-md hover:bg-gray-50`}
          >
            <div className="flex items-start gap-4">
              {payment.provider && (
                <img
                  src={getProviderIcon(payment.provider)}
                  alt={payment.provider}
                  className="w-12 h-8 object-contain"
                />
              )}
              <div className="flex flex-col gap-1">
                <h5 className="text-xs sm:max-w-none w-[10vh] text-gray-500 font-semibold uppercase">
                  {payment.type}
                </h5>

                {payment.type === "UPI" && (
                  <>
                    <div className="text-sm font-semibold text-gray-700">
                      {payment.provider}
                    </div>
                    <div className="text-xs text-gray-500">{payment.upiId}</div>
                  </>
                )}

                {payment.type === "Card" && (
                  <>
                    <div className="text-sm font-semibold text-gray-700">
                      {payment.nameOnCard}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.cardNumber} | Exp: {payment.expiry}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col  items-end justify-between h-full gap-2">
              <div className="flex gap-2">
                <button
                  className="bg-[#e96184] px-3 py-1 text-xs  sm:text-sm text-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalState({
                      type: "remove",
                      index,
                      data: payment,
                    });
                  }}
                >
                  Remove
                </button>
                <button
                  className="bg-[#2f415d] px-3 py-1 text-sm text-white cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalState({
                      type: "edit",
                      index,
                      data: payment,
                    });
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {modalState.type === "remove" && (
        <div className="fixed w-full px-2 inset-0 flex rounded-sm justify-center items-center top-0 z-[999] bg-black/50">
          <div className="sm:w-1/3 w-full bg-white px-6 py-6 rounded shadow-lg">
            <div className="flex items-center flex-row justify-between">
              <span className="font-medium text-lg">
                Are you sure you want to delete this {modalState.data?.type}{" "}
                payment method?
              </span>
              <RxCross2
                size={20}
                className="cursor-pointer"
                onClick={() =>
                  setModalState({ type: null, index: null, data: null })
                }
              />
            </div>
            <div className="mt-6 flex flex-row justify-between">
              <button
                className="px-5 py-1 cursor-pointer bg-[#e96184] text-white"
                onClick={() =>
                  setModalState({ type: null, index: null, data: null })
                }
              >
                Cancel
              </button>
              <button
                className="px-5 cursor-pointer py-1 bg-[#2f415d] text-white"
                onClick={handleDeletePayment}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {modalState.type === "add" && (
        <div className="fixed w-full px-2 inset-0 flex rounded-sm justify-center items-center top-0 z-[999] bg-black/50">
          <div className="sm:w-1/3 w-full bg-white px-6 py-4">
            <div className="flex items-center flex-row justify-between">
              <span className="font-semibold text-lg mb-3">
                Add Payment Method
              </span>
              <RxCross2
                size={20}
                onClick={() =>
                  setModalState({ type: null, data: null, index: null })
                }
              />
            </div>
            <form onSubmit={handleAddPayment}>
              <FormControl fullWidth size="small" required sx={{ mb: 2 }}>
                <InputLabel id="payment-type-label">Payment Type</InputLabel>
                <Select
                  labelId="payment-type-label"
                  id="payment-type"
                  label="Payment Type"
                  defaultValue="card"
                >
                  <MenuItem value="card">Credit/Debit Card</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                </Select>
              </FormControl>

              {/* Card Fields */}
              <TextField
                name="cardNumber"
                placeholder="Card Number"
                fullWidth
                size="small"
                required
                inputProps={{ maxLength: 16, pattern: "[0-9]*" }}
                helperText="Enter 16-digit card number"
                sx={{ mb: 2 }}
              />
              <TextField
                name="nameOnCard"
                placeholder="Name on Card"
                fullWidth
                size="small"
                required
              />
              <div className="grid grid-cols-2 mt-3 gap-3">
                <TextField
                  name="cvv"
                  placeholder="CVV Code"
                  fullWidth
                  size="small"
                  required
                  inputProps={{ maxLength: 3, pattern: "[0-9]*" }}
                />
                <FormControl fullWidth size="small" required>
                  <InputLabel id="card-type-label">Card Type</InputLabel>
                  <Select
                    name="cardType"
                    labelId="card-type-label"
                    id="card-type"
                    label="Card Type"
                    defaultValue="visa"
                  >
                    <MenuItem value="Visa">Visa</MenuItem>
                    <MenuItem value="MasterCard">MasterCard</MenuItem>
                    <MenuItem value="American Express">
                      American Express
                    </MenuItem>
                    <MenuItem value="RuPay">RuPay</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" required>
                  <InputLabel id="month-label">Expiry Month</InputLabel>
                  <Select
                    name="expiryMonth"
                    labelId="month-label"
                    id="month-select"
                    label="Expiry Month"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {String(i + 1).padStart(2, "0")} -{" "}
                        {new Date(0, i).toLocaleString("default", {
                          month: "long",
                        })}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" required>
                  <InputLabel id="year-label">Expiry Year</InputLabel>
                  <Select
                    name="expiryYear"
                    labelId="year-label"
                    id="year-select"
                    label="Expiry Year"
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() + i;
                      return (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div className="flex flex-row justify-center my-4">
                <button
                  className="px-5 py-2 bg-[#2f415d] text-white w-full rounded"
                  type="submit"
                >
                  ADD PAYMENT METHOD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {modalState.type === "edit" && modalState.data && (
        <div className="fixed w-full px-2 inset-0 flex rounded-sm justify-center items-center top-0 z-[999] bg-black/50">
          <div className="sm:w-1/3 w-full bg-white px-6 py-4">
            <div className="flex items-center flex-row justify-between">
              <span className="font-semibold text-lg mb-3">
                Edit {modalState.data.type} Details
              </span>
              <RxCross2
                size={20}
                onClick={() =>
                  setModalState({ type: null, data: null, index: null })
                }
              />
            </div>

            {modalState.data.type === "Card" ? (
              <form onSubmit={handleEditPayment}>
                <TextField
                  name="cardNumber"
                  placeholder="Card Number"
                  fullWidth
                  size="small"
                  required
                  defaultValue={modalState.data.cardNumber}
                  inputProps={{ maxLength: 16, pattern: "[0-9]*" }}
                  helperText="Enter 16-digit card number"
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="nameOnCard"
                  placeholder="Name on Card"
                  fullWidth
                  size="small"
                  required
                  defaultValue={modalState.data.nameOnCard}
                />
                <div className="grid grid-cols-2 mt-3 gap-3">
                  <TextField
                    name="cvv"
                    placeholder="CVV Code"
                    fullWidth
                    size="small"
                    required
                    inputProps={{ maxLength: 3, pattern: "[0-9]*" }}
                  />
                  <FormControl fullWidth size="small" required>
                    <InputLabel id="edit-card-type-label">Card Type</InputLabel>
                    <Select
                      name="cardType"
                      labelId="edit-card-type-label"
                      id="edit-card-type"
                      label="Card Type"
                      defaultValue={modalState.data.provider}
                    >
                      <MenuItem value="Visa">Visa</MenuItem>
                      <MenuItem value="MasterCard">MasterCard</MenuItem>
                      <MenuItem value="American Express">
                        American Express
                      </MenuItem>
                      <MenuItem value="RuPay">RuPay</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" required>
                    <InputLabel id="edit-month-label">Expiry Month</InputLabel>
                    <Select
                      name="expiryMonth"
                      labelId="edit-month-label"
                      id="edit-month-select"
                      label="Expiry Month"
                      defaultValue={modalState.data.expiry?.split("/")[0] || ""}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <MenuItem
                          key={i + 1}
                          value={String(i + 1).padStart(2, "0")}
                        >
                          {String(i + 1).padStart(2, "0")} -{" "}
                          {new Date(0, i).toLocaleString("default", {
                            month: "long",
                          })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small" required>
                    <InputLabel id="edit-year-label">Expiry Year</InputLabel>
                    <Select
                      name="expiryYear"
                      labelId="edit-year-label"
                      id="edit-year-select"
                      label="Expiry Year"
                      defaultValue={
                        modalState.data.expiry?.split("/")[1]
                          ? `20${modalState.data.expiry.split("/")[1]}`
                          : new Date().getFullYear()
                      }
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex flex-row justify-center my-4">
                  <button
                    className="px-5 py-2 bg-[#2f415d] text-white w-full rounded"
                    type="submit"
                  >
                    UPDATE CARD
                  </button>
                </div>
              </form>
            ) : modalState.data.type === "UPI" ? (
              <form onSubmit={handleEditPayment}>
                <FormControl fullWidth size="small" required sx={{ mb: 2 }}>
                  <InputLabel id="upi-provider-label">UPI Provider</InputLabel>
                  <Select
                    name="upiProvider"
                    labelId="upi-provider-label"
                    id="upi-provider"
                    label="UPI Provider"
                    defaultValue={modalState.data.provider}
                  >
                    <MenuItem value="Google Pay">Google Pay</MenuItem>
                    <MenuItem value="PhonePe">PhonePe</MenuItem>
                    <MenuItem value="Paytm">Paytm</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  name="upiId"
                  placeholder="UPI ID"
                  fullWidth
                  size="small"
                  required
                  defaultValue={modalState.data.upiId}
                  sx={{ mb: 2 }}
                />
                <div className="flex flex-row justify-center my-4">
                  <button
                    className="px-5 py-2 bg-[#2f415d] text-white w-full rounded"
                    type="submit"
                  >
                    UPDATE UPI
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
