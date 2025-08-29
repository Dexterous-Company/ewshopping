

// import React from 'react'

// const SideFilteringCode = () => {
//     return (
//         <div>
//             <div className="col-12 col-sm-12 col-md-12 lg:w-3/12 bg-gray-50 ">
//                 <div className="p-4">
//                     {/* Close Filter Button (mobile only) */}
//                     <div className="closeFilter block lg:hidden text-right">
//                         <i className="fas fa-times" />
//                     </div>
//                     {/* Filter By Section */}
//                     <div className="mb-6">
//                         <div className="widget-title mb-3">
//                             <h2 className="text-lg font-semibold">Filter By</h2>
//                         </div>
//                         <div className="widget-content">
//                             <ul className="flex flex-wrap gap-2 mb-3">
//                                 <li>
//                                     <a href="#" className="inline-block px-3 py-1 rounded-full bg-gray-200 text-sm">
//                                         <span>Women</span>
//                                         <i className="fas fa-times ml-1" />
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="inline-block px-3 py-1 rounded-full bg-gray-200 text-sm">
//                                         <span>Blue</span>
//                                         <i className="fas fa-times ml-1" />
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#" className="inline-block px-3 py-1 rounded-full bg-gray-200 text-sm">
//                                         <span>XL</span>
//                                         <i className="fas fa-times ml-1" />
//                                     </a>
//                                 </li>
//                             </ul>
//                             <a href="#" className="text-sm text-blue-500 hover:text-blue-700">Clear All</a>
//                         </div>
//                     </div>
//                     {/* Categories Section */}
//                     <div className="mb-6">
//                         <div className="widget-title mb-3">
//                             <h2 className="text-lg font-semibold">Categories</h2>
//                         </div>
//                         <div className="widget-content">
//                             <ul className="space-y-2">
//                                 <li className="group">
//                                     <a href="#" className="flex justify-between items-center font-medium">
//                                         <span>Clothing</span>
//                                         <i className="fas fa-chevron-down text-xs" />
//                                     </a>
//                                     <ul className="ml-4 mt-1 hidden group-hover:block">
//                                         <li className="group-sub">
//                                             <a href="#" className="flex justify-between items-center">
//                                                 <span>Men</span>
//                                                 <i className="fas fa-chevron-down text-xs" />
//                                             </a>
//                                             <ul className="ml-4 hidden group-sub-hover:block">
//                                                 <li><a href="#" className="text-sm">Shirt <span className="text-gray-500">(25)</span></a></li>
//                                                 <li><a href="#" className="text-sm">Jeans <span className="text-gray-500">(6)</span></a></li>
//                                                 <li><a href="#" className="text-sm">Shoes <span className="text-gray-500">(9)</span></a></li>
//                                             </ul>
//                                         </li>
//                                         <li><a href="#" className="text-sm">Women <span className="text-gray-500">(14)</span></a></li>
//                                         <li><a href="#" className="text-sm">Child <span className="text-gray-500">(26)</span></a></li>
//                                     </ul>
//                                 </li>
//                                 <li className="group">
//                                     <a href="#" className="flex justify-between items-center font-medium">
//                                         <span>Jewellery</span>
//                                         <i className="fas fa-chevron-down text-xs" />
//                                     </a>
//                                     <ul className="ml-4 mt-1 hidden group-hover:block">
//                                         <li><a href="#" className="text-sm">Ring <span className="text-gray-500">(12)</span></a></li>
//                                         <li><a href="#" className="text-sm">Necklaces <span className="text-gray-500">(15)</span></a></li>
//                                         <li><a href="#" className="text-sm">Earrings <span className="text-gray-500">(18)</span></a></li>
//                                     </ul>
//                                 </li>
//                                 <li><a href="#" className="text-sm">Accessories <span className="text-gray-500">(14)</span></a></li>
//                                 <li><a href="#" className="text-sm">Shoes <span className="text-gray-500">(18)</span></a></li>
//                                 <li><a href="#" className="text-sm">Electronic <span className="text-gray-500">(22)</span></a></li>
//                                 <li><a href="#" className="text-sm">Cosmetics <span className="text-gray-500">(27)</span></a></li>
//                             </ul>
//                         </div>
//                     </div>
//                     {/* Price Filter Section */}
//                     <div className="mb-6">
//                         <div className="widget-title mb-3">
//                             <h2 className="text-lg font-semibold">Price</h2>
//                         </div>
//                         <div className="widget-content">
//                             <form className="price-filter" action="#" method="post">
//                                 <div className="slider-range mt-2 mb-4 h-1 bg-gray-300 rounded-full">
//                                     {/* Range slider would go here */}
//                                     <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <input type="text" className="w-full border rounded px-2 py-1 text-sm" defaultValue="$12 - $100" />
//                                     </div>
//                                     <div className="text-right">
//                                         <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">FILTER</button>
//                                     </div>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                     {/* Color Swatches Section */}
//                     <div className="mb-6">
//                         <div className="widget-title mb-3">
//                             <h2 className="text-lg font-semibold">Color</h2>
//                         </div>
//                         <div className="widget-content">
//                             <ul className="flex flex-wrap gap-2 pt-0">
//                                 <li className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
//                                     <img src="https://via.placeholder.com/70x70/0000FF/FFFFFF?text=Blue" alt="Blue" className="w-full h-full object-cover" title="Blue" />
//                                 </li>
//                                 <li className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
//                                     <img src="https://via.placeholder.com/70x70/000000/FFFFFF?text=Black" alt="Black" className="w-full h-full object-cover" title="Black" />
//                                 </li>
//                                 <li className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
//                                     <img src="https://via.placeholder.com/70x70/FFC0CB/000000?text=Pink" alt="Pink" className="w-full h-full object-cover" title="Pink" />
//                                 </li>
//                                 <li className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
//                                     <img src="https://via.placeholder.com/70x70/FF0000/FFFFFF?text=Red" alt="Red" className="w-full h-full object-cover" title="Red" />
//                                 </li>
//                                 <li className="w-12 h-12 rounded-full bg-black border border-gray-200" title="Black" />
//                                 <li className="w-12 h-12 rounded-full bg-red-500 border border-gray-200" title="Red" />
//                                 <li className="w-12 h-12 rounded-full bg-blue-500 border border-gray-200" title="Blue" />
//                                 <li className="w-12 h-12 rounded-full bg-pink-400 border border-gray-200" title="Pink" />
//                                 <li className="w-12 h-12 rounded-full bg-gray-500 border border-gray-200" title="Gray" />
//                                 <li className="w-12 h-12 rounded-full bg-green-500 border border-gray-200" title="Green" />
//                                 <li className="w-12 h-12 rounded-full bg-orange-500 border border-gray-200" title="Orange" />
//                                 <li className="w-12 h-12 rounded-full bg-yellow-400 border border-gray-200 opacity-50" title="Yellow (Sold Out)" />
//                             </ul>
//                         </div>
//                     </div>
//                     {/* Size Swatches Section */}
//                     <div className="mb-6">
//                         <div className="widget-title mb-3">
//                             <h2 className="text-lg font-semibold">Size</h2>
//                         </div>
//                         <div className="widget-content">
//                             <ul className="flex flex-wrap gap-2">
//                                 <li className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-sm opacity-50" title="XS">XS</li>
//                                 <li className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-sm" title="S">S</li>
//                                 <li className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-sm" title="M">M</li>
//                                 <li className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-sm" title="L">L</li>
//                                 <li className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-sm" title="X">X</li>
//                                 <li className="w-12 h-12 rounded-full border-2 border-blue-500 flex items-center justify-center text-sm font-medium" title="XL">XL</li>
//                                 <li className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-sm" title="XLL">XLL</li>
//                                 <li className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-sm" title="XXL">XXL</li>
//                                 <li className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-sm" title={25}>25</li>
//                                 <li className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-sm" title={35}>35</li>
//                                 <li className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-sm" title={40}>40</li>
//                             </ul>
//                         </div>
//                     </div>
//                     {/* Brands Section */}
//                     <div className="mb-6">
//                         <div className="widget-title mb-3">
//                             <h2 className="text-lg font-semibold">Brands</h2>
//                         </div>
//                         <div className="widget-content">
//                             <ul className="space-y-2">
//                                 <li className="flex items-center">
//                                     <input type="checkbox" id="avone" className="mr-2" />
//                                     <label htmlFor="avone" className="text-sm">Avone</label>
//                                 </li>
//                                 <li className="flex items-center">
//                                     <input type="checkbox" id="diva" className="mr-2" />
//                                     <label htmlFor="diva" className="text-sm">Diva</label>
//                                 </li>
//                                 <li className="flex items-center">
//                                     <input type="checkbox" id="optimal" className="mr-2" />
//                                     <label htmlFor="optimal" className="text-sm">Optimal</label>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                     {/* Product Tags Section */}
//                     <div className="mb-6">
//                         <div className="widget-title mb-3">
//                             <h2 className="text-lg font-semibold">Product Tags</h2>
//                         </div>
//                         <div className="widget-content">
//                             <ul className="flex flex-wrap gap-2 mb-3">
//                                 <li><a href="#" className="inline-block px-3 py-1 rounded-full bg-blue-500 text-white text-sm">Women</a></li>
//                                 <li><a href="#" className="inline-block px-3 py-1 rounded-full bg-gray-200 text-sm">Shoes</a></li>
//                                 <li><a href="#" className="inline-block px-3 py-1 rounded-full bg-gray-200 text-sm">Beauty</a></li>
//                                 <li><a href="#" className="inline-block px-3 py-1 rounded-full bg-gray-200 text-sm">Accessories</a></li>
//                                 <li><a href="#" className="inline-block px-3 py-1 rounded-full bg-gray-200 text-sm">$100 - $400</a></li>
//                             </ul>
//                             <button className="text-sm text-blue-500 hover:text-blue-700">VIEW ALL</button>
//                         </div>
//                     </div>
//                     {/* Banner Section */}
//                     <div className="static-banner mt-6">
//                         <a href="#">
//                             <img src="https://via.placeholder.com/274x367" alt="Shop Banner" className="w-full h-auto rounded" />
//                         </a>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default SideFilteringCode

