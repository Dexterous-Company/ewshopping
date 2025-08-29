"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { IoIosArrowRoundBack, IoMdHeartDislike } from "react-icons/io";
import { IoHeartHalfSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserWishlist, removeFromWishlistServer } from "@/redux/wishlist/wishlistSlice";
import Link from "next/link";
import { addToCart } from "@/redux/cart/CartSlice";



const whishlist = [
  {
    Name: "Lasya Men's Flats",
    price: 184,
    mrp: "999",
    avilable: "currently unavilable",
    discount: "81% off",
    brand: "Ew Shopping",
    image:
      "https://rukminim2.flixcart.com/image/312/312/xif0q/sandal/r/k/5/10-las1785-10-layasa-black-original-imah3r7g3qxgzna7.jpeg?q=70",
  },
  {
    Name: "Lasya Men's Flats",
    price: 184,
    mrp: "999",
    discount: "81% off",
    brand: "Ew Shopping",
    image:
      "https://rukminim2.flixcart.com/image/312/312/xif0q/sandal/r/k/5/10-las1785-10-layasa-black-original-imah3r7g3qxgzna7.jpeg?q=70",
  },
  {
    Name: "Lasya Men's Flats",
    price: 184,
    mrp: "999",
    discount: "81% off",
    brand: "Ew Shopping",
    image:
      "https://rukminim2.flixcart.com/image/312/312/xif0q/sandal/r/k/5/10-las1785-10-layasa-black-original-imah3r7g3qxgzna7.jpeg?q=70",
  },
  {
    Name: "Lasya Men's Flats",
    price: 184,
    mrp: "999",
    discount: "81% off",
    brand: "Ew Shopping",
    image:
      "https://rukminim2.flixcart.com/image/312/312/xif0q/sandal/r/k/5/10-las1785-10-layasa-black-original-imah3r7g3qxgzna7.jpeg?q=70",
  },
];

