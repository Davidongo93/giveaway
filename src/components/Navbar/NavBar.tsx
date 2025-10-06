import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-[#0E1E24] via-[#164C52] to-[#0E1E24] py-4 px-6 shadow-lg border-b border-[#7BD389]/20 backdrop-blur-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 group"
        >
          <div className="relative">
            <img 
              src="/unamanubg.png" 
              alt="Manito logo" 
              className="h-12 w-auto transform group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-[#FFC857]/10 rounded-full group-hover:bg-[#FFC857]/20 transition-colors duration-300"></div>
          </div>
          <span className="text-xl font-bold text-[#FAFAFA] font-montserrat hidden md:block">
            Rifas <span className="text-[#FFC857]">Online</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link 
            href="/" 
            className="text-[#FAFAFA] hover:text-[#FFC857] transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/5 group relative"
          >
            Inicio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC857] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="#" 
            className="text-[#FAFAFA] hover:text-[#FFC857] transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-white/5 group relative"
          >
            Mis Tickets
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFC857] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="#" 
            className="bg-gradient-to-r from-[#FFC857] to-[#7BD389] text-[#0E1E24] font-bold px-6 py-2 rounded-xl hover:from-[#FFC857] hover:to-[#164C52] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-montserrat"
          >
            Crear Rifa
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-[#FAFAFA] hover:text-[#FFC857] transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-[#164C52] to-[#0E1E24] border-b border-[#7BD389]/20 shadow-xl backdrop-blur-lg z-50">
          <div className="container mx-auto px-6 py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-[#FAFAFA] hover:text-[#FFC857] transition-all duration-300 font-medium px-4 py-3 rounded-lg hover:bg-white/5 border-l-4 border-transparent hover:border-[#FFC857]"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="#" 
              className="block text-[#FAFAFA] hover:text-[#FFC857] transition-all duration-300 font-medium px-4 py-3 rounded-lg hover:bg-white/5 border-l-4 border-transparent hover:border-[#FFC857]"
              onClick={() => setIsMenuOpen(false)}
            >
              Mis Tickets
            </Link>
            <Link 
              href="#" 
              className="block bg-gradient-to-r from-[#FFC857] to-[#7BD389] text-[#0E1E24] font-bold px-6 py-3 rounded-xl text-center hover:from-[#FFC857] hover:to-[#164C52] transition-all duration-300 transform hover:scale-105 font-montserrat mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Crear Rifa
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}