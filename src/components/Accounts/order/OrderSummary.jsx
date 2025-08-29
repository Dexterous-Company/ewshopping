import React from 'react';
import { FaBoxesPacking, FaBoxesStacked } from 'react-icons/fa6';
import { LuBoxes } from 'react-icons/lu';

const OrderSummary = ({ totalOrders, completedOrders, cancelledOrders }) => {
  const summaryItems = [
    {
      name: "Total Orders",
      count: totalOrders,
      icon: <FaBoxesStacked className="text-blue-500" />,
      bgColor: "bg-blue-50"
    },
    {
      name: "Completed",
      count: completedOrders,
      icon: <LuBoxes className="text-green-500" />,
      bgColor: "bg-green-50"
    },
    {
      name: "Cancelled",
      count: cancelledOrders,
      icon: <FaBoxesPacking className="text-red-500" />,
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {summaryItems.map((item) => (
        <div
          key={item.name}
          className={`${item.bgColor} p-4 rounded-lg shadow-sm flex items-center`}
        >
          <div className="p-3 rounded-full bg-white mr-4">
            {item.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{item.name}</p>
            <p className="text-2xl font-semibold">{item.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSummary;