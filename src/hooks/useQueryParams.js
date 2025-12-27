// Create a new file: /hooks/useQueryParams.js
"use client";

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export function useQueryParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  const [params, setParams] = useState({
    sort: searchParams.get('sort') || 'relevance',
    page: searchParams.get('page') || '1'
  });

  // Update params when searchParams changes
  useEffect(() => {
    const newSort = searchParams.get('sort') || 'relevance';
    const newPage = searchParams.get('page') || '1';
    
    setParams({
      sort: newSort,
      page: newPage
    });
  }, [searchParams]);

  const updateQueryParams = useCallback((updates) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        currentParams.delete(key);
      } else {
        currentParams.set(key, value.toString());
      }
    });
    
    const queryString = currentParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    router.replace(newUrl, { scroll: false });
  }, [searchParams, pathname, router]);

  return { params, updateQueryParams };
}