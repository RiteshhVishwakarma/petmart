export type UserAddress = {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;          // Selling price (final price customer pays)
  mrp?: number;           // Maximum Retail Price (original price)
  image: string;
  description: string;
  category: string;
  rating?: number;        // Average rating (1-5)
  reviewCount?: number;   // Total number of reviews
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;         // 1-5 stars
  comment: string;
  createdAt: any;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type Order = {
  id: string;
  uid: string;
  items: OrderItem[];
  totalPrice: number;
  address: {
    name: string;
    phone: string;
    pincode: string;
    address: string;
    city: string;
    state: string;
  };
  status: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
};

export type RootStackParamList = {
  Home: undefined;
  ProductList: { category?: string } | undefined;
  ProductDetail: { product: Product };
  Cart: undefined;
  Wishlist: undefined;
  Address: undefined;
  OrderSuccess: undefined;
  Admin: undefined;
  OrderHistory: undefined;
  Terms: undefined;
  Privacy: undefined;
  Login: { returnTo?: keyof RootStackParamList } | undefined;
  Signup: undefined;
  AboutDeveloper: undefined;
};
