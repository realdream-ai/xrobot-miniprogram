import React from 'react'
import { View } from 'remax/one'

import styles from './index.less'

export interface Props {
  strength: number // 0-100
}

function getColor(strength: number) {
  if (strength > 75) {
    return '#34C759'
  }
  if (strength > 50) {
    return '#007AFF'
  }
  if (strength > 25) {
    return '#FF9500'
  }
  return '#FF3B30'
}

export default function SignalStrength({ strength }: Props) {

  return (
    <View className={styles.container}>
      <View className={styles.strength} style={{ width: `${strength}%`, backgroundColor: `${getColor(strength)}` }} />
      <View className={styles.cover}>
        <View className={styles.separator} />
        <View className={styles.separator} />
        <View className={styles.separator} />
      </View>
    </View>
  )
}
