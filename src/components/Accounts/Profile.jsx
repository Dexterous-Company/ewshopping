"use client";

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUser, FaEnvelope, FaVenusMars, FaPhone } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/athentication/Athentication";
import toast from "react-hot-toast";

const Profile = () => {
  const { isAuth } = useSelector((state) => state.Athentication);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [loginData, setLoginData] = useState(null);

  // Hover states for each section
  const [hoverStates, setHoverStates] = useState({
    gender: false,
    email: false,
    mobile: false,
    help: false
  });

  const handleMouseEnter = (section) => {
    setHoverStates(prev => ({ ...prev, [section]: true }));
  };

  const handleMouseLeave = (section) => {
    setHoverStates(prev => ({ ...prev, [section]: false }));
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("loginData"));
    if (data) {
      setLoginData(data);
      const nameParts = data.Name.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(data.Email || "");
    }
  }, []);

  const handleSave = async () => {
    const updatedData = {
      ...loginData,
      Name: `${firstName} ${lastName}`,
      Email: email,
      Gender: gender,
    };
    const response = await dispatch(updateProfile(updatedData));
    if (response.payload.success) {
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    }
  };

  if (!loginData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-gray-600 text-sm font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 font-sans">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-blue-600 transition-all p-2 sm:p-3 hover:bg-white rounded-lg border border-gray-300 hover:border-blue-500 hover:shadow-md"
          >
            <IoIosArrowRoundBack size={20} className="sm:w-6 sm:h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              Personal Information
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your profile details</p>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 sm:mb-8 hover:shadow-md transition-all duration-300">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-blue-600 rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <FaUser className="text-blue-600 text-base sm:text-lg" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">Profile Information</h2>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-blue-200 hover:border-blue-300 transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 hover:shadow-md transition-all duration-200 transform hover:scale-105 flex-1 sm:flex-none text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 hover:shadow-md transition-all duration-200 transform hover:scale-105 flex-1 sm:flex-none text-sm sm:text-base"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Name Fields */}
            {isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-lg border-2 border-blue-300 hover:border-blue-400 transition-all duration-300">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    First Name
                  </label>
                  <TextField
                    placeholder="Enter first name"
                    size="small"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        '&:hover fieldset': {
                          borderColor: '#2563eb',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2563eb',
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Last Name
                  </label>
                  <TextField
                    placeholder="Enter last name"
                    size="small"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        '&:hover fieldset': {
                          borderColor: '#2563eb',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2563eb',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Gender Section - Blue Theme */}
            <div 
              className={`p-3 sm:p-4 bg-blue-50 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                hoverStates.gender ? 'border-blue-500 shadow-md' : 'border-blue-300'
              }`}
              onMouseEnter={() => handleMouseEnter('gender')}
              onMouseLeave={() => handleMouseLeave('gender')}
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md transition-all duration-300 ${
                    hoverStates.gender ? 'bg-blue-600 scale-110' : 'bg-blue-500'
                  }`}>
                    <FaVenusMars className="text-white text-sm" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-blue-800 tracking-tight">Your Gender</h3>
                </div>
                {isEditing && (
                  <span className={`text-xs px-2 py-1 rounded font-medium border transition-all duration-300 ${
                    hoverStates.gender 
                      ? 'text-blue-800 bg-blue-200 border-blue-400' 
                      : 'text-blue-700 bg-blue-100 border-blue-300'
                  }`}>
                    Editing
                  </span>
                )}
              </div>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="gap-4 sm:gap-6"
                >
                  <FormControlLabel
                    value="male"
                    control={
                      <Radio 
                        size="small" 
                        sx={{ 
                          '&.Mui-checked': { color: '#2563eb' },
                          '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.1)' }
                        }} 
                      />
                    }
                    label={
                      <span className={`text-sm transition-all duration-300 ${
                        hoverStates.gender ? 'text-blue-900 font-semibold' : 'text-blue-800 font-medium'
                      }`}>
                        Male
                      </span>
                    }
                    disabled={!isEditing}
                  />
                  <FormControlLabel
                    value="female"
                    control={
                      <Radio 
                        size="small" 
                        sx={{ 
                          '&.Mui-checked': { color: '#2563eb' },
                          '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.1)' }
                        }} 
                      />
                    }
                    label={
                      <span className={`text-sm transition-all duration-300 ${
                        hoverStates.gender ? 'text-blue-900 font-semibold' : 'text-blue-800 font-medium'
                      }`}>
                        Female
                      </span>
                    }
                    disabled={!isEditing}
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {/* Email Section - Blue Theme */}
            <div 
              className={`p-3 sm:p-4 bg-blue-50 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                hoverStates.email ? 'border-blue-500 shadow-md' : 'border-blue-300'
              }`}
              onMouseEnter={() => handleMouseEnter('email')}
              onMouseLeave={() => handleMouseLeave('email')}
            >
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md transition-all duration-300 ${
                    hoverStates.email ? 'bg-blue-600 scale-110' : 'bg-blue-500'
                  }`}>
                    <FaEnvelope className="text-white text-sm" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-blue-800 tracking-tight">Email Address</h3>
                </div>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className={`text-sm font-medium transition-all duration-300 ${
                      hoverStates.email 
                        ? 'text-blue-900 underline scale-105' 
                        : 'text-blue-700 hover:text-blue-900 hover:underline'
                    }`}
                  >
                    Edit
                  </button>
                ) : (
                  <span className={`text-xs px-2 py-1 rounded font-medium border transition-all duration-300 ${
                    hoverStates.email 
                      ? 'text-blue-800 bg-blue-200 border-blue-400' 
                      : 'text-blue-700 bg-blue-100 border-blue-300'
                  }`}>
                    Editing
                  </span>
                )}
              </div>
              {!isEditing ? (
                <div className={`bg-white p-3 rounded border transition-all duration-300 ${
                  hoverStates.email ? 'border-blue-400 shadow-sm' : 'border-blue-200'
                }`}>
                  <p className="text-blue-800 font-medium text-sm sm:text-base">{email}</p>
                </div>
              ) : (
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      '&:hover fieldset': {
                        borderColor: '#2563eb',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2563eb',
                      },
                    },
                  }}
                />
              )}
            </div>

            {/* Mobile Number Section - Only show when NOT editing */}
            {!isEditing && (
              <div 
                className={`p-3 sm:p-4 bg-blue-50 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                  hoverStates.mobile ? 'border-blue-500 shadow-md' : 'border-blue-300'
                }`}
                onMouseEnter={() => handleMouseEnter('mobile')}
                onMouseLeave={() => handleMouseLeave('mobile')}
              >
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md transition-all duration-300 ${
                      hoverStates.mobile ? 'bg-blue-600 scale-110' : 'bg-blue-500'
                    }`}>
                      <FaPhone className="text-white text-sm" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-blue-800 tracking-tight">Mobile Number</h3>
                  </div>
                </div>
                <div className={`bg-white p-3 rounded border transition-all duration-300 ${
                  hoverStates.mobile ? 'border-blue-400 shadow-sm' : 'border-blue-200'
                }`}>
                  <p className="text-blue-800 font-medium text-sm sm:text-base">{loginData.Mobile}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help & Support Section - Blue Theme */}
        <div 
          className={`bg-blue-50 rounded-lg shadow-sm border-2 transition-all duration-300 ${
            hoverStates.help ? 'border-blue-500 shadow-md' : 'border-blue-200'
          }`}
          onMouseEnter={() => handleMouseEnter('help')}
          onMouseLeave={() => handleMouseLeave('help')}
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-md transition-all duration-300 ${
                hoverStates.help ? 'bg-blue-600 scale-110' : 'bg-blue-500'
              }`}>
                <span className="text-white text-sm">💡</span>
              </div>
              <h3 className={`text-lg font-semibold transition-all duration-300 tracking-tight ${
                hoverStates.help ? 'text-blue-900' : 'text-blue-800'
              }`}>
                Help & Support
              </h3>
            </div>
            
            <div className="space-y-3">
              {[
                {
                  question: "What happens when I update my email address?",
                  answer: "Your login email id changes accordingly. You'll receive all your account related communication on your updated email address."
                },
                {
                  question: "When will my account be updated with the new email address?",
                  answer: "It happens as soon as you confirm the verification code sent to your email and save the changes."
                },
                {
                  question: "What happens to my existing account when I update my email address?",
                  answer: "Updating your email address doesn't invalidate your account. Your account remains fully functional with all your order history and personal details."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className={`p-3 bg-white rounded border transition-all duration-300 cursor-pointer ${
                    hoverStates.help 
                      ? 'border-blue-400 shadow-sm transform hover:scale-[1.02]' 
                      : 'border-blue-200'
                  }`}
                >
                  <h4 className={`font-medium mb-1 text-sm transition-all duration-300 ${
                    hoverStates.help ? 'text-blue-900' : 'text-blue-800'
                  }`}>
                    {faq.question}
                  </h4>
                  <p className={`text-xs leading-relaxed transition-all duration-300 ${
                    hoverStates.help ? 'text-blue-800' : 'text-blue-700'
                  }`}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;