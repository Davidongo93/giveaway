import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer/Footer';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Navbar from '../components/Navbar/NavBar';
import RaffleCarousel from '../components/RaffleCarousel/RaffleCarousel';
import { Raffle, RaffleService } from '../services/api';



export default function Home() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const rafflesData = await RaffleService.getAll();
        console.log('Fetched raffles:', rafflesData);
        setRaffles(rafflesData);
      } catch (error) {
        console.error('Error fetching raffles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaffles();
  }, []);
  console.log('Raffles state after fetch:', raffles);
  

  const handleRaffleClick = (id: string) => {
    router.push(`/raffle/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Head>
        <title>Rifas Online | Participa y Gana</title>
        <meta name="description" content="Participa en nuestras rifas emocionantes" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 animate-fade-in">
          Rifas Disponibles
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <RaffleCarousel raffles={raffles} onRaffleClick={handleRaffleClick} />
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">¿Cómo participar?</h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            Selecciona una rifa, elige tu número favorito y completa el proceso de compra.
            ¡Suerte en el sorteo!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}