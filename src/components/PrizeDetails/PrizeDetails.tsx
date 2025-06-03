import { motion } from 'framer-motion';

interface PrizeDetailsProps {
  raffle: {
    description: string;
    prizeValue: number;
    ticketPrice: number;
    status: string;
  };
}

export default function PrizeDetails({ raffle }: PrizeDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 mb-8"
    >
      <h2 className="text-2xl font-bold mb-4">Detalles del Premio</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-400">Descripción</h3>
          <p className="text-gray-300">{raffle.description}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-blue-400">Valor del Premio</h3>
          <p className="text-2xl font-bold text-green-400">${raffle.prizeValue.toFixed(2)}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-blue-400">Precio por Ticket</h3>
          <p className="text-xl font-medium">${raffle.ticketPrice.toFixed(2)}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-blue-400">Estado</h3>
          <p className="capitalize">{raffle.status}</p>
        </div>
        
        <div className="pt-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-blue-400">Condiciones</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>El sorteo se realizará una vez se vendan todos los tickets</li>
            <li>El ganador será contactado por correo electrónico y teléfono</li>
            <li>El premio debe ser reclamado dentro de los 30 días siguientes al sorteo</li>
            <li>Participantes deben ser mayores de 18 años</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}