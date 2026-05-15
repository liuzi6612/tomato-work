// Copyright 2018-present the liuzi6612. All rights reserved. MIT license.
import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/global.scss'
import AppRoute from './router'
import 'antd/dist/reset.css'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import zh from 'dayjs/locale/zh-cn'
import store from '@/store'
import './registerSW'

dayjs.locale(zh)

const root = ReactDOM.createRoot(
  document.getElementById('tomato-work-root') as HTMLElement,
)

root.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <AppRoute />
    </ConfigProvider>
  </Provider>,
)
