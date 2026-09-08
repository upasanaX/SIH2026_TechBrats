import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const port = Number(process.env.PORT || 4000);
const dataPath = join(dirname(fileURLToPath(import.meta.url)), 'server-data.json');

const seed = {
  users: [],
  sessions: {},
  otpRequests: {},
  orders: [],
  communicationLogs: [],
  panchayats: [
    { id: 'panchayat-bhangar-1', name: 'Bhangar-I', district: 'South 24 Parganas', block: 'Bhangar-I Block', state: 'West Bengal', currentRisk: 'high', activeAlertCount: 2, primaryCrops: ['Paddy (Aman)', 'Mustard', 'Vegetables'] },
    { id: 'panchayat-canning-2', name: 'Canning-II', district: 'South 24 Parganas', block: 'Canning-II Block', state: 'West Bengal', currentRisk: 'critical', activeAlertCount: 3, primaryCrops: ['Boro Paddy', 'Chili', 'Watermelon'] },
    { id: 'panchayat-singur', name: 'Singur Rural', district: 'Hooghly', block: 'Singur Block', state: 'West Bengal', currentRisk: 'moderate', activeAlertCount: 1, primaryCrops: ['Potato (Jyoti)', 'Paddy', 'Mustard'] }
  ],
  alerts: [
    { id: 'alert-hr-01', title: 'Severe Convective Rain & Waterlogging Threat', severity: 'high', type: 'heavy_rain', primaryPanchayatId: 'panchayat-bhangar-1', affectedPanchayats: ['Bhangar-I', 'Bhangar-II', 'Sonarpur'], confidence: 91, source: 'IMD Doppler Radar Kolkata + KrishiKavach', timeWindow: 'Next 12 Hours', summary: 'Localized heavy rainfall may cause waterlogging in low-lying plots.', timestamp: new Date().toISOString(), isAcknowledged: false },
    { id: 'alert-fl-02', title: 'Estuarine High Tide Surge Risk', severity: 'critical', type: 'flood_risk', primaryPanchayatId: 'panchayat-canning-2', affectedPanchayats: ['Canning-II', 'Basanti'], confidence: 95, source: 'INCOIS + KrishiKavach Coastal Model', timeWindow: 'Next 6 to 18 Hours', summary: 'High tide and squalls may breach vulnerable embankments.', timestamp: new Date().toISOString(), isAcknowledged: false }
  ],
  products: [
    { id: 'prod-rice-gobindobhog', name: 'Aromatic Gobindobhog Rice', category: 'grains', unit: 'kg', pricePerUnit: 82, quantityAvailable: 650, farmerName: 'Subir Mondal', panchayat: 'Bagila Gram Panchayat', district: 'Purba Bardhaman', organic: true, verifiedFarmer: true },
    { id: 'prod-mustard-seeds', name: 'Cold-Pressed Raw Yellow Mustard', category: 'spices', unit: 'kg', pricePerUnit: 110, quantityAvailable: 420, farmerName: 'Ananta Das', panchayat: 'Singur Rural', district: 'Hooghly', organic: false, verifiedFarmer: true },
    { id: 'prod-tomatoes-farmfresh', name: 'Vine-Ripened Farm Tomatoes', category: 'vegetables', unit: 'kg', pricePerUnit: 34, quantityAvailable: 180, farmerName: 'Purnima Halder', panchayat: 'Chhota Jagulia', district: 'North 24 Parganas', organic: true, verifiedFarmer: true }
  ]
};

