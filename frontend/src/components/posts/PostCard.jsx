import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Heart, ThumbsUp, HandMetal, Bookmark, Trash2, Eye, EyeOff, Globe, Lock } from 'lucide-react'
import { reactToPost, toggleSave, deletePost } from '../../store/slices/postsSlice'
import { removeSaved, addSaved } from '../../store/slices/savesSlice'
import { useAuth } from '../../hooks/useAuth'
import LyricsDisplay from '../chord/LyricsDisplay'
import toast from 'react-hot-toast'

const REACTIONS = [
  { type: 'like',  emoji: '👍', label: 'Like',  Icon: ThumbsUp },
  { type: 'love',  emoji: '❤️', label: 'Love',  Icon: Heart },
  { type: 'amen',  emoji: '🙏', label: 'Amen',  Icon: HandMetal },
]

export default function PostCard({ post }) {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const [expanded, setExpanded] = useState(false)

  const isOwn = user?.id === post.author?.id
  const totalReactions = Object.values(post.reactions_count || {}).reduce((a, b) => a + b, 0)

  const handleReact = (type) => {
    dispatch(reactToPost({ postId: post.id, reactionType: type }))
  }

  const handleSave = () => {
    dispatch(toggleSave(post.id))
    if (post.is_saved) {
      dispatch(removeSaved(post.id))
      toast('Removed from saved')
    } else {
      dispatch(addSaved(post))
      toast.success('Saved!')
    }
  }

  const handleDelete = () => {
    if (confirm('Delete this post?')) {
      dispatch(deletePost(post.id))
      toast('Post deleted')
    }
  }

  const avatarColor = `hsl(${(post.author?.id || 0) * 57 % 360}, 60%, 55%)`
  const dateStr = new Date(post.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <article className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-stone-300 transition-all fade-up">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
               style={{ background: avatarColor }}>
            {post.author?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-sm text-stone-800">{post.author?.username}</div>
            <div className="text-xs text-stone-400">{dateStr}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {post.community && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
              {post.community.name}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-stone-400">
            {post.visibility === 'public' ? <Globe size={11} /> : <Lock size={11} />}
            {post.visibility}
          </span>
          {isOwn && (
            <button onClick={handleDelete} className="text-stone-300 hover:text-red-400 transition-colors p-1">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-4">
        <h3 className="font-serif text-xl font-semibold text-stone-900 mb-1 leading-snug">{post.title}</h3>
        {post.description && <p className="text-sm text-stone-500 mb-3">{post.description}</p>}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(post.tags || []).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{t}</span>
          ))}
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700">{post.language}</span>
        </div>

        {/* Lyrics toggle */}
        {expanded ? (
          <>
            <LyricsDisplay lyrics={post.lyrics} />
            <button onClick={() => setExpanded(false)}
              className="mt-3 flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors">
              <EyeOff size={13} /> Hide lyrics
            </button>
          </>
        ) : (
          <button onClick={() => setExpanded(true)}
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors border border-purple-200 rounded-lg px-3 py-1.5">
            <Eye size={14} /> View Lyrics & Chords
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-stone-100 px-5 py-3 flex items-center gap-2 flex-wrap">
        {REACTIONS.map(r => (
          <button key={r.type}
            onClick={() => handleReact(r.type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              post.user_reaction === r.type
                ? 'bg-purple-100 border-purple-300 text-purple-700'
                : 'border-stone-200 text-stone-500 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600'
            }`}>
            <span>{r.emoji}</span>
            <span>{(post.reactions_count?.[r.type]) || 0}</span>
            <span>{r.label}</span>
          </button>
        ))}
        <button onClick={handleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ml-auto ${
            post.is_saved
              ? 'bg-purple-100 border-purple-300 text-purple-700'
              : 'border-stone-200 text-stone-500 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600'
          }`}>
          <Bookmark size={13} fill={post.is_saved ? 'currentColor' : 'none'} />
          {post.is_saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  )
}
