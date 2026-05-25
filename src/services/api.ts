import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type {
  RegisterPayload,
  LoginPayload,
  RefreshPayload,
  LogoutPayload,
  UpdatePasswordPayload,
  AuthResponse,
  RefreshResponse,
  MeResponse,
  LogoutResponse,
} from './types/auth';

// ── Base URL ───────────────────────────────────────────────
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  'https://advance-ims-inventory-management-system.onrender.com';

// ── Axios Instance ─────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Request Interceptor (attach token) ────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// ── Response Interceptor (handle token expiry) ────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // If 401 and not already retried → try refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await api.post<RefreshResponse>('/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        // Refresh failed → clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────
// 1. AUTH  (/api/auth)
// ─────────────────────────────────────────────────────────
export const authAPI = {
  register:  (data: RegisterPayload)  => api.post<AuthResponse>('/auth/register', data),
  login:     (data: LoginPayload)     => api.post<AuthResponse>('/auth/login', data),
  refresh:   (data: RefreshPayload)   => api.post<RefreshResponse>('/auth/refresh', data),
  me:        ()                       => api.get<MeResponse>('/auth/me'),
  logout:    (data: LogoutPayload)    => api.post<LogoutResponse>('/auth/logout', data),
};

// ─────────────────────────────────────────────────────────
// 2. USERS  (/api/users)
// ─────────────────────────────────────────────────────────
export const usersAPI = {
  getAll:         (params?: object)                    => api.get('/users', { params }),
  getById:        (id: string)                         => api.get(`/users/${id}`),
  update:         (id: string, data: object)           => api.put(`/users/${id}`, data),
  updateStatus:   (id: string, status: string)         => api.patch(`/users/${id}/status`, { status }),
  delete:         (id: string)                         => api.delete(`/users/${id}`),
  getPasswordPolicy: ()                                => api.get('/users/me/password'),
  updatePassword: (data: UpdatePasswordPayload)        => api.put('/users/me/password', data),
};

// ─────────────────────────────────────────────────────────
// 3. PRODUCTS  (/api/products)
// ─────────────────────────────────────────────────────────
export const productsAPI = {
  getAll:     (params?: object)           => api.get('/products', { params }),
  getById:    (id: string)                => api.get(`/products/${id}`),
  create:     (data: object)              => api.post('/products', data),
  update:     (id: string, data: object)  => api.put(`/products/${id}`, data),
  delete:     (id: string)               => api.delete(`/products/${id}`),
  updateStock:(id: string, data: object)  => api.patch(`/products/${id}/stock`, data),
};

// ─────────────────────────────────────────────────────────
// 4. CATEGORIES  (/api/categories)
// ─────────────────────────────────────────────────────────
export const categoriesAPI = {
  getAll:  (params?: object)           => api.get('/categories', { params }),
  getById: (id: string)                => api.get(`/categories/${id}`),
  create:  (data: object)              => api.post('/categories', data),
  update:  (id: string, data: object)  => api.put(`/categories/${id}`, data),
  delete:  (id: string)               => api.delete(`/categories/${id}`),
};

// ─────────────────────────────────────────────────────────
// 5. ORDERS  (/api/orders)
// ─────────────────────────────────────────────────────────
export const ordersAPI = {
  getAll:        (params?: object)           => api.get('/orders', { params }),
  getById:       (id: string)                => api.get(`/orders/${id}`),
  create:        (data: object)              => api.post('/orders', data),
  update:        (id: string, data: object)  => api.put(`/orders/${id}`, data),
  updateStatus:  (id: string, status: string)=> api.patch(`/orders/${id}/status`, { status }),
  delete:        (id: string)               => api.delete(`/orders/${id}`),
};

