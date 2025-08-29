// import React from 'react'
// import { FormControl } from "@mui/material";

// const ContactUs = () => {
//   return (
//     <div className=" flex items-center  bg-gray-100 p-9">
//       <div className=" w-full bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">

//         {/* Left Info Section */}
//         <div
//           className="relative bg-cover bg-center"
//           style={{
//             backgroundImage: "url('/contact.avif')",
//           }}
//         >
//           <div className="absolute inset-0 bg-black/50 flex flex-col justify-center p-8 text-white">
//             <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
//             <p className="mb-6">
//               Have questions or feedback? Fill out the form and we’ll get back
//               to you as soon as possible.
//             </p>
//             <div className="space-y-2 text-sm">
//               <p>📍 123 Main Street, Hyderabad, India</p>
//               <p>📞 +91 9876543210</p>
//               <p>✉ contact@example.com</p>
//             </div>
//           </div>
//         </div>

//         {/* Right Form Section */}
//         <div className="p-8 flex flex-col justify-center">
//           <h3 className="text-2xl font-semibold text-gray-800 mb-6">
//             Send Us a Message
//           </h3>

//           <form className="space-y-5 flex flex-col gap-2">
//             <FormControl fullWidth>
//               <input
//                 type="text"
//                 placeholder="Name"
//                 className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </FormControl>

//             <FormControl fullWidth>
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </FormControl>

//             <FormControl fullWidth>
//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </FormControl>

//             <FormControl fullWidth>
//               <input
//                 type="text"
//                 placeholder="Subject"
//                 className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//               />
//             </FormControl>

//             <FormControl fullWidth>
//               <textarea
//                 placeholder="Message"
//                 rows="4"
//                 className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
//               ></textarea>
//             </FormControl>

//             <FormControl fullWidth>
//               <button
//                 type="submit"
//                 className="bg-[#2f415d] text-white py-3 px-6  hover:bg-[#e96f84] transition-all"
//               >
//                 Send Message
//               </button>
//             </FormControl>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ContactUs


import React from 'react'
import { FormControl } from "@mui/material";

const ContactUs = () => {
  return (
    <div className="flex items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-9">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2  mb-13 sm:mb-0">

        {/* Left Info Section - Hidden on small screens if needed */}
        <div
          className="block relative bg-cover bg-center min-h-[300px] md:min-h-[500px]"
          style={{
            backgroundImage: "url('/contact.avif')",
          }}
        >
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center p-6 md:p-8 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Contact Us</h2>
            <p className="mb-4 md:mb-6 text-sm md:text-base">
              Have questions or feedback? Fill out the form and we'll get back
              to you as soon as possible.
            </p>
            <div className="space-y-2 text-xs md:text-sm">
              <p className="flex items-center gap-2">📍 123 Main Street, Hyderabad, India</p>
              <p className="flex items-center gap-2">📞 +91 9876543210</p>
              <p className="flex items-center gap-2">✉ contact@example.com</p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Send Us a Message
          </h3>

          <form className="space-y-4  flex flex-col gap-2">
            <FormControl fullWidth>
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
              />
            </FormControl>

            <FormControl fullWidth>
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
              />
            </FormControl>

            <FormControl fullWidth>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
              />
            </FormControl>

            <FormControl fullWidth>
              <input
                type="text"
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
              />
            </FormControl>

            <FormControl fullWidth>
              <textarea
                placeholder="Message"
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm sm:text-base"
              ></textarea>
            </FormControl>

            <FormControl fullWidth>
              <button
                type="submit"
                className="w-full bg-[#2f415d] text-white py-2 sm:py-3 px-4 hover:bg-[#e96f84] transition-all text-sm sm:text-base"
              >
                Send Message
              </button>
            </FormControl>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactUs