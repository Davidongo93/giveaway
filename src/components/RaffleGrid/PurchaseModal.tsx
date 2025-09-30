import { AnimatePresence, motion } from 'framer-motion';
import { RaffleType } from '../../services/api';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  numbers: number[];
  price: number;
  total: number;
  raffleType: RaffleType;
}

export default function PurchaseModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  numbers, 
  price, 
  total 
}: PurchaseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">
              {numbers.length > 1 ? 'Confirmar compra múltiple' : 'Confirmar compra'}
            </h3>
            
            {numbers.length > 1 ? (
              <div className="mb-4">
                <p className="mb-2">Estás comprando {numbers.length} tickets:</p>
                <div className="max-h-32 overflow-y-auto bg-gray-700 rounded p-2">
                  {numbers.map((number) => (
                    <span key={number} className="inline-block bg-gray-600 rounded px-2 py-1 mr-2 mb-2 text-sm">
                      #{number.toString().padStart(numbers[numbers.length - 1].toString().length, '0')}
                    </span>
                  ))}
                </div>
                <p className="mt-3">
                  Precio individual: <span className="font-bold">${price.toFixed(2)}</span>
                </p>
                <p className="text-lg font-bold text-green-400">
                  Total: ${total.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="mb-4">
                Estás comprando el número <span className="font-bold">#{numbers[0]?.toString().padStart(2, '0')}</span> 
                por <span className="font-bold">${price.toFixed(2)}</span>.
              </p>
            )}
            
            <div className="flex flex-col space-y-3">
              <input
                type="text"
                placeholder="Nombre completo"
                className="px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                className="px-4 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
              >
                {numbers.length > 1 ? `Comprar ${numbers.length} tickets` : 'Confirmar compra'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}