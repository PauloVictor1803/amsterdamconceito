import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { safeJsonParse } from '../lib/security';

export interface CartItem {
  id: string; // This is the Shopify variantId
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variantTitle?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('amsterdam_cart');
      return safeJsonParse<CartItem[]>(saved, [], (data) => {
        if (!Array.isArray(data)) return false;
        return data.every(i => i && typeof i === 'object' && typeof i.id === 'string' && typeof i.price === 'number');
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('amsterdam_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Não foi possível persistir o carrinho localmente:', e);
    }
  }, [items]);

  const addToCart = useCallback((newItem: CartItem) => {
    setItems(current => {
      const existingIndex = current.findIndex(i => i.id === newItem.id);
      if (existingIndex > -1) {
        const next = [...current];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + newItem.quantity
        };
        return next;
      }
      return [...current, newItem];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(current => current.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty < 1) {
      setItems(current => current.filter(i => i.id !== id));
      return;
    }
    setItems(current => current.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);

  const cartCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const value = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
