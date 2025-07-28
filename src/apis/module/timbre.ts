import { getServiceUrl } from '../api'
import RequestService from '../httpRequest'

export default {
  // 获取音色
  getVoiceList(
    params: {
      ttsModelId: string;
      page?: number;
      limit?: number;
      name?: string;
    },
    callback: (res: any) => void
  ) {
    const queryParams = new URLSearchParams({
      ttsModelId: params.ttsModelId,
      page: params.page?.toString() || '1',
      limit: params.limit?.toString() || '10',
      name: params.name || ''
    }).toString()

    RequestService.sendRequest()
      .url(`${getServiceUrl()}/ttsVoice?${queryParams}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res.data || [])
      })
      .networkFail((err: Error) => {
        console.error('获取音色列表失败:', err)
        RequestService.reAjaxFun(() => {
          this.getVoiceList(params, callback)
        })
      })
      .send()
  },

  // 音色保存
  saveVoice(
    params: {
      ttsModelId: string;
      languageType: string[];
      voiceName: string;
      voiceCode: string;
      referenceAudio?: string;
      referenceText?: string;
      voiceDemo?: string;
      remark?: string;
      sort?: number;
    },
    callback: (res: any) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/ttsVoice`)
      .method('POST')
      .data(
        JSON.stringify({
          languages: params.languageType,
          name: params.voiceName,
          remark: params.remark,
          referenceAudio: params.referenceAudio,
          referenceText: params.referenceText,
          sort: params.sort,
          ttsModelId: params.ttsModelId,
          ttsVoice: params.voiceCode,
          voiceDemo: params.voiceDemo || ''
        })
      )
      .success((res: any) => {
        callback(res.data)
      })
      .networkFail((err: Error) => {
        console.error('保存音色失败:', err)
        RequestService.reAjaxFun(() => {
          this.saveVoice(params, callback)
        })
      })
      .send()
  },

  // 音色删除
  deleteVoice(ids: string[], callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/ttsVoice/delete`)
      .method('POST')
      .data(ids)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('删除音色失败:', err)
        RequestService.reAjaxFun(() => {
          this.deleteVoice(ids, callback)
        })
      })
      .send()
  },

  // 音色修改
  updateVoice(
    params: {
      id: string;
      ttsModelId: string;
      languageType: string[];
      voiceName: string;
      voiceCode: string;
      referenceAudio?: string;
      referenceText?: string;
      voiceDemo?: string;
      remark?: string;
      sort?: number;
    },
    callback: (res: any) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/ttsVoice/${params.id}`)
      .method('PUT')
      .data(
        JSON.stringify({
          languages: params.languageType,
          name: params.voiceName,
          remark: params.remark,
          referenceAudio: params.referenceAudio,
          referenceText: params.referenceText,
          ttsModelId: params.ttsModelId,
          ttsVoice: params.voiceCode,
          voiceDemo: params.voiceDemo || ''
        })
      )
      .success((res: any) => {
        callback(res.data)
      })
      .networkFail((err: Error) => {
        console.error('修改音色失败:', err)
        RequestService.reAjaxFun(() => {
          this.updateVoice(params, callback)
        })
      })
      .send()
  }
}
