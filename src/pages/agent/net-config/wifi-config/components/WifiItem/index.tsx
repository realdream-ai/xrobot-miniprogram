import React from 'react'
import { Text, View } from 'remax/one'

import { normalizeSignalStrength } from '../../wifi'
import SignalStrength from './SignalStrength'

import styles from './index.less'

export interface Props {
  isIOS: boolean
  wifiInfo: WechatMiniprogram.WifiInfo
  onTap(): void
}

export default function WifiItem({ isIOS, wifiInfo, onTap }: Props) {
  return (
    <View className={styles.wifiItem} onTap={onTap}>
      <View className={styles.deviceIcon}>📶</View>
      <View className={styles.content}>
        <View className={styles.ssid}>{wifiInfo.SSID}</View>
        <View className={styles.signalStrength}>
          <Text>信号强度: </Text>
          <SignalStrength strength={normalizeSignalStrength(wifiInfo.signalStrength, isIOS)} />
        </View>
      </View>
      <View className={styles.selectIcon}>选择 {'>'}</View>
    </View>
  )
}
