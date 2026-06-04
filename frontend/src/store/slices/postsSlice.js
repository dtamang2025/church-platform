import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchPosts = createAsyncThunk('posts/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/posts/', { params })
    return data
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const createPost = createAsyncThunk('posts/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/posts/', payload)
    return data
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const deletePost = createAsyncThunk('posts/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/posts/${id}/`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const reactToPost = createAsyncThunk('posts/react', async ({ postId, reactionType }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/reactions/posts/${postId}/react/`, { reaction_type: reactionType })
    return { postId, ...data, reactionType }
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const toggleSave = createAsyncThunk('posts/toggleSave', async (postId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/saves/posts/${postId}/toggle/`)
    return { postId, saved: data.saved }
  } catch (err) { return rejectWithValue(err.response?.data) }
})

const postsSlice = createSlice({
  name: 'posts',
  initialState: { items: [], loading: false, error: null, count: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending,   (s) => { s.loading = true })
      .addCase(fetchPosts.fulfilled, (s, a) => {
        s.loading = false
        s.items   = a.payload.results || a.payload
        s.count   = a.payload.count   || (a.payload.results || a.payload).length
      })
      .addCase(fetchPosts.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(createPost.fulfilled, (s, a) => { s.items.unshift(a.payload) })
      .addCase(deletePost.fulfilled, (s, a) => { s.items = s.items.filter(p => p.id !== a.payload) })
      .addCase(reactToPost.fulfilled, (s, a) => {
        const post = s.items.find(p => p.id === a.payload.postId)
        if (!post) return
        const prev = post.user_reaction
        const counts = { ...post.reactions_count }
        if (prev) counts[prev] = Math.max(0, (counts[prev] || 1) - 1)
        if (a.payload.reacted) {
          counts[a.payload.reactionType] = (counts[a.payload.reactionType] || 0) + 1
          post.user_reaction = a.payload.reactionType
        } else {
          post.user_reaction = null
        }
        post.reactions_count = counts
      })
      .addCase(toggleSave.fulfilled, (s, a) => {
        const post = s.items.find(p => p.id === a.payload.postId)
        if (post) post.is_saved = a.payload.saved
      })
  },
})

export default postsSlice.reducer
