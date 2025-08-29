'use client';

import { useEffect, useState } from 'react';
import { loadAgencias, loadRestaurantes, loadPilates, type Agencia, type Restaurante, type Pilates } from '@/lib/data';
import EstablishmentCards from '@/components/EstablishmentCards';
import EstablishmentTable from '@/components/EstablishmentTable';

type Establishment = (Agencia | Restaurante | Pilates) & {
  category: 'agencia' | 'restaurante' | 'pilates';
  uniqueId: string;
};


export default function HomePage() {
  const [restaurantes, setRestaurantes] = useState<Establishment[]>([]);
  const [agencias, setAgencias] = useState<Establishment[]>([]);
  const [pilates, setPilates] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [showOnlyWithSite, setShowOnlyWithSite] = useState(false);
  const [showOnlyWithInstagram, setShowOnlyWithInstagram] = useState(false);
  const [showRestaurantes, setShowRestaurantes] = useState(true);
  const [showAgencias, setShowAgencias] = useState(true);
  const [showPilates, setShowPilates] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [agenciasData, restaurantesData, pilatesData] = await Promise.all([
          loadAgencias(),
          loadRestaurantes(),
          loadPilates()
        ]);

        // Create unique identifiers and assign categories based on source file
        const agenciasWithCategory = agenciasData.map((a, index) => ({ 
          ...a, 
          category: 'agencia' as const,
          uniqueId: `agencia_${a.place_id}_${index}`
        }));
        
        const restaurantesWithCategory = restaurantesData.map((r, index) => ({ 
          ...r, 
          category: 'restaurante' as const,
          uniqueId: `restaurante_${r.place_id}_${index}`
        }));

        const pilatesWithCategory = pilatesData.map((p, index) => ({ 
          ...p, 
          category: 'pilates' as const,
          uniqueId: `pilates_${p.place_id}_${index}`
        }));

        // Keep data separated by source
        setAgencias(agenciasWithCategory);
        setRestaurantes(restaurantesWithCategory);
        setPilates(pilatesWithCategory);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered: Establishment[] = [];
    
    // Include data based on file source toggles
    if (showRestaurantes) {
      filtered = [...filtered, ...restaurantes];
    }
    if (showAgencias) {
      filtered = [...filtered, ...agencias];
    }
    if (showPilates) {
      filtered = [...filtered, ...pilates];
    }
    
    // Filter by website availability
    if (showOnlyWithSite) {
      filtered = filtered.filter(establishment => 
        establishment.website && 
        establishment.website.trim() !== '' &&
        !establishment.website.toLowerCase().includes('instagram.com')
      );
    }
    
    // Filter by Instagram availability
    if (showOnlyWithInstagram) {
      filtered = filtered.filter(establishment => 
        establishment.website && 
        establishment.website.toLowerCase().includes('instagram.com')
      );
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(establishment => 
        establishment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort by number of reviews (evaluations) in descending order (highest first)
    filtered.sort((a, b) => b.reviews - a.reviews);
    
    setFilteredEstablishments(filtered);
  }, [searchTerm, restaurantes, agencias, pilates, showRestaurantes, showAgencias, showPilates, showOnlyWithSite, showOnlyWithInstagram]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-lg">Carregando estabelecimentos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-full overflow-x-hidden">
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
          
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => {
                // If only restaurantes is active and we try to turn it off, turn on one of the others
                if (showRestaurantes && !showAgencias && !showPilates) {
                  setShowRestaurantes(false);
                  setShowAgencias(true);
                } else {
                  setShowRestaurantes(!showRestaurantes);
                }
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm ${
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
              <span className="whitespace-nowrap">Restaurantes</span>
            </button>
            
            <button
              onClick={() => {
                // If only agencias is active and we try to turn it off, turn on one of the others
                if (showAgencias && !showRestaurantes && !showPilates) {
                  setShowAgencias(false);
                  setShowRestaurantes(true);
                } else {
                  setShowAgencias(!showAgencias);
                }
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm ${
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
              <span className="whitespace-nowrap">Agências</span>
            </button>
            
            <button
              onClick={() => {
                // If only pilates is active and we try to turn it off, turn on one of the others
                if (showPilates && !showRestaurantes && !showAgencias) {
                  setShowPilates(false);
                  setShowRestaurantes(true);
                } else {
                  setShowPilates(!showPilates);
                }
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border transition-colors text-sm ${
                showPilates 
                  ? 'bg-purple-100 border-purple-300 text-purple-800' 
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                showPilates ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
              }`}>
                {showPilates && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="whitespace-nowrap">Pilates</span>
            </button>
            
            <button
              onClick={() => {
                setShowOnlyWithSite(!showOnlyWithSite);
                if (!showOnlyWithSite) {
                  setShowOnlyWithInstagram(false);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showOnlyWithSite 
                  ? 'bg-orange-100 border-orange-300 text-orange-800' 
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                showOnlyWithSite ? 'bg-orange-600 border-orange-600' : 'border-gray-300'
              }`}>
                {showOnlyWithSite && <span className="text-white text-xs">✓</span>}
              </div>
              Com Website
            </button>
            
            <button
              onClick={() => {
                setShowOnlyWithInstagram(!showOnlyWithInstagram);
                if (!showOnlyWithInstagram) {
                  setShowOnlyWithSite(false);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showOnlyWithInstagram 
                  ? 'bg-pink-100 border-pink-300 text-pink-800' 
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                showOnlyWithInstagram ? 'bg-pink-600 border-pink-600' : 'border-gray-300'
              }`}>
                {showOnlyWithInstagram && <span className="text-white text-xs">✓</span>}
              </div>
              Com Instagram
            </button>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              {filteredEstablishments.length} estabelecimentos encontrados
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Visualização em Cards"
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Visualização em Tabela"
                >
                  ≡
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