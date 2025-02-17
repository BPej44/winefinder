export interface Wine {
  id: string;
  name: string;
  vintage: number;
  varietal: string;
  region: string;
  prices: {
    retailer: string;
    price: number;
    url: string;
  }[];
  image: string;
}

export interface WineFilters {
  search: string;
  varietal: string;
  region: string;
  minPrice: number;
  maxPrice: number;
}

export interface WinePrice {
  id: string;
  wine_id: string;
  retailer: string;
  price: number;
  url: string;
  created_at: string;
  updated_at: string;
}

export type WineWithPrices = {
  id: string;
  name: string;
  vintage: number;
  varietal: string;
  region: string;
  image: string;
  created_at: string;
  updated_at: string;
  prices: WinePrice[];
}