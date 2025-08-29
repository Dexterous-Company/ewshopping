import { useState, useEffect, useCallback } from "react";

const useHorizontalInfiniteScroll = (callback, scrollContainerRef, offset = 300) => {
  const [isFetching, setIsFetching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isFetching) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const scrollPosition = scrollLeft + clientWidth;
    
    if (scrollWidth - scrollPosition < offset) {
      setIsFetching(true);
      callback();
    }
  }, [callback, isFetching, offset, scrollContainerRef]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll, scrollContainerRef]);

  return [isFetching, setIsFetching];
};

export default useHorizontalInfiniteScroll;