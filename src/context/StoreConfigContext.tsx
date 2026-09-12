import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoreConfig } from '../lib/shopify';

type ConfigValue = string | { url: string; altText?: string };

interface StoreConfigContextData {
  config: Record<string, ConfigValue> | null;
  loading: boolean;
}

const StoreConfigContext = createContext<StoreConfigContextData>({
  config: null,
  loading: true,
});

export const StoreConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Record<string, ConfigValue> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      const data = await getStoreConfig();
      setConfig(data);
      setLoading(false);
    }
    loadConfig();
  }, []);

  return (
    <StoreConfigContext.Provider value={{ config, loading }}>
      {children}
    </StoreConfigContext.Provider>
  );
};

export const useStoreConfig = () => useContext(StoreConfigContext);
