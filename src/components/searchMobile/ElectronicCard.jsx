import React from 'react';
import { FaStar } from 'react-icons/fa';

const ElectronicCard = () => {
  return (
    <div className="flex flex-col  gap-4  p-4 rounded-md  w-full border-b"
      style={{ borderBottomColor: '#f0f0f0' }}
    >
      <div className='flex-row flex gap-4   rounded-md  w-full' >
        {/* Image */}
        <div className="w-1/2 md:w-1/4 flex rounded-sm">
          <img
            src="/assets/images/collection/sub-collection1.jpg"
            alt="Samsung Galaxy F36 5G"
            loading="lazy"
            className="sm:h-48 h-30 object-cover rounded-sm"
          />
        </div>
        {/* Info */}
        <div className="flex flex-col  md:flex-row justify-between w-full md:items-start">
          <div className="flex-1 space-y-1">
            <p className="text-xs text-gray-500">Sponsored</p>
            <h2 className="text-[#143741] sm:text-lg text-sm font-semibold hover:underline">
              Samsung Galaxy F36 5G (Violet, 128 GB)
            </h2>
            <div className="flex flex-row  sm:items-center gap-1 text-green-600 font-semibold">
              <span className="bg-green-500 text-white  text-xs px-1 rounded-sm flex items-center gap-1">
                4.5 <FaStar className="text-white text-[10px]" />
              </span>
              <span className="text-sm text-gray-600">80 Ratings & Reviews</span>
            </div>
            <ul className="text-sm hidden sm:block text-gray-700 list-disc ml-4 space-y-0.5">
              <li>6 GB RAM | 128 GB ROM | Expandable Upto 2 TB</li>
              <li>17.02 cm (6.7 inch) Full HD+ Display</li>
              <li>50MP + 8MP + 2MP | 13MP Front Camera</li>
              <li>5000 mAh Battery</li>
              <li>Samsung Exynos 1380 Processor</li>
              <li>
                1 Year Manufacturer Warranty for Device and 6 Months for In-Box Accessories
              </li>
            </ul>
          </div>
          {/* Price Section */}
          <div className="sm:text-right gap-2 md:mt-0 md:min-w-[120px]">
            <div className='sm:flex-none flex sm:text-right flex-row sm:gap-0 gap-2 sm:flex-col sm:items-end items-center' >
              <div className="text-xl font-bold text-gray-800">₹17,499</div>
              <div className="line-through text-gray-400 text-sm">₹22,999</div>
              <div className="text-green-600 text-sm font-medium">23% off</div>
            </div>
            <div className="text-sm mt-1">
              Upto <span className="font-semibold">₹16,950</span> Off on Exchange
            </div>
            <div className="text-blue-600 sm:text-sm text-xs font-semibold cursor-pointer">
              Bank Offer
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-row flex-wrap gap-2 sm:hidden ' >
        <div className='border border-gray-300 text-sm w-fit px-2 py-1 rounded-sm'  >
          <span>6GB RAM | 128 GB Storage</span>
        </div>
        <div className='border border-gray-300 text-sm w-fit px-2 py-1 rounded-sm'  >
          <span>5110 mAh</span>
        </div>
        <div className='border border-gray-300 text-sm w-fit px-2 py-1 rounded-sm' >
          <span>6GB RAM</span>
        </div>
        <div className='border border-gray-300 text-sm w-fit px-2 py-1 rounded-sm' >
          <span>6GB RAM | 128 GB Storage</span>
        </div>
        <div className='border border-gray-300 text-sm w-fit px-2 py-1 rounded-sm' >
          <span>6GB RAM </span>
        </div>
      </div>
    </div>
  );
};

export default ElectronicCard;
