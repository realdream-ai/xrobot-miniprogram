/**
 * @file signup runtime(wechat version)
 */

import { login as wechatLogin } from 'remax/wechat'

import { promisify } from '@/utils/promise'
import { postJSONWithCommonRes } from '@/utils/fetchs/fetchWithCommonRes'
import { ssoApiPrefix } from '@/constants/api'
import { ssoErrCodeMsgMap, ucBizErrCodeMsgMap } from '@/constants/error-code-messages'

type SignUpWithPhoneOptions = {
  /** 根据授权手机号查询账号列表返回的登录/注册凭证 */
  token: string
  /** 可选，扫码登录和扫码注册场景 */
  qr_key?: string
}

/** 手机号快捷登录时自动注册 */
export default function signUpWithPhone(options: SignUpWithPhoneOptions) {
  return promisify(wechatLogin)().then(({ code, errMsg }: WechatMiniprogram.LoginSuccessCallbackResult) => {
    if (code) {
      return postJSONWithCommonRes(
        `${ssoApiPrefix}/signup/phone/authorize`,
        { ...options, wx_code: code },
        { errCodeMsgMap: { ...ssoErrCodeMsgMap, ...ucBizErrCodeMsgMap } }
      ).then(
        res => Promise.resolve(res),
        err => Promise.reject(err)
      )
    }

    return Promise.reject(errMsg)
  })
}
