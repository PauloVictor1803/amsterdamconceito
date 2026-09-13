import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '../types';
import { safeJsonParse } from '../lib/security';

interface WishlistContextType {
  items: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('amsterdam_wishlist');
      return safeJsonParse<Product[]>(saved, [], (data) => {
        if (!Array.isArray(data)) return false;
        return data.every(i => i && typeof i === 'object' && typeof i.id === 'string');
      });
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('amsterdam_wishlist', JSON.stringify(items));
    } catch (e) {
      console.warn('Não foi possível persistir a lista de desejos localmente:', e);
    }
  }, [items]);

  const toggleWishlist = useCallback((product: Product) => {
    setItems(current => {
      const exists = current.some(i => i.id === product.id);
      if (exists) {
        return current.filter(i => i.id !== product.id);
      }
      return [...current, product];
    });
  }, []);

  const isInWishlist = useCallback((id: string) => {
    return items.some(i => i.id === id);
  }, [items]);

  const wishlistCount = items.length;

  const value = useMemo(() => ({
    items,
    toggleWishlist,
    isInWishlist,
    wishlistCount
  }), [items, toggleWishlist, isInWishlist, wishlistCount]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
