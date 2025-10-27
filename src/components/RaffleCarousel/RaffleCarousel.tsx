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

  // Auto-play functionality
  useEffect(() => {
    if (!autoplay || raffles.length <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.ceil(raffles.length / itemsPerView));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, raffles.length, itemsPerView]);

  const totalSlides = Math.ceil(raffles.length / itemsPerView);
  const visibleRaffles = raffles.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
    setAutoplay(false);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
    setAutoplay(false);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setAutoplay(false);
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

  if (raffles.length === 0) {
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
      {raffles.length > itemsPerView && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-lg p-3 rounded-full shadow-2xl transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-lg p-3 rounded-full shadow-2xl transition-all opacity-0 group-hover:opacity-100"
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
            transition={{ duration: 0.5 }}
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

              return (
                <motion.div
                  key={raffle.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all cursor-pointer group/card"
                  onClick={() => onRaffleClick(raffle.id)}
                >
                  {/* Prize Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={raffle.prizeImageUrl}
                      alt={raffle.title || raffle.description || 'Raffle prize'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                      style={{ objectFit: 'cover' }}
                      priority

                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${typeInfo.color}`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Prize Value */}
                    <div className="absolute bottom-4 left-4">
                      <div className="text-2xl font-bold text-white">${raffle.prizeValue.toLocaleString()}</div>
                      <div className="text-green-400 text-sm">Premio Principal</div>
                    </div>
                  </div>

                  {/* Raffle Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {raffle.title || raffle.description}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {raffle.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Progreso de venta</span>
                        <span className="font-semibold">{soldTickets}/{raffle.tickets.length}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
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
                      
                      <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all">
                        Participar
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex justify-between mt-4 pt-4 border-t border-white/10 text-xs text-gray-400">
                      <div className="text-center">
                        <div className="font-bold text-white">{soldTickets}</div>
                        <div>Vendidos</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white">{raffle.tickets.length - soldTickets}</div>
                        <div>Disponibles</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-white">{Math.round(progress)}%</div>
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
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-blue-500 w-8' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      )}

      {/* Auto-play Toggle */}
      {raffles.length > itemsPerView && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setAutoplay(!autoplay)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            <div className={`w-3 h-3 rounded-full ${autoplay ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">Auto-play: {autoplay ? 'On' : 'Off'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
