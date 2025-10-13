"use client";
import {
  CheckCircle,
  ChevronRight,
  FileDownload,
  LocationOn,
  Person,
} from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { jsPDF } from "jspdf";
const Baseurl = process.env.NEXT_PUBLIC_API_URL;
import { useParams } from "next/navigation";

const OrderDetails = () => {
  const router = useRouter();
  const { id } = useParams();

  const orderID = id;
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState({ type: null, index: null });

  useEffect(() => {
    if (!orderID) return;
    const fetchOrderDetails = async () => {
      try {
        const config = {
          headers: { "Content-Type": "application/json" },
        };
        const url = `${Baseurl}/api/v1/order/${orderID}`;
        const response = await axios.get(url, config);
        setOrderData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderID]);

  const generateInvoice = () => {
    if (!orderData) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = 20;

      // Simple color scheme
      const primaryColor = [79, 70, 229];
      const textColor = [55, 65, 81];

      // Header with logo
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 80, "F");

      // Add logo image
      const logoUrl = "/largelogo.png"; // Update this path if needed

      // You can add the logo in two ways:

      // Option 1: If you have the logo as base64 or URL
      // doc.addImage(logoUrl, 'PNG', margin, 15, 40, 40);

      // Option 2: Text-based logo (more reliable)
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("EWSHOPPING", pageWidth / 2, 40, { align: "center" });

      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.text("INVOICE", pageWidth / 2, 50, { align: "center" });

      // If you want to use an actual image, you'll need to handle it like this:
      // First, you need to convert the image to base64 or have it as a data URL
      // Here's a function to help with that:

      // Invoice details
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(
        `Invoice #: ${orderData?._id?.slice(-8) || "NA"}`,
        pageWidth - margin,
        25,
        { align: "right" }
      );
      doc.text(
        `Date: ${
          formatDate(orderData?.OrderBookedDate) || formatDate(new Date())
        }`,
        pageWidth - margin,
        32,
        { align: "right" }
      );

      // Reset to normal text
      doc.setFont("helvetica", "normal");
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      // Company Info
      yPos = 90;
      doc.setFontSize(10);
      doc.text("EWSHOPPING", margin, yPos);
      doc.text("Rajendra Place, New Delhi - 110008", margin, yPos + 5);
      doc.text("info@ewshopping.com | +91 8447282606", margin, yPos + 10);

      // Rest of the invoice content remains the same...
      // Customer Info
      yPos += 25;
      doc.setFont("helvetica", "bold");
      doc.text("BILL TO:", margin, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(orderData?.UserName || "-", margin, yPos + 6);

      const addressText = orderData?.Address || "-";
      const addressLines = doc.splitTextToSize(addressText, 80);
      addressLines.forEach((line, index) => {
        doc.text(line, margin, yPos + 12 + index * 5);
      });

      // Product Table
      yPos += addressLines.length * 5 + 20;

      // Table Header
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - margin * 2, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.text("Item", margin + 5, yPos + 7);
      doc.text("Price (INR)", 120, yPos + 7);
      doc.text("Qty", 160, yPos + 7);
      doc.text("Total (INR)", pageWidth - margin - 5, yPos + 7, {
        align: "right",
      });

      // Product Row
      yPos += 12;
      const qty = orderData?.cart_Quentity || 1;
      const price = orderData?.Price || 0;

      doc.setFont("helvetica", "normal");
      const productName = orderData?.ProductName || "Product";
      const productLines = doc.splitTextToSize(productName, 60);

      productLines.forEach((line, index) => {
        doc.text(line, margin + 5, yPos + 5 + index * 5);
      });

      const productHeight = Math.max(productLines.length * 5, 8);

      // Use numbers without symbol to avoid encoding issues
      doc.text(`${price.toLocaleString()}`, 120, yPos + 5);
      doc.text(qty.toString(), 160, yPos + 5);
      doc.text(
        `${(price * qty).toLocaleString()}`,
        pageWidth - margin - 5,
        yPos + 5,
        { align: "right" }
      );

      // Summary
      yPos += productHeight + 20;
      const summaryX = pageWidth - 80;

      doc.text("Subtotal:", summaryX, yPos);
      doc.text(
        `${orderData?.TotalPrice?.toLocaleString() || "0"}`,
        pageWidth - margin - 5,
        yPos,
        { align: "right" }
      );

      yPos += 8;
      doc.text("Delivery Charge:", summaryX, yPos);
      doc.text(
        `${orderData?.DeliveryCharge?.toLocaleString() || "0"}`,
        pageWidth - margin - 5,
        yPos,
        { align: "right" }
      );

      yPos += 8;
      doc.text("Handling Fee:", summaryX, yPos);
      doc.text(
        `${orderData?.HandllingFee?.toLocaleString() || "0"}`,
        pageWidth - margin - 5,
        yPos,
        { align: "right" }
      );

      yPos += 12;
      doc.setFont("helvetica", "bold");
      doc.text("Total Amount:", summaryX, yPos);
      doc.text(
        `${orderData?.TotalAmount?.toLocaleString() || "0"}`,
        pageWidth - margin - 5,
        yPos,
        { align: "right" }
      );

      // Payment Info
      yPos += 20;
      doc.setFont("helvetica", "normal");
      doc.text(
        `Payment Method: ${orderData?.PaymentMode || "-"}`,
        margin,
        yPos
      );
      yPos += 6;
      doc.text(
        `Payment Status: ${orderData?.PaymentStatus || "-"}`,
        margin,
        yPos
      );

      // Footer
      yPos += 20;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for your business!", pageWidth / 2, yPos, {
        align: "center",
      });

      // Save the PDF
      const fileName = `Invoice_${orderData?._id?.slice(-8) || "NA"}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  };

  function getBase64Image(imgUrl) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      console.log(dataUrl); // Copy this base64 string
    };
    img.src = imgUrl;
  }
  getBase64Image("/largelogo.png");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Extract address components
  const getAddressComponents = () => {
    if (!orderData?.Address) {
      return {
        userName: orderData?.UserName || "",
        userPhone: orderData?.UserMobile || "",
        fullAddress: orderData?.Address || "Address not available",
      };
    }

    const addressParts = orderData.Address.split(",");
    const userName = addressParts[0]?.trim() || orderData?.UserName || "";
    const userPhone = addressParts[1]?.trim() || orderData?.UserMobile || "";
    const addressLine1 =
      addressParts[2]?.trim() || addressParts[3]?.trim() || "";
    const city = addressParts[4]?.trim() || "";
    const state = addressParts[5]?.trim() || "";
    const country = addressParts[6]?.trim() || "";
    const pincode = addressParts[7]?.trim() || "";

    const fullAddress = [addressLine1, city, state, country, pincode]
      .filter((part) => part && part.trim() !== "")
      .join(", ");

    return {
      userName,
      userPhone,
      fullAddress: fullAddress || "Address not available",
    };
  };

  const { userName, userPhone, fullAddress } = getAddressComponents();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e96f84] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="text-red-500 text-lg font-semibold mb-2">Error</div>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-yellow-600 text-lg font-semibold mb-2">
              No Data Found
            </div>
            <p className="text-yellow-700">
              No order data available for this ID.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <IoIosArrowRoundBack size={24} />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-1">Order ID: {orderData._id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {orderData.ProductName}
                  </h2>
                  <div className="space-y-1 text-gray-600">
                    <p className="text-sm">
                      <span className="font-medium">Quantity:</span>{" "}
                      {orderData.cart_Quentity}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Seller:</span>{" "}
                      {orderData.shopName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Order Date:</span>{" "}
                      {formatDate(orderData.OrderBookedDate)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{orderData.Price.toLocaleString()}
                    </span>
                    {orderData.Mrp > orderData.Price && (
                      <span className="text-green-600 text-sm font-medium bg-green-50 px-3 py-1 rounded-full">
                        You saved ₹
                        {(orderData.Mrp - orderData.Price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src={orderData.thumbnail}
                    alt={orderData.ProductName}
                    className="w-32 h-32 object-contain rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Status
              </h3>
              <div className="space-y-4">
                {/* Order Confirmed */}
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      orderData.OrderprocessDate?.OrderBookedDate
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {orderData.OrderprocessDate?.OrderBookedDate && (
                      <CheckCircle className="text-white" fontSize="small" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">Order Confirmed</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {orderData.remark?.BookedOrdersRemark ||
                        "Your order has been placed successfully"}
                    </p>
                    {orderData.OrderprocessDate?.OrderBookedDate && (
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDateTime(
                          orderData.OrderprocessDate.OrderBookedDate
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Processed */}
                {orderData.OrderprocessDate?.OrderprocessingDateShow && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="text-white" fontSize="small" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        Order Processed
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {orderData.remark?.OrderprocessingRemark ||
                          "Team has processed your order"}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDateTime(orderData.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Dispatched */}
                {orderData.OrderprocessDate?.OrderDispatchedDateShow && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="text-white" fontSize="small" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        Order Dispatched
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {orderData.remark?.OrderDispatchedRemark?.[0] ||
                          "Your order has been picked up by courier partner"}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDateTime(orderData.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Out for Delivery */}
                {orderData.OrderprocessDate?.OutfordeliveryDateShow && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="text-white" fontSize="small" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        Out for Delivery
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {orderData.remark?.OutfordeliveryRemark ||
                          "Your item is out for delivery"}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDateTime(orderData.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Delivered */}
                {orderData.OrderprocessDate?.OrderDeliveredDateShow && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="text-white" fontSize="small" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Delivered</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {orderData.remark?.OrderDeliveredRemark ||
                          "Your item has been delivered"}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDateTime(orderData.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cancelled */}
                {orderData.OrderprocessDate?.OrderCancelledDateShow && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <CheckCircle className="text-white" fontSize="small" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">Cancelled</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {orderData.remark?.OrderCancelRemark ||
                          "Your order has been cancelled"}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDateTime(orderData.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* See All Updates Button */}
              <button
                onClick={() => setOpen({ type: "Updates", index: null })}
                className="mt-4 flex items-center gap-1 text-[#e96f84] hover:text-[#d45a6f] transition-colors font-medium"
              >
                See All Updates
                <ChevronRight fontSize="small" />
              </button>

              {/* Expected Delivery */}
              {orderData.ExpectedDelDate && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm font-medium">
                    Expected Delivery: {formatDate(orderData.ExpectedDelDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Invoice Download Card */}
            <div
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200 group"
              onClick={generateInvoice}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#e96f84] rounded-lg group-hover:bg-[#d45a6f] transition-colors">
                    <FileDownload className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Download Invoice
                    </p>
                    <p className="text-gray-500 text-sm">PDF format</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
            </div>

            {/* Delivery Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <LocationOn className="text-gray-600" />
                Delivery Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <LocationOn
                    className="text-gray-400 mt-1 flex-shrink-0"
                    fontSize="small"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{userName}</p>
                    <p className="text-gray-600 text-sm mt-1">{fullAddress}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Person
                    className="text-gray-400 flex-shrink-0"
                    fontSize="small"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{userName}</p>
                    <p className="text-gray-600 text-sm">{userPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Price Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">List Price</span>
                  <span className="line-through text-gray-500">
                    ₹{orderData.TotalMrp.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Selling Price</span>
                  <span className="text-gray-900">
                    ₹{orderData.TotalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600 font-medium">
                    - ₹
                    {(
                      orderData.TotalMrp - orderData.TotalPrice
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Delivery Charge</span>
                  <span className="text-gray-900">
                    ₹{orderData.DeliveryCharge.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Handling Fee</span>
                  <span className="text-gray-900">
                    ₹{orderData.HandllingFee.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-lg">
                      Total Amount
                    </span>
                    <span className="font-bold text-gray-900 text-lg">
                      ₹{orderData.TotalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-green-600 font-medium">
                    {orderData.PaymentMode}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status</span>
                  <span
                    className={`font-medium ${
                      orderData.PaymentStatus === "Paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {orderData.PaymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updates Modal */}
      {open.type === "Updates" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Order Timeline
              </h3>
              <button
                onClick={() => setOpen({ type: null, index: null })}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <IoClose size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Order Confirmed */}
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                  <div className="absolute left-2 top-4 w-0.5 h-full bg-green-500"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Order Confirmed
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {orderData.remark?.BookedOrdersRemark ||
                        "Your order has been placed successfully"}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      {formatDateTime(
                        orderData.OrderprocessDate?.OrderBookedDate
                      )}
                    </p>
                  </div>
                </div>

                {/* Order Processed */}
                {orderData.OrderprocessDate?.OrderprocessingDateShow && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                    <div className="absolute left-2 top-4 w-0.5 h-full bg-green-500"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Order Processed
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {orderData.remark?.OrderprocessingRemark ||
                          "Team has processed your order"}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {formatDateTime(orderData.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Dispatched */}
                {orderData.OrderprocessDate?.OrderDispatchedDateShow && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                    <div className="absolute left-2 top-4 w-0.5 h-full bg-green-500"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Order Dispatched
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {orderData.remark?.OrderDispatchedRemark?.[0] ||
                          "Your order has been picked up by courier partner"}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {formatDateTime(orderData.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Out for Delivery */}
                {orderData.OrderprocessDate?.OutfordeliveryDateShow && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                    <div className="absolute left-2 top-4 w-0.5 h-full bg-green-500"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Out for Delivery
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {orderData.remark?.OutfordeliveryRemark ||
                          "Your item is out for delivery"}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {formatDateTime(orderData.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Delivered */}
                {orderData.OrderprocessDate?.OrderDeliveredDateShow && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-green-500 rounded-full border-4 border-white"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Delivered</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {orderData.remark?.OrderDeliveredRemark ||
                          "Your item has been delivered"}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {formatDateTime(orderData.createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cancelled */}
                {orderData.OrderprocessDate?.OrderCancelledDateShow && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-red-500 rounded-full border-4 border-white"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Cancelled</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {orderData.remark?.OrderCancelRemark ||
                          "Your order has been cancelled"}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {formatDateTime(orderData.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
