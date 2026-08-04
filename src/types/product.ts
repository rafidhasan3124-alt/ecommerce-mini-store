export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  oldPrice?: number | null;
  imageUrl: string | null;
  stripePriceId: string;
  category: string | null;
  inStock: boolean;
  stockQuantity?: number;
  isHero?: boolean;
  heroTag?: string | null;
  heroSubtitle?: string | null;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}