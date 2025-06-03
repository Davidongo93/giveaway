import { motion } from 'framer-motion';
import { useState } from 'react';

interface RaffleCarouselProps {
  raffles: {
    id: string;
    description: string;
    prizeValue: number;
    status: string;
  }[];
  onRaffleClick: (id: string) => void;
}

export default function RaffleCarousel({ raffles, onRaffleClick }: RaffleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextRaffle = () => {
    setCurrentIndex((prev) => (prev + 1) % raffles.length);
  };

  const prevRaffle = () => {
    setCurrentIndex((prev) => (prev - 1 + raffles.length) % raffles.length);
  };

  if (raffles.length === 0) {
    return <p className="text-center text-gray-400">No hay rifas disponibles</p>;
  }

  return (
    <div className="relative">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800 rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => onRaffleClick(raffles[currentIndex].id)}
      >
        <h3 className="text-xl font-bold mb-2">{raffles[currentIndex].description}</h3>
        <p className="text-green-400 font-medium mb-1">Premio: ${raffles[currentIndex].prizeValue.toFixed(2)}</p>
        <p className="text-gray-400 capitalize">Estado: {raffles[currentIndex].status}</p>
      </motion.div>

      {raffles.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevRaffle();
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextRaffle();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div className="flex justify-center mt-4 space-x-2">
        {raffles.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
}