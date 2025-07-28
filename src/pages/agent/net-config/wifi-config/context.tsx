import React, { useContext, createContext, useMemo, useState, useCallback, useEffect } from 'react'
import { FieldState } from 'formstate-x'
import { startWifi } from './wifi'

// 定义 iOS 和 Android 的步骤
export const iosSteps = ['ios-guide', 'select-wifi', 'input-pwd', 'submit-config'] as const
export const androidSteps = ['select-device', 'connect-device', 'select-wifi', 'input-pwd', 'submit-config'] as const

export type IosStep = typeof iosSteps[number]
export type AndroidStep = typeof androidSteps[number]
export type Step = IosStep | AndroidStep

export type SelectedDevice = {
  wifi: any // WechatMiniprogram.WifiInfo
  connected: boolean
}

export type WifiConfigContextValue = {
  isIOS: boolean
  currentStep: Step
  setCurrentStep(step: Step): void
  selectedDevice: SelectedDevice | null
  updateSelectedDevice(device: SelectedDevice | null): void
  ssidState: FieldState<string>
  passwordState: FieldState<string>
}

const Context = createContext<WifiConfigContextValue>({} as any)
export { Context }

export function useWifiConfigContext(): WifiConfigContextValue {
  return useContext(Context)
}

export function WifiConfigProvider({ children }: { children: React.ReactNode }) {
  // 端判断
  const isIOS = useMemo(() => {
    const sys = wx.getDeviceInfo()
    return sys.platform === 'ios'
  }, [])
  // 步骤
  const steps = useMemo(() => (isIOS ? iosSteps : androidSteps), [isIOS])
  const [currentStep, setCurrentStep] = useState<Step>(steps[0])
  const [selectedDevice, setSelectedDevice] = useState<SelectedDevice | null>(null)
  const ssidState = useMemo(() => new FieldState('').validators((v: string) => !v && 'WiFi 名称不能为空'), [])
  const passwordState = useMemo(() => new FieldState('').validators((v: string) => !v && 'WiFi 密码不能为空'), [])

  // 初始化 WiFi 模块
  useEffect(() => {
    startWifi().catch(() => {
      wx.showToast({ title: '小程序 WiFi 模块初始化失败', icon: 'error' })
    })
  }, [])

  const updateSelectedDevice = useCallback((device: SelectedDevice | null) => {
    setSelectedDevice(device)
  }, [])

  return (
    <Context.Provider
      value={{
        isIOS,
        currentStep,
        setCurrentStep,
        selectedDevice,
        updateSelectedDevice,
        ssidState,
        passwordState
      }}
    >
      {children}
    </Context.Provider>
  )
}
