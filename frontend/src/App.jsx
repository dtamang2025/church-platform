import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchProfile } from './store/slices/authSlice'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FeedPage from './pages/FeedPage'
import CommunitiesPage from './pages/CommunitiesPage'
import SongbookPage from './pages/SongbookPage'
import SavedPage from './pages/SavedPage'
import ProfilePage from './pages/ProfilePage'
import CommunityDetailPage from './pages/CommunityDetailPage'

function RequireAuth({ children }) {
  const { isAuthed } = useAuth()
  return isAuthed ? children : <Navigate to="/login" replace />
}

export default function App() {
  const dispatch = useDispatch()
  const { token } = useAuth()

  useEffect(() => {
    if (token) dispatch(fetchProfile())
  }, [token, dispatch])

  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index                          element={<FeedPage />} />
        <Route path="communities"             element={<CommunitiesPage />} />
        <Route path="communities/:id"         element={<CommunityDetailPage />} />
        <Route path="songbook"                element={<SongbookPage />} />
        <Route path="saved"                   element={<SavedPage />} />
        <Route path="profile"                 element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
