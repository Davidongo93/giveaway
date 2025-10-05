// components/ShareRaffle/ShareImageGenerator.tsx
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Raffle, RaffleType } from '../../services/api';

interface ShareImageGeneratorProps {
  raffle: Raffle;
}

export interface ShareImageGeneratorHandle {
  generateImage: () => Promise<string>;
}

// Layout organizado con áreas definidas
const LAYOUT = {
  width: 1200,
  height: 630,
  padding: 40,
  header: { height: 120 },
  main: { height: 300 },
  footer: { height: 100 }
};

// Función para dibujar texto con ajuste automático
const drawText = (
  ctx: CanvasRenderingContext2D, 
  text: string, 
  x: number, 
  y: number, 
  maxWidth: number,
  fontSize: number = 16,
  color: string = '#ffffff',
  align: 'left' | 'center' | 'right' = 'center'
) => {
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  
  // Si el texto es muy largo, ajustar tamaño
  const metrics = ctx.measureText(text);
  if (metrics.width > maxWidth && fontSize > 12) {
    drawText(ctx, text, x, y, maxWidth, fontSize - 2, color, align);
    return;
  }
  
  ctx.fillText(text, x, y);
};

const drawSmallGrid = (ctx: CanvasRenderingContext2D, raffle: Raffle, area: { x: number, y: number, width: number, height: number }) => {
  const { x, y, width, height } = area;
  const gridSize = 10;
  const cellSize = Math.min(width, height) / gridSize;
  const gridWidth = cellSize * gridSize;
  const gridHeight = cellSize * gridSize;
  const startX = x + (width - gridWidth) / 2;
  const startY = y + (height - gridHeight) / 2;

  // Título del grid
  drawText(ctx, '🎯 Tickets Disponibles (100)', x + width / 2, y - 20, width - 40, 20, '#ffffff');

  // Dibujar grid
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const ticketIndex = i * gridSize + j;
      const isSold = ticketIndex < raffle.tickets.length ? raffle.tickets[ticketIndex] : false;
      
      ctx.fillStyle = isSold ? '#ef4444' : '#10b981';
      ctx.fillRect(startX + j * cellSize, startY + i * cellSize, cellSize - 2, cellSize - 2);
      
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '10px Arial';
      ctx.fillText(
        (ticketIndex + 1).toString(),
        startX + j * cellSize + cellSize / 2,
        startY + i * cellSize + cellSize / 2
      );
    }
  }

  // Leyenda
  const legendY = startY + gridHeight + 20;
  ctx.fillStyle = '#10b981';
  ctx.fillRect(startX, legendY, 15, 15);
  drawText(ctx, 'Disponible', startX + 25, legendY + 7, 100, 14, '#ffffff', 'left');

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(startX + 120, legendY, 15, 15);
  drawText(ctx, 'Vendido', startX + 145, legendY + 7, 100, 14, '#ffffff', 'left');
};

const drawMediumGrid = (ctx: CanvasRenderingContext2D, raffle: Raffle, area: { x: number, y: number, width: number, height: number }) => {
  const { x, y, width, height } = area;
  const soldTickets = raffle.tickets.filter(ticket => ticket).length;
  const totalTickets = raffle.tickets.length;
  const percentage = (soldTickets / totalTickets) * 100;
  
  // Título del grid
  drawText(ctx, '🎯 Vista Previa de Tickets (1K)', x + width / 2, y - 20, width - 40, 20, '#ffffff');
  
  // Área del grid
  const gridSize = 300;
  const startX = x + (width - gridSize) / 2;
  const startY = y + (height - gridSize) / 2;
  
  // Fondo del área del grid
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(startX, startY, gridSize, gridSize);
  
  // Dibujar miniaturas de tickets
  const miniGridSize = 25;
  const cellSize = gridSize / miniGridSize;
  
  for (let i = 0; i < miniGridSize; i++) {
    for (let j = 0; j < miniGridSize; j++) {
      const ticketIndex = Math.floor((i * miniGridSize + j) * (1000 / (miniGridSize * miniGridSize)));
      if (ticketIndex < raffle.tickets.length) {
        const isSold = raffle.tickets[ticketIndex];
        ctx.fillStyle = isSold ? '#ef4444' : '#10b981';
        ctx.fillRect(
          startX + j * cellSize, 
          startY + i * cellSize, 
          cellSize - 1, 
          cellSize - 1
        );
      }
    }
  }
  
  // Información de progreso
  const progressY = startY + gridSize + 30;
  drawText(ctx, `${soldTickets}/${totalTickets} Tickets Vendidos`, x + width / 2, progressY, width, 18, '#ffffff');
  drawText(ctx, `${percentage.toFixed(1)}% Completado`, x + width / 2, progressY + 25, width, 16, '#fbbf24');
};

