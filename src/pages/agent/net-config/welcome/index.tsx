import React from 'react'
import { View, Navigator } from 'remax/one'

import { nameMap, Pages, routeMap } from '@/constants/route'
import Scaffold from '@/components/Scaffold'
import AppBar from '@/components/AppBar'
import BackLeading from '@/components/AppBar/BackLeading'
import styles from './index.less'

export default function NetConfigWelcome() {
  return (
    <Scaffold
      appBar={
        <AppBar
          title={nameMap[Pages.XrobotNetConfigWelcome]}
          leading={<BackLeading />}
        />
      }
    >
      <View className={styles.container}>
        <View className={styles.tip}>让您的设备快速连接网络</View>
        <Navigator url={routeMap[Pages.XrobotNetConfigWifi]} action="navigate">
          <View className={styles.navBtn}>🔗 WiFi 配网</View>
        </Navigator>
        <Navigator url={routeMap[Pages.XrobotNetConfigBluetooth]} action="navigate">
          <View className={styles.navBtn}>📱 蓝牙配网</View>
        </Navigator>
        <Navigator url={routeMap[Pages.XrobotNetConfigGuide]} action="navigate">
          <View className={styles.navBtn}>📖 配网帮助</View>
        </Navigator>
      </View>
    </Scaffold>
  )
}
