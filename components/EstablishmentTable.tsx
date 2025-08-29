'use client';

import { type Agencia, type Restaurante, type Pilates } from '@/lib/data';

type Establishment = (Agencia | Restaurante | Pilates) & {
  category: 'agencia' | 'restaurante' | 'pilates';
  uniqueId: string;
};

interface EstablishmentTableProps {
  establishments: Establishment[];
}

export default function EstablishmentTable({ establishments }: EstablishmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estabelecimento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Endereço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avaliação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Site
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {establishments.map((establishment) => (
            <tr key={establishment.uniqueId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">
                    {establishment.title}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {establishment.types.slice(0, 2).map((type, index) => (
                      <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  establishment.category === 'agencia' 
                    ? 'bg-blue-100 text-blue-800' 
                    : establishment.category === 'pilates'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {establishment.category === 'agencia' ? 'Agência' : 
                   establishment.category === 'pilates' ? 'Pilates' : 'Restaurante'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-600 max-w-xs truncate" title={establishment.address}>
                  {establishment.address}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-yellow-500">⭐</span>
                  <span className="text-sm font-medium ml-1">{establishment.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({establishment.reviews})</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {establishment.website ? (
                  <a 
                    href={establishment.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-32 inline-block"
                    title={establishment.website}
                  >
                    🌐 Ver site
                  </a>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  {establishment.phone && (
                    <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                      📞
                    </button>
                  )}
                  {establishment.website && (
                    <button 
                      className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                      onClick={() => window.open(establishment.website, '_blank')}
                    >
                      🌐
                    </button>
                  )}
                  <button 
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => window.open(establishment.google_maps_url, '_blank')}
                  >
                    Maps
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}