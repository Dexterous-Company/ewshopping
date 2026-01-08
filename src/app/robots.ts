import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/cart",
          "/cart/",
          "/checkout",
          "/checkout/",
          "/orders",
          "/orders/",
          "/account",
          "/account/",
          "/login",
          "/login/",
          "/register",
          "/register/",
          "/*?sort=",
          "/*?filter=",
          "/*?search=",
          "/*add-to-cart*",
          "/*?ref=",
        ],
      },
    ],
    sitemap: "https://testwebsite.ewshopping.com/sitemap.xml",
  };
}
