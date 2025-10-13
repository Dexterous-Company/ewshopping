// hooks/useCartPriceUpdater.js
import { useDispatch, useSelector } from 'react-redux';
import { refreshCartPrices } from '../redux/cart/CartSlice'; // Adjust path as needed

const useCartPriceUpdater = () => {
  const dispatch = useDispatch();
  const { CartItems } = useSelector((state) => state.cart);

  const updateCartPricesFromServer = async () => {
    if (!CartItems || CartItems.length === 0) {
      console.log("No cart items to update");
      return null;
    }

    try {
      // Get unique attribute IDs from cart items
      const attributeIds = [...new Set(CartItems.map(item => item.AttributeId))];
      console.log("Updating prices for attribute IDs:", attributeIds);
      
      const Baseurl = process.env.NEXT_PUBLIC_API_URL;
      console.log("API URL:", `${Baseurl}/api/v1/product/cart-prices`);
      
      const response = await fetch(`${Baseurl}/api/v1/product/cart-prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attributeIds }),
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("API response:", result);
      
      if (result.success && result.data) {
        // Update cart with current prices
        dispatch(refreshCartPrices(result.data));
        console.log("Cart prices updated successfully");
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to update prices');
      }
    } catch (error) {
      console.error('Failed to update cart prices:', error);
      throw error;
    }
  };

  return updateCartPricesFromServer;
};

export default useCartPriceUpdater;