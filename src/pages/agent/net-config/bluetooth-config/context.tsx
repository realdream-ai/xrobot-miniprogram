import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react'
import { FieldState } from 'formstate-x'
import type { BluetoothDevice } from './bluetooth'

// 定义配网步骤
export const configSteps = [
  'select-device',
  'connect-device',
  'select-wifi',
  'input-pwd',
  'submit-config'
] as const

export type Step = typeof configSteps[number]

export type SelectedDevice = BluetoothDevice

export interface WiFiInfo {
  SSID: string
  BSSID?: string
  signalStrength: number
}

interface BluetoothConfigContextValue {
  isIOS: boolean
  currentStep: Step
  setCurrentStep: (step: Step) => void
  selectedDevice: SelectedDevice | null
  updateSelectedDevice: (device: SelectedDevice | null) => void
  selectedWifi: WiFiInfo | null
  updateSelectedWifi: (wifi: WiFiInfo | null) => void
  passwordState: FieldState<string>
  sequenceControl: { current: number }
}

const BluetoothConfigContext = createContext<BluetoothConfigContextValue | null>(null)

export function BluetoothConfigProvider({ children }: { children: React.ReactNode }) {
  // 端判断
  const isIOS = useMemo(() => {
    const sys = wx.getDeviceInfo()
    return sys.platform === 'ios'
  }, [])

  const [currentStep, setCurrentStep] = useState<Step>('select-device')
  const [selectedDevice, setSelectedDevice] = useState<SelectedDevice | null>(null)
  const [selectedWifi, setSelectedWifi] = useState<WiFiInfo | null>(null)
  const sequenceControl = useRef(0)
  const passwordState = useMemo(() => new FieldState('').validators((v: string) => !v && 'WiFi密码不能为空'), [])

  const updateSelectedDevice = useCallback((device: SelectedDevice | null) => {
    setSelectedDevice(device)
  }, [])

  const updateSelectedWifi = useCallback((wifi: WiFiInfo | null) => {
    setSelectedWifi(wifi)
  }, [])

  return (
    <BluetoothConfigContext.Provider
      value={{
        isIOS,
        currentStep,
        setCurrentStep,
        selectedDevice,
        updateSelectedDevice,
        selectedWifi,
        updateSelectedWifi,
        passwordState,
        sequenceControl
      }}
    >
      {children}
    </BluetoothConfigContext.Provider>
  )
}

export function useBluetoothConfigContext() {
  const context = useContext(BluetoothConfigContext)
  if (!context) {
    throw new Error('useBluetoothConfigContext must be used within a BluetoothConfigProvider')
  }
  return context
}