// ─────────────────────────────────────────────────────────
// 6. CUSTOMERS  (/api/customers)
// ─────────────────────────────────────────────────────────
export const customersAPI = {
  getAll:  (params?: object)           => api.get('/customers', { params }),
  getById: (id: string)                => api.get(`/customers/${id}`),
  create:  (data: object)              => api.post('/customers', data),
  update:  (id: string, data: object)  => api.put(`/customers/${id}`, data),
  delete:  (id: string)               => api.delete(`/customers/${id}`),
};

// ─────────────────────────────────────────────────────────
// 7. RIDERS  (/api/riders)
// ─────────────────────────────────────────────────────────
export const ridersAPI = {
  getAll:        (params?: object)            => api.get('/riders', { params }),
  getById:       (id: string)                 => api.get(`/riders/${id}`),
  create:        (data: object)               => api.post('/riders', data),
  update:        (id: string, data: object)   => api.put(`/riders/${id}`, data),
  updateStatus:  (id: string, data: object)   => api.patch(`/riders/${id}/status`, data),
  delete:        (id: string)                => api.delete(`/riders/${id}`),
};

// ─────────────────────────────────────────────────────────
// 8. COURIERS  (/api/couriers)
// ─────────────────────────────────────────────────────────
export const couriersAPI = {
  getAll:  (params?: object)           => api.get('/couriers', { params }),
  getById: (id: string)                => api.get(`/couriers/${id}`),
  create:  (data: object)              => api.post('/couriers', data),
  update:  (id: string, data: object)  => api.put(`/couriers/${id}`, data),
  delete:  (id: string)               => api.delete(`/couriers/${id}`),
};

// ─────────────────────────────────────────────────────────
// 9. SHIPMENTS  (/api/shipments)
// ─────────────────────────────────────────────────────────
export const shipmentsAPI = {
  getAll:        (params?: object)           => api.get('/shipments', { params }),
  getById:       (id: string)                => api.get(`/shipments/${id}`),
  create:        (data: object)              => api.post('/shipments', data),
  update:        (id: string, data: object)  => api.put(`/shipments/${id}`, data),
  updateStatus:  (id: string, data: object)  => api.patch(`/shipments/${id}/status`, data),
  delete:        (id: string)               => api.delete(`/shipments/${id}`),
};

// ─────────────────────────────────────────────────────────
// 10. SUPPLIERS  (/api/suppliers)
// ─────────────────────────────────────────────────────────
export const suppliersAPI = {
  getAll:  (params?: object)           => api.get('/suppliers', { params }),
  getById: (id: string)                => api.get(`/suppliers/${id}`),
  create:  (data: object)              => api.post('/suppliers', data),
  update:  (id: string, data: object)  => api.put(`/suppliers/${id}`, data),
  delete:  (id: string)               => api.delete(`/suppliers/${id}`),
};

// ─────────────────────────────────────────────────────────
// 11. EXPENSES  (/api/expenses)
// ─────────────────────────────────────────────────────────
export const expensesAPI = {
  getAll:  (params?: object)           => api.get('/expenses', { params }),
  getById: (id: string)                => api.get(`/expenses/${id}`),
  create:  (data: object)              => api.post('/expenses', data),
  update:  (id: string, data: object)  => api.put(`/expenses/${id}`, data),
  delete:  (id: string)               => api.delete(`/expenses/${id}`),
};

// ─────────────────────────────────────────────────────────
// 12. SUPPLIER PAYMENTS  (/api/supplier-payments)
// ─────────────────────────────────────────────────────────
export const supplierPaymentsAPI = {
  getAll:  (params?: object)           => api.get('/supplier-payments', { params }),
  getById: (id: string)                => api.get(`/supplier-payments/${id}`),
  create:  (data: object)              => api.post('/supplier-payments', data),
  update:  (id: string, data: object)  => api.put(`/supplier-payments/${id}`, data),
  delete:  (id: string)               => api.delete(`/supplier-payments/${id}`),
};