const drawLargeGrid = (ctx: CanvasRenderingContext2D, raffle: Raffle, area: { x: number, y: number, width: number, height: number }) => {
  const { x, y, width, height } = area;
  const soldTickets = raffle.tickets.filter(ticket => ticket).length;
  const totalTickets = raffle.tickets.length;
  const percentage = (soldTickets / totalTickets) * 100;
  
  // Título del grid
  drawText(ctx, '🎯 Vista Previa de Tickets (10K)', x + width / 2, y - 20, width - 40, 20, '#ffffff');
  
  // Área del grid
  const gridSize = 300;
  const startX = x + (width - gridSize) / 2;
  const startY = y + (height - gridSize) / 2;
  
  // Fondo del área del grid
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(startX, startY, gridSize, gridSize);
  
  // Dibujar miniaturas de tickets
  const miniGridSize = 50;
  const cellSize = gridSize / miniGridSize;
  
  for (let i = 0; i < miniGridSize; i++) {
    for (let j = 0; j < miniGridSize; j++) {
      const ticketIndex = Math.floor((i * miniGridSize + j) * (10000 / (miniGridSize * miniGridSize)));
      if (ticketIndex < raffle.tickets.length) {
        const isSold = raffle.tickets[ticketIndex];
        ctx.fillStyle = isSold ? '#ef4444' : '#10b981';
        ctx.fillRect(
          startX + j * cellSize, 
          startY + i * cellSize, 
          cellSize - 0.5, 
          cellSize - 0.5
        );
      }
    }
  }
  
  // Información de progreso
  const progressY = startY + gridSize + 30;
  drawText(ctx, `${soldTickets}/${totalTickets} Tickets Vendidos`, x + width / 2, progressY, width, 18, '#ffffff');
  drawText(ctx, `${percentage.toFixed(1)}% Completado`, x + width / 2, progressY + 25, width, 16, '#fbbf24');
};

const drawPrizeInfo = (ctx: CanvasRenderingContext2D, raffle: Raffle, area: { x: number, y: number, width: number, height: number }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { x, y, width, height } = area;
  const centerX = x + width / 2;
  
  // Premio principal
  drawText(ctx, '🏆 Premio Principal', centerX, y + 30, width - 40, 24, '#fbbf24');
  drawText(ctx, `$${raffle.prizeValue.toLocaleString()}`, centerX, y + 60, width - 40, 32, '#ffffff');

  // Segundo premio si existe
  if (raffle.secondPrizeValue) {
    drawText(ctx, '🥈 Segundo Premio', centerX, y + 100, width - 40, 20, '#d1d5db');
    drawText(ctx, `$${raffle.secondPrizeValue.toLocaleString()}`, centerX, y + 125, width - 40, 24, '#ffffff');
  }

  // Información adicional
  const infoY = raffle.secondPrizeValue ? y + 160 : y + 100;
  drawText(ctx, `💰 Ticket: $${raffle.ticketPrice}`, centerX, infoY, width - 40, 20, '#fbbf24');
  
  if (raffle.drawDate) {
    const drawDate = new Date(raffle.drawDate).toLocaleDateString();
    drawText(ctx, `📅 Sorteo: ${drawDate}`, centerX, infoY + 30, width - 40, 18, '#d1d5db');
  } else {
    drawText(ctx, '🎯 ¡Tú eliges la lotería!', centerX, infoY + 30, width - 40, 18, '#f59e0b');
  }
};

