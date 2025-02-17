import React from 'react';
import { Search, Wine as WineIcon, MapPin } from 'lucide-react';
import { WineFilters } from '../types';

interface FiltersProps {
  filters: WineFilters;
  onFilterChange: (filters: WineFilters) => void;
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search wines..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <WineIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            name="varietal"
            value={filters.varietal}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Varietals</option>
            <option value="Shiraz">Shiraz</option>
            <option value="Cabernet-Shiraz Blend">Cabernet-Shiraz Blend</option>
            <option value="Chardonnay">Chardonnay</option>
          </select>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            name="region"
            value={filters.region}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Regions</option>
            <option value="South Australia">South Australia</option>
            <option value="Margaret River">Margaret River</option>
            <option value="Eden Valley">Eden Valley</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handleChange}
            placeholder="Min Price"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="relative">
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            placeholder="Max Price"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}