import 'dotenv/config';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Add delay between requests to avoid rate limiting
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const retailers = [
  {
    name: "Dan Murphy's",
    baseUrl: 'https://www.danmurphys.com.au',
    searchUrl: 'https://www.danmurphys.com.au/red-wine/all',
    selectors: {
      products: '.product-tile',
      name: '.product-name',
      price: '.price',
      link: '.product-name a'
    }
  },
  {
    name: "Vintage Cellars",
    baseUrl: 'https://www.vintagecellars.com.au',
    searchUrl: 'https://www.vintagecellars.com.au/red-wine',
    selectors: {
      products: '.product-container',
      name: '.product-title',
      price: '.price-value',
      link: '.product-title a'
    }
  },
  {
    name: "First Choice Liquor",
    baseUrl: 'https://www.firstchoiceliquor.com.au',
    searchUrl: 'https://www.firstchoiceliquor.com.au/red-wine',
    selectors: {
      products: '.product-container',
      name: '.product-name',
      price: '.product-price',
      link: '.product-name a'
    }
  },
  {
    name: "Nicks Wine Merchants",
    baseUrl: 'https://www.nicks.com.au',
    searchUrl: 'https://www.nicks.com.au/wines/red-wines',
    selectors: {
      products: '.product-item',
      name: '.product-name',
      price: '.price',
      link: '.product-name a'
    }
  }
];

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive',
          ...options?.headers,
        },
        timeout: 10000
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.text();
    } catch (error) {
      if (i === retries - 1) throw error;
      await delay(1000 * (i + 1)); // Exponential backoff
    }
  }
}

async function extractWineInfo(html, retailer) {
  const $ = cheerio.load(html);
  const wines = [];

  $(retailer.selectors.products).each((_, element) => {
    const name = $(element).find(retailer.selectors.name).text().trim();
    const priceText = $(element).find(retailer.selectors.price).text().trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    const url = $(element).find(retailer.selectors.link).attr('href');
    const fullUrl = url?.startsWith('http') ? url : `${retailer.baseUrl}${url}`;

    // Skip if missing crucial data
    if (!name || !price || !fullUrl) return;

    // Extract vintage
    const vintageMatch = name.match(/\b(19|20)\d{2}\b/);
    const vintage = vintageMatch ? parseInt(vintageMatch[0]) : null;

    // Extract varietal using common wine varieties
    const varietals = [
      'Shiraz', 'Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Chardonnay',
      'Sauvignon Blanc', 'Riesling', 'Grenache', 'Syrah', 'Malbec',
      'Cabernet-Shiraz', 'GSM', 'Semillon'
    ];
    
    const varietal = varietals.find(v => 
      name.toLowerCase().includes(v.toLowerCase())
    ) || 'Unknown';

    // Extract region using common Australian wine regions
    const regions = [
      'Barossa Valley', 'McLaren Vale', 'Margaret River', 'Hunter Valley',
      'Clare Valley', 'Eden Valley', 'Yarra Valley', 'Coonawarra',
      'Adelaide Hills', 'Tasmania'
    ];
    
    const region = regions.find(r => 
      name.toLowerCase().includes(r.toLowerCase())
    ) || 'Australia';

    wines.push({
      name,
      vintage,
      varietal,
      region,
      price,
      url: fullUrl,
      retailer: retailer.name
    });
  });

  return wines;
}

async function updateDatabase(wines) {
  const batchSize = 50;
  const batches = [];
  
  for (let i = 0; i < wines.length; i += batchSize) {
    batches.push(wines.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await Promise.all(batch.map(async (wine) => {
      try {
        // Check if wine exists
        const { data: existingWine } = await supabase
          .from('wines')
          .select('id')
          .eq('name', wine.name)
          .eq('vintage', wine.vintage)
          .single();

        let wineId;
        if (existingWine) {
          wineId = existingWine.id;
        } else {
          // Insert new wine
          const { data: newWine, error: wineError } = await supabase
            .from('wines')
            .insert({
              name: wine.name,
              vintage: wine.vintage,
              varietal: wine.varietal,
              region: wine.region,
              image: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(2, 15)}?auto=format&fit=crop&w=800&q=80`
            })
            .select()
            .single();

          if (wineError) {
            console.error('Error inserting wine:', wineError);
            return;
          }
          wineId = newWine.id;
        }

        // Update price
        const { error: priceError } = await supabase
          .from('wine_prices')
          .upsert({
            wine_id: wineId,
            retailer: wine.retailer,
            price: wine.price,
            url: wine.url
          }, {
            onConflict: 'wine_id,retailer'
          });

        if (priceError) {
          console.error('Error updating price:', priceError);
        }
      } catch (error) {
        console.error('Error processing wine:', wine.name, error);
      }
    }));

    // Add delay between batches to avoid rate limiting
    await delay(1000);
  }
}

async function main() {
  console.log('Starting wine crawler...');
  
  for (const retailer of retailers) {
    try {
      console.log(`Crawling ${retailer.name}...`);
      const html = await fetchWithRetry(retailer.searchUrl);
      
      if (html) {
        const wines = await extractWineInfo(html, retailer);
        console.log(`Found ${wines.length} wines from ${retailer.name}`);
        
        await updateDatabase(wines);
        console.log(`Updated database with wines from ${retailer.name}`);
        
        // Add delay between retailers
        await delay(2000);
      }
    } catch (error) {
      console.error(`Error processing retailer ${retailer.name}:`, error);
    }
  }

  console.log('Crawling completed!');
}

main().catch(console.error);