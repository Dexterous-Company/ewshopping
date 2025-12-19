import React from "react";

const CareerComponent = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Background Image */}
      <div className="md:block hidden">
        <div
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765945604932.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        ></div>
      </div>
      <div className="md:hidden block">
        <div
          className="w-full h-40 sm:h-64 bg-no-repeat bg-center"
          style={{
            backgroundImage:
              "url('https://ewshoppingsellerapinew.dexterous.in/uploads/1765945655778.webp')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="py-4 px-0 lg:px-2 xl:px-2">        {/* 8 → 6 */}
        <div className="md:mx-20 mx-3 lg:mx-4 xl:mx-8">
          <h1 className="text-xl md:text-3xl font-bold mb-2 text-left">
            Career at EW Shopping
          </h1>
          <p className="text-lg md:text-xl mb-4 text-left">
            Join the Future of Online Shopping
          </p>
          <p className="text-[14px] md:text-lg text-gray-600 text-left">
            Here in <b>EW Shopping</b>, every idea, every effort, and every team
            member plays a key role in reshaping India's next big e-commerce
            company story! We are not just another online shopping store - we
            are here to create a smarter, faster, and more rewarding way to shop
            in India.
          </p>
        </div>
      </section>

      {/* Quote */}
      <section className="py-3 px-2 lg:px-2 xl:px-2">        {/* 4 → 3 */}
        <div className="md:mx-20 mx-3 lg:mx-4 xl:mx-8">
          <blockquote className="text-lg md:text-xl italic text-left">
            "Become a part of a growing team that believes in Innovation,
            customer satisfaction, and career growth"
          </blockquote>
        </div>
      </section>

      {/* About Section */}
      <section className="py-6 px-2 lg:px-2 xl:px-2">        {/* 8 → 6 */}
        <div className="max-w-7xl mx-auto lg:mx-4 xl:mx-8">
          <h2 className="text-3xl font-bold mb-6 text-left">
            About EW Shopping
          </h2>
          <div className="space-y-6">                          {/* 8 → 6 */}
            <div>
              <p className="text-lg text-gray-600 mb-6 text-left">
                Started with a vision to make online shopping in India more
                affordable, reliable, and exciting. EW Shopping is redefining
                how India shops for everything from gadgets to fashion, home
                decor to beauty.
              </p>
              <p className="text-lg text-gray-600 text-left">
                Our platform connects customers with reputable brands, giving
                them premium products and secure deliveries – supported by a
                strong team that makes it possible every day.
              </p>
            </div>
            <div className="bg-blue-50  rounded-lg max-w-2xl">
              <h3 className="text-xl font-semibold mb-4 text-black-700 ">
                Our Strength
              </h3>
              <p className="text-lg text-gray-600">
                Our biggest strength is our people, who thrive on creativity and
                customer satisfaction at every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Life at EW Shopping */}
      <section className="py-6 px-2 bg-gray-50 lg:px-2 xl:px-2">   {/* 8 → 6 */}
        <div className="max-w-7xl mx-auto lg:mx-4 xl:mx-8">
          <h2 className="text-3xl font-bold mb-6 text-left">
            Life at EW Shopping
          </h2>
          <div className="space-y-6">                                {/* 8 → 6 */}
            <div>
              <p className="text-lg text-gray-600 mb-3 text-left">
                In EW Shopping, besides work, you grow, learn and create an
                impact. Culture here is built on collaboration, creativity, and
                diversity. We welcome new ideas, individual perspectives, and
                believe in constant improvement.
              </p>
              <div className="bg-white p-0 rounded-lg shadow-sm max-w-3xl">
                <h3 className="text-xl font-semibold mb-3 text-black">
                  Here's what makes EW Shopping a great place to work:
                </h3>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    
                    <span className="text-gray-600">
                      A fun, supportive, and energetic team environment
                    </span>
                  </li>
                  <li className="flex items-start">
                    
                    <span className="text-gray-600">
                      Freedom to create and take full control over your ideas
                    </span>
                  </li>
                  <li className="flex items-start">
                    
                    <span className="text-gray-600">
                      Exciting opportunities to work with professionals in the
                      e-commerce domain
                    </span>
                  </li>
                  <li className="flex items-start">
                    
                    <span className="text-gray-600">
                      A culture where results and innovation get rewarded
                    </span>
                  </li>
                  <li className="flex items-start">
                    
                    <span className="text-gray-600">
                      Outside team activities, celebrations, and team projects
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-0 rounded-lg shadow-sm max-w-2xl">
              <blockquote className="text-lg italic text-gray-700 mb-3">
                "Every project I've worked on here feels like something bigger.
                At EW Shopping, it's not a job, but it's a journey to excellence
                and success"
              </blockquote>
              <p className="font-semibold text-black">
                - Ayushi Pal, Designer team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-5 px-2 lg:px-2 xl:px-2 mb-0">        {/* 10 → 7 */}
        <div className="max-w-7xl mx-auto lg:mx-4 xl:mx-8  ">
          <h2 className="text-3xl font-bold mb-4 text-left">
            Why work with us
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mb-8 text-left">   {/* 12 → 8 */}
            At EW Shopping, your ideas matter, and your expertise matters more!
            We provide a work environment where ambition meets opportunity.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h3 className="text-xl font-semibold mb-3 text-black">
                Competitive salary and occasional bonus
              </h3>
              <p className="text-gray-600">
                We offer attractive compensation packages that reward performance and dedication.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h3 className="text-xl font-semibold mb-3 text-black">
                Work-life balance with flexibility
              </h3>
              <p className="text-gray-600">
                We understand the importance of balancing professional and personal life.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h3 className="text-xl font-semibold mb-3 text-black">
                Employee discounts on all products
              </h3>
              <p className="text-gray-600">
                Enjoy special discounts on all products available on our platform.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h3 className="text-xl font-semibold mb-3 text-black">
                Training and skill development
              </h3>
              <p className="text-gray-600">
                Continuous learning opportunities to enhance your skills and career.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h3 className="text-xl font-semibold mb-3 text-black">
                Growth opportunity at every level
              </h3>
              <p className="text-gray-600">
                Clear career progression paths and recognition for your contributions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h3 className="text-xl font-semibold mb-3 text-black">
                Open and diverse work culture
              </h3>
              <p className="text-gray-600">
                An inclusive environment where diverse perspectives are valued.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-7 px-2 bg-gray-50 lg:px-2 xl:px-2 mt-0 ">    {/* 10 → 7 */}
        <div className="max-w-7xl mx-auto lg:mx-4 xl:mx-8">
          <h2 className="text-3xl font-bold mb-4 text-left">
            Current Openings
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mb-6 text-left">   {/* 8 → 6 */}
            We're always on the lookout for passionate individuals ready to make
            a difference. Want to grow and become a part of a dynamic team? Then
            apply accordingly
          </p>

          <div className="text-left">
            <p className="text-gray-600">
              Or you can send your CV to{" "}
              <a
                href="mailto:info@ewshopping.com"
                className="text-blue-600 hover:underline font-medium"
              >
                info@ewshopping.com
              </a>{" "}
              and we'll reach out.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareerComponent;