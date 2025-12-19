import ContactUs from "@/main_pages/footerPages/ContactUs";
import React from "react";

export const metadata = {
  title: "Contact Us – EW Shopping India | Fast & Friendly Customer Care",
  description:
    "Contact EW Shopping for reliable support, order tracking, and return assistance. Available 7 days a week!",
  keywords:
    "EW Shopping contact us, Contact EW Shopping customer service, EW Shopping live chat support India, EW Shopping contact form online, Shopping order support contact, Online shopping business enquiries in India, e-commerce contact form",
  alternates: {
    canonical: "https://ewshopping.com/contactus",
  },
};

const page = () => {
  return (
    <div>
      <ContactUs />
    </div>
  );
};

export default page;
