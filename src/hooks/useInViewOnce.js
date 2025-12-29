// hooks/useInViewOnce.js
import { useEffect, useRef, useState } from "react";

export function useInViewOnce(options = { rootMargin: "200px" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible, options]);

  return { ref, visible };
}
