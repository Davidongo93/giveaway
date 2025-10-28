import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Navbar from '../../components/Navbar/NavBar';
 import Image from 'next/image';
import { Raffle, RaffleService, RaffleStatus, RaffleType, DrawMode } from '../../services/api';

export default function RafflesPlatform() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [filteredRaffles, setFilteredRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<RaffleType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RaffleStatus | 'all'>('all');
  const [selectedDrawMode, setSelectedDrawMode] = useState<DrawMode | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'prize' | 'tickets'>('newest');
  const router = useRouter();

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        setLoading(true);
        const rafflesData = await RaffleService.getAll();
        setRaffles(rafflesData);
        setFilteredRaffles(rafflesData);
      } catch (error) {
        console.error('Error fetching raffles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaffles();
  }, []);

  // Filtrar y ordenar rifas
  useEffect(() => {
    let result = raffles.filter(raffle => raffle.status !== RaffleStatus.DRAFT);

    // Filtro por tipo
    if (selectedType !== 'all') {
      result = result.filter(raffle => raffle.raffleType === selectedType);
    }

    // Filtro por estado
    if (selectedStatus !== 'all') {
      result = result.filter(raffle => raffle.status === selectedStatus);
    }

    // Filtro por modo de sorteo
    if (selectedDrawMode !== 'all') {
      result = result.filter(raffle => raffle.drawMode === selectedDrawMode);
    }

    // Búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(raffle =>
        raffle.title?.toLowerCase().includes(term) ||
        raffle.description.toLowerCase().includes(term)
      );
    }

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case 'prize':
          return b.prizeValue - a.prizeValue;
        case 'tickets':
          const aSold = a.tickets.filter(t => t).length;
          const bSold = b.tickets.filter(t => t).length;
          return bSold - aSold;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredRaffles(result);
  }, [raffles, selectedType, selectedStatus, selectedDrawMode, searchTerm, sortBy]);

  const handleRaffleClick = useCallback((id: string) => {
    router.push(`/raffle/${id}`);
  }, [router]);

  const getRaffleTypeInfo = useCallback((type: RaffleType) => {
    const info = {
      [RaffleType.SMALL]: { label: '100 Tickets', color: 'bg-green-500', icon: '🎯' },
      [RaffleType.MEDIUM]: { label: '1K Tickets', color: 'bg-blue-500', icon: '🎪' },
      [RaffleType.LARGE]: { label: '10K Tickets', color: 'bg-purple-500', icon: '🏆' },
    };
    return info[type] || info[RaffleType.SMALL];
  }, []);

  const getStatusInfo = useCallback((status: RaffleStatus) => {
    const info: Record<RaffleStatus, { label: string; color: string; text: string }> = {
      [RaffleStatus.ACTIVE]: { label: 'Activa', color: 'bg-green-500', text: 'text-green-400' },
      [RaffleStatus.DRAFT]: { label: 'Borrador', color: 'bg-yellow-500', text: 'text-yellow-400' },
      [RaffleStatus.FINISHED]: { label: 'Finalizada', color: 'bg-blue-500', text: 'text-blue-400' },
      [RaffleStatus.CANCELLED]: { label: 'Cancelada', color: 'bg-red-500', text: 'text-red-400' },
      [RaffleStatus.CLOSED]: { label: 'Cerrada', color: 'bg-gray-500', text: 'text-gray-400' },
    };
    return info[status] ?? info[RaffleStatus.DRAFT];
  }, []);

  const getProgressPercentage = useCallback((raffle: { tickets: boolean[] }) => {
    const soldTickets = raffle.tickets.filter((t: boolean) => t).length;
    return (soldTickets / raffle.tickets.length) * 100;
  }, []);

  const getDrawModeInfo = useCallback((mode: DrawMode) => {
    const info = {
      [DrawMode.APP_DRAW]: { label: 'Sorteo App', color: 'bg-purple-500' },
      [DrawMode.COLOMBIAN_LOTTERY]: { label: 'Lotería Colombia', color: 'bg-yellow-500' },
    };
    return info[mode] || info[DrawMode.APP_DRAW];
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1E24] via-[#164C52] to-[#0E1E24] text-[#FAFAFA] font-sans">
      <Head>
        <title>Plataforma de Rifas - Domir</title>
        <meta name="description" content="Explora todas las rifas disponibles y participa para ganar premios increíbles mientras apoyas mi formación profesional." />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FAFAFA] to-[#7BD389] bg-clip-text text-transparent leading-tight font-montserrat">
            Plataforma de <span className="text-[#FFC857]">Rifas</span>
          </h1>
          <p className="text-xl text-[#E5E7EB] max-w-3xl mx-auto leading-relaxed font-medium">
            Descubre todas las rifas disponibles y participa para ganar premios increíbles 
            mientras apoyas mi crecimiento profesional en tecnología.
          </p>
        </motion.section>

        {/* Filters Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar rifas..."
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-[#374151] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164C52] focus:border-[#164C52] backdrop-blur-lg text-[#FAFAFA] placeholder-[#9CA3AF] transition-all duration-300 font-medium"
                />
              </div>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as RaffleType | 'all')}
                className="px-4 py-3 bg-white/5 border border-[#374151] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164C52] focus:border-[#164C52] backdrop-blur-lg text-[#FAFAFA] transition-all duration-300 font-medium"
              >
                <option value="all">Todos los tipos</option>
                <option value={RaffleType.SMALL}>100 Tickets</option>
                <option value={RaffleType.MEDIUM}>1K Tickets</option>
                <option value={RaffleType.LARGE}>10K Tickets</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as RaffleStatus | 'all')}
                className="px-4 py-3 bg-white/5 border border-[#374151] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164C52] focus:border-[#164C52] backdrop-blur-lg text-[#FAFAFA] transition-all duration-300 font-medium"
              >
                <option value="all">Todos los estados</option>
                <option value={RaffleStatus.ACTIVE}>Activas</option>
                <option value={RaffleStatus.FINISHED}>Finalizadas</option>
                <option value={RaffleStatus.CLOSED}>Cerradas</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as unknown as 'newest' | 'prize' | 'tickets')}
                className="px-4 py-3 bg-white/5 border border-[#374151] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#164C52] focus:border-[#164C52] backdrop-blur-lg text-[#FAFAFA] transition-all duration-300 font-medium"
              >
                <option value="newest">Más recientes</option>
                <option value="prize">Mayor premio</option>
                <option value="tickets">Más populares</option>
              </select>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center">
              <p className="text-[#9CA3AF] font-medium">
                Mostrando <span className="text-[#FAFAFA] font-semibold">{filteredRaffles.length}</span> rifas
                {searchTerm && (
                  <span> para &quot;<span className="text-[#164C52]">{searchTerm}</span>&quot;</span>
                )}
              </p>
              <div className="flex gap-2">
                {selectedType !== 'all' && (
                  <span className="px-3 py-1 bg-[#164C52] text-white rounded-full text-sm">
                    {selectedType}
                  </span>
                )}
                {selectedStatus !== 'all' && (
                  <span className="px-3 py-1 bg-[#7BD389] text-[#0E1E24] rounded-full text-sm">
                    {selectedStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Raffles Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-4 text-[#9CA3AF] font-medium">Cargando plataforma de rifas...</p>
            </div>
          </div>
        ) : filteredRaffles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredRaffles.map((raffle) => {
              const typeInfo = getRaffleTypeInfo(raffle.raffleType);
              const statusInfo = getStatusInfo(raffle.status);
              const drawModeInfo = getDrawModeInfo(raffle.drawMode);
              const progress = getProgressPercentage(raffle);
              const soldTickets = raffle.tickets.filter((t: boolean) => t).length;
              const availableTickets = raffle.tickets.length - soldTickets;

              return (
                <motion.div
                  key={raffle.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group/card"
                  onClick={() => handleRaffleClick(raffle.id)}
                >
                  {/* Prize Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={raffle.prizeImageUrl}
                      alt={raffle.title || raffle.description || 'Premio de la rifa'}
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${typeInfo.color} backdrop-blur-sm`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${statusInfo.color} backdrop-blur-sm`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Draw Mode Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${drawModeInfo.color} backdrop-blur-sm`}>
                        {drawModeInfo.label}
                      </span>
                    </div>

                    {/* Prize Value */}
                    <div className="absolute bottom-3 left-3">
                      <div className="text-xl font-bold text-white drop-shadow-lg">
                        ${raffle.prizeValue.toLocaleString()}
                      </div>
                      <div className="text-green-400 text-xs font-semibold drop-shadow-lg">
                        Premio Principal
                      </div>
                    </div>
                  </div>

                  {/* Raffle Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white">
                      {raffle.title || raffle.description}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {raffle.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">Progreso</span>
                        <span className="font-semibold text-white">
                          {soldTickets.toLocaleString()}/{raffle.tickets.length.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex justify-between mb-3 text-xs text-gray-400">
                      <div className="text-center">
                        <div className="font-bold text-white">{soldTickets.toLocaleString()}</div>
                        <div>Vendidos</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white">{availableTickets.toLocaleString()}</div>
                        <div>Disponibles</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white">{Math.round(progress)}%</div>
                        <div>Completado</div>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-bold text-green-400">${raffle.ticketPrice}</div>
                        <div className="text-gray-400 text-xs">por ticket</div>
                      </div>
                      
                      <button 
                        className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 text-sm font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRaffleClick(raffle.id);
                        }}
                      >
                        Participar
                      </button>
                    </div>

                    {/* Draw Date */}
                    {raffle.drawDate && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="text-xs text-gray-400">
                          Sorteo: {new Date(raffle.drawDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold mb-4 text-[#FAFAFA] font-montserrat">No se encontraron rifas</h3>
            <p className="text-[#9CA3AF] max-w-md mx-auto font-medium mb-6">
              {searchTerm 
                ? 'No hay rifas que coincidan con tu búsqueda. Intenta con otros términos.'
                : 'No hay rifas disponibles en este momento. ¡Vuelve pronto!'
              }
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedStatus('all');
                setSelectedDrawMode('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#7BD389] to-[#164C52] text-white rounded-xl hover:from-[#7BD389] hover:to-[#0E1E24] transition-all duration-300 font-medium"
            >
              Ver Todas las Rifas
            </button>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
