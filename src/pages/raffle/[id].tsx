import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Navbar from '../../components/Navbar/NavBar';
import PrizeDetails from '../../components/PrizeDetails/PrizeDetails';
import RaffleGrid from '../../components/RaffleGrid/RaffleGrid';
import ShareRaffle from '../../components/ShareRaffle/ShareRaffle';
import { Raffle, RaffleService, RaffleType } from '../../services/api';

export default function RaffleDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'grid' | 'details'>('grid');

  // Función para cargar los datos de la rifa
  const fetchRaffle = useCallback(async (raffleId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const raffleData = await RaffleService.getById(raffleId);
      setRaffle(raffleData);
    } catch (err) {
      console.error('Error fetching raffle:', err);
      setError('No se pudo cargar la información de la rifa');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchRaffle(id);
    }

  }, [id, fetchRaffle]);

  // Manejar la compra de tickets
  const handlePurchase = useCallback((ticketNumber: number) => {
    console.log('Purchasing ticket:', ticketNumber);
    if (raffle?.id) {
    fetchRaffle(raffle.id);
    }
    // Aquí podrías agregar lógica adicional como actualizar el estado local

    // o mostrar una notificación de éxito
  }, [fetchRaffle, raffle?.id]);

  // Navegación responsiva
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Recargar la página
  const handleRetry = useCallback(() => {
    if (id && typeof id === 'string') {
      fetchRaffle(id);
    }
  }, [id, fetchRaffle]);

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-white mt-4 text-lg">Cargando rifa...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Estado de error
  if (error || !raffle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh] px-4">
          <div className="text-center max-w-md">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-white text-xl font-bold mb-2">Error al cargar la rifa</h2>
            <p className="text-gray-300 mb-6">{error || 'La rifa no existe o no está disponible'}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Volver atrás
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
<Head>
  <title>{raffle.title || raffle.description} | Rifas Online</title>
  <meta name="description" content={`Participa en la rifa: ${raffle.description}. Premio: $${raffle.prizeValue}. Ticket: $${raffle.ticketPrice}`} />
  
  {/* Open Graph / Facebook */}
  <meta property="og:type" content="website" />
  <meta property="og:url" content={`https://unamanu.space/raffle/${raffle.id}`} />
  <meta property="og:title" content={raffle.title || raffle.description} />
  <meta property="og:description" content={`Premio: $${raffle.prizeValue} • Ticket: $${raffle.ticketPrice}`} />
  <meta property="og:image" content={`/api/raffle/${raffle.id}/share-image`} />
  
  {/* Twitter */}
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={`https://unamanu.space/raffle/${raffle.id}`} />
  <meta property="twitter:title" content={raffle.title || raffle.description} />
  <meta property="twitter:description" content={`Premio: $${raffle.prizeValue} • Ticket: $${raffle.ticketPrice}`} />
  <meta property="twitter:image" content={`/api/raffle/${raffle.id}/share-image`} />
</Head>

      <Navbar />

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header responsivo */}
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
  {/* Botón volver */}
  <button
    onClick={handleBack}
    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors self-start sm:self-auto"
  >
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span className="text-sm sm:text-base">Volver</span>
  </button>

  {/* Botón de compartir - NUEVO */}
  <div className="flex items-center gap-4 self-start sm:self-auto">
    <ShareRaffle 
      raffle={raffle} 
      className="shadow-lg" 
    />
    
    {/* Navegación por pestañas */}
    <div className="flex space-x-1 sm:space-x-2 bg-gray-800 p-1 rounded-lg">
      <button
        onClick={() => setActiveTab('grid')}
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-all text-sm sm:text-base whitespace-nowrap ${
          activeTab === 'grid' 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        📋 Números
      </button>
      <button
        onClick={() => setActiveTab('details')}
        className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md transition-all text-sm sm:text-base whitespace-nowrap ${
          activeTab === 'details' 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        🏆 Detalles
      </button>
    </div>
  </div>
</div>

        {/* Información principal de la rifa */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 line-clamp-2">
            {raffle.title || raffle.description}
          </h1>
          
          {/* Badges de estado e información */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              raffle.status === 'active' ? 'bg-green-500' :
              raffle.status === 'draft' ? 'bg-yellow-500' :
              raffle.status === 'finished' ? 'bg-blue-500' :
              'bg-red-500'
            }`}>
              {raffle.status === 'active' ? '🟢 Activa' :
               raffle.status === 'draft' ? '📝 Borrador' :
               raffle.status === 'finished' ? '✅ Finalizada' : '❌ Cancelada'}
            </span>
            
            <span className="px-3 py-1 bg-purple-500 rounded-full text-xs font-medium">
              {raffle.raffleType === RaffleType.SMALL ? '🎯 100 Tickets' :
               raffle.raffleType === RaffleType.MEDIUM ? '🎯 1K Tickets' : '🎯 10K Tickets'}
            </span>
            
            <span className="px-3 py-1 bg-orange-500 rounded-full text-xs font-medium">
              💰 ${raffle.prizeValue}
            </span>
          </div>

          {/* Progreso de venta - solo mostrar si está activa */}
          {raffle.status === 'active' && (
            <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Tickets vendidos</span>
                <span>
                  {raffle.tickets.filter(ticket => ticket).length} / {raffle.tickets.length}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(raffle.tickets.filter(ticket => ticket).length / raffle.tickets.length) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Contenido principal según pestaña activa */}
        <div className="min-h-[400px]">
          {activeTab === 'grid' ? (
            <RaffleGrid 
              raffle={raffle} 
              onPurchase={handlePurchase}
              currentUserId="7d5e75cd-501a-433f-a29c-6ade90c01e6d" // Reemplazar con ID real del usuario
            />
          ) : (
            <PrizeDetails raffle={raffle} />
          )}
        </div>

        {/* Call to Action flotante para móviles */}
        {raffle.status === 'active' && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 shadow-lg sm:hidden">
            <div className="container mx-auto flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">¡Participa ahora!</p>
                <p className="text-blue-100 text-sm">${raffle.ticketPrice} por ticket</p>
              </div>
              <button 
                onClick={() => setActiveTab('grid')}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Comprar Ticket
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}