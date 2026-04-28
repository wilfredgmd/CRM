/**
 * LocalStorage Data Service
 * Production-grade localStorage wrapper with JSON serialization,
 * default seeding, and event-driven notifications.
 */

const STORAGE_KEYS = {
  SETTINGS: 'crm_settings',
  LEADS: 'crm_leads',
  CONTACTS: 'crm_contacts',
  DEALS: 'crm_deals',
  TASKS: 'crm_tasks',
  CALLS: 'crm_calls',
  NOTIFICATIONS: 'crm_notifications',
  AUTH: 'crm_auth',
};

// ── Helpers ──────────────────────────────────────────────────────────
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Default Data Seeds ───────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  companyName: 'My CRM',
  userName: 'Admin',
  userEmail: 'admin@mycrm.com',
  currency: '₹',
  currencyCode: 'INR',
  dateFormat: 'DD/MM/YYYY',
  language: 'en',
  theme: 'light',
  notifications: {
    newLeads: true,
    dealUpdates: true,
    taskReminders: true,
    emailAlerts: true,
  },
};

const CURRENCY_OPTIONS = [
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
  { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
  { symbol: 'Fr', code: 'CHF', name: 'Swiss Franc' },
  { symbol: '元', code: 'CNY', name: 'Chinese Yuan' },
  { symbol: '₩', code: 'KRW', name: 'South Korean Won' },
  { symbol: 'R$', code: 'BRL', name: 'Brazilian Real' },
  { symbol: '₽', code: 'RUB', name: 'Russian Ruble' },
];

const DEFAULT_LEADS = [
  { id: generateId(), firstName: 'Priya', lastName: 'Sharma', email: 'priya@techstart.in', phone: '+91 98765 43210', company: 'TechStart India', title: 'CEO', status: 'new', source: 'Website', value: 500000, score: 85, createdAt: new Date().toISOString(), notes: '' },
  { id: generateId(), firstName: 'Rahul', lastName: 'Verma', email: 'rahul@innovate.co', phone: '+91 87654 32109', company: 'Innovate Corp', title: 'CTO', status: 'contacted', source: 'LinkedIn', value: 1200000, score: 72, createdAt: new Date(Date.now() - 86400000).toISOString(), notes: '' },
  { id: generateId(), firstName: 'Anita', lastName: 'Patel', email: 'anita@globalsoft.com', phone: '+91 76543 21098', company: 'GlobalSoft', title: 'Director', status: 'qualified', source: 'Referral', value: 350000, score: 90, createdAt: new Date(Date.now() - 172800000).toISOString(), notes: '' },
  { id: generateId(), firstName: 'Vikram', lastName: 'Singh', email: 'vikram@enterprise.in', phone: '+91 65432 10987', company: 'Enterprise Solutions', title: 'VP Sales', status: 'new', source: 'Cold Call', value: 800000, score: 65, createdAt: new Date(Date.now() - 3600000).toISOString(), notes: '' },
];

const DEFAULT_CONTACTS = [
  { id: generateId(), name: 'Meera Krishnan', email: 'meera@techcorp.in', phone: '+91 99887 76655', company: 'TechCorp India', title: 'Product Manager', status: 'Active', createdAt: '2024-01-15', notes: '', address: 'Mumbai, MH' },
  { id: generateId(), name: 'Arjun Reddy', email: 'arjun@designstudio.com', phone: '+91 88776 65544', company: 'Design Studio', title: 'Lead Designer', status: 'Active', createdAt: '2024-02-10', notes: '', address: 'Hyderabad, TG' },
  { id: generateId(), name: 'Sneha Gupta', email: 'sneha@marketpro.in', phone: '+91 77665 54433', company: 'MarketPro', title: 'Marketing Head', status: 'Active', createdAt: '2024-02-20', notes: '', address: 'Delhi, DL' },
  { id: generateId(), name: 'Karthik Nair', email: 'karthik@startup.io', phone: '+91 66554 43322', company: 'StartUp Hub', title: 'Founder', status: 'Inactive', createdAt: '2024-01-05', notes: '', address: 'Bangalore, KA' },
];

const DEFAULT_DEALS = [
  { id: generateId(), name: 'Enterprise License Deal', contactName: 'Meera Krishnan', company: 'TechCorp India', value: 2500000, stage: 'Qualification', probability: 30, expectedClose: '2024-06-30', createdAt: new Date().toISOString(), notes: '' },
  { id: generateId(), name: 'Annual Support Contract', contactName: 'Arjun Reddy', company: 'Design Studio', value: 800000, stage: 'Proposal', probability: 55, expectedClose: '2024-05-15', createdAt: new Date(Date.now() - 86400000).toISOString(), notes: '' },
  { id: generateId(), name: 'Cloud Migration Project', contactName: 'Sneha Gupta', company: 'MarketPro', value: 4500000, stage: 'Negotiation', probability: 75, expectedClose: '2024-04-30', createdAt: new Date(Date.now() - 172800000).toISOString(), notes: '' },
  { id: generateId(), name: 'Consulting Engagement', contactName: 'Karthik Nair', company: 'StartUp Hub', value: 600000, stage: 'Closed Won', probability: 100, expectedClose: '2024-03-20', createdAt: new Date(Date.now() - 604800000).toISOString(), notes: '' },
];

const DEFAULT_TASKS = [
  { id: generateId(), title: 'Follow up with Priya Sharma', description: 'Send proposal for TechStart deal', priority: 'High', status: 'Pending', dueDate: 'Today', assignee: 'Admin', createdAt: new Date().toISOString() },
  { id: generateId(), title: 'Prepare quarterly report', description: 'Compile Q1 sales data', priority: 'Medium', status: 'In Progress', dueDate: 'Tomorrow', assignee: 'Admin', createdAt: new Date().toISOString() },
  { id: generateId(), title: 'Update CRM contacts', description: 'Import new contacts from trade show', priority: 'Low', status: 'Pending', dueDate: 'This Week', assignee: 'Admin', createdAt: new Date().toISOString() },
  { id: generateId(), title: 'Schedule demo for Enterprise Solutions', description: 'Product demo for Vikram Singh', priority: 'High', status: 'Pending', dueDate: 'Today', assignee: 'Admin', createdAt: new Date().toISOString() },
];

const DEFAULT_CALLS = [
  { id: generateId(), contactName: 'Priya Sharma', phone: '+91 98765 43210', company: 'TechStart India', scheduledTime: '10:00 AM', type: 'phone', duration: '30 min', status: 'scheduled', date: new Date().toISOString().split('T')[0], outcome: '', notes: '' },
  { id: generateId(), contactName: 'Rahul Verma', phone: '+91 87654 32109', company: 'Innovate Corp', scheduledTime: '2:00 PM', type: 'video', duration: '45 min', status: 'scheduled', date: new Date().toISOString().split('T')[0], outcome: '', notes: '' },
  { id: generateId(), contactName: 'Meera Krishnan', phone: '+91 99887 76655', company: 'TechCorp India', scheduledTime: 'Yesterday', type: 'phone', duration: '25 min', status: 'completed', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], outcome: 'Successful', notes: 'Discussed pricing' },
];

