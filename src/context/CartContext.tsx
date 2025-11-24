import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Monture, CartItem, Cart } from '../types/marketplace';

interface CartContextType {
  cart: Cart;
  addToCart: (monture: Monture, quantity: number) => void;
  removeFromCart: (montureId: number) => void;
  updateQuantity: (montureId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (montureId: number) => boolean;
  getItemQuantity: (montureId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(() => {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem('opticien_cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch {
        return { items: [], totalItems: 0, totalPrice: 0 };
      }
    }
    return { items: [], totalItems: 0, totalPrice: 0 };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('opticien_cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.monture.price * item.quantity, 0);
    return { totalItems, totalPrice };
  };

  const addToCart = (monture: Monture, quantity: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex((item) => item.monture.id === monture.id);

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        newItems = [...prevCart.items, { monture, quantity }];
      }

      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });
  };

  const removeFromCart = (montureId: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.monture.id !== montureId);
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });
  };

  const updateQuantity = (montureId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(montureId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.monture.id === montureId ? { ...item, quantity } : item
      );
      const { totalItems, totalPrice } = calculateTotals(newItems);
      return { items: newItems, totalItems, totalPrice };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalPrice: 0 });
  };

  const isInCart = (montureId: number): boolean => {
    return cart.items.some((item) => item.monture.id === montureId);
  };

  const getItemQuantity = (montureId: number): number => {
    const item = cart.items.find((item) => item.monture.id === montureId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};