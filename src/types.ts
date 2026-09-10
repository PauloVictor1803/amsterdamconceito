export interface Product {
  id: string;
  name: string;
  brand: string;
  originalPrice: number;
  currentPrice: number;
  installments: number;
  image: string;
  hoverImage?: string;
  discount?: number;
  rating: number;
  reviews: number;
  isFull?: boolean;
}
