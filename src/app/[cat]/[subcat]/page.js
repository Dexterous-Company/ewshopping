import { Suspense } from "react";
import Subcatmain from "./Subcategory";

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
  const { cat, subcat } = await params; // Remove 'await' - params is not a promise
  
  console.log("Subcategory params:", { cat, subcat });
  console.log("API Base URL:", API_BASE_URL);

  try {
    const apiUrl = `${API_BASE_URL}/api/v1/subcategory/getSubCatUsingSlugScoData/${subcat}`;
    console.log("Calling API:", apiUrl);
    
    const res = await fetch(apiUrl, { 
      cache: "no-store"
    });

    console.log("API Response Status:", res.status);

    if (!res.ok) {
      console.error("API response not OK:", res.status);
      throw new Error(`API failed with status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Subcategory API Response:", data);

    // Check if subcategory exists in response
    if (!data.success || !data.subcategory) {
      console.error("No subcategory found in response");
      throw new Error("Subcategory not found");
    }

    const subcategory = data.subcategory;
    
    console.log("Subcategory data extracted:", {
      name: subcategory.name,
      metaDesc: subcategory.metaDesc,
      mobileImage: subcategory.mobileImage,
      desktopImage: subcategory.desktopImage
    });

    // Format category name (handle undefined)
    const categoryName = cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Category';
    const title = `${subcategory.name} | ${categoryName} | EwShopping`;
    
    // Use the metaDesc from API, fallback to default description
    const description = subcategory.metaDesc || `Explore ${subcategory.name} products at EwShopping`;
    
    // Use mobileImage first, fallback to desktopImage, then DEFAULT_IMAGE
    const rawImage = subcategory.mobileImage || subcategory.desktopImage;
    const imageUrl = toOgImage(rawImage);

    const metadata = {
      title,
      description,
      openGraph: {
        type: "website",
        title,
        description,
        url: `${SITE_URL}/${cat}/${subcat}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${subcategory.name} - EwShopping`
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

    console.log("Generated subcategory metadata:", metadata);
    return metadata;

  } catch (error) {
    console.error("❌ generateMetadata error for subcategory:", error.message);

    // Fallback metadata - simpler version
    const categoryName = cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Category';
    const subcategoryName = subcat ? subcat.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') : 'Subcategory';
    
    const title = `${subcategoryName} | ${categoryName} | EwShopping`;
    const description = `Shop ${subcategoryName.toLowerCase()} products at EwShopping`;
    
    return {
      title,
      description,
      openGraph: {
        type: "website",
        title,
        description,
        url: `${SITE_URL}/${cat}/${subcat}`,
        images: [
          { 
            url: DEFAULT_IMAGE, 
            width: 1200, 
            height: 630,
            alt: `${subcategoryName} - EwShopping`
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
      <Subcatmain params={params} />
    </Suspense>
  );
}