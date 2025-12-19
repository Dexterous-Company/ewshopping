"use client";
import React from "react";
import { Calendar, User, ArrowLeft, CheckCircle2, Disc } from "lucide-react";
import { GoDotFill } from "react-icons/go";
import Link from "next/link";

const Blogid = ({ data }) => {
  return (
    <>
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden bg-gray-900">
        {/* Background Image with Title and Author Info */}
        <div className="w-full h-[40vh] min-h-[320px] max-h-[500px] sm:h-[50vh] lg:h-[60vh] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Image tag instead of backgroundImage */}
          <img
            src={data.bannerUrl}
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Optional dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Text content on top of image */}
          <div className="relative text-center text-white px-4 sm:px-6 z-10 mb-6 mt-4 sm:mt-0">
            <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold leading-tight drop-shadow-2xl">
              {data.title}
            </h1>
          </div>

          {/* Author Info Section displayed on background image */}
          <div className="z-10">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-5 text-xs sm:text-sm md:text-base font-medium">
              <div className="flex items-center gap-1 sm:gap-2 bg-black/40 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full border border-white/20 text-white">
                <User aria-hidden="true"  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#e53935]" />
                <span className="text-xs sm:text-sm">{data.authorName}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-black/40 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full border border-white/20 text-white">
                <Calendar aria-hidden="true"  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#00bcd4]" />
                <span className="text-xs sm:text-sm">{data.date}</span>
              </div>
            </div>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-0 sm:px-4 lg:px-8 xl:px-0 relative z-10 bg-white -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-25 mx-1 sm:mx-5 lg:mx-8 rounded-lg">
        <div className="bg-white py-6 lg:py-16 rounded-lg">
          <article className="max-w-none mx-auto px-4 sm:px-6 lg:px-12 text-gray-700">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-800 mb-8 sm:mb-12">
              {data.intro}
            </p>

            {/* Benefits Section */}
            {data.benefits && data.benefits.length > 0 && (
              <>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black mt-12 sm:mt-16 md:mt-20 mb-8 sm:mb-12">
                  {data.benefitsTitle ||
                    "Why is Online Women's Clothes Shopping Thriving?"}
                </h2>
                <ul className="space-y-3 sm:space-y-4 md:space-y-5 text-sm sm:text-base md:text-lg">
                  {data.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#000] text-lg sm:text-xl md:text-2xl">
                        <GoDotFill aria-hidden="true"  />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Fashion Trends Section */}
            {data.fashionTrends && data.fashionTrends.length > 0 && (
              <>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black mt-12 sm:mt-16 md:mt-20 mb-8 sm:mb-12">
                  {data.fashionTrendsTitle ||
                    "Latest Trends in Online Women's Clothes"}
                </h2>
                <ol className="space-y-4 sm:space-y-6 md:space-y-8">
                  {data.fashionTrends.map((trend, index) => (
                    <li
                      key={index}
                      className="border-l-2 sm:border-l-3 md:border-l-4 border-gray-300 pl-4 sm:pl-6 md:pl-8 pb-6 sm:pb-8"
                    >
                      <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900">
                        {index + 1}. {trend.trend}
                      </h3>
                      <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-gray-900">
                        {trend.description}
                      </p>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {/* Top 10 Section */}
            {data.top10 && data.top10.length > 0 && (
              <>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black mt-12 sm:mt-16 md:mt-20 mb-8 sm:mb-12">
                  {data.top10Title ||
                    `Top ${data.top10.length} Online Clothing Stores`}
                </h2>

                <ol className="space-y-4 sm:space-y-6 md:space-y-8">
                  {data.top10.map((store) => (
                    <li
                      key={store.rank}
                      className={`${
                        store.highlight
                          ? "border-l-4 sm:border-l-6 md:border-l-8 border-black"
                          : "border-l-2 sm:border-l-3 md:border-l-4 border-gray-300"
                      } pl-4 sm:pl-6 md:pl-8 pb-6 sm:pb-8`}
                    >
                      <h3
                        className={`text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold ${
                          store.highlight ? "text-black" : "text-gray-900"
                        }`}
                      >
                        {store.rank}. {store.name}{" "}
                        {store.highlight && " #1 Choice"}
                      </h3>
                      <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg leading-relaxed text-gray-900">
                        {store.description}
                      </p>
                      <ul className="mt-3 sm:mt-4 md:mt-6 space-y-2 sm:space-y-3">
                        {store.benefits.map((benefit, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm md:text-base"
                          >
                            <Disc aria-hidden="true"  className="w-2 h-2 sm:w-3 sm:h-3 text-[#e53935] fill-current flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {/* How to Choose Section */}
            {data.howToChoose && data.howToChoose.length > 0 && (
              <>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black mt-12 sm:mt-16 md:mt-20 lg:mt-24 mb-6 sm:mb-8 md:mb-10">
                  {data.howToChooseTitle ||
                    "How to Choose the Best Online Clothing Store?"}
                </h2>
                <ul className="space-y-3 sm:space-y-4 md:space-y-5 text-sm sm:text-base md:text-lg">
                  {data.howToChoose.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#000] text-lg sm:text-xl md:text-2xl">
                        <GoDotFill aria-hidden="true"  />
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Shopping Tips Section */}
            {data.shoppingTips && data.shoppingTips.length > 0 && (
              <>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#e53935] mt-12 sm:mt-16 md:mt-20 mb-6 sm:mb-8 md:mb-10">
                  {data.shoppingTipsTitle ||
                    "Women's Clothes Online: Tips for Shopping"}
                </h2>
                <ul className="space-y-3 sm:space-y-4 md:space-y-5 text-sm sm:text-base md:text-lg">
                  {data.shoppingTips.map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 sm:gap-3 md:gap-4"
                    >
                      <CheckCircle2 aria-hidden="true"  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#00bcd4] flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Why EW Shopping Section */}
            {data.whyEWShopping && data.whyEWShopping.length > 0 && (
              <div className="bg-gradient-to-r from-[#e53935]/10 via-pink-50 to-[#00bcd4]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mt-12 sm:mt-16 md:mt-20 border-l-4 sm:border-l-6 md:border-l-8 border-[#e53935]">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-black mb-4 sm:mb-5 md:mb-6">
                  {data.whyEWShoppingTitle ||
                    "Why Choose EW Shopping for Online Women's Clothes?"}
                </h2>
                <ul className="space-y-2 sm:space-y-3 md:space-y-4 text-sm sm:text-base md:text-lg">
                  {data.whyEWShopping.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle2 aria-hidden="true"  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#00bcd4] flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conclusion */}
            <div className="bg-gradient-to-r from-[#e53935]/10 to-[#00bcd4]/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 mt-12 sm:mt-16 md:mt-20 border-l-4 sm:border-l-6 md:border-l-8 border-[#e53935]">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black mb-4 sm:mb-5 md:mb-6">
                Conclusion
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-800">
                {data.conclusion}
              </p>
            </div>

            <div className="mt-12 sm:mt-16 md:mt-20 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 sm:gap-4 bg-black text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all shadow-xl hover:shadow-2xl group"
              >
                <ArrowLeft aria-hidden="true"  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:-translate-x-2 transition" />
                Back to Blogs
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default Blogid;
