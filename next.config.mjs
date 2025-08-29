import withBundleAnalyzerFn from "@next/bundle-analyzer";

/** Enable analyzer if env var is set **/
const withBundleAnalyzer = withBundleAnalyzerFn({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "img.freepik.com",
      "images.unsplash.com",
      "cdn.shopify.com",
      "res.cloudinary.com",
      "localhost",
      "via.placeholder.com",
      "ewshoppingsellerapinew.dexterous.in",
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
