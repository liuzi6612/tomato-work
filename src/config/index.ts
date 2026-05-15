const { VITE_HTTP_BASE, VITE_DEV } = import.meta.env
const PROD = VITE_DEV === 'false'
const isDevelopment = !PROD

const CONFIG = {
  isProduction: PROD,
  isDevelopment,
  // 路由 basename
  baseURL: '/',
  // 网页标题
  title: 'Tomato Work',
  http: {
    baseURL: VITE_HTTP_BASE as string,
  },

  // 申请地址：https://github.com/settings/developers
  github: {
    clientId: PROD ? '789d87c19dd5ed1dc42e' : '489b39e1f91d934128c8',
    // 授权成功重定向页面
    redirectUri: location.origin,

    // 可忽略，只是用于页面展示
    repositoryUrl: 'https://github.com/liuzi6612/tomato-work',
    bug: 'https://github.com/liuzi6612/tomato-work/issues',
  },
}

export default CONFIG
