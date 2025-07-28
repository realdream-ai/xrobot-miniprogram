import React, { ReactNode, useState } from 'react'

import { useAppEvent } from 'remax/macro'

import {
  SystemInfoContext,
  getSystemInfo,
  SystemInfo
} from '@/utils/hooks/system-info'
import { ToastProvider } from '@/utils/toast'

export type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  // 小程序 onShow 时的场景值，用于判断扫码场景
  // 微信小程序：https://developers.weixin.qq.com/miniprogram/dev/reference/scene-list.html
  const [onShowScene, setOnShowScene] = useState<number | undefined>(undefined)

  function fetchSystemInfo() {
    getSystemInfo().then(_systemInfo => setSystemInfo(_systemInfo || null))
  }

  // 这里在 onLaunch 时获取 systemInfo 和 scene，是因为：
  // 开发者工具在 onLaunch 时貌似没有执行 onShow，
  // 猜测是小程序在 onShow 时 remax 还未注册上 onShow 回调函数
  useAppEvent('onLaunch', e => {
    fetchSystemInfo()
    setOnShowScene(e?.scene)
  })

  // 应用可见时重新获取 systemInfo 信息
  // 避免出现拿不到 systemInfo 的情况
  // 参考：https://developers.weixin.qq.com/community/develop/doc/0006eeb2db0ae022a098c58f85d800?_at=tdjfeehau
  useAppEvent('onShow', e => {
    fetchSystemInfo()
    setOnShowScene(e?.scene)
  })

  return (
    <SystemInfoContext.Provider value={systemInfo && { ...systemInfo, onShowScene }}>
      <ToastProvider>{systemInfo ? children : <PlaceHolder />}</ToastProvider>
    </SystemInfoContext.Provider>
  )
}

function PlaceHolder() {
  return <p>loading...</p>
}
