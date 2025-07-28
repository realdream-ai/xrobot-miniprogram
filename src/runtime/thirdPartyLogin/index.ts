/**
 * @file thirdPartyLogin runtime(wechat version)
 */

import { login as wechatLogin } from 'remax/wechat'

import { postJSONWithCommonRes } from '@/utils/fetchs/fetchWithCommonRes'
import { promisify } from '@/utils/promise'

import { apiPrefix } from '@/constants/api'

export default function thirdPartyLogin() {
  return promisify(wechatLogin)().then(({ code, errMsg }: WechatMiniprogram.LoginSuccessCallbackResult) => {
    if (code) {
      return postJSONWithCommonRes(
        `${apiPrefix}/user-center/third-party/wxmp/login`,
        { code }
      )
    }

    return Promise.reject(errMsg)
  })
}
