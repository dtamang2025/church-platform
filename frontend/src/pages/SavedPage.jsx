import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSaved } from '../store/slices/savesSlice'
import PostCard from '../components/posts/PostCard'

export default function SavedPage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(s => s.saves)

  useEffect(() => { dispatch(fetchSaved()) }, [dispatch])

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold">Saved Songs</h2>
        <p className="text-stone-400 text-sm mt-1">{items.length} song{items.length !== 1 ? 's' : ''} saved</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2].map(i=><div key={i} className="h-48 bg-stone-100 rounded-2xl animate-pulse"/>)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <div className="text-5xl mb-3 opacity-30">🔖</div>
          <p className="text-base">No saved songs yet.</p>
          <p className="text-sm mt-1">Tap the Save button on any post to bookmark it here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}