const drawTicketGrid = (ctx: CanvasRenderingContext2D, raffle: Raffle, area: { x: number, y: number, width: number, height: number }) => {
  switch (raffle.raffleType) {
    case RaffleType.SMALL:
      drawSmallGrid(ctx, raffle, area);
      break;
    case RaffleType.MEDIUM:
      drawMediumGrid(ctx, raffle, area);
      break;
    case RaffleType.LARGE:
      drawLargeGrid(ctx, raffle, area);
      break;
    default:
      drawMediumGrid(ctx, raffle, area);
  }
};

const ShareImageGenerator = forwardRef<ShareImageGeneratorHandle, ShareImageGeneratorProps>(
  ({ raffle }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateImage = async (): Promise<string> => {
      const canvas = canvasRef.current;
      if (!canvas) {
        throw new Error('Canvas not available');
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      const { width, height, padding, header, main, footer } = LAYOUT;
      canvas.width = width;
      canvas.height = height;

      // Limpiar canvas
      ctx.clearRect(0, 0, width, height);

      // Fondo con gradient atractivo
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#1e40af');
      gradient.addColorStop(0.5, '#7c3aed');
      gradient.addColorStop(1, '#ec4899');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Patrón de fondo sutil
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < width; i += 50) {
        for (let j = 0; j < height; j += 50) {
          ctx.fillRect(i, j, 2, 2);
        }
      }

      // === HEADER SECTION ===
      const headerArea = {
        x: padding,
        y: padding,
        width: width - (padding * 2),
        height: header.height
      };

      // Título principal
      drawText(ctx, '🎉 ¡GRAN SORTEO! 🎉', width / 2, headerArea.y + 40, headerArea.width, 48, '#ffffff');

      // Nombre del sorteo
      const title = raffle.title || raffle.description;
      drawText(ctx, title, width / 2, headerArea.y + 90, headerArea.width, 36, '#ffffff');

      // === MAIN CONTENT SECTION ===
      const mainArea = {
        x: padding,
        y: headerArea.y + headerArea.height,
        width: width - (padding * 2),
        height: main.height
      };

      // Para rifas pequeñas, usar layout de dos columnas
      if (raffle.raffleType === RaffleType.SMALL) {
        const leftColumn = {
          x: mainArea.x,
          y: mainArea.y,
          width: mainArea.width * 0.6,
          height: mainArea.height
        };

        const rightColumn = {
          x: mainArea.x + mainArea.width * 0.6,
          y: mainArea.y,
          width: mainArea.width * 0.4,
          height: mainArea.height
        };

        drawTicketGrid(ctx, raffle, leftColumn);
        drawPrizeInfo(ctx, raffle, rightColumn);
      } else {
        // Para rifas medianas y grandes, usar layout de una columna
        const gridArea = {
          x: mainArea.x,
          y: mainArea.y,
          width: mainArea.width,
          height: mainArea.height * 0.7
        };

        const prizeArea = {
          x: mainArea.x,
          y: mainArea.y + mainArea.height * 0.7,
          width: mainArea.width,
          height: mainArea.height * 0.3
        };

        drawTicketGrid(ctx, raffle, gridArea);
        drawPrizeInfo(ctx, raffle, prizeArea);
      }

      // === FOOTER SECTION ===
      const footerArea = {
        x: padding,
        y: mainArea.y + mainArea.height,
        width: width - (padding * 2),
        height: footer.height
      };

      // URL del sitio
      drawText(ctx, 'Participa en: misorteos.com', width / 2, footerArea.y + footerArea.height / 2, footerArea.width, 20, 'rgba(255, 255, 255, 0.7)');

      return canvas.toDataURL('image/png');
    };

    useImperativeHandle(ref, () => ({
      generateImage
    }));

    return <canvas ref={canvasRef} style={{ display: 'block' }} />;
  }
);

ShareImageGenerator.displayName = 'ShareImageGenerator';

export default ShareImageGenerator;