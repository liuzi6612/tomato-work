// Copyright 2018-present the liuzi6612. All rights reserved. MIT license.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { serviceGetAllCompany } from '@/services'

export interface CompanyProps {
  amount: number | string
  companyName: string
  createdAt: string
  endDate: string | null
  expectLeaveDate: string | null
  id: string
  remark: string
  startDate: string
  uid: number
  updatedAt: string
  [key: string]: any
}

export interface SystemState {
  loading: boolean
  companyAll: CompanyProps[]
}

const initialState: SystemState = {
  loading: false,
  companyAll: [],
}

export const getAllCompany = createAsyncThunk(
  'company/getAllCompany',
  async () => {
    const response = await serviceGetAllCompany()
    return response.rows
  },
)

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(getAllCompany.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllCompany.fulfilled, (state, action) => {
        state.companyAll = action.payload
      })
      .addCase(getAllCompany.rejected, (state) => {
        state.loading = false
      })
  },
})

export default companySlice.reducer
