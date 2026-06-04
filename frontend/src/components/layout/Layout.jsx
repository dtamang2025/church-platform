import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: 240 }}>
        <Topbar />
        <main className="flex-1 p-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
