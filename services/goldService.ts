
import type { GoldPrice } from '../types';

// NOTE: Due to CORS restrictions, this uses a CORS proxy to fetch data from 24h.com.vn
// For production use, consider:
// 1. Setting up your own backend server to fetch and parse the data
// 2. Using a serverless function (Vercel, Netlify, AWS Lambda)
// 3. Implementing a proper API with caching to reduce load

const GOLD_PRICE_URL = 'https://www.24h.com.vn/gia-vang-hom-nay-c425.html';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Parse HTML string and extract gold price data
function parseGoldPrices(html: string): GoldPrice[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const goldPrices: GoldPrice[] = [];
  const rows = doc.querySelectorAll('.gia-vang-search-data-table tbody tr[data-seach]');
  
  rows.forEach(row => {
    try {
      const nameElement = row.querySelector('h2');
      const cells = row.querySelectorAll('td');
      
      if (nameElement && cells.length >= 5) {
        const name = nameElement.textContent?.trim() || '';
        
        // Get buy and sell prices (today's prices are in columns 2 and 3)
        const buyPriceText = cells[1].querySelector('.fixW')?.textContent?.trim() || '';
        const sellPriceText = cells[2].querySelector('.fixW')?.textContent?.trim() || '';
        
        if (name && buyPriceText && sellPriceText) {
          // Convert prices from format "147,800" to "147,800,000"
          const buyPrice = buyPriceText.replace(/,/g, '') + ',000';
          const sellPrice = sellPriceText.replace(/,/g, '') + ',000';
          
          goldPrices.push({
            type: name,
            buy: buyPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            sell: sellPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          });
        }
      }
    } catch (error) {
      console.error('Error parsing row:', error);
    }
  });
  
  return goldPrices;
}

// Fetch and parse gold prices from 24h.com.vn
export const fetchGoldPrices = async (): Promise<GoldPrice[]> => {
  try {
    const url = `${CORS_PROXY}${encodeURIComponent(GOLD_PRICE_URL)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const goldPrices = parseGoldPrices(html);
    
    if (goldPrices.length === 0) {
      throw new Error('No gold prices found in the response');
    }
    
    return goldPrices;
  } catch (error) {
    console.error('Error fetching gold prices:', error);
    
    // Return fallback mock data if fetching fails
    return [
      { type: "SJC", buy: "147,800,000", sell: "149,800,000" },
      { type: "DOJI HN", buy: "147,800,000", sell: "149,800,000" },
      { type: "DOJI SG", buy: "147,800,000", sell: "149,800,000" },
      { type: "PNJ", buy: "147,300,000", sell: "149,300,000" },
      { type: "Bảo Tín Minh Châu", buy: "147,500,000", sell: "149,500,000" },
    ];
  }
};
