export default function Footer() {
    return (
      <footer className="bg-gray-900 py-6 px-4 mt-12">
        <div className="container mx-auto text-center text-gray-400">
          <p>© {new Date().getFullYear()} Rifas Online. Todos los derechos reservados.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    );
  }