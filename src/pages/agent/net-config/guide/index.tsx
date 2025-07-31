import React, { useCallback, useMemo } from 'react'
import { View, navigateBack, navigateTo } from 'remax/one'

import { nameMap, Pages, routeMap } from '@/constants/route'
import Scaffold from '@/components/Scaffold'
import AppBar from '@/components/AppBar'
import BackLeading from '@/components/AppBar/BackLeading'

import styles from './index.less'

export default function NetConfigGuide() {
  const handleBack = useCallback(async () => {
    try {
      await navigateBack()
    } catch {
      navigateTo({ url: routeMap[Pages.XrobotNetConfigWelcome] })
    }
  }, [])

  return (
    <Scaffold
      appBar={(
        <AppBar
          title={nameMap[Pages.XrobotNetConfigGuide]}
          leading={<BackLeading onTap={handleBack} />}
        />
      )}
    >
      <Steps />
    </Scaffold>
  )
}

type StepInfo = {
  step: number
  title: string
  notes: string[]
}

function Steps() {
  // 端判断
  const isIOS = useMemo(() => {
    const sys = wx.getDeviceInfo()
    return sys.platform === 'ios'
  }, [])

  const steps: Array<Omit<StepInfo, 'step'>> = [
    {
      title: isIOS ? '连接设备' : '扫描设备',
      notes: [
        '确保设备已通电',
        '设备处于配网模式',
        isIOS
          ? '如果是 WiFi 配网，请手动连接到 Xiaoling, Xiaozhi, Yuanling 开头的设备热点'
          : '扫描设备'
      ]
    },
    ...(isIOS
      ? []
      : [{
        title: '连接设备',
        notes: [
          '自动连接到设备',
          '保持设备通电状态'
        ]
      }]),
    {
      title: '选择路由器 WiFi',
      notes: [
        '选择要连接的路由器网络',
        '确保信号强度良好',
        '支持 2.4GHz 和 5GHz 网络'
      ]
    },
    {
      title: '输入 WiFi 密码',
      notes: [
        '确保密码正确',
        '区分大小写',
        '避免特殊字符错误'
      ]
    },
    {
      title: '开始配网',
      notes: [
        '等待配网完成',
        '设备将会自动重启'
      ]
    }
  ]

  return (
    <View className={styles.steps}>
      <View className={styles.header}>📋 配网步骤说明:</View>
      {steps.map((item, idx) => (
        <Step key={idx} stepInfo={{ ...item, step: idx + 1 }} />
      ))}
    </View>
  )
}

function Step({ stepInfo }: { stepInfo: StepInfo }) {
  return (
    <View className={styles.step}>
      <View className={styles.number}>{stepInfo.step}</View>
      <View className={styles.content}>
        <View className={styles.title}>{stepInfo.title}</View>
        <View className={styles.notes}>
          {stepInfo.notes.map((note, i) => (
            <View key={i} className={styles.note}>{note}</View>
          ))}
        </View>
      </View>
    </View>
  )
}
