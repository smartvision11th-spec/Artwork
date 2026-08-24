export type Artwork = {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  featured: boolean;
};

export type OrderItem = {
  artworkId: number;
  title: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  email: string | null;
  customerName: string | null;
  total: number;
  currency: string;
  status: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  items: OrderItem[];
};
