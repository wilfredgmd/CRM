const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        this.setToken(null);
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.data.token);
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    this.setToken(data.data.token);
    return data;
  }

  async getMe() {
    return await this.request('/auth/me');
  }

  // Leads
  async getLeads(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/leads?${queryString}`);
  }

  async getLead(id) {
    return await this.request(`/leads/${id}`);
  }

  async createLead(leadData) {
    return await this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  }

  async updateLead(id, leadData) {
    return await this.request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
  }

  async deleteLead(id) {
    return await this.request(`/leads/${id}`, {
      method: 'DELETE',
    });
  }

  async convertLead(id) {
    return await this.request(`/leads/${id}/convert`, {
      method: 'POST',
    });
  }

  // Contacts
  async getContacts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/contacts?${queryString}`);
  }

  async getContact(id) {
    return await this.request(`/contacts/${id}`);
  }

  async createContact(contactData) {
    return await this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async updateContact(id, contactData) {
    return await this.request(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    });
  }

  async deleteContact(id) {
    return await this.request(`/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // Companies
  async getCompanies(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/companies?${queryString}`);
  }

  async getCompany(id) {
    return await this.request(`/companies/${id}`);
  }

  async createCompany(companyData) {
    return await this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  }

  async updateCompany(id, companyData) {
    return await this.request(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  async deleteCompany(id) {
    return await this.request(`/companies/${id}`, {
      method: 'DELETE',
    });
  }

  // Deals
  async getDeals(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/deals?${queryString}`);
  }

  async getDeal(id) {
    return await this.request(`/deals/${id}`);
  }

  async createDeal(dealData) {
    return await this.request('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    });
  }

  async updateDeal(id, dealData) {
    return await this.request(`/deals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dealData),
    });
  }

  async deleteDeal(id) {
    return await this.request(`/deals/${id}`, {
      method: 'DELETE',
    });
  }

  async moveDeal(id, stageId) {
    return await this.request(`/deals/${id}/move`, {
      method: 'POST',
      body: JSON.stringify({ stageId }),
    });
  }

  // Tasks
  async getTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/tasks?${queryString}`);
  }

  async getTask(id) {
    return await this.request(`/tasks/${id}`);
  }

  async createTask(taskData) {
    return await this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id, taskData) {
    return await this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(id) {
    return await this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Activities
  async getActivities(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/activities?${queryString}`);
  }

  async createActivity(activityData) {
    return await this.request('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  }

  async updateActivity(id, activityData) {
    return await this.request(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activityData),
    });
  }

  async deleteActivity(id) {
    return await this.request(`/activities/${id}`, {
      method: 'DELETE',
    });
  }

  // Notes
  async getNotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/notes?${queryString}`);
  }

  async createNote(noteData) {
    return await this.request('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(id, noteData) {
    return await this.request(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(id) {
    return await this.request(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  // Reports
  async getDashboardStats() {
    return await this.request('/reports/dashboard');
  }

  // Notifications
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await this.request(`/notifications?${queryString}`);
  }

  async markNotificationAsRead(id) {
    return await this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead() {
    return await this.request('/notifications/read-all', {
      method: 'PATCH',
    });
  }
}

const api = new ApiService();
export default api;
