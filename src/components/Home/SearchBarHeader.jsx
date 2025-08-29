"use client"
import { MdClose } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


const SearchBarHeader = ({ isSearchOpen, toggleSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set('q', searchQuery.trim());
      if (selectedCategory !== "0") {
        searchParams.set('category', selectedCategory);
      }
      router.push(`/searchresults?${searchParams.toString()}`);
      toggleSearch(); // Close the search modal
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <>
      <div
        className={` hidden sm:block fixed top-0 left-0 w-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out ${isSearchOpen ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold m-0">
              What are you looking for?
            </h3>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              onClick={toggleSearch}
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>
          <div className="search-body">
            <form className="form" id="header-search" onSubmit={handleSearch}>
              {/* Search Field */}
              <div className="flex w-full">
                <div className="search-category">
                  <select
                    className="border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2f415d] focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="0">All Categories</option>
                    <option value="1">- All</option>
                    <option value="2">- Fashion</option>
                    <option value="3">- Shoes</option>
                    <option value="4">- Electronic</option>
                    <option value="5">- Jewelry</option>
                    <option value="6">- Vegetables</option>
                    <option value="7">- Furniture</option>
                    <option value="8">- Accessories</option>
                  </select>
                </div>
                <div className="flex flex-1">
                  <input
                    type="text"
                    className="flex-1 border-t border-b border-gray-300 px-4 py-3 focus:outline-none"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="submit"
                    className="bg-[#2f415d] text-white px-6 py-3 rounded-r-lg hover:bg-[#1e2d42] transition-colors"
                  >
                    <IoSearchOutline className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {/* End Search Field */}

              {/* Search popular */}
              <div className="flex justify-center items-center mt-6">
                <span className="font-semibold mr-2">Trending Now:</span>
                <div className="flex flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("T-Shirt");
                      router.push("/searchresults?q=T-Shirt");
                      toggleSearch();
                    }}
                    className="text-gray-600 hover:text-[#2f415d] mx-1 transition-colors cursor-pointer"
                  >
                    T-Shirt,
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("Shoes");
                      router.push("/searchresults?q=Shoes");
                      toggleSearch();
                    }}
                    className="text-gray-600 hover:text-[#2f415d] mx-1 transition-colors cursor-pointer"
                  >
                    Shoes,
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("Bags");
                      router.push("/searchresults?q=Bags");
                      toggleSearch();
                    }}
                    className="text-gray-600 hover:text-[#2f415d] mx-1 transition-colors cursor-pointer"
                  >
                    Bags
                  </button>
                </div>
              </div>
              {/* End Search popular */}

              {/* Search products */}
              <div className=" search-products mt-8">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <li className="item empty w-full text-center text-gray-500 hidden">
                    You don't have any items in your search.
                  </li>
                  <li className="item">
                    <div className="flex items-center w-full">
                      <div className="w-20 h-28 flex-shrink-0">
                        <Link href="product-layout1.html">
                          <img
                            src="/assets/images/products/product1-120x170.jpg"
                            alt="Oxford Cuban Shirt"
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      </div>
                      <div className="ml-4">
                        <div className="product-name">
                          <Link
                            href="product-layout1.html"
                            className="text-gray-800 hover:text-[#2f415d]"
                          >
                            Oxford Cuban Shirt
                          </Link>
                        </div>
                        <div className="product-price mt-1">
                          <span className="line-through text-gray-500 mr-2">
                            ₹114.00
                          </span>
                          <span className="text-[#2f415d] font-semibold">
                            ₹99.00
                          </span>
                        </div>
                        <div className="product-review flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`icon ${i < 3 ? "text-yellow-400" : "text-gray-300"
                                } text-sm`}
                            >
                              ★
                            </i>
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            (3)
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="item">
                    <div className="flex items-center w-full">
                      <div className="w-20 h-28 flex-shrink-0">
                        <Link href="product-layout1.html">
                          <img
                            src="/assets/images/products/product2-120x170.jpg"
                            alt="Cuff Beanie Cap"
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      </div>
                      <div className="ml-4">
                        <div className="product-name">
                          <Link
                            href="product-layout1.html"
                            className="text-gray-800 hover:text-[#2f415d]"
                          >
                            Cuff Beanie Cap
                          </Link>
                        </div>
                        <div className="product-price mt-1">
                          <span className="text-[#2f415d] font-semibold">
                            ₹128.00
                          </span>
                        </div>
                        <div className="product-review flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className="text-yellow-400 text-sm">
                              ★
                            </i>
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            (9)
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="item">
                    <div className="flex items-center w-full">
                      <div className="w-20 h-28 flex-shrink-0">
                        <Link href="product-layout1.html">
                          <img
                            src="/assets/images/products/product3-120x170.jpg"
                            alt="Flannel Collar Shirt"
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      </div>
                      <div className="ml-4">
                        <div className="product-name">
                          <Link
                            href="product-layout1.html"
                            className="text-gray-800 hover:text-[#2f415d]"
                          >
                            Flannel Collar Shirt
                          </Link>
                        </div>
                        <div className="product-price mt-1">
                          <span className="text-[#2f415d] font-semibold">
                            ₹99.00
                          </span>
                        </div>
                        <div className="product-review flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`icon ${i < 4 ? "text-yellow-400" : "text-gray-300"
                                } text-sm`}
                            >
                              ★
                            </i>
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            (30)
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              {/* End Search products */}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBarHeader;
