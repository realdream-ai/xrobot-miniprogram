
/**
 * 判断是否为空
 * @param data
 * @returns {boolean}
 */
export function isNull(data: any) {
  if (data === undefined) {
    return true
  } if (data === null) {
    return true
  } if (
    typeof data === 'string'
    && (data.length === 0
      || data === ''
      || data === 'undefined'
      || data === 'null')
  ) {
    return true
  } if (data instanceof Array && data.length === 0) {
    return true
  }
  return false
}

/**
 * 判断不为空
 * @param data
 * @returns {boolean}
 */
export function isNotNull(data: any) {
  return !isNull(data)
}
