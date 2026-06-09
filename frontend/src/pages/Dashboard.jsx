import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, X, RefreshCw, AlertCircle, DollarSign, Image } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Cargar todas las categorias y todos los items (sin paginacion para el panel de control)
      const [categoriesData, itemsData] = await Promise.all([
        api.getCategories(),
        api.getItems({ limit: 100 }), // Limite amplio para el admin list
      ]);
      setCategories(categoriesData);
      setItems(itemsData.items);
    } catch (err) {
      setError(err.message || 'Error al cargar la información del panel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      categoryId: categories[0]?.id.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price.toString(),
      imageUrl: item.imageUrl,
      categoryId: item.categoryId.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este instrumento de manera permanente?')) {
      return;
    }
    
    try {
      await api.deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'Error al eliminar el elemento');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId),
    };

    try {
      if (editingItem) {
        // Actualizar
        const response = await api.updateItem(editingItem.id, payload);
        setItems((prev) => 
          prev.map((item) => (item.id === editingItem.id ? response.item : item))
        );
      } else {
        // Crear
        const response = await api.createItem(payload);
        setItems((prev) => [response.item, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Error al guardar el instrumento');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Panel de Administración</h1>
          <p className="text-gray-400 text-sm mt-1">Control del catálogo de instrumentos de Harmony Music</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-harmony-slate to-harmony-cyan text-harmony-darkBg font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-harmony-cyan/10 hover:shadow-harmony-cyan/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <Plus className="w-5 h-5" />
          Añadir Instrumento
        </button>
      </header>

      {/* Error & Loading states */}
      {error && (
        <div className="glassmorphism p-6 rounded-2xl border-red-500/20 text-center max-w-md mx-auto my-10">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button 
            onClick={loadData} 
            className="bg-white/5 py-2 px-4 rounded-xl border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-harmony-cyan"></div>
        </div>
      ) : !error && (
        <div className="glassmorphism rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-harmony-navy/60 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-white/5">
                  <th className="py-4 px-6">Instrumento</th>
                  <th className="py-4 px-6">Categoría</th>
                  <th className="py-4 px-6 text-right">Precio</th>
                  <th className="py-4 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-500">
                      No hay instrumentos registrados en el catálogo.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 flex items-center gap-4">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-12 h-12 object-cover rounded-lg bg-harmony-navy/20 border border-white/5"
                        />
                        <div>
                          <span className="font-bold text-white block">{item.title}</span>
                          <span className="text-xs text-gray-400 line-clamp-1 max-w-md mt-0.5">{item.description}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-white/5 text-gray-300 border border-white/10 text-xs px-2.5 py-1 rounded-full font-semibold">
                          {item.category?.name || 'Cargando...'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-harmony-cyan">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                        }).format(item.price)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-harmony-cyan/10 hover:border-harmony-cyan/40 hover:text-harmony-cyan transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-400 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal CRUD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-harmony-darkBg/80 backdrop-blur-sm animate-fadeIn">
          <div className="glassmorphism w-full max-w-lg rounded-3xl border border-white/15 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-white">
                {editingItem ? 'Editar Instrumento' : 'Añadir Instrumento'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">Título</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej. Guitarra Fender Stratocaster"
                  className="w-full bg-harmony-navy/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-harmony-cyan transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">Descripción</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre madera, electrónica, sonido..."
                  className="w-full bg-harmony-navy/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-harmony-cyan transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">Precio</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="999.00"
                      className="w-full bg-harmony-navy/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-harmony-cyan transition-all"
                    />
                    <DollarSign className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">Categoría</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full bg-harmony-navy/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-harmony-cyan transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id.toString()} className="bg-harmony-darkBg text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">URL de Imagen</label>
                <div className="relative">
                  <input 
                    type="url" 
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-harmony-navy/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-harmony-cyan transition-all"
                  />
                  <Image className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-center text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-harmony-slate to-harmony-cyan text-harmony-darkBg font-bold py-3 rounded-xl text-center text-sm shadow-lg shadow-harmony-cyan/15 hover:shadow-harmony-cyan/35 transition-all"
                >
                  {editingItem ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
