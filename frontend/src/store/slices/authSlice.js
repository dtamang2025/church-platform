import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login/', credentials)
    localStorage.setItem('access',  data.access)
    localStorage.setItem('refresh', data.refresh)
    const profile = await api.get('/auth/profile/')
    return profile.data
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Login failed' })
  }
})

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register/', payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data || { detail: 'Registration failed' })
  }
})

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/profile/')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.patch('/auth/profile/', payload)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,
    token:   localStorage.getItem('access') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user  = null
      state.token = null
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
    },
    clearError(state) { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,   (s) => { s.loading = true;  s.error = null })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload })
      .addCase(loginUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(registerUser.pending,   (s) => { s.loading = true;  s.error = null })
      .addCase(registerUser.fulfilled, (s) => { s.loading = false })
      .addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchProfile.fulfilled, (s, a) => { s.user = a.payload })
      .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
