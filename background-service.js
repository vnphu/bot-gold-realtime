#!/usr/bin/env node

/**
 * Gold Price Telegram Notifier - Background Service
 * 
 * This script runs as a standalone Node.js service to fetch gold prices
 * and send notifications to Telegram without needing a browser.
 * 
 * Usage:
 *   1. Create a .env file with your configuration
 *   2. Run: node background-service.js
 *   3. Or use PM2 for production: pm2 start background-service.js
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration from environment variables
const config = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '',
  chatId: process.env.TELEGRAM_CHAT_ID || '',
  interval: parseInt(process.env.UPDATE_INTERVAL_MINUTES || '60', 10),
  goldPriceUrl: 'https://www.24h.com.vn/gia-vang-hom-nay-c425.html'
};

// Validate configuration
function validateConfig() {
  if (!config.botToken) {
    console.error('❌ ERROR: TELEGRAM_BOT_TOKEN is not set in .env file');
    process.exit(1);
  }
  if (!config.chatId) {
    console.error('❌ ERROR: TELEGRAM_CHAT_ID is not set in .env file');
    process.exit(1);
  }
  if (config.interval < 1) {
    console.error('❌ ERROR: UPDATE_INTERVAL_MINUTES must be at least 1');
    process.exit(1);
  }
  console.log('✅ Configuration validated successfully');
}

// Fetch and parse gold prices from 24h.com.vn
async function fetchGoldPrices() {
  try {
    console.log('📡 Fetching gold prices from 24h.com.vn...');
    const response = await fetch(config.goldPriceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const goldPrices = [];

    // Parse the gold price table
    $('.gia-vang-search-data-table tbody tr[data-seach]').each((_, row) => {
      const $row = $(row);
      const name = $row.find('h2').text().trim();
      const buyPrice = $row.find('td').eq(1).find('.fixW').text().trim();
      const sellPrice = $row.find('td').eq(2).find('.fixW').text().trim();

      if (name && buyPrice && sellPrice) {
        // Convert from "147,800" to "147,800,000"
        const formattedBuy = buyPrice.replace(/,/g, '') + ',000';
        const formatredSell = sellPrice.replace(/,/g, '') + ',000';
        
        goldPrices.push({
          type: name,
          buy: formattedBuy.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          sell: formatredSell.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        });
      }
    });

    if (goldPrices.length === 0) {
      throw new Error('No gold prices found in the response');
    }

    console.log(`✅ Successfully fetched ${goldPrices.length} gold prices`);
    return goldPrices;
  } catch (error) {
    console.error('❌ Error fetching gold prices:', error.message);
    throw error;
  }
}

// Send message to Telegram
async function sendTelegramMessage(text) {
  try {
    console.log('📤 Sending message to Telegram...');
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.description || 'Failed to send message to Telegram');
    }

    console.log('✅ Message sent successfully to Telegram');
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error.message);
    throw error;
  }
}

// Format gold prices into a Telegram message
function formatMessage(goldPrices) {
  const now = new Date();
  const dateStr = now.toLocaleString('vi-VN', { 
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  let message = `*📊 Cập nhật giá vàng - ${dateStr}*\n\n`;
  message += '```\n';
  message += 'Loại         | Mua        | Bán\n';
  message += '--------------------------------------\n';
  
  goldPrices.forEach(item => {
    const type = item.type.padEnd(12);
    const buy = item.buy.padEnd(10);
    const sell = item.sell.padEnd(10);
    message += `${type} | ${buy} | ${sell}\n`;
  });
  
  message += '```\n';
  message += '_Nguồn: 24h.com.vn_';
  
  return message;
}

// Main update function
async function runUpdate() {
  const timestamp = new Date().toLocaleTimeString('vi-VN');
  console.log(`\n⏰ [${timestamp}] Starting update cycle...`);
  
  try {
    const goldPrices = await fetchGoldPrices();
    const message = formatMessage(goldPrices);
    await sendTelegramMessage(message);
    console.log('✨ Update cycle completed successfully\n');
  } catch (error) {
    console.error(`💥 Update cycle failed: ${error.message}\n`);
  }
}

// Start the service
function startService() {
  console.log('\n🚀 Starting Gold Price Telegram Notifier Service...\n');
  console.log('Configuration:');
  console.log(`  - Bot Token: ${config.botToken.substring(0, 10)}...`);
  console.log(`  - Chat ID: ${config.chatId}`);
  console.log(`  - Update Interval: ${config.interval} minutes`);
  console.log('');

  // Run immediately on start
  runUpdate();

  // Then run on interval
  const intervalMs = config.interval * 60 * 1000;
  setInterval(runUpdate, intervalMs);

  console.log(`✅ Service started. Will send updates every ${config.interval} minutes.`);
  console.log('Press Ctrl+C to stop.\n');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  console.log('Service stopped.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Received SIGTERM, shutting down...');
  process.exit(0);
});

// Run the service
validateConfig();
startService();
