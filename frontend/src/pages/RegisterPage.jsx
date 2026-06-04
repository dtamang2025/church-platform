import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerUser } from '../store/slices/authSlice'
import AuthLayout from '../components/auth/AuthLayout'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password2) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await dispatch(registerUser(form)).unwrap()
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      const msgs = Object.values(err || {}).flat()
      toast.error(msgs[0] || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <AuthLayout title="Create account" subtitle="Join the worship community">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Username</label>
          <input required className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
            placeholder="worship_leader" value={form.username} onChange={set('username')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Email</label>
          <input type="email" required className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
            placeholder="you@church.com" value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Password</label>
          <input type="password" required className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
            placeholder="Min 8 characters" value={form.password} onChange={set('password')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1.5">Confirm Password</label>
          <input type="password" required className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
            placeholder="••••••••" value={form.password2} onChange={set('password2')} />
        </div>
        <button type="submit" disabled={loading}
          className="btn-gradient w-full py-3 rounded-xl text-sm font-semibold mt-2 disabled:opacity-60">
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-sm text-stone-400 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-purple-600 font-medium hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  )
}
