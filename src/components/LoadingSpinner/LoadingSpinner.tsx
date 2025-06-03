import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Ruleta giratoria */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="relative w-20 h-20 rounded-full border-4 border-transparent"
        style={{
          background: 'conic-gradient(from 0deg, #ef4444 0%, #f59e0b 20%, #84cc16 40%, #10b981 60%, #3b82f6 80%, #8b5cf6 100%)',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
        }}
      >
        {/* Bola de la ruleta */}
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md"
        />
      </motion.div>

      {/* Cartas revoloteando */}
      <div className="flex space-x-2">
        {['♥', '♦', '♣', '♠'].map((suit, index) => (
          <motion.div
            key={suit}
            initial={{ y: 0, rotate: -10 + index * 5 }}
            animate={{
              y: [0, -15, 0],
              rotate: [-10 + index * 5, 10 - index * 5, -10 + index * 5]
            }}
            transition={{
              duration: 1.5,
              delay: index * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className={`text-3xl ${
              suit === '♥' || suit === '♦' ? 'text-red-500' : 'text-black'
            }`}
          >
            {suit}
          </motion.div>
        ))}
      </div>

      {/* Texto con efecto máquina de casino */}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500"
      >
        Preparando la emoción...
      </motion.div>

      {/* Efecto de chispas */}
      <div className="relative w-full h-4">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, y: 0, opacity: 0 }}
            animate={{
              x: [0, 100],
              y: Math.random() * 20 - 10,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeOut"
            }}
            className="absolute w-2 h-2 rounded-full bg-yellow-400"
            style={{
              left: `${Math.random() * 20}%`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>
    </div>
  );
}