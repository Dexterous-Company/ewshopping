// hooks/useCartPriceUpdater.js
import { useDispatch, useSelector } from 'react-redux';
import { refreshCartPrices } from '../redux/cart/CartSlice'; // Adjust path as needed

const useCartPriceUpdater = () => {
  const dispatch = useDispatch();
  const { CartItems } = useSelector((state) => state.cart);

  const updateCartPricesFromServer = async () => {
    if (!CartItems || CartItems.length === 0) {
      return null;
    }

    try {
      // Get unique attribute IDs from cart items
      const attributeIds = [...new Set(CartItems.map(item => item.AttributeId))];
      
      const Baseurl = process.env.NEXT_PUBLIC_API_URL;
      
      const response = await fetch(`${Baseurl}/api/v1/product/cart-prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attributeIds }),
      });
      
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // Update cart with current prices
        dispatch(refreshCartPrices(result.data));
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