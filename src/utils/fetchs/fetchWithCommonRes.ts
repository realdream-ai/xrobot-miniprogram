/**
 * @file fetchs with common response
 */

import { ICommonFetchResult, CommonApiError } from '@/constants/api'

import { getMsgFromErrCode } from '@/utils/exception'

import { WxPayEnvConflictErrCode } from '@/constants/error-code-messages'
import { FetchOptions, FetchExtraOptions, getHeader, fetch } from '.'

export function fetchWithCommonRes(url: string, options?: FetchOptions, useErrMsgFromResp = false): Promise<any> {
  options = {
    method: 'GET',
    dataType: 'json',
    header: getHeader(options ? options.header : {}),
    ...options
  }

  return fetch(url, options).then((res: ICommonFetchResult) => {
    if (res) {
      if (res.code !== 200) { // 业务返回错误
        let errMsg
        if (res.code === WxPayEnvConflictErrCode) errMsg = res.message
        else {
          errMsg = getMsgFromErrCode(
            res.code,
            options?.errCodeMsgMap || {},
            useErrMsgFromResp ? res.message : undefined
          )
        }
        throw new CommonApiError(res.code, null, errMsg)
      }

      return res.data
    }

    return res
  })
}

export function postJSONWithCommonRes(url: string, body: any, extra?: FetchExtraOptions) {
  return fetchWithCommonRes(url, { method: 'POST', data: body, ...extra }, extra?.useErrMsgFromResp)
}

export function putJSONWithCommonRes(url: string, body: any, extra?: FetchExtraOptions) {
  return fetchWithCommonRes(url, { method: 'PUT', data: body, ...extra }, extra?.useErrMsgFromResp)
}

export function deleteJSONWithCommonRes(url: string, body: any, extra?: FetchExtraOptions) {
  return fetchWithCommonRes(url, { method: 'DELETE', data: body, ...extra }, extra?.useErrMsgFromResp)
}
