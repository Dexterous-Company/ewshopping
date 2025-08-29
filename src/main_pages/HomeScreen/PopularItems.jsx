import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const PopularItems = () => {
  const { sliders } = useSelector((store) => store.threeSlider);
  // Take only the first 3 items from the sliders array
  const popularItems = sliders.slice(0, 3);

  return (
    <section className="hidden lg:block overflow-hidden">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Item (Women) - Takes full height on the left */}
            <div>
              <div className="relative">
                <Link
                  href={`/${popularItems[0]?.slugUrl || "#"}`}
                  className="block transform transition duration-300 hover:scale-105"
                >
                  <div className="w-full">
                    <img
                      className="w-full rounded"
                      src={
                        popularItems[0]?.desktopImage ||
                        "assets/images/collection/demo1-ct-img1.jpg"
                      }
                      alt={popularItems[0]?.name || "Women Wear"}
                      title={popularItems[0]?.name || "Women Wear"}
                    />
                  </div>
                  <div className="absolute top-1/2 right-30 flex flex-col gap-2">
                    <h3 className="text-3xl font-semibold">
                      {popularItems[0]?.name || "Women Wear"}
                    </h3>
                    <p className="text-gray-600 text-xl">
                      {popularItems[0]?.text || "Trending Now"}
                    </p>
                    <button className="inline-block border border-gray-400 text-gray-700 px-4 py-3 text-sm rounded bg-[#40516d] text-white">
                      Shop Now
                    </button>
                  </div>
                </Link>
              </div>
            </div>

            {/* Second and Third Items (Men and Kids) - Stacked on the right */}
            <div className="space-y-3">
              {/* Second Item (Men) */}
              <div className="relative">
                <Link
                  href={`/${popularItems[1]?.slugUrl || "#"}`}
                  className="block transform transition duration-300 hover:scale-105"
                >
                  <div className="w-full">
                    <img
                      className="w-full rounded"
                      src={
                        popularItems[1]?.desktopImage ||
                        "assets/images/collection/demo1-ct-img2.jpg"
                      }
                      alt={popularItems[1]?.name || "Mens Wear"}
                      title={popularItems[1]?.name || "Mens Wear"}
                    />
                  </div>
                  <div className="absolute top-1/2 left-10 right-10 text-left pl-3 flex flex-col gap-2">
                    <div>
                      <h3 className="text-3xl font-semibold">
                        {popularItems[1]?.name || "Mens Wear"}
                      </h3>
                      <p className="text-gray-600 text-xl">
                        {popularItems[1]?.text || "Tailor-made with passion"}
                      </p>
                      <button className="inline-block border border-gray-400 text-gray-700 px-4 py-3 text-sm rounded bg-[#40516d] text-white">
                        Shop Now
                      </button>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Third Item (Kids) */}
              <div className="relative">
                <Link
                  href={`/${popularItems[2]?.slugUrl || "#"}`}
                  className="block transform transition duration-300 hover:scale-105"
                >
                  <div className="w-full">
                    <img
                      className="w-full rounded"
                      src={
                        popularItems[2]?.desktopImage ||
                        "assets/images/collection/demo1-ct-img3.jpg"
                      }
                      alt={popularItems[2]?.name || "Kids Wear"}
                      title={popularItems[2]?.name || "Kids Wear"}
                    />
                  </div>
                  <div className="absolute top-1/2 right-12 -translate-y-1/2 text-right pr-3 flex flex-col gap-2">
                    <p className="text-gray-600">Buy one get one free</p>
                    <h3 className="text-3xl font-semibold">
                      {popularItems[2]?.name || "Kids Wear"}
                    </h3>
                    <button className="inline-block border border-gray-400 text-gray-700 px-4 py-3 text-sm rounded bg-[#40516d] text-white">
                      Shop Now
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularItems;
