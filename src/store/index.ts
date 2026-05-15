// Copyright 2018-present the liuzi6612. All rights reserved. MIT license.
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import systemReducer from './systemSlice'
import companyReducer from './companySlice'
import { authMiddleware } from '@/store/middlewares'

const rootReducer = combineReducers({
  user: userReducer,
  system: systemReducer,
  company: companyReducer,
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
})

export default store

export type IStore = typeof store
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export type GetState = () => RootState
