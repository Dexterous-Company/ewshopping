"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { signin } from "../redux/athentication/Athentication";
import {
  newOrder,
  getOrderbyClId,
  getTotalOrderByClId,
  clearOrder,
  setcurrentOrder,
} from "../redux/order/OrderSlice";

const OrderPage = () => {
  const dispatch = useDispatch();
  const {
    clientOrder,
    totalClientOrder,
    currentOrder,
    paymentUpdateOrder,
    ordersLoading,
    isordersLoading,
  } = useSelector((state) => state.order);
  const { isAuth, loginData } = useSelector((state) => state.Athentication);

  // Sample form state
  const orderFormData = {
    clientId: loginData?._id || "",
    items: [
      {
        productId: "sample-product-id",
        quantity: 2,
        price: 19.99,
      },
    ],
    totalAmount: 39.98,
    paymentStatus: "pending",
  };

  useEffect(() => {
    if (isAuth && loginData?._id) {
      dispatch(getOrderbyClId(loginData._id));
      dispatch(getTotalOrderByClId(loginData._id));
    }
  }, [isAuth, loginData?._id, dispatch]);

  const handleCreateOrder = () => {
    dispatch(newOrder(orderFormData));
  };

  const handleClearOrders = () => {
    dispatch(clearOrder());
  };

  const handleSelectOrder = (order) => {
    dispatch(setcurrentOrder(order));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="mt-2 text-lg text-gray-600">
            View and manage your orders
          </p>
        </div>
        {!isAuth ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Please sign in to view orders
            </h2>
            <button
              onClick={() =>
                dispatch(signin({ isAuth: true, _id: "sample-user-id" }))
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Sign In (Demo)
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Order Summary Card */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders:</span>
                    <span className="font-medium">
                      {totalClientOrder.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recent Orders:</span>
                    <span className="font-medium">{clientOrder.length}</span>
                  </div>
                </div>
                <button
                  onClick={handleCreateOrder}
                  disabled={ordersLoading}
                  className={`mt-4 w-full px-4 py-2 rounded-md ${
                    ordersLoading
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white transition`}
                >
                  {ordersLoading ? "Creating..." : "Create New Order"}
                </button>
              </div>

              {/* Current Order Card */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Current Order
                </h2>
                {currentOrder ? (
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">ID:</span>{" "}
                      {currentOrder._id}
                    </p>
                    <p>
                      <span className="text-gray-600">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          currentOrder.paymentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {currentOrder.paymentStatus}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Amount:</span> $
                      {currentOrder.totalAmount}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No order selected</p>
                )}
                <button
                  onClick={handleClearOrders}
                  className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Clear Orders
                </button>
              </div>

              {/* Payment Status Card */}
              {paymentUpdateOrder && (
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Payment Update
                  </h2>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Order ID:</span>{" "}
                      {paymentUpdateOrder._id}
                    </p>
                    <p>
                      <span className="text-gray-600">Status:</span>{" "}
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {paymentUpdateOrder.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Recent Orders
                </h2>
              </div>
              {isordersLoading ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : clientOrder.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clientOrder.map((order) => (
                        <tr key={order._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order._id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${order.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                order.paymentStatus === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleSelectOrder(order)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No orders found</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
