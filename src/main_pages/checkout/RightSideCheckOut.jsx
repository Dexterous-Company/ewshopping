
import React, { useEffect } from "react";
import { LiaInfoCircleSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { getCartData } from "@/redux/cart/CartSlice";

const RightSideCheckOut = () => {
    const { isAuth } = useSelector((store) => store.Athentication);
    const {
        CartItems,
        TotalMrp,
        TotalPrice,
        SmallCartFee,
        HandlingFee,
        RainFee,
        DeliveryCharge,
        Netpayable,
    } = useSelector((store) => store.cart);

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getCartData());
    }, [dispatch]);
    const totalSavings = TotalMrp - TotalPrice;

    return (
        <>
            {isAuth ? (
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Price Details Title */}
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-base font-semibold text-gray-500">
                            PRICE DETAILS
                        </h2>
                    </div>

                    {/* Items Price */}
                    <div className="p-4 text-sm space-y-4 border-b border-gray-100 border-dashed">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-1">
                                <span>Price ({CartItems.length} items)</span>
                                <LiaInfoCircleSolid className="text-gray-400" />
                            </div>
                            <span className="text-gray-800">₹{TotalMrp}</span>
                        </div>

                        {/* Delivery Charge */}
                        {DeliveryCharge > 0 && (
                            <div className="flex justify-between">
                                <div className="flex items-center gap-1">
                                    <span>Delivery Charges</span>
                                    <LiaInfoCircleSolid className="text-gray-400" />
                                </div>
                                <span className="text-gray-800">₹{DeliveryCharge}</span>
                            </div>
                        )}

                        {/* Small Cart Fee */}
                        {SmallCartFee > 0 && (
                            <div className="flex justify-between">
                                <div className="flex items-center gap-1">
                                    <span>Small Cart Fee</span>
                                    <LiaInfoCircleSolid className="text-gray-400" />
                                </div>
                                <span className="text-gray-800">₹{SmallCartFee}</span>
                            </div>
                        )}

                        {/* Handling Fee */}
                        {HandlingFee > 0 && (
                            <div className="flex justify-between">
                                <div className="flex items-center gap-1">
                                    <span>Handling Fee</span>
                                    <LiaInfoCircleSolid className="text-gray-400" />
                                </div>
                                <span className="text-gray-800">₹{HandlingFee}</span>
                            </div>
                        )}

                        {/* Rain Fee */}
                        {RainFee > 0 && (
                            <div className="flex justify-between">
                                <div className="flex items-center gap-1">
                                    <span>Rain Fee</span>
                                    <LiaInfoCircleSolid className="text-gray-400" />
                                </div>
                                <span className="text-gray-800">₹{RainFee}</span>
                            </div>
                        )}
                    </div>

                    {/* Total Payable */}
                    <div className="p-4 flex justify-between font-semibold text-lg text-gray-900 border-b border-gray-100 border-dashed">
                        <span>Total Payable</span>
                        <span>₹{Netpayable}</span>
                    </div>  
                    {/* Savings */}
                    {totalSavings > 0 && (
                        <div className="p-4">
                            <p className="text-green-600 font-medium text-sm">
                                Your Total Savings on this order ₹{totalSavings}
                            </p>
                        </div>
                    )}

                    {/* Security Message */}
                    <div className="p-4 flex items-center gap-3 border-t border-gray-100">
                        <AiFillSafetyCertificate className="text-2xl text-gray-400" />
                        <span className="text-sm text-gray-500">
                            Safe and Secure Payments. Easy returns. 100% Authentic products.
                        </span>
                    </div>

                    {/* Terms */}
                    <div className="p-4 text-xs text-gray-500">
                        <p>
                            By continuing with the order, you confirm that you are above 18
                            years of age, and you agree to Flipkart's{" "}
                            <a className="text-pink-500 hover:underline">Terms of Use</a> and{" "}
                            <a className="text-pink-500 hover:underline" href="#">
                                Privacy Policy
                            </a>
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center p-4">
                        <AiFillSafetyCertificate className="text-gray-600 text-3xl mr-3" />
                        <div>
                            <p className="text-gray-700 font-medium">
                                Safe and Secure Payments. Easy returns.
                            </p>
                            <p className="text-gray-700 font-medium">
                                100% Authentic products.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default RightSideCheckOut;
