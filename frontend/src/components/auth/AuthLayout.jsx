import { Music } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-stone-50 to-purple-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 shadow-lg mb-4">
            <Music size={26} className="text-white" />
          </div>
          <h1 className="font-serif text-4xl font-semibold text-purple-700">Praise</h1>
          <p className="text-stone-500 text-sm mt-1">Church Music & Community Platform</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100">
          <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-1">{title}</h2>
          {subtitle && <p className="text-stone-400 text-sm mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}
