// "use client";

// import Image from "next/image";
// import React, {
//   useRef,
//   useEffect,
//   useMemo,
//   useState,
//   useCallback,
// } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   getSubCategory,
//   resetSubCategories,
//   getCategoryTags,
// } from "../../redux/header/HeaderSubSlice";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// const CategoryCarousel = () => {
//   const scrollRef = useRef(null);
//   const hoverCache = useRef(new Set()); // ✅ cache hover fetch
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [isMobile, setIsMobile] = useState(false);
//   const hoverTimer = useRef(null);

//   const {
//     subCategories = [],
//     status,
//     error,
//   } = useSelector((state) => state.subCat);

//   /* -------------------- INIT -------------------- */
//   useEffect(() => {
//     dispatch(resetSubCategories());
//     dispatch(getSubCategory());

//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize, { passive: true });
//     return () => window.removeEventListener("resize", handleResize);
//   }, [dispatch]);

//   /* -------------------- SCROLL (DESKTOP ONLY) -------------------- */
//   const handleWheel = useCallback((e) => {
//   if (!scrollRef.current) return;
//   if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
//     e.preventDefault();
//     requestAnimationFrame(() => {
//       scrollRef.current.scrollLeft += e.deltaY * 1.5;
//     });
//   }
// }, []);


//   useEffect(() => {
//     if (!isMobile && scrollRef.current) {
//       const el = scrollRef.current;
//       el.addEventListener("wheel", handleWheel, { passive: false });
//       return () => el.removeEventListener("wheel", handleWheel);
//     }
//   }, [isMobile, handleWheel]);

//   /* -------------------- HOVER FETCH (CACHED) -------------------- */
//   const handleMouseEnter = (category) => {
//     if (isMobile) return;

//     clearTimeout(hoverTimer.current);
//     hoverTimer.current = setTimeout(() => {
    

//       if (!hoverCache.current.has(category.slugUrl)) {
//         hoverCache.current.add(category.slugUrl);
//         dispatch(getCategoryTags(category.slugUrl));
//       }
//     }, 250);
//   };

//   const handleMouseLeave = () => {
//     clearTimeout(hoverTimer.current);
//     hoverTimer.current = setTimeout(() => {

//     }, 250);
//   };

//   /* -------------------- CLICK -------------------- */
//   const handleClick = (subCat) => {
//     router.push(`/${subCat.categoryUrl}/${subCat.slugUrl}`);
//   };

//   /* -------------------- RENDER -------------------- */
//   return (
//     <div className="relative bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-100">
//       <div
//         ref={scrollRef}
//         className="flex gap-3 px-2 py-3 overflow-x-auto no-scrollbar scroll-smooth"
//         style={{ minHeight: 130 }}   
//       >
//         {status === "loading" &&
//           Array.from({ length: 10 }).map((_, i) => (
//             <div key={i} className="min-w-[80px] sm:min-w-[100px] text-center">
//               <div className="w-[85px] h-[85px] mx-auto rounded-full bg-gray-200 animate-pulse" />
//               <div className="h-[12px] w-[60px] mx-auto mt-2 rounded bg-gray-200 animate-pulse" />
//             </div>
//           ))}

      
//         {status === "succeeded" &&
//           subCategories.map((subCat, index) => (
//             <div
//               key={subCat._id}
//               className="min-w-[80px] sm:min-w-[100px] text-center cursor-pointer group"
//               onMouseEnter={() => handleMouseEnter(subCat)}
//               onMouseLeave={handleMouseLeave}
//               onClick={() => handleClick(subCat)}
//             >
//               <div className="relative w-[85px] h-[85px] mx-auto rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:scale-105 transition">
//                 <Image
//                   src={subCat.desktopImage || subCat.mobileImage}
//                   alt={subCat.name}
//                   fill
//                   sizes="85px"
//                   className="object-cover"
//                   priority={index < 4}
//                   fetchPriority={index < 4 ? "high" : "auto"}
//                   decoding="async"
//                 />
//               </div>

//               <p className="mt-2 text-[12px] h-[16px] font-semibold text-slate-800 truncate">
//                 {subCat.name}
//               </p>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default React.memo(CategoryCarousel);



"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  getSubCategory,
  resetSubCategories,
  getCategoryTags,
} from "../../redux/header/HeaderSubSlice";

const CategoryCarousel = () => {
  const scrollRef = useRef(null);
  const hoverCache = useRef(new Set());
  const hoverTimer = useRef(null);

  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(false);

  const {
    subCategories = [],
    status,
  } = useSelector((state) => state.subCat);

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    dispatch(resetSubCategories());
    dispatch(getSubCategory());

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  /* -------------------- SCROLL (DESKTOP ONLY) -------------------- */
  const handleWheel = useCallback((e) => {
    if (!scrollRef.current) return;

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      requestAnimationFrame(() => {
        scrollRef.current.scrollLeft += e.deltaY * 1.5;
      });
    }
  }, []);

  useEffect(() => {
    if (!isMobile && scrollRef.current) {
      const el = scrollRef.current;
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, [isMobile, handleWheel]);

  /* -------------------- HOVER FETCH (CACHED) -------------------- */
  const handleMouseEnter = (category) => {
    if (isMobile) return;

    clearTimeout(hoverTimer.current);

    hoverTimer.current = setTimeout(() => {
      if (!hoverCache.current.has(category.slugUrl)) {
        hoverCache.current.add(category.slugUrl);
        dispatch(getCategoryTags(category.slugUrl));
      }
    }, 250);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="relative bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-100">
      <div
        ref={scrollRef}
        className="flex gap-3 px-2 py-3 overflow-x-auto no-scrollbar scroll-smooth"
        style={{ minHeight: 130 }}
      >
        {/* Skeleton Loader */}
        {status === "loading" &&
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[80px] sm:min-w-[100px] text-center"
            >
              <div className="w-[85px] h-[85px] mx-auto rounded-full bg-gray-200 animate-pulse" />
              <div className="h-[12px] w-[60px] mx-auto mt-2 rounded bg-gray-200 animate-pulse" />
            </div>
          ))}

        {/* Categories */}
        {status === "succeeded" &&
          subCategories.map((subCat, index) => (
            <Link
              key={subCat._id}
              href={`/${subCat.categoryUrl}/${subCat.slugUrl}`}
              className="min-w-[80px] sm:min-w-[100px] text-center cursor-pointer group"
              onMouseEnter={() => handleMouseEnter(subCat)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative w-[85px] h-[85px] mx-auto rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:scale-105 transition">
                <Image
                  src={subCat.desktopImage || subCat.mobileImage}
                  alt={subCat.name}
                  fill
                  sizes="85px"
                  className="object-cover"
                  priority={index < 4}
                  fetchPriority={index < 4 ? "high" : "auto"}
                  decoding="async"
                />
              </div>

              <p className="mt-2 text-[12px] h-[16px] font-semibold text-slate-800 truncate">
                {subCat.name}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default React.memo(CategoryCarousel);

