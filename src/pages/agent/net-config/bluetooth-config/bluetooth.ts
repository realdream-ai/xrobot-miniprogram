/// <reference types="miniprogram-api-typings" />
import { promisify } from '@/utils/promise'

export interface BluetoothDevice extends WechatMiniprogram.BluetoothDeviceInfo {
  connected?: boolean;
}

// 初始化蓝牙模块
export async function initBluetooth() {
  try {
    await promisify(wx.openBluetoothAdapter)()
  } catch (error) {
    throw new Error('请开启手机蓝牙后重试')
  }
}

// 重置蓝牙模块
export async function resetBluetooth() {
  await promisify(wx.stopBluetoothDevicesDiscovery)()
  await promisify(wx.closeBluetoothAdapter)()
  await new Promise(resolve => setTimeout(resolve, 1000))
  await initBluetooth()
}

// 搜索蓝牙设备
export async function searchBluetoothDevices(): Promise<
  WechatMiniprogram.BlueToothDevice[]
> {
  // 开始搜索
  await promisify(wx.startBluetoothDevicesDiscovery)({
    allowDuplicatesKey: false
  })

  // 等待一段时间以收集设备
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 获取搜索到的设备
  const { devices } = await promisify(wx.getBluetoothDevices)()
  console.log('搜索到的设备:', devices)
  return devices
}

// 存储 primary uuid 的变量
export const bluetoothService = {
  PRIMARY_SERVICE_UUID: '0000FFFF-0000-1000-8000-00805F9B34FB',
  SEND_CHARACTERISTIC_UUID: '0000FF01-0000-1000-8000-00805F9B34FB',
  RECEIVE_CHARACTERISTIC_UUID: '0000FF02-0000-1000-8000-00805F9B34FB'
}

// 连接蓝牙设备
export async function connectBluetoothDevice(deviceId: string) {
  await promisify(wx.createBLEConnection)({ deviceId })
  const res = await promisify(wx.getBLEDeviceServices)({ deviceId })

  // 存储所有特性处理的 Promise
  const characteristicPromises = res.services
    .filter(service => service.isPrimary) // 只处理主服务
    .map(async service => {
      // 存储uuid名，给其他页面使用
      // bluetoothService.PRIMARY_SERVICE_UUID = service.uuid;

      await promisify(wx.getBLEDeviceCharacteristics)({
        deviceId,
        serviceId: service.uuid
      })
    })

  // 等待所有特性处理完成
  await Promise.all(characteristicPromises)
}

// 获取已连接的蓝牙设备
export async function getConnectedBluetoothDevices(): Promise<
  WechatMiniprogram.BlueToothDevice[]
> {
  if (!bluetoothService.PRIMARY_SERVICE_UUID) {
    console.log('蓝牙设备未连接')
    return []
  }
  const { devices } = await promisify(wx.getConnectedBluetoothDevices)({
    services: [bluetoothService.PRIMARY_SERVICE_UUID] // 指定特定服务
  })
  return devices as WechatMiniprogram.BlueToothDevice[]
}
