import React from "react";
import {
  FaShoppingBag,
  FaLock,
  FaTags,
  FaUndo,
  FaCertificate,
  FaTruck,
  FaHeadset,
  FaTrophy,
  FaHeart,
  FaUsers,
} from "react-icons/fa";

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

  return (
    <div className="bg-white text-gray-800 sm:mb-0 mb-10">
      {/* Hero Banner */}
      <div
        className="w-full h-64 md:h-80 bg-no-repeat bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/aboutus.jpg')",
          backgroundSize: "cover",
        }}
      >
        <div className="text-center bg-white bg-opacity-80 p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            About EW Shopping
          </h1>
          <p className="text-lg text-gray-700 mt-2">
            Building Trust, Creating Joy
          </p>
        </div>
      </div>

      {/* Who We Are Section */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>EW Shopping</strong>, a sub-brand of Elderwise Shopping India
          Pvt. Ltd., is one of the best and most trusted e-commerce platforms
          for connecting sellers and buyers. We make online shopping in India
          simple, enjoyable, and most importantly, reliable. We offer a vast
          collection of fashion, lifestyle, décor, beauty, and daily essentials
          - all under one super platform.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          At EW Shopping, we believe that online shopping is not just about
          buying products; for us, it's about building trust, feeling joy, and
          creating something valuable. We aim to provide a seamless experience
          for our customers, combining the convenience of online shopping with
          quality assurance.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg my-6 border-l-4 border-[#e96f84]">
          <p className="text-lg italic text-gray-700">
            "Shopping is not just buying — it's about trust, delight, and
            belonging"
          </p>
        </div>
        <p className="text-gray-700 leading-relaxed">
          This is what makes us go the extra mile. Every product you browse,
          every order you place, and every delivery we make is built on this
          simple belief.
        </p>
      </section>

      {/* Vision & Mission Section */}
      <section className="bg-gray-50 px-5 py-10 sm:py-12 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-gray-700 mb-4">
                Our vision is to redefine the way India shops by integrating
                quality, affordability, and trust as the foundation of every
                experience.
              </p>
              <p className="text-gray-700">
                We aim to become a household name in Indian e-commerce by
                supporting customers, local sellers, and emerging small brands,
                empowering them to grow and stand tall in the digital market.
                Our team is relentlessly working towards delivering products and
                services that create meaningful connections and long-term
                satisfaction.
              </p>
            </div>

            {/* Mission */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4">
                At EW Shopping, the mission is to build India's most
                customer-friendly e-commerce ecosystem, where every customer
                feels valued and every purchase feels rewarding. We strive to:
              </p>
              <ul className="text-gray-700 list-disc pl-5 space-y-2">
                <li>Deliver original products at affordable prices</li>
                <li>
                  Establish a platform that is universal, secure, and easy to
                  use for everyone
                </li>
                <li>
                  Ensure fast, transparent, and reliable service across all of
                  India and beyond
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                With coverage of 27000+ pincodes and hundreds of deliveries
                daily, we are continuously expanding to reach more people every
                day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose EW Shopping */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Why Choose EW Shopping
        </h2>
        <p className="text-gray-700 text-center mb-8 max-w-3xl mx-auto">
          We understand that modern customers do not just look for product
          quality, but they also need trust, transparency, and convenience. Here
          is why you should shop with us:
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 text-center"
            >
              {item.icon}
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Journey & Excellence */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Our Journey & Excellence
          </h2>
          <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto">
            We started with a simple idea – to establish a one-stop online
            shopping destination that customers can truly trust. We began as a
            small initiative by a talented leader, and a passionate team soon
            grew into one of the best e-commerce ventures in India.
          </p>
          <p className="text-gray-700 mb-8 text-center max-w-3xl mx-auto">
            Our story has been inspired by innovation, hard work, and relentless
            support from our customers. Over the years, we have achieved notable
            milestones that truly reflect our dedication and growth.
          </p>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex flex-col items-center"
              >
                <FaTrophy className="text-yellow-500 text-3xl mb-2" />
                <p className="text-xl font-bold text-[#e96f84]">
                  {achievement.year}
                </p>
                <p className="text-gray-700">{achievement.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Customers Who Keep Us Motivated
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow border-l-4 border-[#e96f84]"
            >
              <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
              <p className="text-gray-600 font-semibold">
                — {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Commitment */}
      <section className="bg-gray-50 px-5 py-10 sm:py-12 sm:px-6 sm:text-base text-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            Here at EW Shopping, every interaction is built on trust, integrity,
            and customer satisfaction. We commit to never stopping and keep
            improving every day, staying transparent in our policies, and
            bringing you an endless range of the best quality products from top
            brands.
          </p>
          <div className="bg-white p-6 rounded-lg my-6 border-l-4 border-[#e96f84] max-w-3xl mx-auto">
            <p className="text-lg italic text-gray-700">
              "We're not just another shopping platform — we're a community that
              believes in making life easier, more stylish, and more connected"
            </p>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="max-w-6xl mx-auto py-12 px-6 text-center">
        <div className="bg-gradient-to-r from-[#e96f84] to-pink-500 text-white p-8 rounded-2xl">
          <FaUsers className="text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            Join the EW Shopping Family
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Whether you're shopping for yourself, your home, or your loved ones,
            EW Shopping make every purchase meaningful. Join our growing family
            and experience India's most reliable, affordable, and customer-first
            shopping platform.
          </p>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg inline-block">
            <p className="text-xl text-black font-semibold">Visit: www.ewshopping.com</p>
          </div>
          <div className="mt-6 bg-white text-black bg-opacity-20 p-4 rounded-lg max-w-md mx-auto">
            <p className="italic">
              "Our customers are not just buyers — they're the reason we exist."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
