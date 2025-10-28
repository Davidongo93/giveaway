import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { RaffleStatus, RaffleType } from '../../services/api';

interface RaffleCarouselProps {
  raffles: {
    id: string;
    title?: string;
    description: string;
    prizeValue: number;
    ticketPrice: number;
    prizeImageUrl: string;
    raffleType: RaffleType;
    status: RaffleStatus;
    tickets: boolean[];
    createdAt: string;
  }[];
  onRaffleClick: (id: string) => void;
}

export default function RaffleCarousel({ raffles, onRaffleClick }: RaffleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [autoplay, setAutoplay] = useState(true);

  // Filtrar rifas: excluir DRAFT y ordenar por estado (ACTIVE primero)
  const filteredRaffles = raffles.filter(raffle => raffle.status !== RaffleStatus.DRAFT)
    .sort((a, b) => {
      // Priorizar rifas ACTIVAS
      if (a.status === RaffleStatus.ACTIVE && b.status !== RaffleStatus.ACTIVE) return -1;
      if (b.status === RaffleStatus.ACTIVE && a.status !== RaffleStatus.ACTIVE) return 1;
      return 0;
    });

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  // Auto-play functionality - 10 segundos como solicitado
  useEffect(() => {
    if (!autoplay || filteredRaffles.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.ceil(filteredRaffles.length / itemsPerView));
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [autoplay, filteredRaffles.length, itemsPerView]);

  const totalSlides = Math.ceil(filteredRaffles.length / itemsPerView);
  const visibleRaffles = filteredRaffles.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
    setAutoplay(false);
    // Reactivar auto-play después de 15 segundos de interacción manual
    setTimeout(() => setAutoplay(true), 15000);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
    setAutoplay(false);
    // Reactivar auto-play después de 15 segundos de interacción manual
    setTimeout(() => setAutoplay(true), 15000);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setAutoplay(false);
    // Reactivar auto-play después de 15 segundos de interacción manual
    setTimeout(() => setAutoplay(true), 15000);
  }, []);

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

  // Efecto para resetear el índice cuando cambian las rifas filtradas
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredRaffles.length]);

  if (filteredRaffles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😴</div>
        <p className="text-2xl font-semibold mb-2">No hay rifas disponibles</p>
        <p className="text-gray-400">Vuelve más tarde para descubrir nuevas rifas</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Navigation Arrows */}
      {filteredRaffles.length > itemsPerView && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-black/70 hover:bg-black/90 backdrop-blur-lg p-4 rounded-full shadow-2xl transition-all opacity-0 group-hover:opacity-100 border border-white/20"
            aria-label="Rifa anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-black/70 hover:bg-black/90 backdrop-blur-lg p-4 rounded-full shadow-2xl transition-all opacity-0 group-hover:opacity-100 border border-white/20"
            aria-label="Siguiente rifa"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`grid gap-6 ${
              itemsPerView === 1 ? 'grid-cols-1' :
              itemsPerView === 2 ? 'grid-cols-1 md:grid-cols-2' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {visibleRaffles.map((raffle) => {
              const typeInfo = getRaffleTypeInfo(raffle.raffleType);
              const statusInfo = getStatusInfo(raffle.status);
              const progress = getProgressPercentage(raffle);
              const soldTickets = raffle.tickets.filter((t: boolean) => t).length;
              const availableTickets = raffle.tickets.length - soldTickets;

              return (
                <motion.div
                  key={raffle.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group/card"
                  onClick={() => onRaffleClick(raffle.id)}
                >
                  {/* Prize Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={raffle.prizeImageUrl}
                      alt={raffle.title || raffle.description || 'Premio de la rifa'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                      style={{ objectFit: 'cover' }}
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${typeInfo.color} backdrop-blur-sm`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusInfo.color} backdrop-blur-sm`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Prize Value */}
                    <div className="absolute bottom-4 left-4">
                      <div className="text-2xl font-bold text-white drop-shadow-lg">
                        ${raffle.prizeValue.toLocaleString()}
                      </div>
                      <div className="text-green-400 text-sm font-semibold drop-shadow-lg">
                        Premio Principal
                      </div>
                    </div>

                    {/* Auto-play Indicator */}
                    {autoplay && (
                      <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* Raffle Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white">
                      {raffle.title || raffle.description}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {raffle.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Progreso de venta</span>
                        <span className="font-semibold text-white">
                          {soldTickets.toLocaleString()}/{raffle.tickets.length.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-2 rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">${raffle.ticketPrice}</div>
                        <div className="text-gray-400 text-sm">por ticket</div>
                      </div>
                      
                      <button 
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRaffleClick(raffle.id);
                        }}
                      >
                        Participar
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex justify-between mt-4 pt-4 border-t border-white/10 text-xs text-gray-400">
                      <div className="text-center">
                        <div className="font-bold text-white text-sm">{soldTickets.toLocaleString()}</div>
                        <div>Vendidos</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white text-sm">{availableTickets.toLocaleString()}</div>
                        <div>Disponibles</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white text-sm">{Math.round(progress)}%</div>
                        <div>Completado</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-8 space-x-3">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 w-8 h-3' 
                  : 'bg-gray-600 hover:bg-gray-500 w-3 h-3'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play Toggle */}
      {filteredRaffles.length > itemsPerView && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setAutoplay(!autoplay)}
            className="flex items-center gap-3 px-5 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
          >
            <div className={`w-3 h-3 rounded-full transition-colors ${
              autoplay ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">
              Auto-play: {autoplay ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      )}

      {/* Slide Counter */}
      {totalSlides > 1 && (
        <div className="text-center mt-4 text-sm text-gray-400">
          Slide {currentIndex + 1} de {totalSlides}
        </div>
      )}
    </div>
  );
}
