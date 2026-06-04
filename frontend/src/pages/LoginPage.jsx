import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUser, clearError } from '../store/slices/authSlice'
import { useAuth } from '../hooks/useAuth'
import AuthLayout from '../components/auth/AuthLayout'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { loading, error, isAuthed } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => { if (isAuthed) navigate('/') }, [isAuthed])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(loginUser(form)).unwrap()
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err?.detail || 'Invalid credentials')
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Email</label>
          <input type="email" required
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="you@church.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Password</label>
          <input type="password" required
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="••••••••"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>

        <button type="submit" disabled={loading}
          className="btn-gradient w-full py-3 rounded-xl text-sm font-semibold mt-2 disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-stone-400 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-purple-600 font-medium hover:underline">Create one</Link>
      </p>

      <div className="mt-6 p-4 bg-stone-50 rounded-xl text-xs text-stone-500 space-y-1">
        <p className="font-semibold text-stone-600 mb-1">Demo credentials</p>
        <p>👤 john@church.com — User@1234</p>
        <p>🛡️ admin@church.com — Admin@1234</p>
      </div>
    </AuthLayout>
  )
}