// ── Service Class ────────────────────────────────────────────────────
class LocalStorageService {
  constructor() {
    this.initDefaults();
  }

  initDefaults() {
    if (!read(STORAGE_KEYS.SETTINGS)) write(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    if (!read(STORAGE_KEYS.LEADS)) write(STORAGE_KEYS.LEADS, DEFAULT_LEADS);
    if (!read(STORAGE_KEYS.CONTACTS)) write(STORAGE_KEYS.CONTACTS, DEFAULT_CONTACTS);
    if (!read(STORAGE_KEYS.DEALS)) write(STORAGE_KEYS.DEALS, DEFAULT_DEALS);
    if (!read(STORAGE_KEYS.TASKS)) write(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    if (!read(STORAGE_KEYS.CALLS)) write(STORAGE_KEYS.CALLS, DEFAULT_CALLS);
    if (!read(STORAGE_KEYS.NOTIFICATIONS)) write(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  // ── Settings ─────────────────────────────────────────────────────
  getSettings() {
    return read(STORAGE_KEYS.SETTINGS) || DEFAULT_SETTINGS;
  }
  updateSettings(patch) {
    const current = this.getSettings();
    const updated = { ...current, ...patch };
    write(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // ── Notifications ────────────────────────────────────────────────
  getNotifications() {
    return read(STORAGE_KEYS.NOTIFICATIONS) || [];
  }
  addNotification(notification) {
    const list = this.getNotifications();
    const item = { id: generateId(), ...notification, read: false, createdAt: new Date().toISOString() };
    list.unshift(item);
    // keep max 50
    if (list.length > 50) list.length = 50;
    write(STORAGE_KEYS.NOTIFICATIONS, list);
    return item;
  }
  markNotificationRead(id) {
    const list = this.getNotifications().map(n => n.id === id ? { ...n, read: true } : n);
    write(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  }
  markAllNotificationsRead() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    write(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  }
  clearNotifications() {
    write(STORAGE_KEYS.NOTIFICATIONS, []);
    return [];
  }

  // ── Generic CRUD ─────────────────────────────────────────────────
  _getAll(key) { return read(key) || []; }
  _getById(key, id) { return this._getAll(key).find(item => item.id === id) || null; }
  _create(key, item) {
    const list = this._getAll(key);
    const newItem = { id: generateId(), ...item, createdAt: item.createdAt || new Date().toISOString() };
    list.push(newItem);
    write(key, list);
    return newItem;
  }
  _update(key, id, patch) {
    const list = this._getAll(key).map(item =>
      item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item
    );
    write(key, list);
    return list.find(item => item.id === id);
  }
  _delete(key, id) {
    const list = this._getAll(key).filter(item => item.id !== id);
    write(key, list);
  }

  // ── Leads ────────────────────────────────────────────────────────
  getLeads() { return this._getAll(STORAGE_KEYS.LEADS); }
  getLead(id) { return this._getById(STORAGE_KEYS.LEADS, id); }
  createLead(data) {
    const lead = this._create(STORAGE_KEYS.LEADS, {
      ...data,
      score: data.score || Math.floor(Math.random() * 30) + 60,
      status: data.status || 'new',
    });
    // Fire notification
    this.addNotification({
      type: 'lead_added',
      title: 'New Lead Added',
      message: `${lead.firstName} ${lead.lastName} from ${lead.company || 'Unknown'} was added as a new lead.`,
      icon: 'UserPlus',
    });
    return lead;
  }
  updateLead(id, patch) { return this._update(STORAGE_KEYS.LEADS, id, patch); }
  deleteLead(id) { this._delete(STORAGE_KEYS.LEADS, id); }

  // ── Contacts ─────────────────────────────────────────────────────
  getContacts() { return this._getAll(STORAGE_KEYS.CONTACTS); }
  getContact(id) { return this._getById(STORAGE_KEYS.CONTACTS, id); }
  createContact(data) { return this._create(STORAGE_KEYS.CONTACTS, { ...data, status: data.status || 'Active' }); }
  updateContact(id, patch) { return this._update(STORAGE_KEYS.CONTACTS, id, patch); }
  deleteContact(id) { this._delete(STORAGE_KEYS.CONTACTS, id); }

  // ── Deals ────────────────────────────────────────────────────────
  getDeals() { return this._getAll(STORAGE_KEYS.DEALS); }
  getDeal(id) { return this._getById(STORAGE_KEYS.DEALS, id); }
  createDeal(data) { return this._create(STORAGE_KEYS.DEALS, { ...data, stage: data.stage || 'Qualification', probability: data.probability || 10 }); }
  updateDeal(id, patch) { return this._update(STORAGE_KEYS.DEALS, id, patch); }
  deleteDeal(id) { this._delete(STORAGE_KEYS.DEALS, id); }

  // ── Tasks ────────────────────────────────────────────────────────
  getTasks() { return this._getAll(STORAGE_KEYS.TASKS); }
  getTask(id) { return this._getById(STORAGE_KEYS.TASKS, id); }
  createTask(data) { return this._create(STORAGE_KEYS.TASKS, { ...data, status: data.status || 'Pending' }); }
  updateTask(id, patch) { return this._update(STORAGE_KEYS.TASKS, id, patch); }
  deleteTask(id) { this._delete(STORAGE_KEYS.TASKS, id); }

  // ── Calls ────────────────────────────────────────────────────────
  getCalls() { return this._getAll(STORAGE_KEYS.CALLS); }
  getCall(id) { return this._getById(STORAGE_KEYS.CALLS, id); }
  createCall(data) { return this._create(STORAGE_KEYS.CALLS, { ...data, status: data.status || 'scheduled' }); }
  updateCall(id, patch) { return this._update(STORAGE_KEYS.CALLS, id, patch); }
  deleteCall(id) { this._delete(STORAGE_KEYS.CALLS, id); }

  // ── Auth (simple local auth) ─────────────────────────────────────
  getAuth() { return read(STORAGE_KEYS.AUTH); }
  setAuth(user) { write(STORAGE_KEYS.AUTH, user); return user; }
  clearAuth() { localStorage.removeItem(STORAGE_KEYS.AUTH); }

  // ── Reset ────────────────────────────────────────────────────────
  resetAll() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    this.initDefaults();
  }
}

const localDB = new LocalStorageService();
export { CURRENCY_OPTIONS, STORAGE_KEYS };
export default localDB;
