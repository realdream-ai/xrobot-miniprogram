import { host } from '@/constants/env'
import { getServiceUrl } from '../api'
import RequestService from '../httpRequest'

export default {
  // 获取模型配置列表
  getModelList(
    params: {
      modelType: string;
      modelName?: string;
      page?: number;
      limit?: number;
    },
    callback: (res: any) => void
  ) {
    const queryParams = new URLSearchParams({
      modelType: params.modelType,
      modelName: params.modelName || '',
      page: params.page?.toString() || '0',
      limit: params.limit?.toString() || '10'
    }).toString()

    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/list?${queryParams}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取模型列表失败:', err)
        RequestService.reAjaxFun(() => {
          this.getModelList(params, callback)
        })
      })
      .send()
  },

  // 获取模型供应器列表
  getModelProviders(modelType: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/${modelType}/provideTypes`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res.data || [])
      })
      .networkFail((err: Error) => {
        console.error('获取供应器列表失败:', err)
        console.error('获取供应器列表失败')
        RequestService.reAjaxFun(() => {
          this.getModelProviders(modelType, callback)
        })
      })
      .send()
  },

  // 新增模型配置
  addModel(
    params: {
      modelType: string;
      provideCode: string;
      formData: any;
    },
    callback: (res: any) => void
  ) {
    const { modelType, provideCode, formData } = params
    const postData: any = {
      modelCode: formData.modelCode,
      modelName: formData.modelName,
      isDefault: formData.isDefault ? 1 : 0,
      isEnabled: formData.isEnabled ? 1 : 0,
      configJson: formData.configJson,
      docLink: formData.docLink,
      remark: formData.remark,
      sort: formData.sort || 0
    }

    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/${modelType}/${provideCode}`)
      .method('POST')
      .data(postData)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('新增模型失败:', err)
        console.error('新增模型失败', err)
        RequestService.reAjaxFun(() => {
          this.addModel(params, callback)
        })
      })
      .send()
  },

  // 删除模型配置
  deleteModel(id: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/${id}`)
      .method('DELETE')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('删除模型失败:', err)
        console.error('删除模型失败', err)
        RequestService.reAjaxFun(() => {
          this.deleteModel(id, callback)
        })
      })
      .send()
  },

  // 获取模型名称列表
  getModelNames(
    modelType: string,
    modelName: string,
    callback: (res: any) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/names`)
      .method('GET')
      .data({ modelType, modelName })
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.getModelNames(modelType, modelName, callback)
        })
      })
      .send()
  },

  // todo: qiniu服务器api与开源接口差异 - 接口路径不同
  // 获取模型音色列表
  getModelVoices(
    modelId: string,
    // voiceName?: string,
    callback: (res: any) => void
  ) {
    RequestService.sendRequest()
      .url(
        // `${getServiceUrl()}/models/${modelId}/voices?voiceName=${voiceName || ''}`
        `${host}/v1/models/${modelId}/voices`
      )
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.getModelVoices(modelId, callback)
        })
      })
      .send()
  },

  // 获取单个模型配置
  getModelConfig(id: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/${id}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取模型配置失败:', err)
        console.error('获取模型配置失败', err)
        RequestService.reAjaxFun(() => {
          this.getModelConfig(id, callback)
        })
      })
      .send()
  },

  // 启用/禁用模型状态
  updateModelStatus(id: string, status: number, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/enable/${id}/${status}`)
      .method('PUT')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('更新模型状态失败:', err)
        console.error('更新模型状态失败', err)
        RequestService.reAjaxFun(() => {
          this.updateModelStatus(id, status, callback)
        })
      })
      .send()
  },

  // 更新模型配置
  updateModel(
    params: {
      modelType: string;
      provideCode: string;
      id: string;
      formData: any;
    },
    callback: (res: any) => void
  ) {
    const { modelType, provideCode, id, formData } = params
    const payload: any = {
      ...formData,
      configJson: formData.configJson
    }
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/${modelType}/${provideCode}/${id}`)
      .method('PUT')
      .data(payload)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('更新模型失败:', err)
        console.error('更新模型失败', err)
        RequestService.reAjaxFun(() => {
          this.updateModel(params, callback)
        })
      })
      .send()
  },

  // 设置默认模型
  setDefaultModel(id: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/default/${id}`)
      .method('PUT')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('设置默认模型失败:', err)
        console.error('设置默认模型失败', err)
        RequestService.reAjaxFun(() => {
          this.setDefaultModel(id, callback)
        })
      })
      .send()
  },

  // 获取模型供应器列表（支持查询参数）
  getModelProvidersPage(
    params: {
      name?: string;
      modelType?: string;
      page?: number;
      limit?: number;
    },
    callback: (res: any) => void
  ) {
    const queryParams = new URLSearchParams()
    if (params.name) queryParams.append('name', params.name)
    if (params.modelType) queryParams.append('modelType', params.modelType)
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString())
    }
    if (params.limit !== undefined) {
      queryParams.append('limit', params.limit.toString())
    }

    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/provider?${queryParams.toString()}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取供应器列表失败', err)
        RequestService.reAjaxFun(() => {
          this.getModelProvidersPage(params, callback)
        })
      })
      .send()
  },

  // 新增模型供应器配置
  addModelProvider(
    params: {
      modelType: string;
      providerCode: string;
      name: string;
      fields: any[];
      sort?: number;
    },
    callback: (res: any) => void
  ) {
    const postData: any = {
      modelType: params.modelType || '',
      providerCode: params.providerCode || '',
      name: params.name || '',
      fields: JSON.stringify(params.fields || []),
      sort: params.sort || 0
    }

    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/provider`)
      .method('POST')
      .data(postData)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('新增模型供应器失败:', err)
        console.error('新增模型供应器失败', err)
        RequestService.reAjaxFun(() => {
          this.addModelProvider(params, callback)
        })
      })
      .send()
  },

  // 更新模型供应器配置
  updateModelProvider(
    params: {
      id: string;
      modelType: string;
      providerCode: string;
      name: string;
      fields: any[];
      sort?: number;
    },
    callback: (res: any) => void
  ) {
    const putData: any = {
      id: params.id || '',
      modelType: params.modelType || '',
      providerCode: params.providerCode || '',
      name: params.name || '',
      fields: JSON.stringify(params.fields || []),
      sort: params.sort || 0
    }

    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/provider`)
      .method('PUT')
      .data(putData)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('更新模型供应器失败', err)
        RequestService.reAjaxFun(() => {
          this.updateModelProvider(params, callback)
        })
      })
      .send()
  },

  // 删除模型供应器
  deleteModelProviderByIds(ids: string[], callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/provider/delete`)
      .method('POST')
      .data(ids)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('删除模型供应器失败', err)
        RequestService.reAjaxFun(() => {
          this.deleteModelProviderByIds(ids, callback)
        })
      })
      .send()
  },

  // 获取插件列表
  getPluginFunctionList(params: any, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/models/provider/plugin/names`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取插件列表失败', err)
        RequestService.reAjaxFun(() => {
          this.getPluginFunctionList(params, callback)
        })
      })
      .send()
  }
}
