import { AnimatePresence, motion } from 'framer-motion';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  number: number | null;
  price: number;
}

export default function PurchaseModal({ isOpen, onClose, onConfirm, number, price }: PurchaseModalProps) {
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
            <h3 className="text-xl font-bold mb-4">Confirmar compra</h3>
            <p className="mb-4">
              Estás comprando el número <span className="font-bold">{number?.toString().padStart(2, '0')}</span> por <span className="font-bold">${price.toFixed(2)}</span>.
            </p>
            
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
                Confirmar compra
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}