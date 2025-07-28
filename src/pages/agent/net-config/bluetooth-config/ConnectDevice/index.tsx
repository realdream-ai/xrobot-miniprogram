import React, { useCallback, useState } from 'react'
import { View, Text } from 'remax/one'
import { useToast } from '@/utils/toast'
import { promisify } from '@/utils/promise'
import Popup from '@/ui/Popup'
import { waitTimeout } from '@/pages/common/utils'
import { connectBluetoothDevice, getConnectedBluetoothDevices } from '../bluetooth'
import { useBluetoothConfigContext } from '../context'
import styles from './index.less'

export default function ConnectDevice() {
  const { currentStep, setCurrentStep, selectedDevice,
    updateSelectedDevice, sequenceControl } = useBluetoothConfigContext()
  const isActive = currentStep === 'connect-device'
  const [manualModalVisible, setManualModalVisible] = useState(false)
  const showToast = useToast()

  const changeDevice = useCallback(() => {
    updateSelectedDevice(null)
    setCurrentStep('select-device')
  }, [updateSelectedDevice, setCurrentStep])

  const onConnected = useCallback(async () => {
    if (!selectedDevice) return
    const connectedDevices = await getConnectedBluetoothDevices()
    const isConnected = connectedDevices.some(device => device.deviceId === selectedDevice.deviceId)
    console.log('connectedDevices', connectedDevices)
    console.log('selectedDevice', selectedDevice)
    console.log('isConnected', isConnected)
    if (isConnected) {
      updateSelectedDevice({ ...selectedDevice, connected: true })
      // 重置序列号
      sequenceControl.current = 0
      setCurrentStep('select-wifi')
    } else {
      showToast({ tip: '未正确连接到选定设备，请重试', icon: 'fail', duration: 2000 })
    }
  }, [selectedDevice, showToast, updateSelectedDevice, setCurrentStep, sequenceControl])

  const handleConnect = useCallback(async () => {
    if (!selectedDevice) return

    // 检查设备是否已连接
    const connectedDevices = await getConnectedBluetoothDevices()
    const isConnected = connectedDevices.some(device => device.deviceId === selectedDevice.deviceId)
    console.log('handleConnectconnectedDevices', connectedDevices)
    console.log('handleConnectselectedDevice', selectedDevice)
    console.log('handleConnectisConnected', isConnected)
    if (isConnected) {
      // 重置序列号
      sequenceControl.current = 0
      updateSelectedDevice({ ...selectedDevice, connected: true })
      showToast({ tip: '设备已连接', icon: 'success', duration: 2000 })
      setCurrentStep('select-wifi')
      return
    }

    // 连接设备
    try {
      showToast({ tip: '正在连接设备...', icon: 'loading', duration: -1 })
      await Promise.race([
        waitTimeout(15000),
        connectBluetoothDevice(selectedDevice.deviceId)
      ])
      // 验证设备是否正确连接
      onConnected()
    } catch (e) {
      console.error('连接设备失败:', e)
      setManualModalVisible(true)
    } finally {
      showToast(undefined)
    }
  }, [showToast, selectedDevice, updateSelectedDevice, onConnected, setCurrentStep, sequenceControl])

  return (
    <View className={styles.container} style={{ display: isActive ? 'block' : 'none' }}>
      {selectedDevice != null && (
        <>
          <View className={styles.stepTitle}>连接蓝牙设备</View>
          <View className={styles.selectedDevice}>
            <Text>已选择设备: 📱 {selectedDevice.name || selectedDevice.deviceId}</Text>
            {selectedDevice.connected && <Text>✅ 已连接</Text>}
          </View>
          {
            selectedDevice.connected
              ? <View className={styles.actionBtn} onTap={() => setCurrentStep('select-wifi')}>下一步</View>
              : <View className={styles.actionBtn} onTap={handleConnect}>🔗 连接设备</View>
          }
          <ManualModal
            visible={manualModalVisible}
            deviceName={selectedDevice.name || selectedDevice.deviceId}
            onClose={() => setManualModalVisible(false)}
            onConnected={onConnected}
          />
        </>
      )}
      {selectedDevice == null && (
        <View className={styles.actionBtn} onTap={changeDevice}>选择设备</View>
      )}
    </View>
  )
}

interface ManualModalProps {
  visible: boolean
  deviceName: string
  onClose: () => void
  onConnected: () => void
}

function ManualModal({ visible, deviceName, onClose, onConnected }: ManualModalProps) {
  const openSystemSetting = useCallback(async () => {
    try {
      await promisify(wx.openSystemBluetoothSetting)()
      console.log('已跳转系统蓝牙设置页')
    } catch (e) {
      console.error('跳转系统蓝牙设置页失败:', e)
    }
  }, [])

  const confirmConnected = useCallback(() => {
    onConnected()
    onClose()
  }, [onConnected, onClose])

  return (
    <Popup open={visible} position="center" onClose={onClose} className={styles.manualModal}>
      <View className={styles.content}>
        <View className={styles.header}>⚠️ 自动连接失败，请手动操作：</View>
        <View className={styles.tips}>
          <View className={styles.tip}>进入系统「蓝牙」设置</View>
          <View className={styles.tip}>连接名为「{deviceName}」的设备</View>
          <View className={styles.tip}>返回小程序，点击下方按钮继续操作</View>
        </View>
      </View>
      <View className={styles.actionBtn} onTap={openSystemSetting}>➡️ 前往蓝牙设置</View>
      <View className={styles.actionBtn} onTap={confirmConnected}>✅ 已连接成功，继续操作</View>
    </Popup>
  )
}
