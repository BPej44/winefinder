import React, { useState, useEffect } from 'react';
import { Wine as WineIcon } from 'lucide-react';
import { WineWithPrices, WineFilters } from './types';
import { WineCard } from './components/WineCard';
import { Filters } from './components/Filters';
import { supabase } from './lib/supabase';

function App() {
  const [wines, setWines] = useState<WineWithPrices[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<WineFilters>({
    search: '',
    varietal: '',
    region: '',
    minPrice: 0,
    maxPrice: 0
  });

  useEffect(() => {
    fetchWines();
  }, []);

  async function fetchWines() {
    try {
      setLoading(true);
      
      // Fetch wines with their prices
      const { data: winesData, error: winesError } = await supabase
        .from('wines')
        .select(`
          *,
          prices:wine_prices(*)
        `);

      if (winesError) throw winesError;

      setWines(winesData || []);
    } catch (error) {
      console.error('Error fetching wines:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredWines = wines.filter(wine => {
    const matchesSearch = wine.name.toLowerCase().includes(filters.search.toLowerCase());
    const matchesVarietal = !filters.varietal || wine.varietal === filters.varietal;
    const matchesRegion = !filters.region || wine.region === filters.region;
    const bestPrice = Math.min(...wine.prices.map(p => p.price));
    const matchesPrice = 
      (!filters.minPrice || bestPrice >= filters.minPrice) &&
      (!filters.maxPrice || bestPrice <= filters.maxPrice);
    
    return matchesSearch && matchesVarietal && matchesRegion && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <WineIcon className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Australian Wine Finder</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Filters filters={filters} onFilterChange={setFilters} />
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading wines...</p>
            </div>
          ) : filteredWines.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No wines found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWines.map(wine => (
                <WineCard key={wine.id} wine={wine} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;