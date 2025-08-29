'use client';

import { type Agencia, type Restaurante } from '@/lib/data';

type Establishment = (Agencia | Restaurante) & {
  category: 'agencia' | 'restaurante';
  uniqueId: string;
};

interface EstablishmentCardsProps {
  establishments: Establishment[];
}

export default function EstablishmentCards({ establishments }: EstablishmentCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {establishments.map((establishment) => (
        <div key={establishment.uniqueId} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {establishment.title}
            </h3>
            <div className="flex items-center gap-1 ml-2">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-medium">{establishment.rating}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-gray-500">📍</span>
              <span className="text-sm text-gray-600">{establishment.address}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              <span className={`px-2 py-1 text-xs rounded-full ${
                establishment.category === 'agencia' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {establishment.category === 'agencia' ? 'Agência' : 'Restaurante'}
              </span>
              {establishment.types.slice(0, 2).map((type, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                  {type}
                </span>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Avaliações:</span> {establishment.reviews}
              </div>
              <div>
                <span className="font-medium">Horário:</span> {establishment.hours}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              {establishment.phone && (
                <button className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                  📞 Ligar
                </button>
              )}
              {establishment.website && (
                <button 
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  onClick={() => window.open(establishment.website, '_blank')}
                >
                  🌐 Site
                </button>
              )}
            </div>

            <button 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => window.open(establishment.google_maps_url, '_blank')}
            >
              Ver no Google Maps
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}