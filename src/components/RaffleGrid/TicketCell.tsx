import { motion } from 'framer-motion';

interface TicketCellProps {
  number: number;
  price: number;
  isSold: boolean;
  isPalindrome: boolean;
  onClick: () => void;
}


export default function TicketCell({ number, price, isSold, isPalindrome, onClick }: TicketCellProps) {
  const formattedNumber = number.toString().padStart(2, '0');
console.log(`Rendering TicketCell: number=${formattedNumber}, price=${price}, isSold=${isSold}, isPalindrome=${isPalindrome}`);

  return (
    <motion.div
      whileHover={{ scale: isSold ? 1 : 1.05 }}
      whileTap={{ scale: isSold ? 1 : 0.95 }}
      onClick={isSold ? undefined : onClick}
      className={`
        w-10 h-10 m-1 flex items-center justify-center rounded-md cursor-pointer transition-all
        ${isSold 
          ? 'bg-red-900 text-red-300 cursor-not-allowed' 
          : isPalindrome 
            ? 'bg-purple-800 hover:bg-purple-700' 
            : 'bg-gray-700 hover:bg-gray-600'
        }
        relative overflow-hidden
      `}
    >
      <span className="font-medium">{formattedNumber}</span>
      
      {!isSold && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-xs"
        >
          ${price.toFixed(2)}
        </motion.div>
      )}
    </motion.div>
  );
}