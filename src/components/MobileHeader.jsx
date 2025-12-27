import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Lucide React imports
import { Search, Home, ShoppingCart, ChevronLeft } from "lucide-react";

const MobileHeader = () => {
  const { CartItems = [] } = useSelector((state) => state.cart) || {};
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="py-3 px-4 bg-gradient-to-r from-[#E30047] to-[#a30034] border-b border-white/20 sticky top-0 z-[9999] w-full shadow-lg">
      <div className="flex flex-row items-center w-full gap-3">
        {/* Home Button */}
        <Link
          href={"/"}
          className="flex flex-row items-center text-center p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 border border-white/30 backdrop-blur-sm"
        >
          <Home className="size-5 text-white" />
        </Link>

        {/* Search Bar */}
        <div className="flex p-1 rounded-xl bg-white w-full flex-row justify-between items-center border border-white/30 backdrop-blur-sm">
          <button
            onClick={() => window.history.back()}
            className="rounded-lg hover:bg-white/30 w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="size-5 text-white" />
          </button>

          <Link
            href={"/searchmobile"}
            className="flex flex-row justify-between items-center w-full ml-2"
          >
            <input
              type="search"
              placeholder="Search products and more..."
              className="w-full outline-0 text-sm bg-transparent text-white placeholder-gray-500 font-medium"
              readOnly
            />
            <Search className="size-5 text-white mr-2" />
          </Link>
        </div>

        {/* Cart Button */}
        <Link
          href={"/cart"}
          className="flex flex-row items-center relative text-center p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-200 border border-white/30 backdrop-blur-sm"
        >
          <div className="relative">
            <ShoppingCart className="size-5 text-white" />
            <span
              className={`absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border border-white/50 ${
                isMounted && CartItems.length > 0
                  ? "bg-white/30 shadow-md backdrop-blur-sm"
                  : "bg-white/20"
              }`}
            >
              {isMounted ? (CartItems.length > 0 ? CartItems.length : 0) : 0}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default MobileHeader;