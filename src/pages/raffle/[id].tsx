import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer/Footer';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Navbar from '../../components/Navbar/NavBar';
import PrizeDetails from '../../components/PrizeDetails/PrizeDetails';
import RaffleGrid from '../../components/RaffleGrid/RaffleGrid';
import { Raffle, RaffleService } from '../../services/api';


export default function RaffleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [raffle, setRaffle] = useState<Raffle>({
    id: '',
    creatorId: '',
    description: '',
    ticketPrice: 0,
    prizeValue: 0,
    tickets: [],
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'grid' | 'details'>('grid');

  useEffect(() => {
    if (!id) return;

    const fetchRaffle = async () => {
      try {
     const raffleData = await RaffleService.getById(id as string);
   
      console.log('Fetched raffle data:', raffleData);
      setRaffle(raffleData);
      console.log('Fetched raffle:', raffle);


      } catch (error) {
        console.error('Error fetching raffle:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaffle();
  }, [id]);
console.log('RaffleDetail component rendered with raffle:', raffle);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!raffle) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p>Rifa no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Head>
        <title>{raffle.description} | Rifas Online</title>
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Números
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              Detalles
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">{raffle.description}</h1>

        {activeTab === 'grid' ? (
          <RaffleGrid 
            raffle={raffle} 
            onPurchase={(number) => console.log('Purchasing ticket:', number)} 
          />
        ) : (
          <PrizeDetails raffle={raffle} />
        )}
      </main>

      <Footer />
    </div>
  );
}