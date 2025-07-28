import { Param } from '@/pages/common/types'
import { getServiceUrl } from '../api'
import RequestService from '../httpRequest'

export default {
  // 用户列表
  getUserList(
    params: { page: number; limit: number; mobile?: string },
    callback: (res: any) => void
  ) {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      mobile: params.mobile || ''
    }).toString()

    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/users?${queryParams}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.getUserList(params, callback)
        })
      })
      .send()
  },

  // 删除用户
  deleteUser(id: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/users/${id}`)
      .method('DELETE')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.deleteUser(id, callback)
        })
      })
      .send()
  },

  // 重置用户密码
  resetUserPassword(id: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/users/${id}`)
      .method('PUT')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.resetUserPassword(id, callback)
        })
      })
      .send()
  },

  // 获取参数列表
  getParamsList(
    params: { page: number; limit: number; paramCode?: string },
    callback: (res: any) => void
  ) {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      paramCode: params.paramCode || ''
    }).toString()

    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/params/page?${queryParams}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.getParamsList(params, callback)
        })
      })
      .send()
  },

  // 保存参数
  addParam(data: Partial<Param>, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/params`)
      .method('POST')
      .data(data)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.addParam(data, callback)
        })
      })
      .send()
  },

  // 修改参数
  updateParam(data: Param, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/params`)
      .method('PUT')
      .data(data)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.updateParam(data, callback)
        })
      })
      .send()
  },

  // 删除参数
  deleteParam(ids: string[], callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/params/delete`)
      .method('POST')
      .data(ids)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.deleteParam(ids, callback)
        })
      })
      .send()
  },

  // 获取ws服务端列表
  getWsServerList(params: Record<string, any>, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/server/server-list`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.getWsServerList(params, callback)
        })
      })
      .send()
  },

  // 发送ws服务器动作指令
  sendWsServerAction(
    data: { serverId: string; action: string },
    callback: (res: any) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/server/emit-action`)
      .method('POST')
      .data(data)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.sendWsServerAction(data, callback)
        })
      })
      .send()
  }
}
