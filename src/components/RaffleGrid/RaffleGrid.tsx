import { useCallback, useEffect, useMemo, useState } from 'react';

import { RaffleStatus, RaffleType, TicketService } from '../../services/api';
import PurchaseModal from './PurchaseModal';
import TicketCell from './TicketCell';
interface RaffleGridProps {
  raffle: {
    id: string;
    ticketPrice: number;
    tickets: boolean[];
    raffleType: RaffleType,
    status: RaffleStatus
  };
  onPurchase: (number: number) => void;
  currentUserId: string;
}

type GridConfig = {
  rows: number;
  cols: number;
  ticketsPerPage: number;
  cellSize: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
};

const GRID_CONFIGS: Record<RaffleType, GridConfig> = {
  [RaffleType.SMALL]: {
    rows: 10,
    cols: 10,
    ticketsPerPage: 100,
    cellSize: {
      mobile: 'w-8 h-8 text-xs',
      tablet: 'w-12 h-12 text-sm',
      desktop: 'w-16 h-16 text-base',
    },
  },
  [RaffleType.MEDIUM]: {
    rows: 20,
    cols: 50,
    ticketsPerPage: 200,
    cellSize: {
      mobile: 'w-6 h-6 text-xs',
      tablet: 'w-8 h-8 text-xs',
      desktop: 'w-10 h-10 text-sm',
    },
  },
  [RaffleType.LARGE]: {
    rows: 10,
    cols: 10,
    ticketsPerPage: 100,
    cellSize: {
      mobile: 'w-4 h-4 text-xs',
      tablet: 'w-6 h-6 text-xs',
      desktop: 'w-8 h-8 text-sm',
    },
  },
};

