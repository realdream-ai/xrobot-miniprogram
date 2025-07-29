/* eslint-disable no-bitwise */
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { View, navigateTo, switchTab } from 'remax/one'
import { routeMap, Pages } from '@/constants/route'
import store from '@/stores'

import { useBluetoothConfigContext } from '../context'
import { bluetoothService, connectBluetoothDevice } from '../bluetooth'
import styles from './index.less'

// 数据帧类型
const BLUFI_TYPE_SSID = (0x02 << 2) | 0x01
const BLUFI_TYPE_PASSWORD = (0x03 << 2) | 0x01
const BLUFI_TYPE_MAX_RETRY = (0x14 << 2) | 0x01
const BLUFI_TYPE_CTRL_CONNECT = (0x03 << 2) | 0x00
const BLUFI_TYPE_CTRL_CONNECT_STATUS = (0x05 << 2) | 0x00

type Result = {
  success: false,
  error: '无效的 SSID' | '无法连接到 WiFi' | '请求失败' | '蓝牙连接失败' | string
} | {
  success: true
}

// 构造数据帧
function buildBluFiFrame(type: number, payload: string | number, sequence: number) {
  const data = typeof payload === 'string' ? stringToUtf8Bytes(payload) : new Uint8Array([payload])
  const dataLength = (type & 0x03) === 0x00 ? 0 : data.length // 控制帧无数据

  // 帧控制位设置
  const frameControl = 0x00  // bit 0: 不加密
    | 0x00  // bit 2: 方向从手机到esp
    | (type === BLUFI_TYPE_MAX_RETRY ? 0x08 : 0x00)  // bit 3: 不要求回复ACK
    | 0x00  // bit 4: 无分片

  const cmd = new Uint8Array(4 + dataLength)
  cmd[0] = type
  cmd[1] = frameControl
  cmd[2] = sequence  // 使用context中的序列号
  cmd[3] = dataLength
  if (dataLength > 0) {
    cmd.set(data, 4)
  }
  return cmd.buffer
}

async function sendBluFiFrame(deviceId: string, frame: ArrayBuffer) {
  await wx.writeBLECharacteristicValue({
    deviceId,
    serviceId: bluetoothService.PRIMARY_SERVICE_UUID,
    characteristicId: bluetoothService.SEND_CHARACTERISTIC_UUID,
    value: frame,
    success: undefined,
    fail: err => {
      console.log('sendBluFiFrame fail: ', err)
    }
  })
}

function stringToUtf8Bytes(str: string) {
  const utf8 = []
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i)
    if (charcode < 0x80) utf8.push(charcode)
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f))
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f))
    } else {
      // surrogate pair
      i++
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff))
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      )
    }
  }
  return new Uint8Array(utf8)
}

// 解析配网数据
function parseResult(data: Uint8Array): Result | null {
  const opmode = data[0]
  const sta_status = data[1]
  // const ap_status = data[2]
  // const reason = data.slice(3, data.length)
  // console.log('opmode', opmode)
  // console.log('sta_status', sta_status)
  // console.log('ap_status', ap_status)
  // console.log('reason', reason)
  if (opmode === 0x01 && sta_status === 0x00) {
    // console.log('parseResult success')
    return { success: true }
  }
  return { success: false, error: '无法连接到 WiFi: 请检查WIFI密码是否正确' }
}

