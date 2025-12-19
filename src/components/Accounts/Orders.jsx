"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FaSearch, FaFilter, FaCopy, FaCheck } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { TextField, CircularProgress, Chip, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getOrderbyClId, resetClientOrder } from "@/redux/order/OrderSlice";
import EmptyState from "./order/EmptyState";
import OrderCard from "./order/OrderCard";
import useInfiniteScroll from "@/hooks/useInfiniteScroll"; 
import OrderSkeleton from "./order/OrderSkeleton.jsx";

const ITEMS_PER_PAGE = 10;

export default function Orders() {
  const router = useRouter();
  const dispatch = useDispatch();

  // State
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  // Redux
  const { loginData } = useSelector((store) => store.Athentication);
  const { clientOrder, isordersLoading } = useSelector((store) => store.order);

  // Orders from Redux state
  const orders = clientOrder?.order || [];
  const totalOrders = clientOrder?.totalOrders || 0;
  const hasMoreRedux = clientOrder?.hasMore || false;

  // Constants
  const orderStatuses = ["Order Recieved", "Packed Order", "Dispatch Order", "Out For Delivery", "Order Delivered", "Order Cancelled"];
  const orderTimePeriods = ["Last 30 days", "Last 3 months", "This year", "Last year", "Older"];

  // Infinite Scroll Hook
  const [isFetching, setIsFetching] = useInfiniteScroll(() => {
    if (!isordersLoading && hasMoreRedux && !searchQuery.trim()) {
      setPage(prev => prev + 1);
    }
  }, 400);

  // Copy Order ID function
  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2000); // Reset after 2 seconds
  };

  // Fetch Orders
  const fetchOrders = useCallback(() => {
    if (!loginData?._id) return;

    const filters = {
      page,
      limit: ITEMS_PER_PAGE,
      ...(selectedStatuses.length > 0 && { status: selectedStatuses }),
      ...(selectedTimes.length > 0 && { timePeriod: selectedTimes }),
    };

    dispatch(getOrderbyClId({ clientid: loginData._id, filters }));
  }, [loginData?._id, dispatch, page, selectedStatuses, selectedTimes]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Sync local hasMore with Redux
  useEffect(() => {
    setHasMore(hasMoreRedux);
  }, [hasMoreRedux]);

  // Reset on filter/search change
  useEffect(() => {
    setPage(1);
    dispatch(resetClientOrder()); // Clear Redux state
    setHasMore(true);
  }, [selectedStatuses, selectedTimes, searchQuery, dispatch]);

  // Client-side search
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;

    const query = searchQuery.toLowerCase();
    return orders.filter(order =>
      order._id?.toLowerCase().includes(query) ||
      order.ProductName?.toLowerCase().includes(query) ||
      order.OrderStatusText?.toLowerCase().includes(query) ||
      order.shopName?.toLowerCase().includes(query)
    );
  }, [orders, searchQuery]);

  // Handlers
  const handleClearFilters = () => {
    setSelectedStatuses([]);
    setSelectedTimes([]);
    setSearchQuery("");
  };

  const showLoading = isordersLoading && page === 1;

  if (showLoading) {
    return (
      <div className="px-4 py-6 w-full min-h-[70vh] max-w-6xl mx-auto space-y-4">
        <OrderSkeleton />
        <OrderSkeleton />
        <OrderSkeleton />
        <OrderSkeleton />
        <OrderSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 w-full min-h-[70vh] max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <IoIosArrowRoundBack size={30} className="cursor-pointer md:hidden" onClick={() => router.back()} />
          <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
          {totalOrders > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              ({totalOrders} total orders)
            </span>
          )}
        </div>

        <div className="w-full md:w-1/3 relative">
          <TextField
            size="small"
            fullWidth
            placeholder="Search by order ID, product name, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <FaSearch className="mr-2 text-gray-500" /> }}
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-4 border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            Filter Orders
          </h2>
          <div className="flex gap-2">
            {(selectedStatuses.length > 0 || selectedTimes.length > 0 || searchQuery) && (
              <button onClick={handleClearFilters} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition">
                Clear All
              </button>
            )}
            <button onClick={() => setShowFilters(!showFilters)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <FormControl fullWidth size="small">
              <InputLabel>Order Status</InputLabel>
              <Select multiple value={selectedStatuses} onChange={(e) => setSelectedStatuses(e.target.value)} label="Order Status" renderValue={(selected) => selected.join(', ')}>
                {orderStatuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Time Period</InputLabel>
              <Select multiple value={selectedTimes} onChange={(e) => setSelectedTimes(e.target.value)} label="Time Period" renderValue={(selected) => selected.join(', ')}>
                {orderTimePeriods.map((period) => <MenuItem key={period} value={period}>{period}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
        )}

        {(selectedStatuses.length > 0 || selectedTimes.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedStatuses.map((status) => (
              <Chip key={status} label={status} onDelete={() => setSelectedStatuses(prev => prev.filter(s => s !== status))} size="small" color="primary" variant="outlined" />
            ))}
            {selectedTimes.map((time) => (
              <Chip key={time} label={time} onDelete={() => setSelectedTimes(prev => prev.filter(t => t !== time))} size="small" color="secondary" variant="outlined" />
            ))}
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        {searchQuery ? (
          <>Showing {filteredOrders.length} orders (search results)</>
        ) : (
          <>{orders.length} of {totalOrders} orders loaded{(selectedStatuses.length > 0 || selectedTimes.length > 0) && " (filtered)"}</>
        )}
      </div>

      {/* Order List */}
      <div className="space-y-4 mb-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className="relative">
              <OrderCard
                order={order}
                onClick={() => router.push(`/accounts/orders/${order._id}`)}
                onReviewClick={() => router.push(`/accounts/review/${order._id}`)}
              />
              {/* Copy Button positioned on the OrderCard */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering card click
                  copyOrderId(order._id);
                }}
                className="absolute top-4 left-4 p-2 bg-white border rounded-md shadow-sm hover:bg-gray-50 transition flex items-center gap-1"
                title="Copy Order ID"
              >
                {copiedOrderId === order._id ? (
                  <>
                    <FaCheck className="text-green-600 text-sm" />
                    <span className="text-xs text-green-600">Copied!</span>
                  </>
                ) : (
                  <FaCopy className="text-gray-500 hover:text-gray-700 text-sm" />
                )}
              </button>
            </div>
          ))
        ) : (
          <EmptyState
            title="No orders found"
            description={selectedStatuses.length > 0 || selectedTimes.length > 0 || searchQuery ? "Try adjusting your filters or search query" : "You haven't placed any orders yet"}
            action={(selectedStatuses.length > 0 || selectedTimes.length > 0 || searchQuery) && (
              <button onClick={handleClearFilters} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Clear all filters
              </button>
            )}
          />
        )}

        {/* Loading more spinner */}
        {isordersLoading && page > 1 && (
          <div className="flex justify-center py-8">
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </div>
        )}

        {/* No more data */}
        {!hasMore && orders.length > 0 && !isordersLoading && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Yay! You've reached the end
          </div>
        )}
      </div>
    </div>
  );
}