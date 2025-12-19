"use client";
import React, { useState, useEffect } from "react";
import { User, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { fetchBlogs } from "../../redux/blog/blogSlice";

export default function Blog() {
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((store) => store.blog);
  const [currentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e53935] mx-auto"></div>
          <p aria-live="polite" className="mt-4 text-gray-600">
            Loading blogs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading blogs: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <div className="md:block hidden">
          <div
            className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1763797358279.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          />
        </div>
        <div className="md:hidden block">
          <div
            className="w-full h-40 sm:h-64 bg-no-repeat bg-center flex items-center justify-center"
            style={{
              backgroundImage:
                "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1764049653924.webp')",
              backgroundSize: "100% 100%",
              backgroundPosition: "center center",
            }}
          />
        </div>

        <div className="mx-auto px-6 py-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-[#e53935]">
            Latest Fashion Blogs
          </h1>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {blogs && blogs.length > 0 ? (
              blogs.map((blog) => (
                <Link href={`/blog/${blog.id}`} key={blog.id}>
                  <article className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer">
                    <div className="relative overflow-hidden">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-56 sm:h-64 object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="p-6">
                      {/* Meta */}
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <User
                          aria-hidden="true"
                          className="w-4 h-4 mr-1 text-[#e53935]"
                        />
                        <span className="mr-4 font-medium">
                          {blog.authorName}
                        </span>
                        <Calendar
                          aria-hidden="true"
                          className="w-4 h-4 mr-1 text-[#00bcd4]"
                        />
                        <span>{blog.date}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-[#e53935] transition-colors">
                        {blog.title}
                      </h3>

                      {/* Intro / Excerpt */}
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {blog.intro}
                      </p>

                      {/* Tags Preview */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-row items-center gap-2 mb-4">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-3 py-1 bg-red-50 text-[#e53935] rounded-full border border-red-200"
                            >
                              {tag.split(" ")[0]}
                            </span>
                          ))}
                          {blog.tags.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{blog.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Read More */}
                      <div className="flex items-center text-[#e53935] font-bold group-hover:text-[#c62828] transition-colors">
                        Read Full Blog
                        <ArrowRight
                          aria-hidden="true"
                          className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                        />
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No blogs found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
