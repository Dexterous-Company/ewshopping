import React from 'react'

const EmptyReviews = () => {
    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-1 mb-2 bg-white">
                {/* Image */}
                <div className="w-70 h-70 flex items-center justify-center">
                    {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                        className="w-28 h-28"
                    >
                        <rect
                            x="10"
                            y="14"
                            width="44"
                            height="30"
                            rx="2"
                            ry="2"
                            fill="#e5e5e5"
                            stroke="#555"
                            strokeWidth="2"
                        />
                        <circle cx="32" cy="29" r="4" fill="#fff" stroke="#ff4d4d" strokeWidth="2" />
                        <path
                            d="M 5 44 L 14 36 L 19 44 Z"
                            fill="#ff4d4d"
                        />
                        <path
                            d="M 50 44 L 54 38 L 62 44 Z"
                            fill="#ffd11a"
                        />
                    </svg> */}
                    <img
                        src={"/assets/images/emptyAddress/emptyreviews2.png"}
                        alt="no reviews"
                        className='w-80 h-80'
                    />
                </div>

                {/* Heading */}
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4">
                    No Reviews & Ratings
                </h2>

                {/* Subtext */}
                <p className="text-sm text-gray-600 mt-1 text-center">
                    You have not rated or reviewed any product yet!
                </p>
            </div>
        </div>
    )
}

export default EmptyReviews
