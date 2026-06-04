import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchSaved = createAsyncThunk('saves/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/saves/')
    return data
  } catch (err) { return rejectWithValue(err.response?.data) }
})

const savesSlice = createSlice({
  name: 'saves',
  initialState: { items: [], loading: false },
  reducers: {
    removeSaved(state, action) {
      state.items = state.items.filter(p => p.id !== action.payload)
    },
    addSaved(state, action) {
      if (!state.items.find(p => p.id === action.payload.id))
        state.items.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSaved.pending,   (s) => { s.loading = true })
      .addCase(fetchSaved.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.results || a.payload })
      .addCase(fetchSaved.rejected,  (s) => { s.loading = false })
  },
})

export const { removeSaved, addSaved } = savesSlice.actions
export default savesSlice.reducer
