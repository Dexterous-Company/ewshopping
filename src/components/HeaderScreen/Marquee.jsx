import React from "react";
import PublicIcon from "@mui/icons-material/Public";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReplayIcon from "@mui/icons-material/Replay";

const Marquee = () => {
  const marqueeContent = (
    <div className="flex items-center space-x-8 text-xs py-2 text-white font-medium px-4">
      <span className="flex items-center space-x-1">
        <PublicIcon className="text-yellow-300 text-base" />
        <span>BUY ONLINE PICK UP IN STORE</span>
      </span>
      <span className="flex items-center space-x-1">
        <LocalShippingIcon className="text-yellow-300 text-base" />
        <span>FREE WORLDWIDE SHIPPING ON ALL ORDERS ABOVE ₹100</span>
      </span>
      <span className="flex items-center space-x-1">
        <ReplayIcon className="text-yellow-300 text-base" />
        <span>EXTENDED RETURN UNTIL 30 DAYS</span>
      </span>
    </div>
  );

  return (
    <div className="w-full overflow-hidden bg-black group">
      <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
        {[...Array(10)].map((_, index) => (
          <div key={index}>{marqueeContent}</div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;