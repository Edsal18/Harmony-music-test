import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Key, UserCheck, AlertTriangle } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, rellena todos los campos.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'ADMIN') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Credenciales inválidas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto my-20 px-6 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center filter blur-3xl opacity-5">
        <div className="w-[500px] h-[500px] rounded-full bg-harmony-accentBlue"></div>
      </div>

      <div className="glassmorphism p-8 rounded-3xl border border-white/10 shadow-2xl relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white mb-2">Acceso a Harmony Music</h2>
          <p className="text-gray-400 text-sm">Ingresa a tu cuenta para gestionar el catálogo</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-2.5 animate-fadeIn">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">Correo Electrónico</label>
            <div className="relative">
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@harmony.com"
                className="w-full bg-harmony-navy/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-harmony-cyan transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">Contraseña</label>
            <div className="relative">
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-harmony-navy/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-harmony-cyan transition-all"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-harmony-slate to-harmony-cyan text-harmony-darkBg font-bold py-3.5 rounded-xl text-center shadow-lg shadow-harmony-cyan/10 hover:shadow-harmony-cyan/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative bg-[#0d2230] px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acceso Rápido</span>
        </div>

        {/* Test Accounts shortcuts */}
        <div className="space-y-3">
          <button
            onClick={() => handleQuickLogin('admin@harmony.com', 'admin123')}
            className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:bg-harmony-cyan/10 hover:border-harmony-cyan/40 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all text-gray-300"
          >
            <span className="flex items-center gap-2">
              <Key className="w-4 h-4 text-harmony-cyan" />
              Administrador (CRUD completo)
            </span>
            <span className="text-xs text-gray-500 font-mono">admin123</span>
          </button>

          <button
            onClick={() => handleQuickLogin('user@harmony.com', 'user123')}
            className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:bg-harmony-cyan/10 hover:border-harmony-cyan/40 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all text-gray-300"
          >
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-harmony-cyan" />
              Usuario Regular (Solo lectura)
            </span>
            <span className="text-xs text-gray-500 font-mono">user123</span>
          </button>
        </div>
      </div>
    </div>
  );
}
