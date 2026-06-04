import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, X } from 'lucide-react'
import { fetchCommunities, createCommunity } from '../store/slices/communitiesSlice'
import CommunityCard from '../components/communities/CommunityCard'
import toast from 'react-hot-toast'

const TABS = [['all','All'],['mine','Joined'],['discover','Discover']]

export default function CommunitiesPage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(s => s.communities)
  const [tab, setTab] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { dispatch(fetchCommunities()) }, [dispatch])

  const filtered = items.filter(c => {
    if (tab === 'mine')     return c.is_member
    if (tab === 'discover') return !c.is_member
    return true
  })

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error('Name required')
    setSaving(true)
    try {
      await dispatch(createCommunity(form)).unwrap()
      toast.success('Community created!')
      setShowCreate(false)
      setForm({ name: '', description: '' })
    } catch { toast.error('Failed to create') }
    finally { setSaving(false) }
  }

  return (
    <div>
      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold">Create Community</h2>
              <button onClick={() => setShowCreate(false)} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">Community Name *</label>
                <input className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400"
                  placeholder="Grace Community Church" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">Description</label>
                <textarea className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 resize-none h-24"
                  placeholder="Describe your community…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setShowCreate(false)} className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50">Cancel</button>
              <button onClick={handleCreate} disabled={saving} className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                {saving ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Communities</h2>
          <p className="text-stone-400 text-sm mt-1">Church communities you belong to</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm">
          <Plus size={16} /> New Community
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === v ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-52 bg-stone-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-3 opacity-30">⛪</div>
          <p>No communities found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(c => <CommunityCard key={c.id} community={c} />)}
        </div>
      )}
    </div>
  )
}