// ─────────────────────────────────────────────────────────
// 13. TASKS  (/api/tasks)
// ─────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll:        (params?: object)           => api.get('/tasks', { params }),
  getById:       (id: string)                => api.get(`/tasks/${id}`),
  create:        (data: object)              => api.post('/tasks', data),
  update:        (id: string, data: object)  => api.put(`/tasks/${id}`, data),
  updateStatus:  (id: string, status: string)=> api.patch(`/tasks/${id}/status`, { status }),
  delete:        (id: string)               => api.delete(`/tasks/${id}`),
};

// ─────────────────────────────────────────────────────────
// 14. STOCK  (/api/stock)
// ─────────────────────────────────────────────────────────
export const stockAPI = {
  getLogs:    (params?: object)  => api.get('/stock/logs', { params }),
  adjust:     (data: object)     => api.post('/stock/adjust', data),
  getLowStock:()                 => api.get('/stock/low-stock'),
};

// ─────────────────────────────────────────────────────────
// 15. NOTIFICATIONS  (/api/notifications)
// ─────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll:    (params?: object)  => api.get('/notifications', { params }),
  markRead:  (id: string)       => api.patch(`/notifications/${id}/read`),
  markAllRead: ()               => api.patch('/notifications/read-all'),
  delete:    (id: string)       => api.delete(`/notifications/${id}`),
};

// ─────────────────────────────────────────────────────────
// 16. ANALYTICS  (/api/analytics)
// ─────────────────────────────────────────────────────────
export const analyticsAPI = {
  getDashboard: (params?: object) => api.get('/analytics/dashboard', { params }),
  getSales:     (params?: object) => api.get('/analytics/sales', { params }),
  getInventory: (params?: object) => api.get('/analytics/inventory', { params }),
};

// ─────────────────────────────────────────────────────────
// 17. INTEGRATIONS  (/api/integrations)
// ─────────────────────────────────────────────────────────
export const integrationsAPI = {
  getStatus:          ()             => api.get('/integrations/status'),
  // Shopify
  testShopify:        ()             => api.post('/integrations/shopify/test'),
  syncShopifyOrders:  ()             => api.post('/integrations/shopify/sync-orders'),
  getShopifyConfig:   ()             => api.get('/integrations/shopify/config'),
  updateShopifyConfig:(data: object) => api.put('/integrations/shopify/config', data),
  // AfterShip
  testAfterShip:      ()             => api.post('/integrations/aftership/test'),
  getAfterShipStatus: ()             => api.get('/integrations/aftership/status'),
  getAfterShipConfig: ()             => api.get('/integrations/aftership/config'),
  updateAfterShipConfig:(data:object)=> api.put('/integrations/aftership/config', data),
};

// ─────────────────────────────────────────────────────────
// 18. TRACKING MORE  (/api/trackingmore)
// ─────────────────────────────────────────────────────────
export const trackingAPI = {
  getStatus:      ()                                       => api.get('/trackingmore/status'),
  getCouriers:    (keyword?: string)                       => api.get('/trackingmore/couriers', { params: { keyword } }),
  detectCourier:  (trackingNumber: string)                 => api.post('/trackingmore/couriers/detect', { trackingNumber }),
  getTrackings:   (params?: object)                        => api.get('/trackingmore/trackings', { params }),
  createTracking: (data: object)                           => api.post('/trackingmore/trackings', data),
  getTracking:    (courierCode: string, trackingNumber: string) => api.get(`/trackingmore/trackings/${courierCode}/${trackingNumber}`),
  deleteTracking: (courierCode: string, trackingNumber: string) => api.delete(`/trackingmore/trackings/${courierCode}/${trackingNumber}`),
  sync:           ()                                       => api.post('/trackingmore/sync'),
};

// ─────────────────────────────────────────────────────────
// Token Helpers  (use these in your components)
// ─────────────────────────────────────────────────────────
export const tokenHelper = {
  save:  (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clear: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  getAccess:  () => localStorage.getItem('accessToken'),
  getRefresh: () => localStorage.getItem('refreshToken'),
};

export default api;