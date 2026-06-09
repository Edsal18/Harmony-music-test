const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('harmony_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Error HTTP: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  register: (email, password) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  // Items (Catalogo)
  getItems: ({ categoryId = '', search = '', limit = '', offset = '' } = {}) => {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit);
    if (offset) params.append('offset', offset);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/items${queryString}`);
  },
  getItemById: (id) => request(`/items/${id}`),
  createItem: (itemData) => request('/items', {
    method: 'POST',
    body: JSON.stringify(itemData),
  }),
  updateItem: (id, itemData) => request(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  }),
  deleteItem: (id) => request(`/items/${id}`, {
    method: 'DELETE',
  }),

  // Categories
  getCategories: () => request('/items/categories'),
};
