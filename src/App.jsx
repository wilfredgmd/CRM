import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Leads from './pages/Leads'
import Deals from './pages/Deals'
import DealDetail from './pages/DealDetail'
import Tasks from './pages/Tasks'
import Reports from './pages/Reports'
import AIInsights from './pages/AIInsights'
import Calls from './pages/Calls'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import useStore from './store/useStore'

function App() {
  const { isAuthenticated } = useStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Dashboard />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="leads" element={<Leads />} />
          <Route path="deals" element={<Deals />} />
          <Route path="deals/:dealId" element={<DealDetail />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="reports" element={<Reports />} />
          <Route path="ai-insights" element={<AIInsights />} />
          <Route path="calls" element={<Calls />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
