import React from 'react';
import { Music } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-harmony-darkBg/60 backdrop-blur-md py-8 px-6 text-center text-gray-500 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-harmony-cyan/60" />
          <span className="font-bold text-gray-400">Harmony Music</span>
        </div>

        {/* Copy */}
        <p>© {currentYear} Harmony Music. Todos los derechos reservados.</p>

        {/* Links */}
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Términos</a>
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
