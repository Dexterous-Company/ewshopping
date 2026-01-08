"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogById } from "../../../redux/blog/blogSlice";
import Blogid from "../../../main_pages/footerPages/Blogid";

export default function BlogDetailPage({ params }) {
  const dispatch = useDispatch();
  const { blog, loading, error } = useSelector((store) => store.blog);
  const blogId = parseInt(params.id);

  useEffect(() => {
    if (blogId) {
      dispatch(fetchBlogById(blogId));
    }
  }, [dispatch, blogId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e53935] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading blog: {error}</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl text-gray-600">Blog not found!</p>
          <p className="mt-2 text-gray-500">The blog you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <Blogid data={blog} />;
}