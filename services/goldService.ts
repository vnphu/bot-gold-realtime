
import type { GoldPrice } from '../types';

const GOLD_PRICE_URL = 'https://www.24h.com.vn/gia-vang-hom-nay-c425.html';

// Parse HTML string and extract gold price data
function parseGoldPrices(html: string): GoldPrice[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const goldPrices: GoldPrice[] = [];
  const rows = doc.querySelectorAll('.gia-vang-search-data-table tbody tr[data-seach]');
  
  console.log('📊 Parsing HTML, found rows:', rows.length);
  
  rows.forEach(row => {
    try {
      const nameElement = row.querySelector('h2');
      const cells = row.querySelectorAll('td');
      
      if (nameElement && cells.length >= 5) {
        const name = nameElement.textContent?.trim() || '';
        
        // Get buy price and change
        const buyPriceText = cells[1].querySelector('.fixW')?.textContent?.trim() || '';
        const buyChangeImg = cells[1].querySelector('img');
        const buyChangeText = cells[1].querySelector('.colorGreen, .colorRed')?.textContent?.trim() || '';
        
        // Get sell price and change
        const sellPriceText = cells[2].querySelector('.fixW')?.textContent?.trim() || '';
        const sellChangeImg = cells[2].querySelector('img');
        const sellChangeText = cells[2].querySelector('.colorGreen, .colorRed')?.textContent?.trim() || '';
        
        if (name && buyPriceText && sellPriceText) {
          // Convert prices from format "147,800" to "147,800,000"
          const buyPrice = buyPriceText.replace(/,/g, '') + ',000';
          const sellPrice = sellPriceText.replace(/,/g, '') + ',000';
          
          // Parse price changes
          const parsePriceChange = (changeText: string, imgElement: Element | null): number => {
            if (!changeText) return 0;
            const value = parseFloat(changeText.replace(/,/g, '')) * 1000;
            const isUp = imgElement?.getAttribute('src')?.includes('up') || false;
            return isUp ? value : -value;
          };
          
          goldPrices.push({
            type: name,
            buy: buyPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            sell: sellPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            buyChange: parsePriceChange(buyChangeText, buyChangeImg),
            sellChange: parsePriceChange(sellChangeText, sellChangeImg)
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
    // Add timestamp to prevent caching
    const cacheBuster = `?_t=${Date.now()}`;
    const url = `${GOLD_PRICE_URL}${cacheBuster}`;
    
    console.log('🔍 Fetching gold prices...');
    console.log('URL:', url);
    console.log('Timestamp:', new Date().toLocaleString('vi-VN'));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store' // Disable browser cache
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log('HTML length:', html.length);
    
    const goldPrices = parseGoldPrices(html);
    
    console.log('✅ Parsed gold prices:', goldPrices);
    console.log('Total prices found:', goldPrices.length);
    
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
