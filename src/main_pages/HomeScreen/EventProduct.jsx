"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* ----------------------------------
   PRODUCT CARD
----------------------------------- */
const ProductCard = ({ product, index }) => {
  const router = useRouter();
  const [preload, setPreload] = useState(false);

  const discount = Math.round(
    ((product.mrpRange - product.priceRange) / product.mrpRange) * 100
  );

  // ✅ Preload second image only on hover
  useEffect(() => {
    if (!preload || !product.thumbnail?.[1]) return;
    const img = new window.Image();
    img.src = product.thumbnail[1];
  }, [preload, product.thumbnail]);

  return (
    <div
      className="min-w-[120px] md:w-[160px] cursor-pointer"
      onMouseEnter={() => setPreload(true)}
      onClick={() => router.push(`/product/${product.slugUrl}`)}
    >
      <div className="bg-white/10 rounded-lg overflow-hidden border border-white/20 hover:scale-[1.02] transition">
        {/* IMAGE */}
        <div className="relative aspect-square bg-white group">
          <Image
            src={product.thumbnail[0]}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 120px, 160px"
            className="object-contain"
            priority={index < 2}
          />

          {/* DISCOUNT */}
          {discount > 0 && (
            <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] px-1 rounded">
              {discount}% OFF
            </span>
          )}

          {/* PRICE */}
          <div className="absolute bottom-0 w-full bg-cyan-100 text-center text-xs font-bold">
            ₹{product.priceRange}
            <span className="ml-1 text-[10px] line-through text-gray-600">
              ₹{product.mrpRange}
            </span>
          </div>
        </div>

        {/* INFO */}
        <div className="bg-indigo-900 px-1 py-1">
          <p className="text-xs text-white truncate">{product.name}</p>
          <p className="text-[10px] text-white/70 truncate">
            {product.shortDescription || "Premium Product"}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------
   LOADING SKELETON
----------------------------------- */
const ProductGridSkeleton = () => (
  <div className="flex gap-2 overflow-x-auto">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="min-w-[140px] animate-pulse">
        <div className="bg-white/20 aspect-square rounded mb-2" />
        <div className="bg-white/20 h-10 rounded" />
      </div>
    ))}
  </div>
);

/* ----------------------------------
   SCROLL CONTAINER
----------------------------------- */
const ProductScroll = ({ products, loading }) => {
  const ref = useRef(null);

  // ✅ Mouse wheel horizontal scroll
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  if (loading) return <ProductGridSkeleton />;

  if (!products.length) {
    return <p className="text-white text-center py-4">No products found</p>;
  }

  return (
    <div ref={ref} className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-2">
        {products.map((p, i) => (
          <ProductCard key={p._id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
};

/* ----------------------------------
   MAIN COMPONENT (FETCH INSIDE)
----------------------------------- */
const MobileAccessoriesIOSPhones = ({
  bgGradient = "bg-gradient-to-br from-amber-500 to-rose-600",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch INSIDE component
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/product/getEventProduct/mobile-accessories-ios-phones`,
          { signal: controller.signal }
        );

        const data = await res.json();
        if (data.success) setProducts(data.product || []);
        else setError("Failed to load products");
      } catch (err) {
        if (err.name !== "AbortError") setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  return (
    <section className="w-full relative">
      <div className={`p-2 rounded-lg ${bgGradient}`}>
        <h3 className="text-white font-bold mb-2">Trending Products</h3>

        {error ? (
          <p className="text-red-300 text-sm">{error}</p>
        ) : (
          <ProductScroll products={products} loading={loading} />
        )}
      </div>
    </section>
  );
};

export default MobileAccessoriesIOSPhones;
