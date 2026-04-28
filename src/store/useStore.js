import { create } from 'zustand'
import localDB from '../services/localStorage'

const useStore = create((set, get) => ({
  // ── Auth ─────────────────────────────────────────────────────────
  isAuthenticated: !!localDB.getAuth(),
  user: localDB.getAuth(),

  login: (email, name) => {
    const user = { id: '1', email, name: name || 'Admin', role: 'admin' }
    localDB.setAuth(user)
    // Also persist name to settings
    const settings = localDB.getSettings()
    if (name && !settings.userName) {
      localDB.updateSettings({ userName: name })
    }
    set({ isAuthenticated: true, user })
  },

  logout: () => {
    localDB.clearAuth()
    set({ isAuthenticated: false, user: null })
  },

  // ── Settings ─────────────────────────────────────────────────────
  settings: localDB.getSettings(),

  fetchSettings: () => {
    set({ settings: localDB.getSettings() })
  },

  updateSettings: (patch) => {
    const updated = localDB.updateSettings(patch)
    set({ settings: updated })
    return updated
  },

  // ── Notifications ─────────────────────────────────────────────────
  notifications: localDB.getNotifications(),

  fetchNotifications: () => {
    set({ notifications: localDB.getNotifications() })
  },

  markNotificationRead: (id) => {
    const updated = localDB.markNotificationRead(id)
    set({ notifications: updated })
  },

  markAllNotificationsRead: () => {
    const updated = localDB.markAllNotificationsRead()
    set({ notifications: updated })
  },

  clearNotifications: () => {
    const updated = localDB.clearNotifications()
    set({ notifications: updated })
  },

  // ── Leads ─────────────────────────────────────────────────────────
  leads: localDB.getLeads(),
  leadsLoading: false,
  leadsError: null,

  fetchLeads: () => {
    set({ leads: localDB.getLeads(), leadsLoading: false })
  },

  addLead: (leadData) => {
    const newLead = localDB.createLead(leadData)
    set(state => ({
      leads: [...state.leads, newLead],
      notifications: localDB.getNotifications(),
    }))
    return newLead
  },

  updateLead: (id, patch) => {
    const updated = localDB.updateLead(id, patch)
    set(state => ({
      leads: state.leads.map(l => l.id === id ? updated : l)
    }))
    return updated
  },

  deleteLead: (id) => {
    localDB.deleteLead(id)
    set(state => ({ leads: state.leads.filter(l => l.id !== id) }))
  },

  // Lead conversion workflow - converts lead to contact + creates deal + auto-tasks
  convertLead: (id) => {
    const lead = localDB.getLead(id)
    if (!lead) throw new Error('Lead not found')

    // Create contact from lead
    const contact = localDB.createContact({
      name: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      title: lead.title,
      status: 'Active',
      notes: `Converted from lead (ID: ${id}). Source: ${lead.source || 'Unknown'}. ${lead.notes || ''}`,
      source: lead.source,
      isNewlyConverted: true,
      convertedAt: new Date().toISOString(),
      originalLeadId: id
    })

    // Create deal if lead has value
    let deal = null
    if (lead.value > 0) {
      deal = localDB.createDeal({
        name: `${lead.company || lead.firstName} Deal`,
        contactName: `${lead.firstName} ${lead.lastName}`,
        company: lead.company,
        value: lead.value,
        stage: 'Qualification',
        probability: 10,
        notes: `Deal created from converted lead (ID: ${id}). Source: ${lead.source || 'Unknown'}`,
        source: lead.source,
        contactId: contact.id
      })
    }

    // Update lead status to converted
    const updatedLead = localDB.updateLead(id, { 
      status: 'converted',
      convertedContactId: contact.id,
      convertedDealId: deal?.id || null,
      convertedAt: new Date().toISOString()
    })

    // Create notification
    localDB.addNotification({
      type: 'lead_converted',
      title: 'Lead Converted',
      message: `${lead.firstName} ${lead.lastName} was converted to a contact${deal ? ' and deal' : ''}.`,
      icon: 'UserCheck',
    })

    // Auto-create follow-up task (Workflow)
    const task = localDB.createTask({
      title: `Follow up with ${lead.firstName} ${lead.lastName}`,
      description: `New contact converted from lead. Schedule introduction call. Company: ${lead.company || 'N/A'}`,
      priority: 'High',
      status: 'Pending',
      dueDate: 'Tomorrow',
      assignee: 'Admin',
      relatedTo: 'contact',
      relatedId: contact.id
    })

    // Update state
    set(state => ({
      leads: state.leads.map(l => l.id === id ? updatedLead : l),
      contacts: [...state.contacts, contact],
      notifications: localDB.getNotifications(),
    }))

    // If deal created, update deals in state
    if (deal) {
      set(state => ({ deals: [...(state.deals || []), deal] }))
    }

    return { lead: updatedLead, contact, deal, task }
  },

  // ── Contacts ──────────────────────────────────────────────────────
  contacts: localDB.getContacts(),
  contactsLoading: false,
  contactsError: null,

  fetchContacts: () => {
    set({ contacts: localDB.getContacts(), contactsLoading: false })
  },

  addContact: (data) => {
    const newContact = localDB.createContact(data)
    set(state => ({ contacts: [...state.contacts, newContact] }))
    return newContact
  },

  updateContact: (id, patch) => {
    const updated = localDB.updateContact(id, patch)
    set(state => ({
      contacts: state.contacts.map(c => c.id === id ? updated : c)
    }))
    return updated
  },

  deleteContact: (id) => {
    localDB.deleteContact(id)
    set(state => ({ contacts: state.contacts.filter(c => c.id !== id) }))
  },

  // ── Deals ─────────────────────────────────────────────────────────
  deals: localDB.getDeals(),
  dealsLoading: false,
  dealsError: null,

  fetchDeals: () => {
    set({ deals: localDB.getDeals(), dealsLoading: false })
  },

  addDeal: (data) => {
    const newDeal = localDB.createDeal(data)
    set(state => ({ deals: [...state.deals, newDeal] }))
    return newDeal
  },

  updateDeal: (id, patch) => {
    const updated = localDB.updateDeal(id, patch)
    set(state => ({
      deals: state.deals.map(d => d.id === id ? updated : d)
    }))
    return updated
  },

  deleteDeal: (id) => {
    localDB.deleteDeal(id)
    set(state => ({ deals: state.deals.filter(d => d.id !== id) }))
  },

  // ── Tasks ─────────────────────────────────────────────────────────
  tasks: localDB.getTasks(),
  tasksLoading: false,
  tasksError: null,

  fetchTasks: () => {
    set({ tasks: localDB.getTasks(), tasksLoading: false })
  },

  addTask: (data) => {
    const newTask = localDB.createTask(data)
    set(state => ({ tasks: [...state.tasks, newTask] }))
    return newTask
  },

  updateTask: (id, patch) => {
    const updated = localDB.updateTask(id, patch)
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? updated : t)
    }))
    return updated
  },

  deleteTask: (id) => {
    localDB.deleteTask(id)
    set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }))
  },

  // ── Calls ─────────────────────────────────────────────────────────
  calls: localDB.getCalls(),
  callsLoading: false,
  callsError: null,

  fetchCalls: () => {
    set({ calls: localDB.getCalls(), callsLoading: false })
  },

  addCall: (data) => {
    const newCall = localDB.createCall(data)
    set(state => ({ calls: [...state.calls, newCall] }))
    return newCall
  },

  updateCall: (id, patch) => {
    const updated = localDB.updateCall(id, patch)
    set(state => ({
      calls: state.calls.map(c => c.id === id ? updated : c)
    }))
    return updated
  },

  deleteCall: (id) => {
    localDB.deleteCall(id)
    set(state => ({ calls: state.calls.filter(c => c.id !== id) }))
  },
}))

export default useStore
