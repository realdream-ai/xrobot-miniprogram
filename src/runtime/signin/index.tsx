/**
 * @file signin runtime(wechat version)
 */
import { postJSONWithCommonRes } from '@/utils/fetchs/fetchWithCommonRes'
import { ssoApiPrefix } from '@/constants/api'
import { ssoErrCodeMsgMap, ucBizErrCodeMsgMap } from '@/constants/error-code-messages'

export type SigninWithPhoneOptions = {
  /** 根据授权手机号查询账号列表返回的登录凭证 */
  token: string
  /** 在手机号绑定的账号列表里选中的账号 ID */
  account_id: string
  /** 可选，扫码登录和扫码注册场景（会同时登录 Portal，更新二维码状态） */
  qr_key?: string
}

/** 手机号快捷登录绑定账号 */
export function signinWithPhone(options: SigninWithPhoneOptions) {
  return postJSONWithCommonRes(
    `${ssoApiPrefix}/signin/phone/authorize`,
    options,
    { errCodeMsgMap: { ...ssoErrCodeMsgMap, ...ucBizErrCodeMsgMap } }
  ).then(
    res => Promise.resolve(res),
    err => Promise.reject(err)
  )
}
