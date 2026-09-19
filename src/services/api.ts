import { INITIAL_PRODUCTS } from '../data/products.ts';
import { Order, Product, StoreSettings, User } from '../types.ts';

const BASE_URL = '/api';

let memoryToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  memoryToken = token;
  try {
    if (token) {
      localStorage.setItem('zikala_jwt_token', token);
    } else {
      localStorage.removeItem('zikala_jwt_token');
    }
  } catch {
    // ignore local storage errors
  }
};

export const getAuthToken = (): string | null => {
  if (memoryToken) return memoryToken;
  try {
    return localStorage.getItem('zikala_jwt_token');
  } catch {
    return null;
  }
};

const getHeaders = (hasBody = false): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  setToken: setAuthToken,
  getToken: getAuthToken,

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);
      if (params?.minPrice) query.set('minPrice', params.minPrice.toString());
      if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString());
      if (params?.sort) query.set('sort', params.sort);

      const res = await fetch(`${BASE_URL}/products?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.products;
    } catch (err) {
      console.warn('API fetch products fallback to local data:', err);
      let list = [...INITIAL_PRODUCTS];
      if (params?.category && params.category !== 'All') {
        list = list.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      return list;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      return data.product;
    } catch {
      const found = INITIAL_PRODUCTS.find((p) => p.id === id);
      return found || null;
    }
  },

  async addProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add product');
    return data.product;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update product');
    return data.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete product');
    return data.success;
  },

  async addReview(
    productId: string,
    review: { userName: string; city: string; rating: number; comment: string }
  ): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(review),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit review');
    return data.product;
  },

  // Orders
  async createOrder(orderData: any): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to place order');
    return data.order;
  },

  async getOrders(email?: string): Promise<Order[]> {
    try {
      const url = email ? `${BASE_URL}/orders?email=${encodeURIComponent(email)}` : `${BASE_URL}/orders`;
      const res = await fetch(url, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      return data.orders;
    } catch (err) {
      console.warn('Fallback getOrders:', err);
      return [];
    }
  },

  async trackOrder(query: string): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/track/${encodeURIComponent(query.trim())}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Order not found');
    return data.order;
  },

  async updateOrderStatus(
    id: string,
    orderStatus: Order['orderStatus'],
    paymentStatus?: Order['paymentStatus']
  ): Promise<Order> {
    const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ orderStatus, paymentStatus }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update order');
    return data.order;
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    try {
      const res = await fetch(`${BASE_URL}/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      return data.settings;
    } catch {
      return {
        shippingFee: 450,
        freeShippingThreshold: 25000,
        codAvailable: true,
        easypaisaAccount: { title: 'ZIKALA LUXURY (PVT) LTD', number: '0300-8452910' },
        jazzcashAccount: { title: 'ZIKALA WATCHES OFFICIAL', number: '0321-4920184' },
        bankAccount: {
          bankName: 'Meezan Bank Limited (Islamic Banking)',
          title: 'ZIKALA HOROLOGY PAKISTAN',
          iban: 'PK42MEZN0001090284918290',
          accountNumber: '0109-0284918290',
        },
      };
    }
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await fetch(`${BASE_URL}/settings`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update settings');
    return data.settings;
  },

  // Stats (Admin)
  async getStats(): Promise<any> {
    const res = await fetch(`${BASE_URL}/stats`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch admin stats');
    return data;
  },

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    if (data.token) {
      setAuthToken(data.token);
    }
    return { user: data.user, token: data.token };
  },

  async register(name: string, email: string, phone: string, password: string): Promise<{ user: User; token?: string }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    if (data.token) {
      setAuthToken(data.token);
    }
    return { user: data.user, token: data.token };
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to verify session');
    return data.user;
  },

  async updateProfile(user: Partial<User>): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(user),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Profile update failed');
    return data.user;
  },
};
