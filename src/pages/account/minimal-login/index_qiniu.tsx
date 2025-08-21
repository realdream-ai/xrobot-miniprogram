import AppBar from '@/components/AppBar'
import Scaffold from '@/components/Scaffold'
import React, { useCallback, useEffect } from 'react'
import { usePageEvent } from 'remax/macro'
import { View } from 'remax/one'
import { Button } from 'remax/wechat'
import { useToast } from '@/utils/toast'
import { useQuery } from 'remax'

import { loginRedirect, setLoginInfo, SourceType, LoginRedirectType } from '@/components/LoginRequired/util'
import { nameMap, Pages } from '@/constants/route'
import { useSystemInfo } from '@/utils/hooks/system-info'
import store from '@/stores'
import style from './style.less'

export default function LoginEntry() {
  const { source = SourceType.Self, sourceUrl } = useQuery()
  const showToast = useToast()

  useEffect(() => {
    setLoginInfo({ source: source as SourceType, sourceUrl })
  }, [source, sourceUrl])

  const loginCheck = useCallback(() => {
    if (store.getCookie() !== '') {
      showToast({ tip: '登录成功', icon: 'success' })
      loginRedirect(LoginRedirectType.Redirect)
    }
  }, [showToast])

  usePageEvent('onShow', options => {
    // 确保在 loginRedirect 前把页面参数存下来
    console.log('minimal-login onShow options:', options)
    setLoginInfo({ source: source as SourceType, sourceUrl })
    loginCheck()
  })
  const { statusBarHeight, appBarHeight } = useSystemInfo()

  const handleLogin = () => {
    wx.navigateToMiniProgram({
      appId: 'wx6ab76fba1b23c3da', // 七牛云小程序的 appid
      path: 'pages/common/login-entry/index', // 登录页面路径
      target: 'miniProgram',
      extraData: {
        source: 'miniProgram'
      }
    })
  }

  return (
    <Scaffold
      appBar={(
        <AppBar
          title={nameMap[Pages.XrobotAccountLogin]}
        />
      )}
    >
      <View style={{ height: `calc(100vh - ${appBarHeight + statusBarHeight}px)` }}>
        <Button
          className={style.phoneLoginBtn}
          onTap={handleLogin}
        >
          快捷登录
        </Button>
      </View>
    </Scaffold>
  )
}
