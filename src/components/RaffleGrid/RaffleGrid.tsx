import { useState } from 'react';
import { TicketService } from '../../services/api';
import PurchaseModal from './PurchaseModal';
import TicketCell from './TicketCell';

interface RaffleGridProps {
  raffle: {
    id: string;
    ticketPrice: number;
    tickets: boolean[];
  };
  onPurchase: (number: number) => void;
}

export default function RaffleGrid({ raffle, onPurchase }: RaffleGridProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const handleCellClick = (number: number) => {
    if (raffle.tickets[number]) return; // No hacer nada si el ticket ya está vendido
    
    setSelectedNumber(number);
    setIsModalOpen(true);
  };

  const handlePurchase = () => {
    if (selectedNumber !== null) {
      onPurchase(selectedNumber);
       TicketService.buy({
        raffleId: raffle.id,
        userId: '25e7530f-ddea-4544-bab6-3f547781f72b', // Reemplazar con el ID del usuario actual
        number: selectedNumber,
        urlComprobante: 'proof', // Aquí se puede agregar la URL del comprobante si es necesario
      });
      // Actualizar el estado del ticket como vendido
      setIsModalOpen(false);
    }
  };

  // Generar matriz 10x10
  const grid = Array(10).fill(0).map((_, row) => (
    <div key={row} className="flex justify-center">
      {Array(10).fill(0).map((_, col) => {
        const number = row * 10 + col;
        const isPalindrome = number.toString().padStart(2, '0') === 
                     number.toString().padStart(2, '0').split('').reverse().join('');
        
        
        return (
          <TicketCell
            key={col}
            number={number}
            price={raffle.ticketPrice}
            isSold={raffle.tickets[number]}
            isPalindrome={isPalindrome}
            onClick={() => handleCellClick(number)}
          />
        );
      })}
    </div>
  ));

  return (
    <div className="mb-12">
      <div className="overflow-x-auto pb-4">
        <div className="inline-block min-w-full">
          <div className="space-y-1">
            {grid}
          </div>
        </div>
      </div>

      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePurchase}
        number={selectedNumber}
        price={raffle.ticketPrice}
      />
    </div>
  );
}