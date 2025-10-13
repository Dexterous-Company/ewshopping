"use client";
import React, { useState, useEffect } from "react";
import { RiCoupon2Fill } from "react-icons/ri";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedVariant } from "@/redux/product/productSlice";
import { useRouter } from "next/navigation";
import { FaAngleDown, FaAngleRight, FaAngleUp } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import ProductTabs from "./TabsListing";
import { TbTruckDelivery } from "react-icons/tb";

const ProductDetailsSkeleton = () => {
  return (
    <div className="w-full max-w-3xl mx-auto font-sans bg-white text-gray-800 px-4 py-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-7 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
            ))}
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      {/* Price Section Skeleton */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/5 ml-auto"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

      {/* Variant Selectors Skeleton */}
      <div className="flex gap-2 mb-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="w-1/3">
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="flex flex-wrap gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Section Skeleton */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>

      {/* Additional Info Skeleton */}
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-3 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const ProductDetailSection = ({ title, data, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full h-fit mb-4 divide-y divide-gray-300 font-sans">
      {/* Header */}
      <div
        className="flex justify-between items-center font-medium cursor-pointer py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base sm:text-lg font-semibold text-gray-800">
          {title || "General"}
        </span>
        {isOpen ? (
          <FaAngleUp className="text-gray-500" />
        ) : (
          <FaAngleDown className="text-gray-500" />
        )}
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300`}
        style={{ maxHeight: isOpen ? `${data.length * 50}px` : "0px" }}
      >
        <table className="w-full mt-2">
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <th className="py-2 pr-4 font-medium text-gray-600 text-left w-1/3 text-sm sm:text-base">
                  {item.label}
                </th>
                <td className="py-2 text-gray-800 text-sm sm:text-base">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DeliveryRange = ({ noof_delivery_days = 4 }) => {
  const now = new Date();

  // Format a date in "DD MMM YYYY"
  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Calculate end date
  const endDate = new Date();
  endDate.setDate(now.getDate() + noof_delivery_days);

  return (
    <div className="mb-2 p-4 bg-white shadow-md border border-gray-100 rounded-xl flex items-center gap-3 sm:gap-4">
      <div className="flex-shrink-0 text-blue-600 text-2xl">
        <TbTruckDelivery />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-gray-700 font-medium text-sm sm:text-base">
          Delivery:
        </span>
        <span className="text-gray-900 font-semibold text-sm sm:text-base">
          {formatDate(now)} to {formatDate(endDate)}
        </span>
      </div>
    </div>
  );
};
const ProductDetails = () => {
  const { rating, totalRatings, ratingBreakdown, customerReviews, error } =
    useSelector((state) => state.reviews);

  const dispatch = useDispatch();
  const [modelOpen, setModelOpen] = useState({ type: "ship" });
  const router = useRouter();
  const { product, selectedVariant, status } = useSelector(
    (state) => state.info
  );
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [tempSelection, setTempSelection] = useState({
    field1: "",
    field2: "",
    field3: "",
  });
  const productData = product?.[0] || {};

  const generalFields = productData?.generalFields || [];
  const variants = productData?.simpleAttributes || [];
  const currentVariant = variants[selectedVariant] || {};

  const [showMore, setShowMore] = useState(false);

  const words = productData?.shortDescription?.split(" ") || [];
  const shortText = words.slice(0, 30).join(" ");
  const isLong = words.length > 30;

  // Helper function to ensure valid image src
  const getValidImageSrc = (src) => {
    return src && src.trim() !== "" ? src : "https://via.placeholder.com/64";
  };

  const handleClick = () => {
    const sellerName = productData?.shopName;
    const url = `/sellerproduct?sellername=${encodeURIComponent(sellerName)}`;
    router.push(url);
  };

  // Get available variant fields
  const variantFields = [
    productData.fieldname1,
    productData.fieldname2,
    productData.fieldname3,
  ].filter(Boolean);

  // State for selected values
  const [selectedValues, setSelectedValues] = useState({
    field1: "",
    field2: "",
    field3: "",
  });

  // Initialize selected values
  useEffect(() => {
    if (variants.length > 0) {
      const variant = variants[selectedVariant] || variants[0];
      setSelectedValues({
        field1: variant.fieldValue1 || "",
        field2: variant.fieldValue2 || "",
        field3: variant.fieldValue3 || "",
      });
      setTempSelection({
        field1: variant.fieldValue1 || "",
        field2: variant.fieldValue2 || "",
        field3: variant.fieldValue3 || "",
      });
    }
  }, [variants, selectedVariant]);

  // Update variant when selections change
  useEffect(() => {
    const matchingVariant = variants.findIndex(
      (v) =>
        v.fieldValue1 === selectedValues.field1 &&
        v.fieldValue2 === selectedValues.field2 &&
        v.fieldValue3 === selectedValues.field3
    );

    if (matchingVariant !== -1 && matchingVariant !== selectedVariant) {
      dispatch(setSelectedVariant(matchingVariant));
    }
  }, [selectedValues, variants, dispatch, selectedVariant]);

  // Handle variant selection in modal
  const handleApply = () => {
    setSelectedValues(tempSelection);
    setShowVariantModal(false);
  };

  const handleCancel = () => {
    setTempSelection(selectedValues);
    setShowVariantModal(false);
  };

  // Calculate discount percentage
  const discountPercentage =
    currentVariant.price && currentVariant.mrp
      ? Math.round((1 - currentVariant.price / currentVariant.mrp) * 100)
      : 0;

  // Render star ratings
  // const renderStars = (rating) => {
  //   const stars = [];
  //   const fullStars = Math.floor(rating);
  //   const hasHalfStar = rating % 1 >= 0.5;

  //   for (let i = 1; i <= 5; i++) {
  //     if (i <= fullStars) {
  //       stars.push(
  //         <IoStar key={i} className="text-yellow-500 text-sm md:text-base" />
  //       );
  //     } else if (i === fullStars + 1 && hasHalfStar) {
  //       stars.push(
  //         <IoStarHalf
  //           key={i}
  //           className="text-yellow-500 text-sm md:text-base"
  //         />
  //       );
  //     } else {
  //       stars.push(
  //         <IoStarOutline
  //           key={i}
  //           className="text-yellow-500 text-sm md:text-base"
  //         />
  //       );
  //     }
  //   }

  //   return stars;
  // };

  const renderStars = (ratingValue) => {
    // If rating exists, use it; else default to 5
    const ratingNum = ratingValue != null ? ratingValue : 5;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <IoStar key={i} className="text-yellow-500 text-sm md:text-base" />
      );
    }

    return stars;
  };
  // Get unique values for a specific field
  const getUniqueValues = (fieldIndex, filterValues = {}) => {
    const filtered = variants.filter((variant) => {
      return Object.keys(filterValues).every((key) => {
        if (!filterValues[key]) return true;
        return variant[key] === filterValues[key];
      });
    });

    return [
      ...new Set(
        filtered.map((v) => {
          if (fieldIndex === 0) return v.fieldValue1;
          if (fieldIndex === 1) return v.fieldValue2;
          if (fieldIndex === 2) return v.fieldValue3;
          return "";
        })
      ),
    ].filter(Boolean);
  };

  // Render variant selector for a field - for desktop
  const renderVariantSelector = (fieldIndex) => {
    const fieldName = variantFields[fieldIndex];
    if (!fieldName) return null;

    const filterValues = {};
    if (fieldIndex > 0) filterValues.fieldValue1 = selectedValues.field1;
    if (fieldIndex > 1) filterValues.fieldValue2 = selectedValues.field2;

    const options = getUniqueValues(fieldIndex, filterValues);
    const currentValue = selectedValues[`field${fieldIndex + 1}`];

    const isColorField = fieldName.toLowerCase().includes("color");

    return (
      <div
        className=" hidden md:block bg-white shadow-lg rounded-2xl p-4 w-full"
        key={fieldIndex}
      >
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-gray-600">
          {fieldName}
        </h3>
        <div className="flex md:flex-wrap gap-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() =>
                setSelectedValues((prev) => ({
                  ...prev,
                  [`field${fieldIndex + 1}`]: option,
                }))
              }
              className={`
        ${
          isColorField
            ? "w-20 h-auto py-2"
            : "px-4 py-2 sm:min-w-fit xl:min-w-[60px]"
        }
        border-2 rounded-md transition-all flex flex-col items-center justify-center
        ${
          currentValue === option
            ? isColorField
              ? "border-rose-500 shadow-md"
              : "border-black bg-black text-white"
            : "border-gray-200 hover:border-gray-400"
        }
      `}
              aria-label={`Select ${option}`}
            >
              {isColorField ? (
                <>
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    <img
                      src={getValidImageSrc(
                        variants.find((v) =>
                          fieldIndex === 0
                            ? v.fieldValue1 === option
                            : fieldIndex === 1
                            ? v.fieldValue2 === option
                            : v.fieldValue3 === option
                        )?.thumbnail
                      )}
                      alt={option}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs text-gray-700 truncate mt-1 text-center max-w-[70px]">
                    {option}
                  </p>
                </>
              ) : (
                <span className="text-center">{option}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const { isAuth, loginData } = useSelector((state) => state.Athentication);

  // Render selected variant summary - for mobile
  const renderVariantSummary = () => {
    return (
      <div className="mb-6 md:hidden">
        {variantFields.map((fieldName, index) => {
          if (!fieldName) return null;
          const currentValue = selectedValues[`field${index + 1}`];
          return (
            <div key={index} className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                {fieldName}:
              </span>
              <span className="font-medium">{currentValue}</span>
            </div>
          );
        })}
        <button
          onClick={() => setShowVariantModal(true)}
          className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium mt-2"
        >
          Change Variant
        </button>
      </div>
    );
  };

  const renderVariantModal = () => {
    if (!showVariantModal) return null;
    return (
      <div className="fixed inset-0 z-100 bg-black/40 flex items-end md:hidden">
        <div className="w-full bg-white rounded-t-2xl shadow-lg max-h-[80vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b px-4 pt-4 pb-3 z-10">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-900">
                {productData.name || "Product Name"}{" "}
                {(() => {
                  const parts = [
                    currentVariant?.fieldValue1,
                    currentVariant?.fieldValue2,
                    currentVariant?.fieldValue3,
                  ].filter(Boolean); // remove empty values

                  return `(${parts.join(", ")})`;
                })()}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900">
                ₹{currentVariant.price?.toLocaleString("en-IN") || "99,999"}
              </span>
              {currentVariant.mrp && (
                <span className="line-through text-gray-500 text-sm">
                  ₹{currentVariant.mrp?.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          {/* Variant Selectors */}
          <div className=" pb-9">
            {variantFields.map((fieldName, fieldIndex) => {
              if (!fieldName) return null;
              const filterValues = {};
              if (fieldIndex > 0)
                filterValues.fieldValue1 = tempSelection.field1;
              if (fieldIndex > 1) {
                filterValues.fieldValue1 = tempSelection.field1;
                filterValues.fieldValue2 = tempSelection.field2;
              }

              const options = getUniqueValues(fieldIndex, filterValues);
              const currentValue = tempSelection[`field${fieldIndex + 1}`];
              const isColorField = fieldName.toLowerCase().includes("color");

              return (
                <div key={fieldIndex} className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-3">
                    {fieldName}:{" "}
                    <span className="text-gray-600">{currentValue}</span>
                  </h4>
                  <div
                    className={
                      isColorField
                        ? "grid grid-cols-5 gap-3"
                        : "grid grid-cols-2 gap-3"
                    }
                  >
                    {options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setTempSelection((prev) => ({
                            ...prev,
                            [`field${fieldIndex + 1}`]: option,
                          }))
                        }
                        className={`${
                          isColorField ? "p-2" : "py-3 px-4"
                        } border rounded-lg transition-all ${
                          currentValue === option
                            ? isColorField
                              ? "border-rose-500 bg-rose-50"
                              : "border-black/30 bg-black text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {isColorField ? (
                          <>
                            <div className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                              <img
                                src={getValidImageSrc(
                                  variants.find((v) =>
                                    fieldIndex === 0
                                      ? v.fieldValue1 === option
                                      : fieldIndex === 1
                                      ? v.fieldValue2 === option
                                      : v.fieldValue3 === option
                                  )?.thumbnail
                                )}
                                alt={option}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <span className="text-xs mt-1 block truncate text-gray-700">
                              {option}
                            </span>
                          </>
                        ) : (
                          option
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (status === "loading" || !product || product.length === 0) {
    return <ProductDetailsSkeleton />;
  }
  const dynamicSections = generalFields.map((field) => ({
    title: field.tag,
    data: field.fields.map((item) => ({
      label: item.name,
      value: item.value,
    })),
  }));
  const shippingReturnData = [
    {
      title: "Shipping & Return Policy",
      items: [
        "Dispatch: Within 24 Hours",
        "The warranty for this product is provided by the brand and varies depending on the product.",
        "Free shipping on orders above ₹500",
        "delivery: 7–10 business days",
        "Cash on delivery available",
        "Easy 7 days returns and exchanges",
      ],
    },
    {
      title: "Free and Easy Returns",
      description:
        "If you're not completely satisfied with your purchase, you can return it within 7 days for a full refund or exchange. Items must be unused, unworn, and in original condition with tags attached.",
    },
    {
      title: "Special Offers",
      description:
        "We frequently run special promotions and discounts. Subscribe to our newsletter to stay updated on the latest deals and offers.",
    },
  ];
  return (
    <>
      {variantFields?.length > 0 && (
        <div className="border border-gray-200 p-3 block sm:hidden bg-white mb-2  ">
          <div className="mb-3">Select Variant</div>
          <div className="">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-gray-900">
                {productData.name || "Product Name"}{" "}
                {(() => {
                  const parts = [
                    currentVariant?.fieldValue1,
                    currentVariant?.fieldValue2,
                    currentVariant?.fieldValue3,
                  ].filter(Boolean); // remove empty values

                  return `(${parts.join(", ")})`;
                })()}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900">
                ₹{currentVariant.price?.toLocaleString("en-IN") || "99,999"}
              </span>
              {currentVariant.mrp && (
                <span className="line-through text-gray-500 text-sm">
                  ₹{currentVariant.mrp?.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          {/* Variant Selectors */}
          <div className="px-4 pb-9">
            {variantFields.map((fieldName, fieldIndex) => {
              if (!fieldName) return null;
              const filterValues = {};
              if (fieldIndex > 0)
                filterValues.fieldValue1 = tempSelection.field1;
              if (fieldIndex > 1) {
                filterValues.fieldValue1 = tempSelection.field1;
                filterValues.fieldValue2 = tempSelection.field2;
              }

              const options = getUniqueValues(fieldIndex, filterValues);
              const currentValue = tempSelection[`field${fieldIndex + 1}`];
              const isColorField = fieldName.toLowerCase().includes("color");

              return (
                <div key={fieldIndex} className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-3">
                    {fieldName}:{" "}
                    <span className="text-gray-600">{currentValue}</span>
                  </h4>
                  <div
                    className={
                      isColorField
                        ? "grid grid-cols-5 gap-3"
                        : "grid grid-cols-2 gap-3"
                    }
                  >
                    {options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setTempSelection((prev) => ({
                            ...prev,
                            [`field${fieldIndex + 1}`]: option,
                          }))
                        }
                        className={`${
                          isColorField ? "p-2" : "py-3 px-4"
                        } border rounded-lg transition-all ${
                          currentValue === option
                            ? isColorField
                              ? "border-rose-500 bg-rose-50"
                              : "border-black bg-black text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {isColorField ? (
                          <>
                            <div className="w-full aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                              <img
                                src={getValidImageSrc(
                                  variants.find((v) =>
                                    fieldIndex === 0
                                      ? v.fieldValue1 === option
                                      : fieldIndex === 1
                                      ? v.fieldValue2 === option
                                      : v.fieldValue3 === option
                                  )?.thumbnail
                                )}
                                alt={option}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <span className="text-xs mt-1 block truncate text-gray-700">
                              {option}
                            </span>
                          </>
                        ) : (
                          option
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="divide-y divide-gray-200 flex flex-col gap-2">
            {variantFields.map((fieldName, index) => {
              if (!fieldName) return null;
              const currentValue = selectedValues[`field${index + 1}`];
              return (
                <div
                  key={index}
                  className="flex items-center justify-between py-1 "
                  onClick={() => setShowVariantModal(true)}
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {fieldName}:
                    </span>
                    <span className="font-medium line-clamp-1">
                      {currentValue}
                    </span>
                  </div>
                  <div className="flex flex-row items-center gap-3 text-base text-black">
                    <FaAngleRight />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="w-full mx-auto font-sans bg-white  text-gray-800 px-4 py-6">
        {/* Header */}
        <div className="sm:mb-6 mb-3">
          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            {productData.brand || "N AND J"}{" "}
            {currentVariant
              ? [
                  currentVariant.fieldValue1,
                  currentVariant.fieldValue2,
                  currentVariant.fieldValue3,
                ]
                  .filter(Boolean)
                  .join(" + ")
              : ""}
          </span>
          <h1 className=" text-xl sm:text-2xl md:text-2xl font-semibold mt-1 mb-2 text-gray-900">
            {productData.name} {console.log("currentVariant", currentVariant)}
            {(() => {
              const parts = [
                currentVariant?.fieldValue1,
                currentVariant?.fieldValue2,
                currentVariant?.fieldValue3,
              ].filter(Boolean); // remove empty values

              return `(${parts.join(", ")})`;
            })()}
          </h1>

          <div className="flex items-center flex-wrap gap-2 mt-3">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
              <span className="pl-2">{rating || "5"}</span>
            </div>
            <span className="text-sm text-gray-500 hidden md:inline">|</span>
            <span className="text-sm text-gray-600 hidden md:inline">
              {"0 Reviews " || totalRatings}
            </span>
            <span className="text-sm text-gray-500 hidden md:inline">|</span>
            <a
              href="#rating"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline hidden md:inline"
            >
              {isAuth ? "Write a Review" : null}
            </a>
          </div>
        </div>
        {/* Price Section */}
        <div className="sm:mb-6 mb-4 p-4 bg-white shadow-md rounded-xl border border-gray-100">
          <div className="flex flex-row items-center gap-3 sm:gap-4">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                ₹{currentVariant.price?.toLocaleString("en-IN") || "99.00"}
              </span>
              {currentVariant.mrp &&
                currentVariant.mrp > currentVariant.price && (
                  <span className="text-gray-400 line-through text-sm sm:text-base">
                    ₹{currentVariant.mrp?.toLocaleString("en-IN") || "135.00"}
                  </span>
                )}
            </div>

            {/* Discount */}
            {discountPercentage > 0 && (
              <span className="px-3 py-1 w-fit rounded-lg bg-green-50 text-green-800 font-semibold text-sm sm:text-base">
                {discountPercentage}% OFF
              </span>
            )}

            {/* Stock */}
            <span
              className={` sm:mt-0 w-fit sm:ml-auto px-3 py-1 rounded-lg text-sm sm:text-base font-medium ${
                currentVariant.availablestock > 0
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {currentVariant.availablestock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Savings Info */}
          {discountPercentage > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              You save: ₹
              {(currentVariant.mrp - currentVariant.price).toFixed(2)}
            </div>
          )}

          {/* Optional Additional Info */}
          <div className="mt-3 text-gray-500 text-sm sm:text-base flex flex-wrap gap-2">
            <span>
              Country of Origin:{" "}
              <strong className="text-black">
                {productData.CountryofOrigin || "N/A"}
              </strong>
            </span>
            <span>
              Maximum Quantity:{" "}
              <strong className="text-black">
                {currentVariant.maximumQuantity || 1}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Render variant selectors dynamically - desktop */}
          {variantFields && (
            <div className="grid sm:grid-cols-3 gap-2 grid-cols-1">
              {variantFields.map((_, index) => (
                <div key={index} className="w-full ">
                  {renderVariantSelector(index)}
                </div>
              ))}
            </div>
          )}
          {/* Render variant summary - mobile */}
          {/* {renderVariantSummary()} */}
          <div className="flex flex-col gap-3 w-full bg-white shadow-lg rounded-2xl p-6">
            {/* Seller Name */}
            <div className="flex items-center gap-2">
              <span className="text-gray-800 text-base font-semibold">
                Seller:
              </span>
              <span
                onClick={handleClick}
                className="text-blue-600 font-medium cursor-pointer hover:underline transition"
              >
                {isNaN(productData?.shopName)
                  ? productData?.shopName
                  : "Ewshopping"}
              </span>
            </div>

            {/* Available Stock */}
            {currentVariant?.availablestock !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-gray-800 text-base font-semibold">
                  Available Stock:
                </span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    currentVariant.availablestock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentVariant.availablestock > 0
                    ? currentVariant.availablestock
                    : "Out of Stock"}
                </span>
              </div>
            )}
          </div>

          <div className="w-full bg-white shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row gap-8 border border-gray-100">
            {/* Highlights Section */}
            <div className="sm:w-1/2">
              <h2 className="text-lg sm:text-xl font-bold mb-4 font-sans pb-2 border-b border-gray-200 text-gray-800">
                Highlights
              </h2>
              <ul className="flex flex-col gap-3 mt-3">
                <li className="flex items-center py-2 border-b border-gray-100 hover:bg-gray-50 rounded-md transition">
                  <span className="font-semibold text-gray-700 w-36">
                    Brand Name
                  </span>
                  <span className="text-gray-600">{productData?.brand}</span>
                </li>
                {variantFields.map((fieldName, index) => {
                  if (!fieldName) return null;
                  const currentValue = selectedValues[`field${index + 1}`];
                  return (
                    <li
                      key={index}
                      className="flex  items-center py-2 border-b border-gray-100 hover:bg-gray-50 rounded-md transition"
                    >
                      <span className="font-semibold text-gray-700 w-36">
                        {fieldName}
                      </span>
                      <span className="text-gray-600">{currentValue}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Payment Options Section */}
            <div className="sm:w-1/2">
              <h2 className="text-lg sm:text-xl font-bold mb-4 font-sans pb-2 border-b border-gray-200 text-gray-800">
                Payment Options
              </h2>
              <ul className="flex flex-col gap-2 mt-3 text-gray-700 list-disc list-inside">
                <li className="hover:text-gray-900 transition">
                  Cash on Delivery
                </li>
                <li className="hover:text-gray-900 transition">
                  Net Banking & Credit/Debit/ATM Card
                </li>
              </ul>
            </div>
          </div>

          <DeliveryRange noof_delivery_days={productData.noof_delivery_days} />
          <div>
            {productData?.shortDescription && (
              <div className="flex flex-row gap-1">
                <div className="flex flex-row gap-2">
                  <div className="text-[#212121] text-base font-semibold">
                    Description:
                  </div>
                  <div className="text-[#212121] text-sm font-medium ">
                    {showMore ? productData?.shortDescription : shortText}
                    {isLong && !showMore && "..."}
                    {isLong && (
                      <button
                        className="text-blue-600 text-sm font-medium pl-5"
                        onClick={() => setShowMore(!showMore)}
                      >
                        {showMore ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Additional Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <span className="text-blue-600">🚚</span>
              <span className="text-sm">
                Free shipping on orders over{" "}
                <span className="font-medium">₹500</span>
              </span>
            </div>
          </div>
          <>
            {/* Coupon Section */}
            {/* <div className="bg-gradient-to-r from-green-50 to-cyan-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-start gap-3">
              <RiCoupon2Fill className="text-green-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-1">Special Offer</h3>
                <p className="text-sm text-gray-700">
                  Get extra 20% off up to ₹56 on 20 items. Price inclusive of
                  cashback/coupon.
                </p>
                <button
                  className="mt-2 text-sm text-green-700 font-medium hover:underline"
                  onClick={() => router.push("/termsAndCondition")}
                >
                  View Terms & Conditions
                </button>
              </div>
            </div>
          </div> */}
          </>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              Why Choose This Product?
            </h4>
            <p className="text-sn text-blue-700">
              Our products are carefully selected to ensure the highest quality
              standards. Each item goes through rigorous quality checks before
              reaching you.
            </p>
          </div>

          {/* specifications */}
          <div className="bg-white shadow-md rounded-2xl p-6 mt-4 border border-gray-100">
            {/* Header */}
            <div className="mb-6 border-b border-gray-200 pb-3">
              <h2 className="text-2xl font-bold text-gray-800 font-sans tracking-wide">
                Specifications
              </h2>
            </div>

            {/* Dynamic Sections */}
            {dynamicSections.map((section, idx) => (
              <ProductDetailSection
                key={idx}
                title={section.title}
                data={section.data}
                defaultOpen={idx === 0} // only first open initially
              />
            ))}

            {/* General Info */}
            {productData.length > 0 && productData?.CountryofOrigin && (
              <ProductDetailSection
                title="General Information"
                data={[
                  {
                    label: "Country of Origin",
                    value: productData?.CountryofOrigin,
                  },
                  ...(productData?.brand
                    ? [{ label: "Brand", value: productData?.brand }]
                    : []),
                ]}
                className="mb-4"
              />
            )}
          </div>

          <div className="space-y-8 p-6 rounded-2xl shadow-lg bg-white ">
            <div
              className="w-full flex flex-row justify-between items-center cursor-pointer"
              onClick={() =>
                setModelOpen((prev) =>
                  prev?.type === "ship" ? null : { type: "ship" }
                )
              }
            >
              <h3 className="text-base sm:text-xl font-semibold text-gray-800">
                Shipping & Returns
              </h3>
              {modelOpen?.type === "ship" ? (
                <FaAngleUp className="text-gray-500" />
              ) : (
                <FaAngleDown className="text-gray-500" />
              )}
            </div>

            {modelOpen?.type === "ship" && (
              <div className="space-y-4">
                {shippingReturnData.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h4 className=" text-base sm:text-lg font-semibold text-gray-800">
                      {section.title}
                    </h4>
                    {section.items ? (
                      <ul className="space-y-3">
                        {section.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start sm:text-base text-sm gap-3 text-gray-700"
                          >
                            <IoIosArrowForward className="text-blue-500 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 text-sm sm:text-base">
                        {section.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <ProductTabs />
        {/* Variant Modal - mobile */}
        {renderVariantModal()}
      </div>
    </>
  );
};

export default ProductDetails;
