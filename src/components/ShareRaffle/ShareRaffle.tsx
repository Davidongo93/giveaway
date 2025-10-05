// components/ShareRaffle/ShareRaffle.tsx
import { useCallback, useRef, useState } from 'react';
import { Raffle } from '../../services/api';
import ShareImageGenerator, { ShareImageGeneratorHandle } from './ShareImageGenerator';
import ShareModal from './ShareModal';

interface ShareRaffleProps {
  raffle: Raffle;
  className?: string;
}

// Función para generar imagen de compartir (definida ANTES de su uso)
const generateShareImage = async (raffle: Raffle): Promise<string> => {
  // Crear canvas temporal
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Configurar canvas según el tipo de sorteo
  const width = 1200;
  const height = 630; // Tamaño óptimo para redes sociales
  
  canvas.width = width;
  canvas.height = height;

  // Fondo gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1e3a8a');
  gradient.addColorStop(1, '#7c3aed');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Título
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🎉 ¡GRAN SORTEO! 🎉', width / 2, 100);

  // Nombre del sorteo
  ctx.font = 'bold 36px Arial';
  ctx.fillText(raffle.title || raffle.description, width / 2, 160);

  // Información básica
  ctx.font = 'bold 28px Arial';
  ctx.fillStyle = '#fbbf24';
  ctx.fillText(`🏆 Premio: $${raffle.prizeValue.toLocaleString()}`, width / 2, 220);
  
  ctx.font = '24px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`💰 Ticket: $${raffle.ticketPrice}`, width / 2, 260);

  // Tickets vendidos
  const soldTickets = raffle.tickets.filter(ticket => ticket).length;
  const totalTickets = raffle.tickets.length;
  const percentage = (soldTickets / totalTickets) * 100;
  
  ctx.fillStyle = '#d1d5db';
  ctx.font = '20px Arial';
  ctx.fillText(`${soldTickets}/${totalTickets} Tickets Vendidos (${percentage.toFixed(1)}%)`, width / 2, 300);

  // Fecha o mensaje de lotería
  if (raffle.drawDate) {
    const drawDate = new Date(raffle.drawDate).toLocaleDateString();
    ctx.fillText(`📅 Sorteo: ${drawDate}`, width / 2, 340);
  } else {
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('🎯 ¡Tú eliges la lotería!', width / 2, 340);
  }

  // URL del sitio
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '18px Arial';
  ctx.fillText('Participa en: misorteos.com', width / 2, height - 20);

  return canvas.toDataURL('image/png');
};

export default function ShareRaffle({ raffle, className = '' }: ShareRaffleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const imageGeneratorRef = useRef<ShareImageGeneratorHandle>(null);

  const handleShareClick = useCallback(async () => {
    setIsModalOpen(true);
    
    // Generar imagen usando el método del componente ShareImageGenerator
    if (imageGeneratorRef.current) {
      try {
        const imageUrl = await imageGeneratorRef.current.generateImage();
        setGeneratedImage(imageUrl);
      } catch (error) {
        console.error('Error generating image:', error);
        // Fallback: generar imagen básica
        const fallbackImage = await generateShareImage(raffle);
        setGeneratedImage(fallbackImage);
      }
    } else {
      // Fallback si el ref no está disponible
      const fallbackImage = await generateShareImage(raffle);
      setGeneratedImage(fallbackImage);
    }
  }, [raffle]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <>
      {/* Botón/Icono de compartir */}
      <button
        onClick={handleShareClick}
        className={`flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 ${className}`}
        aria-label="Compartir sorteo"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {/* Componente generador de imágenes (oculto) */}
      <div style={{ display: 'none' }}>
        <ShareImageGenerator ref={imageGeneratorRef} raffle={raffle} />
      </div>

      {/* Modal de compartir */}
      <ShareModal
        isOpen={isModalOpen}
        onClose={closeModal}
        raffle={raffle}
        generatedImage={generatedImage}
      />
    </>
  );
}