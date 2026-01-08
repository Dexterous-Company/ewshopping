"use client";
import React, { useState, useEffect } from "react";
import { IoStar } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedVariant } from "../../redux/product/productSlice";
import { useRouter } from "next/navigation";
import { FaAngleDown, FaAngleRight, FaAngleUp, FaCheck } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import ProductTabs from "./TabsListing";
import { TbTruckDelivery } from "react-icons/tb";
import { toast } from "react-toastify";
import { addToCart, decrementCart } from "../../redux/cart/CartSlice";

// Add this utility function at the top
const getStockStatus = (stockCount) => {
  if (stockCount <= 0) {
    return { 
      text: "Out of Stock", 
      color: "red", 
      className: "bg-red-100 text-red-800 border border-red-200" 
    };
  } else if (stockCount <= 10) {
    return { 
      text: "Few Left", 
      color: "orange", 
      className: "bg-orange-100 text-orange-800 border border-orange-200" 
    };
  } else if (stockCount <= 20) {
    return { 
      text: "In Stock", 
      color: "blue", 
      className: "bg-blue-100 text-blue-800 border border-blue-200" 
    };
  } else {
    return { 
      text: "In Stock", 
      color: "emerald", 
      className: "bg-emerald-100 text-emerald-800 border border-emerald-200" 
    };
  }
};

const ProductDetailsSkeleton = () => {
  return (
    <div className="w-full max-w-3xl mx-auto font-sans bg-white text-gray-800 px-4 py-6 animate-pulse">
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

      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/5 ml-auto"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>

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
    </div>
  );
};

