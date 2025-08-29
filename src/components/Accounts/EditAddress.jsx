"use client";
import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAddress,
  updateAddressLocally,
} from "@/redux/athentication/Athentication";

const EditAddress = ({ onclose, addressData }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loginData } = useSelector((state) => state.Athentication);

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
  });

  useEffect(() => {
    if (addressData) {
      setFormData({
        ...addressData,
        clientId: loginData?._id || "",
        addressId: addressData._id,
      });
    }
  }, [addressData, loginData]);

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
    if (resp.payload.success) {
      const client = resp.payload.client;
      const data_address = client.Addresses;
      dispatch(updateAddressLocally(data_address));
      onclose();
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Edit Address Details
        </h2>
        <button onClick={onclose} className="text-gray-500 hover:text-gray-700">
          <RxCross2 size={24} />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4 grid gap-4">
            <TextField
              label="Full Name"
              name="Name"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.Name}
              onChange={handleChange}
              required
            />

            <TextField
              label="Mobile Number"
              name="Mobile"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.Mobile}
              onChange={handleChange}
              required
            />

            <TextField
              label="Alternative Mobile"
              name="Alternative_Mobile"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.Alternative_Mobile}
              onChange={handleChange}
            />

            <TextField
              label="House No/Building"
              name="HNo"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.HNo}
              onChange={handleChange}
              required
            />

            <TextField
              label="Area/Colony"
              name="Area"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.Area}
              onChange={handleChange}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4  grid gap-4">
            <TextField
              label="Locality"
              name="locality"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.locality}
              onChange={handleChange}
              required
            />

            <TextField
              label="Landmark"
              name="LandMark"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.LandMark}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="City"
                name="City"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.City}
                onChange={handleChange}
                required
              />
              <TextField
                label="Pincode"
                name="Pincode"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.Pincode}
                onChange={handleChange}
                required
              />
            </div>

            <FormControl fullWidth size="small">
              <InputLabel>State</InputLabel>
              <Select
                label="State"
                name="State"
                value={formData.State}
                onChange={handleChange}
                required
              >
                <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                <MenuItem value="Telangana">Telangana</MenuItem>
                <MenuItem value="Delhi">Delhi</MenuItem>
              </Select>
            </FormControl>

            <FormControl component="fieldset">
              <FormLabel component="legend">Address Type</FormLabel>
              <RadioGroup
                row
                name="Type"
                value={formData.Type}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="Home"
                  control={<Radio size="small" />}
                  label="Home"
                />
                <FormControlLabel
                  value="Work"
                  control={<Radio size="small" />}
                  label="Work"
                />
                <FormControlLabel
                  value="Other"
                  control={<Radio size="small" />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onclose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#2f415d] text-white rounded-md hover:bg-[#1e2d3f]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAddress;
