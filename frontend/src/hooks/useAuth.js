import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice'

export function useAuth() {
  const dispatch = useDispatch()
  const { user, token, loading, error } = useSelector((s) => s.auth)
  return {
    user,
    token,
    loading,
    error,
    isAdmin:      user?.global_role === 'admin',
    isAuthed:     !!token,
    logout:       () => dispatch(logout()),
  }
}
