"use client";

import { useDispatch } from "react-redux";

export default function ReduxLayout({ children }) {
  const dispatch = useDispatch();

  return <>{children}</>;
  
}
