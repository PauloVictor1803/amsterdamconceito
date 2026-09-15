import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { getStoreConfig, getCachedStoreConfig } from '../lib/shopify';

type ConfigValue = string | { url: string; altText?: string };

interface StoreConfigContextData {
  config: Record<string, ConfigValue> | null;
  loading: boolean;
  refreshConfig: () => Promise<void>;
}

const StoreConfigContext = createContext<StoreConfigContextData>({
  config: null,
  loading: true,
  refreshConfig: async () => {},
});

const FOCUS_THROTTLE_MS = 3000;

export const StoreConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Record<string, ConfigValue> | null>(() => getCachedStoreConfig());
  const [loading, setLoading] = useState(() => !getCachedStoreConfig());
  const lastRevalidatedRef = useRef<number>(Date.now());
  const isMountedRef = useRef<boolean>(true);

  const loadConfig = useCallback(async (forceRefresh = false) => {
    try {
      const data = await getStoreConfig({ forceRefresh });
      if (isMountedRef.current) {
        setConfig(data);
        setLoading(false);
      }
    } catch (err) {
      console.warn("Erro ao carregar StoreConfig:", err);
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadConfig(false);

    return () => {
      isMountedRef.current = false;
    };
  }, [loadConfig]);

  // Revalidação automática quando o lojista troca de aba / volta para a aba da loja
  useEffect(() => {
    const handleFocusOrVisibility = () => {
      if (document.visibilityState === 'hidden') return;
      const now = Date.now();
      if (now - lastRevalidatedRef.current >= FOCUS_THROTTLE_MS) {
        lastRevalidatedRef.current = now;
        loadConfig(true);
      }
    };

    const handleCacheInvalidated = () => {
      loadConfig(true);
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
  }, [loadConfig]);

  return (
    <StoreConfigContext.Provider value={{ config, loading, refreshConfig: () => loadConfig(true) }}>
      {children}
    </StoreConfigContext.Provider>
  );
};

export const useStoreConfig = () => useContext(StoreConfigContext);
