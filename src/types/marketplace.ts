export interface Monture {
  id: number;
  name: string;
  description: string | null;
  price: number;
  brand: string | null;
  stock: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string | null;
  owner: {
    id: string;
    email: string;
    roles: string[];
  };
  type: 'vue' | 'soleil' | null;
  genre: 'homme' | 'femme' | 'enfant' | 'unisexe' | null;
  forme: 'rectangulaire' | 'ronde' | 'ovale' | 'carree' | 'aviateur' | 'papillon' | 'clubmaster' | 'sport' | 'geometrique' | null;
  couleur: string | null;
  materiau: 'acetate' | 'metal' | 'plastique' | 'titane' | 'tr90' | 'aluminium' | 'acier_inoxydable' | 'fibre_carbone' | 'bois' | 'corne' | 'metal_plastique' | null;
  images: MontureImage[];
}

export interface MontureImage {
  id: number;
  imageName: string;
  updatedAt: string | null;
}

export interface FilterOptions {
  brands: string[];
  types: { value: string; label: string }[];
  genres: { value: string; label: string }[];
  formes: { value: string; label: string }[];
  materiaux: { value: string; label: string; description: string }[];
  couleurs: string[];
}

export interface MarketplaceFilters {
  search: string;
  brand: string;
  type: string;
  genre: string;
  forme: string;
  couleur: string;
  materiau: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: 'createdAt' | 'price' | 'name' | 'brand';
  sortOrder: 'ASC' | 'DESC';
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MarketplaceResponse {
  data: Monture[];
  pagination: PaginationData;
  filters: MarketplaceFilters;
}

export interface CartItem {
  monture: Monture;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface MarketplaceStats {
  totalMontures: number;
  totalStock: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
}