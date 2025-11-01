import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// API methods
export const portfolioApi = {
    getAll: () => api.get('/portfolios'),
    getOne: (id: number) => api.get(`/portfolios/${id}`),
    create: (data: any) => api.post('/admin/portfolios', data),
    update: (id: number, data: any) => api.put(`/admin/portfolios/${id}`, data),
    delete: (id: number) => api.delete(`/admin/portfolios/${id}`),
};

export const certificateApi = {
    getAll: () => api.get('/certificates'),
    getOne: (id: number) => api.get(`/certificates/${id}`),
    create: (data: any) => api.post('/admin/certificates', data),
    update: (id: number, data: any) => api.put(`/admin/certificates/${id}`, data),
    delete: (id: number) => api.delete(`/admin/certificates/${id}`),
};

export const techStackApi = {
    getAll: () => api.get('/tech-stacks'),
    getOne: (id: number) => api.get(`/tech-stacks/${id}`),
    create: (data: any) => api.post('/admin/tech-stacks', data),
    update: (id: number, data: any) => api.put(`/admin/tech-stacks/${id}`, data),
    delete: (id: number) => api.delete(`/admin/tech-stacks/${id}`),
};

export const socialMediaApi = {
    getAll: () => api.get('/social-media'),
    getOne: (id: number) => api.get(`/social-media/${id}`),
    create: (data: any) => api.post('/admin/social-media', data),
    update: (id: number, data: any) => api.put(`/admin/social-media/${id}`, data),
    delete: (id: number) => api.delete(`/admin/social-media/${id}`),
};

export const contactApi = {
    send: (data: any) => api.post('/contact', data),
    create: (data: any) => api.post('/contact', data), // Alias for send
    getAll: () => api.get('/admin/contact-messages'),
    getOne: (id: number) => api.get(`/admin/contact-messages/${id}`),
    update: (id: number, data: any) => api.put(`/admin/contact-messages/${id}`, data),
    updateStatus: (id: number, status: string) =>
        api.put(`/admin/contact-messages/${id}`, { status }),
    delete: (id: number) => api.delete(`/admin/contact-messages/${id}`),
};

// Alias for backward compatibility
export const contactMessageApi = contactApi;

export const commentApi = {
    getAll: () => api.get('/comments'),
    create: (data: any) => api.post('/comments', data),
    like: (id: number) => api.post(`/comments/${id}/like`),
    reply: (id: number, data: any) => api.post(`/comments/${id}/reply`, data),
    update: (id: number, data: any) => api.put(`/admin/comments/${id}`, data),
    delete: (id: number) => api.delete(`/admin/comments/${id}`),
};

export const uploadApi = {
    uploadImage: (file: File, type: string) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', type);
        return api.post('/admin/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    uploadCommentPhoto: (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'comment');
        return api.post('/upload/comment-photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    uploadPdf: (file: File) => {
        const formData = new FormData();
        formData.append('pdf', file);
        return api.post('/admin/upload/pdf', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    deleteFile: (path: string) => api.delete('/admin/upload', { data: { path } }),
};

export default api;
