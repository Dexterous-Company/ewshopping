import React from "react";
import { useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";

const CheckoutStepper = () => {
  const { checkout_step } = useSelector((store) => store.Athentication);
  const steps = [
    "Login",
    "Address",
    "Order Summary",
    "Payment",
  ];

  return (
    <div className="flex justify-between mb-6">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = checkout_step > stepNum;
        const isCurrent = checkout_step === stepNum;
        return (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${isCompleted ? "bg-green-500 text-white" : 
                  isCurrent ? "bg-[#e96f84] text-white" : 
                  "bg-gray-200"}`}>
              {isCompleted ? <FaCheck size={14} /> : stepNum}
            </div>
            <div className={`ml-2 text-sm ${isCurrent ? "font-semibold" : "text-gray-600"}`}>
              {step}
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2 w-8 border-t border-gray-300"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStepper;