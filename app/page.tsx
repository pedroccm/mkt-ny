'use client';

import { useEffect, useState } from 'react';
import { loadAgencias, loadRestaurantes, type Agencia, type Restaurante } from '@/lib/data';

type Establishment = (Agencia | Restaurante) & {
  category: 'agencia' | 'restaurante';
  uniqueId: string;
};

export default function HomePage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [agencias, restaurantes] = await Promise.all([
          loadAgencias(),
          loadRestaurantes()
        ]);

        // Remove duplicates and create unique identifiers
        const agenciasWithCategory = agencias.map((a, index) => ({ 
          ...a, 
          category: 'agencia' as const,
          uniqueId: `agencia_${a.place_id}_${index}`
        }));
        
        const restaurantesWithCategory = restaurantes.map((r, index) => ({ 
          ...r, 
          category: 'restaurante' as const,
          uniqueId: `restaurante_${r.place_id}_${index}`
        }));

        const allEstablishments: Establishment[] = [
          ...agenciasWithCategory,
          ...restaurantesWithCategory
        ];

        // Remove duplicates based on place_id, keeping the first occurrence
        const uniqueEstablishments = allEstablishments.filter((establishment, index, array) => 
          index === array.findIndex(e => e.place_id === establishment.place_id)
        );

        setEstablishments(uniqueEstablishments);
        setFilteredEstablishments(uniqueEstablishments);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEstablishments(establishments);
    } else {
      const filtered = establishments.filter(establishment => 
        establishment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEstablishments(filtered);
    }
  }, [searchTerm, establishments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Carregando estabelecimentos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Diretório de Estabelecimentos
          </h1>
          <p className="text-gray-600">
            Descubra agências de marketing e restaurantes na sua região
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar estabelecimentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 text-sm text-gray-600">
            {filteredEstablishments.length} estabelecimentos encontrados
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEstablishments.map((establishment) => (
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
                    <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      📞 Ligar
                    </button>
                  )}
                  {establishment.website && (
                    <button 
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
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

        {filteredEstablishments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum estabelecimento encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}