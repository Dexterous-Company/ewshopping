import Faq from "../../../main_pages/footerPages/Faq";
import React from "react";

export const metadata = {
  title: "EW Shopping Frequently Asked Questions – Answers for all of Your Queries",
  description:
    "Find answers to all your questions about your orders, payments, returns, and delivery. Get quick help and shop confidently with India’s best online shopping site",
  keywords:
    "India’s best online shopping site, EW Shopping FAQs, EW Shopping help centre, EW Shopping same-day delivery, EW Shopping returns policy for electronics, track my order online, online shopping frequently asked questions, Shopping customer support FAQ, Shopping shipping & delivery questions, online return & refund questions",
  alternates: {
    canonical: "https://ewshopping.com/faq"
  }
};


const page = () => {
  return (
    <div>
      <Faq />
    </div>
  );
};

export default page;
