import React from 'react'
import { View, Image } from 'remax/one'
import { useToast } from '@/utils/toast'
import { getConnectedWifi } from '../wifi'
import { useWifiConfigContext } from '../context'
import './index.less'
import './style.less'
// import { deviceSSIDReg } from '../SelectDevice'

// 使用图片链接
const GUIDE_IMAGES = {
  settings: 'https://idh.qnaigc.com/mp-assets/net-config/ios-settings.png',
  wifi: 'https://idh.qnaigc.com/mp-assets/net-config/ios-wifi.png'
}

const IosDeviceGuide: React.FC = () => {
  const { setCurrentStep, updateSelectedDevice } = useWifiConfigContext()
  const showToast = useToast()

  const handleConfirm = async () => {
    try {
      // 获取当前连接的WiFi信息
      const connectedWifi = await getConnectedWifi()

      if (!connectedWifi) {
        showToast({
          tip: '请连接设备热点',
          icon: 'warning',
          duration: 3500,
          className: 'wifi-config-toast'
        })
        return
      }

      // const { SSID } = connectedWifi
      // if (!SSID || !deviceSSIDReg.test(SSID)) {
      //   showToast({ tip: '请连接设备热点', icon: 'warning', duration: 3500, className: 'wifi-config-toast' })
      //   return
      // }

      // 更新选中的设备信息
      updateSelectedDevice({
        wifi: connectedWifi,
        connected: true
      })

      // 直接设置下一步为select-wifi
      setCurrentStep('select-wifi')
    } catch {
      showToast({
        tip: '检查 WiFi 连接失败，请重试',
        icon: 'fail',
        duration: 2000
      })
    }
  }

  return (
    <View className="ios-guide">
      <View className="guide-header">
        <View className="guide-title">iOS 设备配网指引</View>
        <View className="guide-subtitle">请按照以下步骤操作</View>
      </View>

      <View className="guide-steps">
        <View className="step">
          <View className="step-header">
            <View className="step-number">1</View>
            <View className="step-title">打开系统设置</View>
          </View>
          <View className="step-content">
            <Image
              className="guide-image"
              src={GUIDE_IMAGES.settings}
              mode="aspectFit"
            />
            <View className="step-desc">点击「无线局域网」进入 WiFi 设置</View>
          </View>
        </View>

        <View className="step">
          <View className="step-header">
            <View className="step-number">2</View>
            <View className="step-title">连接设备热点</View>
          </View>
          <View className="step-content">
            <Image
              className="guide-image"
              src={GUIDE_IMAGES.wifi}
              mode="aspectFit"
            />
            <View className="step-desc">
              <View className="important">
                <View className="important-icon">❗️</View>
                <View>连接设备热点</View>
              </View>
            </View>
          </View>
        </View>

        <View className="step">
          <View className="step-header">
            <View className="step-number">3</View>
            <View className="step-title">返回小程序</View>
          </View>
          <View className="step-content">
            <View className="step-desc">
              <View className="important">
                <View className="important-icon">✨</View>
                <View>连接成功后点击下方按钮继续配网</View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="guide-buttons">
        <View className="btn confirm" onTap={handleConfirm}>
          已连接，继续配网
        </View>
      </View>
    </View>
  )
}

export default IosDeviceGuide
