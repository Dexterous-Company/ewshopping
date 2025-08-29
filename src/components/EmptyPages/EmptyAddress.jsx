import React from "react";

const EmptyAddress = ({ onClick }) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center  bg-white px-4">
        {/* Image */}
        <img
          src="/assets/images/emptyAddress/emptyAddress.png"
          alt="No Address"
          loading="lazy"
          className=" w-40 h-40 sm:w-55 sm:h-55 mb-6"
        />
        {/* Title */}
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          No Addresses found in your account!
        </h2>
        {/* Subtitle */}
        <p className="text-sm text-gray-600 mt-2">Add a delivery address.</p>

        {/* Button */}
        <button className="mt-6 px-6 py-2 bg-[#e96f84] text-white font-semibold rounded shadow hover:bg-[#2f415d]" onClick={onClick}>
          ADD ADDRESSES
        </button>
      </div>
    </div>
  );
};

export default EmptyAddress;
