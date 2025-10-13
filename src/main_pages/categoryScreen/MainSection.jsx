import React from "react";

const MainSection = () => {
  return (
    <div>
      <div className="container mx-auto px-4">
        {/* Category Slider */}
        <div className="collection-slider-6items gp10 slick-arrow-dots sub-collection section pt-0">
          <div className="category-item zoomscal-hov">
            <a href="shop-left-sidebar.html" className="category-link clr-none">
              <div className="zoom-scal zoom-scal-nopb rounded-none">
                <img
                  className="rounded-none blur-up lazyload"
                  data-src="assets/images/collection/sub-collection1.jpg"
                  src="assets/images/collection/sub-collection1.jpg"
                  alt="Men's"
                  title="Men's"
                  width={365}
                  height={365}
                />
              </div>
              <div className="details text-center">
                <h4 className="category-title mb-0">Men's</h4>
                <p className="counts">20 Items</p>
              </div>
            </a>
          </div>
          {/* Repeat similar structure for other category items */}
        </div>
        {/* End Category Slider */}

        <div className="flex flex-wrap">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 lg:w-1/4 sidebar sidebar-bg filterbar">
            <div className="closeFilter block lg:hidden">
              <i className="icon anm anm-times-r" />
            </div>
            <div className="sidebar-tags sidebar-sticky clearfix">
              {/* Filter By */}
              <div className="sidebar-widget filterBox filter-widget mb-6">
                <div className="widget-title">
                  <h2 className="text-lg font-bold">Filter By</h2>
                </div>
                <div className="widget-content filterby filterDD">
                  <ul className="flex flex-wrap items tags-list">
                    <li className="item m-1">
                      <a
                        href="#"
                        className="rounded-full px-3 py-1 bg-gray-100 hover:bg-gray-200"
                      >
                        <span className="filter-value">Women</span>
                        <i className="icon anm anm-times-r ml-1" />
                      </a>
                    </li>
                    {/* Other filter items */}
                  </ul>
                  <a
                    href="#"
                    className="btn btn-sm brd-link mt-2 inline-block text-sm"
                  >
                    Clear All
                  </a>
                </div>
              </div>
              {/* End Filter By */}

              {/* Categories */}
              <div className="sidebar-widget clearfix categories filterBox filter-widget mb-6">
                <div className="widget-title">
                  <h2 className="text-lg font-bold">Categories</h2>
                </div>
                <div className="widget-content filterDD">
                  <ul className="sidebar-categories scrollspy morelist clearfix">
                    <li className="lvl1 sub-level more-item">
                      <a href="#" className="site-nav block py-1">
                        Clothing
                      </a>
                      <ul className="sublinks pl-4">
                        <li className="lvl2 sub-level sub-sub-level">
                          <a href="#" className="site-nav block py-1">
                            Men
                          </a>
                          <ul className="sublinks pl-4">
                            <li className="lvl3">
                              <a href="#" className="site-nav block py-1">
                                Shirt <span className="count">(25)</span>
                              </a>
                            </li>
                            {/* Other sub-items */}
                          </ul>
                        </li>
                        {/* Other category items */}
                      </ul>
                    </li>
                    {/* Other main categories */}
                  </ul>
                </div>
              </div>
              {/* End Categories */}

              {/* Price Filter */}
              <div className="sidebar-widget filterBox filter-widget mb-6">
                <div className="widget-title">
                  <h2 className="text-lg font-bold">Price</h2>
                </div>
                <form
                  className="widget-content price-filter filterDD"
                  action="#"
                  method="post"
                >
                  <div id="slider-range" className="mt-2" />
                  <div className="flex mt-4">
                    <div className="w-1/2">
                      <input
                        id="amount"
                        type="text"
                        className="w-full border rounded p-1"
                      />
                    </div>
                    <div className="w-1/2 text-right">
                      <button className="btn btn-sm bg-blue-500 text-white px-3 py-1 rounded">
                        filter
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              {/* End Price Filter */}

              {/* Color Swatches */}
              <div className="sidebar-widget filterBox filter-widget mb-6">
                <div className="widget-title">
                  <h2 className="text-lg font-bold">Color</h2>
                </div>
                <div className="widget-content filter-color filterDD">
                  <ul className="flex flex-wrap swacth-list swatches justify-center pt-0">
                    <li className="swatch large radius available active m-1">
                      <img
                        src="assets/images/products/swatches/blue-red.jpg"
                        alt="image"
                        width={70}
                        height={70}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Blue"
                      />
                    </li>
                    {/* Other color swatches */}
                  </ul>
                </div>
              </div>
              {/* End Color Swatches */}

              {/* Size Swatches */}
              <div className="sidebar-widget filterBox filter-widget mb-6">
                <div className="widget-title">
                  <h2 className="text-lg font-bold">Size</h2>
                </div>
                <div className="widget-content filter-size filterDD">
                  <ul className="flex flex-wrap swacth-list size-swatches justify-center">
                    <li className="swatch large radius soldout m-1">
                      <span
                        className="swatchLbl inline-block w-8 h-8 text-center leading-8 border rounded-full"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="XS"
                      >
                        XS
                      </span>
                    </li>
                    {/* Other size swatches */}
                  </ul>
                </div>
              </div>
              {/* End Size Swatches */}

              {/* Product Brands */}
              <div className="sidebar-widget filterBox filter-widget brand-filter mb-6">
                <div className="widget-title">
                  <h2 className="text-lg font-bold">Brands</h2>
                </div>
                <div className="widget-content filterDD">
                  <ul className="clearfix">
                    <li className="mb-2">
                      <input
                        type="checkbox"
                        defaultValue="avone"
                        id="avone"
                        className="mr-2"
                      />
                      <label htmlFor="avone">
                        <span className="mr-1" />
                        Avone
                      </label>
                    </li>
                    {/* Other brand checkboxes */}
                  </ul>
                </div>
              </div>
              {/* End Product Brands */}

              {/* Product Tags */}
              <div className="sidebar-widget filterBox filter-widget product-tag mb-6">
                <div className="widget-title">
                  <h2 className="text-lg font-bold">Product Tags</h2>
                </div>
                <div className="widget-content filterDD">
                  <ul className="flex flex-wrap tags-list product-tags">
                    <li className="item active m-1">
                      <a
                        className="rounded-full px-3 py-1 bg-blue-500 text-white"
                        href="#"
                      >
                        Women
                      </a>
                    </li>
                    {/* Other product tags */}
                  </ul>
                  <span className="btn btn-sm brd-link btnview inline-block mt-2 text-sm">
                    View all
                  </span>
                </div>
              </div>
              {/* End Product Tags */}

              {/* Banner */}
              <div className="sidebar-widget static-banner p-0 mb-6">
                <a href="shop-left-sidebar.html">
                  <img
                    className="rounded-none blur-up lazyload"
                    data-src="assets/images/banners/shop-banner.jpg"
                    src="assets/images/banners/shop-banner.jpg"
                    alt="image"
                    width={274}
                    height={367}
                  />
                </a>
              </div>
              {/* End Banner */}
            </div>
          </div>
          {/* End Sidebar */}

          {/* Products */}
          <div className="w-full md:w-3/4 lg:w-3/4 main-col">
            {/* Toolbar */}
            <div className="toolbar toolbar-wrapper shop-toolbar mb-6">
              <div className="flex flex-wrap items-center">
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 text-left filters-toolbar-item flex order-1 sm:order-1">
                  <button
                    type="button"
                    className="btn btn-filter icon anm anm-sliders-hr inline-flex lg:hidden mr-2"
                  >
                    <span className="hidden">Filter</span>
                  </button>
                  <div className="filters-item flex items-center">
                    <label className="mb-0 mr-2 hidden lg:inline-block">
                      View as:
                    </label>
                    <div className="grid-options view-mode flex">
                      <a
                        className="icon-mode mode-list block w-8 h-8 border mx-1"
                        data-col={1}
                      />
                      <a
                        className="icon-mode mode-grid grid-2 block w-8 h-8 border mx-1"
                        data-col={2}
                      />
                      <a
                        className="icon-mode mode-grid grid-3 hidden md:block w-8 h-8 border mx-1"
                        data-col={3}
                      />
                      <a
                        className="icon-mode mode-grid grid-4 hidden lg:block w-8 h-8 border mx-1 active"
                        data-col={4}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 text-center product-count order-2 sm:order-2 mb-3 sm:mb-0">
                  <span className="toolbar-product-count">
                    Showing: 15 products
                  </span>
                </div>
                <div className="w-full sm:w-full md:w-1/3 lg:w-1/3 text-right filters-toolbar-item flex justify-end order-3 sm:order-3">
                  <div className="filters-item flex items-center">
                    <label
                      htmlFor="ShowBy"
                      className="mb-0 mr-2 whitespace-nowrap hidden sm:inline-flex"
                    >
                      Show:
                    </label>
                    <select
                      name="ShowBy"
                      id="ShowBy"
                      className="filters-toolbar-show border rounded p-1"
                    >
                      <option value="title-ascending" selected>
                        10
                      </option>
                      <option>15</option>
                      <option>20</option>
                      <option>25</option>
                      <option>30</option>
                    </select>
                  </div>
                  <div className="filters-item flex items-center ml-2 lg:ml-3">
                    <label
                      htmlFor="SortBy"
                      className="mb-0 mr-2 whitespace-nowrap hidden"
                    >
                      Sort by:
                    </label>
                    <select
                      name="SortBy"
                      id="SortBy"
                      className="filters-toolbar-sort border rounded p-1"
                    >
                      <option value="featured" selected>
                        Featured
                      </option>
                      <option value="best-selling">Best selling</option>
                      <option value="title-ascending">
                        Alphabetically, A-Z
                      </option>
                      <option value="title-descending">
                        Alphabetically, Z-A
                      </option>
                      <option value="price-ascending">
                        Price, low to high
                      </option>
                      <option value="price-descending">
                        Price, high to low
                      </option>
                      <option value="created-ascending">
                        Date, old to new
                      </option>
                      <option value="created-descending">
                        Date, new to old
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/* End Toolbar */}

            {/* Product Grid */}
            <div className="grid-products grid-view-items">
              <div className="flex flex-wrap product-options">
                {/* Product Item 1 */}
                <div className="w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 item p-2">
                  <div className="product-box border rounded overflow-hidden">
                    {/* Product Image */}
                    <div className="product-image relative">
                      <a
                        href="product-layout1.html"
                        className="product-img block"
                      >
                        <img
                          className="w-full h-auto"
                          src="assets/images/products/product1.jpg"
                          alt="Product"
                          title="Product"
                          width={625}
                          height={808}
                        />
                      </a>
                      {/* Product label */}
                      <div className="product-labels absolute top-2 right-2">
                        <span className="lbl on-sale bg-blue-950 text-white px-2 py-1 text-xs">
                          Sale
                        </span>
                      </div>
                      {/* Countdown Timer */}
                      <div
                        className="saleTime absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 text-xs"
                        data-countdown="2025/01/01"
                      />
                      {/* Product Buttons */}
                      <div className="button-set style1 absolute inset-0 flex flex-col justify-center items-center opacity-0 hover:opacity-100 bg-black bg-opacity-50 transition-opacity">
                        {/* Cart Button */}
                        <a
                          href="#quickshop-modal"
                          className="btn-icon addtocart quick-shop-modal mb-2 bg-white text-black px-4 py-2 rounded flex items-center"
                          data-bs-toggle="modal"
                          data-bs-target="#quickshop_modal"
                        >
                          <i className="icon anm anm-cart-l mr-2" />
                          <span className="text">Quick Shop</span>
                        </a>
                        {/* Other buttons similarly styled */}
                      </div>
                    </div>
                    {/* End Product Image */}

                    {/* Product Details */}
                    <div className="product-details text-center p-4">
                      <div className="product-vendor text-gray-500 text-sm">
                        Tops
                      </div>
                      <div className="product-name my-2">
                        <a
                          href="product-layout1.html"
                          className="text-lg font-medium hover:text-blue-500"
                        >
                          Oxford Cuban Shirt
                        </a>
                      </div>
                      <div className="product-price my-2">
                        <span className="price old-price line-through text-gray-500 mr-2">
                          $114.00
                        </span>
                        <span className="price text-blue-500 font-bold">
                          $99.00
                        </span>
                      </div>
                      <div className="product-review flex justify-center my-2">
                        {[...Array(4)].map((_, i) => (
                          <i
                            key={i}
                            className="icon anm anm-star text-yellow-400 mx-0.5"
                          />
                        ))}
                        <i className="icon anm anm-star-o text-yellow-400 mx-0.5" />
                        <span className="caption hidden ml-1 text-sm">
                          3 Reviews
                        </span>
                      </div>
                      {/* Color Variant */}
                      <ul className="variants-clr swatches flex justify-center my-2">
                        {["Navy", "Green", "Gray", "Orange"].map((color, i) => (
                          <li key={i} className="swatch medium radius mx-1">
                            <span
                              className="swatchLbl block w-8 h-8 border rounded-full overflow-hidden"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title={color}
                            >
                              <img
                                src={`assets/images/products/product1-${i}.jpg`}
                                alt={color}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            </span>
                          </li>
                        ))}
                      </ul>
                      {/* End Variant */}
                    </div>
                    {/* End product details */}
                  </div>
                </div>
                {/* End Product Item 1 */}

                {/* Repeat similar structure for other product items */}

                {/* Pagination */}
                <nav className="clearfix pagination-bottom w-full mt-8">
                  <ul className="pagination flex justify-center">
                    <li className="page-item disabled">
                      <a
                        className="page-link px-3 py-1 border rounded-l"
                        href="#"
                      >
                        <i className="icon anm anm-angle-left-l" />
                      </a>
                    </li>
                    <li className="page-item active">
                      <a
                        className="page-link px-3 py-1 border bg-blue-500 text-white"
                        href="#"
                      >
                        1
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-1 border" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-1 border" href="#">
                        ...
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link px-3 py-1 border" href="#">
                        5
                      </a>
                    </li>
                    <li className="page-item">
                      <a
                        className="page-link px-3 py-1 border rounded-r"
                        href="#"
                      >
                        <i className="icon anm anm-angle-right-l" />
                      </a>
                    </li>
                  </ul>
                </nav>
                {/* End Pagination */}
              </div>
            </div>
            {/* End Product Grid */}
          </div>
          {/* End Products */}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
