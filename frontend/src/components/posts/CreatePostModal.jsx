import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { X, Plus } from 'lucide-react'
import { createPost } from '../../store/slices/postsSlice'
import ChordEditor from '../chord/ChordEditor'
import toast from 'react-hot-toast'

const LANGUAGES = ['english','hindi','spanish','french','portuguese']
const PRESET_TAGS = ['worship','gospel','youth','traditional','contemporary','hymn']

export default function CreatePostModal({ onClose }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    title: '', description: '', lyrics: [{ line: '', chords: [] }],
    tags: [], language: 'english', visibility: 'public',
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addTag = (t) => {
    const tag = (t || tagInput).trim().toLowerCase()
    if (tag && !form.tags.includes(tag)) set('tags', [...form.tags, tag])
    setTagInput('')
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error('Title is required')
    setSaving(true)
    try {
      await dispatch(createPost(form)).unwrap()
      toast.success('Post published!')
      onClose()
    } catch (e) {
      toast.error('Failed to publish')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-stone-100">
          <h2 className="font-serif text-2xl font-semibold">Share a Song</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
        </div>

        <div className="px-7 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Song Title *</label>
            <input className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
              placeholder="Amazing Grace" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">Description</label>
            <textarea className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 resize-y min-h-16"
              placeholder="Arrangement notes, key, tempo…" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          {/* Language + Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Language</label>
              <select className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
                value={form.language} onChange={e => set('language', e.target.value)}>
                {LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Visibility</label>
              <select className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-white"
                value={form.visibility} onChange={e => set('visibility', e.target.value)}>
                <option value="public">🌐 Public</option>
                <option value="community">🔒 Community Only</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_TAGS.map(t => (
                <button key={t} type="button"
                  onClick={() => form.tags.includes(t) ? set('tags', form.tags.filter(x => x !== t)) : addTag(t)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    form.tags.includes(t) ? 'bg-purple-600 text-white border-purple-600' : 'border-stone-200 text-stone-500 hover:border-purple-300'
                  }`}>{t}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                placeholder="Custom tag…" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()} />
              <button type="button" onClick={() => addTag()}
                className="px-3 py-2 border border-stone-200 rounded-xl text-stone-500 hover:border-purple-400 transition-all">
                <Plus size={15} />
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                    {t}
                    <button onClick={() => set('tags', form.tags.filter(x => x !== t))} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Chord editor */}
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Lyrics & Chords</label>
            <p className="text-xs text-stone-400 mb-2">Enter chord positions as <code className="bg-stone-100 px-1 rounded">CHORD@charPosition</code> e.g. <code className="bg-stone-100 px-1 rounded">G@0,C@8,D@14</code></p>
            <ChordEditor value={form.lyrics} onChange={v => set('lyrics', v)} />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-7 py-5 border-t border-stone-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-60">
            {saving ? 'Publishing…' : 'Publish Post'}
          </button>
        </div>
      </div>
    </div>
  )
}
