import { promisify } from './promise'

const CACHE_KEY = 'wx_auth_setting'
const CACHE_EXPIRE_TIME = 5 * 60 * 1000 // 5分钟缓存时间

interface AuthSettingCache {
  authSetting: WechatMiniprogram.IAnyObject
  timestamp: number
}

/**
 * 获取缓存的授权设置
 */
async function getCachedAuthSetting(): Promise<WechatMiniprogram.IAnyObject | null> {
  try {
    const res = await promisify(wx.getStorage)({ key: CACHE_KEY })
    const cache = res.data as AuthSettingCache
    // 检查缓存是否过期
    if (Date.now() - cache.timestamp > CACHE_EXPIRE_TIME) {
      await promisify(wx.removeStorage)({ key: CACHE_KEY })
      return null
    }
    return cache.authSetting
  } catch {
    return null
  }
}

/**
 * 缓存授权设置
 */
async function cacheAuthSetting(authSetting: WechatMiniprogram.IAnyObject): Promise<void> {
  const cache: AuthSettingCache = {
    authSetting,
    timestamp: Date.now()
  }
  await promisify(wx.setStorage)({
    key: CACHE_KEY,
    data: cache
  })
}
/**
 * 获取授权设置，优先使用缓存
 */
export async function getAuthSetting(): Promise<WechatMiniprogram.IAnyObject> {
  // 尝试获取缓存
  const cachedSetting = await getCachedAuthSetting()
  if (cachedSetting) {
    return cachedSetting
  }

  // 缓存不存在或已过期，重新获取
  const { authSetting } = await promisify(wx.getSetting)()
  // 缓存新的授权设置
  await cacheAuthSetting(authSetting)
  return authSetting
}
