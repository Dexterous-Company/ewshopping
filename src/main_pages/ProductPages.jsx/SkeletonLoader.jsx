
const SkeletonLoader = () => {
  return (
    <div className="flex flex-col lg:flex-row w-full mx-auto p-3 pt-10 gap-6 animate-pulse">
      <div className="w-full lg:w-1/2 space-y-4">
        <div className="bg-gray-200 h-96 rounded-lg"></div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-200 h-20 w-20 rounded"></div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 space-y-4">
        <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
        <div className="bg-gray-200 h-6 w-1/2 rounded"></div>
        <div className="bg-gray-200 h-4 w-full rounded"></div>
        <div className="bg-gray-200 h-4 w-5/6 rounded"></div>
        <div className="bg-gray-200 h-4 w-4/6 rounded"></div>
        <div className="bg-gray-200 h-10 w-1/3 rounded mt-6"></div>
        <div className="flex gap-2 mt-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-200 h-8 w-8 rounded-full"></div>
          ))}
        </div>
        <div className="bg-gray-200 h-12 w-full rounded mt-8"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;