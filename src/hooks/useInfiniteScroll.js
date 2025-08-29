import { useState, useEffect } from "react";

const useInfiniteScroll = (callback, offset = 300) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      // Trigger when 300px close to the bottom
      if (!isFetching && scrollHeight - scrollTop - clientHeight < offset) {
        setIsFetching(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching]);

  useEffect(() => {
    if (!isFetching) return;
    callback(); // loadMore()
  }, [isFetching]);

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
