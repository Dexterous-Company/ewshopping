import React from "react";

const CategoryLoader = () => {
  return (
    <div className="flex overflow-x-auto gap-4 px-4 py-3 animate-pulse">
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 w-24 h-28 rounded-md bg-gray-200"
        >
          <div className="w-full h-20 bg-gray-300 rounded-t-md" />
          <div className="h-4 w-3/4 mt-2 mx-auto bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
};

export default CategoryLoader;
