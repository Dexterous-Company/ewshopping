const optimizeImage = (url, w = 300, h = 300) => {
  if (!url) return "";

  // Cloudinary auto optimization
  if (url.includes("res.cloudinary.com")) {
    return url.replace(
      "/upload/",
      `/upload/w_${w},h_${h},c_fill,q_auto,f_auto/`
    );
  }

  // Backend uploads optimization
  if (url.includes("/uploads/")) {
    // Convert absolute or relative URLs
    const cleanedUrl = url.startsWith("http")
      ? url
      : `${process.env.NEXT_PUBLIC_API_URL}${url}`;

    // Transform-style format (your backend will generate optimized version)
    return cleanedUrl.replace(
      "/uploads/",
      `/uploads/optimized/w_${w}_h_${h}_q_70_`
    );
  }

  return url;
};

export default optimizeImage;
