"use client";
import {
  CheckCircle,
  ChevronRight,
  FileDownload,
  LocationOn,
  Person,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const OrderSucessID = () => {
  const [open, setOpen] = useState({ type: null, index: null });
  const router = useRouter();

  return (
    <>
      <div className="sm:px-4 px-2 relative py-2 w-full sm:mb-0 mb-10 overflow-y-auto">
        <div className="block sm:hidden">
          <h1 className="font-semibold flex flex-row items-center gap-2 text-lg text-[#2f415d] ">
            <span onClick={() => router.back("")}>
              <IoIosArrowRoundBack size={30} />
            </span>
            <span>Order Details</span>
          </h1>
        </div>
        <div className="sm:mx-auto grid mt-2 grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white sm:rounded-md sm:shadow-sm p-4">
            <div className="text-[1rem] text-black/60 my-2 bg-white flex flex-col ">
              <span>Order can be tracked by 0123456789.</span>
              <span>Tracking link is shared via SMS.</span>
              <div className="my-4 flex flex-col gap-1">
                <span className="text-[1rem] font-semibold text-black">
                  Pay now and ask the delivery agent to drop the item at
                  doorstep
                </span>
                <button className="bg-[#2f425d] w-fit uppercase text-sm font-semibold text0white px-10 py-3 cursor-pointer text-white">
                  PAY ₹424
                </button>
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="font-medium sm:text-base text-sm">
                  NewSelect Back Cover for Mi Redmi Note 10 Pro, Mi Redmi Note
                  10 Pro Max
                </h2>
                <p className="text-gray-500 text-sm mt-1">Blue</p>
                <p className="text-gray-500 text-sm">Seller: LAXITASTORES</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xl font-semibold text-black">₹237</span>
                  <span className="text-green-600 text-sm font-medium">
                    1 offer
                  </span>
                </div>
              </div>
              <img
                src="https://rukminim1.flixcart.com/image/100/80/kqy3rm80/cases-covers/back-cover/s/5/8/r10pro-newselect-original-imag4uusennd3fnk.jpeg?q=100"
                alt="Product"
                loading="lazy"
                width={80}
                height={100}
                className="object-contain"
              />
            </div>

            {/* Timeline */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CheckCircle className="text-green-600" fontSize="small" />
                Delivery was made with OTP verification
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CheckCircle className="text-green-600" fontSize="small" />
                Order Confirmed, Jul 15
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CheckCircle className="text-green-600" fontSize="small" />
                Delivered, Jul 19
              </div>
            </div>

            {/* See all updates */}
            <div
              onClick={() => setOpen({ type: "Updates", index: null })}
              className="mt-3 flex items-center gap-1 text-[#e96f84] cursor-pointer text-sm font-medium"
            >
              See All Updates
              <ChevronRight fontSize="small" />
            </div>

            {/*cancel policy  */}
            <div className="w-full flex flex-row gap-2 mt-5 font-semibold   justify-between items-center">
              <button
                onClick={() => setOpen({ type: "cancel", index: null })}
                className="border w-full border-gray-300 cursor-pointer py-2 flex flex-row justify-center items-center text-sm"
              >
                Cancel
              </button>
              <button className="border w-full border-gray-300 cursor-pointer py-2 flex flex-row justify-center items-center text-sm">
                Chat with us
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {/* Invoice Download */}
            <div className="bg-white rounded-md sm:shadow-sm p-4 flex justify-between items-center cursor-pointer">
              <div className="flex items-center gap-2">
                <FileDownload className="text-[#e96f84]" />
                <span className="font-medium text-sm">Download Invoice</span>
              </div>
              <ChevronRight className="text-gray-500" />
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-lg sm:shadow-sm p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-800 text-base mb-4 flex items-center gap-2">
                Delivery details
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <LocationOn className="text-gray-600" fontSize="small" />
                  <span className="font-medium">Work</span>
                  <span className="truncate">
                    Sharada complex near chickeb Vengal Rao Nagar Road, Siddarth
                    Nagar, Ameerpet, Hyderabad Telangana 500038
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Person className="text-gray-600" fontSize="small" />
                  <span className="font-medium">Shaik Meharaj</span>
                  <span>9908018296</span>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-white rounded-lg sm:shadow-sm p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-800 text-base mb-4">
                Price Details
              </h3>
              <div className="text-sm text-gray-700 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">List price</span>
                  <span className="line-through text-gray-500">₹699</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selling price</span>
                  <span>₹275</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Extra Discount</span>
                  <span className="text-gray-600">- ₹32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-gray-600">
                    Special Price
                    <img
                      src="https://rukminim1.flixcart.com/www/20/20/promos/30/05/2025/914ea403-08ff-4f17-a7b8-1ad05b105784.png?q=90"
                      alt="info"
                      width={16}
                      height={16}
                      className="ml-1"
                    />
                  </span>
                  <span>₹243</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Get extra ₹10 off on 5 item(s)</span>
                  <span>- ₹10</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹237</span>
                </div>
              </div>
            </div>
          </div>
          {open.type === "Updates" && (
            <div
              className="fixed inset-0 z-50 mt-10 bg-black/40 px-4 flex items-center justify-center overflow-y-auto"
              onClick={() => setOpen({ type: null, index: null })}
            >
              <div className="bg-white  max-h-[60vh] sm:w-1/4 w-full rounded-lg relative p-4 overflow-y-auto ">
                {/* Close button */}
                <button
                  className="absolute top-3 right-3 text-xl text-gray-700 hover:text-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IoClose />
                </button>
                {/* Timeline */}
                <div className="pl-5">
                  <div className="">
                    <div className="relative text-black text-sm pb-3">
                      <div className="absolute -left-[1.3rem]  w-3 h-3 rounded-full bg-green-500 border-[2px] border-white z-10" />
                      <div className="absolute -left-[1rem] h-full border-l-2  border-green-500 " />
                      <span> Order Confirmed</span>
                      <span className="text-gray-500 text-sm">
                        Tue, 15th Jul '25
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex flex-col">
                          <span className="fixed top-0 inset-0 z-10 left-0 h-3 w-3 rounded-full bg-green-700" />
                          <span className="text-xs">
                            Seller has processed your order.
                          </span>
                          <span className="text-gray-500 text-xs">
                            Tue, 15th Jul '25 - 7:24pm
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="fixed top-0 inset-0 z-10 left-0 h-3 w-3 rounded-full bg-green-700" />
                          <span className="text-xs">
                            Your Order has been placed.
                          </span>
                          <span className="text-gray-500 text-xs">
                            Tue, 15th Jul '25 - 7:24pm
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="fixed top-0 inset-0 z-10 left-0 h-3 w-3 rounded-full bg-green-700" />
                          <span className="text-xs">
                            Your item has been picked up by delivery partner.
                          </span>
                          <span className="text-gray-500 text-xs">
                            Tue, 15th Jul '25 - 7:24pm
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative text-black text-sm pb-3">
                      <div className="absolute -left-[1.3rem]  w-3 h-3 rounded-full bg-green-500 border-[2px] border-white z-10" />
                      <div className="absolute -left-[1rem] h-full border-l-2  border-green-500 " />
                      <span> Shipped</span>
                      <span className="text-gray-500 text-sm">
                        Thu, 17th Jul '25
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex flex-col">
                          <span className="fixed top-0 inset-0 z-10 left-0 h-3 w-3 rounded-full bg-green-700" />
                          <span className="text-xs">
                            Your item has been shipped.
                          </span>
                          <span className="text-gray-500 text-xs">
                            Thu, 17th Jul '25 - 1:12am
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="fixed top-0 inset-0 z-10 left-0 h-3 w-3 rounded-full bg-green-700" />
                          <span className="text-xs">
                            Your item has been received in the hub nearest to
                            you
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative text-black text-sm pb-3">
                      <div className="absolute -left-[1.3rem]  w-3 h-3 rounded-full bg-green-500 border-[2px] border-white z-10" />
                      <div className="absolute -left-[1rem] h-full border-l-2  border-green-500 " />
                      <span> Out Of Delivery</span>
                      <span className="text-gray-500 text-sm">
                        Sat, 19th Jul '25
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex flex-col">
                          <span className="fixed top-0 inset-0 z-10 left-0 h-3 w-3 rounded-full bg-green-700" />
                          <span className="text-xs">
                            Your item is out for delivery
                          </span>
                          <span className="text-gray-500 text-xs">
                            Sat, 19th Jul '25 - 10:03am
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative text-black text-sm pb-3">
                      <div className="absolute -left-[1.3rem]  w-3 h-3 rounded-full bg-green-500 border-[2px] border-white z-10" />
                      <span> Delivery</span>
                      <span className="text-gray-500 text-sm">
                        Sat, 19th Jul '25
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex flex-col">
                          <span className="fixed top-0 inset-0 z-10 left-0 h-3 w-3 rounded-full bg-green-700" />
                          <span className="text-xs">
                            Your item has been delivered
                          </span>
                          <span className="text-gray-500 text-xs mt-1">
                            Sat, 19th Jul '25 - 7:35pm
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {open.type === "cancel" && (
            <div
              className="fixed inset-0 z-50 mt-10 bg-black/40 px-4 flex items-center justify-center overflow-y-auto"
              onClick={() => setOpen({ type: null, index: null })}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col ga-3 p-4 bg-white"
              >
                <div className="flex sm:w-1/2 flex-row gap-3 items-center mb-3">
                  <img className="h-10 w-10 border" />
                  <span className="font-semibold text-sm ">
                    You saved ₹1499 on this product
                  </span>
                </div>
                <span className="sm:text-sm text-xs font-medium">
                  If you cancel now, you may not able to avail this deal again.
                  Do you still want to cancel?
                </span>
                <div className="w-full flex flex-row gap-2 mt-5 font-semibold   justify-between items-center">
                  <button
                    onClick={() => setOpen({ type: null, index: null })}
                    className="border w-full border-gray-300 cursor-pointer py-2 flex flex-row justify-center items-center text-sm"
                  >
                    Don't Cancel
                  </button>
                  <button className="border text-[#2f415d] w-full border-gray-300 cursor-pointer py-2 flex flex-row justify-center items-center text-sm">
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderSucessID;
