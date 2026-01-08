import { Suspense } from "react";
import BannerSearchPage from "../../../main_pages/SearchOptimization/BannerSearchPage";

const SITE_URL = "https://testwebsite.ewshopping.com";
const DEFAULT_IMAGE = "https://testwebsite.ewshopping.com/og/default.jpg";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/* ✅ CDN IMAGE HANDLER (DIRECT DISPLAY) */
const toOgImage = (url) => {
  if (!url) return DEFAULT_IMAGE;
  if (url.includes("cdn.ewshopping.com")) return url;
  return DEFAULT_IMAGE;
};

/* =========================
   🔥 SERVER SIDE SEO (BANNER)
========================= */
export async function generateMetadata({ params }) {
  // ✅ FIXED: folder name is [banner]
  const { banner } = await params;

  console.log("SEO banner =>", banner);

  if (!banner) {
    return {
      title: "EwShopping",
      description: "Shop online at EwShopping",
    };
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/mainhomeslider/getBannerUsingSlugScoData/${banner}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Banner API failed");

    const data = await res.json();

    if (!data.success || !data.banner) {
      throw new Error("Banner not found");
    }

    const bannerData = data.banner;

    const title = `${bannerData.name} | EwShopping`;
    const description = `Explore ${bannerData.name} offers at EwShopping`;
    const imageUrl = toOgImage(bannerData.image);

    return {
      title,
      description,

      openGraph: {
        type: "website",
        title,
        description,
        url: `${SITE_URL}/banner/${encodeURIComponent(banner)}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: bannerData.name,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("❌ generateMetadata error:", error.message);

    return {
      title: "EwShopping",
      description: "Shop online at EwShopping",
      openGraph: {
        images: [
          {
            url: DEFAULT_IMAGE,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        images: [DEFAULT_IMAGE],
      },
    };
  }
}

/* =========================
   ✅ PAGE RENDER
========================= */
export default function Page({ params }) {
  return (
    <Suspense fallback={null}>
      <BannerSearchPage params={params} />
    </Suspense>
  );
}
