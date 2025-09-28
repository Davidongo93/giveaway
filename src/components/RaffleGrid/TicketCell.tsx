import { memo } from 'react';

interface TicketCellProps {
  number: number;
  formattedNumber: string;
  price: number;
  isSold: boolean;
  isPalindrome: boolean;
  onClick: () => void;
  cellSize: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  isDisabled?: boolean;
}

const TicketCell = memo(function TicketCell({
  number,
  formattedNumber,
  price,
  isSold,
  isPalindrome,
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
    if (isSold) return 'bg-red-100 border-red-300';
    if (isPalindrome) return 'bg-blue-100 border-blue-300';
    if (isDisabled) return 'bg-gray-100 border-gray-300';
    return 'bg-green-100 border-green-300 hover:bg-green-200 cursor-pointer';
  };

  const getTextColor = () => {
    if (isSold) return 'text-red-700';
    if (isDisabled) return 'text-gray-500';
    return 'text-gray-800';
  };

  return (
    <div
      className={`
        border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200
        ${cellSize.mobile} 
        md:${cellSize.tablet} 
        lg:${cellSize.desktop}
        ${getBackgroundColor()}
        ${(!isSold && !isDisabled) ? 'hover:scale-105 hover:shadow-md' : ''}
      `}
      onClick={handleClick}
      title={isSold ? `Ticket #${number} - Vendido` : `Ticket #${number} - $${price}`}
    >
      <span className={`font-bold ${getTextColor()} leading-none`}>
        {formattedNumber}
      </span>
      {isPalindrome && !isSold && (
        <span className="text-blue-500 text-xs leading-none">★</span>
      )}
      {isSold && (
        <span className="text-red-500 text-xs leading-none">✕</span>
      )}
    </div>
  );
});

export default TicketCell;