import DOMPurify from 'dompurify';

/**
 * Módulo de Segurança e Defesa Cibernética
 * Amsterdam Conceito - Proteção de credenciais, anti-XSS, sanitização e integridade.
 */

/**
 * Validação de Token Storefront da Shopify
 * Garante que nenhuma credencial de Administrador Privado (shpat_...) foi colocada por engano
 * no frontend público do cliente.
 */
export function isStorefrontTokenSafe(token: string | undefined): boolean {
  if (!token) return false;
  const trimmed = token.trim();
  
  // Se começar com prefixos de Admin da Shopify (shpat_, shpca_, shppa_), é um token de backend privado!
  if (/^shpat_[a-zA-Z0-9]+/i.test(trimmed) || /^shpca_[a-zA-Z0-9]+/i.test(trimmed) || /^shppa_[a-zA-Z0-9]+/i.test(trimmed)) {
    console.error(
      "ALERTA DE SEGURANÇA CRÍTICO: Um token de Administrador da Shopify (shpat_) foi detectado na variável VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN. " +
      "Tokens de Admin NUNCA devem ser colocados em variáveis públicas do cliente. O acesso foi bloqueado para proteger a loja."
    );
    return false;
  }
  return true;
}

/**
 * Limpa e valida o domínio da loja para prevenir injeção de cabeçalhos ou URLs maliciosas.
 */
export function sanitizeShopifyDomain(rawDomain: string | undefined): string | null {
  if (!rawDomain) return null;
  // Remove protocolo (https://), barras finais e espaços
  const cleaned = rawDomain.replace(/^https?:\/\//i, '').replace(/\/+.*$/, '').trim();
  // Valida que o domínio contém apenas caracteres válidos de host (letras, números, hífen, ponto)
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(cleaned)) {
    console.warn("Domínio da Shopify inválido ou suspeito:", rawDomain);
    return null;
  }
  return cleaned;
}

/**
 * Proteção contra Open Redirect (Redirecionamento Aberto / Phishing).
 * Garante que a URL gerada para Checkout pertença obrigatoriamente
 * ao ecossistema legítimo e oficial da Shopify (https://...myshopify.com ou shopify.com) ou ao domínio configurado.
 */
export function isSafeCheckoutUrl(url: string | null | undefined, storeDomain?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    // Deve ser estritamente protocolo HTTPS
    if (parsed.protocol !== 'https:') {
      console.warn("Protocolo inseguro rejeitado no checkout:", parsed.protocol);
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    
    // Lista de domínios seguros da infraestrutura oficial de checkout da Shopify
    const isShopifyHost = 
      host.endsWith('.myshopify.com') || 
      host.endsWith('.shopify.com') || 
      host === 'checkout.shopify.com' ||
      host === 'shop.app';

    if (isShopifyHost) {
      return true;
    }

    // Se a loja tiver domínio próprio configurado
    if (storeDomain) {
      const cleanStore = storeDomain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '');
      if (host === cleanStore || host.endsWith('.' + cleanStore)) {
        return true;
      }
    }

    console.warn("URL de checkout bloqueada por não pertencer a um domínio autorizado da Shopify:", url);
    return false;
  } catch {
    return false;
  }
}

/**
 * Sanitiza strings e previne injeção XSS e payloads excessivamente longos.
 */
export function sanitizeInputString(val: unknown, maxLen = 300): string {
  if (typeof val !== 'string') return '';
  const trimmed = val.trim().slice(0, maxLen);
  return DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [] });
}

/**
 * Validação de URL segura para imagens e mídias externas.
 * Permite apenas protocolos https:// e bloqueia javascript: ou data: maliciosos.
 */
export function isSafeMediaUrl(url: unknown): boolean {
  if (typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Parsing seguro de JSON com validação de tipo para proteção contra Prototype Pollution e falhas.
 */
export function safeJsonParse<T>(
  raw: string | null | undefined, 
  fallback: T, 
  validator?: (parsed: unknown) => boolean
): T {
  if (!raw || typeof raw !== 'string') return fallback;
  try {
    const parsed = JSON.parse(raw);
    // Prevenção de prototype pollution
    if (parsed && typeof parsed === 'object') {
      if ('__proto__' in parsed || 'constructor' in parsed || 'prototype' in parsed) {
        delete (parsed as Record<string, unknown>).__proto__;
        delete (parsed as Record<string, unknown>).constructor;
        delete (parsed as Record<string, unknown>).prototype;
      }
    }
    if (validator && !validator(parsed)) {
      return fallback;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

/**
 * Hash criptográfico seguro (SHA-256) nativo no navegador usando Web Crypto API.
 */
export async function sha256Hex(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
