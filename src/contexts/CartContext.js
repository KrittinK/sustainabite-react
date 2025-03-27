// contexts/CartContext.js - Shopping cart context
import { createContext } from 'react';

const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {}
});

export default CartContext;