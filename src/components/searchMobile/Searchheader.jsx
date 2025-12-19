"use client";
import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

const SearchHeader = ({ setQuerySearch, onFocus, querySearch }) => {
  const router = useRouter();
  
  const handleSearch = (e) => {
    if (e.key === 'Enter' && querySearch.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set('q', querySearch.trim());
      router.push(`/search?${searchParams.toString()}`);
    }
  };

  return (
    <div className="w-full shadow-md shadow-gray-200">
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search For Products, Brand or More"
        onChange={(e) => setQuerySearch(e.target.value)}
        value={querySearch}
        onFocus={onFocus}
        onKeyPress={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IoMdArrowBack size={18} onClick={() => router.back()} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <RxCross2 size={18} onClick={() => setQuerySearch("")} />
            </InputAdornment>
          ),
        }}
        sx={{ fontSize: 0.5 }}
      />
    </div>
  );
};

export default SearchHeader;
