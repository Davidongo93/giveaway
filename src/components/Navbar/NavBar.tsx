import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
          Rifas Online
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white transition-colors">
            Inicio
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white transition-colors">
            Mis Tickets
          </Link>
        </div>
      </div>
    </nav>
  );
}