import React from "react";

const SortFilter = () => {
  return (
    <div>
      <div className="text-sm text-gray-800 mb-4">
        <p className="mb-2">
          <span className="font-medium">Showing</span> 1 – 24 of{" "}
          <span className="font-medium">11,619</span> results for "
          <span className="font-medium">mobiles</span>"
        </p>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">Sort By</span>
          <div className="flex gap-4 text-sm">
            <button className="text-blue-600 font-medium border-b-2 border-blue-600 pb-0.5">
              Relevance
            </button>
            <button className="hover:text-blue-600">Popularity</button>
            <button className="hover:text-blue-600">
              Price -- Low to High
            </button>
            <button className="hover:text-blue-600">
              Price -- High to Low
            </button>
            <button className="hover:text-blue-600">Newest First</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortFilter;
