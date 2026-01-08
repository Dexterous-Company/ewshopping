import { Suspense } from "react";
import CategoryPageMain from "./categoryPage";

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
  const { cat } = await params; // Only category slug
  
  console.log("Category params:", { cat });

  try {
    const apiUrl = `${API_BASE_URL}/api/v1/category/getCategoryUsingSlugScoData/${cat}`;
    console.log("Calling Category API:", apiUrl);
    
    const res = await fetch(apiUrl, { 
      cache: "no-store"
    });

    console.log("Category API Response Status:", res.status);

    if (!res.ok) {
      console.error("Category API response not OK:", res.status);
      throw new Error(`Category API failed with status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Category API Response:", data);

    // Check if category exists in response
    if (!data.success || !data.category) {
      console.error("No category found in response");
      throw new Error("Category not found");
    }

    const category = data.category;
    
    console.log("Category data extracted:", {
      name: category.name,
      metaDesc: category.metaDesc,
      mobileImage: category.mobileImage,
      desktopImage: category.desktopImage
    });

    // Format category name for title
    const categoryName = category.name;
    const title = `${categoryName} | EwShopping`;
    
    // Use the metaDesc from API, fallback to default description
    const description = category.metaDesc || `Explore ${categoryName} products at EwShopping`;
    
    // Use mobileImage first, fallback to desktopImage, then DEFAULT_IMAGE
    const rawImage = category.mobileImage || category.desktopImage;
    const imageUrl = toOgImage(rawImage);

    const metadata = {
      title,
      description,
      openGraph: {
        type: "website",
        title,
        description,
        url: `${SITE_URL}/${cat}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${categoryName} - EwShopping`
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

    console.log("Generated category metadata:", metadata);
    return metadata;

  } catch (error) {
    console.error("❌ generateMetadata error for category:", error.message);

    // Fallback metadata
    const categoryName = cat ? cat.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : 'Category';
    
    const title = `${categoryName} | EwShopping`;
    const description = `Shop ${categoryName.toLowerCase()} products at EwShopping`;
    
    return {
      title,
      description,
      openGraph: {
        type: "website",
        title,
        description,
        url: `${SITE_URL}/${cat}`,
        images: [
          { 
            url: DEFAULT_IMAGE, 
            width: 1200, 
            height: 630,
            alt: `${categoryName} - EwShopping`
          }
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [DEFAULT_IMAGE],
      },
    };
  }
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryPageMain params={params} />
    </Suspense>
  );
}