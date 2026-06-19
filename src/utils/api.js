const API_BASE = 'https://gsmgiri-adminpanel-server.onrender.com/api';

function getHeaders() {
  const token = localStorage.getItem('gsmgiri_auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }
  const data = await res.json();
  localStorage.setItem('gsmgiri_auth_token', data.token);
  return data.token;
}

export function logout() {
  localStorage.removeItem('gsmgiri_auth_token');
}

export async function verifyToken() {
  const token = localStorage.getItem('gsmgiri_auth_token');
  if (!token) return false;
  try {
    const res = await fetch(`${API_BASE}/verify`, { headers: getHeaders() });
    return res.ok;
  } catch {
    return false;
  }
}

// Services CRUD
export async function getServices() {
  const res = await fetch(`${API_BASE}/services`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load services');
  return res.json();
}

export async function createService(service) {
  const res = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(service)
  });
  if (!res.ok) throw new Error('Failed to create service');
  return res.json();
}

export async function updateService(id, service) {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(service)
  });
  if (!res.ok) throw new Error('Failed to update service');
  return res.json();
}

export async function deleteService(id) {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete service');
  return res.json();
}

// Orders CRUD
export async function getOrders() {
  const res = await fetch(`${API_BASE}/orders`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load orders');
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error('Failed to log order');
  return res.json();
}

export async function updateOrder(id, order) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error('Failed to update order');
  return res.json();
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete order');
  return res.json();
}



// Settings
export async function getSettings() {
  const res = await fetch(`${API_BASE}/settings`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load settings');
  return res.json();
}

export async function updateSettings(settings) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error('Failed to save settings');
  return res.json();
}

export async function resetDatabase() {
  const res = await fetch(`${API_BASE}/settings/reset`, {
    method: 'POST',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to reseed database');
  return res.json();
}

// Profile
export async function getProfile() {
  const res = await fetch(`${API_BASE}/profile`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load profile');
  return res.json();
}

export async function updateProfile(profileData) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(profileData)
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/profile/password`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ currentPassword, newPassword })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to change password');
  }
  return res.json();
}

// Banners CRUD
export async function getBanners() {
  const res = await fetch(`${API_BASE}/banners`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load banners');
  return res.json();
}

export async function createBanner(banner) {
  const res = await fetch(`${API_BASE}/banners`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(banner)
  });
  if (!res.ok) throw new Error('Failed to save banner');
  return res.json();
}

export async function deleteBanner(id) {
  const res = await fetch(`${API_BASE}/banners/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete banner');
  return res.json();
}

// Categories CRUD
export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}

export async function createCategory(category) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(category)
  });
  if (!res.ok) throw new Error('Failed to save category');
  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
}

// Users CRUD
export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export async function createUser(user) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
}

// Promo Columns API
export async function getPromoColumns() {
  const res = await fetch(`${API_BASE}/promo-columns`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load promo columns config');
  return res.json();
}

export async function updatePromoColumn(columnIndex, data) {
  const res = await fetch(`${API_BASE}/promo-columns/${columnIndex}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to save promo column header config');
  return res.json();
}

// B2B Clients CRUD
export async function getClients() {
  const res = await fetch(`${API_BASE}/clients`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load B2B clients');
  return res.json();
}

export async function createClient(client) {
  const res = await fetch(`${API_BASE}/clients`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(client)
  });
  if (!res.ok) throw new Error('Failed to create B2B client');
  return res.json();
}

export async function deleteClient(id) {
  const res = await fetch(`${API_BASE}/clients/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete B2B client');
  return res.json();
}

// Inquiries / Support tickets API
export async function getInquiries() {
  const res = await fetch(`${API_BASE}/inquiries`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load inquiries');
  return res.json();
}

export async function replyToInquiry(id, text) {
  const res = await fetch(`${API_BASE}/inquiries/${id}/reply`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to reply to support ticket');
  return res.json();
}

export async function updateInquiryStatus(id, status) {
  const res = await fetch(`${API_BASE}/inquiries/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update ticket status');
  return res.json();
}

// IMEI Service Products
export async function getImeiProducts() {
  const res = await fetch(`${API_BASE}/imei-products`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load IMEI products');
  return res.json();
}

export async function createImeiProduct(product) {
  const res = await fetch(`${API_BASE}/imei-products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to create IMEI product');
  return res.json();
}

export async function updateImeiProduct(id, product) {
  const res = await fetch(`${API_BASE}/imei-products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to update IMEI product');
  return res.json();
}

export async function deleteImeiProduct(id) {
  const res = await fetch(`${API_BASE}/imei-products/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete IMEI product');
  return res.json();
}

// Remote / Tool Rent Products
export async function getRemoteProducts() {
  const res = await fetch(`${API_BASE}/remote-products`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to load Remote products');
  return res.json();
}

export async function createRemoteProduct(product) {
  const res = await fetch(`${API_BASE}/remote-products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to create Remote product');
  return res.json();
}

export async function updateRemoteProduct(id, product) {
  const res = await fetch(`${API_BASE}/remote-products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(product)
  });
  if (!res.ok) throw new Error('Failed to update Remote product');
  return res.json();
}

export async function deleteRemoteProduct(id) {
  const res = await fetch(`${API_BASE}/remote-products/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete Remote product');
  return res.json();
}

// Pop Ad Management
export async function getPopAdConfig() {
  const configStr = localStorage.getItem('popAdConfig');
  if (configStr) {
    try {
      return JSON.parse(configStr);
    } catch (e) {
      console.error(e);
    }
  }
  
  // Default config
  const defaultConfig = {
    isActive: true,
    badgeText: 'Important Notice',
    title: 'Terms & Conditions',
    description: `Important notice that requires your acknowledgment before using this website.

All files and tools on GsmGiri are for educational purposes only.

🔧 Device repair, firmware updates, FRP operations & software fixes
📱 Personal devices or devices with authorized owner permission
🧾 Owner must provide: device bill/box — if no box, customer ID proof + signature + passport photo required

 ━━━━━━━━━━━━━━━━
🚫 STRICTLY PROHIBITED
━━━━━━━━━━━━━━━━
❌ Blacklisted or lost/stolen devices — DO NOT process
❌ Auth server operations — clean IMEI devices only
❌ Any device without proper owner authorization & documentation
Before proceeding, please verify the device status here: CEIR IMEI Verification.

━━━━━━━━━━━━━━━━
📋 TERMS & CONDITIONS
━━━━━━━━━━━━━━━━
✔️ Must be 18+ years old
✔️ Must own the device or have owner's written permission
✔️ Must comply with local laws and regulations
✔️ Device bill/box OR valid ID proof + signature + passport photo required
✔️ Only clean, authorized devices permitted — no blacklisted/lost devices
✔️ All OTP & Credits TOOLs are NON-REFUNDABLE once used

GsmGiri assumes no responsibility for any misuse, legal consequences, or device damage caused by the use of these files & tools. By using this site, you agree to these terms.`,
    buttonText: 'I Agree & Continue',
    imageUrl: ''
  };
  localStorage.setItem('popAdConfig', JSON.stringify(defaultConfig));
  return defaultConfig;
}

export async function updatePopAdConfig(updates) {
  const configStr = localStorage.getItem('popAdConfig');
  const config = configStr ? JSON.parse(configStr) : {};
  const newConfig = { ...config, ...updates };
  localStorage.setItem('popAdConfig', JSON.stringify(newConfig));
  return newConfig;
}
