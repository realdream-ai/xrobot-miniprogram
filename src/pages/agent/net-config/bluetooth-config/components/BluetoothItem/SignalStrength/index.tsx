import React from 'react'
import { View } from 'remax/one'

import styles from './index.less'

export interface Props {
  strength: number // 0-4
}

function getColor(strength: number) {
  // 将0-4转换为0-100的范围
  const percentage = (strength / 4) * 100
  if (percentage > 75) {
    return '#34C759'
  }
  if (percentage > 50) {
    return '#007AFF'
  }
  if (percentage > 25) {
    return '#FF9500'
  }
  return '#FF3B30'
}

export default function SignalStrength({ strength }: Props) {
  // 将0-4转换为0-100的范围
  const percentage = (strength / 4) * 100

  return (
    <View className={styles.container}>
      <View className={styles.strength} style={{ width: `${percentage}%`, backgroundColor: `${getColor(strength)}` }} />
      <View className={styles.cover}>
        <View className={styles.separator} />
        <View className={styles.separator} />
        <View className={styles.separator} />
      </View>
    </View>
  )
}