export default function RaffleGrid({ raffle, onPurchase, currentUserId }: RaffleGridProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
   const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

   // Configuración de zoom
  const ZOOM_LEVELS = {
    1: { mobile: 'w-8 h-8 text-xs', tablet: 'w-12 h-12 text-sm', desktop: 'w-16 h-16 text-base' },
    2: { mobile: 'w-12 h-12 text-sm', tablet: 'w-16 h-16 text-base', desktop: 'w-20 h-20 text-lg' },
    3: { mobile: 'w-16 h-16 text-base', tablet: 'w-20 h-20 text-lg', desktop: 'w-24 h-24 text-xl' },
  };

// Función para formatear el número de ticket como string (manteniendo los ceros a la izquierda)
const formatTicketNumber = useCallback((number: number): string => {
  const totalTickets = raffle.tickets.length - 1;
  const numberLength = totalTickets.toString().length;
  const formattedNumber = number.toString().padStart(numberLength, '0');
  
  console.log(`Formateando número: ${number} -> ${formattedNumber}, Total tickets: ${totalTickets}, Longitud: ${numberLength}`);
  
  return formattedNumber; // Devuelve string, no número
}, [raffle.tickets.length]);

  const config: GridConfig = 
    raffle.raffleType === RaffleType.SMALL ? GRID_CONFIGS[RaffleType.SMALL] :
    raffle.raffleType === RaffleType.MEDIUM ? GRID_CONFIGS[RaffleType.MEDIUM] :
    GRID_CONFIGS[RaffleType.LARGE];
  console.log(config);

  // Efecto para buscar un número y cambiar a la página correspondiente
  useEffect(() => {
    if (searchTerm === '') return;

    const number = parseInt(searchTerm, 10);
    if (isNaN(number) || number < 0 || number >= raffle.tickets.length) {
      // Número inválido, no hacemos nada
      return;
    }

    const page = Math.floor(number / config.ticketsPerPage);
    setCurrentPage(page);
  }, [searchTerm, raffle.tickets.length, config.ticketsPerPage]);
  
  const totalPages = Math.ceil(raffle.tickets.length / config.ticketsPerPage);


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const gridConfig = useMemo(() => {
    const totalTickets = raffle.tickets.length;
    const actualRows = Math.min(config.rows, Math.ceil(totalTickets / config.cols));
    
    return {
      ...config,
      rows: actualRows,
      totalTickets,
    };
  }, [raffle.tickets.length, config]);

  // Calcular tickets visibles en la página actual
  const visibleTickets = useMemo(() => {
    const startIndex = currentPage * config.ticketsPerPage;
    const endIndex = Math.min(startIndex + config.ticketsPerPage, raffle.tickets.length);
    
    return raffle.tickets.slice(startIndex, endIndex).map((isSold, index) => ({
      number: startIndex + index,
      isSold,
    }));
  }, [raffle.tickets, currentPage, config.ticketsPerPage]);

  const handleCellClick = useCallback((number: number) => {
    if (raffle.status !== 'active') {
      return; // Solo permitir clicks si la rifa está activa
    }
    
    if (raffle.tickets[number]) {
      return; // No hacer nada si el ticket ya está vendido
    }
    
    setSelectedNumber(number);
    setIsModalOpen(true);
  }, [raffle.tickets, raffle.status]);


  // Función para manejar la búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Función para manejar el cambio de zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  // Aplicar el zoom a la configuración de celdas
  const currentZoomConfig = ZOOM_LEVELS[zoomLevel as keyof typeof ZOOM_LEVELS];

  const handlePurchase = useCallback(async () => {
    if (selectedNumber === null) return;

    try {
      await TicketService.buy({
        raffleId: raffle.id,
        userId: currentUserId,
        number: selectedNumber,
        urlComprobante: 'proof', // TODO: Implementar subida de comprobante
      });
      
      onPurchase(selectedNumber);
      setIsModalOpen(false);
      setSelectedNumber(null);
    } catch (error) {
      console.error('Error purchasing ticket:', error);
      // TODO: Mostrar notificación de error al usuario
    }
  }, [selectedNumber, raffle.id, currentUserId, onPurchase]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNumber(null);
  }, []);

  // const goToPage = useCallback((page: number) => {
  //   setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  // }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  }, []);

  // Función para verificar si un número es palíndromo
  const isPalindrome = useCallback((number: string): boolean => {
    return number === number.split('').reverse().join('');
  }, [raffle.tickets.length]);

  // Renderizar controles de paginación
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          Anterior
        </button>
        
        <span className="text-sm text-gray-600">
          Página {currentPage + 1} de {totalPages}
        </span>
        
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages - 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          Siguiente
        </button>
      </div>
    );
  };

  // Renderizar información del grid
  const renderGridInfo = () => (
    <div className="text-center mb-4">
      <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
        <span>Tickets totales: {raffle.tickets.length}</span>
        <span>•</span>
        <span>Disponibles: {raffle.tickets.filter(ticket => !ticket).length}</span>
        <span>•</span>
        <span>Vendidos: {raffle.tickets.filter(ticket => ticket).length}</span>
        {totalPages > 1 && (
          <>
            <span>•</span>
            <span>Mostrando {visibleTickets.length} tickets</span>
          </>
        )}
      </div>
    </div>
  );

  return (
        <div className="mb-8">
      {/* Controles: buscador y zoom */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Buscar ticket:</span>
          <input
            type="number"
            value={searchTerm}
            onChange={handleSearch}
            min="0"
            max={raffle.tickets.length - 1}
            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Ej: 42"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Zoom:</span>
          <button onClick={handleZoomOut} className="px-2 py-1 bg-gray-200 rounded">-</button>
          <span className="text-sm">{zoomLevel}x</span>
          <button onClick={handleZoomIn} className="px-2 py-1 bg-gray-200 rounded">+</button>
        </div>
      </div>
      {/* Información del grid */}
      {renderGridInfo()}

      {/* Contenedor responsivo del grid */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-block min-w-full">
          <div 
            className="grid gap-1 mx-auto justify-center"
            style={{
              gridTemplateColumns: `repeat(${Math.min(config.cols, visibleTickets.length)}, minmax(0, 1fr))`
            }}
          >
            {visibleTickets.map(({ number, isSold }) => (
          <TicketCell
            key={number}
            number={number}
            formattedNumber={formatTicketNumber(number)} // Pasamos el número formateado
            price={raffle.ticketPrice}
            isSold={isSold}
            isPalindrome={isPalindrome(formatTicketNumber(number))}
            onClick={() => handleCellClick(number)}
            cellSize={currentZoomConfig} // Usamos el zoom actual
            isDisabled={raffle.status !== 'active'}
          />
            ))}
          </div>
        </div>
      </div>

      {/* Paginación */}
      {renderPagination()}

      {/* Modal de compra */}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handlePurchase}
        number={selectedNumber}
        price={raffle.ticketPrice}
        raffleType={raffle.raffleType}
        // isPurchasing={false} // TODO: Implementar estado de carga
      />

      {/* Estado de la rifa */}
      {raffle.status !== 'active' && (
        <div className="text-center mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800 font-medium">
            {raffle.status === RaffleStatus.DRAFT && 'Esta rifa está en borrador'}
            {raffle.status === RaffleStatus.CANCELLED && 'Esta rifa ha sido cancelada'}
            {raffle.status === RaffleStatus.FINISHED && 'Esta rifa ha finalizado'}
          </p>
          <p className="text-yellow-600 text-sm mt-1">
            No se pueden comprar tickets en este estado
          </p>
        </div>
      )}
    </div>
  );
}