
import type { GoldPrice } from '../types';

// NOTE: This is mock data. Direct browser scraping from a website like 24h.com.vn
// is blocked by browser security policies (CORS). A real-world application would require
// a backend server or a serverless function to perform the scraping and provide the
// data via an API that this frontend could call.

const mockGoldData: GoldPrice[] = [
  { type: "SJC HCM", buy: "90,500,000", sell: "92,500,000" },
  { type: "DOJI HN", buy: "90,500,000", sell: "92,300,000" },
  { type: "PNJ", buy: "75,400,000", sell: "77,200,000" },
  { type: "SJC ĐN", buy: "90,500,000", sell: "92,520,000" },
  { type: "DOJI SG", buy: "90,500,000", sell: "92,300,000" },
  { type: "Phú Quý", buy: "90,600,000", sell: "92,400,000" },
  { type: "Bảo Tín", buy: "90,650,000", sell: "92,350,000" },
];

// This function simulates a network request to a backend scraper.
export const fetchGoldPrices = (): Promise<GoldPrice[]> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // In a real app, you might slightly randomize data to show changes.
      const updatedData = mockGoldData.map(item => ({
          ...item,
          buy: (parseInt(item.buy.replace(/,/g, '')) + (Math.floor(Math.random() * 5) - 2) * 10000).toLocaleString('vi-VN') + ",000",
      }));
      resolve(updatedData);
    }, 500 + Math.random() * 500);
  });
};
