import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Edit2, Check, X } from 'lucide-react'
import { updateProfile } from '../store/slices/authSlice'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user, isAdmin } = useAuth()
  const posts       = useSelector(s => s.posts.items.filter(p => p.author?.id === user?.id))
  const saved       = useSelector(s => s.saves.items)
  const communities = useSelector(s => s.communities.items.filter(c => c.is_member))

  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(user?.bio || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await dispatch(updateProfile({ bio })).unwrap()
      toast.success('Profile updated')
      setEditing(false)
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  const initials = user?.username?.[0]?.toUpperCase() || 'U'

  return (
    <div className="max-w-2xl">
      {/* Profile card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-7 mb-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white text-3xl font-semibold font-serif flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-serif text-2xl font-semibold">{user?.username}</h2>
              {isAdmin && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">Platform Admin</span>}
            </div>
            <p className="text-stone-400 text-sm mb-3">{user?.email}</p>

            {editing ? (
              <div>
                <textarea
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 resize-none h-20 mb-2"
                  value={bio} onChange={e => setBio(e.target.value)}
                  placeholder="Tell the community about yourself…"
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving}
                    className="btn-gradient flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-60">
                    <Check size={14} /> {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={() => { setBio(user?.bio||''); setEditing(false) }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-stone-200 text-stone-600 hover:bg-stone-50">
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-stone-600 mb-3">{bio || <span className="text-stone-400 italic">No bio yet</span>}</p>
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors border border-purple-200 rounded-xl px-4 py-2">
                  <Edit2 size={13} /> Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Posts',       value: posts.length },
          { label: 'Saved',       value: saved.length },
          { label: 'Communities', value: communities.length },
        ].map(s => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-2xl p-5 text-center shadow-sm">
            <div className="font-serif text-3xl font-semibold text-purple-600">{s.value}</div>
            <div className="text-xs text-stone-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* My posts */}
      <h3 className="font-serif text-xl font-semibold mb-4">My Posts</h3>
      {posts.length === 0 ? (
        <div className="text-center py-12 text-stone-400 bg-white rounded-2xl border border-stone-200">
          <div className="text-4xl mb-2 opacity-30">🎵</div>
          <p className="text-sm">You haven't shared any songs yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="flex items-center gap-4 bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-stone-900 truncate">{p.title}</div>
                <div className="text-xs text-stone-400 mt-0.5">{new Date(p.created_at).toLocaleDateString()}</div>
              </div>
              <div className="text-sm text-stone-400 flex-shrink-0">
                {Object.values(p.reactions_count || {}).reduce((a,b)=>a+b,0)} reactions
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
