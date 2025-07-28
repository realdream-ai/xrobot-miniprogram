/**
 * @file api 相关常量
 */

import { apiHost } from './env'

export const apiPrefix = `${apiHost}/api/proxy`

export const ucBizApiPrefix = `${apiPrefix}/uc-biz`

export const ssoApiPrefix = `${apiPrefix}/sso`

// 小程序后端调用 gaea && order 等内部系统现有接口，用 janus 做一层转发
// gaea 接口返回外面包了一层，格式统一为
// {
//   code: ...
//   data: ...
//   message?: ...
// }
export interface ICommonFetchResult<T = any> {
  code: number
  data: T
  message?: string
}

export class CommonApiError {
  constructor(
    public code: number | string,
    public data: unknown,
    public message: string
  ) {}
}
