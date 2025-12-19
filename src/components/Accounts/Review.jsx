"use client";

import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaHourglassStart,
  FaTwitter,
  FaFacebookF,
  FaShareAlt,
  FaEdit,
  FaTrash,
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaThumbsUp,
  FaThumbsDown,
  FaGem,
  FaCrown,
  FaAward,
  FaArrowLeft
} from "react-icons/fa";
import { IoCheckmarkCircle, IoSparkles } from "react-icons/io5";
import { MdEmail, MdOutlineVerified, MdAutoAwesome } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { deleteReview, fetchUserReviews } from "@/redux/reviews/reviewSlice";
import { toast } from "react-toastify";
import EmptyReviews from "../EmptyPages/EmptyReviews";

const Review = () => {
  const [model, setModel] = useState({ type: null, reviewId: null });
  const [likedReviews, setLikedReviews] = useState(new Set());
  const [dislikedReviews, setDislikedReviews] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const { loginData } = useSelector((state) => state.Athentication);
  const { userRetingAll } = useSelector((state) => state.reviews);

  useEffect(() => {
    if (loginData._id) {
      dispatch(fetchUserReviews({ userId: loginData._id }));
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [loginData._id]);

  // Mock loading skeleton
  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="flex gap-3 pt-3">
              <div className="h-7 bg-gray-200 rounded w-16"></div>
              <div className="h-7 bg-gray-200 rounded w-16"></div>
              <div className="h-7 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleLike = (reviewId) => {
    setLikedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
        toast.info("Like removed");
      } else {
        newSet.add(reviewId);
        setDislikedReviews(prevDislikes => {
          const newDislikes = new Set(prevDislikes);
          newDislikes.delete(reviewId);
          return newDislikes;
        });
        toast.success("Review liked!");
      }
      return newSet;
    });
  };

  const handleDislike = (reviewId) => {
    setDislikedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
        toast.info("Dislike removed");
      } else {
        newSet.add(reviewId);
        setLikedReviews(prevLikes => {
          const newLikes = new Set(prevLikes);
          newLikes.delete(reviewId);
          return newLikes;
        });
        toast.info("Review disliked");
      }
      return newSet;
    });
  };

  const statCards = [
    {
      title: "Total Reviews",
      count: userRetingAll?.length || 0,
      icon: <FaStar className="text-sm" />,
      gradient: "from-purple-500 to-pink-500",
      bg: "bg-gradient-to-br from-purple-50 to-pink-50",
      trend: "+12%",
      description: "Your contributions"
    },
    {
      title: "Premium Reviews",
      count: userRetingAll?.filter(r => r.rating >= 4).length || 0,
      icon: <FaGem className="text-sm" />,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
      trend: "+8%",
      description: "4+ star ratings"
    },
    {
      title: "Helpful Votes",
      count: userRetingAll?.reduce((acc, review) => acc + review.likes, 0) || 0,
      icon: <FaThumbsUp className="text-sm" />,
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-gradient-to-br from-green-50 to-emerald-50",
      trend: "+23%",
      description: "Community impact"
    },
    {
      title: "Expert Level",
      level: userRetingAll?.length >= 10 ? "Pro" : userRetingAll?.length >= 5 ? "Intermediate" : "Beginner",
      icon: userRetingAll?.length >= 10 ? <FaCrown className="text-sm" /> : <FaAward className="text-sm" />,
      gradient: "from-amber-500 to-orange-500",
      bg: "bg-gradient-to-br from-amber-50 to-orange-50",
      trend: userRetingAll?.length >= 10 ? "Max" : `${userRetingAll?.length}/10`,
      description: "Reviewer status"
    }
  ];

  const filters = [
    { key: "all", label: "All Reviews", count: userRetingAll?.length },
    { key: "premium", label: "Premium", count: userRetingAll?.filter(r => r.rating >= 4).length },
    { key: "recent", label: "Recent", count: userRetingAll?.length },
    { key: "popular", label: "Most Helpful", count: userRetingAll?.filter(r => r.likes > 0).length }
  ];

  const handleDeleteReview = async () => {
    try {
      const result = await dispatch(deleteReview(model.reviewId));
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(fetchUserReviews({ userId: loginData._id }));
        toast.success("🎉 Review deleted successfully");
      } else toast.error("❌ Failed to delete review");
    } catch (err) {
      toast.error("💥 Error deleting review");
    } finally {
      setModel({ type: null, reviewId: null });
    }
  };

  const handleEditReview = (id) => {
    toast.info("✏️ Opening editor...");
    setTimeout(() => router.push(`/accounts/review/${id}`), 500);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <div
        key={index}
        className={`relative overflow-hidden rounded-full ${
          index < rating 
            ? "text-yellow-400 drop-shadow-lg" 
            : "text-gray-300"
        } transition-all duration-300 hover:scale-110`}
      >
        <FaStar className="text-xs sm:text-sm drop-shadow-sm" />
        {index < rating && (
          <div className="absolute inset-0 animate-pulse">
            <FaStar className="text-xs sm:text-sm text-yellow-300" />
          </div>
        )}
      </div>
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "from-emerald-500 to-green-500";
    if (rating >= 4) return "from-blue-500 to-cyan-500";
    if (rating >= 3) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-pink-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 sm:px-4 px-2 py-4">
      {/* HEADER WITH GLASS EFFECT */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 p-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-md border border-white/50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="group p-2 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            <FaArrowLeft
              className="h-4 w-4 text-gray-600 group-hover:text-gray-900 transition-all duration-300 group-hover:-translate-x-0.5"
            />
          </button>
          <div className="relative">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              My Reviews
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
              <MdAutoAwesome className="text-amber-500 text-xs" />
              Manage your product reviews
            </p>
          </div>
        </div>

        {/* FILTER CHIPS */}
        <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                activeFilter === filter.key
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/25"
                  : "bg-white/80 text-gray-600 hover:bg-white border border-gray-200/60 hover:border-gray-300 shadow-sm hover:shadow-sm"
              } backdrop-blur-sm`}
            >
              {filter.label}
              <span className={`ml-1 px-1 py-0.5 rounded-full text-xs ${
                activeFilter === filter.key 
                  ? "bg-white/20 text-white/90" 
                  : "bg-gray-100 text-gray-500"
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PREMIUM STAT CARDS */}
      <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-4 mb-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border border-white/50 overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            {/* Animated Border */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
              <div className="absolute inset-[1px] rounded-2xl bg-white/90 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
                  {card.trend}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-900">
                  {card.level || card.count}
                </p>
                <p className="text-xs font-semibold text-gray-600">
                  {card.title}
                </p>
                <p className="text-xs text-gray-500">
                  {card.description}
                </p>
              </div>

              {/* Progress Bar for Expert Level */}
              {card.title === "Expert Level" && (
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`bg-gradient-to-r ${card.gradient} h-1.5 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.min((userRetingAll?.length / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* REVIEW CARDS */}
      <div className="space-y-4">
        {isLoading ? (
          <SkeletonLoader />
        ) : userRetingAll?.length ? (
          userRetingAll.map((review, index) => (
            <div
              key={review._id}
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-0.5 border border-white/50 overflow-hidden"
            >
              {/* Premium Badge for High Ratings */}
              {review.rating >= 4.5 && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                    <IoSparkles className="text-xs" />
                    <span className="text-xs">Premium</span>
                  </div>
                </div>
              )}

              <div className="p-4">
                {/* HEADER WITH RATING */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h2 className="font-bold text-sm sm:text-base text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors mb-2">
                      {review.product.name}
                    </h2>
                    
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-gradient-to-r ${getRatingColor(review.rating)} text-white shadow-md`}>
                        <span className="font-bold text-xs">{review.rating}</span>
                        <FaStar className="text-xs" />
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>

                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* REVIEW TITLE & CONTENT */}
                {review.title && (
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {review.title}
                  </h3>
                )}
                
                <p className="text-gray-600 leading-relaxed mb-4 text-xs sm:text-sm line-clamp-3">
                  {review.content}
                </p>

                {/* INTERACTION BAR */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100/50">

                  {/* REACTION BUTTONS */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(review._id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm ${
                        likedReviews.has(review._id)
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/25"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/60 shadow-sm"
                      }`}
                    >
                      {likedReviews.has(review._id) ? (
                        <FaThumbsUp className="text-xs" />
                      ) : (
                        <FaRegThumbsUp className="text-xs" />
                      )}
                      <span className="text-xs font-semibold">
                        {likedReviews.has(review._id) ? review.likes + 1 : review.likes}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDislike(review._id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm ${
                        dislikedReviews.has(review._id)
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/25"
                          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/60 shadow-sm"
                      }`}
                    >
                      {dislikedReviews.has(review._id) ? (
                        <FaThumbsDown className="text-xs" />
                      ) : (
                        <FaRegThumbsDown className="text-xs" />
                      )}
                      <span className="text-xs font-semibold">
                        {dislikedReviews.has(review._id) ? review.dislikes + 1 : review.dislikes}
                      </span>
                    </button>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-2">
                    {[
                      { icon: FaEdit, label: "Edit", color: "from-blue-500 to-cyan-500", action: () => handleEditReview(review._id) },
                      { icon: FaTrash, label: "Delete", color: "from-rose-500 to-pink-500", action: () => setModel({ type: "Delete", reviewId: review._id }) },
                      { icon: FaShareAlt, label: "Share", color: "from-purple-500 to-indigo-500", action: () => setModel({ type: "Share", reviewId: review._id }) }
                    ].map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.action}
                        className="group/btn flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-gray-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-gray-200/60 hover:border-transparent relative overflow-hidden"
                      >
                        {/* Animated Background */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300`}></div>
                        
                        {/* Content */}
                        <div className="relative z-10 flex items-center gap-1">
                          <action.icon className="text-xs group-hover/btn:scale-110 transition-transform" />
                          <span className="text-xs font-semibold">{action.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* SHARE POPUP */}
                {model.type === "Share" && model.reviewId === review._id && (
                  <div className="mt-4 p-4 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-white/50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Share this review</p>
                        <p className="text-xs text-gray-500 mt-1">Spread the word about your experience</p>
                      </div>
                      <button
                        onClick={() => setModel({ type: null, reviewId: null })}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <RxCross2 className="text-gray-400 hover:text-gray-600 text-lg" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { icon: FaTwitter, color: "from-blue-400 to-blue-600", label: "Twitter", bg: "bg-blue-500" },
                        { icon: FaFacebookF, color: "from-blue-600 to-blue-800", label: "Facebook", bg: "bg-blue-600" },
                        { icon: MdEmail, color: "from-rose-500 to-red-500", label: "Email", bg: "bg-red-500" }
                      ].map((social, idx) => (
                        <div
                          key={idx}
                          className="group/social flex flex-col items-center gap-2 cursor-pointer"
                          onClick={() => toast.success(`Sharing to ${social.label}...`)}
                        >
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${social.color} text-white shadow-md group-hover/social:scale-110 group-hover/social:shadow-lg transition-all duration-300`}>
                            <social.icon className="text-lg" />
                          </div>
                          <p className="text-xs font-semibold text-gray-700">{social.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyReviews />
        )}
      </div>

      {/* DELETE MODAL */}
      {model.type === "Delete" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/50">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <FaTrash className="text-white text-lg" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Review?</h3>
              <p className="text-gray-600 text-sm">
                This will permanently remove your review from the platform. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setModel({ type: null, reviewId: null })}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-md hover:shadow-rose-500/25 transition-all duration-300 transform hover:scale-105 text-sm"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;