/**
 * @file: 增加了外链的支持，用这个代替 remax/one 的 Navigator
 */
import React, { PropsWithChildren, useState } from 'react'
import { NavigatorProps as BaseNavigatorProps, View, navigateTo, redirectTo, switchTab, reLaunch } from 'remax/one'
// import { checkIsInnerUrl } from '@/utils/route'
// import { routeMap, Pages } from '@/constants/route'
// import { useUserInfo } from '@/components/UserInfo'

import style from './index.less'

type NavigatorProps = PropsWithChildren<BaseNavigatorProps> & {
  /**
   * 是否开启触摸效果
   * @default true
   */
  touchEffect?: boolean
}

export default function Navigator({ url, action, children, touchEffect = true, ...props }: NavigatorProps) {
  const [touched, setTouched] = useState(false)
  // const isInnerUrl = checkIsInnerUrl(url)
  // const { userInfo } = useUserInfo()
  // const simpleUserInfo = userInfo
  //   ? {
  //     uid: userInfo.uid,
  //     email: userInfo.customerEmail,
  //     name: userInfo.fullName,
  //     is_certified: userInfo.isCertified,
  //     signedIn: true
  //   }
  //   : {}
  // const connector = url.indexOf('?') > -1 ? '&' : '?'
  // const urlWithUserinfo = userInfo ? `${url}${connector}userInfo=${JSON.stringify(simpleUserInfo)}` : url

  // 外部链接先跳转到 pages/web-view，再打开外链
  // const realUrl = isInnerUrl ? url : `${routeMap[Pages.WebView]}?url=${encodeURIComponent(urlWithUserinfo)}`
  const realUrl = url

  return (
    <View
      className={touchEffect && touched && style.touched || ''}
      onTouchStart={() => setTouched(true)}
      onTouchCancel={() => setTouched(false)}
      onTouchEnd={() => setTouched(false)}
      onTap={(e: any) => {
        e.stopPropagation()
        whatToDo(action)({ url: realUrl })
      }}
      {...props}
    >
      {children}
    </View>
  )
}

function whatToDo(action: 'navigate' | 'redirect' | 'switchTab' | 'reLaunch') {
  switch (action) {
    case 'reLaunch':
      return reLaunch
    case 'switchTab':
      return switchTab
    case 'redirect':
      return redirectTo
    case 'navigate':
    default:
      return navigateTo
  }
}
