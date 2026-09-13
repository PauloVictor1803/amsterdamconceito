import { Product } from '../types';
import { products as localProducts } from '../data';
import { sanitizeShopifyDomain, isStorefrontTokenSafe, isSafeCheckoutUrl } from './security';

const rawDomain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const rawToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const domain = sanitizeShopifyDomain(rawDomain);
const token = isStorefrontTokenSafe(rawToken) ? rawToken?.trim() : null;

// In-memory cache to prevent duplicate requests and re-fetching across page navigation
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes
let cachedProductsPromise: Promise<Product[]> | null = null;
let cachedProducts: { data: Product[]; timestamp: number } | null = null;

const productHandleCache = new Map<string, { data: Product | null; timestamp: number }>();
let cachedConfigPromise: Promise<Record<string, string | { url: string; altText?: string }> | null> | null = null;
let cachedConfig: { data: Record<string, string | { url: string; altText?: string }> | null; timestamp: number } | null = null;

async function fetchShopify(query: string, variables = {}) {
  if (!domain || !token) {
    console.warn("Shopify credentials not configured or failed security validation.");
    return null;
  }
  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const { data, errors } = await response.json();
  if (errors) {
    console.error("Shopify API Errors:", errors);
  }
  return data;
}

function mapShopifyProduct(node: any): Product {
  const variantNode = node.variants?.edges[0]?.node;
  const price = parseFloat(variantNode?.price?.amount || "0");
  const compareAtPrice = variantNode?.compareAtPrice 
    ? parseFloat(variantNode.compareAtPrice.amount) 
    : null;
    
  let discount = 0;
  if (compareAtPrice && compareAtPrice > price) {
    discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  }

  const allImages = node.images?.edges?.map((edge: any) => edge.node.url) || [];

  const options = node.options?.map((opt: any) => ({
    name: opt.name,
    values: opt.values
  })) || [];

  const variants = node.variants?.edges?.map((edge: any) => {
    const v = edge.node;
    return {
      id: v.id,
      title: v.title,
      price: parseFloat(v.price?.amount || "0"),
      availableForSale: v.availableForSale !== false,
      quantityAvailable: v.quantityAvailable,
      selectedOptions: v.selectedOptions || []
    };
  }) || [];

  // Extrair parcelas das tags (ex: 'parcelas:6' ou 'parcelas:12') ou metafield
  let installments = 10;
  const parcelasTag = node.tags?.find((t: string) => t.toLowerCase().startsWith('parcelas:'));
  if (parcelasTag) {
    const parsed = parseInt(parcelasTag.split(':')[1], 10);
    if (!isNaN(parsed) && parsed > 0) installments = parsed;
  } else if (node.parcelasMetafield?.value) {
    const parsed = parseInt(node.parcelasMetafield.value, 10);
    if (!isNaN(parsed) && parsed > 0) installments = parsed;
  }

  // Badge dinâmico por tags (ex: 'ofertas', 'tendencia', 'mais-vistos', 'imperdivel', 'novo')
  let badge = 'Ofertas';
  const lowerTags = (node.tags || []).map((t: string) => t.toLowerCase());
  if (lowerTags.includes('imperdivel') || lowerTags.includes('imperdível')) {
    badge = 'Imperdível';
  } else if (lowerTags.includes('tendencia') || lowerTags.includes('tendência')) {
    badge = 'Tendência';
  } else if (lowerTags.includes('mais-visto') || lowerTags.includes('mais-vistos') || lowerTags.includes('mais vistos')) {
    badge = 'Mais Visto';
  } else if (lowerTags.includes('novo') || lowerTags.includes('novidade')) {
    badge = 'Novidade';
  }

  return {
    id: node.id,
    handle: node.handle,
    variantId: variantNode?.id || '',
    name: node.title,
    brand: node.vendor || 'Amsterdam',
    originalPrice: compareAtPrice || price,
    currentPrice: price,
    image: allImages[0] || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    hoverImage: allImages[1],
    images: allImages,
    discount: discount > 0 ? discount : undefined,
    rating: 0,
    reviews: 0,
    installments,
    badge,
    isFull: true,
    description: node.descriptionHtml || node.description || '',
    availableForSale: variantNode?.availableForSale !== false,
    totalInventory: node.totalInventory,
    quantityAvailable: variantNode?.quantityAvailable,
    options,
    variants,
    tags: node.tags || [],
    category: node.productType || ''
  };
}

export function getCachedShopifyProducts(): Product[] | null {
  return cachedProducts ? cachedProducts.data : null;
}

export function invalidateShopifyCache() {
  cachedProducts = null;
  cachedProductsPromise = null;
  productHandleCache.clear();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('shopify:cache-invalidated'));
  }
}

