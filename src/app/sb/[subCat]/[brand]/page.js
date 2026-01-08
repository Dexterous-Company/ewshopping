import { Suspense } from "react";
import BrandSubPage from "../../../../main_pages/SearchOptimization/BrandSubPage";

const SITE_URL = "https://testwebsite.ewshopping.com";
const DEFAULT_IMAGE = "https://testwebsite.ewshopping.com/og/default.jpg";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/* 🔥 Cloudinary OG transform */
const toOgImage = (url) => {
  if (!url) return DEFAULT_IMAGE;
  if (!url.includes("res.cloudinary.com")) return DEFAULT_IMAGE;

  return url.replace(
    "/upload/",
    "/upload/f_jpg,q_auto,w_1200,h_630,c_fill/"
  );
};

export async function generateMetadata({ params }) {
  const { brand } = await params;
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/newbrands/getBrandUsingSlugScoData/${brand}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("API failed");

    const { brand: brandData } = await res.json();

    const title = `${brandData.name} | EwShopping`;
    const description =
      brandData.metaDesc ||
      `Explore ${brandData.name} products at EwShopping`;

    const imageUrl = toOgImage(brandData.ogImage);

    return {
      title,
      description,
      openGraph: {
        type: "website",
        title,
        description,
        url: `${SITE_URL}/brand/${brand}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${brandData.name} - EwShopping`,
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
    return {
      title: "EwShopping",
      description: "Shop online at EwShopping",
      openGraph: {
        images: [{ url: DEFAULT_IMAGE, width: 1200, height: 630 }],
      },
      twitter: {
        images: [DEFAULT_IMAGE],
      },
    };
  }
}


export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrandSubPage params={params} />
    </Suspense>
  );
}