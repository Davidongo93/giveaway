import { memo } from 'react';

interface TicketCellProps {
  number: number;
  formattedNumber: string;
  price: number;
  isSold: boolean;
  isPalindrome: boolean;
  isSelected: boolean;
  onClick: () => void;
  cellSize: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  isDisabled?: boolean;
}

const TicketCell = memo(function TicketCell({
  formattedNumber,
  price,
  isSold,
  isPalindrome,
  isSelected,
  onClick,
  cellSize,
  isDisabled = false,
}: TicketCellProps) {
  const handleClick = () => {
    if (!isSold && !isDisabled) {
      onClick();
    }
  };

  const getBackgroundColor = () => {
    if (isSelected) return 'bg-yellow-500 border-yellow-600';
    if (isSold) return 'bg-red-500 border-red-600';
    if (isPalindrome) return 'bg-blue-500 border-blue-600';
    if (isDisabled) return 'bg-gray-500 border-gray-600';
    return 'bg-green-500 border-green-600 hover:bg-green-400 cursor-pointer';
  };

  const getTextColor = () => {
    if (isSelected) return 'text-white';
    if (isSold) return 'text-white';
    if (isDisabled) return 'text-gray-300';
    return 'text-white';
  };

  return (
    <div
      className={`
        border-2 m-auto w-full h-full rounded-lg flex flex-col items-center justify-center transition-all duration-200
        ${cellSize.mobile} 
        md:${cellSize.tablet} 
        lg:${cellSize.desktop}
        ${getBackgroundColor()}
        ${(!isSold && !isDisabled) ? 'hover:scale-110 hover:shadow-lg transform' : ''}
        ${isSelected ? 'ring-2 ring-white ring-opacity-50' : ''}
      `}
      onClick={handleClick}
      title={
        isSold ? `Ticket #${formattedNumber} - Vendido` :
        isSelected ? `Ticket #${formattedNumber} - Seleccionado` :
        `Ticket #${formattedNumber} - $${price}`
      }
    >
      <span className={`font-bold ${getTextColor()} leading-none text-xs md:text-sm`}>
        {formattedNumber}{isPalindrome && !isSold && (
        <span >★</span>
      )}
      </span>
      
      {isSold && (
        <span className="text-white text-xs leading-none mt-0.5">✕</span>
      )}
    </div>
  );
});

export default TicketCell;