import { useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const titles = {
  '/':             'Community Feed',
  '/communities':  'Communities',
  '/songbook':     'Songbook',
  '/saved':        'Saved Songs',
  '/profile':      'My Profile',
}

export default function Topbar() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const title = titles[pathname] || 'Praise'

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-200 px-8 py-4 flex items-center justify-between">
      <h1 className="font-serif text-xl font-semibold text-stone-800">{title}</h1>
      <div className="flex items-center gap-3 text-sm text-stone-400">
        <span>{user?.email}</span>
        {user?.global_role === 'admin' && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Admin</span>
        )}
      </div>
    </header>
  )
}
