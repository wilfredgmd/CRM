import { create } from 'zustand'
import api from '../services/api'
import localDB from '../services/localStorage'

// API-connected store for backend integration
const useApiStore = create((set, get) => ({
  // ── Auth ─────────────────────────────────────────────────────────
  isAuthenticated: !!localDB.getAuth(),
  user: localDB.getAuth(),
  authLoading: false,
  authError: null,

  login: async (email, password) => {
    set({ authLoading: true, authError: null })
    try {
      const data = await api.login(email, password)
      const user = data.data?.user || { email, name: 'Admin' }
      localDB.setAuth(user)
      set({ isAuthenticated: true, user, authLoading: false })
      return user
    } catch (error) {
      set({ authError: error.message, authLoading: false })
      throw error
    }
  },

  register: async (userData) => {
    set({ authLoading: true, authError: null })
    try {
      const data = await api.register(userData)
      const user = data.data?.user || userData
      localDB.setAuth(user)
      set({ isAuthenticated: true, user, authLoading: false })
      return user
    } catch (error) {
      set({ authError: error.message, authLoading: false })
      throw error
    }
  },

  logout: () => {
    api.setToken(null)
    localDB.clearAuth()
    set({ isAuthenticated: false, user: null })
  },

  // ── Settings ─────────────────────────────────────────────────────
  settings: localDB.getSettings(),
  settingsLoading: false,

  fetchSettings: async () => {
    try {
      const data = await api.request('/settings')
      set({ settings: data })
    } catch (error) {
      // Fallback to localStorage
      set({ settings: localDB.getSettings() })
    }
  },

  updateSettings: async (patch) => {
    try {
      const updated = await api.request('/settings', {
        method: 'PUT',
        body: JSON.stringify(patch),
      })
      set({ settings: updated })
      return updated
    } catch (error) {
      // Fallback to localStorage
      const updated = localDB.updateSettings(patch)
      set({ settings: updated })
      return updated
    }
  },

  // ── Notifications ─────────────────────────────────────────────────
  notifications: [],
  notificationsLoading: false,

  fetchNotifications: async () => {
    try {
      const data = await api.getNotifications()
      set({ notifications: data.data || data })
    } catch (error) {
      set({ notifications: localDB.getNotifications() })
    }
  },

  markNotificationRead: async (id) => {
    try {
      await api.markNotificationAsRead(id)
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      }))
    } catch (error) {
      const updated = localDB.markNotificationRead(id)
      set({ notifications: updated })
    }
  },

  markAllNotificationsRead: async () => {
    try {
      await api.markAllNotificationsAsRead()
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      }))
    } catch (error) {
      const updated = localDB.markAllNotificationsRead()
      set({ notifications: updated })
    }
  },

  // ── Leads ─────────────────────────────────────────────────────────
  leads: [],
  leadsLoading: false,
  leadsError: null,

  fetchLeads: async () => {
    set({ leadsLoading: true, leadsError: null })
    try {
      const data = await api.getLeads()
      set({ leads: data.data || data, leadsLoading: false })
    } catch (error) {
      set({ leadsError: error.message, leadsLoading: false })
      // Fallback to localStorage
      set({ leads: localDB.getLeads() })
    }
  },

  addLead: async (leadData) => {
    try {
      const newLead = await api.createLead(leadData)
      set(state => ({ leads: [...state.leads, newLead.data || newLead] }))
      get().fetchNotifications()
      return newLead.data || newLead
    } catch (error) {
      // Fallback to localStorage
      const newLead = localDB.createLead(leadData)
      set(state => ({ leads: [...state.leads, newLead] }))
      return newLead
    }
  },

  updateLead: async (id, patch) => {
    try {
      const updated = await api.updateLead(id, patch)
      set(state => ({
        leads: state.leads.map(l => l.id === id ? (updated.data || updated) : l)
      }))
      return updated.data || updated
    } catch (error) {
      const updated = localDB.updateLead(id, patch)
      set(state => ({
        leads: state.leads.map(l => l.id === id ? updated : l)
      }))
      return updated
    }
  },

  deleteLead: async (id) => {
    try {
      await api.deleteLead(id)
      set(state => ({ leads: state.leads.filter(l => l.id !== id) }))
    } catch (error) {
      localDB.deleteLead(id)
      set(state => ({ leads: state.leads.filter(l => l.id !== id) }))
    }
  },

  // Lead conversion workflow
  convertLead: async (id) => {
    try {
      const result = await api.convertLead(id)
      // Refresh leads, contacts, deals, and tasks
      await get().fetchLeads()
      await get().fetchContacts()
      await get().fetchDeals()
      await get().fetchTasks()
      await get().fetchNotifications()
      return result.data || result
    } catch (error) {
      // Manual conversion fallback
      const lead = localDB.getLead(id)
      if (!lead) throw new Error('Lead not found')

      const contact = localDB.createContact({
        name: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        title: lead.title,
        status: 'Active',
        notes: `Converted from lead. ${lead.notes || ''}`,
      })

      let deal = null
      if (lead.value > 0) {
        deal = localDB.createDeal({
          name: `${lead.company || lead.firstName} Deal`,
          contactName: `${lead.firstName} ${lead.lastName}`,
          company: lead.company,
          value: lead.value,
          stage: 'Qualification',
          probability: 10,
          notes: `Deal created from converted lead. Source: ${lead.source || 'Unknown'}`,
        })
      }

      localDB.updateLead(id, { status: 'converted' })

      // Create follow-up task
      localDB.createTask({
        title: `Follow up with ${lead.firstName} ${lead.lastName}`,
        description: 'New contact converted from lead. Schedule introduction call.',
        priority: 'High',
        dueDate: 'Tomorrow',
        assignee: 'Admin',
      })

      await get().fetchLeads()
      await get().fetchContacts()
      await get().fetchDeals()
      await get().fetchTasks()

      return { contact, deal, taskCreated: true }
    }
  },

  // ── Contacts ──────────────────────────────────────────────────────
  contacts: [],
  contactsLoading: false,
  contactsError: null,

  fetchContacts: async () => {
    set({ contactsLoading: true, contactsError: null })
    try {
      const data = await api.getContacts()
      set({ contacts: data.data || data, contactsLoading: false })
    } catch (error) {
      set({ contactsError: error.message, contactsLoading: false })
      set({ contacts: localDB.getContacts() })
    }
  },

  addContact: async (data) => {
    try {
      const newContact = await api.createContact(data)
      set(state => ({ contacts: [...state.contacts, newContact.data || newContact] }))
      return newContact.data || newContact
    } catch (error) {
      const newContact = localDB.createContact(data)
      set(state => ({ contacts: [...state.contacts, newContact] }))
      return newContact
    }
  },

  updateContact: async (id, patch) => {
    try {
      const updated = await api.updateContact(id, patch)
      set(state => ({
        contacts: state.contacts.map(c => c.id === id ? (updated.data || updated) : c)
      }))
      return updated.data || updated
    } catch (error) {
      const updated = localDB.updateContact(id, patch)
      set(state => ({
        contacts: state.contacts.map(c => c.id === id ? updated : c)
      }))
      return updated
    }
  },

  deleteContact: async (id) => {
    try {
      await api.deleteContact(id)
      set(state => ({ contacts: state.contacts.filter(c => c.id !== id) }))
    } catch (error) {
      localDB.deleteContact(id)
      set(state => ({ contacts: state.contacts.filter(c => c.id !== id) }))
    }
  },

  // ── Deals ─────────────────────────────────────────────────────────
  deals: [],
  dealsLoading: false,
  dealsError: null,

  fetchDeals: async () => {
    set({ dealsLoading: true, dealsError: null })
    try {
      const data = await api.getDeals()
      set({ deals: data.data || data, dealsLoading: false })
    } catch (error) {
      set({ dealsError: error.message, dealsLoading: false })
      set({ deals: localDB.getDeals() })
    }
  },

  addDeal: async (data) => {
    try {
      const newDeal = await api.createDeal(data)
      set(state => ({ deals: [...state.deals, newDeal.data || newDeal] }))
      return newDeal.data || newDeal
    } catch (error) {
      const newDeal = localDB.createDeal(data)
      set(state => ({ deals: [...state.deals, newDeal] }))
      return newDeal
    }
  },

  updateDeal: async (id, patch) => {
    try {
      const updated = await api.updateDeal(id, patch)
      set(state => ({
        deals: state.deals.map(d => d.id === id ? (updated.data || updated) : d)
      }))
      // Refresh tasks as workflow may have created new ones
      await get().fetchTasks()
      await get().fetchNotifications()
      return updated.data || updated
    } catch (error) {
      const updated = localDB.updateDeal(id, patch)
      set(state => ({
        deals: state.deals.map(d => d.id === id ? updated : d)
      }))
      return updated
    }
  },

  deleteDeal: async (id) => {
    try {
      await api.deleteDeal(id)
      set(state => ({ deals: state.deals.filter(d => d.id !== id) }))
    } catch (error) {
      localDB.deleteDeal(id)
      set(state => ({ deals: state.deals.filter(d => d.id !== id) }))
    }
  },

  // ── Tasks ─────────────────────────────────────────────────────────
  tasks: [],
  tasksLoading: false,
  tasksError: null,

  fetchTasks: async () => {
    set({ tasksLoading: true, tasksError: null })
    try {
      const data = await api.getTasks()
      set({ tasks: data.data || data, tasksLoading: false })
    } catch (error) {
      set({ tasksError: error.message, tasksLoading: false })
      set({ tasks: localDB.getTasks() })
    }
  },

  addTask: async (data) => {
    try {
      const newTask = await api.createTask(data)
      set(state => ({ tasks: [...state.tasks, newTask.data || newTask] }))
      return newTask.data || newTask
    } catch (error) {
      const newTask = localDB.createTask(data)
      set(state => ({ tasks: [...state.tasks, newTask] }))
      return newTask
    }
  },

  updateTask: async (id, patch) => {
    try {
      const updated = await api.updateTask(id, patch)
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? (updated.data || updated) : t)
      }))
      return updated.data || updated
    } catch (error) {
      const updated = localDB.updateTask(id, patch)
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? updated : t)
      }))
      return updated
    }
  },

  deleteTask: async (id) => {
    try {
      await api.deleteTask(id)
      set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }))
    } catch (error) {
      localDB.deleteTask(id)
      set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }))
    }
  },

  // ── Calls ─────────────────────────────────────────────────────────
  calls: [],
  callsLoading: false,
  callsError: null,

  fetchCalls: async () => {
    set({ callsLoading: true, callsError: null })
    try {
      const data = await api.request('/calls')
      set({ calls: data.data || data, callsLoading: false })
    } catch (error) {
      set({ callsError: error.message, callsLoading: false })
      set({ calls: localDB.getCalls() })
    }
  },

  addCall: async (data) => {
    try {
      const newCall = await api.request('/calls', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      set(state => ({ calls: [...state.calls, newCall.data || newCall] }))
      return newCall.data || newCall
    } catch (error) {
      const newCall = localDB.createCall(data)
      set(state => ({ calls: [...state.calls, newCall] }))
      return newCall
    }
  },

  updateCall: async (id, patch) => {
    try {
      const updated = await api.request(`/calls/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      })
      set(state => ({
        calls: state.calls.map(c => c.id === id ? (updated.data || updated) : c)
      }))
      return updated.data || updated
    } catch (error) {
      const updated = localDB.updateCall(id, patch)
      set(state => ({
        calls: state.calls.map(c => c.id === id ? updated : c)
      }))
      return updated
    }
  },

  deleteCall: async (id) => {
    try {
      await api.request(`/calls/${id}`, { method: 'DELETE' })
      set(state => ({ calls: state.calls.filter(c => c.id !== id) }))
    } catch (error) {
      localDB.deleteCall(id)
      set(state => ({ calls: state.calls.filter(c => c.id !== id) }))
    }
  },

  // ── Dashboard / Reports ────────────────────────────────────────────
  dashboardStats: null,
  dashboardLoading: false,

  fetchDashboardStats: async () => {
    set({ dashboardLoading: true })
    try {
      const data = await api.getDashboardStats()
      set({ dashboardStats: data.data || data, dashboardLoading: false })
    } catch (error) {
      // Compute from localStorage as fallback
      const leads = localDB.getLeads()
      const contacts = localDB.getContacts()
      const deals = localDB.getDeals()
      const tasks = localDB.getTasks()

      const totalPipeline = deals
        .filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage))
        .reduce((sum, d) => sum + (d.value || 0), 0)

      const wonDeals = deals.filter(d => d.stage === 'Closed Won')
      const wonRevenue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0)

      const dealsByStage = {}
      deals.forEach(d => {
        dealsByStage[d.stage] = (dealsByStage[d.stage] || 0) + 1
      })

      const convertedLeads = leads.filter(l => l.status === 'converted').length
      const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0

      const avgDealSize = deals.length > 0
        ? Math.round(deals.reduce((sum, d) => sum + (d.value || 0), 0) / deals.length)
        : 0

      set({
        dashboardStats: {
          counts: {
            leads: leads.length,
            contacts: contacts.length,
            deals: deals.length,
            pendingTasks: tasks.filter(t => t.status !== 'Completed').length,
          },
          pipeline: {
            total: totalPipeline,
            weighted: Math.round(totalPipeline * 0.65),
            dealsByStage: Object.entries(dealsByStage).map(([stage, count]) => ({ stage, count })),
          },
          revenue: {
            wonThisMonth: wonRevenue,
            averageDealSize: avgDealSize,
          },
          conversionRate,
        },
        dashboardLoading: false,
      })
    }
  },
}))

export default useApiStore
