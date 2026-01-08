"use client";

import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { ImCamera } from "react-icons/im";
import { RiErrorWarningFill } from "react-icons/ri";
import { MdStarRate } from "react-icons/md";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  getSingleReview,
  putSingleReview,
} from "../../redux/reviews/reviewSlice";
import { useDispatch, useSelector } from "react-redux";

const ReviewId = () => {
  const [showModel, setShowModel] = useState({ type: null, index: null });
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    content: ""
  });
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const { id } = params;
  const { loginData } = useSelector((state) => state.Athentication);
  const { singleReviews, userRetingAll } = useSelector(
    (state) => state.reviews
  );
  const userID = loginData?._id;

  useEffect(() => {
    if (id && userID) {
      dispatch(getSingleReview({ userID: userID, reviewId: id }));
    }
  }, [id, userID, dispatch]);

  useEffect(() => {
    if (singleReviews?.review) {
      setFormData({
        rating: singleReviews.review.rating || 0,
        title: singleReviews.review.title || "",
        content: singleReviews.review.content || ""
      });
    }
  }, [singleReviews]);

  const review = singleReviews?.review || {};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    setFormData(prev => ({
      ...prev,
      rating: newRating
    }));
  };

  const handleUpdateReview = () => {
    const updatedData = {
      _id: review._id,
      rating: formData.rating,
      title: formData.title,
      content: formData.content
    };
    dispatch(putSingleReview(updatedData))
      .then(() => {
        // Optional: Redirect or show success message
        router.back();
      })
      .catch(error => {
        console.error("Error updating review:", error);
      });
  };

  return (
    <div className="sm:px-4 px-2 relative py-2 w-full sm:h-[70vh] no-scrollbar sm:mb-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-semibold flex flex-row items-center gap-2 text-lg text-[#2f415d] mb-4">
          <span onClick={() => router.back("")} className="cursor-pointer">
            <IoIosArrowRoundBack size={30} />
          </span>
          <span>Ratings & reviews</span>
        </h1>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="text-sm">FLITE Women Flip Flops</span>
            <img
              src="https://rukminim2.flixcart.com/image/832/832/xif0q/slipper-flip-flop/u/j/1/6-fl427-flite-pink-original-imahehwvz2hrzuvj.jpeg?q=70&crop=false"
              alt="FLITE Women Flip Flops"
              loading="lazy"
              className="w-10 h-10 object-cover rounded-sm"
            />
          </div>
        </div>
      </div>

      {/* Review Display Section */}
      {!review._id ? (
        <div className="bg-white p-4 rounded shadow mb-4 text-center">
          <p>Loading review...</p>
        </div>
      ) : null}

      {/* Edit Review Form (Desktop) */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-white w-full mt-4 sm:block hidden">
          <div className="flex flex-row justify-between items-center ">
            <div className="flex flex-row items-center mb-3">
              <h3 className="font-medium text-xl">Edit your review</h3>
              <div
                className="pl-2 cursor-pointer"
                onClick={() => setShowModel({ type: "terms", index: null })}
              >
                <RiErrorWarningFill className="text-xl" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-xl cursor-pointer ${i < formData.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  onClick={() => handleRatingChange(i + 1)}
                />
              ))}
              <span className="text-green-600 font-medium">
                {formData.rating === 5
                  ? "Excellent"
                  : formData.rating === 4
                    ? "Good"
                    : formData.rating === 3
                      ? "Average"
                      : formData.rating === 2
                        ? "Poor"
                        : "Very Poor"}
              </span>
            </div>
          </div>
          <div className="border border-[#dddd] px-2 py-2">
            <div className="border-b border-[#dddd] mb-2">
              <div>
                <p className="text-[#e96f84] text-xs pl-2">Description</p>
              </div>
              <textarea
                name="content"
                placeholder="Description..."
                className="w-full p-2 text-sm focus:outline-none"
                rows="3"
                value={formData.content}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <p className="text-[#2874f0] text-xs">Title</p>
            <input
              name="title"
              type="text"
              placeholder="Review title..."
              className="rounded w-full p-3 text-sm mb-3 text-[#000] focus:outline-none"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full flex justify-end items-center p-3">
            <button
              onClick={handleUpdateReview}
              className="bg-[#e96f84] hover:bg-[#2f415d] text-white font-medium px-14 py-3 rounded shadow"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Edit Review Form (Mobile) */}
      <div className="block sm:hidden">
        <div className="flex flex-col justify-between h-[85vh]">
          <div className="flex flex-col">
            <div className="bg-white flex items-center gap-4 p-4 border-b border-b-[#ddd] shadow">
              <img
                src="https://rukminim2.flixcart.com/image/832/832/xif0q/slipper-flip-flop/u/j/1/6-fl427-flite-pink-original-imahehwvz2hrzuvj.jpeg?q=70&crop=false"
                alt="FLITE Women Flip Flops"
                loading="lazy"
                className="w-10 h-10 object-cover border border-b-[#dddd] px-1 py-1 shadow rounded-sm"
              />
              <div>
                <h3 className="font-semibold text-sm">
                  FLITE Women Flip Flops
                </h3>
                <div className="flex text-green-500 pt-2">
                  {[...Array(5)].map((_, i) => (
                    <MdStarRate
                      key={i}
                      className={`cursor-pointer ${i < formData.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      onClick={() => handleRatingChange(i + 1)}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Review Text */}
            <textarea
              name="content"
              placeholder="More detailed reviews get more visibility..."
              className="flex-1 p-4 text-gray-500 outline-none text-base"
              value={formData.content}
              onChange={handleInputChange}
            ></textarea>
            {/* Footer */}
          </div>
          <div className="flex justify-between items-center border-t p-4 text-sm">
            <button className="flex items-center gap-1 text-gray-600">
              <span className="text-lg">
                <ImCamera />
              </span>{" "}
              <span className="text-md">ADD IMAGE</span>
            </button>
            <button
              onClick={handleUpdateReview}
              className="text-black text-sm font-semibold"
            >
              UPDATE REVIEW
            </button>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showModel.type === "terms" && (
        <div
          onClick={() => setShowModel({ type: null, index: null })}
          className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="max-h-[70vh] overflow-y-auto">
              <div className="border-b border-[#dddddd] px-3 py-4 flex flex-row justify-between items-center">
                <h3 className="font-bold mb-2 text-[#212121]">
                  What makes a good review
                </h3>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="mb-4 border-b border-[#dddddd] px-3 py-4 flex flex-col gap-2">
                <h4 className="font-medium text-lg text-[#212121]">
                  Have you used this product?
                </h4>
                <p className="text-sm text-gray-600">
                  Your review should be about your experience with the product.
                </p>
              </div>
              <div className="mb-3 border-b border-[#dddddd] px-3 py-4 flex flex-col gap-2">
                <h4 className="font-medium text-lg text-[#212121]">
                  Why review a product?
                </h4>
                <p className="text-sm text-gray-600">
                  Your valuable feedback will help fellow shoppers decide!
                </p>
              </div>
              <div className="px-3 py-4 flex flex-col gap-2">
                <h4 className="font-medium text-[#212121]">
                  How to review a product?
                </h4>
                <p className="text-sm text-gray-600">
                  Your review should include facts. An honest opinion is always
                  appreciated. If you have an issue with the product or service
                  please contact us from the{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    help centre
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowModel({ type: null, index: null })}
                className="px-4 py-2 bg-[#e96f84] text-white rounded hover:bg-[#2f415d]"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewId;