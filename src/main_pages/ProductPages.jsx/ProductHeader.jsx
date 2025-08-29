import React from "react";

const ProductHeader = () => {
  return (
    <div>
      <div className="bg-[#f5f5f5] py-5 ">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-800">
            <a
              href="index.html"
              className="uppercase hover:underline font_new_style_for"
            >
              Home
            </a>
            <span className="text-gray-600">›</span>
            <span className="font-bold uppercase text-black text-sm font_new_style_for">
              Product Layout1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
