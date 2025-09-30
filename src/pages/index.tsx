import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Navbar from '../components/Navbar/NavBar';
import RaffleCarousel from '../components/RaffleCarousel/RaffleCarousel';
import { Raffle, RaffleService, RaffleStatus } from '../services/api';

export default function Home() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [filteredRaffles, setFilteredRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'featured'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        setLoading(true);
        const rafflesData = await RaffleService.getAll();
        console.log('Fetched raffles:', rafflesData);
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

  // Filtrar y buscar rifas
  useEffect(() => {
    let result = raffles;

    // Filtro por estado
    if (activeFilter === 'active') {
      result = result.filter(raffle => raffle.status === RaffleStatus.ACTIVE);
    } else if (activeFilter === 'featured') {
      result = result.filter(raffle => 
        raffle.status === RaffleStatus.ACTIVE && 
        raffle.prizeValue >= 1000 // Rifas con premios grandes
      );
    }

    // Búsqueda por título o descripción
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(raffle =>
        raffle.title?.toLowerCase().includes(term) ||
        raffle.description.toLowerCase().includes(term)
      );
    }

    setFilteredRaffles(result);
  }, [raffles, activeFilter, searchTerm]);

  const handleRaffleClick = useCallback((id: string) => {
    router.push(`/raffle/${id}`);
  }, [router]);

  const getRaffleStats = useCallback(() => {
    const activeRaffles = raffles.filter(r => r.status === RaffleStatus.ACTIVE);
    // debera sumar prizevalue y secondPrizevalue en caso de existir
const totalPrizeValue = activeRaffles.reduce((sum, r) => {
  const mainPrize = parseFloat(String(r.prizeValue)) || 0;
  const secondPrize = r.secondPrizeValue ? parseFloat(String(r.secondPrizeValue)) || 0 : 0;
  return sum + mainPrize + secondPrize;
}, 0);
  const totalTickets = activeRaffles.reduce((sum, r) => sum + r.tickets.length, 0);
    const soldTickets = activeRaffles.reduce((sum, r) => 
      sum + r.tickets.filter(t => t).length, 0
    );

    return { activeRaffles: activeRaffles.length, totalPrizeValue, totalTickets, soldTickets };
  }, [raffles]);

  const stats = getRaffleStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white">
      <Head>
        <title>Rifas Online | Participa y Gana Premios Increíbles</title>
        <meta name="description" content="Descubre las mejores rifas online con premios espectaculares. Participa y gana desde tu dispositivo favorito." />
        <meta name="keywords" content="rifas, sorteos, premios, tickets, ganar" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
            >
              Gana Premios <span className="text-yellow-400">Increíbles</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              Participa en rifas emocionantes con premios desde <span className="text-green-400 font-semibold">${Math.min(...raffles.map(r => r.prizeValue))}</span> hasta <span className="text-yellow-400 font-semibold">${Math.max(...raffles.map(r => r.prizeValue))}</span>
            </motion.p>

            {/* Stats Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-green-400">{stats.activeRaffles}</div>
                <div className="text-sm text-gray-300">Rifas Activas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-yellow-400">${stats.totalPrizeValue.toLocaleString()}</div>
                <div className="text-sm text-gray-300">En Premios</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-blue-400">{stats.totalTickets.toLocaleString()}</div>
                <div className="text-sm text-gray-300">Tickets Totales</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-purple-400">{stats.soldTickets.toLocaleString()}</div>
                <div className="text-sm text-gray-300">Tickets Vendidos</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Controls Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center lg:text-left">
              Rifas <span className="text-blue-400">Disponibles</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:flex-none">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar rifas..."
                  className="pl-10 pr-4 py-3 w-full sm:w-64 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-lg"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex bg-white/10 backdrop-blur-lg rounded-lg p-1 border border-white/20">
                <button
                  onClick={() => setActiveFilter('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === 'active' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  Todas
                </button>
                {/* esto se hara cuando halla un dashboard de administrador
                 <button
                  onClick={() => setActiveFilter('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === 'active' 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  Activas
                </button> */}
                <button
                  onClick={() => setActiveFilter('featured')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === 'featured' 
                      ? 'bg-purple-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  Destacadas
                </button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="text-center mb-6">
            <p className="text-gray-300">
              Mostrando <span className="text-white font-semibold">{filteredRaffles.length}</span> de{' '}
              <span className="text-white font-semibold">{filteredRaffles.length}</span> rifas
              {searchTerm && (
                <span> para &quot;<span className="text-blue-400">{searchTerm}</span>&quot;</span>
              )}
            </p>
          </div>
        </motion.section>

        {/* Raffles Display */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-300">Cargando rifas disponibles...</p>
            </div>
          </div>
        ) : filteredRaffles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <RaffleCarousel 
              raffles={filteredRaffles} 
              onRaffleClick={handleRaffleClick} 
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-2">No se encontraron rifas</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda o revisa nuestras rifas activas.'
                : 'Pronto tendremos nuevas rifas disponibles. ¡Vuelve más tarde!'
              }
            </p>
          </motion.div>
        )}

        {/* How to Participate Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            ¿Cómo <span className="text-green-400">participar</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="text-xl font-semibold mb-3">Elige tu rifa</h3>
              <p className="text-gray-300">
                Explora nuestras rifas activas y selecciona la que más te guste. Cada rifa tiene premios únicos.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="text-xl font-semibold mb-3">Selecciona tus números</h3>
              <p className="text-gray-300">
                Escoge tus números de la suerte. Puedes buscar números específicos o seleccionar al azar.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="text-xl font-semibold mb-3">¡Participa y gana!</h3>
              <p className="text-gray-300">
                Completa tu compra y espera el sorteo. Te notificaremos si eres el afortunado ganador.
              </p>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para <span className="text-yellow-400">ganar</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Únete a miles de participantes que ya están compitiendo por premios increíbles. ¡Tu suerte puede cambiar hoy!
          </p>
          <button 
            onClick={() => filteredRaffles.length > 0 && handleRaffleClick(filteredRaffles[0].id)}
            disabled={filteredRaffles.length === 0}
        
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Comenzar a Participar
          </button>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
