
export interface GoldPrice {
  type: string;
  buy: string;
  sell: string;
  buyChange?: number;
  sellChange?: number;
}

export interface Log {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}
