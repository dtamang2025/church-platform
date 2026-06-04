import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus } from 'lucide-react'
import { fetchPosts } from '../store/slices/postsSlice'
import PostCard from '../components/posts/PostCard'
import CreatePostModal from '../components/posts/CreatePostModal'

const TABS = [
  { key: 'all',       label: 'All Posts' },
  { key: 'following', label: 'Following' },
  { key: 'mine',      label: 'My Posts' },
]

export default function FeedPage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(s => s.posts)
  const [tab, setTab] = useState('all')
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    dispatch(fetchPosts({ feed: tab }))
  }, [tab, dispatch])

  return (
    <div>
      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-stone-900">Community Feed</h2>
          <p className="text-stone-400 text-sm mt-1">Songs & lyrics from the community</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="btn-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm">
          <Plus size={16} /> Share Song
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-stone-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-3 opacity-30">🎵</div>
          <p className="text-base">No posts yet — be the first to share a song!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
