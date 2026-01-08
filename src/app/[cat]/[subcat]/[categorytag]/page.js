import { Suspense } from "react";
import CatTagPage from "./categoryTag";

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
  const { cat, subcat, categorytag } = await params; // Remove await here
  console.log("params",params);
  

  try {
    console.log(`${API_BASE_URL}/api/v1/categorytag/getCatTagUsingSlugScoData/${categorytag} =====>`);
    
    const res = await fetch(
      `${API_BASE_URL}/api/v1/categorytag/getCatTagUsingSlugScoData/${categorytag}`,
      { 
        cache: "no-store",
        next: { revalidate: 3600 } // Optional: cache for 1 hour
      }
    );

    if (!res.ok) {
      console.error("API response not OK:", res.status);
      throw new Error(`API failed with status: ${res.status}`);
    }

    const data = await res.json();
    console.log("API Response:", JSON.stringify(data, null, 2));
    console.log("data",data);
    

    // Check if categoryTag exists in response
    if (!data.success || !data.categoryTag) {
      console.error("No categoryTag found in response");
      throw new Error("Category Tag not found");
    }

    const category = data.categoryTag;
    
    console.log("Category data:", {
      name: category.name,
      metaDesc: category.metaDesc,
      mobileImage: category.mobileImage
    });

    const title = `${category.name} | EwShopping`;
    const description = category.metaDesc || `Explore ${category.name} products online at EwShopping`;
    const imageUrl = toOgImage(category.mobileImage);

    const metadata = {
      title,
      description,
      openGraph: {
        type: "website",
        title,
        description,
        url: `${SITE_URL}/${cat}/${subcat}/${categorytag}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${category.name} - EwShopping`
          }
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };

    console.log("Generated metadata:", metadata);
    return metadata;

  } catch (error) {
    console.error("❌ generateMetadata error:", error.message);

    return {
      title: "EwShopping",
      description: "Shop online at EwShopping",
      openGraph: {
        type: "website",
        title: "EwShopping",
        description: "Shop online at EwShopping",
        url: SITE_URL,
        images: [
          { 
            url: DEFAULT_IMAGE, 
            width: 1200, 
            height: 630,
            alt: "EwShopping"
          }
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "EwShopping",
        description: "Shop online at EwShopping",
        images: [DEFAULT_IMAGE],
      },
    };
  }
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatTagPage params={params} />
    </Suspense>
  );
}