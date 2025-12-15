import $ from 'jquery';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Configure jQuery AJAX defaults
$.ajaxSetup({
  contentType: 'application/json',
  headers: {
    'Accept': 'application/json',
  },
});

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set auth header for requests
const authHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`,
});

// API wrapper with promise
const apiRequest = (method, url, data = null, options = {}) => {
  return new Promise((resolve, reject) => {
    const config = {
      method,
      url: `${API_URL}${url}`,
      headers: {
        ...authHeaders(),
        ...options.headers,
      },
      success: (response) => resolve(response),
      error: (xhr) => {
        const error = xhr.responseJSON || { message: 'An error occurred' };
        if (xhr.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        reject(error);
      },
    };

    if (data) {
      if (options.isFormData) {
        config.data = data;
        config.processData = false;
        config.contentType = false;
        delete config.headers['Content-Type'];
      } else {
        config.data = JSON.stringify(data);
      }
    }

    $.ajax(config);
  });
};

// Auth API
export const authApi = {
  login: (email, password) => apiRequest('POST', '/login', { email, password }),
  register: (data) => apiRequest('POST', '/register', data),
  logout: () => apiRequest('POST', '/logout'),
  getUser: () => apiRequest('GET', '/user'),
  forgotPassword: (email) => apiRequest('POST', '/forgot-password', { email }),
  resetPassword: (data) => apiRequest('POST', '/reset-password', data),
  resendVerification: () => apiRequest('POST', '/email/resend'),
};

// Tickets API
export const ticketsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest('GET', `/tickets${query ? `?${query}` : ''}`);
  },
  getOne: (id) => apiRequest('GET', `/tickets/${id}`),
  create: (data) => apiRequest('POST', '/tickets', data),
  update: (id, data) => apiRequest('PUT', `/tickets/${id}`, data),
  delete: (id) => apiRequest('DELETE', `/tickets/${id}`),
  assign: (id, assignedTo) => apiRequest('POST', `/tickets/${id}/assign`, { assigned_to: assignedTo }),
  getStats: () => apiRequest('GET', '/tickets/stats'),
  getStaff: () => apiRequest('GET', '/staff'),
};

// Messages API
export const messagesApi = {
  getAll: (ticketId) => apiRequest('GET', `/tickets/${ticketId}/messages`),
  send: (ticketId, content, files = [], urls = []) => {
    if ((files && files.length > 0) || (urls && urls.length > 0)) {
      const formData = new FormData();
      formData.append('content', content || '');
      if (files && files.length > 0) {
        files.forEach((file) => formData.append('attachments[]', file));
      }
      if (urls && urls.length > 0) {
        urls.forEach((url) => formData.append('urls[]', url));
      }
      return apiRequest('POST', `/tickets/${ticketId}/messages`, formData, { isFormData: true });
    }
    return apiRequest('POST', `/tickets/${ticketId}/messages`, { content });
  },
  update: (ticketId, messageId, content) => apiRequest('PUT', `/tickets/${ticketId}/messages/${messageId}`, { content }),
  delete: (ticketId, messageId) => apiRequest('DELETE', `/tickets/${ticketId}/messages/${messageId}`),
  markAsRead: (ticketId) => apiRequest('POST', `/tickets/${ticketId}/messages/read`),
  getUnreadCount: () => apiRequest('GET', '/messages/unread-count'),
  getDownloadUrl: (path) => `${API_URL}/download/${path}`,
};

// Users API
export const usersApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest('GET', `/users${query ? `?${query}` : ''}`);
  },
  getOne: (id) => apiRequest('GET', `/users/${id}`),
  create: (data) => apiRequest('POST', '/users', data),
  update: (id, data) => apiRequest('PUT', `/users/${id}`, data),
  delete: (id) => apiRequest('DELETE', `/users/${id}`),
  getRoles: () => apiRequest('GET', '/roles'),
  updateProfilePicture: (formData) => apiRequest('POST', '/profile/picture', formData, { isFormData: true }),
};

export default {
  auth: authApi,
  tickets: ticketsApi,
  messages: messagesApi,
  users: usersApi,
};
