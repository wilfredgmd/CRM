import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
