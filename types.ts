
export interface Product {
  id: string;
  name: string;
  category: 'skincare' | 'haircare' | 'coming-soon';
  price: number | string;
  weight?: string;
  volume?: string;
  badge: string;
  description: string;
  ingredients: string[];
  usage: string;
  storage: string;
  packaging: string;
  skinType?: string; // From Architecture Spec
  image: string;
  sizes?: { label: string; price: number; id?: string }[];
}

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedSize?: { label: string; price: number };
}

export interface NavItem {
  label: string;
  path: string;
}
