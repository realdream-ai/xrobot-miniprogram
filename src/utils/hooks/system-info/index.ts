/**
 * @author: corol
 * @github: github.com/huangbinjie
 * @created: Wed Aug 26 2020
 * @file: 平台兼容的获取系统信息的工具函数（wechat version）
 *
 * Copyright (c) 2020 Qiniu
 */

import { createContext, useContext } from 'react'

export type SystemInfo = {
  statusBarHeight: number
  appBarHeight: number
  platform: string
  screenWidth: number
  // 设备屏幕宽度(screenWidth)相对于 750 的缩放比例，用于 rpx 计算
  // 实际单位会被 remax 乘以这个比例。举个例子，statusBarHeight 是 20，设置的 20px 会被转换成 10px。
  // 所以 js 里面消费此的高宽等应该除以此变量
  scaleRatio: number
  // 小程序 onShow 时的场景值
  onShowScene?: number
  // 底部安全区域
  bottomSafeAreaHeight: number
}

export const SystemInfoContext = createContext<SystemInfo | null>(null)

export function useSystemInfo() {
  const systemInfo = useContext(SystemInfoContext)

  if (systemInfo === null) {
    throw Error('Unable to get system info.')
  }

  return systemInfo
}

export function getSystemInfo(): Promise<SystemInfo | undefined> {
  const deviceInfo = wx.getDeviceInfo()
  const windowInfo = wx.getWindowInfo()
  // console.log('getSystemInfo deviceInfo: ', deviceInfo)
  // console.log('getSystemInfo windowInfo: ', windowInfo)

  const menuRect = wx.getMenuButtonBoundingClientRect()
  // ios 真机有时拿到的 menuRect 各项值均为 0
  // 采用给初始值的方式解决
  // https://github.com/lingxiaoyi/navigation-bar/issues/13
  // 安卓 && ios 真机胶囊高度均为 32px
  const menuRectHeight = menuRect.height || 32
  // 如果拿不到 menuRect.top 则 gap 默认 8px
  const gap = menuRect.top ? (menuRect.top - windowInfo.statusBarHeight) * 2 : 8
  // 微信平台高度不对，增加 4px
  const appBarHeight = menuRectHeight + gap + 4

  return Promise.resolve({
    statusBarHeight: windowInfo.statusBarHeight,
    appBarHeight,
    platform: deviceInfo.platform,
    screenWidth: windowInfo.screenWidth,
    scaleRatio: windowInfo.screenWidth / 750,
    bottomSafeAreaHeight: windowInfo.screenHeight - windowInfo.safeArea.bottom
  })
}
