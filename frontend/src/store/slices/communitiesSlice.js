import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchCommunities = createAsyncThunk('communities/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/communities/', { params })
    return data
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const createCommunity = createAsyncThunk('communities/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/communities/', payload)
    return data
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const joinCommunity = createAsyncThunk('communities/join', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/communities/${id}/join/`)
    return { id, joined: data.joined }
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const fetchMembers = createAsyncThunk('communities/members', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/communities/${id}/members/`)
    return { id, members: data }
  } catch (err) { return rejectWithValue(err.response?.data) }
})

export const assignRole = createAsyncThunk('communities/assignRole', async ({ communityId, userId, role }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/communities/${communityId}/members/${userId}/role/`, { role })
    return { communityId, member: data }
  } catch (err) { return rejectWithValue(err.response?.data) }
})

const communitiesSlice = createSlice({
  name: 'communities',
  initialState: { items: [], members: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunities.pending,   (s) => { s.loading = true })
      .addCase(fetchCommunities.fulfilled, (s, a) => {
        s.loading = false
        s.items   = a.payload.results || a.payload
      })
      .addCase(fetchCommunities.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(createCommunity.fulfilled,  (s, a) => { s.items.unshift(a.payload) })
      .addCase(joinCommunity.fulfilled,    (s, a) => {
        const c = s.items.find(x => x.id === a.payload.id)
        if (!c) return
        c.is_member    = a.payload.joined
        c.members_count = c.members_count + (a.payload.joined ? 1 : -1)
        if (!a.payload.joined) c.user_role = null
        else c.user_role = 'member'
      })
      .addCase(fetchMembers.fulfilled, (s, a) => {
        s.members[a.payload.id] = a.payload.members
      })
      .addCase(assignRole.fulfilled, (s, a) => {
        const list = s.members[a.payload.communityId]
        if (!list) return
        const idx = list.findIndex(m => m.id === a.payload.member.id)
        if (idx !== -1) list[idx] = a.payload.member
      })
  },
})

export default communitiesSlice.reducer
