"use client";
import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { add_Address } from "@/redux/athentication/Athentication";
import toast from "react-hot-toast";

const AddAddress = ({ onclose }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change but don't show error until blur
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key in errors) {
        // Only validate fields we track errors for
        const error = validateField(key, formData[key]);
        newErrors[key] = error;
        if (error) isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(add_Address(formData))
        .unwrap()
        .then(() => {
          toast.success("Address added successfully!");
          onclose();
        })
        .catch((error) => {
          toast.error("Failed to add address!");
          console.error("Error adding address:", error);
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Address
          </h2>
          <button
            onClick={onclose}
            className="text-gray-500 hover:text-gray-700"
          >
            <RxCross2 size={24} />
          </button>
        </div>
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y- grid gap-1">
              <FormControl fullWidth error={!!errors.Name}>
                <TextField
                  label="Full Name"
                  name="Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.Name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <FormHelperText>{errors.Name}</FormHelperText>
              </FormControl>

              <div className="grid grid-cols-2 gap-2">
                <FormControl fullWidth error={!!errors.Mobile}>
                  <TextField
                    label="Mobile Number"
                    name="Mobile"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.Mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <FormHelperText>{errors.Mobile}</FormHelperText>
                </FormControl>

                <FormControl fullWidth error={!!errors.Alternative_Mobile}>
                  <TextField
                    label="Alt. Mobile"
                    name="Alternative_Mobile"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.Alternative_Mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FormHelperText>{errors.Alternative_Mobile}</FormHelperText>
                </FormControl>
              </div>

              <FormControl fullWidth error={!!errors.HNo}>
                <TextField
                  label="House No/Building"
                  name="HNo"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.HNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <FormHelperText>{errors.HNo}</FormHelperText>
              </FormControl>

              <TextField
                label="Road/Area/Colony"
                name="Area"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.Area}
                onChange={handleChange}
              />
            </div>

            {/* Right Column */}
            <div className="space-y- grid gap-2">
              <FormControl fullWidth error={!!errors.locality}>
                <TextField
                  label="Locality"
                  name="locality"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={formData.locality}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <FormHelperText>{errors.locality}</FormHelperText>
              </FormControl>

              <TextField
                label="Landmark"
                name="LandMark"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.LandMark}
                onChange={handleChange}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormControl fullWidth error={!!errors.City}>
                  <TextField
                    label="City"
                    name="City"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.City}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <FormHelperText>{errors.City}</FormHelperText>
                </FormControl>

                <FormControl fullWidth error={!!errors.Pincode}>
                  <TextField
                    label="Pincode"
                    name="Pincode"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.Pincode}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/\D/g, "");
                      // Limit to 6 characters
                      const truncatedValue = value.slice(0, 6);
                      setFormData((prev) => ({
                        ...prev,
                        Pincode: truncatedValue,
                      }));
                    }}
                    onBlur={handleBlur}
                    required
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                  />
                  <FormHelperText>{errors.Pincode}</FormHelperText>
                </FormControl>
              </div>

              <FormControl fullWidth error={!!errors.State} size="small">
                <InputLabel>State</InputLabel>
                <Select
                  label="State"
                  name="State"
                  value={formData.State}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                >
                  <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                  <MenuItem value="Telangana">Telangana</MenuItem>
                  <MenuItem value="Delhi">Delhi</MenuItem>
                </Select>
                <FormHelperText>{errors.State}</FormHelperText>
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
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;
