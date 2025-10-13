"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { TextField, CircularProgress, Pagination, Chip } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getOrderbyClId, getTotalOrderByClId } from "@/redux/order/OrderSlice";
import EmptyState from "./order/EmptyState";
import OrderCard from "./order/OrderCard";
import OrderFilters from "./order/OrderFilters";

const ITEMS_PER_PAGE = 5;

export default function Orders() {
  const router = useRouter();
  const dispatch = useDispatch();

  // State
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Redux state
  const { loginData } = useSelector((store) => store.Athentication);
  const { clientOrder, isordersLoading, totalClientOrder } = useSelector(
    (store) => store.order
  );

  // Constants
  const orderStatuses = [
    "Order Cancelled",
    "Packed Order",
    "Out For Delivery",
    "Order Delivered",
    "Dispatch Order",
    "Order Recieved",
  ];

  const orderTimePeriods = [
    "Last 30 days",
    "Last 3 months",
    "This year",
    "Last year",
    "Older",
  ];

  // Fetch orders on mount and when client ID changes
  useEffect(() => {
    if (loginData?._id) {
      dispatch(getOrderbyClId(loginData._id));
      dispatch(getTotalOrderByClId(loginData._id));
    }
  }, [loginData?._id, dispatch]);

  // Filter and paginate orders
  const { filteredOrders, totalPages } = useMemo(() => {
    let result = clientOrder?.order || [];
    const now = new Date();

    const currentYear = now.getFullYear();

    // Apply status filters
    if (selectedStatuses.length > 0) {
      result = result.filter((order) =>
        selectedStatuses.includes(order.OrderStatusText)
      );
    }
    // Apply time period filters
    if (selectedTimes.length > 0) {
      result = result.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const now = new Date();

        return selectedTimes.some((time) => {
          switch (time) {
            case "Last 30 days":
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(now.getDate() - 30);
              // orderDate >= thirtyDaysAgo && orderDate <= now;
              return orderDate <= now;
            case "Last 3 months":
              const threeMonthsAgo = new Date();
              threeMonthsAgo.setMonth(now.getMonth() - 3);
              return orderDate >= threeMonthsAgo && orderDate <= now;
            case "This year":
              return orderDate.getFullYear() === now.getFullYear();
            case "Last year":
              return orderDate.getFullYear() === now.getFullYear() - 1;
            case "Older":
              const oneYearAgo = new Date();
              oneYearAgo.setFullYear(now.getFullYear() - 1);
              return orderDate < oneYearAgo;
            default:
              return true;
          }
        });
      });
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(query) ||
          order.ProductName.toLowerCase().includes(query) ||
          order.OrderStatusText.toLowerCase().includes(query)
      );
    }

    // Pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedResult = result.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
    const totalPages = Math.ceil(result.length / ITEMS_PER_PAGE);

    return {
      filteredOrders: paginatedResult,
      totalPages,
      totalResults: result.length,
    };
  }, [clientOrder, selectedStatuses, selectedTimes, searchQuery, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatuses, selectedTimes, searchQuery]);

  // Handlers
  const handleStatusChange = useCallback((e) => {
    setSelectedStatuses(e.target.value);
  }, []);

  const handleTimePeriodChange = useCallback((e) => {
    setSelectedTimes(e.target.value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSelectedTimes([]);
    setSearchQuery("");
  }, []);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Loading state
  if (isordersLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 w-full min-h-[70vh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <IoIosArrowRoundBack
            size={30}
            className="cursor-pointer md:hidden"
            onClick={() => router.back()}
          />
          <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
        </div>

        <div className="w-full md:w-1/3 relative">
          <TextField
            size="small"
            fullWidth
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <FaSearch className="mr-2 text-gray-500" />,
            }}
          />
        </div>
      </div>

      {/* Order Summary */}
      {/* <OrderSummary 
        totalOrders={totalClientOrder?.order?.length || 0}
        completedOrders={(clientOrder?.order || []).filter(
          order => order.OrderStatusText === "Delivered"
        ).length}
        cancelledOrders={(clientOrder?.order || []).filter(
          order => order.OrderStatusText === "Cancelled"
        ).length}
      /> */}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-700">Filter Orders</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <OrderFilters
            selectedStatuses={selectedStatuses}
            selectedTimes={selectedTimes}
            orderStatuses={orderStatuses}
            orderTimePeriods={orderTimePeriods}
            onStatusChange={handleStatusChange}
            onTimePeriodChange={handleTimePeriodChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Active filter chips */}
        {(selectedStatuses.length > 0 || selectedTimes.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedStatuses.map((status) => (
              <Chip
                key={status}
                label={status}
                onDelete={() =>
                  setSelectedStatuses((prev) =>
                    prev.filter((s) => s !== status)
                  )
                }
                size="small"
              />
            ))}
            {selectedTimes.map((time) => (
              <Chip
                key={time}
                label={time}
                onDelete={() =>
                  setSelectedTimes((prev) => prev.filter((t) => t !== time))
                }
                size="small"
              />
            ))}
          </div>
        )}
      </div>

      {/* Order List */}
      <div className="space-y-4 mb-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onClick={() => router.push(`/accounts/orders/${order._id}`)}
              onReviewClick={() => router.push(`/accounts/review/${order._id}`)}
            />
          ))
        ) : (
          <EmptyState
            title="No orders found"
            description={
              selectedStatuses.length > 0 ||
              selectedTimes.length > 0 ||
              searchQuery
                ? "Try adjusting your filters or search query"
                : "You haven't placed any orders yet"
            }
            action={
              (selectedStatuses.length > 0 ||
                selectedTimes.length > 0 ||
                searchQuery) && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Clear all filters
                </button>
              )
            }
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </div>
      )}
    </div>
  );
}
