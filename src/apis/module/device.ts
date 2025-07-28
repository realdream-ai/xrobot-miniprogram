import { ApiResponse } from '@/pages/common/types'
import { getServiceUrl } from '../api'
import RequestService from '../httpRequest'

export default {
  // 已绑设备
  getAgentBindDevices(
    agentId: string,
    callback: (res: ApiResponse<any[]>) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/device/bind/${agentId}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取设备列表失败:', err)
        RequestService.reAjaxFun(() => {
          this.getAgentBindDevices(agentId, callback)
        })
      })
      .send()
  },

  // 解绑设备
  unbindDevice(deviceId: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/device/unbind`)
      .method('POST')
      .data({ deviceId })
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('解绑设备失败:', err)
        RequestService.reAjaxFun(() => {
          this.unbindDevice(deviceId, callback)
        })
      })
      .send()
  },

  // 绑定设备
  bindDevice(
    agentId: string,
    deviceCode: string,
    callback: (res: ApiResponse<any>) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/device/bind/${agentId}/${deviceCode}`)
      .method('POST')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('绑定设备失败:', err)
        RequestService.reAjaxFun(() => {
          this.bindDevice(agentId, deviceCode, callback)
        })
      })
      .send()
  },

  // 更新设备信息
  updateDeviceInfo(
    id: string,
    payload: Partial<any>,
    callback: (res: any) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/device/update/${id}`)
      .method('PUT')
      .data(payload)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('更新OTA状态失败:', err)
        console.error(err || '更新OTA状态失败')
        RequestService.reAjaxFun(() => {
          this.updateDeviceInfo(id, payload, callback)
        })
      })
      .send()
  },

  // 手动添加设备
  manualAddDevice(
    params: { deviceCode: string; name?: string },
    callback: (res: ApiResponse<any>) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/device/manual-add`)
      .method('POST')
      .data(params)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('手动添加设备失败:', err)
        RequestService.reAjaxFun(() => {
          this.manualAddDevice(params, callback)
        })
      })
      .send()
  }
}
