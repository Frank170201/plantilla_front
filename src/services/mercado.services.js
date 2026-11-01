import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_VUE_APP_API_URL || 'http://localhost:8000/api', timeout: 15000 });
api.interceptors.request.use((config) => {
  if (!config.url.startsWith('/public/')) {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default {
  commerces: () => api.get('/mercado/comercios'),
  createCommerce: (body) => api.post('/mercado/comercios', body),
  products: (commerce) => api.get(`/mercado/comercios/${commerce}/productos`),
  createProduct: (commerce, body) => api.post(`/mercado/comercios/${commerce}/productos`, body),
  updateProduct: (commerce, product, body) => api.put(`/mercado/comercios/${commerce}/productos/${product}`, body),
  move: (commerce, product, body) => api.post(`/mercado/comercios/${commerce}/productos/${product}/movimientos`, body),
  history: (commerce, product) => api.get(`/mercado/comercios/${commerce}/productos/${product}/movimientos`),
  catalog: (page = 1, filters = {}) => api.get('/public/mercado/productos', { params: { page, ...filters } }),
  categories: () => api.get('/public/mercado/categorias'),
};
