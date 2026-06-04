import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { joinCommunity } from '../../store/slices/communitiesSlice'
import toast from 'react-hot-toast'

const ROLE_STYLES = {
  admin:        'bg-red-100 text-red-700',
  pastor:       'bg-blue-100 text-blue-700',
  youth_leader: 'bg-green-100 text-green-700',
  choir_member: 'bg-amber-100 text-amber-700',
  member:       'bg-stone-100 text-stone-600',
}

const BANNERS = [
  'from-purple-600 to-purple-400',
  'from-indigo-600 to-blue-400',
  'from-fuchsia-600 to-pink-400',
  'from-violet-600 to-purple-400',
]

export default function CommunityCard({ community }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const banner = BANNERS[community.id % BANNERS.length]

  const handleJoin = async (e) => {
    e.stopPropagation()
    try {
      const res = await dispatch(joinCommunity(community.id)).unwrap()
      toast.success(res.joined ? `Joined ${community.name}!` : `Left ${community.name}`)
    } catch {
      toast.error('Action failed')
    }
  }

  return (
    <div onClick={() => navigate(`/communities/${community.id}`)}
      className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-stone-300 transition-all cursor-pointer fade-up">
      {/* Banner */}
      <div className={`h-20 bg-gradient-to-r ${banner}`} />

      <div className="px-4 pb-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white border-2 border-white shadow-md -mt-6 mb-3 flex items-center justify-center text-2xl">
          ⛪
        </div>

        <h3 className="font-semibold text-stone-900 text-base mb-1 line-clamp-1">{community.name}</h3>
        <p className="text-sm text-stone-500 mb-3 line-clamp-2 leading-relaxed">{community.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-stone-400">
              <Users size={12} /> {community.members_count}
            </span>
            {community.is_member && community.user_role && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[community.user_role] || ROLE_STYLES.member}`}>
                {community.user_role.replace('_', ' ')}
              </span>
            )}
          </div>
          <button
            onClick={handleJoin}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              community.is_member
                ? 'border border-stone-200 text-stone-500 hover:border-red-300 hover:text-red-500'
                : 'btn-gradient'
            }`}>
            {community.is_member ? 'Leave' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  )
}
