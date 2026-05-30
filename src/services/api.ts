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
  register: (data: RegisterPayload) => api.post<AuthResponse>('/auth/register', data),
  login:    (data: LoginPayload)    => api.post<AuthResponse>('/auth/login', data),
  refresh:  (data: RefreshPayload)  => api.post<RefreshResponse>('/auth/refresh', data),
  me:       ()                      => api.get<MeResponse>('/auth/me'),
  logout:   (data: LogoutPayload)   => api.post<LogoutResponse>('/auth/logout', data),
};

// ─────────────────────────────────────────────────────────
// 2. USERS  (/api/users)
// ─────────────────────────────────────────────────────────
export const usersAPI = {
  getAll:            (params?: object)               => api.get('/users', { params }),
  getById:           (id: string)                    => api.get(`/users/${id}`),
  update:            (id: string, data: object)      => api.put(`/users/${id}`, data),
  updateStatus:      (id: string, status: string)    => api.patch(`/users/${id}/status`, { status }),
  delete:            (id: string)                    => api.delete(`/users/${id}`),
  getPasswordPolicy: ()                              => api.get('/users/me/password'),
  updatePassword:    (data: UpdatePasswordPayload)   => api.put('/users/me/password', data),
};

// ─────────────────────────────────────────────────────────
// 3. PRODUCTS  (/api/products)
// ─────────────────────────────────────────────────────────
export const productsAPI = {
  getAll:      (params?: object)          => api.get('/products', { params }),
  getById:     (id: string)               => api.get(`/products/${id}`),
  create:      (data: object)             => api.post('/products', data),
  update:      (id: string, data: object) => api.put(`/products/${id}`, data),
  delete:      (id: string)               => api.delete(`/products/${id}`),
  updateStock: (id: string, data: object) => api.patch(`/products/${id}/stock`, data),
  toggleStatus:(id: string)               => api.patch(`/products/${id}/productStatus`),
  // Variants
  addVariant:    (id: string, data: object)                    => api.post(`/products/${id}/variants`, data),
  updateVariant: (id: string, variantId: string, data: object) => api.put(`/products/${id}/variants/${variantId}`, data),
  deleteVariant: (id: string, variantId: string)               => api.delete(`/products/${id}/variants/${variantId}`),
  getVariantStock:(id: string, variantId: string, params?: object) => api.get(`/products/${id}/variants/${variantId}/stock`, { params }),
  // Images
  uploadImages:  (id: string, formData: FormData) => api.post(`/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage:   (id: string, index: number)      => api.delete(`/products/${id}/images/${index}`),
};

// ─────────────────────────────────────────────────────────
// 4. CATEGORIES  (/api/categories)
// ─────────────────────────────────────────────────────────
export const categoriesAPI = {
  getAll:  (params?: object)          => api.get('/categories', { params }),
  getTree: ()                         => api.get('/categories/tree'),
  getById: (id: string)               => api.get(`/categories/${id}`),
  create:  (data: object)             => api.post('/categories', data),
  update:  (id: string, data: object) => api.put(`/categories/${id}`, data),
  delete:  (id: string, data?: object)=> api.delete(`/categories/${id}`, { data }),
};

// ─────────────────────────────────────────────────────────
// 5. ORDERS  (/api/orders)
// ─────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  customer: string;
  source: 'WhatsApp' | 'Shopify' | 'Manual' | 'Instagram' | 'Website';
  items: Array<{
    productId: string;
    variantId?: string;
    quantity: number;
    unitPrice?: number;
  }>;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  paymentMethod: 'COD' | 'Prepaid' | 'Card' | 'BankTransfer' | 'Wallet';
  shippingCost?: number;
  discount?: number;
  notes?: string;
}

export interface UpdateOrderPayload {
  shippingAddress?: Partial<CreateOrderPayload['shippingAddress']>;
  discount?: number;
  notes?: string;
}

export interface FulfillOrderPayload {
  courier: string;
  rider?: string;
  notes?: string;
}

export interface AddOrderItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
  unitPrice?: number;
}

export const ordersAPI = {
  getAll:        (params?: object)                    => api.get('/orders', { params }),
  getById:       (id: string)                         => api.get(`/orders/${id}`),
  create:        (data: CreateOrderPayload)           => api.post('/orders', data),
  update:        (id: string, data: UpdateOrderPayload) => api.put(`/orders/${id}`, data),
  delete:        (id: string, reason?: string)        => api.delete(`/orders/${id}`, { data: reason ? { reason } : undefined }),
  updateStatus:  (id: string, status: string, notes?: string) =>
    api.patch(`/orders/${id}/status`, { status, ...(notes ? { notes } : {}) }),
  updatePayment: (id: string, paymentStatus: string, notes?: string) =>
    api.patch(`/orders/${id}/payment`, { paymentStatus, ...(notes ? { notes } : {}) }),
  updateDelivery: (id: string, deliveryStatus: string, trackingNumber?: string) =>
    api.patch(`/orders/${id}/delivery`, { deliveryStatus, ...(trackingNumber ? { trackingNumber } : {}) }),
  fulfill:    (id: string, data: FulfillOrderPayload)          => api.post(`/orders/${id}/fulfill`, data),
  addItem:    (id: string, data: AddOrderItemPayload)          => api.post(`/orders/${id}/items`, data),
  updateItem: (id: string, itemId: string, data: { quantity?: number; unitPrice?: number }) =>
    api.put(`/orders/${id}/items/${itemId}`, data),
  removeItem: (id: string, itemId: string)                     => api.delete(`/orders/${id}/items/${itemId}`),
};

// ─────────────────────────────────────────────────────────
// 6. CUSTOMERS  (/api/customers)
// ─────────────────────────────────────────────────────────
export const customersAPI = {
  getAll:       (params?: object)          => api.get('/customers', { params }),
  getById:      (id: string)               => api.get(`/customers/${id}`),
  create:       (data: object)             => api.post('/customers', data),
  update:       (id: string, data: object) => api.put(`/customers/${id}`, data),
  delete:       (id: string)               => api.delete(`/customers/${id}`),
  updateSegment:(id: string, segment: string, reason?: string) =>
    api.patch(`/customers/${id}/segment`, { segment, ...(reason ? { reason } : {}) }),
  getOrders:    (id: string, params?: object) => api.get(`/customers/${id}/orders`, { params }),
  getSegmentAnalytics: ()                  => api.get('/customers/analytics/segments'),
};

// ─────────────────────────────────────────────────────────
// 7. RIDERS  (/api/riders)
// ─────────────────────────────────────────────────────────
export const ridersAPI = {
  getAll:       (params?: object)           => api.get('/riders', { params }),
  getById:      (id: string)                => api.get(`/riders/${id}`),
  create:       (data: object)              => api.post('/riders', data),
  update:       (id: string, data: object)  => api.put(`/riders/${id}`, data),
  updateStatus: (id: string, data: object)  => api.patch(`/riders/${id}/status`, data),
  delete:       (id: string)               => api.delete(`/riders/${id}`),
};

// ─────────────────────────────────────────────────────────
// 8. COURIERS  (/api/couriers)
// ─────────────────────────────────────────────────────────
export const couriersAPI = {
  getAll:  (params?: object)          => api.get('/couriers', { params }),
  getById: (id: string)               => api.get(`/couriers/${id}`),
  create:  (data: object)             => api.post('/couriers', data),
  update:  (id: string, data: object) => api.put(`/couriers/${id}`, data),
  delete:  (id: string)               => api.delete(`/couriers/${id}`),
};

// ─────────────────────────────────────────────────────────
// 9. SHIPMENTS  (/api/shipments)
// ─────────────────────────────────────────────────────────
export const shipmentsAPI = {
  getAll:       (params?: object)          => api.get('/shipments', { params }),
  getById:      (id: string)               => api.get(`/shipments/${id}`),
  create:       (data: object)             => api.post('/shipments', data),
  update:       (id: string, data: object) => api.put(`/shipments/${id}`, data),
  updateStatus: (id: string, data: object) => api.patch(`/shipments/${id}/status`, data),
  delete:       (id: string)              => api.delete(`/shipments/${id}`),
};

// ─────────────────────────────────────────────────────────
// 10. SUPPLIERS  (/api/suppliers)
// ─────────────────────────────────────────────────────────
export const suppliersAPI = {
  getAll:         (params?: object)          => api.get('/suppliers', { params }),
  getById:        (id: string)               => api.get(`/suppliers/${id}`),
  getProducts:    (id: string, params?: object) => api.get(`/suppliers/${id}/products`, { params }),
  create:         (data: object)             => api.post('/suppliers', data),
  update:         (id: string, data: object) => api.put(`/suppliers/${id}`, data),
  delete:         (id: string)              => api.delete(`/suppliers/${id}`),
  // ── NEW: balance adjustment (PATCH /api/suppliers/:id/balance) ──
  adjustBalance:  (id: string, data: {
    adjustment: number;
    adjustmentType: 'credit' | 'debit';
    reason: string;
    reference?: string;
  }) => api.patch(`/suppliers/${id}/balance`, data),
  // ── NEW: payments sub-resource (/api/suppliers/:id/payments) ──
  getPayments:    (id: string, params?: object) => api.get(`/suppliers/${id}/payments`, { params }),
  getPaymentById: (id: string, paymentId: string) => api.get(`/suppliers/${id}/payments/${paymentId}`),
  recordPayment:  (id: string, data: object)   => api.post(`/suppliers/${id}/payments`, data),
  voidPayment:    (id: string, paymentId: string, reason: string) =>
    api.patch(`/suppliers/${id}/payments/${paymentId}/void`, { reason }),
  // ── NEW: outstanding summary (/api/suppliers/payments/summary) ──
  getPaymentsSummary: (params?: object) => api.get('/suppliers/payments/summary', { params }),
};

// ─────────────────────────────────────────────────────────
// 11. EXPENSES  (/api/expenses)
// ─────────────────────────────────────────────────────────
export const expensesAPI = {
  getAll:     (params?: object)          => api.get('/expenses', { params }),
  getById:    (id: string)               => api.get(`/expenses/${id}`),
  create:     (data: object)             => api.post('/expenses', data),
  update:     (id: string, data: object) => api.put(`/expenses/${id}`, data),
  delete:     (id: string, reason?: string) =>
    api.delete(`/expenses/${id}`, { data: reason ? { reason } : undefined }),
  // ── NEW: categories & analytics ──
  getCategories: ()                      => api.get('/expenses/categories'),
  getAnalytics:  (params?: object)       => api.get('/expenses/analytics/summary', { params }),
};

// ─────────────────────────────────────────────────────────
// 12. SUPPLIER PAYMENTS  (/api/supplier-payments)
// NOTE: These are the old flat endpoints. Prefer suppliersAPI.recordPayment
//       for the nested route. Keep for backward compat if used elsewhere.
// ─────────────────────────────────────────────────────────
export const supplierPaymentsAPI = {
  getAll:  (params?: object)          => api.get('/supplier-payments', { params }),
  getById: (id: string)               => api.get(`/supplier-payments/${id}`),
  create:  (data: object)             => api.post('/supplier-payments', data),
  update:  (id: string, data: object) => api.put(`/supplier-payments/${id}`, data),
  delete:  (id: string)              => api.delete(`/supplier-payments/${id}`),
};

// ─────────────────────────────────────────────────────────
// 13. TASKS  (/api/tasks)
// ─────────────────────────────────────────────────────────
export const tasksAPI = {
  getAll:       (params?: object)             => api.get('/tasks', { params }),
  getById:      (id: string)                  => api.get(`/tasks/${id}`),
  create:       (data: object)                => api.post('/tasks', data),
  update:       (id: string, data: object)    => api.put(`/tasks/${id}`, data),
  updateStatus: (id: string, status: string, completionNote?: string) =>
    api.patch(`/tasks/${id}/status`, { status, ...(completionNote ? { completionNote } : {}) }),
  delete:       (id: string, reason?: string) =>
    api.delete(`/tasks/${id}`, { data: reason ? { reason } : undefined }),
  // ── NEW: my tasks & stats ──
  getMy:   (params?: object) => api.get('/tasks/my', { params }),
  getStats:(params?: object) => api.get('/tasks/stats', { params }),
};

// ─────────────────────────────────────────────────────────
// 14. STOCK  (/api/stock)
// ─────────────────────────────────────────────────────────
export const stockAPI = {
  getAll:      (params?: object) => api.get('/stock', { params }),
  getLowStock: (params?: object) => api.get('/stock/low', { params }),
  getLogs:     (params?: object) => api.get('/stock/logs', { params }),
  adjust:      (data: object)    => api.post('/stock/adjust', data),
  // ── NEW: full history & analytics ──
  getHistory:  (params?: object) => api.get('/stock/history', { params }),
  getAnalytics:(params?: object) => api.get('/stock/analytics', { params }),
};

// ─────────────────────────────────────────────────────────
// 15. NOTIFICATIONS  (/api/notifications)
// ─────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll:         (params?: object) => api.get('/notifications', { params }),
  getUnreadCount: ()                => api.get('/notifications/unread-count'),
  markRead:       (id: string)      => api.patch(`/notifications/${id}/read`),
  markAllRead:    ()                => api.patch('/notifications/read-all'),
  delete:         (id: string)      => api.delete(`/notifications/${id}`),
};

// ─────────────────────────────────────────────────────────
// 16. ANALYTICS  (/api/analytics)
// ─────────────────────────────────────────────────────────
export const analyticsAPI = {
  getDashboard:          (params?: object) => api.get('/analytics/dashboard', { params }),
  getTrends:             ()                => api.get('/analytics/trends'),
  getSales:              (params?: object) => api.get('/analytics/sales', { params }),
  getInventory:          (params?: object) => api.get('/analytics/inventory', { params }),
  getFinancial:          (params?: object) => api.get('/analytics/financial', { params }),
  getOrders:             (params?: object) => api.get('/analytics/orders', { params }),
  getProducts:           (params?: object) => api.get('/analytics/products', { params }),
  getCustomers:          (params?: object) => api.get('/analytics/customers', { params }),
  getCourierPerformance: (params?: object) => api.get('/analytics/courier-performance', { params }),
  getStaffPerformance:   (params?: object) => api.get('/analytics/staff-performance', { params }),
  exportReport: (report: string, params?: object) =>
    api.get('/analytics/export', { params: { report, ...params }, responseType: 'blob' }),
};

// ─────────────────────────────────────────────────────────
// 17. INTEGRATIONS  (/api/integrations)
// ─────────────────────────────────────────────────────────
export const integrationsAPI = {
  getStatus:            ()             => api.get('/integrations/status'),
  // Shopify
  testShopify:          ()             => api.post('/integrations/shopify/test'),
  syncShopifyOrders:    ()             => api.post('/integrations/shopify/sync-orders'),
  getShopifyConfig:     ()             => api.get('/integrations/shopify/config'),
  updateShopifyConfig:  (data: object) => api.put('/integrations/shopify/config', data),
  // ── NEW: Shopify inventory sync & products ──
  syncShopifyInventory: (productId?: string) =>
    api.post('/integrations/shopify/sync-inventory', productId ? { productId } : {}),
  getShopifyProducts:   ()             => api.get('/integrations/shopify/products'),
  // AfterShip
  testAfterShip:        ()             => api.post('/integrations/aftership/test'),
  getAfterShipStatus:   ()             => api.get('/integrations/aftership/status'),
  syncAfterShip:        ()             => api.post('/integrations/aftership/sync-tracking'),
  getAfterShipTracking: (trackingNumber: string) => api.get(`/integrations/aftership/tracking/${trackingNumber}`),
  getAfterShipConfig:   ()             => api.get('/integrations/aftership/config'),
  updateAfterShipConfig:(data: object) => api.put('/integrations/aftership/config', data),
};

// ─────────────────────────────────────────────────────────
// 18. TRACKING MORE  (/api/trackingmore)
// ─────────────────────────────────────────────────────────
export const trackingAPI = {
  getStatus:      ()                                            => api.get('/trackingmore/status'),
  test:           ()                                            => api.post('/trackingmore/test'),
  getConfig:      ()                                            => api.get('/trackingmore/config'),
  getCouriers:    (keyword?: string)                            => api.get('/trackingmore/couriers', { params: { keyword } }),
  detectCourier:  (trackingNumber: string)                      => api.post('/trackingmore/couriers/detect', { trackingNumber }),
  getTrackings:   (params?: object)                             => api.get('/trackingmore/trackings', { params }),
  createTracking: (data: object)                                => api.post('/trackingmore/trackings', data),
  getTracking:    (courierCode: string, trackingNumber: string) => api.get(`/trackingmore/trackings/${courierCode}/${trackingNumber}`),
  deleteTracking: (courierCode: string, trackingNumber: string) => api.delete(`/trackingmore/trackings/${courierCode}/${trackingNumber}`),
  sync:           ()                                            => api.post('/trackingmore/sync'),
};

// ─────────────────────────────────────────────────────────
// Token Helpers
// ─────────────────────────────────────────────────────────
export const tokenHelper = {
  save:       (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clear:      () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  getAccess:  () => localStorage.getItem('accessToken'),
  getRefresh: () => localStorage.getItem('refreshToken'),
};

export default api;