'use client';

import { type Agencia, type Restaurante, type Pilates } from '@/lib/data';

type Establishment = (Agencia | Restaurante | Pilates) & {
  category: 'agencia' | 'restaurante' | 'pilates';
  uniqueId: string;
};

interface EstablishmentCardsProps {
  establishments: Establishment[];
}

export default function EstablishmentCards({ establishments }: EstablishmentCardsProps) {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {establishments.map((establishment) => (
        <div key={establishment.uniqueId} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow overflow-hidden">
          <div className="flex items-start justify-between mb-4 gap-2">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight break-words min-w-0">
              {establishment.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-medium">{establishment.rating}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-sm text-gray-600 break-words min-w-0">{establishment.address}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              <span className={`px-2 py-1 text-xs rounded-full ${
                establishment.category === 'agencia' 
                  ? 'bg-blue-100 text-blue-800' 
                  : establishment.category === 'pilates'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {establishment.category === 'agencia' ? 'Agência' : 
                 establishment.category === 'pilates' ? 'Pilates' : 'Restaurante'}
              </span>
              {establishment.types.slice(0, 2).map((type, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full break-words">
                  {type}
                </span>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              <div className="break-words">
                <span className="font-medium">Avaliações:</span> {establishment.reviews}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4">
              {establishment.phone ? (
                <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 min-w-0 truncate">
                  📞 Ligar
                </button>
              ) : (
                <div></div>
              )}
              {establishment.website ? (
                <button 
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 min-w-0 truncate"
                  onClick={() => window.open(establishment.website, '_blank')}
                >
                  🌐 Site
                </button>
              ) : (
                <div></div>
              )}
              <button 
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm min-w-0 truncate"
                onClick={() => window.open(establishment.google_maps_url, '_blank')}
              >
                🗺️ Mapa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}