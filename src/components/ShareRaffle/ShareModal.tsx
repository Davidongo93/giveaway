// components/ShareRaffle/ShareModal.tsx
import { useEffect } from 'react';
import { Raffle } from '../../services/api';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffle: Raffle;
  generatedImage: string;
}

export default function ShareModal({ isOpen, onClose, generatedImage }: ShareModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `🎉 ¡Participa en este increíble sorteo! No te pierdas la oportunidad de ganar grandes premios. 🏆`;

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    },
    {
      name: 'Telegram',
      icon: 'Telegram',
      color: 'bg-blue-400 hover:bg-blue-500',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Twitter',
      icon: 'Twitter',
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Instagram',
      icon: 'Instagram',
      color: 'bg-pink-600 hover:bg-pink-700',
      url: '#' // Instagram no permite sharing directo, se maneja diferente
    },
    {
      name: 'Email',
      icon: 'Email',
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=Participa en este sorteo&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
    },
    {
      name: 'Copiar Enlace',
      icon: 'Link',
      color: 'bg-purple-600 hover:bg-purple-700',
      url: 'copy'
    },
    {
      name: 'Descargar Imagen',
      icon: 'Download',
      color: 'bg-orange-500 hover:bg-orange-600',
      url: 'download'
    }
  ];

  const handleShare = async (option: typeof shareOptions[0]) => {
    if (option.url === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('¡Enlace copiado al portapapeles!');
      } catch (err) {
        // Fallback para navegadores antiguos
        console.error(err)
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('¡Enlace copiado al portapapeles!');
      }
      return;
    }

    if (option.url === 'download' && generatedImage) {
      const link = document.createElement('a');
      link.download = `sorteo-${Date.now()}.png`;
      link.href = generatedImage;
      link.click();
      return;
    }
if (option.name === 'Instagram') {
  // Para Instagram, mostramos instrucciones ya que no hay API directa
  if (generatedImage) {
    // Si hay imagen generada, permitir descargarla
    const link = document.createElement('a');
    link.download = `sorteo-instagram-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
    alert('Imagen descargada. Ahora puedes compartirla en Instagram:\n1. Sube la imagen a tus stories o feed\n2. Incluye el enlace del sorteo en tu biografía');
  } else {
    alert('Generando imagen... intenta de nuevo en un momento.');
  }
  return;
}

    window.open(option.url, '_blank', 'width=600,height=400');
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: string } = {
      WhatsApp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.188-3.553-8.439',
      Telegram: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.78 5.42-.9 6.8-.06.67-.36.89-.89.56-2.45-1.83-3.57-2.98-5.79-4.78-.51-.42-.87-.64-.78-1.01.08-.37.56-.38 1.01-.28.28.06 4.32 2.76 4.79 3.02.47.26.8.38 1.13.38.14 0 .27-.02.4-.06.56-.22.89-.83 1.04-1.36.39-1.34 1.11-4.24 1.29-5.33.06-.38.23-.56.5-.56.28 0 .78.14.78.78 0 .28-.08.67-.17 1.34z',
      Facebook: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z',
      Twitter: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10zm-6.927-3.75c.522.775.823 1.686.823 2.652 0 2.86-2.18 6.162-6.162 6.162a6.13 6.13 0 01-3.32-.973l-.266.158.035.237c.245 1.75 1.52 3.13 3.22 3.53-.477.134-.98.21-1.5.21-.293 0-.577-.026-.85-.074a6.144 6.144 0 005.74-4.262 6.12 6.12 0 01-3.62-1.243l-.38-.296.035.402c.07.81.62 1.5 1.38 1.77-.457.123-.94.19-1.44.19-.35 0-.69-.04-1.02-.114.69 2.12 2.67 3.66 4.99 3.71a6.16 6.16 0 01-4.58 2.12c-.297 0-.59-.02-.877-.06a8.69 8.69 0 004.71 1.38c5.65 0 8.74-4.68 8.74-8.74 0-.133-.003-.266-.008-.398.6-.43 1.12-.97 1.53-1.58-.55.244-1.14.41-1.76.48.63-.38 1.12-.97 1.35-1.68z',
      Instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
      Email: 'M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z',
      Link: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
      Download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'
    };

    return icons[iconName] || '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-md w-full mx-auto border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Compartir Sorteo</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Vista previa de imagen */}
        <div className="p-6 border-b border-gray-700">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            {generatedImage ? (
              <div className="space-y-3">
                <img 
                  src={generatedImage} 
                  alt="Vista previa para compartir" 
                  className="w-full rounded-lg border border-gray-600"
                />
                <p className="text-gray-300 text-sm">
                  Esta imagen se incluirá al compartir
                </p>
              </div>
            ) : (
              <div className="py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-300">Generando imagen...</p>
              </div>
            )}
          </div>
        </div>

        {/* Opciones de compartir */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => handleShare(option)}
                className={`flex flex-col items-center p-4 rounded-xl text-white transition-all duration-300 transform hover:scale-105 ${option.color}`}
              >
                <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d={getIcon(option.icon)} />
                </svg>
                <span className="text-xs font-medium text-center">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enlace directo */}
        <div className="p-6 border-t border-gray-700">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enlace directo
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleShare({ name: 'Copiar', icon: 'Link', color: '', url: 'copy' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Copiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}