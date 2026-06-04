import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeft, Users } from 'lucide-react'
import { fetchCommunities, fetchMembers, assignRole } from '../store/slices/communitiesSlice'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const ROLES = ['admin','pastor','youth_leader','choir_member','member']
const ROLE_STYLES = {
  admin: 'bg-red-100 text-red-700', pastor: 'bg-blue-100 text-blue-700',
  youth_leader: 'bg-green-100 text-green-700', choir_member: 'bg-amber-100 text-amber-700',
  member: 'bg-stone-100 text-stone-600',
}

export default function CommunityDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const community = useSelector(s => s.communities.items.find(c => c.id === parseInt(id)))
  const members   = useSelector(s => s.communities.members[id] || [])

  useEffect(() => {
    dispatch(fetchCommunities())
    dispatch(fetchMembers(id))
  }, [id, dispatch])

  const isAdmin = community?.user_role === 'admin' || community?.owner?.id === user?.id

  const handleRoleChange = async (userId, role) => {
    try {
      await dispatch(assignRole({ communityId: id, userId, role })).unwrap()
      toast.success('Role updated')
    } catch { toast.error('Failed to update role') }
  }

  if (!community) return (
    <div className="text-center py-20 text-stone-400">
      <p>Community not found</p>
    </div>
  )

  return (
    <div>
      <button onClick={() => navigate('/communities')} className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Communities
      </button>

      {/* Banner */}
      <div className="h-32 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-400 mb-6 relative">
        <div className="absolute bottom-4 left-6 text-white">
          <div className="font-serif text-3xl font-semibold">{community.name}</div>
          <div className="text-purple-200 text-sm flex items-center gap-2 mt-1">
            <Users size={13} /> {community.members_count} members
          </div>
        </div>
      </div>

      <p className="text-stone-500 mb-8">{community.description}</p>

      {/* Members */}
      <div>
        <h3 className="font-serif text-xl font-semibold mb-4">Members</h3>
        {members.length === 0 ? (
          <p className="text-stone-400 text-sm">No members loaded</p>
        ) : (
          <div className="space-y-3">
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-4 bg-white border border-stone-200 rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {m.user?.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{m.user?.username}</div>
                  <div className="text-xs text-stone-400">{m.user?.email}</div>
                </div>
                {isAdmin ? (
                  <select
                    value={m.role}
                    onChange={e => handleRoleChange(m.user.id, e.target.value)}
                    className="border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-purple-400 bg-white">
                    {ROLES.map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
                  </select>
                ) : (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_STYLES[m.role] || ROLE_STYLES.member}`}>
                    {m.role?.replace('_',' ')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
