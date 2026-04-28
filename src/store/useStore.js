import { create } from 'zustand'

const useStore = create((set) => ({
  // Contacts
  contacts: [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1 234 567 8900', company: 'Tech Corp', status: 'Active', createdAt: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+1 234 567 8901', company: 'Design Studio', status: 'Active', createdAt: '2024-01-20' },
    { id: 3, name: 'Mike Wilson', email: 'mike@example.com', phone: '+1 234 567 8902', company: 'Marketing Pro', status: 'Inactive', createdAt: '2024-02-01' },
  ],
  addContact: (contact) => set((state) => ({
    contacts: [...state.contacts, { ...contact, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]
  })),
  updateContact: (id, updatedContact) => set((state) => ({
    contacts: state.contacts.map((c) => c.id === id ? { ...c, ...updatedContact } : c)
  })),
  deleteContact: (id) => set((state) => ({
    contacts: state.contacts.filter((c) => c.id !== id)
  })),

  // Leads
  leads: [
    { id: 1, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 8903', company: 'Startup Inc', status: 'New', source: 'Website', value: 50000, createdAt: '2024-02-10' },
    { id: 2, name: 'Bob Davis', email: 'bob@example.com', phone: '+1 234 567 8904', company: 'Enterprise Co', status: 'Contacted', source: 'Referral', value: 120000, createdAt: '2024-02-15' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', phone: '+1 234 567 8905', company: 'Small Biz', status: 'Qualified', source: 'LinkedIn', value: 35000, createdAt: '2024-02-20' },
  ],
  addLead: (lead) => set((state) => ({
    leads: [...state.leads, { ...lead, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]
  })),
  updateLead: (id, updatedLead) => set((state) => ({
    leads: state.leads.map((l) => l.id === id ? { ...l, ...updatedLead } : l)
  })),
  deleteLead: (id) => set((state) => ({
    leads: state.leads.filter((l) => l.id !== id)
  })),

  // Deals
  deals: [
    { id: 1, name: 'Enterprise Software License', contactId: 1, value: 150000, stage: 'Proposal', probability: 60, expectedClose: '2024-04-30', createdAt: '2024-02-01' },
    { id: 2, name: 'Website Redesign Project', contactId: 2, value: 45000, stage: 'Negotiation', probability: 75, expectedClose: '2024-03-15', createdAt: '2024-02-10' },
    { id: 3, name: 'Marketing Campaign', contactId: 3, value: 80000, stage: 'Qualification', probability: 30, expectedClose: '2024-05-20', createdAt: '2024-02-20' },
  ],
  addDeal: (deal) => set((state) => ({
    deals: [...state.deals, { ...deal, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]
  })),
  updateDeal: (id, updatedDeal) => set((state) => ({
    deals: state.deals.map((d) => d.id === id ? { ...d, ...updatedDeal } : d)
  })),
  deleteDeal: (id) => set((state) => ({
    deals: state.deals.filter((d) => d.id !== id)
  })),

  // Tasks
  tasks: [
    { id: 1, title: 'Follow up with John Smith', description: 'Discuss the proposal details', dueDate: '2024-03-01', priority: 'High', status: 'Pending', relatedTo: 'Contact', relatedId: 1 },
    { id: 2, title: 'Send contract to Sarah', description: 'Prepare and send the contract', dueDate: '2024-03-05', priority: 'Medium', status: 'In Progress', relatedTo: 'Deal', relatedId: 2 },
    { id: 3, title: 'Call Alice Brown', description: 'Initial discovery call', dueDate: '2024-03-10', priority: 'High', status: 'Pending', relatedTo: 'Lead', relatedId: 1 },
  ],
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: Date.now() }]
  })),
  updateTask: (id, updatedTask) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updatedTask } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),
}))

export default useStore
