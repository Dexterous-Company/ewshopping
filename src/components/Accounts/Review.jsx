"use client";
import React, { use, useEffect, useState } from "react";
import { FaStar, FaHourglassStart } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { AiTwotoneLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { FaTwitter } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, fetchUserReviews } from "@/redux/reviews/reviewSlice";
import { toast } from "react-toastify";
import EmptyReviews from "../EmptyPages/EmptyReviews";

const Review = () => {
  const [model, setModel] = useState({ type: null, reviewId: null });
  const router = useRouter();
  const dispatch = useDispatch();
  const { loginData } = useSelector((state) => state.Athentication);
  const { userRetingAll } = useSelector((state) => state.reviews);

  // Calculate review statistics
  const reviewData = [
    {
      Name: "Total Reviews",
      count: userRetingAll?.length || 0,
      Icon: <FaStar />,
    },
    {
      Name: "Yet To review",
      count: 0, // You might want to calculate this based on your data
      Icon: <FaHourglassStart />,
    },
  ];

  useEffect(() => {
    if (loginData._id) {
      dispatch(fetchUserReviews({ userId: loginData._id }));
    }
  }, [dispatch, loginData._id]);

  const handleDeleteReview = async () => {
    try {
      if (!model.reviewId) return;
      const result = await dispatch(deleteReview(model.reviewId));
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(fetchUserReviews({ userId: loginData._id }));
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the review");
    } finally {
      setModel({ type: null, reviewId: null });
    }
  };

  const handleEditReview = (reviewId) => {
    router.push(`/accounts/review/${reviewId}`);
  };

  // EmptyReviews

  return (
    <div className="sm:px-4 px-2 relative py-2 w-full sm:h-[70vh] h-screen sm:mb-0 mb-10 overflow-y-auto">
      <h1 className="font-semibold flex flex-row items-center gap-2 text-lg text-[#2f415d] mb-4">
        <span onClick={() => router.back("")}>
          <IoIosArrowRoundBack size={30} />
        </span>
        <span>Manage Your Reviews</span>
      </h1>
      <div className="grid sm:grid-cols-4 grid-cols-2 mt-3 gap-4">
        {reviewData.map((item, i) => (
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
      <div className=" sm:mt-5 mt-3 px-4 py-3 sm:shadow-md shadow-sm w-full flex flex-col gap-4">
        {userRetingAll?.length > 0 ? userRetingAll?.map((review, index) => (
          <div
            key={index}
            className={`flex justify-between ${index && "hover:bg-gray-300"
              } w-full items-start border  border-gray-300 p-4 rounded-md transition-all duration-150 cursor-pointer hover:shadow-md hover:bg-gray-50`}
          >
            <div className="flex flex-row gap-3 justify-between items-start w-full">
              <div className="flex relative flex-row justify-between items-center">
                <img
                  src={review.product.image}
                  className="h-15 w-20 rounded-xs object-fill"
                  loading="lazy"
                  alt={review.product.name}
                />
              </div>
              <div className="flex flex-col gap-1  w-full ">
                <span className="text-gray-500 font-medium text-[.9rem]">
                  {review.product.name}
                </span>
                <div className="font-semibold text-sm flex flex-row gap-2 items-center">
                  <span className="flex flex-row gap-1 text-white items-center w-fit px-1 py-0.5 rounded-sm bg-[#2f415d]">
                    {review.rating} <FaStar className="text-xs" />
                  </span>
                  <span>{review.title}</span>
                </div>
                <span className="text-medium text-sm">{review.content}</span>
                <div className="flex flex-row gap-2 justify-between text-sm text-gray-600 items-center">
                  <div className="flex flex-row gap-2 items-center whitespace-nowrap sm:whitespace-normal">
                    <span className="sm:text-xs text-[.7rem] gap-1 flex flex-row items-center text-gray-500 font-medium">
                      {/* {review.certified_by} */} Date Of Review
                      <IoCheckmarkCircle />
                    </span>
                    <span className="sm:text-xs text-[.7rem] text-gray-500 font-medium">
                      {review.date}
                    </span>
                  </div>
                  <div className="sm:block hidden">
                    <div className="flex flex-row items-center gap-3">
                      <div className="flex flex-row items-center gap-2">
                        <span>
                          <AiTwotoneLike />
                        </span>
                        <span>{review.likes}</span>
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <span>
                          <AiOutlineDislike />
                        </span>
                        <span>{review.dislikes}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-4">
                  <button
                    className="text-[#2f415d] cursor-pointer text-sm font-semibold"
                    onClick={() => handleEditReview(review._id)}
                  >
                    Edit
                  </button>
                  <div className="relative inline-block">
                    <button
                      className="text-[#2f415d] text-sm cursor-pointer font-semibold"
                      onClick={() =>
                        setModel({ type: "Delete", reviewId: review._id })
                      }
                    >
                      Delete
                    </button>

                    {model.type === "Delete" &&
                      model.reviewId === review._id && (
                        <div className="absolute top-full -left-25 sm:left-0 mt-2 w-[300px] z-50 bg-white border border-gray-300 rounded-md shadow-md p-4">
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-sm text-gray-800 font-medium">
                              Are you sure you want to delete this review?
                            </span>
                            <button
                              onClick={() =>
                                setModel({ type: null, reviewId: null })
                              }
                            >
                              <RxCross2 className="text-gray-500 hover:text-red-500" />
                            </button>
                          </div>

                          <div className="flex justify-end mt-4 gap-2">
                            <button
                              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                              onClick={() =>
                                setModel({ type: null, reviewId: null })
                              }
                            >
                              Cancel
                            </button>
                            <button
                              className="px-3 py-1 border border-red-500 text-red-500 rounded-md text-sm hover:bg-red-50"
                              onClick={handleDeleteReview}
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                  <div className="relative inline-block">
                    <button
                      className="text-[#2f415d] text-sm font-semibold px-4 py-2 cursor-pointer transition"
                      onClick={() =>
                        setModel((prev) =>
                          prev.type === "Share" && prev.reviewId === review._id
                            ? { type: null, reviewId: null }
                            : { type: "Share", reviewId: review._id }
                        )
                      }
                    >
                      Share
                    </button>

                    {model.type === "Share" &&
                      model.reviewId === review._id && (
                        <div className="absolute top-full -left-25 sm:left-0  z-50 bg-white shadow-lg  rounded-md p-4 flex gap-6">
                          <div className="flex flex-col items-center text-sm text-[#2f415d] cursor-pointer hover:text-blue-500">
                            <FaTwitter className="text-xl" />
                            <span>Twitter</span>
                          </div>

                          <div className="flex flex-col items-center text-sm text-[#2f415d] cursor-pointer hover:text-blue-700">
                            <FaFacebookF className="text-xl" />
                            <span>Facebook</span>
                          </div>

                          <div className="flex flex-col items-center text-sm text-[#2f415d] cursor-pointer hover:text-red-500">
                            <MdEmail className="text-xl" />
                            <span>Email</span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <>
            <EmptyReviews />
          </>
        )}
      </div>
    </div>
  );
};

export default Review;
