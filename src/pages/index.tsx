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

  // Structured Data para SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Rifas Online - Premios Increíbles",
    "description": "Plataforma de rifas online con premios espectaculares",
    "url": "https://unamanu.space",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": filteredRaffles.length,
      "itemListElement": filteredRaffles.slice(0, 5).map((raffle, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Game",
          "name": raffle.title || raffle.description,
          "description": raffle.description,
          "offers": {
            "@type": "Offer",
            "price": raffle.ticketPrice.toString(),
            "priceCurrency": "USD"
          }
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1E24] via-[#164C52] to-[#0E1E24] text-[#FAFAFA] font-sans">
      <Head>
        <title>Rifas Online | Participa y Gana Premios Increíbles</title>
        <meta 
          name="description" 
          content="Descubre las mejores rifas online con premios espectaculares. Participa en sorteos emocionantes y gana grandes premios desde tu dispositivo." 
        />
        <meta name="keywords" content="rifas, sorteos, premios, tickets, ganar, lotería, concurso" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://unamanu.space" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Rifas Online | Premios Increíbles" />
        <meta property="og:description" content="Participa en rifas emocionantes y gana premios espectaculares" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://unamanu.space" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rifas Online" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rifas Online | Premios Increíbles" />
        <meta name="twitter:description" content="Participa en rifas emocionantes y gana premios espectaculares" />
        <meta name="twitter:image" content="/twitter-image.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#164C52]/30 to-[#7BD389]/20"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#FAFAFA] to-[#7BD389] bg-clip-text text-transparent leading-tight font-montserrat"
            >
              Gana Premios <span className="text-[#FFC857]">Increíbles</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-[#E5E7EB] mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Participa en rifas emocionantes con premios desde{' '}
              <span className="text-[#7BD389] font-semibold">
                ${raffles.length > 0 ? Math.min(...raffles.map(r => r.prizeValue)).toLocaleString() : '0'}
              </span>{' '}
              hasta{' '}
              <span className="text-[#FFC857] font-semibold">
                ${raffles.length > 0 ? Math.max(...raffles.map(r => r.prizeValue)).toLocaleString() : '0'}
              </span>
            </motion.p>

            {/* Stats Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16"
            >
              {[
                { value: stats.activeRaffles, label: 'Rifas Activas', color: 'text-[#7BD389]' },
                { value: `$${stats.totalPrizeValue.toLocaleString()}`, label: 'En Premios', color: 'text-[#FFC857]' },
                { value: stats.totalTickets.toLocaleString(), label: 'Tickets Totales', color: 'text-[#164C52]' },
                { value: stats.soldTickets.toLocaleString(), label: 'Tickets Vendidos', color: 'text-[#FFC857]' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-[#7BD389]/30 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2 font-montserrat`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#E5E7EB] font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        {/* Controls Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 font-montserrat">
                Rifas <span className="text-[#164C52]">Disponibles</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg font-medium">
                Encuentra la rifa perfecta para ti
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:flex-none min-w-[280px]">
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
                  aria-label="Buscar rifas"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex bg-white/5 backdrop-blur-lg rounded-xl p-1 border border-[#374151]">
                {[
                  { key: 'all', label: 'Todas', color: 'bg-[#164C52]' },
                  { key: 'featured', label: 'Destacadas', color: 'bg-[#FFC857]' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 font-montserrat ${
                      activeFilter === filter.key 
                        ? `${filter.color} text-[#0E1E24] shadow-lg` 
                        : 'text-[#E5E7EB] hover:bg-white/5'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="text-center mb-6">
            <p className="text-[#9CA3AF] font-medium">
              Mostrando <span className="text-[#FAFAFA] font-semibold">{filteredRaffles.length}</span> rifas
              {searchTerm && (
                <span> para &quot;<span className="text-[#164C52]">{searchTerm}</span>&quot;</span>
              )}
            </p>
          </div>
        </motion.section>

        {/* Raffles Display */}
        {loading ? (
          <div className="flex justify-center items-center h-64 md:h-96">
            <div className="text-center">
              <LoadingSpinner />
              <p className="mt-4 text-[#9CA3AF] text-lg font-medium">Cargando rifas disponibles...</p>
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
            className="text-center py-16 md:py-24"
          >
            <div className="text-6xl md:text-8xl mb-6">🎯</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#FAFAFA] font-montserrat">No se encontraron rifas</h3>
            <p className="text-[#9CA3AF] max-w-md mx-auto text-lg font-medium">
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
          className="mt-20 md:mt-32 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat">
            ¿Cómo <span className="text-[#7BD389]">participar</span>?
          </h2>
          <p className="text-[#9CA3AF] text-lg mb-12 max-w-2xl mx-auto font-medium">
            Sigue estos simples pasos para unirte a nuestras rifas y tener la oportunidad de ganar premios increíbles
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                emoji: "1️⃣",
                title: "Elige tu rifa",
                description: "Explora nuestras rifas activas y selecciona la que más te guste. Cada rifa tiene premios únicos y emocionantes."
              },
              {
                emoji: "2️⃣",
                title: "Selecciona tus números",
                description: "Escoge tus números de la suerte. Puedes buscar números específicos o seleccionar al azar entre los disponibles."
              },
              {
                emoji: "3️⃣",
                title: "¡Participa y gana!",
                description: "Completa tu compra de forma segura y espera el sorteo. Te notificaremos inmediatamente si eres el ganador."
              }
            ].map((step, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-[#374151] hover:border-[#164C52]/50 transition-all duration-500 hover:transform hover:scale-105 group"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.emoji}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#FAFAFA] font-montserrat">{step.title}</h3>
                <p className="text-[#9CA3AF] leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 md:mt-32 text-center bg-gradient-to-r from-[#164C52]/30 to-[#7BD389]/20 rounded-3xl p-8 md:p-12 border border-[#374151]/50 backdrop-blur-lg"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
            ¿Listo para <span className="text-[#FFC857]">ganar</span>?
          </h2>
          <p className="text-xl text-[#E5E7EB] mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            Únete a miles de participantes que ya están compitiendo por premios increíbles. 
            Tu oportunidad de cambiar tu suerte comienza hoy.
          </p>
          <button 
            onClick={() => filteredRaffles.length > 0 && handleRaffleClick(filteredRaffles[0].id)}
            disabled={filteredRaffles.length === 0}
            className="px-8 py-4 bg-gradient-to-r from-[#7BD389] to-[#164C52] text-[#0E1E24] font-bold rounded-xl hover:from-[#7BD389] hover:to-[#0E1E24] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl font-montserrat"
          >
            Comenzar a Participar
          </button>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}