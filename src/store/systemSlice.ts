// Copyright 2018-present the liuzi6612. All rights reserved. MIT license.
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { serviceGetSystemInfo } from '@/services'
import type { GetState, AppDispatch } from '.'

export interface InfoProps {
  mysqlVersion: string
  currentSystemTime: number
  freemem: number
  totalmem: number
  platform: string
  type: string
  hostname: string
  arch: string
  nodeVersion: string
  cpus: any[]
}

export interface SystemState {
  info: InfoProps
}

const initialState: SystemState = {
  info: {
    mysqlVersion: '',
    currentSystemTime: Date.now(),
    freemem: 0,
    totalmem: 0,
    platform: '',
    type: '',
    hostname: '',
    arch: '',
    nodeVersion: '',
    cpus: [],
  },
}

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    SET_INFO: (state, action: PayloadAction<InfoProps>) => {
      state.info = {
        ...action.payload,
        arch: action.payload.arch.slice(1),
      }
    },
  },
})

export const { SET_INFO } = systemSlice.actions

export const getSystemInfo =
  () => (dispatch: AppDispatch, getState: GetState) => {
    const rootState = getState()
    if (rootState.system.info.nodeVersion) {
      return
    }

    serviceGetSystemInfo().then((res) => {
      dispatch(SET_INFO(res as InfoProps))
    })
  }

export default systemSlice.reducer
