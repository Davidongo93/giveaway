import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RaffleStatus, RaffleType, TicketService } from '../../services/api';
import PurchaseModal from './PurchaseModal';
import TicketCell from './TicketCell';

interface RaffleGridProps {
  raffle: {
    id: string;
    ticketPrice: number;
    tickets: boolean[];
    raffleType: RaffleType;
    status: RaffleStatus;
  };
  onPurchase: (number: number) => void;
  currentUserId: string;
}

// Configuraciones de zoom
const ZOOM_CONFIGS = [
  { level: 1, rows: 5, cols: 10, cellSize: { mobile: 'w-12 h-12', tablet: 'w-16 h-16', desktop: 'w-20 h-20' } },
  { level: 2, rows: 8, cols: 12, cellSize: { mobile: 'w-10 h-10', tablet: 'w-14 h-14', desktop: 'w-18 h-18' } },
  { level: 3, rows: 10, cols: 15, cellSize: { mobile: 'w-8 h-8', tablet: 'w-12 h-12', desktop: 'w-16 h-16' } },
  { level: 4, rows: 12, cols: 20, cellSize: { mobile: 'w-6 h-6', tablet: 'w-10 h-10', desktop: 'w-14 h-14' } },
  { level: 5, rows: 15, cols: 25, cellSize: { mobile: 'w-5 h-5', tablet: 'w-8 h-8', desktop: 'w-12 h-12' } },
];

