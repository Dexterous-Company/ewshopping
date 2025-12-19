"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews, addReview } from "@/redux/reviews/reviewSlice";
import { IoIosArrowForward } from "react-icons/io";
import EmptyReviews from "@/components/EmptyPages/EmptyReviews";
import toast from "react-hot-toast";

// Modern color theme
const modernColors = {
  primary: "#2563eb", // Modern Blue
  secondary: "#64748b", // Slate Gray
  accent: "#059669", // Emerald Green
  light: "#f8fafc", // Light Slate
  dark: "#1e293b", // Dark Slate
  border: "#e2e8f0", // Border Gray
  success: "#10b981", // Success Green
};

const StarRating = ({
  rating = 5, // Default 5 add करें
  setRating,
  interactive = false,
  size = "md",
}) => {
  const starSize = size === "lg" ? "text-xl" : "text-base";
  const { loginData } = useSelector((store) => store.Athentication);
  return (
    <div className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= Math.floor(rating)) {
          return (
            <span
              key={star}
              className={`${
                interactive ? "cursor-pointer hover:scale-110" : ""
              } ${starSize} text-amber-500 transition-transform`}
              onClick={() => interactive && setRating(star)}
            >
              <FaStar />
            </span>
          );
        } else if (star === Math.ceil(rating) && rating % 1 >= 0.5) {
          return (
            <span
              key={star}
              className={`${
                interactive ? "cursor-pointer hover:scale-110" : ""
              } ${starSize} text-amber-500 transition-transform`}
              onClick={() => interactive && setRating(star)}
            >
              <FaStarHalfAlt />
            </span>
          );
        } else {
          return (
            <span
              key={star}
              className={`${
                interactive ? "cursor-pointer hover:scale-110" : ""
              } ${starSize} text-gray-300 transition-transform`}
              onClick={() => interactive && setRating(star)}
            >
              <FaStar />
            </span>
          );
        }
      })}
    </div>
  );
};

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("description");
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  // Get reviews from Redux store
  const {
    rating,
    totalRatings,
    ratingBreakdown,
    customerReviews,
    status,
    error,
  } = useSelector((state) => state.reviews);

  const { product } = useSelector((state) => state.info);
  const productData = product?.[0] || {};
  const generalFields = productData?.generalFields || [];
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { loginData } = useSelector((state) => state.Athentication);

  useEffect(() => {
    if (productData?._id && loginData?._id && customerReviews.length > 0) {
      const userReview = customerReviews.find(
        (review) =>
          review.userId === loginData._id &&
          review.productId === productData._id
      );
      setHasUserReviewed(!!userReview);
    }
  }, [customerReviews, loginData, productData]);

  // Review form state
  const [formData, setFormData] = useState({
    name: loginData?.name || "",
    email: loginData?.email || "",
    title: "",
    rating: 5,
    content: "",
    userId: loginData?._id || "",
  });

  const [charsRemaining, setCharsRemaining] = useState(1500);

  // Fetch reviews when product changes or reviews tab is selected
  useEffect(() => {
    if (productData?._id) {
      dispatch(fetchReviews(productData?._id));
    }
  }, [dispatch, productData?._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "content") {
      setCharsRemaining(1500 - value.length);
    }
  };

  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({
      ...prev,
      rating: newRating,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const LData = JSON.parse(localStorage.getItem("loginData"));
    if (!LData) {
      navigate.push("/login");
    } else {
      dispatch(
        addReview({
          productId: productData._id,
          reviewData: formData,
        })
      )
        .unwrap()
        .then(() => {
          setFormData({
            name: loginData?.name || "",
            email: loginData?.email || "",
            title: "",
            rating: 5,
            content: "",
          });
          setCharsRemaining(1500);
        })
        .catch((err) => {
          if (err?.error === "You have already reviewed this product") {
            toast.error("You already reviewed this product!", {
              position: "top-right",
            });
            setHasUserReviewed(true);
          } else {
            console.error("Failed to submit review:", err);
            toast.error("Something went wrong, please try again later.", {
              position: "top-right",
            });
          }
        });
    }
  };

  const renderReviewsTab = () => {
    if (status === "loading" && customerReviews.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      );
    }

    // Calculate display values
    const displayRating = customerReviews.length > 0 ? rating : 5;
    const displayRatingFormatted = customerReviews.length > 0 ? rating?.toFixed(1) : "5.0";
    const displayTotalRatings = customerReviews.length > 0 ? totalRatings : 5;

    return (
      <div className="mt-6 border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">
          Ratings & Reviews
        </h3>
        <div className="flex flex-col lg:flex-row w-full gap-6">
          {/* Left: Rating Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 w-full lg:w-1/3">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-full p-4">
                <span className="text-3xl font-bold text-white">
                  {displayRatingFormatted}
                </span>
              </div>
              <div>
                <div className="mb-2">
                  <StarRating rating={displayRating} size="lg" />
                </div>
                <p className="text-slate-600">
                  {displayTotalRatings} Ratings & Reviews
                </p>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-3 mt-6">
              {[5, 4, 3, 2, 1].map((stars) => {
                const breakdown = ratingBreakdown?.find(
                  (r) => r.stars === stars
                ) || { percentage: 0, count: 0 };
                
                // If no reviews, show 100% for 5 stars
                const displayPercentage = customerReviews.length > 0 
                  ? breakdown.percentage 
                  : stars === 5 ? 100 : 0;
                
                const displayCount = customerReviews.length > 0 
                  ? breakdown.count 
                  : 0;

                return (
                  <div
                    key={stars}
                    className="flex items-center space-x-3 gap-2"
                  >
                    <span className="text-slate-700 w-12 text-sm">{stars} Star</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all duration-500"
                        style={{ width: `${displayPercentage}%` }}
                      />
                    </div>
                    {displayCount > 0 && (
                      <span className="text-slate-600 text-sm w-8 text-right">
                        {displayCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Reviews List */}
          <div className="flex-1 border border-gray-200 bg-white rounded-xl shadow-sm">
            {customerReviews?.length > 0 ? (
              <div className="h-[50vh] scroll-smooth overflow-y-auto space-y-6 p-6 no-scrollbar">
                {customerReviews.map((review, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-full w-12 h-12 flex items-center justify-center text-white font-semibold">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-semibold text-slate-800">
                            {review.name}
                          </h5>
                          <span className="text-sm text-slate-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mb-3">
                          <StarRating rating={review.rating} />
                        </div>
                        {review.title && (
                          <h6 className="font-medium text-slate-700 mb-2">
                            {review.title}
                          </h6>
                        )}
                        <p className="text-slate-600 leading-relaxed">{review.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-xl text-center h-[50vh] flex flex-col justify-center items-center border-2 border-dashed border-gray-200">
                <div className="text-gray-400 mb-3 text-4xl">💬</div>
                <p className="text-slate-600 mb-2 text-lg font-medium">
                  No reviews yet
                </p>
                <p className="text-slate-500 text-sm">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Review Form */}
        {hasUserReviewed ? (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
            <div className="flex items-center">
              <FaRegCircleCheck className="text-blue-500 mr-3 text-lg" />
              <div>
                <p className="text-blue-800 font-medium">
                  You have already reviewed this product.
                </p>
                {customerReviews.find((r) => r.userId === loginData._id)
                  ?.content && (
                  <p className="text-blue-700 text-sm mt-1">
                    Your review: "
                    {
                      customerReviews.find((r) => r.userId === loginData._id)
                        .content
                    }
                    "
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="text-xl font-semibold mb-6 text-slate-800">
              Write a Review
            </h4>
            <p className="text-sm text-slate-600 mb-6">
              Your email address will not be published. Required fields are
              marked <span className="text-red-500">*</span>
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                  placeholder="Summarize your review in a few words"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-3">
                  <StarRating
                    rating={formData.rating}
                    setRating={handleRatingChange}
                    interactive={true}
                    size="lg"
                  />
                  <span className="text-slate-600 font-medium">
                    {formData.rating} out of 5
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Review <span className="text-red-500">*</span>
                  <span className="text-slate-500 text-sm font-normal ml-2">
                    ({charsRemaining} characters remaining)
                  </span>
                </label>
                <textarea
                  rows={5}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  maxLength={1500}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none transition-colors"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white" id="rating">
      {renderReviewsTab()}
    </div>
  );
}