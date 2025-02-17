import React from 'react';
import { WineWithPrices } from '../types';
import { ExternalLink } from 'lucide-react';

interface WineCardProps {
  wine: WineWithPrices;
}

export function WineCard({ wine }: WineCardProps) {
  const bestPrice = Math.min(...wine.prices.map(p => p.price));
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <img 
          src={wine.image} 
          alt={wine.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{wine.name}</h3>
        <div className="mt-1 text-sm text-gray-600">
          <p>{wine.vintage} • {wine.varietal}</p>
          <p>{wine.region}</p>
        </div>
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-900">Best Price</div>
          <div className="mt-1 text-xl font-bold text-emerald-600">
            ${bestPrice.toFixed(2)}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {wine.prices.sort((a, b) => a.price - b.price).map((price, index) => (
            <div key={price.id} className="flex items-center justify-between text-sm">
              <span className={index === 0 ? "font-medium text-emerald-600" : "text-gray-600"}>
                {price.retailer}
              </span>
              <div className="flex items-center gap-2">
                <span className={index === 0 ? "font-medium text-emerald-600" : "text-gray-600"}>
                  ${price.price.toFixed(2)}
                </span>
                <a
                  href={price.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}