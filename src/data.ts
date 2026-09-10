import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Tênis Adidas VL Court 3.0 Feminino',
    brand: 'Adidas',
    originalPrice: 399.99,
    currentPrice: 299.99,
    installments: 4,
    discount: 25,
    rating: 4.5,
    reviews: 128,
    isFull: true,
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80'
  },
  {
    id: '2',
    name: 'Tênis Nike Revolution 7 Feminino',
    brand: 'Nike',
    originalPrice: 349.99,
    currentPrice: 229.99,
    installments: 3,
    discount: 34,
    rating: 5,
    reviews: 84,
    isFull: true,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80'
  },
  {
    id: '3',
    name: 'Top De Treino Mizuno Soul Fit New 6 Feminino',
    brand: 'Mizuno',
    originalPrice: 199.99,
    currentPrice: 129.99,
    installments: 2,
    discount: 35,
    rating: 4,
    reviews: 42,
    isFull: false,
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80'
  },
  {
    id: '4',
    name: 'Tênis Masculino Caminhada Leve Confortável Casual',
    brand: 'Democrata',
    originalPrice: 229.99,
    currentPrice: 93.41,
    installments: 2,
    discount: 59,
    rating: 4.5,
    reviews: 210,
    isFull: true,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80'
  },
  {
    id: '5',
    name: 'Camiseta Hering World Com Bordado Masculina',
    brand: 'Hering',
    originalPrice: 79.99,
    currentPrice: 28.49,
    installments: 1,
    discount: 64,
    rating: 4.8,
    reviews: 532,
    isFull: true,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'
  },
  {
    id: '6',
    name: 'Kit 2 Short Bermuda Leve Dry Academia Treino',
    brand: 'Zattini',
    originalPrice: 69.99,
    currentPrice: 53.99,
    installments: 1,
    discount: 22,
    rating: 4.2,
    reviews: 95,
    isFull: true,
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80'
  },
  {
    id: '7',
    name: 'Bolsa Santa Lolla Shopper Feminina',
    brand: 'Santa Lolla',
    originalPrice: 299.90,
    currentPrice: 199.90,
    installments: 3,
    discount: 33,
    rating: 4.9,
    reviews: 340,
    isFull: true,
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80'
  },
  {
    id: '8',
    name: 'Jaqueta Corta Vento Approve Masculina',
    brand: 'Approve',
    originalPrice: 349.90,
    currentPrice: 189.90,
    installments: 3,
    discount: 45,
    rating: 4.6,
    reviews: 67,
    isFull: false,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=600&q=80'
  }
];

export const categories = [
  'Todas as categorias',
  'Feminino',
  'Masculino',
  'Infantil',
  'Beleza',
  'Esporte',
  'Marcas',
  'Ofertas'
];
