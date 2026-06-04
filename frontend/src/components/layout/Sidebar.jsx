import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Users, BookOpen, Bookmark, User, LogOut, Music } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const nav = [
  { to: '/',            label: 'Feed',        icon: Home },
  { to: '/communities', label: 'Communities', icon: Users },
  { to: '/songbook',    label: 'Songbook',    icon: BookOpen },
  { to: '/saved',       label: 'Saved',       icon: Bookmark },
  { to: '/profile',     label: 'Profile',     icon: User },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-stone-200 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-stone-100">
        <div className="font-serif text-2xl font-semibold text-purple-600 flex items-center gap-2">
          <Music size={20} />
          Praise
        </div>
        <div className="text-xs text-stone-400 tracking-widest uppercase mt-1">Church Music Platform</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ` +
              (isActive
                ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-sm'
                : 'text-stone-500 hover:bg-purple-50 hover:text-purple-600')
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User chip */}
      <div className="p-3 border-t border-stone-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-stone-50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-stone-700 truncate">{user?.username}</div>
            <div className="text-xs text-stone-400 capitalize">{user?.global_role}</div>
          </div>
          <button onClick={handleLogout} title="Logout" className="text-stone-400 hover:text-red-500 transition-colors p-1">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
