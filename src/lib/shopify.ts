import { Product } from '../types';
import { products as localProducts } from '../data';

const domain = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function fetchShopify(query: string, variables = {}) {
  if (!domain || !token) {
    console.warn("Shopify credentials not set.");
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
    installments: 10,
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

export async function getShopifyProducts(searchQuery?: string): Promise<Product[]> {
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
    
    if (shopifyItems.length > 0) {
      // Priorizar os produtos reais da Shopify no topo, evitando duplicatas com o catálogo local
      const shopifyHandles = new Set(shopifyItems.map((p: Product) => p.handle));
      const remainingLocal = localProducts.filter(p => !shopifyHandles.has(p.handle || p.id));
      const combined = [...shopifyItems, ...remainingLocal];
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return combined.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
        );
      }
      return combined;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return localProducts.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    return localProducts;
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
    return localProducts;
  }
}

export async function getShopifyProductByHandle(handle: string): Promise<Product | null> {
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
      return mapShopifyProduct(data.product);
    }
  } catch (err) {
    console.warn("Erro ao buscar produto por handle na Shopify:", err);
  }
  
  // Fallback para o catálogo local caso o produto seja do catálogo de demonstração
  const localMatch = localProducts.find(p => (p.handle || p.id) === handle || p.id === handle);
  return localMatch || null;
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
  return data?.cartCreate?.cart?.checkoutUrl || null;
}