import React from 'react'

const SideFilteringCode = () => {
    const activeFilters = [
        { id: 1, value: "Women" },
        { id: 2, value: "Blue" },
        { id: 3, value: "XL" }
    ];

    return (
        <div>
            <div className="col-12 col-sm-12 col-md-12 lg:w-2/12 bg-gray-50 ">
                <div className="mb-6 border border-[#000]-500 px-2 py-3" style={{ backgroundColor: "#fff" }}>
                    {/* Title */}
                    <h2 className="text-base font-bold text-gray-900 uppercase mb-3">FILTER BY</h2>
                    {/* Active Filters */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {/* Women Filter */}
                        <span className="border bg-gray-100 hover:bg-gray-200 rounded-sm px-3 py-1 text-sm flex items-center transition-colors">
                            Women
                            <svg className="w-3 h-3 ml-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>

                        {/* Blue Filter */}
                        <span className="border bg-gray-100 hover:bg-gray-200 rounded-sm px-3 py-1 text-sm flex items-center transition-colors">
                            Blue
                            <svg className="w-3 h-3 ml-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>

                        {/* XL Filter */}
                        <span className="border bg-gray-100 hover:bg-gray-200 rounded-sm px-3 py-1 text-sm flex items-center transition-colors">
                            XL
                            <svg className="w-3 h-3 ml-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </div>

                    {/* Clear All Link */}
                    <a href="#" className="text-[0.8rem] underline font-medium text-black hover:text-[#e96f84] hover:underline">
                        CLEAR ALL
                    </a>
                </div>
                <div className="sidebar-widget mb-6 border border-[#000]-500 px-2 py-3">
                    <div className="widget-title mb-3">
                        <h2 className="text-lg font-semibold">CATEGORIES</h2>
                    </div>
                    <div className="widget-content">
                        <ul className="space-y-2">
                            {/* Clothing with nested items */}
                            <li className="group relative">
                                <a href="#" className="flex justify-between items-center py-1 hover:text-blue-500">
                                    <span>Clothing</span>
                                    <span className="text-gray-400 group-hover:text-blue-500">+</span>
                                </a>
                                <ul className="ml-4 mt-1 hidden group-hover:block">
                                    <li className="group-sub relative">
                                        <a href="#" className="flex justify-between items-center py-1 hover:text-blue-500">
                                            <span>Men</span>
                                            <span className="text-gray-400 group-sub-hover:text-blue-500">+</span>
                                        </a>
                                        <ul className="ml-4 hidden group-sub-hover:block">
                                            <li>
                                                <a href="#" className="flex justify-between items-center py-1 text-sm hover:text-blue-500">
                                                    <span>Shirt</span>
                                                    <span className="text-gray-500">(25)</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="flex justify-between items-center py-1 text-sm hover:text-blue-500">
                                                    <span>Jeans</span>
                                                    <span className="text-gray-500">(6)</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#" className="flex justify-between items-center py-1 text-sm hover:text-blue-500">
                                                    <span>Shoes</span>
                                                    <span className="text-gray-500">(9)</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="#" className="flex justify-between items-center py-1 text-sm hover:text-blue-500">
                                            <span>Women</span>
                                            <span className="text-gray-500">(14)</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex justify-between items-center py-1 text-sm hover:text-blue-500">
                                            <span>Child</span>
                                            <span className="text-gray-500">(26)</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            {/* Jewellery with nested items */}
                            <li className="group relative">
                                <a href="#" className="flex justify-between items-center py-1 hover:text-blue-500">
                                    <span>Jewellery</span>
                                    <span className="text-gray-400 group-hover:text-blue-500">+</span>
                                </a>
                                <ul className="ml-4 mt-1 hidden group-hover:block">
                                    <li>
                                        <a href="#" className="flex justify-between items-center py-1 text-sm hover:text-blue-500">
                                            <span>Ring</span>
                                            <span className="text-gray-500">(12)</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex justify-between items-center py-1 text-sm hover:text-blue-500">
                                            <span>Necklaces</span>
                                            <span className="text-gray-500">(15)</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex justify-between items-center py-1 text-sm hover:text-blue-500">
                                            <span>Earrings</span>
                                            <span className="text-gray-500">(18)</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            {/* Single line items */}
                            <li>
                                <a href="#" className="flex justify-between items-center py-1 hover:text-blue-500">
                                    <span>Accessories</span>
                                    <span className="text-gray-500">(14)</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex justify-between items-center py-1 hover:text-blue-500">
                                    <span>Shoes</span>
                                    <span className="text-gray-500">(18)</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex justify-between items-center py-1 hover:text-blue-500">
                                    <span>Electronic</span>
                                    <span className="text-gray-500">(22)</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="flex justify-between items-center py-1 hover:text-blue-500">
                                    <span>Cosmetics</span>
                                    <span className="text-gray-500">(27)</span>
                                </a>
                            </li>
                            {/* Show More button */}
                            <li>
                                <a href="#" className="flex justify-between items-center py-1 text-blue-500 hover:text-blue-700">
                                    <span>Show More</span>
                                    <span className="text-gray-400">◇</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>



        </div>
    )
}

export default SideFilteringCode
