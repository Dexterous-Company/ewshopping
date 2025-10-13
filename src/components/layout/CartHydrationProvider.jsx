// components/CartHydrationProvider.js
"use client";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateCart } from '@/redux/cart/CartSlice';

const CartHydrationProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Hydrate cart from localStorage on component mount
    dispatch(hydrateCart());
  }, [dispatch]);

  return children;
};

export default CartHydrationProvider;