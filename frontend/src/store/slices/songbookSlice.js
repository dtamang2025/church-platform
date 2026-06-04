import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchSongs = createAsyncThunk('songbook/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/songbook/', { params })
    return data
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const createSong = createAsyncThunk('songbook/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/songbook/', payload)
    return data
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const updateSong = createAsyncThunk('songbook/update', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/songbook/${id}/`, payload)
    return data
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const deleteSong = createAsyncThunk('songbook/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/songbook/${id}/`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data) }
})

const songbookSlice = createSlice({
  name: 'songbook',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending,   (s) => { s.loading = true })
      .addCase(fetchSongs.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.results || a.payload })
      .addCase(fetchSongs.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(createSong.fulfilled, (s, a) => { s.items.unshift(a.payload) })
      .addCase(updateSong.fulfilled, (s, a) => {
        const idx = s.items.findIndex(x => x.id === a.payload.id)
        if (idx !== -1) s.items[idx] = a.payload
      })
      .addCase(deleteSong.fulfilled, (s, a) => { s.items = s.items.filter(x => x.id !== a.payload) })
  },
})

export default songbookSlice.reducer
