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

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = 20;

    // Add styling variables
    const primaryColor = [52, 152, 219];
    const secondaryColor = [44, 62, 80];
    const lightGray = [240, 240, 240];
    const darkGray = [100, 100, 100];

    // Add logo or header with better styling
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 50, "F");

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth / 2, 30, { align: "center" });

    // Reset font for body
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);

    // Company Info
    doc.setFontSize(10);
    doc.text("Dexterous Technology", margin, 65);
    doc.text("123 Business Street, Tech City", margin, 70);
    doc.text("support@dexteroustech.com | +91 9876543210", margin, 75);

    // Invoice metadata in a box
    doc.setFillColor(...lightGray);
    doc.rect(pageWidth - 70, 60, 55, 25, "F");
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(10);
    doc.text("INVOICE #", pageWidth - 65, 67);
    doc.setFontSize(12);
    doc.text(orderData._id, pageWidth - 65, 74);
    doc.setFontSize(10);
    doc.text("DATE", pageWidth - 65, 81);
    doc.setFontSize(12);
    doc.text(formatDate(orderData.OrderBookedDate), pageWidth - 65, 88);

    // Divider line
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, 95, pageWidth - margin, 95);

    // Customer Info with better layout
    yPos = 105;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", margin, yPos);
    doc.setFont("helvetica", "normal");

    yPos += 10;
    doc.text(orderData.UserName, margin, yPos);

    yPos += 7;
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);

    // Address with proper line breaks
    const addressLines = doc.splitTextToSize(orderData.Address, 80);
    doc.text(addressLines, margin, yPos);
    yPos += addressLines.length * 5 + 5;

    doc.text(`Email: ${orderData.UserEmail}`, margin, yPos);
    yPos += 5;
    doc.text(`Phone: ${orderData.UserMobile}`, margin, yPos);

    // Reset text color
    doc.setTextColor(...secondaryColor);

    // Invoice Table with better styling
    yPos += 20;
    doc.setFillColor(...primaryColor);
    doc.rect(margin, yPos, pageWidth - margin * 2, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    // Table headers
    doc.text("Description", margin + 5, yPos + 7);
    doc.text("Price", 120, yPos + 7);
    doc.text("Qty", 160, yPos + 7);
    doc.text("Total", pageWidth - margin - 5, yPos + 7, { align: "right" });

    // Product Row with alternating colors
    yPos += 15;
    const rowHeight = 12;

    // Light gray background for product row
    doc.setFillColor(...lightGray);
    doc.rect(margin, yPos - 5, pageWidth - margin * 2, rowHeight, "F");

    doc.setTextColor(...secondaryColor);
    doc.setFont("helvetica", "normal");
    doc.text(orderData.ProductName, margin + 5, yPos + 3);
    doc.text("₹" + orderData.Price.toLocaleString(), 120, yPos + 3);
    doc.text(orderData.cart_Quentity.toString(), 160, yPos + 3);
    doc.text(
      "₹" + (orderData.Price * orderData.cart_Quentity).toLocaleString(),
      pageWidth - margin - 5,
      yPos + 3,
      { align: "right" }
    );

    // Summary section with better alignment
    yPos += 30;
    const summaryStart = 140;

    doc.setFontSize(12);
    doc.text("Subtotal:", summaryStart, yPos);
    doc.text(
      "₹" + orderData.TotalPrice.toLocaleString(),
      pageWidth - margin - 5,
      yPos,
      { align: "right" }
    );

    yPos += 8;
    doc.text("Delivery Charge:", summaryStart, yPos);
    doc.text(
      "₹" + orderData.DeliveryCharge.toLocaleString(),
      pageWidth - margin - 5,
      yPos,
      { align: "right" }
    );

    yPos += 8;
    doc.text("Handling Fee:", summaryStart, yPos);
    doc.text(
      "₹" + orderData.HandllingFee.toLocaleString(),
      pageWidth - margin - 5,
      yPos,
      { align: "right" }
    );

    // Total with emphasis
    yPos += 12;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", summaryStart, yPos);
    doc.text(
      "₹" + orderData.TotalAmount.toLocaleString(),
      pageWidth - margin - 5,
      yPos,
      { align: "right" }
    );

    // Payment Info section
    yPos += 25;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Information:", margin, yPos);
    doc.setFont("helvetica", "normal");

    yPos += 8;
    doc.text(`Method: ${orderData.PaymentMode}`, margin, yPos);

    yPos += 8;
    doc.text(`Status: ${orderData.PaymentStatus}`, margin, yPos);

    // Footer with thank you message
    yPos += 20;
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text("Thank you for your business!", pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 6;
    doc.text(
      "For any questions, please contact our support team",
      pageWidth / 2,
      yPos,
      { align: "center" }
    );

    yPos += 6;
    doc.text(
      "support@dexteroustech.com | +91 9876543210",
      pageWidth / 2,
      yPos,
      { align: "center" }
    );

    // Terms and conditions
    yPos += 12;
    doc.setFontSize(8);
    doc.text(
      "Terms & Conditions: Payment is due within 15 days. Late payments are subject to fees.",
      pageWidth / 2,
      yPos,
      { align: "center" }
    );

    // Save the PDF with a more descriptive name
    const fileName = `Invoice_${orderData._id}_${orderData.UserName.replace(
      /\s+/g,
      "_"
    )}.pdf`;
    doc.save(fileName);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Extract address components
  const addressParts = orderData?.Address ? orderData.Address.split(",") : [];
  const userName = addressParts[0] || orderData?.UserName || "";
  const userPhone = addressParts[1] || orderData?.UserMobile || "";
  const addressLine1 = addressParts[3] || "";
  const city = addressParts[4] || "";
  const state = addressParts[5] || "";
  const country = addressParts[6] || "";
  const pincode = addressParts[7] || "";

  const fullAddress = `${addressLine1}, ${city}, ${state}, ${country} - ${pincode}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>No order data found</div>
      </div>
    );
  }

  return (
    <div className="sm:px-4 px-2 relative py-2 w-full sm:h-[70vh] sm:mb-0 mb-10 overflow-y-auto">
      <h1 className="font-semibold flex flex-row items-center gap-2 text-lg text-[#2f415d] ">
        <span onClick={() => router.back()}>
          <IoIosArrowRoundBack size={30} />
        </span>
        <span>Order Details</span>
      </h1>
      <div className="sm:mx-auto grid mt-2 grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white sm:rounded-md sm:shadow-sm p-4">
          <div className="flex justify-between gap-4">
            <div>
              <h2 className="font-medium sm:text-base text-sm">
                {orderData.ProductName}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Quantity: {orderData.cart_Quentity}
              </p>
              <p className="text-gray-500 text-sm">
                Seller: {orderData.shopName}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-xl font-semibold text-black">
                  ₹{orderData.Price.toLocaleString()}
                </span>
                <span className="text-green-600 text-sm font-medium">
                  You saved ₹
                  {(orderData.Mrp - orderData.Price).toLocaleString()}
                </span>
              </div>
            </div>
            <img
              src={orderData.thumbnail}
              alt="Product"
              width={80}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Timeline */}
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-800">
              <CheckCircle className="text-green-600" fontSize="small" />
              {orderData.remark?.BookedOrdersRemark ||
                "Your Order has been placed"}
            </div>
            {orderData.OrderprocessDate?.OrderprocessingDateShow && (
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CheckCircle className="text-green-600" fontSize="small" />
                {orderData.remark?.OrderprocessingRemark ||
                  "Team has processed your order"}
              </div>
            )}
            {orderData.OrderprocessDate?.OrderDispatchedDateShow && (
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CheckCircle className="text-green-600" fontSize="small" />
                {orderData.remark?.OrderDispatchedRemark?.[0] ||
                  "Your Order has been picked up by courier partner"}
              </div>
            )}
            {orderData.OrderprocessDate?.OutfordeliveryDateShow && (
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CheckCircle className="text-green-600" fontSize="small" />
                {orderData.remark?.OutfordeliveryRemark ||
                  "Your item is out for delivery"}
              </div>
            )}
            {orderData.OrderprocessDate?.OrderDeliveredDateShow && (
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CheckCircle className="text-green-600" fontSize="small" />
                {orderData.remark?.OrderDeliveredRemark ||
                  "Your item has been delivered"}
              </div>
            )}
            {orderData.OrderprocessDate?.OrderCancelledDateShow && (
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CheckCircle className="text-red-600" fontSize="small" />
                {orderData.remark?.OrderCancelRemark ||
                  "Your delivery is cancelled"}
              </div>
            )}
          </div>

          {/* See all updates */}
          <div
            onClick={() => setOpen({ type: "Updates", index: null })}
            className="mt-3 flex items-center gap-1 text-[#e96f84] cursor-pointer text-sm font-medium"
          >
            See All Updates
            <ChevronRight fontSize="small" />
          </div>

          {/* Return Policy */}
          <div className="mt-2 text-sm text-gray-400">
            Expected Delivery: {formatDate(orderData.ExpectedDelDate)}
          </div>
        
        </div>
        <div className="space-y-4">
          {/* Invoice Download */}
          <div
            className="bg-white rounded-md sm:shadow-sm p-4 flex justify-between items-center cursor-pointer"
            onClick={generateInvoice}
          >
            <div className="flex items-center gap-2">
              <FileDownload className="text-[#e96f84]" />
              <span className="font-medium text-sm">Download Invoice</span>
            </div>
            <ChevronRight className="text-gray-500" />
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-lg sm:shadow-sm p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-800 text-base mb-4 flex items-center gap-2">
              Delivery details
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <LocationOn className="text-gray-600" fontSize="small" />
                <div>
                  <span className="font-medium">{userName}</span>
                  <p className="truncate">{fullAddress.slice(0, 20)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Person className="text-gray-600" fontSize="small" />
                <span className="font-medium">{userName}</span>
                <span>{userPhone}</span>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-white rounded-lg sm:shadow-sm p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-800 text-base mb-4">
              Price Details
            </h3>
            <div className="text-sm text-gray-700 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">List price</span>
                <span className="line-through text-gray-500">
                  ₹{orderData.TotalMrp.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Selling price</span>
                <span>₹{orderData.TotalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">
                  - ₹
                  {(orderData.TotalMrp - orderData.TotalPrice).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charge</span>
                <span>₹{orderData.DeliveryCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Handling Fee</span>
                <span>₹{orderData.HandllingFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total Amount</span>
                <span>₹{orderData.TotalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Payment Method</span>
                <span>{orderData.PaymentMode}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span
                  className={
                    orderData.PaymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {orderData.PaymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
        {open.type === "Updates" && (
          <div
            className="fixed inset-0 z-50 mt-10 bg-black/40 px-4 flex items-center justify-center overflow-y-auto"
            onClick={() => setOpen({ type: null, index: null })}
          >
            <div className="bg-white max-h-[60vh] sm:w-1/4 w-full rounded-lg relative p-4 overflow-y-auto">
              {/* Close button */}
              <button
                className="absolute top-3 right-3 text-xl text-gray-700 hover:text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen({ type: null, index: null });
                }}
              >
                <IoClose />
              </button>
              {/* Timeline */}
              <div className="pl-5">
                <div className="">
                  <div className="relative text-black text-sm pb-3">
                    <div className="absolute -left-[1.3rem] w-3 h-3 rounded-full bg-green-500 border-[2px] border-white z-10" />
                    <div className="absolute -left-[1rem] h-full border-l-2 border-green-500" />
                    <span> Order Confirmed</span>
                    <span className="text-gray-500 text-sm block">
                      {formatDate(orderData.OrderprocessDate?.OrderBookedDate)}
                    </span>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex flex-col">
                        <span className="text-xs">
                          {orderData.remark?.BookedOrdersRemark ||
                            "Your Order has been placed"}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDateTime(
                            orderData.OrderprocessDate?.OrderBookedDate
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {orderData.OrderprocessDate?.OrderprocessingDateShow && (
                    <div className="relative text-black text-sm pb-3">
                      <div className="absolute -left-[1.3rem] w-3 h-3 rounded-full bg-green-500 border-[2px] border-white z-10" />
                      <div className="absolute -left-[1rem] h-full border-l-2 border-green-500" />
                      <span> Order Processed</span>
                      <span className="text-gray-500 text-sm block">
                        {formatDate(orderData.createdAt)}
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs">
                            {orderData.remark?.OrderprocessingRemark ||
                              "Team has processed your order"}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDateTime(orderData.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {orderData.OrderprocessDate?.OrderDispatchedDateShow && (
                    <div className="relative text-black text-sm pb-3">
                      <div className="absolute -left-[1.3rem] w-3 h-3 rounded-full bg-green-500 border-[2px] border-white z-10" />
                      <div className="absolute -left-[1rem] h-full border-l-2 border-green-500" />
                      <span> Order Dispatched</span>
                      <span className="text-gray-500 text-sm block">
                        {formatDate(orderData.createdAt)}
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs">
                            {orderData.remark?.OrderDispatchedRemark?.[0] ||
                              "Your Order has been picked up by courier partner"}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDateTime(orderData.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {orderData.OrderprocessDate?.OutfordeliveryDateShow && (
                    <div className="relative text-black text-sm pb-3">
                      <div className="absolute -left-[1.3rem] w-3 h-3 rounded-full bg-green-500 border-[2px] border-white z-10" />
                      <div className="absolute -left-[1rem] h-full border-l-2 border-green-500" />
                      <span> Out For Delivery</span>
                      <span className="text-gray-500 text-sm block">
                        {formatDate(orderData.createdAt)}
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs">
                            {orderData.remark?.OutfordeliveryRemark ||
                              "Your item is out for delivery"}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDateTime(orderData.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {orderData.OrderprocessDate?.OrderDeliveredDateShow && (
                    <div className="relative text-black text-sm pb-3">
                      <div className="absolute -left-[1.3rem] w-3 h-3 rounded-full bg-green-500 border-[2px] border-white z-10" />
                      <span> Delivered</span>
                      <span className="text-gray-500 text-sm block">
                        {formatDate(orderData.createdAt)}
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex flex-col">
                          <span className="text-xs">
                            {orderData.remark?.OrderDeliveredRemark ||
                              "Your item has been delivered"}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDateTime(orderData.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
