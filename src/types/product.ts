export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stripePriceId: string; 
  category: string;
  inStock: boolean;
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