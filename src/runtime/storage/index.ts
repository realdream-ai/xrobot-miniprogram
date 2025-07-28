import { getStorageSync as getWxStorageSync, setStorageSync as setWxStorageSync } from 'remax/wechat'

export function getStorageSync<T>(key: string): T | undefined {
  const content = getWxStorageSync(key)
  // 类型是 any，但是实际效果是拿不到会给空字符串
  if (content === '') {
    return undefined
  }
  return content
}

export function setStorageSync<T>(key: string, data: T) {
  return setWxStorageSync(key, data)
}
