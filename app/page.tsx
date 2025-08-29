'use client';

import { useEffect, useState } from 'react';
import { loadAgencias, loadRestaurantes, type Agencia, type Restaurante } from '@/lib/data';
import EstablishmentCards from '@/components/EstablishmentCards';
import EstablishmentTable from '@/components/EstablishmentTable';

type Establishment = (Agencia | Restaurante) & {
  category: 'agencia' | 'restaurante';
  uniqueId: string;
};


export default function HomePage() {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [showOnlyWithSite, setShowOnlyWithSite] = useState(false);
  const [showRestaurantes, setShowRestaurantes] = useState(true);
  const [showAgencias, setShowAgencias] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

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
    let filtered = establishments;
    
    // Filter by category toggles
    filtered = filtered.filter(establishment => {
      if (establishment.category === 'restaurante' && !showRestaurantes) return false;
      if (establishment.category === 'agencia' && !showAgencias) return false;
      return true;
    });
    
    // Filter by website availability
    if (showOnlyWithSite) {
      filtered = filtered.filter(establishment => 
        establishment.website && establishment.website.trim() !== ''
      );
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(establishment => 
        establishment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEstablishments(filtered);
  }, [searchTerm, establishments, showRestaurantes, showAgencias, showOnlyWithSite]);

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
            MKT & Rests
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
          
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setShowRestaurantes(!showRestaurantes)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showRestaurantes 
                  ? 'bg-green-100 border-green-300 text-green-800' 
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                showRestaurantes ? 'bg-green-600 border-green-600' : 'border-gray-300'
              }`}>
                {showRestaurantes && <span className="text-white text-xs">✓</span>}
              </div>
              🍽️ Restaurantes
            </button>
            
            <button
              onClick={() => setShowAgencias(!showAgencias)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showAgencias 
                  ? 'bg-blue-100 border-blue-300 text-blue-800' 
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                showAgencias ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
              }`}>
                {showAgencias && <span className="text-white text-xs">✓</span>}
              </div>
              🏢 Agências
            </button>
            
            <button
              onClick={() => setShowOnlyWithSite(!showOnlyWithSite)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showOnlyWithSite 
                  ? 'bg-purple-100 border-purple-300 text-purple-800' 
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                showOnlyWithSite ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
              }`}>
                {showOnlyWithSite && <span className="text-white text-xs">✓</span>}
              </div>
              🌐 Com Website
            </button>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredEstablishments.length} estabelecimentos encontrados
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Visualização:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 text-sm transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📋 Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 text-sm transition-colors ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📊 Tabela
                </button>
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'cards' ? (
          <EstablishmentCards establishments={filteredEstablishments} />
        ) : (
          <EstablishmentTable establishments={filteredEstablishments} />
        )}

        {filteredEstablishments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum estabelecimento encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}