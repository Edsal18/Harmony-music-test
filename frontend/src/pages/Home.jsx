import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';
import { Search, RefreshCw, Music, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Paginacion
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 3; // Carga de 3 en 3 para demostrar claramente el "Cargar mas"

  // Cargar categorias al inicio
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error al cargar categorias:', err);
      }
    }
    loadCategories();
  }, []);

  // Cargar items cuando cambia la categoria o busqueda
  useEffect(() => {
    setOffset(0);
    loadItems(true);
  }, [selectedCategory, searchTerm]);

  const loadItems = async (isNewQuery = false) => {
    setLoading(true);
    setError(null);
    try {
      const currentOffset = isNewQuery ? 0 : offset;
      const data = await api.getItems({
        categoryId: selectedCategory,
        search: searchTerm,
        limit: LIMIT,
        offset: currentOffset,
      });

      if (isNewQuery) {
        setItems(data.items);
      } else {
        setItems((prev) => [...prev, ...data.items]);
      }
      
      setTotalCount(data.totalCount);
      setOffset(currentOffset + LIMIT);
    } catch (err) {
      setError(err.message || 'Error al cargar los instrumentos musicales');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    loadItems(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* 🚀 Hero Section */}
      <header className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10 flex items-center justify-center filter blur-3xl opacity-10">
          <div className="w-80 h-80 rounded-full bg-harmony-cyan"></div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Catálogo de <span className="text-gradient">Instrumentos Musicales</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Explora nuestra exclusiva colección de instrumentos de cuerda, teclados y percusión de la más alta calidad y marcas reconocidas mundialmente.
        </p>
      </header>

      {/* ⚡ Banners destacados */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="glassmorphism p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 rounded-xl bg-harmony-cyan/10 text-harmony-cyan">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white mb-1">Calidad Premium</h3>
            <p className="text-gray-400 text-sm">Instrumentos seleccionados y calibrados profesionalmente.</p>
          </div>
        </div>
        <div className="glassmorphism p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 rounded-xl bg-harmony-cyan/10 text-harmony-cyan">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white mb-1">Garantía de Marca</h3>
            <p className="text-gray-400 text-sm">Soporte y garantía directa con los fabricantes líderes.</p>
          </div>
        </div>
        <div className="glassmorphism p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 rounded-xl bg-harmony-cyan/10 text-harmony-cyan">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white mb-1">Envío Asegurado</h3>
            <p className="text-gray-400 text-sm">Despacho nacional rápido con embalaje especial de protección.</p>
          </div>
        </div>
      </section>

      {/* 🔍 Controles de Filtrado y Búsqueda */}
      <section className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10 pb-6 border-b border-white/5">
        
        {/* Categorias */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              selectedCategory === ''
                ? 'bg-harmony-cyan text-harmony-darkBg shadow-md shadow-harmony-cyan/20'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id.toString()
                  ? 'bg-harmony-cyan text-harmony-darkBg shadow-md shadow-harmony-cyan/20'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar instrumento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-harmony-navy/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-harmony-cyan focus:ring-1 focus:ring-harmony-cyan transition-all"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
        </div>
      </section>

      {/* 📦 Cuadrícula de Contenido */}
      {error && (
        <div className="glassmorphism p-6 rounded-2xl border-red-500/20 text-center max-w-md mx-auto my-10">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button 
            onClick={() => loadItems(true)} 
            className="bg-white/5 py-2 px-4 rounded-xl border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Reintentar
          </button>
        </div>
      )}

      {!error && items.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No se encontraron instrumentos en esta categoría.</p>
        </div>
      )}

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.id} className="animate-fadeIn">
            <Card item={item} />
          </div>
        ))}
      </main>

      {/* 🔄 Indicador de Carga / Botón "Cargar Más" */}
      <div className="flex justify-center mt-16 mb-20">
        {loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-harmony-cyan"></div>
        ) : (
          items.length < totalCount && (
            <button
              onClick={handleLoadMore}
              className="bg-harmony-navy border border-white/10 text-white font-bold py-3 px-8 rounded-2xl hover:bg-harmony-slate hover:border-harmony-cyan hover:shadow-lg hover:shadow-harmony-cyan/10 transition-all active:scale-[0.98]"
            >
              Cargar más instrumentos
            </button>
          )
        )}
      </div>

      {/* ⚡ Sección de Colecciones/Destacados (Los 4 cuadrados del Wireframe) */}
      <section className="mb-20 animate-fadeIn">
        <h2 className="text-2xl font-bold text-white mb-6 text-center md:text-left">Destacados de la Semana</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-harmony-cyan text-harmony-darkBg p-6 rounded-2xl flex flex-col justify-between aspect-square shadow-lg shadow-harmony-cyan/15 transition-transform hover:scale-[1.02] duration-300">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Descuento</span>
            <h4 className="text-xl font-black leading-tight">15% OFF en Cuerdas</h4>
          </div>
          <div className="bg-harmony-slate text-white p-6 rounded-2xl flex flex-col justify-between aspect-square shadow-lg transition-transform hover:scale-[1.02] duration-300">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Nuevo</span>
            <h4 className="text-xl font-black leading-tight">Sintetizadores Exclusivos</h4>
          </div>
          <div className="border-2 border-harmony-cyan/20 border-dashed text-gray-300 p-6 rounded-2xl flex flex-col justify-between aspect-square hover:border-harmony-cyan hover:text-white transition-all group hover:scale-[1.02] duration-300">
            <span className="text-xs font-bold text-harmony-cyan uppercase tracking-wider">Clínica</span>
            <h4 className="text-xl font-black leading-tight group-hover:text-harmony-cyan transition-colors">Talleres de Calibración</h4>
          </div>
          <div className="border-2 border-harmony-cyan/20 border-dashed text-gray-300 p-6 rounded-2xl flex flex-col justify-between aspect-square hover:border-harmony-cyan hover:text-white transition-all group hover:scale-[1.02] duration-300">
            <span className="text-xs font-bold text-harmony-cyan uppercase tracking-wider">Club</span>
            <h4 className="text-xl font-black leading-tight group-hover:text-harmony-cyan transition-colors">Comunidad de Músicos</h4>
          </div>
        </div>
      </section>

      {/* 👥 Sección de Testimonios/Reseñas (Los 3 círculos del Wireframe) */}
      <section className="mb-10 text-center animate-fadeIn">
        <h2 className="text-2xl font-bold text-white mb-10">Lo que opinan de nosotros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-harmony-navy/40 border-2 border-harmony-cyan/20 mb-4 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                alt="Sofía Martínez" 
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-bold text-white text-lg">Sofía Martínez</h4>
            <p className="text-harmony-cyan text-xs font-semibold mb-2">Pianista Profesional</p>
            <p className="text-gray-400 text-sm max-w-xs">"El piano Yamaha llegó perfectamente calibrado y protegido. La atención fue excelente."</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-harmony-navy/40 border-2 border-harmony-cyan/20 mb-4 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
                alt="Carlos Gómez" 
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-bold text-white text-lg">Carlos Gómez</h4>
            <p className="text-harmony-cyan text-xs font-semibold mb-2">Productor Musical</p>
            <p className="text-gray-400 text-sm max-w-xs">"El sintetizador Korg superó mis expectativas. La entrega nacional fue súper rápida."</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-harmony-navy/40 border-2 border-harmony-cyan/20 mb-4 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
                alt="Laura Ruiz" 
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-bold text-white text-lg">Laura Ruiz</h4>
            <p className="text-harmony-cyan text-xs font-semibold mb-2">Guitarrista e Instructora</p>
            <p className="text-gray-400 text-sm max-w-xs">"La Gibson Les Paul tiene un sonido increíble. Sin duda, mi tienda favorita de música."</p>
          </div>
        </div>
      </section>

    </div>
  );
}
