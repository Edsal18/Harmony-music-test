import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Music, LayoutDashboard, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="glassmorphism sticky top-0 z-40 px-6 py-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight hover:opacity-95 transition-opacity">
          <div className="p-2 bg-harmony-cyan/15 text-harmony-cyan rounded-xl">
            <Music className="w-5 h-5" />
          </div>
          <span className="text-white">Harmony <span className="text-harmony-cyan">Music</span></span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            Catálogo
          </Link>
          
          {user && user.role === 'ADMIN' && (
            <Link 
              to="/dashboard" 
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-harmony-cyan" />
              Admin Panel
            </Link>
          )}

          <div className="h-4 w-px bg-white/10"></div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                {user.email} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-gray-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 px-3.5 py-1.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-harmony-cyan text-harmony-darkBg hover:shadow-md hover:shadow-harmony-cyan/15 px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4" />
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
