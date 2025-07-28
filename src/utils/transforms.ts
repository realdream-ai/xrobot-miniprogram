/**
 * @file transforms index content
 */

// web 端 cookie 是用分号分隔的
// 需要将 response header 中的 Set-Cookie 转换成 web cookie 格式
export function transformCookieToWeb(origin: string) {
  if (!origin) return ''

  const filterRegex = /(^(QINIU_SSO_SESSION=|SSID=|PORTAL_UID=).*?);/

  const splitArr = origin.split(',')
  const matchArr = splitArr.map((item: string) => {
    const match = item.trim().match(filterRegex)
    return match && match[1] || ''
  })

  return matchArr.filter(item => !!item).join('; ')
}

export function combineCookie(oldCookie: string, newCookie: string): string {
  // cookie为空直接返回
  if (!oldCookie || !newCookie) {
    return oldCookie + newCookie
  }

  const cookieMap = new Map<string, string>()

  oldCookie.split(';').forEach(item => {
    cookieMap.set(item.split('=')[0].trim(), item)
  })

  // 新cookie覆盖旧cookie
  newCookie.split(';').forEach(item => {
    cookieMap.set(item.split('=')[0].trim(), item)
  })

  return Array.from(cookieMap.values()).join(';')
}

// 隐藏手机号中间四位
export function makeMobileAnon(mobile: string | number) {
  const regex = /(\d{3})\d{4}(\d{4})/
  return `${mobile}`.replace(regex, '$1****$2')
}