export default function RaffleGrid({ raffle, onPurchase, currentUserId }: RaffleGridProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(3);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const currentZoom = ZOOM_CONFIGS.find(config => config.level === zoomLevel) || ZOOM_CONFIGS[2];
  const ticketsPerView = currentZoom.rows * currentZoom.cols;

  // Función para formatear números de ticket
  const formatTicketNumber = useCallback((number: number): string => {
    const totalTickets = raffle.tickets.length-1;
    const numberLength = totalTickets.toString().length;
    return number.toString().padStart(numberLength, '0');
  }, [raffle.tickets.length]);

  // Verificar si es palíndromo
  const isPalindrome = useCallback((number: string): boolean => {
    return number === number.split('').reverse().join('');
  }, []);

  // Búsqueda de tickets
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value === '') return;

    const number = parseInt(value, 10);
    if (!isNaN(number) && number >= 0 && number < raffle.tickets.length) {
      const offset = Math.floor(number / currentZoom.cols) * currentZoom.cols;
      setCurrentOffset(offset);
    }
  };

  // Controles de zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, ZOOM_CONFIGS.length));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  // Selección múltiple
  const handleCellClick = useCallback((number: number) => {
    if (raffle.status !== 'active' || raffle.tickets[number]) {
      return;
    }

    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else {
        return [...prev, number];
      }
    });
  }, [raffle.tickets, raffle.status]);

  // Drag para desplazamiento infinito
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    if (Math.abs(deltaX) > 30) {
      setCurrentOffset(prev => {
        const newOffset = prev + (deltaX > 0 ? -currentZoom.cols : currentZoom.cols);
        return Math.max(0, Math.min(newOffset, raffle.tickets.length - ticketsPerView));
      });
      setDragStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events para móvil
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - dragStartX;
    if (Math.abs(deltaX) > 20) {
      setCurrentOffset(prev => {
        const newOffset = prev + (deltaX > 0 ? -currentZoom.cols : currentZoom.cols);
        return Math.max(0, Math.min(newOffset, raffle.tickets.length - ticketsPerView));
      });
      setDragStartX(e.touches[0].clientX);
    }
  };

  // Tickets visibles en la vista actual
  const visibleTickets = useMemo(() => {
    const startIndex = currentOffset;
    const endIndex = Math.min(startIndex + ticketsPerView, raffle.tickets.length);
    
    return raffle.tickets.slice(startIndex, endIndex).map((isSold, index) => ({
      number: startIndex + index,
      isSold,
    }));
  }, [raffle.tickets, currentOffset, ticketsPerView]);

  // Compra múltiple
  const handlePurchaseMultiple = useCallback(async () => {
    if (selectedNumbers.length === 0) return;

    try {
      for (const number of selectedNumbers) {
        await TicketService.buy({
          raffleId: raffle.id,
          userId: currentUserId,
          number: number,
          urlComprobante: 'proof',
        });
      }
      
      selectedNumbers.forEach(number => onPurchase(number));
      setSelectedNumbers([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error purchasing tickets:', error);
    }
  }, [selectedNumbers, raffle.id, currentUserId, onPurchase]);

  // Navegación por teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentOffset(prev => Math.max(0, prev - currentZoom.cols));
      } else if (e.key === 'ArrowRight') {
        setCurrentOffset(prev => Math.min(prev + currentZoom.cols, raffle.tickets.length - ticketsPerView));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentZoom.cols, raffle.tickets.length, ticketsPerView]);

  return (
    <div className="mb-8">
      {/* Controles superiores */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
        {/* Buscador */}
        <div className="flex-1 w-full lg:w-auto">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Buscar ticket
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={searchTerm}
              onChange={handleSearch}
              min="0"
              max={raffle.tickets.length - 1}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Número (0-${raffle.tickets.length - 1})`}
            />
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Controles de zoom y navegación */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-300">Zoom:</span>
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel === 1}
                className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
              >
                −
              </button>
              <span className="px-2 text-sm text-white min-w-8 text-center">
                {zoomLevel}x
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel === ZOOM_CONFIGS.length}
                className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Navegación */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-300">Navegar:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentOffset(prev => Math.max(0, prev - currentZoom.cols))}
                disabled={currentOffset === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentOffset(prev => Math.min(prev + currentZoom.cols, raffle.tickets.length - ticketsPerView))}
                disabled={currentOffset >= raffle.tickets.length - ticketsPerView}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Información de selección */}
      {selectedNumbers.length > 0 && (
        <div className="mb-4 p-4 bg-blue-600 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-white font-semibold">
                {selectedNumbers.length} ticket(s) seleccionado(s)
              </span>
              <p className="text-blue-100 text-sm">
                Total: ${(selectedNumbers.length * raffle.ticketPrice).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedNumbers([])}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors"
              >
                Limpiar
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Comprar Selección
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid de tickets */}
      <div className="relative">
        <div
          ref={gridRef}
          className={`
            grid m-auto justify-center transition-all duration-200
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          `}
          style={{
            gridTemplateColumns: `repeat(${currentZoom.cols}, minmax(0, 1fr))`
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {visibleTickets.map(({ number, isSold }) => (
            <TicketCell
              key={number}
              number={number}
              formattedNumber={formatTicketNumber(number)}
              price={raffle.ticketPrice}
              isSold={isSold}
              isPalindrome={isPalindrome(formatTicketNumber(number))}
              isSelected={selectedNumbers.includes(number)}
              onClick={() => handleCellClick(number)}
              cellSize={currentZoom.cellSize}
              isDisabled={raffle.status !== 'active'}
            />
          ))}
        </div>

        {/* Indicadores de desplazamiento infinito */}
        <div className="flex justify-center items-center gap-4 mt-4 text-sm text-gray-400">
          <span>← Desplaza o arrastra para navegar →</span>
        </div>
      </div>

      {/* Información del grid */}
      <div className="text-center mt-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Palíndromo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Vendido</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Seleccionado</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-gray-300">
          <span>Mostrando tickets {currentOffset + 1}-{Math.min(currentOffset + ticketsPerView, raffle.tickets.length)} de {raffle.tickets.length}</span>
          <span>•</span>
          <span>Disponibles: {raffle.tickets.filter(ticket => !ticket).length}</span>
          <span>•</span>
          <span>Vendidos: {raffle.tickets.filter(ticket => ticket).length}</span>
        </div>
      </div>

      {/* Modal de compra múltiple */}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePurchaseMultiple}
        numbers={selectedNumbers}
        price={raffle.ticketPrice}
        total={selectedNumbers.length * raffle.ticketPrice}
        raffleType={raffle.raffleType}
      />

      {/* Estado de la rifa */}
      {raffle.status !== 'active' && (
        <div className="text-center mt-6 p-4 bg-yellow-600 rounded-lg">
          <p className="text-white font-medium">
            {raffle.status === RaffleStatus.DRAFT && 'Esta rifa está en borrador'}
            {raffle.status === RaffleStatus.CANCELLED && 'Esta rifa ha sido cancelada'}
            {raffle.status === RaffleStatus.FINISHED && 'Esta rifa ha finalizado'}
          </p>
          <p className="text-yellow-100 text-sm mt-1">
            No se pueden comprar tickets en este estado
          </p>
        </div>
      )}
    </div>
  );
}