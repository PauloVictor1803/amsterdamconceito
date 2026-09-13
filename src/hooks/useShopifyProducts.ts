import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../types';
import { 
  getShopifyProducts, 
  getShopifyProductByHandle, 
  getCachedShopifyProducts 
} from '../lib/shopify';

const FOCUS_THROTTLE_MS = 4000; // 4 segundos de cooldown para evitar requisições repetidas ao alternar rapidamente de aba

/**
 * Hook de Stale-While-Revalidate (SWR) com Auto-Revalidação ao Focar na Janela.
 * Traz os dados instantaneamente do cache e revalida em segundo plano sem travar ou piscar a tela.
 */
export function useShopifyProducts(searchQuery?: string) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (!searchQuery) {
      const cached = getCachedShopifyProducts();
      if (cached && cached.length > 0) return cached;
    }
    return [];
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (!searchQuery) {
      const cached = getCachedShopifyProducts();
      return !(cached && cached.length > 0);
    }
    return true;
  });

  const [isRevalidating, setIsRevalidating] = useState<boolean>(false);
  const lastRevalidatedRef = useRef<number>(Date.now());
  const isMountedRef = useRef<boolean>(true);

  const revalidate = useCallback(async (forceRefresh = false) => {
    if (!isMountedRef.current) return;
    setIsRevalidating(true);
    try {
      const freshData = await getShopifyProducts(searchQuery, { forceRefresh });
      if (isMountedRef.current) {
        setProducts(freshData);
        setLoading(false);
      }
    } catch (err) {
      console.warn('[SWR] Erro ao sincronizar catálogo Shopify:', err);
    } finally {
      if (isMountedRef.current) {
        setIsRevalidating(false);
      }
    }
  }, [searchQuery]);

  // Carga inicial e background check
  useEffect(() => {
    isMountedRef.current = true;
    revalidate(false);

    return () => {
      isMountedRef.current = false;
    };
  }, [revalidate]);

  // Auto-revalidação ao focar na aba (quando o lojista edita na Shopify e volta para a loja)
  useEffect(() => {
    const handleFocusOrVisibility = () => {
      if (document.visibilityState === 'hidden') return;
      const now = Date.now();
      if (now - lastRevalidatedRef.current >= FOCUS_THROTTLE_MS) {
        lastRevalidatedRef.current = now;
        revalidate(true);
      }
    };

    const handleCacheInvalidated = () => {
      revalidate(true);
    };

    window.addEventListener('focus', handleFocusOrVisibility);
    document.addEventListener('visibilitychange', handleFocusOrVisibility);
    window.addEventListener('online', handleFocusOrVisibility);
    window.addEventListener('shopify:cache-invalidated', handleCacheInvalidated);

    return () => {
      window.removeEventListener('focus', handleFocusOrVisibility);
      document.removeEventListener('visibilitychange', handleFocusOrVisibility);
      window.removeEventListener('online', handleFocusOrVisibility);
      window.removeEventListener('shopify:cache-invalidated', handleCacheInvalidated);
    };
  }, [revalidate]);

  return {
    products,
    loading,
    isRevalidating,
    refresh: () => revalidate(true)
  };
}

/**
 * Hook para carregar e sincronizar detalhes de um produto individual
 */
export function useShopifyProduct(handle?: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRevalidating, setIsRevalidating] = useState<boolean>(false);
  const lastRevalidatedRef = useRef<number>(Date.now());
  const isMountedRef = useRef<boolean>(true);

  const revalidate = useCallback(async (forceRefresh = false) => {
    if (!handle || !isMountedRef.current) return;
    setIsRevalidating(true);
    try {
      const freshProduct = await getShopifyProductByHandle(handle, { forceRefresh });
      if (isMountedRef.current) {
        setProduct(freshProduct);
        setLoading(false);
      }
    } catch (err) {
      console.warn(`[SWR] Erro ao sincronizar produto ${handle}:`, err);
    } finally {
      if (isMountedRef.current) {
        setIsRevalidating(false);
      }
    }
  }, [handle]);

  useEffect(() => {
    isMountedRef.current = true;
    if (handle) {
      revalidate(false);
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [handle, revalidate]);

  useEffect(() => {
    if (!handle) return;

    const handleFocusOrVisibility = () => {
      if (document.visibilityState === 'hidden') return;
      const now = Date.now();
      if (now - lastRevalidatedRef.current >= FOCUS_THROTTLE_MS) {
        lastRevalidatedRef.current = now;
        revalidate(true);
      }
    };

    window.addEventListener('focus', handleFocusOrVisibility);
    document.addEventListener('visibilitychange', handleFocusOrVisibility);
    window.addEventListener('shopify:cache-invalidated', handleFocusOrVisibility);

    return () => {
      window.removeEventListener('focus', handleFocusOrVisibility);
      document.removeEventListener('visibilitychange', handleFocusOrVisibility);
      window.removeEventListener('shopify:cache-invalidated', handleFocusOrVisibility);
    };
  }, [handle, revalidate]);

  return {
    product,
    loading,
    isRevalidating,
    refresh: () => revalidate(true)
  };
}