export async function getShopifyProducts(
  searchQuery?: string,
  options?: { forceRefresh?: boolean }
): Promise<Product[]> {
  const isGenericFetch = !searchQuery;
  const now = Date.now();
  const force = options?.forceRefresh ?? false;

  // Return cached result for general catalog requests if fresh and not forcing refresh
  if (isGenericFetch && !force && cachedProducts && (now - cachedProducts.timestamp < CACHE_TTL_MS)) {
    return cachedProducts.data;
  }

  // Deduplicate inflight promise for generic fetch
  if (isGenericFetch && !force && cachedProductsPromise) {
    return cachedProductsPromise;
  }

  const fetchPromise = (async () => {
    try {
      const queryArgs = searchQuery ? `first: 50, query: "${searchQuery}*"` : `first: 50`;
      const query = `
        {
          products(${queryArgs}) {
            edges {
              node {
                id
                title
                handle
                vendor
                productType
                tags
                totalInventory
                options {
                  name
                  values
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price { amount }
                      compareAtPrice { amount }
                      availableForSale
                      quantityAvailable
                      selectedOptions {
                        name
                        value
                      }
                    }
                  }
                }
                images(first: 5) {
                  edges {
                    node { url }
                  }
                }
              }
            }
          }
        }
      `;
      const data = await fetchShopify(query);
      const shopifyItems = (data?.products?.edges || []).map(({ node }: any) => mapShopifyProduct(node));
      
      let result: Product[];

      if (shopifyItems.length > 0) {
        // Priorizar os produtos reais da Shopify no topo, evitando duplicatas com o catálogo local
        const shopifyHandles = new Set(shopifyItems.map((p: Product) => p.handle));
        const remainingLocal = localProducts.filter(p => !shopifyHandles.has(p.handle || p.id));
        const combined = [...shopifyItems, ...remainingLocal];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          result = combined.filter(p => 
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q) ||
            p.tags?.some(t => t.toLowerCase().includes(q))
          );
        } else {
          result = combined;
        }
      } else if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = localProducts.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
        );
      } else {
        result = localProducts;
      }

      if (isGenericFetch) {
        cachedProducts = { data: result, timestamp: Date.now() };
      }
      return result;
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      return localProducts;
    } finally {
      if (isGenericFetch) {
        cachedProductsPromise = null;
      }
    }
  })();

  if (isGenericFetch) {
    cachedProductsPromise = fetchPromise;
  }

  return fetchPromise;
}

export async function getShopifyProductByHandle(
  handle: string,
  options?: { forceRefresh?: boolean }
): Promise<Product | null> {
  const now = Date.now();
  const force = options?.forceRefresh ?? false;
  const cached = productHandleCache.get(handle);
  if (!force && cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  try {
    const query = `
      query getProduct($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          vendor
          productType
          tags
          totalInventory
          descriptionHtml
          options {
            name
            values
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price { amount }
                compareAtPrice { amount }
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          images(first: 6) {
            edges {
              node { url }
            }
          }
        }
      }
    `;
    const data = await fetchShopify(query, { handle });
    if (data?.product) {
      const mapped = mapShopifyProduct(data.product);
      productHandleCache.set(handle, { data: mapped, timestamp: Date.now() });
      return mapped;
    }
  } catch (err) {
    console.warn("Erro ao buscar produto por handle na Shopify:", err);
  }
  
  // Fallback para o catálogo local caso o produto seja do catálogo de demonstração
  const localMatch = localProducts.find(p => (p.handle || p.id) === handle || p.id === handle) || null;
  productHandleCache.set(handle, { data: localMatch, timestamp: Date.now() });
  return localMatch;
}

export async function createShopifyCheckout(lines: { variantId: string, quantity: number }[]) {
  const query = `
    mutation cartCreate($input: CartInput) {
      cartCreate(input: $input) {
        cart {
          checkoutUrl
        }
      }
    }
  `;
  const variables = {
    input: {
      lines: lines.map(line => ({
        merchandiseId: line.variantId,
        quantity: line.quantity
      }))
    }
  };
  const data = await fetchShopify(query, variables);
  const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl;

  // Validação estrita de segurança contra Open Redirect
  if (checkoutUrl && isSafeCheckoutUrl(checkoutUrl, domain || undefined)) {
    return checkoutUrl;
  }

  if (checkoutUrl) {
    console.error("URL de checkout rejeitada por falha nos critérios de segurança cibernética.");
  }
  return null;
}

export async function getStoreConfig(): Promise<Record<string, string | { url: string, altText?: string }> | null> {
  const now = Date.now();
  if (cachedConfig && (now - cachedConfig.timestamp < CACHE_TTL_MS)) {
    return cachedConfig.data;
  }
  if (cachedConfigPromise) {
    return cachedConfigPromise;
  }

  cachedConfigPromise = (async () => {
    const query = `
      query ObterDadosHome {
        metaobject(handle: { type: "configuracoes_loja", handle: "geral" }) {
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    `;
    try {
      const data = await fetchShopify(query);
      if (data?.metaobject?.fields) {
        const config: Record<string, string | { url: string, altText?: string }> = {};
        data.metaobject.fields.forEach((field: any) => {
          if (field.reference?.image) {
            config[field.key] = {
              url: field.reference.image.url,
              altText: field.reference.image.altText || ''
            };
          } else {
            config[field.key] = field.value;
          }
        });
        cachedConfig = { data: config, timestamp: Date.now() };
        return config;
      }
    } catch (err) {
      console.warn("Erro ao buscar configuracoes_loja na Shopify:", err);
    } finally {
      cachedConfigPromise = null;
    }
    return null;
  })();

  return cachedConfigPromise;
}

