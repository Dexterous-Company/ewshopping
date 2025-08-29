import ProductTags from "@/components/productTags/ProductTags";

function page({ params }) {
  return <ProductTags slug={params?.subcat} />;
} 

export default page;
