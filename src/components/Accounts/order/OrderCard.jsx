import React from "react";
import { FaStar, FaAngleRight } from "react-icons/fa";

export function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
const OrderCard = ({ order, onClick, onReviewClick }) => {
  const statusColors = {
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    "Order Recieved": "bg-blue-100 text-blue-800",
    "Dispatch Order": "bg-yellow-100 text-yellow-800",
    "Out for Delivery": "bg-purple-100 text-purple-800",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Order Image */}
        <div className="flex-shrink-0">
          <img
            src={order.thumbnail || "/placeholder-product.png"}
            className="h-20 w-20 object-cover rounded-md"
            alt={order.ProductName}
            loading="lazy"
            onError={(e) => {
              e.target.src = "/placeholder-product.png";
            }}
          />
        </div>

        {/* Order Details */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              {/* <h3 className="font-medium text-gray-900">{order.ProductName}</h3> */}
              <h3
                className="font-medium text-gray-900"
                title={order.ProductName}
              >
                {order.ProductName?.length > 80
                  ? order.ProductName.slice(0, 80) + "..."
                  : order.ProductName}
              </h3>

              <p className="text-sm text-gray-500">Order #: {order._id}</p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                statusColors[order.OrderStatusText]
              }`}
            >
              {order.OrderStatusText}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="font-semibold">₹{order.Price}</span>
            {order.Mrp > order.Price && (
              <>
                <span className="line-through text-gray-400">₹{order.Mrp}</span>
                <span className="text-green-600">
                  {Math.round(((order.Mrp - order.Price) / order.Mrp) * 100)}%
                  off
                </span>
              </>
            )}
            <span>Qty: {order.ProductCount}</span>

            <span>
              Placed on: {formatDate(order.OrderprocessDate.OrderBookedDate)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center">
          {order.OrderStatusText === "Delivered" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReviewClick();
              }}
              className="hidden md:flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <FaStar className="text-yellow-400" />
              Rate Product
            </button>
          )}
          <FaAngleRight className="ml-2 text-gray-400" />
        </div>
      </div>

      {/* Mobile Review Button */}
      {order.OrderStatusText === "Delivered" && (
        <div className="mt-3 md:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReviewClick();
            }}
            className="w-full py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            Write a Review
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
