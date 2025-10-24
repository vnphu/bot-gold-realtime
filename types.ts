
export interface GoldPrice {
  type: string;
  buy: string;
  sell:string;
}

export interface Log {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}
