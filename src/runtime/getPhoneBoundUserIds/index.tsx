/**
 * @file getPhoneBoundUserIds runtime(wechat version)
 */

import { fetchWithCommonRes } from '@/utils/fetchs/fetchWithCommonRes'
import { ssoApiPrefix } from '@/constants/api'
import { ssoErrCodeMsgMap } from '@/constants/error-code-messages'

export enum IdentityCategory {
  None = 0,
  Personal = 1,
  Enterprise = 2
}

export const identityCategoryTextMap: Record<IdentityCategory, string> = {
  [IdentityCategory.None]: '未认证',
  [IdentityCategory.Personal]: '个人认证',
  [IdentityCategory.Enterprise]: '企业认证'
}

export type UserID = {
  user_id: string // 匿名 ID
  full_name: string
  email: string
  account_id: string // 客户 ID
  identity_category: IdentityCategory
  last_login_time: string // 上次登录时间，格式：2006-01-02T15:04:05Z
}

export interface PhoneBoundUserIdsResp {
  user_ids: UserID[]
  /** 用于登录或注册的凭证，一次有效，有效时长 5 分钟 */
  token: string
  /** 绑定账号数量 */
  count: number
}

/** 获取手机号绑定的 userId 列表 */
export default function getPhoneBoundUserIds(wxPhoneCode: string): Promise<PhoneBoundUserIdsResp> {
  return fetchWithCommonRes(`${ssoApiPrefix}/user-ids/wx/phone?wx_phone_code=${wxPhoneCode}`, { errCodeMsgMap: ssoErrCodeMsgMap })
}
