import { ApiResponse } from '@/pages/common/types'
import { Agent } from '@/pages/agent/manage-agent/types'
import { getServiceUrl } from '../api'
import RequestService from '../httpRequest'
// 登陆时未获取token，第一次请求agentlist时会401，并在httpRequest中后请求
export default {
  // 获取智能体列表
  getAgentList(callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent/list`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.getAgentList(callback)
        })
      })
      .send()
  },

  // 添加智能体
  addAgent(agentName: string, callback: (res: ApiResponse<Agent>) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent`)
      .method('POST')
      .data({ agentName })
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.addAgent(agentName, callback)
        })
      })
      .send()
  },

  // 删除智能体
  deleteAgent(agentId: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent/${agentId}`)
      .method('DELETE')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.deleteAgent(agentId, callback)
        })
      })
      .send()
  },

  // 获取智能体配置
  getDeviceConfig(agentId: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent/${agentId}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.getDeviceConfig(agentId, callback)
        })
      })
      .send()
  },

  // 配置智能体
  updateAgentConfig(
    agentId: string,
    configData: Partial<Agent>,
    callback: (res: any) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent/${agentId}`)
      .method('PUT')
      .data(configData)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.updateAgentConfig(agentId, configData, callback)
        })
      })
      .send()
  },

  // 获取智能体模板
  getAgentTemplate(callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent/template`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((_err: Error) => {
        RequestService.reAjaxFun(() => {
          this.getAgentTemplate(callback)
        })
      })
      .send()
  },

  // 获取智能体会话列表
  getAgentSessions(
    agentId: string,
    params: { page?: number; limit?: number },
    callback: (res: any) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent/${agentId}/sessions`)
      .method('GET')
      .data(params)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.getAgentSessions(agentId, params, callback)
        })
      })
      .send()
  },

  // 获取智能体聊天记录
  getAgentChatHistory(
    agentId: string,
    sessionId: string,
    callback: (res: any) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent/${agentId}/chat-history/${sessionId}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.getAgentChatHistory(agentId, sessionId, callback)
        })
      })
      .send()
  },

  // 获取音频下载ID
  getAudioId(audioId: string, callback: (res: ApiResponse<any>) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent/audio/${audioId}`)
      .method('POST')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.getAudioId(audioId, callback)
        })
      })
      .send()
  },

  // 获取智能体的MCP接入点地址
  getAgentMcpAccessAddress(agentId: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent/mcp/address/${agentId}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.getAgentMcpAccessAddress(agentId, callback)
        })
      })
      .send()
  },

  // 获取智能体的MCP工具列表
  getAgentMcpToolsList(agentId: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/agent/mcp/tools/${agentId}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.getAgentMcpToolsList(agentId, callback)
        })
      })
      .send()
  }
}
