/* eslint-disable @typescript-eslint/no-unused-vars */
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
        raffle.featured
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

  const handleTurismoClick = () => {
    router.push('/turismo');
  };

  const handlePortfolioClick = () => {
    router.push('/portfolio');
  };

  const handleContactClick = () => {
    router.push('/contacto');
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E1E24] via-[#164C52] to-[#0E1E24] text-[#FAFAFA] font-sans">
      <Head>
        <title>Domir - Desarrollo Web & Servicios de Turismo</title>
        <meta 
          name="description" 
          content="Desarrollador full-stack y guía de turismo. Participa en rifas, contrata servicios de desarrollo web o vive experiencias turísticas únicas en Colombia." 
        />
        <meta name="keywords" content="desarrollo web, turismo Colombia, rifas, programación, React, Node.js, guía turístico" />
        <meta name="robots" content="index, follow" />
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
              Colaboración <span className="text-[#FFC857]">Mutua</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-[#E5E7EB] mb-8 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Desarrollador full-stack en formación, creando oportunidades a través de rifas, 
              servicios de turismo y desarrollo web. ¡Juntos podemos crecer!
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button 
                onClick={handleTurismoClick}
                className="px-8 py-4 bg-gradient-to-r from-[#7BD389] to-[#164C52] text-[#0E1E24] font-bold rounded-xl hover:from-[#7BD389] hover:to-[#0E1E24] transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
              >
                🗺️ Servicios de Turismo
              </button>
              <button 
                onClick={handlePortfolioClick}
                className="px-8 py-4 bg-gradient-to-r from-[#FFC857] to-[#164C52] text-[#0E1E24] font-bold rounded-xl hover:from-[#FFC857] hover:to-[#0E1E24] transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
              >
                💻 Mi Portfolio
              </button>
              <button 
                onClick={handleContactClick}
                className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
              >
                📞 Contactar
              </button>
            </motion.div>

            {/* Stats Overview */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
            >
              {[
                { value: "2+", label: 'Años Programando', color: 'text-[#7BD389]' },
                { value: "15+", label: 'Proyectos Completados', color: 'text-[#FFC857]' },
                { value: "50+", label: 'Tours Realizados', color: 'text-[#164C52]' },
                { value: "100%", label: 'Comprometido', color: 'text-[#FFC857]' }
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
        {/* Services Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 md:mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-montserrat">
              Mis <span className="text-[#164C52]">Servicios</span>
            </h2>
            <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto font-medium">
              Ofrezco diferentes servicios mientras me preparo para oportunidades laborales en tecnología
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: "🎯",
                title: "Rifas Solidarias",
                description: "Participa en rifas con premios increíbles mientras apoyas mi formación profesional",
                features: ["Premios desde $50.000", "100% transparente", "Sorteos verificados"],
                action: "Ver Rifas",
                onClick: () => router.push('/rifas'),
                gradient: "from-[#7BD389] to-[#164C52]"
              },
              {
                icon: "🗺️",
                title: "Turismo en Colombia",
                description: "Experiencias turísticas personalizadas en los mejores destinos de Colombia",
                features: ["Tours personalizados", "Guía bilingüe", "Experiencias únicas"],
                action: "Ver Tours",
                onClick: handleTurismoClick,
                gradient: "from-[#FFC857] to-[#164C52]"
              },
              {
                icon: "💻",
                title: "Desarrollo Web",
                description: "Soluciones digitales modernas con React, Node.js y las últimas tecnologías",
                features: ["Aplicaciones web", "Landing pages", "Full-stack development"],
                action: "Ver Portfolio",
                onClick: handlePortfolioClick,
                gradient: "from-[#164C52] to-[#7BD389]"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group cursor-pointer"
                onClick={service.onClick}
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white font-montserrat">
                  {service.title}
                </h3>
                <p className="text-[#9CA3AF] mb-6 leading-relaxed font-medium">
                  {service.description}
                </p>
                <ul className="mb-6 space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-[#E5E7EB] text-sm">
                      <span className="w-2 h-2 bg-[#7BD389] rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 bg-gradient-to-r ${service.gradient} text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 font-montserrat`}
                >
                  {service.action}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Rifas Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20 md:mb-24"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 font-montserrat">
                Rifas <span className="text-[#164C52]">Destacadas</span>
              </h2>
              <p className="text-[#9CA3AF] text-lg font-medium">
                Participa y apoya mi crecimiento profesional
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="flex bg-white/5 backdrop-blur-lg rounded-xl p-1 border border-[#374151]">
                {[
                  { key: 'all', label: 'Todas', color: 'bg-[#164C52]' },
                  { key: 'featured', label: 'Destacadas', color: 'bg-[#FFC857]' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as unknown as 'all' | 'active' | 'featured')}
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
              <button 
                onClick={() => router.push('/rifas')}
                className="px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-montserrat"
              >
                Ver Todas las Rifas
              </button>
            </div>
          </div>

          {/* Raffles Display */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <LoadingSpinner />
                <p className="mt-4 text-[#9CA3AF] font-medium">Cargando rifas disponibles...</p>
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
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-[#FAFAFA] font-montserrat">No hay rifas disponibles</h3>
              <p className="text-[#9CA3AF] max-w-md mx-auto font-medium">
                Pronto tendremos nuevas rifas. ¡Mientras tanto, puedes explorar mis otros servicios!
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* My Story Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-20 md:mb-24"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
                  Mi <span className="text-[#7BD389]">Historia</span>
                </h2>
                <p className="text-[#E5E7EB] mb-6 leading-relaxed font-medium">
                  Soy un apasionado desarrollador en formación, actualmente dedicando todo mi tiempo 
                  a mejorar mis habilidades en programación mientras busco oportunidades laborales 
                  en el sector tech.
                </p>
                <p className="text-[#E5E7EB] mb-8 leading-relaxed font-medium">
                  Mientras tanto, he creado esta plataforma de colaboración mutua donde ofrezco 
                  servicios de turismo, desarrollo web y rifas solidarias para financiar mi 
                  formación y proyectos futuros.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="px-4 py-2 bg-[#164C52] text-white rounded-lg text-sm font-medium">JavaScript</span>
                  <span className="px-4 py-2 bg-[#164C52] text-white rounded-lg text-sm font-medium">React</span>
                  <span className="px-4 py-2 bg-[#164C52] text-white rounded-lg text-sm font-medium">Node.js</span>
                  <span className="px-4 py-2 bg-[#164C52] text-white rounded-lg text-sm font-medium">TypeScript</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-8xl mb-6">🚀</div>
                <h3 className="text-2xl font-bold mb-4 text-[#FAFAFA] font-montserrat">En Búsqueda Activa</h3>
                <p className="text-[#9CA3AF] mb-6 font-medium">
                  Estoy buscando oportunidades como desarrollador junior o roles relacionados con tecnología
                </p>
                <button 
                  onClick={handleContactClick}
                  className="px-8 py-4 bg-gradient-to-r from-[#FFC857] to-[#164C52] text-[#0E1E24] font-bold rounded-xl hover:from-[#FFC857] hover:to-[#0E1E24] transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
                >
                  📨 Contactar para Oportunidades
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-montserrat">
            ¿Listo para <span className="text-[#FFC857]">colaborar</span>?
          </h2>
          <p className="text-xl text-[#E5E7EB] mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            Ya sea participando en una rifa, contratando un servicio de turismo o desarrollo web, 
            o simplemente compartiendo oportunidades, tu apoyo hace la diferencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleContactClick}
              className="px-8 py-4 bg-gradient-to-r from-[#7BD389] to-[#164C52] text-[#0E1E24] font-bold rounded-xl hover:from-[#7BD389] hover:to-[#0E1E24] transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
            >
              ✨ Empezar a Colaborar
            </button>
            <button 
              onClick={() => router.push('/rifas')}
              className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg font-montserrat"
            >
              🎯 Ver Todas las Rifas
            </button>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
