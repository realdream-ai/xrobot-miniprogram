import React, { useCallback, useState } from 'react'
import { View } from 'remax/one'

import { useToast } from '@/utils/toast'
import { showModal, showToast as wxShowToast } from 'remax/wechat'
import Button from '@/ui/Button'
import { getWifiList } from '../wifi'
import { useWifiConfigContext } from '../context'
import WifiItem from '../components/WifiItem'

import styles from './index.less'

// 对设备列表去重，保留信号最强的
function dedupeDeviceList(
  deviceList: WechatMiniprogram.WifiInfo[]
): WechatMiniprogram.WifiInfo[] {
  const deviceMap = new Map<string, WechatMiniprogram.WifiInfo>()

  deviceList.forEach(device => {
    const existingDevice = deviceMap.get(device.SSID)
    // 如果是新的 SSID 或者信号比已存在的强，则更新
    if (
      !existingDevice
      || device.signalStrength > existingDevice.signalStrength
    ) {
      deviceMap.set(device.SSID, device)
    }
  })

  return Array.from(deviceMap.values())
}

export const deviceSSIDReg = /^(xiaozhi|xiaoling|yuanling|zuowei)/

export default function SelectDevice() {
  const { isIOS, currentStep, setCurrentStep, updateSelectedDevice } = useWifiConfigContext()
  const isActive = currentStep === 'select-device'
  const showToast = useToast()
  const [isLoadingDevices, setIsLoadingDevices] = useState(false)
  const [customPrefix, setCustomPrefix] = useState<string | null>(null)
  const [deviceList, setDeviceList] = useState<
    WechatMiniprogram.WifiInfo[] | null
  >(null)

  const startDeviceScan = useCallback(async () => {
    setDeviceList(null)
    setIsLoadingDevices(true)
    try {
      const systemSetting = wx.getSystemSetting()
      if (!systemSetting.wifiEnabled) {
        showToast({ tip: 'WiFi未打开，请先打开WiFi', duration: 2000 })
        return
      }
      const wifiList = await getWifiList(isIOS, true)
      // 过滤设备热点并去重
      if (customPrefix) {
        const validDeviceList = wifiList.filter(item => item.SSID.toLowerCase().startsWith(customPrefix))
        setDeviceList(dedupeDeviceList(validDeviceList))
      } else {
        const validDeviceList = wifiList.filter(item => deviceSSIDReg.test(item.SSID.toLowerCase()))
        setDeviceList(dedupeDeviceList(validDeviceList))
      }
    } catch (err) {
      showToast({ tip: '获取设备列表失败' })
      setDeviceList([])
    } finally {
      setIsLoadingDevices(false)
    }
  }, [showToast, isIOS, customPrefix])

  const handleSelectDevice = useCallback(
    (device: WechatMiniprogram.WifiInfo) => {
      updateSelectedDevice({ wifi: device, connected: false })
      setCurrentStep('connect-device')
    },
    [updateSelectedDevice, setCurrentStep]
  )

  const handleCustomPrefix = () => {
    showModal({
      title: '自定义wifi名称过滤前缀',
      content: '',
      editable: true,
      placeholderText: '请输入前缀，最少3字符',
      confirmText: '确定',
      cancelText: '取消',
      success: res => {
        if (res.confirm && res.content) {
          const name = res.content.trim().toLowerCase()
          if (!name) {
            wxShowToast({
              title: '前缀不能为空',
              icon: 'error',
              duration: 3000
            })
            return
          }
          if (name.length < 3) {
            wxShowToast({ title: '前缀过短', icon: 'error', duration: 3000 })
            return
          }
          if (name.length > 20) {
            wxShowToast({ title: '前缀过长', icon: 'error', duration: 3000 })
            return
          }
          // onCreate(name)
          setCustomPrefix(name)
          wxShowToast({ title: '已设置', icon: 'success', duration: 2000 })
        }
        // onClose()
      }
    })
  }

  const handleClearCustomPrefix = () => {
    setCustomPrefix(null)
    wxShowToast({ title: '已清除', icon: 'success', duration: 2000 })
  }

  return (
    <View
      className={styles.container}
      style={{ display: isActive ? 'block' : 'none' }}
    >
      <View className={styles.stepTitle}>当前步骤：扫描设备热点</View>

      <DeviceList
        isLoading={isLoadingDevices}
        deviceList={deviceList}
        onSelect={handleSelectDevice}
        isIOS={isIOS}
      />
      {!isLoadingDevices && (
        <View className={styles.actionBtn} onTap={startDeviceScan}>
          {deviceList == null ? '🔍 开始扫描' : '🔍 重新扫描'}
        </View>
      )}

      {deviceList == null ? (
        <></>
      ) : (
        <View>
          <View>找不到需要的WiFi？</View>
          <Button
            onTap={handleCustomPrefix}
            className={styles.actionBtn}
            mode="default"
          >
            自定义WiFi名称过滤前缀
          </Button>
          <Button
            onTap={handleClearCustomPrefix}
            className={styles.actionBtn}
            mode="default"
          >
            清除自定义前缀
          </Button>
        </View>
      )}
    </View>
  )
}

interface DeviceListProps {
  isLoading: boolean;
  deviceList: WechatMiniprogram.WifiInfo[] | null;
  onSelect(device: WechatMiniprogram.WifiInfo): void;
  isIOS: boolean;
}

function DeviceList({
  isLoading,
  deviceList,
  onSelect,
  isIOS
}: DeviceListProps) {
  if (isLoading) {
    return (
      <View className={styles.empty}>
        <View className={styles.loadingIcon} />
        <View className={styles.loadingText}>正在扫描设备热点...</View>
      </View>
    )
  }
  if (deviceList == null) {
    return (
      <View className={styles.tips}>
        <View className={styles.tip}>
          <View className={styles.icon}>1️⃣</View>
          确认设备已通电并处于配网模式
        </View>
        <View className={styles.tip}>
          <View className={styles.icon}>2️⃣</View>
          点击下方按钮扫描设备热点
        </View>
      </View>
    )
  }
  if (deviceList.length === 0) {
    return (
      <View className={styles.empty}>
        未发现设备，请确保设备已通电并处于配网模式
      </View>
    )
  }
  return (
    <View className={styles.wifiList}>
      <View className={styles.tips}>
        <View className={styles.tip}>
          <View className={styles.icon}>📱</View>
          已发现 {deviceList.length} 个设备
        </View>
        <View className={styles.tip}>
          <View className={styles.icon}>👇</View>
          点击下方设备卡片，选择要配网的设备
        </View>
      </View>
      {deviceList.map((device, index) => (
        <WifiItem
          key={index}
          isIOS={isIOS}
          wifiInfo={device}
          onTap={() => onSelect(device)}
        />
      ))}
    </View>
  )
}
