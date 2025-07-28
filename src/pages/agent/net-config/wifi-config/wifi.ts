/// <reference types="miniprogram-api-typings" />
import { promisify } from '@/utils/promise'
import { fetch } from '@/utils/fetchs'
import { getAuthSetting } from '@/utils/auth-cache'

// 重写微信小程序的WiFi相关类型定义
declare const wx: Omit<WechatMiniprogram.Wx, 'onGetWifiList'> & {
  onGetWifiList(callback: (res: { wifiList: WechatMiniprogram.WifiInfo[] }) => void): void
}

interface APIWifiInfo {
  ssid: string
  rssi: number
  authmode: number
}

export async function startWifi(): Promise<void> {
  try {
    await promisify(wx.startWifi)()
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start wifi:', err)
    throw err
  }
}

export async function authorizeUserLocation(): Promise<boolean> {
  const authorization = 'scope.userLocation'
  try {
    const authSetting = await getAuthSetting()
    // eslint-disable-next-line no-console
    console.log('用户授权 authSetting:', authSetting)
    if (authSetting[authorization]) return true
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('查询用户授权设置失败:', e)
  }
  try {
    await promisify(wx.authorize)({ scope: authorization })
    // eslint-disable-next-line no-console
    console.log('获取用户授权 scope.userLocation 成功')
    return true
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('获取用户授权 scope.userLocation 失败:', e)
    return false
  }
}

export async function getWifiList(
  isIOS: boolean,
  isSelectDevice = false
): Promise<WechatMiniprogram.WifiInfo[]> {
  // SelectWifi 时，iOS 和 Android 都调用 scan 函数
  if (!isSelectDevice) {
    try {
      const wifiList = (await fetch('http://192.168.4.1/scan')) as APIWifiInfo[]
      return wifiList.map((wifi: APIWifiInfo) => ({
        SSID: wifi.ssid,
        BSSID: '', // API没有返回BSSID
        secure: wifi.authmode > 0,
        signalStrength: normalizeSignalStrength(Math.abs(wifi.rssi + 100), false),
        frequency: 0 // API没有返回frequency信息，设置默认值
      }))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('获取 WiFi 列表失败:', err)
      return []
    }
  }

  // SelectDevice 时，只有 Android 调用微信的 getWifiList 函数
  if (!isIOS) {
    const authorized = await authorizeUserLocation()
    if (!authorized) {
      // eslint-disable-next-line no-console
      console.warn('获取 WiFi 列表失败: 用户未授权 scope.userLocation')
      return []
    }

    return new Promise((resolve, reject) => {
      wx.onGetWifiList(res => {
        // eslint-disable-next-line no-console
        console.log('获取到 WiFi 列表:', res)
        resolve(res.wifiList || [])
      })
      promisify(wx.getWifiList)().catch(e => {
        // eslint-disable-next-line no-console
        console.error('获取 WiFi 列表失败:', e)
        reject(e)
      })
    })
  }

  return []
}

export async function getConnectedWifi(): Promise<WechatMiniprogram.WifiInfo | null> {
  try {
    const res = await promisify(wx.getConnectedWifi)()
    // eslint-disable-next-line no-console
    console.log('获取到当前连接的 WiFi:', res.wifi)
    return res.wifi
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('获取当前连接的 WiFi 失败:', err)
    return null
  }
}

export async function connectWifi(ssid: string, password: string, isIOS: boolean): Promise<void> {
  // 安卓直接 wx.connectWifi success 了就是连上了，ios 要等 wx.onWifiConnected 事件触发才是连上了
  if (isIOS) {
    return new Promise((resolve, reject) => {
      wx.onWifiConnected(res => {
        // eslint-disable-next-line no-console
        console.log('ios 连接 WiFi 成功:', res)
        resolve()
      })
      promisify(wx.connectWifi)({
        SSID: ssid,
        password
      }).catch(e => {
        // eslint-disable-next-line no-console
        console.error('连接 WiFi 失败:', e)
        reject(e)
      })
    })
  }
  try {
    const res = await promisify(wx.connectWifi)({
      SSID: ssid,
      password
    })
    // eslint-disable-next-line no-console
    console.log('连接 WiFi 成功:', res)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('连接 WiFi 失败:', e)
    throw e
  }
}

// WiFi 信号强度 安卓取值 0-100 iOS 取值 0-1，统一转换为 0-100
export function normalizeSignalStrength(strength: number, isIOS: boolean): number {
  if (strength < 0) return 0
  if (strength > 100) return 100
  return isIOS ? Math.round(strength * 100) : Math.round(strength)
}
