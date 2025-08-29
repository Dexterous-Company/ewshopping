"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaHourglassStart } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { AiTwotoneLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowRoundBack, IoIosNotifications } from "react-icons/io";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { IoIosNotificationsOff } from "react-icons/io";
import Lottie from "lottie-react";
import animationData from "../../main_pages/animation/Alert Notification Character.json";
import { useRouter } from "next/navigation";

const notificationData = [
  { Name: "Total Notifications", count: 5, Icon: <IoIosNotifications /> },
  { Name: "Read", count: 5, Icon: <MdOutlineNotificationsActive /> },
  { Name: "UnRead", count: 5, Icon: <IoIosNotificationsOff /> },
];

const Notifications = () => {
  const [model, setModel] = useState({ type: null });
  const lottieRef = useRef();
  useEffect(() => {
    lottieRef.current.setSpeed(0.5);
  }, []);

  const router = useRouter();
  return (
    <div className="sm:px-4 px-2 relative py-2 w-full sm:h-[70vh] sm:mb-0 mb-10 overflow-y-auto">
      <h1 className="font-semibold flex flex-row items-center gap-2 text-lg text-[#2f415d] mb-4">
        <span className="block sm:hidden" onClick={() => router.back("")}>
          <IoIosArrowRoundBack size={30} />
        </span>
        <span>Manage Your Addresses</span>
      </h1>
      <div className="grid sm:grid-cols-4 grid-cols-2 mt-3 gap-4 hidden">
        {notificationData.map((item, i) => (
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
      <div className="">
        <div className="flex flex-col items-center justify-center bg-white">
          <Lottie
            lottieRef={lottieRef}
            animationData={animationData}
            loop
            autoplay
            style={{ width: "250px", height: "250px" }}
            className="flex items-center justify-center"
          />
          <h1 className="text-xl font-semibold text-gray-800">
            All caught up!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            There are no new notifications for you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
