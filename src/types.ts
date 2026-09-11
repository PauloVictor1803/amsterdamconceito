export interface Product {
  id: string;
  name: string;
  brand: string;
  originalPrice: number;
  currentPrice: number;
  installments: number;
  image: string;
  hoverImage?: string;
  images?: string[];
  discount?: number;
  rating: number;
  reviews: number;
  isFull?: boolean;
  description?: string;
  handle?: string;
  variantId?: string;
  availableForSale?: boolean;
  quantityAvailable?: number;
  options?: { name: string; values: string[] }[];
  variants?: {
    id: string;
    title: string;
    price: number;
    availableForSale: boolean;
    quantityAvailable: number;
    selectedOptions: { name: string; value: string }[];
  }[];
}