const Coupons = () => {
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { CartItems } = useSelector((state) => state.cart);

  const { loginData, otp, mob, isAuth } = useSelector((store) => store.Athentication);
  const [model, setModel] = useState({ type: null, index: null });
  const router = useRouter();
  const dispatch = useDispatch()


  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isAuth && loginData?._id) {
      dispatch(fetchUserWishlist(loginData._id));
    }
  }, [isAuth, loginData?._id, dispatch]);

  const data = [
    {
      Name: "All Whishlist",
      count: isMounted ? (wishlistItems.length > 0 ? wishlistItems.length : 0) : 0,
      Icon: <FaHeart />,
    },
    {
      Name: "Expired ",
      count: 0,
      Icon: <IoMdHeartDislike />,
    },
    {
      Name: "Available",
      count: isMounted ? (wishlistItems.length > 0 ? wishlistItems.length : 0) : 0,
      Icon: <IoHeartHalfSharp />,
    },
  ];
  const [whislistObject, setWhislistObject] = useState('')

  const handlewishlistDelete = async (item) => {
    await dispatch(removeFromWishlistServer({
      userId: loginData._id, ProductId: item.ProductId,
      AttributeId: item.AttributeId
    })).unwrap();
  }
  const handleDelete = async () => {
    if (whislistObject) {
      await dispatch(removeFromWishlistServer({
        userId: loginData._id, ProductId: whislistObject.ProductId,
        AttributeId: whislistObject.AttributeId
      })).unwrap();
    }
  }
  const handleAddTOCart = (item) => {
    if (item) {
      const cartItem = {
        AttributeId: item?.AttributeId,
        Mrp: item?.Mrp,
        Price: item?.Price,
        name: item?.ProductName,
        thumbnail: item?.thumbnail,
        shopId: item?.shopId,
        shopName: item?.shopName,
        slugurl: item?.productSlug,
      }
      dispatch(addToCart(cartItem));
      router.push('/cart')
    }
  }
  return (
    <div className="sm:px-4 px-2 relative py-2 w-full sm:h-[70vh] sm:mb-0 mb-10 overflow-y-auto">
      <h1 className="font-semibold flex flex-row items-center gap-2 text-lg text-[#2f415d] mb-4">
        <span className="block sm:hidden" onClick={() => router.back("")}>
          <IoIosArrowRoundBack size={30} />
        </span>
        <span>Manage Your Whislist</span>
      </h1>
      <div className="grid sm:grid-cols-4  grid-cols-2 gap-4">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl text-[#2f415d]">{item.Icon}</div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[#2f415d]">
                  {item.Name}
                </span>
                <span className="text-xs text-gray-500">
                  Total: {item.count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="sm:mt-5 mt-3 sm:px-4 px-2 py-3 sm:shadow-md shadow-sm w-full flex-wrap flex flex-row sm:flex-col gap-3 sm:gap-4">
        {wishlistItems.length > 0 ? (
          <>
            {wishlistItems.map((item, index) => (
              <div
                key={index}
                className={`flex flex-row flex-wrap sm:flex-col justify-between ${index && "hover:bg-gray-300"} sm:w-full items-start border  border-gray-300 sm:p-4 rounded-md w-[40vw] transition-all duration-150 cursor-pointer hover:shadow-md hover:bg-gray-50`}
              >
                <div className="flex flex-col sm:flex-row sm:gap-3 items-start w-full">
                  <div className="flex relative flex-row justify-between items-center">
                    <img
                      src={item?.thumbnail}
                      className="sm:h-20 sm:w-28 h-40 w-full rounded-xs object-cover"
                    />
                    <div
                      className="sm:hidden block relative "
                      onClick={() => {
                        setModel({ type: "dot", index: null })
                        setWhislistObject(item)
                      }}
                    >
                      <div className="absolute -top-18 right-2 z-[30]">
                        <span className="flex flex-row h-8 w-8 rounded-full bg-white justify-center items-center">
                          <HiDotsVertical size={15} />
                        </span>
                      </div>
                    </div>
                    <span className="absolute text-[#e96184] bg-white text-xs text-center bottom-0">
                      {item.avilable}
                    </span>
                  </div>
                  <div className="flex flex-col sm:py-0 py-2 sm:px-0 px-3 w-full ">
                    {/* href={`/product/${item.}`} */}
                    <Link href={`/product/${item.productSlug}`}>
                      <span className="text-gray-400 font-medium text-xs sm:text-[1rem]">
                        {item.ProductName?.length > 30
                          ? item.ProductName.slice(0, 30) + "..."
                          : item.ProductName}
                      </span>
                    </Link>
                    <div className="flex flex-row gap-2 items-center">
                      <span className="text-sm line-through text-gray-500 font-medium">
                        ₹{item.Mrp}
                      </span>
                      <span className="text-[0.9rem]  text-green-700 font-semibold">
                        ₹{item.Mrp - item.Price}
                      </span>
                    </div>
                    <span className="text-lg text-black font-semibold">
                      ₹{item.Price}
                    </span>
                  </div>
                  <div className="flex sm:max-w-[20vw] w-full sm:mb-0 mb-2 sm:px-0 px-3 flex-col gap-4 sm:justify-between items-center sm:items-end">
                    <button
                      className={`whitespace-nowrap w-full sm:w-1/2 px-4 py-2 sm:py-1 font-semibold text-sm cursor-pointer ${CartItems.some(cartItem => cartItem.AttributeId === item.AttributeId)
                        ? "bg-green-600 text-white"
                        : "bg-[#2f415d] text-white"
                        }`}
                      onClick={() => {
                        if (!CartItems.some(cartItem => cartItem.AttributeId === item.AttributeId)) {
                          handleAddTOCart(item);
                        } else {
                          router.push("/cart");
                        }
                      }}
                    >
                      {CartItems.some(cartItem => cartItem.AttributeId === item.AttributeId)
                        ? "Go to Cart"
                        : "Add to Cart"}
                    </button>
                    <span className="text-gray-600 hidden sm:block font-medium text-2xl" onClick={() => handlewishlistDelete(item)}>
                      <MdDelete />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full min-h-[200px] text-center py-10">
            <FaRegHeart className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold">Your wishlist is empty</h3>
            <p className="text-sm text-gray-500 mb-4">
              Save items you love for later. When you add favourites, they’ll
              appear here.
            </p>
            <Link href={'/'}>
              <button
                className="px-4 py-2 bg-[#2f415d] text-white rounded-md">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
      {model.type === "dot" && (
        <div
          className="fixed bg-black/30 inset-0 z-[50] flex justify-center items-center"
          onClick={() => setModel({ type: null, index: null })}
        >
          <div
            className="bg-white p-5 rounded-lg shadow-lg flex items-center gap-3"
            onClick={(e) => handleDelete(e)}
          >
            <span className="text-red-500 text-xl">
              <MdDelete />
            </span>
            <span className="font-semibold text-base">
              Remove from wishlist
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