const db = existsSync(dataPath) ? JSON.parse(readFileSync(dataPath, 'utf8')) : seed;
const persist = () => writeFileSync(dataPath, JSON.stringify(db, null, 2));
const send = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type, authorization', 'access-control-allow-methods': 'GET, POST, PATCH, OPTIONS' });
  res.end(JSON.stringify(body));
};
const readBody = async (req) => {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
};
const authUser = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  return token ? db.sessions[token] : null;
};
const route = (method, pathname) => pathname.split('/').filter(Boolean).slice(1);

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = route(req.method, url.pathname);
  if (url.pathname === '/api/health') return send(res, 200, { status: 'ok', service: 'krishikavach-api', timestamp: new Date().toISOString() });

  try {
    if (req.method === 'GET' && parts[0] === 'panchayats') {
      const search = (url.searchParams.get('search') || '').toLowerCase();
      const result = db.panchayats.filter((item) => `${item.name} ${item.district} ${item.block}`.toLowerCase().includes(search));
      return send(res, 200, { data: result });
    }
    if (req.method === 'GET' && parts[0] === 'alerts' && parts[1] === 'active') {
      const panchayatId = url.searchParams.get('panchayat_id');
      const result = db.alerts.filter((item) => !panchayatId || item.primaryPanchayatId === panchayatId || item.affectedPanchayats.includes(db.panchayats.find((p) => p.id === panchayatId)?.name));
      return send(res, 200, { data: result });
    }
    if (req.method === 'POST' && parts[0] === 'alerts' && parts[2] === 'acknowledge') {
      const alert = db.alerts.find((item) => item.id === parts[1]);
      if (!alert) return send(res, 404, { error: 'Alert not found' });
      alert.isAcknowledged = true;
      persist();
      return send(res, 200, { data: alert });
    }
    if (req.method === 'GET' && parts[0] === 'marketplace' && parts[1] === 'products') {
      const search = (url.searchParams.get('search') || '').toLowerCase();
      const category = url.searchParams.get('category');
      const result = db.products.filter((item) => (!category || item.category === category) && item.name.toLowerCase().includes(search));
      return send(res, 200, { data: result });
    }
    if (req.method === 'POST' && parts[0] === 'auth' && parts[1] === 'register') {
      const body = await readBody(req);
      if (!body.fullName || !body.phone) return send(res, 400, { error: 'fullName and phone are required' });
      const user = { id: randomUUID(), ...body, createdAt: new Date().toISOString() };
      db.users.push(user);
      persist();
      return send(res, 201, { data: { user, demoToken: `demo-${user.id}` } });
    }
    if (req.method === 'POST' && parts[0] === 'auth' && parts[1] === 'request-otp') {
      const body = await readBody(req);
      if (!body.phone) return send(res, 400, { error: 'phone is required' });
      db.otpRequests[body.phone] = '123456';
      return send(res, 200, { data: { message: 'OTP issued for sandbox mode', expiresInSeconds: 300 } });
    }
    if (req.method === 'POST' && parts[0] === 'auth' && parts[1] === 'verify-otp') {
      const body = await readBody(req);
      if (db.otpRequests[body.phone] !== body.otp) return send(res, 401, { error: 'Invalid OTP' });
      const user = db.users.find((item) => item.phone === body.phone) || { id: randomUUID(), fullName: 'Demo User', phone: body.phone, role: body.role || 'farmer' };
      const token = randomUUID();
      db.sessions[token] = user;
      persist();
      return send(res, 200, { data: { token, user } });
    }
    if (req.method === 'GET' && parts[0] === 'auth' && parts[1] === 'me') {
      const user = authUser(req);
      return user ? send(res, 200, { data: user }) : send(res, 401, { error: 'Authentication required' });
    }
    if (req.method === 'GET' && parts[0] === 'orders') {
      const user = authUser(req);
      if (!user) return send(res, 401, { error: 'Authentication required' });
      return send(res, 200, { data: db.orders.filter((item) => item.userId === user.id) });
    }
    if (req.method === 'POST' && parts[0] === 'orders') {
      const user = authUser(req);
      if (!user) return send(res, 401, { error: 'Authentication required' });
      const body = await readBody(req);
      if (!Array.isArray(body.items) || body.items.length === 0) return send(res, 400, { error: 'At least one item is required' });
      const items = body.items.map(({ productId, quantity }) => {
        const product = db.products.find((item) => item.id === productId);
        if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.quantityAvailable) throw new Error(`Invalid quantity for ${productId}`);
        return { product, quantity };
      });
      const subtotal = items.reduce((sum, item) => sum + item.product.pricePerUnit * item.quantity, 0);
      items.forEach(({ product, quantity }) => { product.quantityAvailable -= quantity; });
      const order = { id: `KK-ORD-${Date.now()}`, userId: user.id, items, subtotal, deliveryFee: body.deliveryFee || 0, totalAmount: subtotal + (body.deliveryFee || 0), deliveryType: body.deliveryType || 'hub_delivery', shippingAddress: body.shippingAddress, paymentMethod: body.paymentMethod || 'upi', status: 'confirmed', createdAt: new Date().toISOString() };
      db.orders.unshift(order);
      persist();
      return send(res, 201, { data: order });
    }
    if (req.method === 'POST' && parts[0] === 'communications' && parts[1] === 'dispatch') {
      const user = authUser(req);
      if (!user) return send(res, 401, { error: 'Authentication required' });
      const body = await readBody(req);
      const log = { id: randomUUID(), ...body, status: 'queued', timestamp: new Date().toISOString() };
      db.communicationLogs.unshift(log);
      persist();
      return send(res, 202, { data: log });
    }
    return send(res, 404, { error: 'Route not found' });
  } catch (error) {
    return send(res, 400, { error: error.message || 'Invalid request' });
  }
});

server.listen(port, () => console.log(`KrishiKavach API listening on http://localhost:${port}`));