const ProductDetailSection = ({ title, data, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full h-fit mb-4 divide-y divide-gray-200 font-sans">
      <div
        className="flex justify-between items-center font-medium cursor-pointer py-3 hover:bg-gray-50 rounded-lg px-3 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-base sm:text-lg font-semibold text-slate-800">
          {title || "General"}
        </span>
        {isOpen ? (
          <FaAngleUp className="text-blue-500" />
        ) : (
          <FaAngleDown className="text-blue-500" />
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300`}
        style={{ maxHeight: isOpen ? `${data?.length * 100}px` : "0px" }}
      >
        <table className="w-full mt-2">
          <tbody>
            {data &&
              data.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <th className="py-3 pr-4 font-medium text-blue-600 text-left w-1/3 text-sm sm:text-base">
                    {item.label}
                  </th>
                  <td className="py-3 text-slate-700 text-sm sm:text-base">
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

const DeliveryRange = () => {
  const now = new Date();

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const startDate = new Date();
  startDate.setDate(now.getDate() + 7);

  const endDate = new Date();
  endDate.setDate(now.getDate() + 10);

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border border-blue-200 rounded-xl flex items-center gap-3 sm:gap-4">
      <div className="flex-shrink-0 text-blue-500 text-2xl">
        <TbTruckDelivery />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className="text-slate-700 font-medium text-sm sm:text-base">
          Delivery:
        </span>
        <span className="text-blue-600 font-semibold text-sm sm:text-base">
          {formatDate(startDate)} to {formatDate(endDate)}
        </span>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { rating, totalRatings } = useSelector((state) => state.reviews);
  const { CartItems } = useSelector((state) => state.cart);
  const { isAuth } = useSelector((state) => state.Athentication);

  const dispatch = useDispatch();
  const [modelOpen, setModelOpen] = useState({ type: "ship" });
  const router = useRouter();
  const { product, selectedVariant, status } = useSelector(
    (state) => state.info
  );

  const [tempSelection, setTempSelection] = useState({
    field1: "",
    field2: "",
    field3: "",
  });
  const productData = product?.[0] || {};

  const variants = productData?.simpleAttributes || [];
  const currentVariant = variants[selectedVariant] || {};

  const [showMore, setShowMore] = useState(false);

  const words = productData?.shortDescription?.split(" ") || [];
  const shortText = words.slice(0, 30).join(" ");
  const isLong = words.length > 30;

  // FIXED: Use root stock from productData, not variant stock
  const rootStock = productData?.availablestock || 0;
  const stockStatus = getStockStatus(rootStock);
  const isOutOfStock = stockStatus.text === "Out of Stock";

  const getValidImageSrc = (src) => {
    return src && src.trim() !== "" ? src : "https://via.placeholder.com/64";
  };

  const handleClick = () => {
    const sellerName = productData?.shopName;
    const url = `/sellerproduct?sellername=${encodeURIComponent(sellerName)}`;
    router.push(url);
  };

  const variantFields = [
    productData.fieldname1,
    productData.fieldname2,
    productData.fieldname3,
  ].filter(Boolean);

  const [selectedValues, setSelectedValues] = useState({
    field1: "",
    field2: "",
    field3: "",
  });

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

  const handleApplyVariant = (newValues) => {
    setSelectedValues(newValues);
    setTempSelection(newValues);
  };

  const handleAddToCart = async () => {
    if (!productData || !currentVariant) {
      toast.error("Product information is missing");
      return;
    }

    if (isOutOfStock) {
      toast.error("Product is out of stock!");
      return;
    }

    // Check root stock
    if (rootStock <= 0) {
      toast.error("Product is out of stock!");
      return;
    }

    const cartItemInStore = CartItems?.find(
      (item) => item.AttributeId === currentVariant._id
    );
    const quantity = cartItemInStore?.cart_Quentity || 0;

    if (quantity >= currentVariant.maximumQuantity) {
      toast.error(
        `Maximum ${currentVariant.maximumQuantity} products allowed!`
      );
      return;
    }

    // Also check if quantity exceeds available stock
    if (quantity >= rootStock) {
      toast.error(`Only ${rootStock} items available in stock!`);
      return;
    }

    const cartItem = {
      AttributeId: currentVariant._id,
      Mrp: currentVariant.mrp,
      Price: currentVariant.price,
      name: productData.name,
      thumbnail: currentVariant.thumbnail,
      // Keep shopId for internal tracking but don't show to users
      shopId: productData.shopId,
      // Don't include shopName in cart item
      slugurl: productData.slugUrl,
      availableStock: rootStock, // Use root stock here
      maximumQuantity: Math.min(currentVariant?.maximumQuantity || 3, rootStock), // Ensure maximum doesn't exceed stock
      variantDetails: {
        fieldValue1: currentVariant.fieldValue1,
        fieldValue2: currentVariant.fieldValue2,
        fieldValue3: currentVariant.fieldValue3,
      },
    };

    dispatch(addToCart(cartItem));
    toast.success("Product added to cart!");
  };

  const handleDecrementToCart = () => {
    if (!productData || !currentVariant) {
      toast.error("Product information is missing");
      return;
    }

    if (isOutOfStock) {
      toast.error("Product is out of stock!");
      return;
    }

    const cartItem = CartItems?.find(
      (item) => item.AttributeId === currentVariant._id
    );

    if (!cartItem) {
      toast.error("Item not found in cart!");
      return;
    }

    if (cartItem.cart_Quentity > 0) {
      dispatch(decrementCart({ AttributeId: currentVariant._id }));

      if (cartItem.cart_Quentity === 1) {
        toast.success("Product removed from cart!");
      } else {
        toast.success("Product quantity decreased!");
      }
    }
  };

  const handleBuyNow = async () => {
    if (!productData || !currentVariant) {
      toast.error("Product information is missing");
      return;
    }

    if (isOutOfStock) {
      toast.error("Product is out of stock!");
      return;
    }

    // Check root stock
    if (rootStock <= 0) {
      toast.error("Product is out of stock!");
      return;
    }

    const cartItem = CartItems?.find(
      (item) => item.AttributeId === currentVariant._id
    );

    if (!cartItem) {
      await handleAddToCart();
    }

    router.push("/cart");
  };

  const discountPercentage =
    currentVariant.price && currentVariant.mrp
      ? Math.round((1 - currentVariant.price / currentVariant.mrp) * 100)
      : 0;

  const renderStars = (ratingValue) => {
    const ratingNum = ratingValue != null ? ratingValue : 5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <IoStar key={i} className="text-amber-500 text-sm md:text-base" />
      );
    }
    return stars;
  };

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

  const getVariantByValues = (field1, field2, field3) => {
    return variants.find(
      (v) =>
        v.fieldValue1 === field1 &&
        v.fieldValue2 === field2 &&
        v.fieldValue3 === field3
    );
  };

  const getVariantImageForOption = (fieldIndex, option, filterValues = {}) => {
    const filteredVariants = variants.filter((variant) => {
      if (fieldIndex === 0) {
        return variant.fieldValue1 === option;
      } else if (fieldIndex === 1) {
        return (
          variant.fieldValue2 === option &&
          (filterValues.fieldValue1
            ? variant.fieldValue1 === filterValues.fieldValue1
            : true)
        );
      } else if (fieldIndex === 2) {
        return (
          variant.fieldValue3 === option &&
          (filterValues.fieldValue1
            ? variant.fieldValue1 === filterValues.fieldValue1
            : true) &&
          (filterValues.fieldValue2
            ? variant.fieldValue2 === filterValues.fieldValue2
            : true)
        );
      }
      return false;
    });

    return filteredVariants[0]?.thumbnail || currentVariant?.thumbnail;
  };

  const renderVariantSelector = (fieldIndex) => {
    const fieldName = variantFields[fieldIndex];
    if (!fieldName) return null;

    const filterValues = {};
    if (fieldIndex > 0) filterValues.fieldValue1 = selectedValues.field1;
    if (fieldIndex > 1) {
      filterValues.fieldValue1 = selectedValues.field1;
      filterValues.fieldValue2 = selectedValues.field2;
    }

    const options = getUniqueValues(fieldIndex, filterValues);
    const currentValue = selectedValues[`field${fieldIndex + 1}`];
    const isColorField = fieldName.toLowerCase().includes("color");

    // Check if option is selectable based on dependent fields
    const isOptionSelectable = (option) => {
      if (fieldIndex === 0) return true;

      const testValues = { ...selectedValues };
      testValues[`field${fieldIndex + 1}`] = option;

      // Check if there's a variant that matches all selected values
      const matchingVariant = variants.find(
        (v) =>
          v.fieldValue1 ===
            (fieldIndex >= 0 ? testValues.field1 : v.fieldValue1) &&
          v.fieldValue2 ===
            (fieldIndex >= 1 ? testValues.field2 : v.fieldValue2) &&
          v.fieldValue3 ===
            (fieldIndex >= 2 ? testValues.field3 : v.fieldValue3)
      );

      return !!matchingVariant;
    };

    return (
      <div className="hidden md:block" key={fieldIndex}>
        <div className="flex items-center mb-3">
          <h3 className="text-sm font-medium text-gray-700 mr-2">
            {fieldName}:
          </h3>
          <span className="text-sm font-semibold text-blue-600">
            {currentValue}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {options.map((option, index) => {
            const variantImage = getVariantImageForOption(
              fieldIndex,
              option,
              filterValues
            );
            const isSelected = currentValue === option;
            const selectable = isOptionSelectable(option);

            return (
              <button
                key={index}
                onClick={() => {
                  if (selectable) {
                    setSelectedValues((prev) => ({
                      ...prev,
                      [`field${fieldIndex + 1}`]: option,
                    }));
                  }
                }}
                disabled={!selectable}
                className={`
                ${isColorField ? "p-1" : "px-3 py-2"}
                border rounded-md transition-all flex items-center justify-center
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : selectable
                    ? "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    : "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                }
                ${isColorField ? "flex-col" : ""}
              `}
                aria-label={`Select ${option}`}
                aria-disabled={!selectable}
              >
                {isColorField ? (
                  <>
                    <div
                      className={`w-12 h-12 rounded-md overflow-hidden border ${
                        isSelected ? "border-blue-500" : "border-gray-200"
                      } mb-1`}
                    >
                      <img
                        src={getValidImageSrc(variantImage)}
                        alt={option}
                        className={`w-full h-full object-cover ${
                          !selectable ? "grayscale" : ""
                        }`}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`text-xs ${
                          isSelected
                            ? "text-blue-600 font-medium"
                            : selectable
                            ? "text-gray-700"
                            : "text-gray-400"
                        }`}
                      >
                        {option}
                      </span>
                      {isSelected && (
                        <FaCheck className="text-blue-500 ml-1 text-xs" />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center">
                    <span
                      className={`text-sm ${
                        isSelected
                          ? "text-blue-600 font-medium"
                          : selectable
                          ? "text-gray-700"
                          : "text-gray-400"
                      }`}
                    >
                      {option}
                    </span>
                    {isSelected && (
                      <FaCheck className="text-blue-500 ml-2 text-sm" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (status === "loading" || !product || product.length === 0) {
    return <ProductDetailsSkeleton />;
  }

  const filterfieldsHighlights = [];
  productData?.filteredFields?.forEach((item) => {
    let group = filterfieldsHighlights.find((g) => g.tag === item.tag);
    if (!group) {
      group = { tag: item.tag, fields: [] };
      filterfieldsHighlights.push(group);
    }
    group.fields.push({
      name: item.name,
      value: item.value,
    });
  });

  const dynamicGeneralFields = [];
  productData?.generalFields?.forEach((item) => {
    let group = dynamicGeneralFields.find((g) => g.tag === item.tag);
    if (!group) {
      group = { tag: item.tag, fields: [] };
      dynamicGeneralFields.push(group);
    }
    group.fields.push({
      name: item.name,
      value: item.value,
    });
  });

  const newFiltereddData = [...dynamicGeneralFields, ...filterfieldsHighlights];
  const dynamicSections =
    newFiltereddData &&
    newFiltereddData.map((field) => ({
      title: field?.tag,
      data: field?.fields
        ?.filter((item) => item?.value && item?.value.trim() !== "")
        .map((item) => ({
          label: item?.name,
          value: item?.value,
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
        <div className="md:hidden bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
          <div className="p-4">
            {variantFields.map((fieldName, fieldIndex) => {
              if (!fieldName) return null;

              const filterValues = {};
              for (let i = 0; i < fieldIndex; i++) {
                filterValues[`fieldValue${i + 1}`] = tempSelection[`field${i + 1}`];
              }

              const options = getUniqueValues(fieldIndex, filterValues);
              const currentValue = tempSelection[`field${fieldIndex + 1}`];
              const isColorField = fieldName.toLowerCase().includes("color");

              const isOptionSelectable = (option) => {
                if (fieldIndex === 0) return true;

                const testValues = { ...tempSelection };
                testValues[`field${fieldIndex + 1}`] = option;

                const matchingVariant = variants.find((v) => {
                  return (
                    v.fieldValue1 === (testValues.field1 ?? v.fieldValue1) &&
                    v.fieldValue2 === (testValues.field2 ?? v.fieldValue2) &&
                    v.fieldValue3 === (testValues.field3 ?? v.fieldValue3)
                  );
                });

                return !!matchingVariant;
              };

              return (
                <div key={fieldIndex} className="mb-6">
                  <h4 className="text-gray-900 mb-3 text-sm font-normal">
                    <span className="font-semibold">Select {fieldName}:</span> {currentValue}
                  </h4>

                  {/* Scrollable container for options */}
                  <div className="overflow-x-auto pb-2">
                    <div className="flex gap-2 min-w-max">
                      {options.map((option, index) => {
                        const variantImage = getVariantImageForOption(
                          fieldIndex,
                          option,
                          filterValues
                        );

                        const isSelected = currentValue === option;
                        const selectable = isOptionSelectable(option);

                        return (
                          <button
                            key={index}
                            onClick={() => {
                              if (!selectable) return;

                              const newTempSelection = {
                                ...tempSelection,
                                [`field${fieldIndex + 1}`]: option,
                              };

                              setTempSelection(newTempSelection);
                              handleApplyVariant(newTempSelection);
                            }}
                            disabled={!selectable}
                            className={`
                              ${isColorField ? "p-1" : "py-3 px-4"}
                              border rounded-lg transition-all flex flex-col items-center justify-center
                              ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50"
                                  : selectable
                                  ? "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                  : "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                              }
                              ${isColorField ? "" : "h-12"}
                              ${isColorField ? "w-20" : "min-w-15"}
                            `}
                          >
                            {isColorField ? (
                              <div
                                className={`w-full aspect-square rounded-md flex items-center justify-center overflow-hidden border ${
                                  isSelected ? "border-blue-500" : "border-gray-200"
                                } mb-1`}
                              >
                                <img
                                  src={getValidImageSrc(variantImage)}
                                  alt={option}
                                  className={`w-full h-full object-cover ${
                                    !selectable ? "grayscale" : ""
                                  }`}
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <span
                                  className={`text-sm ${
                                    isSelected
                                      ? "text-blue-600 font-medium"
                                      : selectable
                                      ? "text-gray-700"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {option}
                                </span>
                      
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="w-full mx-auto font-sans bg-white text-gray-800">
        <div className="px-4 pt-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
            {productData.name}
            {(() => {
              const parts = [
                currentVariant?.fieldValue1,
                currentVariant?.fieldValue2,
                currentVariant?.fieldValue3,
              ].filter(Boolean);
              return parts.length > 0 ? ` (${parts.join(", ")})` : "";
            })()}
          </h1>

          <div className="flex items-center flex-wrap gap-3 mb-3">
            <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
              <div className="flex items-center">{renderStars(rating)}</div>
              <span className="ml-2 text-sm font-medium text-blue-700">
                {rating || "5"} Ratings
              </span>
            </div>
            
            {/* Show reviews count only if greater than 0 */}
            {totalRatings > 0 && (
              <>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-gray-600">
                  {totalRatings} Reviews
                </span>
              </>
            )}
          </div>
        </div>

        <div className="px-4">
          {/* Price Section */}
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm rounded-xl border border-blue-200">
            <div className="flex flex-row items-center gap-3 sm:gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                  ₹{currentVariant.price?.toLocaleString("en-IN") || "99.00"}
                </span>
                {currentVariant.mrp &&
                  currentVariant.mrp > currentVariant.price && (
                    <span className="text-gray-500 line-through text-sm sm:text-base">
                      ₹{currentVariant.mrp?.toLocaleString("en-IN") || "135.00"}
                    </span>
                  )}
              </div>

              {discountPercentage > 0 && (
                <span className="px-3 py-1 w-fit rounded-lg bg-emerald-500 text-white font-semibold text-xs sm:text-base">
                  {discountPercentage}% OFF
                </span>
              )}

              {/* Updated Stock Status with ranges - Now shows "Out of Stock" */}
              <span
                className={`sm:mt-0 w-fit sm:ml-auto px-3 py-1 rounded-lg text-xs sm:text-base font-medium ${stockStatus.className}`}
              >
                {stockStatus.text}
              </span>
            </div>

            {discountPercentage > 0 && (
              <div className="mt-2 text-sm text-slate-700">
                You save: ₹
                {(currentVariant.mrp - currentVariant.price).toFixed(2)}
              </div>
            )}
          </div>

          {/* Desktop Variant Selectors */}
          {variantFields && (
            <div className="hidden md:block mb-6">
              {variantFields.map((_, index) => (
                <div key={index} className="w-full">
                  {renderVariantSelector(index)}
                </div>
              ))}
            </div>
          )}

          {/* Seller Info - Shows "See Shop Products" instead of actual seller name */}
          <div className="mb-4 p-4 bg-white shadow-sm rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-slate-700 text-base font-semibold">
                Seller:
              </span>
              <span
                onClick={handleClick}
                className="text-blue-600 font-medium cursor-pointer hover:underline transition"
              >
                See Shop Products
              </span>
            </div>

            {/* Show Available Stock with range-based status */}
            {rootStock !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-slate-700 text-base font-semibold">
                  Available Stock:
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${stockStatus.className}`}>
                  {stockStatus.text}
                </span>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div className="mb-4 p-4 bg-white shadow-sm rounded-xl border border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold mb-4 font-sans pb-2 border-b border-gray-200 text-slate-800">
              Highlights
            </h2>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-slate-700 w-36">
                  Brand Name
                </span>
                <span className="text-blue-600">
                  {productData?.brand || "N/A"}
                </span>
              </li>
              {variantFields.map((fieldName, index) => {
                if (!fieldName) return null;
                const currentValue = selectedValues[`field${index + 1}`];
                return (
                  <li
                    key={index}
                    className="flex items-center py-2 border-b border-gray-200"
                  >
                    <span className="font-semibold text-slate-700 w-36">
                      {fieldName}
                    </span>
                    <span className="text-blue-600">{currentValue}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <DeliveryRange />

          {/* Description */}
          {productData?.shortDescription && (
            <div className="mb-4 p-4 bg-white shadow-sm rounded-xl border border-gray-200">
              <div className="text-slate-700 text-base font-semibold mb-2">
                Description:
              </div>
              <div className="text-slate-600 text-sm font-medium">
                {showMore ? productData?.shortDescription : shortText}
                {isLong && !showMore && "..."}
                {isLong && (
                  <button
                    className="text-blue-600 text-sm font-medium pl-2 hover:text-blue-700"
                    onClick={() => setShowMore(!showMore)}
                  >
                    {showMore ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Specifications */}
          {dynamicSections.length > 0 && (
            <div className="bg-white shadow-sm rounded-xl p-4 mb-4 border border-gray-200">
              <div className="mb-4 border-b border-gray-200 pb-3">
                <h2 className="text-xl font-bold text-slate-800 font-sans">
                  Specifications
                </h2>
              </div>

              {dynamicSections.map((section, idx) => (
                <ProductDetailSection
                  key={idx}
                  title={section.title}
                  data={section.data}
                  defaultOpen={idx === 0}
                />
              ))}
            </div>
          )}

          {/* Shipping & Returns */}
          <div className="space-y-4 p-4 rounded-xl shadow-sm bg-white border border-gray-200 mb-4">
            <div
              className="w-full flex flex-row justify-between items-center cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
              onClick={() =>
                setModelOpen((prev) =>
                  prev?.type === "ship" ? null : { type: "ship" }
                )
              }
            >
              <h3 className="text-base sm:text-xl font-semibold text-slate-800">
                Shipping & Returns
              </h3>
              {modelOpen?.type === "ship" ? (
                <FaAngleUp className="text-blue-500" />
              ) : (
                <FaAngleDown className="text-blue-500" />
              )}
            </div>

            {modelOpen?.type === "ship" && (
              <div className="space-y-4">
                {shippingReturnData.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-base sm:text-lg font-semibold text-slate-800">
                      {section.title}
                    </h4>
                    {section.items ? (
                      <ul className="space-y-2">
                        {section.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start sm:text-base text-sm gap-3 text-slate-700"
                          >
                            <IoIosArrowForward className="text-blue-500 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-700 text-sm sm:text-base">
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
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 z-[100] mt-4 p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-row gap-3 mb-1">
          {(() => {
            const cartItem = CartItems.find(
              (item) => item.AttributeId === currentVariant._id
            );
            const quantity = cartItem?.cart_Quentity || 0;
            const isOutOfStock = stockStatus.text === "Out of Stock";
            return quantity === 0 ? (
              <button
                className={`flex-1 font-medium sm:text-base text-sm py-3 md:py-4 px-4 md:px-6 rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                }`}
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "🛒 Out of Stock" : "🛒 ADD TO CART"}
              </button>
            ) : (
              <div
                className={`flex-1 font-medium py-2 px-4 md:px-6 rounded-lg shadow-sm transition-all duration-300 flex items-center justify-between gap-2 ${
                  isOutOfStock
                    ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <button
                  onClick={handleDecrementToCart}
                  className="bg-blue-700 px-3 py-1 rounded-md hover:bg-blue-800 transition-colors"
                  disabled={isOutOfStock}
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-700 px-3 py-1 rounded-md hover:bg-blue-800 transition-colors"
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>
            );
          })()}

          <button
            className={`flex-1 font-medium py-3 md:py-4 px-4 md:px-6 sm:text-base text-sm rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? "bg-gray-400 text-white cursor-not-allowed opacity-60"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md"
            }`}
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            ⚡ BUY NOW
          </button>
        </div>
      </div>
    </>
  );
};


export default ProductDetails;