export default function SubmitConfig() {
  const { currentStep, selectedDevice, selectedWifi, passwordState,
    setCurrentStep, sequenceControl } = useBluetoothConfigContext()
  const isActive = currentStep === 'submit-config'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const receivedData = useRef<Array<{ sequence: number; data: number[] }>>([])
  // 在 handleSubmit 里依次发送
  const handleSubmit = useCallback(
    async (deviceId: string, ssid: string, password: string) => {
      setIsSubmitting(true)
      try {
        // 1. 发送 SSID
        const ssidFrame = buildBluFiFrame(BLUFI_TYPE_SSID, ssid, sequenceControl.current++)
        if (!ssidFrame) {
          throw new Error('构建ssid数据帧失败')
        }
        await sendBluFiFrame(deviceId, ssidFrame)

        // 2. 发送 Password
        const pwdFrame = buildBluFiFrame(BLUFI_TYPE_PASSWORD, password, sequenceControl.current++)
        if (!pwdFrame) {
          throw new Error('构建password数据帧失败')
        }
        await sendBluFiFrame(deviceId, pwdFrame)

        // 3. 发送控制帧（连接AP）
        const ctrlFrame = buildBluFiFrame(BLUFI_TYPE_CTRL_CONNECT, '', sequenceControl.current++)
        if (!ctrlFrame) {
          throw new Error('构建连接AP控制帧失败')
        }
        await sendBluFiFrame(deviceId, ctrlFrame)

        // 等待10秒
        await new Promise(resolve => setTimeout(resolve, 10000))
        // 则发送获取连接状态报告
        const connectStatusFrame = buildBluFiFrame(BLUFI_TYPE_CTRL_CONNECT_STATUS, '', sequenceControl.current++)
        if (!connectStatusFrame) {
          throw new Error('构建连接状态控制帧失败')
        }
        await sendBluFiFrame(deviceId, connectStatusFrame)
        // 不要在这里setResult，等待监听器回调是否完成
      } catch (e) {
        setResult({ success: false, error: '蓝牙连接失败' })
      } finally {
        setIsSubmitting(false)
      }
    },
    [sequenceControl]
  )

  useEffect(() => {
    if (!isActive || !selectedDevice || !selectedWifi) return

    // 监听回调
    const listener = (res: any) => {
      const value = new Uint8Array(res.value)
      // console.log('收到蓝牙数据:', Array.from(value).map(b => b.toString(16)).join(' '))
      const type = value[0]
      const frameCtrl = value[1]
      const sequence = value[2]
      const curDataLen = value[3]

      // 解析帧类型
      const mainType = type & 0x03  // 低2位是主类型
      const subType = type >> 2     // 高6位是子类型

      // Wi-Fi 连接状态报告数据包
      if (mainType === 0x01 && subType === 0x0f) {
        // 如果是分片帧
        const data = (frameCtrl & 0x10) ? value.slice(6, 6 + curDataLen) : value.slice(4, 4 + curDataLen)
        // console.log('data pushing')
        receivedData.current.push({
          sequence,
          data: Array.from(data)
        })
        // console.log('data pushed:  ', receivedData.current)
        // 检查是否是最后一个包
        if (frameCtrl === 0x04) {
          // 按序列号排序并合并数据
          const sortedData = receivedData.current
            .sort((a, b) => a.sequence - b.sequence)
            .flatMap(item => item.data)

          receivedData.current = []
          const localResult = parseResult(new Uint8Array(sortedData))
          setResult(localResult)
        }
      }
    }

    // 监听蓝牙连接状态
    wx.onBLEConnectionStateChange(res => {
      if (!res.connected && !result) {
        console.log('蓝牙连接断开，重新连接')
        connectBluetoothDevice(selectedDevice.deviceId).then(() => {
          // 连接成功后，重新注册监听器
          wx.notifyBLECharacteristicValueChange({
            deviceId: selectedDevice.deviceId,
            serviceId: bluetoothService.PRIMARY_SERVICE_UUID,
            characteristicId: bluetoothService.RECEIVE_CHARACTERISTIC_UUID,
            state: true
          })
          wx.onBLECharacteristicValueChange(listener)
          sequenceControl.current = 0
        })
      }
    })

    // 启用 notify
    wx.notifyBLECharacteristicValueChange({
      deviceId: selectedDevice.deviceId,
      serviceId: bluetoothService.PRIMARY_SERVICE_UUID,
      characteristicId: bluetoothService.RECEIVE_CHARACTERISTIC_UUID,
      state: true
    })

    wx.onBLECharacteristicValueChange(listener)

    // 开始配网
    if (selectedDevice && selectedWifi) {
      handleSubmit(selectedDevice.deviceId, selectedWifi.SSID, passwordState.value)
    }

    // 清理函数
    return () => {
      // console.log('清理函数')
      wx.offBLECharacteristicValueChange()
      // 关闭通知
      if (selectedDevice) {
        wx.notifyBLECharacteristicValueChange({
          deviceId: selectedDevice.deviceId,
          serviceId: bluetoothService.PRIMARY_SERVICE_UUID,
          characteristicId: bluetoothService.RECEIVE_CHARACTERISTIC_UUID,
          state: false
        })
      }
    }
  }, [isActive, handleSubmit, selectedDevice, selectedWifi, passwordState.value, sequenceControl, result])

  const renderErrorTips = (error: string | undefined) => (
    <View className={styles.tips}>
      <View className={styles.tip}>{error}</View>
    </View>
  )

  return (
    <View className={styles.container} style={{ display: isActive ? 'block' : 'none' }}>
      {isSubmitting && (
        <>
          <View className={styles.header}>⌛️ 配网中...</View>
          <View className={styles.text}>📶 {selectedWifi?.SSID}</View>
          <View className={styles.text}>连接：{selectedWifi?.SSID}</View>
        </>
      )}
      {!isSubmitting && result && result.success && (
        <>
          <View className={styles.header}>🎉️ 配网成功！</View>
          <View className={styles.text}>📶 已成功连接到 {selectedWifi?.SSID}</View>
          <View
            className={styles.actionBtn}
            onTap={() => {
              const agentId = store.getCurrentDeviceNetConigAgentId()
              const deviceManageUrl = `${routeMap[Pages.XrobotDeviceManage]}?agentId=${agentId}`
              const manageAgentUrl = routeMap[Pages.XrobotManageAgent] // 智能体管理页面路由

              // 步骤1：用智能体管理页面替换当前配网页面（清除中间所有路由）
              switchTab({ url: manageAgentUrl })
              // 步骤2：从智能体管理页面跳转到设备管理页面（保持路由栈纯净）
              setTimeout(() => {
                navigateTo({
                  url: deviceManageUrl
                })
              }, 100) // 延迟确保第一步跳转完成
            }}
          >
            🔄 返回设备管理页面
          </View>
        </>
      )}
      {!isSubmitting && result && !result.success && (
        <>
          <View className={styles.header}>☹️ 配网失败</View>
          <View className={styles.text}>错误原因</View>
          {renderErrorTips(result.error)}
          <View
            className={styles.actionBtn}
            onTap={() => setCurrentStep('input-pwd')}
          >
            🔄 重新配置Wi-Fi
          </View>
        </>
      )}
    </View>
  )
}
