import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import postsReducer from './slices/postsSlice'
import communitiesReducer from './slices/communitiesSlice'
import songbookReducer from './slices/songbookSlice'
import savesReducer from './slices/savesSlice'

export const store = configureStore({
  reducer: {
    auth:        authReducer,
    posts:       postsReducer,
    communities: communitiesReducer,
    songbook:    songbookReducer,
    saves:       savesReducer,
  },
})
