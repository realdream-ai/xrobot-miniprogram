import { host } from '@/constants/env'
import RequestService from '../httpRequest'

const baseUrl = host

/**
 * 音色对象类型
 * @property id 音色唯一ID
 * @property name 音色名称
 * @property language 音色语言
 * @property demo_url 试听音频链接
 * @property state 当前音色状态（Init/Success/Training/Failed）
 */
export type Voice = {
  id: string;
  name: string;
  language: string;
  demo_url: string;
  state: 'Init' | 'Success' | 'Training' | 'Failed';
};

/**
 * 通用API响应类型
 * @template T data字段类型
 * @property code 状态码，0为成功，非0为失败
 * @property msg 错误信息（失败时有值）
 * @property data 实际返回数据
 */
export type ApiResponse<T = any> = {
  code: number | string;
  msg: string;
  data: T;
};

export default {
  /**
   * 创建音色栏位
   * @param model_id string 复刻模型ID（如"QN_ACV"）
   * @param callback (res: ApiResponse<Voice>) => void 成功回调，res.data为新建音色对象
   * @param failCallback (err: Error) => void 失败回调
   * @returns void
   */
  voiceClone(
    model_id: string,
    callback: (res: ApiResponse<Voice>) => void,
    failCallback?: (err: Error) => void
  ) {
    RequestService.sendRequest()
      .url(`${baseUrl}/v1/voice-clones`)
      .method('POST')
      .data({ model_id })
      .success((res: ApiResponse<Voice>) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .fail((err: Error) => {
        RequestService.clearRequestTime()
        if (failCallback) failCallback(err)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.voiceClone(model_id, callback, failCallback)
        })
      })
      .send()
  },

  /**
   * 训练音色（上传音频或仅修改名称）
   * @param id string 音色ID
   * @param params { key?: string; name?: string } key为音频url，name为新名称
   * @param callback (res: ApiResponse<Voice>) => void 成功回调，res.data为音色对象
   * @param failCallback (err: Error) => void 失败回调
   * @returns void
   * @description key为空仅修改名称，不为空则根据url训练音色
   */
  trainVoiceClone(
    id: string,
    params: { key?: string; name?: string },
    callback: (res: ApiResponse<Voice>) => void,
    failCallback?: (err: Error) => void
  ) {
    RequestService.sendRequest()
      .url(`${baseUrl}/v1/voice-clones/${id}`)
      .method('PUT')
      .data(params)
      .success((res: ApiResponse<Voice>) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .fail((err: Error) => {
        RequestService.clearRequestTime()
        if (failCallback) failCallback(err)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.trainVoiceClone(id, params, callback, failCallback)
        })
      })
      .send()
  },

  /**
   * 获取音色详情
   * @param id string 音色ID
   * @param callback (res: ApiResponse<Voice>) => void 成功回调，res.data为音色对象
   * @param failCallback (err: Error) => void 失败回调
   * @returns void
   */
  getVoiceClone(
    id: string,
    callback: (res: ApiResponse<Voice>) => void,
    failCallback?: (err: Error) => void
  ) {
    RequestService.sendRequest()
      .url(`${baseUrl}/v1/voice-clones/${id}`)
      .method('GET')
      .success((res: ApiResponse<Voice>) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .fail((err: Error) => {
        RequestService.clearRequestTime()
        if (failCallback) failCallback(err)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.getVoiceClone(id, callback, failCallback)
        })
      })
      .send()
  },

  /**
   * 获取当前用户所有音色列表
   * @param callback (res: ApiResponse<{ voices: Voice[] }>) => void 成功回调，res.data.voices为音色数组
   * @param failCallback (err: Error) => void 失败回调
   * @returns void
   */
  listVoiceClones(
    callback: (res: ApiResponse<{ voices: Voice[] }>) => void,
    failCallback?: (err: Error) => void,
    finalCallback?: () => void
  ) {
    RequestService.sendRequest()
      .url(`${baseUrl}/v1/voice-clones`)
      .method('GET')
      .success((res: ApiResponse<{ voices: Voice[] }>) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .fail((err: Error) => {
        RequestService.clearRequestTime()
        if (failCallback) failCallback(err)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.listVoiceClones(callback, failCallback)
        })
      })
      .finalCallback(() => {
        if (finalCallback) finalCallback()
      })
      .send()
  },

  /**
   * 删除指定音色
   * @param id string 音色ID
   * @param callback (res: ApiResponse<Record<string, unknown>>) => void 成功回调
   * @param failCallback (err: Error) => void 失败回调
   * @returns void
   */
  deleteVoiceClone(
    id: string,
    callback: (res: ApiResponse<Record<string, unknown>>) => void,
    failCallback?: (err: Error) => void
  ) {
    RequestService.sendRequest()
      .url(`${baseUrl}/v1/voice-clones/${id}`)
      .method('DELETE')
      .success((res: ApiResponse<Record<string, unknown>>) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .fail((err: Error) => {
        RequestService.clearRequestTime()
        if (failCallback) failCallback(err)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.deleteVoiceClone(id, callback, failCallback)
        })
      })
      .send()
  }
}
