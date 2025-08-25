import { Template } from '@/pages/square/types'
import { combineCookie, transformCookieToWeb } from '@/utils/transforms'
import { getStorageSync, setStorageSync } from '@/runtime/storage'
import { removeStorage } from 'remax/wechat'

interface UserInfo {
  full_name?: string; // 添加手机号字段
  [key: string]: any;
}
interface PubConfig {
  version: string;
  beianIcpNum: string;
  beianGaNum: string;
  allowUserRegister: boolean;
}

function defaultPubConfig() {
  return {
    version: '',
    beianIcpNum: 'null',
    beianGaNum: 'null',
    allowUserRegister: false
  } as PubConfig
}

interface State {
  token: string;
  cookie: string;
  userInfo: UserInfo;
  pubConfig: PubConfig;
  // 设备管理页跳转配网页暂存AgentId
  currentDeviceNetConigAgentId: string;
  // 广场页跳转模板详情页暂存Template
  currentSquareDetailTemplate: Template | null;
}

const state: State = {
  token: '',
  cookie: '',
  userInfo: {},
  pubConfig: defaultPubConfig(),
  currentDeviceNetConigAgentId: '',
  currentSquareDetailTemplate: null
}

const CACHE_KEYS = [
  'xrobot-token',
  'xrobot-cookie',
  'xrobot-userInfo',
  'xrobot-pubConfig'
]

const store = {
  getToken() {
    const token: string | undefined = getStorageSync('xrobot-token')
    if (token) {
      state.token = token
    }
    return state.token
  },
  getCookie() {
    const cookie: string | undefined = getStorageSync('xrobot-cookie')
    if (cookie) {
      state.cookie = cookie
    }
    return state.cookie
  },
  getCurrentDeviceNetConigAgentId() {
    return state.currentDeviceNetConigAgentId
  },
  getUserInfo() {
    const userinfo: string | undefined = getStorageSync('xrobot-userInfo')
    if (userinfo) {
      state.userInfo = JSON.parse(userinfo)
    }
    return state.userInfo
  },
  getPubConfig() {
    const config: string | undefined = getStorageSync('xrobot-pubConfig')
    if (config) {
      state.pubConfig = JSON.parse(config)
    }
    return state.pubConfig
  },
  setToken(token: string) {
    state.token = token
    setStorageSync('xrobot-token', token)
  },
  popCurrentSquareDetailTemplate(): Template | null {
    const temp = state.currentSquareDetailTemplate
    state.currentSquareDetailTemplate = null
    return temp
  },
  updateCookie(cookie: string, needTransform = true) {
    if (!cookie) return
    let trasformedCookie = cookie
    if (needTransform) {
      trasformedCookie = transformCookieToWeb(cookie)
    }
    if (!trasformedCookie) return

    const oldCookie = store.getCookie()
    const newCookie = combineCookie(oldCookie, trasformedCookie)
    state.cookie = newCookie
    setStorageSync('xrobot-cookie', state.cookie)
  },
  setCurrentDeviceNetConigAgentId(agentId: string) {
    state.currentDeviceNetConigAgentId = agentId
  },
  setUserInfo(userInfo: UserInfo) {
    state.userInfo = userInfo
    setStorageSync('xrobot-userInfo', JSON.stringify(userInfo))
  },
  setPubConfig(config: PubConfig) {
    state.pubConfig = config
    setStorageSync('xrobot-pubConfig', JSON.stringify(config))
  },
  setCurrentSquareDetailTemplate(temp: Template) {
    state.currentSquareDetailTemplate = temp
  },
  clearAuth() {
    state.token = ''
    state.cookie = ''
    state.userInfo = {}
    state.pubConfig = defaultPubConfig()

    CACHE_KEYS.forEach(key => {
      removeStorage({ key })
    })
  }
}

export default store
