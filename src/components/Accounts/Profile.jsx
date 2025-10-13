"use client";

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { LuBoxes } from "react-icons/lu";
import { FaHeartCircleExclamation } from "react-icons/fa6";
import { RiCheckboxMultipleFill } from "react-icons/ri";
import { TbBoxModelOff } from "react-icons/tb";
import { MdOutlineEventAvailable } from "react-icons/md";
import { RiCoupon2Fill } from "react-icons/ri";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/redux/athentication/Athentication";
import { getOrderbyClId, getTotalOrderByClId } from "@/redux/order/OrderSlice";
import { getUserCoupons } from "@/redux/coupon/couponSlice";
import toast from "react-hot-toast";

const Profile = () => {
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuth } = useSelector((state) => state.Athentication);
  const { totalClientOrder, clientOrder } = useSelector((state) => state.order);
  const { availableCoupons } = useSelector((state) => state.coupon);

  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const router = useRouter();
  const [loginData, setLoginData] = useState(null);

  const [orderReceived, setOrderReceived] = useState([]);
  const [orderCancelled, setOrderCancelled] = useState([]);

  useEffect(() => {
    if (clientOrder?.order?.length > 0) {
      const received = clientOrder.order.filter(
        (data) => data.OrderStatusText === "Order Recieved"
      );
      setOrderReceived(received);

      const cancelled = clientOrder.order.filter(
        (data) => data.OrderStatusText === "Order Cancelled"
      );
      setOrderCancelled(cancelled);
    } else {
      setOrderReceived([]);
      setOrderCancelled([]);
    }
  }, [clientOrder]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("loginData"));
    if (data) {
      setLoginData(data);
      // Extract first and last name from the Name field
      const nameParts = data.Name.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(data.Email || "");
      setMobile(data.Mobile || "");
      // Note: Gender isn't in the loginData, so we keep the default
    }
  }, []);

  useEffect(() => {
    if (isAuth && loginData?._id) {
      dispatch(getOrderbyClId(loginData?._id));
      dispatch(getTotalOrderByClId(loginData?._id));
    }
  }, [isAuth, loginData?._id, dispatch]);
  useEffect(() => {
    dispatch(getUserCoupons(loginData?._id));
  }, [dispatch, loginData?._id]);

  const handleSave = async () => {
    const updatedData = {
      ...loginData,
      Name: `${firstName} ${lastName}`,
      Email: email,
      Mobile: mobile,
      Gender: gender,
    };
    const response = await dispatch(updateProfile(updatedData));
    if (response.payload.success) {
      setIsEditing(false);
    }
  };

  if (!loginData) {
    return <div>Loading...</div>; // Or redirect to login
  }

  const data = [
    {
      Name: "WhishList",
      count: wishlistItems?.length,
      Icon: <FaHeartCircleExclamation />,
    },
    {
      Name: "Orders",
      count: clientOrder?.totalOrders,
      Icon: <LuBoxes />,
    },

    {
      Name: "Confirmed orders",
      count: orderReceived.length,
      Icon: <RiCheckboxMultipleFill />,
    },
    {
      Name: "Canceled orders",
      count: orderCancelled.length,
      Icon: <TbBoxModelOff />,
    },
    // {
    //   Name: "Available Coins",
    //   count: 3,
    //   Icon: <MdOutlineEventAvailable />,
    // },
    {
      Name: "Available Coupons",
      count: availableCoupons.length,
      Icon: <RiCoupon2Fill />,
    },
  ];

  return (
    <div className="sm:px-4 px-2 relative py-2 w-full sm:h-[50vh] sm:mb-0 mb-10">
      <h1 className="font-semibold flex flex-row items-center gap-2 text-lg text-[#2f415d] mb-4">
        <span className="block sm:hidden" onClick={() => router.back("")}>
          <IoIosArrowRoundBack size={30} />
        </span>
        <span>Manage Your Profile</span>
      </h1>
      <div className="w-full flex sm:flex-row flex-col-reverse gap-3">
        <div className="sm:w-4/5 w-full flex flex-col gap-4">
          {/* Top Controls */}
          <div className="flex flex-row items-center gap-2">
            <span className="font-medium text-[1.1rem] tracking-wide">
              Profile Information
            </span>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="py-1 px-3 text-sm text-[#e96184] font-semibold cursor-pointer"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="py-1 px-3 text-sm text-[#e96184] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="py-1 px-3 text-sm text-[#2f415d] font-semibold cursor-pointer"
                >
                  Save
                </button>
              </>
            )}
          </div>
          <div className="w-full flex flex-row items-center gap-2">
            <TextField
              placeholder="Enter first name"
              size="small"
              fullWidth
              value={firstName}
              disabled={!isEditing}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              placeholder="Enter last name"
              size="small"
              fullWidth
              value={lastName}
              disabled={!isEditing}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          {/* <div className="mt-">
            <h1 className="text-[.9rem] mb-2">Your Gender</h1>
            <FormControl component="fieldset">
              <RadioGroup
                row
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio size="small" />}
                  label="Male"
                  disabled={!isEditing}
                />
                <FormControlLabel
                  value="female"
                  control={<Radio size="small" />}
                  label="Female"
                  disabled={!isEditing}
                />
                <FormControlLabel
                  value="other"
                  control={<Radio size="small" />}
                  label="Other"
                  disabled={!isEditing}
                />
              </RadioGroup>
            </FormControl>
          </div> */}
          {/* Email Address */}
          <div className="mt-2">
            <h1 className="text-[.9rem] mb-2">Email Address</h1>
            <TextField
              placeholder="Enter your email"
              size="small"
              fullWidth
              type="email"
              value={email}
              disabled={!isEditing}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!isEditing ? (
            <div className="mt-2">
              <h1 className="text-[.9rem] mb-2">Mobile Number</h1>
              <TextField
                placeholder="Enter mobile number"
                size="small"
                fullWidth
                type="tel"
                value={mobile}
                disabled={!isEditing}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="w-full sm:px-[3rem] whitespace-nowrap ">
          <h1 className="text-lg">Your Account Summary</h1>
          <div className="sm:px-4 flex flex-col gap-2 sm:mt-3 mt-2.5">
            <div className="grid grid-cols-2 sm:gap-4 gap-3">
              {data.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-xl p-4 hover:shadow-md transition"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
