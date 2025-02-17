import { Wine } from './types';

export const sampleWines: Wine[] = [
  {
    id: '1',
    name: 'Penfolds Bin 389 Cabernet Shiraz',
    vintage: 2020,
    varietal: 'Cabernet-Shiraz Blend',
    region: 'South Australia',
    prices: [
      { retailer: 'Dan Murphy\'s', price: 100.00, url: '#' },
      { retailer: 'Vintage Cellars', price: 105.00, url: '#' },
      { retailer: 'Wine House', price: 95.00, url: '#' }
    ],
    image: 'https://images.unsplash.com/photo-1586370434639-0fe43b2d32d6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Leeuwin Estate Art Series Chardonnay',
    vintage: 2019,
    varietal: 'Chardonnay',
    region: 'Margaret River',
    prices: [
      { retailer: 'Dan Murphy\'s', price: 120.00, url: '#' },
      { retailer: 'First Choice', price: 115.00, url: '#' },
      { retailer: 'Wine House', price: 125.00, url: '#' }
    ],
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Henschke Hill of Grace',
    vintage: 2017,
    varietal: 'Shiraz',
    region: 'Eden Valley',
    prices: [
      { retailer: 'Dan Murphy\'s', price: 890.00, url: '#' },
      { retailer: 'Vintage Cellars', price: 895.00, url: '#' },
      { retailer: 'Wine House', price: 885.00, url: '#' }
    ],
    image: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80'
  }
];