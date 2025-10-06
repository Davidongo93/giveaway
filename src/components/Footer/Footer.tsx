import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#164C52] to-[#0E1E24] py-12 px-4 mt-20 border-t border-[#7BD389]/20">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src="/unamanubg.png" 
                alt="Manito logo" 
                className="h-12 w-auto" 
              />
              <span className="text-2xl font-bold text-[#FAFAFA] font-montserrat">
                Rifas <span className="text-[#FFC857]">Online</span>
              </span>
            </div>
            <p className="text-[#E5E7EB] max-w-md leading-relaxed font-medium">
              La plataforma más confiable para participar en rifas emocionantes y ganar premios increíbles. 
              Donde la inteligencia artificial se encuentra con el sentimiento natural.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-[#FAFAFA] mb-4 font-montserrat">Enlaces Rápidos</h3>
            <div className="space-y-3">
              <Link 
                href="/" 
                className="block text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 font-medium"
              >
                Inicio
              </Link>
              <Link 
                href="#" 
                className="block text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 font-medium"
              >
                Mis Tickets
              </Link>
              <Link 
                href="#" 
                className="block text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 font-medium"
              >
                Crear Rifa
              </Link>
              <Link 
                href="#" 
                className="block text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 font-medium"
              >
                Sorteos Activos
              </Link>
            </div>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-bold text-[#FAFAFA] mb-4 font-montserrat">Soporte</h3>
            <div className="space-y-3">
              <Link 
                href="#" 
                className="block text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 font-medium"
              >
                Términos de Servicio
              </Link>
              <Link 
                href="#" 
                className="block text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 font-medium"
              >
                Política de Privacidad
              </Link>
              <Link 
                href="#" 
                className="block text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 font-medium"
              >
                Contacto
              </Link>
              <Link 
                href="#" 
                className="block text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 font-medium"
              >
                Preguntas Frecuentes
              </Link>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-8">
          {[
            { name: 'Facebook', icon: '📘', url: '#' },
            { name: 'Twitter', icon: '🐦', url: '#' },
            { name: 'Instagram', icon: '📷', url: '#' },
            { name: 'WhatsApp', icon: '💬', url: '#' }
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl hover:bg-[#FFC857] hover:text-[#0E1E24] transition-all duration-300 transform hover:scale-110 backdrop-blur-lg border border-white/10 hover:border-[#FFC857]"
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#7BD389]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-[#E5E7EB] font-medium">
                © {currentYear} <span className="text-[#FFC857]">Rifas Online</span>. 
                <span className="block md:inline"> La inteligencia artificial, el sentimiento natural.</span>
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center space-x-6">
              <Link 
                href="#" 
                className="text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 text-sm font-medium"
              >
                Términos
              </Link>
              <Link 
                href="#" 
                className="text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 text-sm font-medium"
              >
                Privacidad
              </Link>
              <Link 
                href="#" 
                className="text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 text-sm font-medium"
              >
                Contacto
              </Link>
              <Link 
                href="#" 
                className="text-[#E5E7EB] hover:text-[#FFC857] transition-colors duration-300 text-sm font-medium"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center space-x-6 mt-8 pt-6 border-t border-[#7BD389]/10">
          <div className="text-[#7BD389] text-sm font-medium flex items-center space-x-2">
            <span>🔒</span>
            <span>Transacciones Seguras</span>
          </div>
          <div className="text-[#7BD389] text-sm font-medium flex items-center space-x-2">
            <span>⚡</span>
            <span>Sorteos en Tiempo Real</span>
          </div>
          <div className="text-[#7BD389] text-sm font-medium flex items-center space-x-2">
            <span>🎯</span>
            <span>Resultados Verificados</span>
          </div>
        </div>
      </div>
    </footer>
  );
}