/**
 * @file getPhoneNumber runtime(wechat version)
 */

import { postJSONWithCommonRes } from '@/utils/fetchs/fetchWithCommonRes'
import { ucBizApiPrefix } from '@/constants/api'

export type PhoneInfo = {
  /** 用户绑定的手机号（国外手机号会有区号 */
  phoneNumber: string
  /** 没有区号的手机号 */
  purePhoneNumber: string
  /** 区号 */
  countryCode: string
}

/** 根据 wx phone code 获取 phone 信息 */
export default async function getPhoneNumber(phoneCode: string): Promise<PhoneInfo> {
  const {
    phone_number: phoneNumber,
    pure_phone_number: purePhoneNumber,
    country_code: countryCode
  } = await postJSONWithCommonRes(
    `${ucBizApiPrefix}/wx/mini-program/code2phonenumber?wx_phone_code=${phoneCode}`,
    { wx_phone_code: phoneCode }
  )

  return { phoneNumber, purePhoneNumber, countryCode }
}
