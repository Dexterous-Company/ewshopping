import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,

  swcMinify: true,

 images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    { protocol: "https", hostname: "img.freepik.com" },
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "cdn.shopify.com" },
    { protocol: "https", hostname: "res.cloudinary.com" },
    { protocol: "https", hostname: "cdn.ewshopping.com" },
    { protocol: "http", hostname: "cdn.ewshopping.com" },

    // ✅ ADD BOTH
    { protocol: "https", hostname: "ewshoppingsellerapinew.dexterous.in" },
    { protocol: "http",  hostname: "ewshoppingsellerapinew.dexterous.in" },

    { protocol: "https", hostname: "img-api.maintainic.com" },
    { protocol: "http", hostname: "localhost" },
  ],
},


  async headers() {
    return [
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
