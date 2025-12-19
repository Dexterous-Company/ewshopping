"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FaShoppingBag,
  FaLock,
  FaTags,
  FaUndo,
  FaCertificate,
  FaTruck,
  FaHeadset,
  FaTrophy,
  FaUsers,
} from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const AboutUs = () => {
  const whyChooseUs = [
    {
      icon: <FaCertificate className="text-[#e96f84] text-3xl mb-3" />,
      title: "100% Original Products",
      desc: "Every purchase from our platform is 100% genuine products. Each item we deliver is directly sourced from verified sellers and top reputable brands.",
    },
    {
      icon: <FaLock className="text-[#e96f84] text-3xl mb-3" />,
      title: "Smooth Transactions",
      desc: "Safe & encrypted transactions supported with multiple payment options through cards and UPI for a stress-free shopping experience.",
    },
    {
      icon: <FaUndo className="text-[#e96f84] text-3xl mb-3" />,
      title: "Effortless Returns & Exchanges",
      desc: "Get easy returns and exchanges through our simple return/exchange policies (Max. 15 days).",
    },
    {
      icon: <FaTruck className="text-[#e96f84] text-3xl mb-3" />,
      title: "Quick & Reliable Delivery",
      desc: "Get on-time deliveries across India with live order tracking through our in-house logistics solutions, EW Courier.",
    },
    {
      icon: <FaTags className="text-[#e96f84] text-3xl mb-3" />,
      title: "Best Prices for Every Budget",
      desc: "Save big with exclusive discounts, lucrative offers and the best deals on favorites, all under budget.",
    },
    {
      icon: <FaHeadset className="text-[#e96f84] text-3xl mb-3" />,
      title: "24x7 Dedicated Support",
      desc: "Our customer support team is always available to assist you for peak customer satisfaction, resolving queries and issues.",
    },
  ];

  const achievements = [
    { year: "2019", title: "Winner of the Master Award for Retail Innovation" },
    {
      year: "2020",
      title: "Leading Media Agencies partners for digital expansion",
    },
    {
      year: "2021",
      title: "Recognised as the Fastest Growing E-Commerce Brand",
    },
    { year: "2023", title: "Honoured with the National Excellence Award" },
  ];

  const testimonials = [
    {
      text: "I've been shopping with EW Shopping for over a year, and their product quality and customer support have always exceeded expectations.",
      author: "Priya R., Delhi",
    },
    {
      text: "The return process is so easy and transparent. I never have to worry about wrong products or delays.",
      author: "Mohammed S., Lucknow",
    },
    {
      text: "EW Shopping makes online shopping fun again. I love their discounts on electronics and quick delivery!",
      author: "Anita K., Jaipur",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      if (newIndex < 0) {
        // Jump to last valid position
        return testimonials.length * 3 - 3;
      }
      return newIndex;
    });
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      const totalSlides = testimonials.length * 3;
      // If we reach near end, jump to beginning
      if (newIndex >= totalSlides - 2) {
        return 0;
      }
      return newIndex;
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="bg-white text-gray-800 ">
      {/* Hero Banner */}
      <div className="hidden md:block ">
        <div
          className="w-full h-60 lg:h-68  bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765885310090.webp')",
          }}
        />
      </div>
      <div className="md:hidden">
        <div
          className="w-full h-40 sm:h-64 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765944452552.webp')",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
        {/* Who We Are */}
        <section className="py-4 sm:py-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div className="order-2 md:order-1">
              <div className="aspect-w-16 aspect-h-9 md:aspect-none">
                <div
                  className="w-full h-64 md:h-80 lg:h-96 rounded-xl bg-cover bg-center shadow-lg"
                  style={{
                    backgroundImage:
                      "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1762929497478.webp')",
                  }}
                />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Who We Are
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
                <strong>EW Shopping</strong>, a sub-brand of Elderwise Shopping
                India Pvt. Ltd., is one of the best and most trusted e-commerce
                platforms for connecting sellers and buyers. We make online
                shopping in India simple, enjoyable, and most importantly,
                reliable.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
                At EW Shopping, we believe in the{" "}
                <strong>"Do Not Disturb"</strong> philosophy - meaning we handle
                all the complexities of online shopping so you don't have to.
                While you focus on what matters most, we work tirelessly in the
                background to ensure your shopping experience is seamless,
                secure, and satisfying.
              </p>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-lg my-4">
                <p className="text-base sm:text-lg italic text-gray-700">
                  "Shopping is not just buying — it's about trust, delight, and
                  belonging. We work behind the scenes so you can shop without
                  interruptions."
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                This "Do Not Disturb" approach is what makes us go the extra
                mile. Every product you browse, every order you place, and every
                delivery we make is built on this simple belief: your peace of
                mind is our priority.
              </p>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="bg-gray-50 py-2 sm:py-6">
          <div className="space-y-10 sm:space-y-16">
            {/* Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  Our Vision
                </h2>
                <p className="text-gray-700 mb-3 text-sm sm:text-base">
                  Our vision is to redefine the way India shops by integrating
                  quality, affordability, and trust as the foundation of every
                  experience.
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  We aim to become a household name in Indian e-commerce by
                  supporting customers, local sellers, and emerging small
                  brands, empowering them to grow and stand tall in the digital
                  market.
                </p>
              </div>
              <div
                className="h-56 sm:h-64 md:h-72 rounded-xl bg-cover bg-center shadow-lg"
                style={{
                  backgroundImage:
                    "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1762929688590.webp')",
                }}
              />
            </div>

            {/* Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div
                className="order-2 md:order-1 h-56 sm:h-64 md:h-72 rounded-xl bg-cover bg-center shadow-lg"
                style={{
                  backgroundImage:
                    "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1762929730990.webp')",
                }}
              />
              <div className="order-1 md:order-2">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  Our Mission
                </h2>
                <p className="text-gray-700 mb-3 text-sm sm:text-base">
                  At EW Shopping, the mission is to build India's most
                  customer-friendly e-commerce ecosystem, where every customer
                  feels valued and every purchase feels rewarding.
                </p>
                <ul className="text-gray-700 list-disc pl-4 space-y-1 text-sm sm:text-base">
                  <li>Deliver original products at affordable prices</li>
                  <li>
                    Establish a platform that is universal, secure, and easy to
                    use
                  </li>
                  <li>
                    Ensure fast, transparent, and reliable service across India
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center md:text-left">
            Why Choose EW Shopping
          </h2>
          <p className="text-gray-700 mb-8 text-left md:text-left max-w-4xl text-sm sm:text-base">
            We understand that modern customers do not just look for product
            quality, but they also need trust, transparency, and convenience.
            Here is why you should shop with us:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-300"
              >
                {item.icon}
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Journey & Excellence */}
        <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Our Journey & Excellence
          </h2>
          <p className="text-gray-700 mb-6 max-w-4xl text-sm sm:text-base">
            We started with a simple idea – to establish a one-stop online
            shopping destination that customers can truly trust. We began as a
            small initiative by a talented leader, and a passionate team soon
            grew into one of the best e-commerce ventures in India.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-auto">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition text-center border border-gray-200"
              >
                <FaTrophy className="text-yellow-500 text-3xl mx-auto mb-3" />
                <p className="text-xl font-bold text-[#e96f84]">
                  {achievement.year}
                </p>
                <p className="text-gray-700 text-xs sm:text-sm mt-2">
                  {achievement.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials - Fully Responsive */}
        <section className="py-6 sm:py-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-left">
            Customers Who Keep Us Motivated
          </h2>

          <div className="relative">
            {/* Desktop: Show 3 cards */}
            <div className="hidden lg:block">
              <div className="relative px-10 lg:px-12">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                    }}
                  >
                    {[...testimonials, ...testimonials, ...testimonials].map(
                      (testimonial, idx) => (
                        <div key={idx} className="w-1/3 flex-shrink-0 px-3">
                          <div className="bg-white p-4 sm:p-5 rounded-lg sm:rounded-xl shadow border border-gray-200 h-full">
                            <p className="text-gray-600 italic text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
                              "{testimonial.text}"
                            </p>
                            <p className="text-right font-semibold text-gray-800 text-xs sm:text-sm">
                              — {testimonial.author}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <button
                  onClick={prevSlide}
                  aria-label="Previous testimonials"
                  type="button"
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow border border-gray-300 transition z-10 hover:bg-gray-50"
                >
                  <MdChevronLeft
                    aria-hidden="true"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next testimonials"
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow border border-gray-300 transition z-10 hover:bg-gray-50"
                >
                  <MdChevronRight
                    aria-hidden="true"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </button>
              </div>

              <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to testimonial ${i + 1}`}
                    type="button"
                    onClick={() => goToSlide(i)}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                      currentIndex % testimonials.length === i
                        ? "bg-[#e96f84] scale-125"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Tablet: Show 2 cards */}
            <div className="hidden sm:block lg:hidden">
              <div className="relative px-8">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 50}%)` }}
                  >
                    {[...testimonials, ...testimonials, ...testimonials].map(
                      (testimonial, idx) => (
                        <div
                          key={idx}
                          className="w-1/2 flex-shrink-0 px-2 sm:px-3"
                        >
                          <div className="bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-200 h-full">
                            <p className="text-gray-600 italic text-sm leading-relaxed mb-2 sm:mb-3">
                              "{testimonial.text}"
                            </p>
                            <p className="text-right font-semibold text-gray-800 text-xs sm:text-sm">
                              — {testimonial.author}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <button
                  onClick={prevSlide}
                  aria-label="Previous testimonials"
                  type="button"
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow border border-gray-300 transition z-10"
                >
                  <MdChevronLeft aria-hidden="true" className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next testimonials"
                  type="button"
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow border border-gray-300 transition z-10"
                >
                  <MdChevronRight aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center gap-1.5 mt-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    type="button"
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      currentIndex % testimonials.length === i
                        ? "bg-[#e96f84]"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile: Show 1 card */}
            <div className="block sm:hidden">
              <div className="relative px-2">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {[...testimonials, ...testimonials, ...testimonials].map(
                      (testimonial, idx) => (
                        <div key={idx} className="w-full flex-shrink-0 px-1">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <p className="text-gray-600 italic text-sm leading-relaxed mb-3">
                              "{testimonial.text}"
                            </p>
                            <p className="text-right font-semibold text-gray-800 text-xs">
                              — {testimonial.author}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="flex items-center justify-between mt-4 px-4">
                <button
                  onClick={prevSlide}
                  aria-label="Previous testimonial"
                  type="button"
                  className="bg-white p-2 rounded-full shadow border border-gray-300"
                >
                  <MdChevronLeft aria-hidden="true" className="w-4 h-4" />
                </button>

                <div className="flex gap-1.5">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToSlide(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      type="button"
                      className={`w-2 h-2 rounded-full ${
                        currentIndex % testimonials.length === i
                          ? "bg-[#e96f84]"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  aria-label="Next testimonial"
                  type="button"
                  className="bg-white p-2 rounded-full shadow border border-gray-300"
                >
                  <MdChevronRight aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment & Join */}
        <section className="bg-gray-50 py-6 sm:py-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
            Our Commitment
          </h2>
          <p className="text-gray-700 mb-4 sm:mb-6 max-w-4xl text-sm sm:text-base">
            Here at EW Shopping, every interaction is built on trust, integrity,
            and customer satisfaction. We commit to never stopping and keep
            improving every day, staying transparent in our policies, and
            bringing you an endless range of the best quality products from top
            brands.
          </p>
          <div className="bg-white p-4 sm:p-5 rounded-lg sm:rounded-xl italic text-gray-700 text-sm sm:text-base">
            "We're not just another shopping platform — we're a community that
            believes in making life easier, more stylish, and more connected.
            Our 'Do Not Disturb' approach means we handle the complexities while
            you enjoy the simplicity."
          </div>
        </section>

        <section className="py-6 sm:py-8 text-center">
          <div className="bg-gradient-to-r from-[#e96f84] to-pink-500 text-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl">
            <FaUsers className="text-3xl sm:text-4xl lg:text-5xl mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">
              Join the EW Shopping Family
            </h2>
            <p className="text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
              Whether you're shopping for yourself, your home, or your loved
              ones, EW Shopping make every purchase meaningful. Join our growing
              family and experience India's most reliable, affordable, and
              customer-first shopping platform.
            </p>
            <div className="bg-white bg-opacity-20 p-2 sm:p-3 rounded-lg inline-block mb-3 sm:mb-4">
              <Link
                href="/"
                className="text-base sm:text-lg lg:text-xl font-bold text-black"
              >
                Visit: www.ewshopping.com
              </Link>
            </div>
            <p className="italic text-xs sm:text-sm opacity-90 px-2">
              "Our customers are not just buyers — they're the reason we exist.
              We work behind the scenes so you can shop with peace of mind."
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
