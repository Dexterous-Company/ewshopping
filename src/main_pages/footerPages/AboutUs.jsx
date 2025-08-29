
import React from "react";
import {
  FaShoppingBag,
  FaLock,
  FaTags,
  FaUndo,
  FaCertificate,
  FaRuler,
  FaStore,
  FaUserTie,
  FaBookOpen,
  FaTrophy,
} from "react-icons/fa";

const AboutUs = () => {
  const features = [
    {
      icon: <FaShoppingBag className="text-[#e96f84] text-3xl mb-3" />,
      title: "Simple Shopping",
      desc: "Shop online, in-store, or via leading marketplaces with the same merchandise, price, and service.",
    },
    {
      icon: <FaLock className="text-[#e96f84] text-3xl mb-3" />,
      title: "Secure Payments",
      desc: "100% safe and secure transactions. Payment details are transmitted directly to the bank.",
    },
    {
      icon: <FaTags className="text-[#e96f84] text-3xl mb-3" />,
      title: "Range of Products",
      desc: "Wide fashion selection across Men, Women, Kids, Accessories, and Home categories.",
    },
    {
      icon: <FaUndo className="text-[#e96f84] text-3xl mb-3" />,
      title: "Free Returns",
      desc: `"We are responsible for what we sell" – easy returns and exchanges nationwide.`,
    },
    {
      icon: <FaCertificate className="text-[#e96f84] text-3xl mb-3" />,
      title: "100% Original",
      desc: "All products are sourced directly from brands with warranty and authenticity certificates.",
    },
    {
      icon: <FaRuler className="text-[#e96f84] text-3xl mb-3" />,
      title: "Free Alterations",
      desc: "Free alterations for online purchases at any EwShopping store.",
    },
    {
      icon: <FaStore className="text-[#e96f84] text-3xl mb-3" />,
      title: "Express Store Pickup",
      desc: "Shop online and collect orders from your preferred store.",
    },
    {
      icon: <FaUserTie className="text-[#e96f84] text-3xl mb-3" />,
      title: "Personal Shopper Service",
      desc: "Book personal shopper assistance in-store or at home.",
    },
    {
      icon: <FaBookOpen className="text-[#e96f84] text-3xl mb-3" />,
      title: "Style Guide",
      desc: "Follow our curated Style Hub for the latest trends and suggestions.",
    },
  ];

  const awards = [
    { year: "2019", title: "Winner Master Award" },
    { year: "2020", title: "Media Agencies Partner" },
    { year: "2021", title: "Fastest Growing Award" },
    { year: "2023", title: "National Excellence Award" },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* <section
        className="text-white py-16 px-7 text-center bg-cover bg-center"
        style={{
          backgroundImage: `url('/aboutus.jpg')`,
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#000]"></h1>
        <p className=" text-base sm:text-lg mx-auto text-[#000] text-center flex items-center justify-center pl-30 pt-3">
          We Provide Continuous & Kind Service for Customers
        </p>
      </section> */}

      <div
        className="w-full h-32 md:h-70 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/aboutus.jpg')",
          backgroundSize: "100% 100%",
        }}
      ></div>

      {/* About Section */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
        <p className="text-gray-700 leading-relaxed">
          <strong>EwShopping</strong>, a brand of Elderwise Shopping India Pvt
          Ltd, is India's most reliable and frictionless commerce ecosystem that
          creates life-changing experiences for buyers and sellers and leading
          national brands for apparel, fragrances, accessories, cosmetics,
          footwear, home décor, and furnishings catering to the needs of the
          entire family.
        </p>
      </section>

      {/* Customer Service / Vision */}
      <section className="bg-gray-50 px-5 py-10 sm:py-12 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Customer Service</h2>
          <p className="mb-4 text-gray-700">
            <strong>Our Vision:</strong> “To be an inspirational and trusted
            brand, transforming customers' lives through fashion and delightful
            shopping experience every time.”
          </p>
          <p className="text-gray-700">
            We have a team of professional associates who strive endlessly to
            provide the best shopping experience to each of our customers. We
            have adopted a philosophy of <em>"Start Something New"</em> to give
            retail a new dimension with innovation as our key driver.
          </p>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Why Shop With Us
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
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

      {/* Awards Section */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-12 px-6">
        <h2 className="text-2xl font-bold mb-20 sm:mb-8 text-center">
          Our Achievements
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {awards.map((award, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex flex-col items-center"
            >
              <FaTrophy className="text-yellow-500 text-3xl mb-2" />
              <p className="text-xl font-bold text-[#e96f84]">{award.year}</p>
              <p className="text-gray-700">{award.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;