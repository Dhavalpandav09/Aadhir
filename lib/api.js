import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin-login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginAdmin  = (password) => api.post('/auth/login', { password });
export const verifyToken = ()          => api.get('/auth/verify');

// Photos
export const getPhotos   = (params)     => api.get('/photos',       { params });
export const createPhoto = (fd)         => api.post('/photos',      fd);
export const updatePhoto = (id, fd)     => api.put(`/photos/${id}`, fd);
export const deletePhoto = (id)         => api.delete(`/photos/${id}`);

// Projects
export const getProjects     = (params) => api.get('/projects',            { params });
export const getAllProjects   = (params) => api.get('/projects/admin/all',  { params });
export const getProjectById  = (id)     => api.get(`/projects/${id}`);
export const createProject   = (fd)     => api.post('/projects',           fd);
export const updateProject   = (id, fd) => api.put(`/projects/${id}`,      fd);
export const deleteProject   = (id)     => api.delete(`/projects/${id}`);

// Enquiries
export const submitEnquiry  = (data)     => api.post('/enquiries',         data);
export const getEnquiries   = (params)   => api.get('/enquiries',          { params });
export const updateEnquiry  = (id, data) => api.patch(`/enquiries/${id}`,  data);
export const deleteEnquiry  = (id)       => api.delete(`/enquiries/${id}`);

// Stats
export const getStats = () => api.get('/stats');

export default api;
