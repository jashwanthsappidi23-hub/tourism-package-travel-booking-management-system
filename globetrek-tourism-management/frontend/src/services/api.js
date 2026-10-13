const BASE_URL = '/api';

export const api = {
  getToken() {
    return localStorage.getItem('bharatyatra_token');
  },

  setToken(token) {
    if (token) localStorage.setItem('bharatyatra_token', token);
    else localStorage.removeItem('bharatyatra_token');
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    const config = {
      ...options,
      headers
    };

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, config);
      if (res.status === 204) return null;

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || data.message || 'An unexpected error occurred');
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  },

  // Auth
  login: (credentials) => api.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload) => api.request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => api.request('/auth/me'),
  demoLogin: (role) => api.request(`/auth/demo-login/${role}`, { method: 'POST' }),
  resetPassword: (data) => api.request('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),

  // Destinations
  getDestinations: (params = '') => api.request(`/destinations${params ? '?' + params : ''}`),
  getDestination: (id) => api.request(`/destinations/${id}`),
  createDestination: (data) => api.request('/destinations', { method: 'POST', body: JSON.stringify(data) }),
  updateDestination: (id, data) => api.request(`/destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDestination: (id) => api.request(`/destinations/${id}`, { method: 'DELETE' }),

  // Packages
  getPackages: (params = '') => api.request(`/packages${params ? '?' + params : ''}`),
  getPackage: (idOrSlug) => api.request(`/packages/${idOrSlug}`),
  createPackage: (data) => api.request('/packages', { method: 'POST', body: JSON.stringify(data) }),
  updatePackage: (id, data) => api.request(`/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePackage: (id) => api.request(`/packages/${id}`, { method: 'DELETE' }),

  // Itineraries
  getPackageItinerary: (pkgId) => api.request(`/itineraries/package/${pkgId}`),
  addItineraryDay: (data) => api.request('/itineraries', { method: 'POST', body: JSON.stringify(data) }),
  deleteItineraryDay: (id) => api.request(`/itineraries/${id}`, { method: 'DELETE' }),

  // Departures
  getDepartures: (params = '') => api.request(`/departures${params ? '?' + params : ''}`),
  getDeparture: (id) => api.request(`/departures/${id}`),
  scheduleDeparture: (data) => api.request('/departures', { method: 'POST', body: JSON.stringify(data) }),
  updateDepartureStatus: (id, status) => api.request(`/departures/${id}/status?status_value=${status}`, { method: 'PUT' }),

  // Bookings
  createBooking: (data) => api.request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getMyBookings: () => api.request('/bookings/my-bookings'),
  getBookingByRef: (ref) => api.request(`/bookings/reference/${ref}`),
  getAllBookings: () => api.request('/bookings/all'),
  resendBookingEmail: (bookingId, email) => api.request(`/bookings/${bookingId}/send-email${email ? `?recipient_email=${encodeURIComponent(email)}` : ''}`, { method: 'POST' }),

  // Payments
  simulatePayment: (data) => api.request('/payments/simulate', { method: 'POST', body: JSON.stringify(data) }),
  getBookingPayment: (bookingId) => api.request(`/payments/booking/${bookingId}`),
  getAllPayments: () => api.request('/payments/all'),

  // Cancellations & Refunds
  requestCancellation: (data) => api.request('/cancellations', { method: 'POST', body: JSON.stringify(data) }),
  getAllCancellations: () => api.request('/cancellations/all'),
  getRefundStatus: (ref) => api.request(`/refunds/status/${ref}`),
  getAllRefunds: () => api.request('/refunds/all'),
  processRefund: (data) => api.request('/refunds/process', { method: 'PUT', body: JSON.stringify(data) }),

  // Guides
  getGuides: () => api.request('/guides'),
  getGuideSchedule: () => api.request('/guides/my-schedule'),
  checkGuideConflicts: () => api.request('/guides/conflicts'),

  // Resources
  getHotels: () => api.request('/resources/hotels'),
  getTransport: () => api.request('/resources/transport'),
  createTransport: (data) => api.request('/resources/transport', { method: 'POST', body: JSON.stringify(data) }),
  getCustomers: () => api.request('/resources/customers'),
  getCountries: () => api.request('/resources/countries'),
  getPackageCategories: () => api.request('/resources/categories'),
  updateProfile: (data) => api.request('/resources/customer/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Reports & Analytics
  getDashboardStats: () => api.request('/reports/dashboard-stats'),
  getAnalyticsCharts: () => api.request('/reports/analytics-charts'),
  runSQLQuery: (queryKey) => api.request(`/reports/run-query?query_key=${queryKey}`),
};
