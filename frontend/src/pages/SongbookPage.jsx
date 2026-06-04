import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, X, Search } from 'lucide-react'
import { fetchSongs, createSong } from '../store/slices/songbookSlice'
import SongCard from '../components/songbook/SongCard'
import ChordEditor from '../components/chord/ChordEditor'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const CATEGORIES = ['all','worship','gospel','youth','traditional','contemporary']
const LANGUAGES  = ['english','hindi','spanish','french','portuguese']

export default function SongbookPage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(s => s.songbook)
  const { isAdmin } = useAuth()
  const [cat, setCat]       = useState('all')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [form, setForm] = useState({
    title: '', author_name: '', category: 'worship', language: 'english',
    description: '', lyrics: [{ line: '', chords: [] }],
  })

  useEffect(() => { dispatch(fetchSongs()) }, [dispatch])

  const filtered = items.filter(s => {
    const matchCat  = cat === 'all' || s.category === cat
    const matchSrch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.author_name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSrch
  })

  const handleAdd = async () => {
    if (!form.title.trim()) return toast.error('Title required')
    setSaving(true)
    try {
      await dispatch(createSong(form)).unwrap()
      toast.success('Song added to songbook!')
      setShowAdd(false)
      setForm({ title:'', author_name:'', category:'worship', language:'english', description:'', lyrics:[{line:'',chords:[]}] })
    } catch { toast.error('Failed to add song') }
    finally { setSaving(false) }
  }

  return (
    <div>
      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={e => e.target===e.currentTarget && setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-stone-100">
              <h2 className="font-serif text-2xl font-semibold">Add to Songbook</h2>
              <button onClick={() => setShowAdd(false)} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
            </div>
            <div className="px-7 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1.5">Title *</label>
                  <input className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                    placeholder="Amazing Grace" value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1.5">Author / Artist</label>
                  <input className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                    placeholder="John Newton" value={form.author_name} onChange={e => setForm(f=>({...f,author_name:e.target.value}))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1.5">Category</label>
                  <select className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
                    value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                    {CATEGORIES.filter(c=>c!=='all').map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-1.5">Language</label>
                  <select className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
                    value={form.language} onChange={e => setForm(f=>({...f,language:e.target.value}))}>
                    {LANGUAGES.map(l=><option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">Description</label>
                <textarea className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 resize-none h-16"
                  value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1">Lyrics & Chords</label>
                <p className="text-xs text-stone-400 mb-2">Use <code className="bg-stone-100 px-1 rounded">G@0,C@8</code> format for chord positions</p>
                <ChordEditor value={form.lyrics} onChange={v=>setForm(f=>({...f,lyrics:v}))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-7 py-5 border-t border-stone-100">
              <button onClick={()=>setShowAdd(false)} className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50">Cancel</button>
              <button onClick={handleAdd} disabled={saving} className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                {saving ? 'Adding…' : 'Add Song'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold">Songbook</h2>
          <p className="text-stone-400 text-sm mt-1">{isAdmin ? 'Admin — manage the global song library' : 'Browse the curated song library'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowAdd(true)} className="btn-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm">
            <Plus size={16} /> Add Song
          </button>
        )}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-purple-400"
            placeholder="Search songs by title or artist…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                cat === c ? 'btn-gradient' : 'border border-stone-200 text-stone-500 hover:border-purple-300 hover:text-purple-600'
              }`}>{c}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i=><div key={i} className="h-20 bg-stone-100 rounded-2xl animate-pulse"/>)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-3 opacity-30">📖</div>
          <p>No songs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => <SongCard key={s.id} song={s} />)}
        </div>
      )}
    </div>
  )
}
