import React from 'react';
import { Tag } from 'lucide-react';

export default function Card({ item }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  return (
    <article className="glassmorphism rounded-2xl overflow-hidden hover:border-harmony-cyan/30 hover:shadow-lg hover:shadow-harmony-cyan/5 transition-all duration-300 group flex flex-col h-full">
      {/* Image Container */}
      <div className="h-52 overflow-hidden relative bg-harmony-navy/25">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Pill */}
        <span className="absolute top-4 left-4 bg-harmony-navy/80 backdrop-blur-md text-harmony-cyan border border-harmony-cyan/25 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <Tag className="w-3 h-3" />
          {item.category?.name || 'Instrumento'}
        </span>
      </div>

      {/* Info Body */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-extrabold text-xl text-white mb-2 leading-snug group-hover:text-harmony-cyan transition-colors line-clamp-1">
          {item.title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
          {item.description}
        </p>

        {/* Price Divider */}
        <div className="h-px bg-white/5 mb-4"></div>

        {/* Price Info */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block">Precio</span>
            <span className="text-2xl font-black text-white">{formatPrice(item.price)}</span>
          </div>
          <button className="bg-white/5 border border-white/10 hover:bg-harmony-cyan hover:border-harmony-cyan hover:text-harmony-darkBg text-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.97]">
            Detalles
          </button>
        </div>
      </div>
    </article>
  );
}
