/**
 * @file 登录相关的工具
 */

import { navigateTo, redirectTo, switchTab } from 'remax/one'

import { Pages, routeMap } from '@/constants/route'
import { isTabBarPage } from '@/utils/config'
import { getStorageSync, setStorageSync } from '@/runtime/storage'

export type LoginInfo = {
  source: SourceType
  sourceUrl?: string
}

export enum SourceType {
  Self = 'self',                  // 小程序本身
  MiniProgram = 'miniProgram',    //  其他小程序
  WebView = 'webView'             // wei-view
}

const initialLoginInfo = {
  source: SourceType.Self
}

export enum LoginRedirectType {
  Redirect = 'redirect',
  Navigate = 'navigate'
}

export const setLoginInfo = (loginInfo: LoginInfo) => {
  setStorageSync('loginInfo', loginInfo)
}

export const getLoginInfo = () => getStorageSync<LoginInfo | undefined>('loginInfo')

export const resetLoginInfo = () => {
  setLoginInfo(initialLoginInfo)
}

export const loginRedirect = (redirectType: LoginRedirectType = LoginRedirectType.Navigate) => {
  const loginInfo = getLoginInfo()
  if (!loginInfo) return switchTab({ url: routeMap.xrobot_manage_agent })

  const redirectFun = redirectType === LoginRedirectType.Navigate ? navigateTo : redirectTo

  if (!loginInfo.sourceUrl) {
    switchTab({ url: routeMap.xrobot_manage_agent })
  } else {
    // 获取的sourceUrl不带/是相对路径
    // 小程序页面间跳转时有出现url参数的情况下需要decode
    const sourceUrl = decodeURIComponent(loginInfo.sourceUrl)
    // 如果 sourceUrl 是 tab 页面，必须用 switchTab
    if (isTabBarPage(sourceUrl)) {
      switchTab({ url: '/' + sourceUrl })
    } else {
      redirectFun({ url: '/' + sourceUrl })
    }
  }
  resetLoginInfo()
}

/** 获取小程序页面跳转到登录页的 url */
export function toLoginPageUrl() {
  const pages = getCurrentPages()
  const url = pages[pages.length - 1]
  const route = url?.route
  const param = url?.sensors_mp_encode_url_query
  // 小程序页面间跳转时有出现url参数的情况下需要encode, 否则会丢失参数
  const sourceUrl = encodeURIComponent(`${route}${param ? '?' + param : ''}`)
  return `${routeMap[Pages.XrobotAccountLogin]}?source=self&sourceUrl=${sourceUrl}`
}
