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

const StarRating = ({
  rating,
  setRating,
  interactive = false,
  size = "md",
}) => {
  const starSize = size === "lg" ? "text-xl" : "text-base";

  return (
    <div className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= Math.floor(rating)) {
          return (
            <span
              key={star}
              className={`${interactive ? "cursor-pointer" : ""
                } ${starSize} text-yellow-400`}
              onClick={() => interactive && setRating(star)}
            >
              <FaStar />
            </span>
          );
        } else if (star === Math.ceil(rating) && rating % 1 >= 0.5) {
          return (
            <span
              key={star}
              className={`${interactive ? "cursor-pointer" : ""
                } ${starSize} text-yellow-400`}
              onClick={() => interactive && setRating(star)}
            >
              <FaStarHalfAlt />
            </span>
          );
        } else {
          return (
            <span
              key={star}
              className={`${interactive ? "cursor-pointer" : ""
                } ${starSize} text-gray-300`}
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

  // useEffect(() => {
  //   if (productData?._id && loginData?._id && customerReviews.length > 0) {
  //     const userReview = customerReviews.find((review) => review.userId === loginData._id);
  //     console.log(userReview, "userReview");
  //     setHasUserReviewed(!!userReview);
  //   }
  // }, [customerReviews, loginData, productData]);
  useEffect(() => {
    if (productData?._id && loginData?._id && customerReviews.length > 0) {
      const userReview = customerReviews.find(
        (review) =>
          review.userId === loginData._id &&
          review.productId === productData._id
      );
      console.log(userReview, "userReview");
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
      ).unwrap()
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
          // console.error("Failed to submit review:", err);
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

    // if (status === "failed") {
    //   return (
    //     <div className="bg-red-50 p-4 rounded-lg text-red-600 my-6">
    //       Error loading reviews: {error?.message || "Please try again later"}
    //     </div>
    //   );
    // }
    return (
      <div className="mt-5 border border-gray-200 rounded-lg p-3">
        <h3 className=" text-base sm:text-xl font-semibold text-gray-800">
          Ratings & Reviews
        </h3>
        <div className="flex flex-col sm:flex-row w-full gap-3 mt-3">
          {/* Left: Rating Summary */}
          <div className="bg-white p-3 rounded-lg shadow-sm border whitespace-nowrap w-full border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-blue-50 rounded-full p-4">
                <span className="text-3xl font-bold text-blue-600">
                  {rating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <div>
                <div className="mb-1">
                  <StarRating rating={rating || 0} size="lg" />
                </div>
                <p className="text-gray-600">
                  {totalRatings || 0} Ratings & Reviews
                </p>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-3 mt-6">
              {[5, 4, 3, 2, 1].map((stars) => {
                const breakdown = ratingBreakdown?.find(
                  (r) => r.stars === stars
                ) || { percentage: 0, count: 0 };
                return (
                  <div key={stars} className="flex items-center space-x-3 gap-2">
                    <span className="text-gray-600 w-8">{stars} Star</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full"
                        style={{ width: `${breakdown.percentage || 0}%` }}
                      />
                    </div>
                    <span className="text-gray-500 text-sm w-8 text-right">
                      {breakdown.count || 0}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6 w-full border border-gray-200">
            {customerReviews?.length > 0 ? (
              <div className="h-[40vh]  scroll-smooth overflow-y-auto space-y-6 p-4 no-scrollbar">
                {customerReviews.map((review, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center text-gray-600 font-semibold">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h5 className="font-semibold text-gray-800">{review.name}</h5>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mb-2">
                          <StarRating rating={review.rating} />
                        </div>
                        <h6 className="font-medium text-gray-700 mb-1">
                          {review.title}
                        </h6>
                        <p className="text-gray-600">{review.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center h-[40vh] flex flex-col justify-center items-center">
                <p className="text-gray-500 mb-4">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>

        </div>
        {/* Review Form */}
        {hasUserReviewed ? (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <FaRegCircleCheck className="text-blue-500 mr-2" />
              <p className="text-blue-700">
                You have already reviewed this product.
                {customerReviews.find((r) => r.userId === loginData._id)
                  ?.content && (
                    <span>
                      {" "}
                      Your review: "
                      {
                        customerReviews.find((r) => r.userId === loginData._id)
                          .content
                      }
                      "
                    </span>
                  )}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                Write a Review
              </h4>
              <p className="text-sm text-gray-600 mb-6">
                Your email address will not be published. Required fields are
                marked <span className="text-red-500">*</span>
              </p>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Summarize your review in a few words"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <StarRating
                      rating={formData.rating}
                      setRating={handleRatingChange}
                      interactive={true}
                      size="lg"
                    />
                    <span className="text-sm text-gray-600">
                      {formData.rating} out of 5
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review <span className="text-red-500">*</span>
                    <span className="text-gray-400 ml-2">
                      ({charsRemaining} characters remaining)
                    </span>
                  </label>
                  <textarea
                    rows={5}
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    maxLength={1500}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#29415d] text-white px-6 py-2 rounded-md hover:bg-[#e9624d] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
          </>
          // Your existing review form here
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
