export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Price in USD
  images: string[];
  categoryId: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export enum PaymentMethod {
  USDC = 'USDC',
  FLOCKA = 'FLOCKA'
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  walletAddress: string;
  customerEmail: string;
  customerName: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface TokenInfo {
  name: string;
  address: string;
  discount?: number;
}

export const WALLET_ADDRESS = '0x82EdA563621E15EF35c780Fe1ea8861DF7558ca9';
export const FLOCKA_TOKEN_ADDRESS = '0xdc471C5C72dE413e4877CeD49B8Bd0ce72796722';
export const FLOCKA_DISCOUNT = 10; // 10% discount for FLOCKA payments
