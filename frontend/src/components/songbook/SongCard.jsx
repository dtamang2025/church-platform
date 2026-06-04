import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Eye, Trash2, Music } from 'lucide-react'
import { deleteSong } from '../../store/slices/songbookSlice'
import { useAuth } from '../../hooks/useAuth'
import LyricsDisplay from '../chord/LyricsDisplay'
import toast from 'react-hot-toast'

const CAT_COLORS = {
  worship:      'bg-purple-100 text-purple-700',
  gospel:       'bg-amber-100 text-amber-700',
  youth:        'bg-green-100 text-green-700',
  traditional:  'bg-blue-100 text-blue-700',
  contemporary: 'bg-pink-100 text-pink-700',
}

export default function SongCard({ song }) {
  const dispatch = useDispatch()
  const { isAdmin } = useAuth()
  const [expanded, setExpanded] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete "${song.title}"?`)) return
    await dispatch(deleteSong(song.id))
    toast('Song removed from songbook')
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-md hover:border-stone-300 transition-all fade-up">
      <div className="flex items-start gap-4 p-5">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center flex-shrink-0">
          <Music size={20} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-stone-900 text-base">{song.title}</h3>
          <p className="text-sm text-stone-400 mb-2">{song.author_name}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CAT_COLORS[song.category] || CAT_COLORS.worship}`}>
              {song.category}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">{song.language}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-600 hover:border-purple-300 hover:text-purple-600 transition-all">
            <Eye size={13} /> {expanded ? 'Hide' : 'View'}
          </button>
          {isAdmin && (
            <button onClick={handleDelete}
              className="p-1.5 rounded-xl border border-stone-200 text-stone-400 hover:border-red-300 hover:text-red-500 transition-all">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-stone-100">
          {song.description && <p className="text-sm text-stone-500 mb-3">{song.description}</p>}
          <LyricsDisplay lyrics={song.lyrics} />
        </div>
      )}
    </div>
  )
}
