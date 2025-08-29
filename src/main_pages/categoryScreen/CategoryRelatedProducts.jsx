import React from 'react'

const CategoryRelatedProducts = () => {
    return (
        <div>
            <div className="w-full sm:w-full md:w-full lg:w-9/12">
                {/* Toolbar */}
                <div className="mb-4">
                    <div className="flex flex-wrap items-center">
                        <div className="w-4/12 sm:w-2/12 md:w-4/12 lg:w-4/12 flex order-1 sm:order-1 md:order-1 lg:order-1">
                            <button type="button" className="btn btn-filter icon d-inline-flex lg:hidden mr-2">
                                <span className="hidden">Filter</span>
                            </button>
                            <div className="flex items-center">
                                <label className="mb-0 mr-2 hidden lg:inline-block">View as:</label>
                                <div className="flex">
                                    <a className="icon-mode mode-list block" data-col={1} />
                                    <a className="icon-mode mode-grid grid-2 block" data-col={2} />
                                    <a className="icon-mode mode-grid grid-3 md:block" data-col={3} />
                                    <a className="icon-mode mode-grid grid-4 lg:block active" data-col={4} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full sm:w-4/12 md:w-4/12 lg:w-4/12 text-center order-0 sm:order-2 md:order-2 lg:order-2 mb-3 sm:mb-0">
                            <span className="toolbar-product-count">Showing: 15 products</span>
                        </div>
                        <div className="w-8/12 sm:w-6/12 md:w-4/12 lg:w-4/12 flex justify-end order-2 sm:order-3 md:order-3 lg:order-3">
                            <div className="flex items-center">
                                <label htmlFor="ShowBy" className="mb-0 mr-2 whitespace-nowrap hidden sm:inline-flex">Show:</label>
                                <select name="ShowBy" id="ShowBy" className="filters-toolbar-show">
                                    <option value="title-ascending" selected="selected">10</option>
                                    <option>15</option>
                                    <option>20</option>
                                    <option>25</option>
                                    <option>30</option>
                                </select>
                            </div>
                            <div className="flex items-center ml-2 lg:ml-3">
                                <label htmlFor="SortBy" className="mb-0 mr-2 whitespace-nowrap hidden">Sort by:</label>
                                <select name="SortBy" id="SortBy" className="filters-toolbar-sort">
                                    <option value="featured" selected="selected">Featured</option>
                                    <option value="best-selling">Best selling</option>
                                    <option value="title-ascending">Alphabetically, A-Z</option>
                                    <option value="title-descending">Alphabetically, Z-A</option>
                                    <option value="price-ascending">Price, low to high</option>
                                    <option value="price-descending">Price, high to low</option>
                                    <option value="created-ascending">Date, old to new</option>
                                    <option value="created-descending">Date, new to old</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Toolbar */}
                {/* Product Grid */}
                <div className="grid-view-items">
                    <div className="flex flex-wrap -mx-2">
                        {/* Product Item 1 */}
                        <div className="w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 px-2 mb-4">
                            <div className="product-box">
                                {/* Product Image */}
                                <div className="product-image">
                                    <a href="product-layout1.html" className="product-img">
                                        <img className="blur-up lazyload" src="assets/images/products/product1.jpg" alt="Product" title="Product" width={625} height={808} />
                                    </a>
                                    <div className="product-labels"><span className="lbl on-sale">Sale</span></div>
                                    <div className="saleTime" data-countdown="2025/01/01" />
                                    <div className="button-set style1">
                                        <a href="#quickshop-modal" className="btn-icon addtocart quick-shop-modal" data-bs-toggle="modal" data-bs-target="#quickshop_modal">
                                            <span className="icon-wrap flex justify-center items-center h-full w-full" data-bs-toggle="tooltip" data-bs-placement="left" title="Quick Shop">
                                                <i className="icon anm anm-cart-l" /><span className="text">Quick Shop</span>
                                            </span>
                                        </a>
                                        <a href="#quickview-modal" className="btn-icon quickview quick-view-modal" data-bs-toggle="modal" data-bs-target="#quickview_modal">
                                            <span className="icon-wrap flex justify-center items-center h-full w-full" data-bs-toggle="tooltip" data-bs-placement="left" title="Quick View">
                                                <i className="icon anm anm-search-plus-l" /><span className="text">Quick View</span>
                                            </span>
                                        </a>
                                        <a href="wishlist-style2.html" className="btn-icon wishlist" data-bs-toggle="tooltip" data-bs-placement="left" title="Add To Wishlist">
                                            <i className="icon anm anm-heart-l" /><span className="text">Add To Wishlist</span>
                                        </a>
                                        <a href="compare-style2.html" className="btn-icon compare" data-bs-toggle="tooltip" data-bs-placement="left" title="Add to Compare">
                                            <i className="icon anm anm-random-r" /><span className="text">Add to Compare</span>
                                        </a>
                                    </div>
                                </div>
                                {/* Product Details */}
                                <div className="product-details text-center">
                                    <div className="product-vendor">Tops</div>
                                    <div className="product-name">
                                        <a href="product-layout1.html">Oxford Cuban Shirt</a>
                                    </div>
                                    <div className="product-price">
                                        <span className="price old-price">$114.00</span><span className="price">$99.00</span>
                                    </div>
                                    <div className="product-review">
                                        <i className="icon anm anm-star" /><i className="icon anm anm-star" /><i className="icon anm anm-star" /><i className="icon anm anm-star" /><i className="icon anm anm-star-o" />
                                        <span className="caption hidden ml-1">3 Reviews</span>
                                    </div>
                                    <p className="sort-desc hidden">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage...</p>
                                    <ul className="variants-clr swatches flex">
                                        <li className="swatch medium rounded-full"><span className="swatchLbl" data-bs-toggle="tooltip" data-bs-placement="top" title="Navy"><img src="assets/images/products/product1.jpg" alt="img" width={625} height={808} /></span></li>
                                        <li className="swatch medium rounded-full"><span className="swatchLbl" data-bs-toggle="tooltip" data-bs-placement="top" title="Green"><img src="assets/images/products/product1-1.jpg" alt="img" width={625} height={808} /></span></li>
                                        <li className="swatch medium rounded-full"><span className="swatchLbl" data-bs-toggle="tooltip" data-bs-placement="top" title="Gray"><img src="assets/images/products/product1-2.jpg" alt="img" width={625} height={808} /></span></li>
                                        <li className="swatch medium rounded-full"><span className="swatchLbl" data-bs-toggle="tooltip" data-bs-placement="top" title="Orange"><img src="assets/images/products/product1-3.jpg" alt="img" width={625} height={808} /></span></li>
                                    </ul>
                                    <div className="button-action hidden">
                                        <div className="addtocart-btn">
                                            <form className="addtocart" action="#" method="post">
                                                <a href="#quickshop-modal" className="btn btn-md quick-shop quick-shop-modal" data-bs-toggle="modal" data-bs-target="#quickshop_modal">
                                                    <i className="icon anm anm-cart-l mr-2" /><span className="text">Quick Shop</span>
                                                </a>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Product Item 2 */}
                        <div className="w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 px-2 mb-4">
                            <div className="product-box">
                                <div className="product-image">
                                    <a href="product-layout1.html" className="product-img">
                                        <img className="primary blur-up lazyload" data-src="assets/images/products/product2.jpg" src="assets/images/products/product2.jpg" alt="Product" title="Product" width={625} height={808} />
                                        <img className="hover blur-up lazyload" data-src="assets/images/products/product2-1.jpg" src="assets/images/products/product2-1.jpg" alt="Product" title="Product" width={625} height={808} />
                                    </a>
                                    <div className="button-set style1">
                                        <a href="#quickshop-modal" className="btn-icon addtocart quick-shop-modal" data-bs-toggle="modal" data-bs-target="#quickshop_modal">
                                            <span className="icon-wrap flex justify-center items-center h-full w-full" data-bs-toggle="tooltip" data-bs-placement="left" title="Select Options">
                                                <i className="icon anm anm-cart-l" /><span className="text">Select Options</span>
                                            </span>
                                        </a>
                                        <a href="#quickview-modal" className="btn-icon quickview quick-view-modal" data-bs-toggle="modal" data-bs-target="#quickview_modal">
                                            <span className="icon-wrap flex justify-center items-center h-full w-full" data-bs-toggle="tooltip" data-bs-placement="left" title="Quick View">
                                                <i className="icon anm anm-search-plus-l" /><span className="text">Quick View</span>
                                            </span>
                                        </a>
                                        <a href="wishlist-style2.html" className="btn-icon wishlist" data-bs-toggle="tooltip" data-bs-placement="left" title="Add To Wishlist">
                                            <i className="icon anm anm-heart-l" /><span className="text">Add To Wishlist</span>
                                        </a>
                                        <a href="compare-style2.html" className="btn-icon compare" data-bs-toggle="tooltip" data-bs-placement="left" title="Add to Compare">
                                            <i className="icon anm anm-random-r" /><span className="text">Add to Compare</span>
                                        </a>
                                    </div>
                                </div>
                                <div className="product-details text-center">
                                    <div className="product-vendor">Clothing</div>
                                    <div className="product-name">
                                        <a href="product-layout1.html">Cuff Beanie Cap</a>
                                    </div>
                                    <div className="product-price">
                                        <span className="price">$128.00</span>
                                    </div>
                                    <div className="product-review">
                                        <i className="icon anm anm-star" /><i className="icon anm anm-star" /><i className="icon anm anm-star" /><i className="icon anm anm-star" /><i className="icon anm anm-star" />
                                        <span className="caption hidden ml-1">8 Reviews</span>
                                    </div>
                                    <p className="sort-desc hidden">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage...</p>
                                    <ul className="variants-clr swatches flex">
                                        <li className="swatch medium rounded-full"><span className="swatchLbl" data-bs-toggle="tooltip" data-bs-placement="top" title="Navy"><img src="assets/images/products/product2.jpg" alt="img" width={625} height={808} /></span></li>
                                        <li className="swatch medium rounded-full"><span className="swatchLbl" data-bs-toggle="tooltip" data-bs-placement="top" title="Green"><img src="assets/images/products/product2-1.jpg" alt="img" width={625} height={808} /></span></li>
                                        <li className="swatch medium rounded-full"><span className="swatchLbl" data-bs-toggle="tooltip" data-bs-placement="top" title="Gray"><img src="assets/images/products/product2-2.jpg" alt="img" width={625} height={808} /></span></li>
                                        <li className="swatch medium rounded-full"><span className="swatchLbl" data-bs-toggle="tooltip" data-bs-placement="top" title="Orange"><img src="assets/images/products/product2-3.jpg" alt="img" width={625} height={808} /></span></li>
                                        <li className="swatch medium rounded-full"><span className="swatchLbl" data-bs-toggle="tooltip" data-bs-placement="top" title="Yellow"><img src="assets/images/products/product2-4.jpg" alt="img" width={625} height={808} /></span></li>
                                        <li className="swatch medium rounded-full"><span className="swatchLbl" data-bs-toggle="tooltip" data-bs-placement="top" title="Blue"><img src="assets/images/products/product2-5.jpg" alt="img" width={625} height={808} /></span></li>
                                    </ul>
                                    <div className="button-action hidden">
                                        <div className="addtocart-btn">
                                            <form className="addtocart" action="#" method="post">
                                                <a href="#quickshop-modal" className="btn btn-md quick-shop quick-shop-modal" data-bs-toggle="modal" data-bs-target="#quickshop_modal">
                                                    <i className="icon anm anm-cart-l mr-2" /><span className="text">Select Options</span>
                                                </a>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Continue with other product items (3-15) following the same pattern */}
                        {/* ... */}
                    </div>
                    {/* Pagination */}
                    <nav className="clearfix mt-8">
                        <ul className="pagination flex justify-center">
                            <li className="page-item disabled"><a className="page-link" href="#"><i className="icon anm anm-angle-left-l" /></a></li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link dot" href="#">...</a></li>
                            <li className="page-item"><a className="page-link" href="#">5</a></li>
                            <li className="page-item"><a className="page-link" href="#"><i className="icon anm anm-angle-right-l" /></a></li>
                        </ul>
                    </nav>
                    {/* End Pagination */}
                </div>
                {/* End Product Grid */}
            </div>

        </div>
    )
}

export default CategoryRelatedProducts
