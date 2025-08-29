import React from 'react';

const PageHeader = () => {
    return (
        <div className="bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Page Title */}
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shop Left Sidebar</h1>
                    </div>
                    {/* Breadcrumbs */}
                    <div className="flex items-center text-sm text-gray-600">
                        <a
                            href="index.html"
                            className="hover:text-gray-900 transition-colors duration-200"
                            title="Back to the home page"
                        >
                            Home
                        </a>
                        <span className="mx-2 flex items-center">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2">Shop</span>
                        </span>
                        <span className="flex items-center text-gray-900 font-medium">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-2">Shop Left Sidebar</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;