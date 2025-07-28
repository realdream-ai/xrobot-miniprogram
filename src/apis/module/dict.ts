import { getServiceUrl } from '../api'
import RequestService from '../httpRequest'

export default {
  // 获取字典类型列表
  getDictTypeList(
    params: {
      dictType?: string;
      dictName?: string;
      page?: number;
      limit?: number;
    },
    callback: (res: any) => void
  ) {
    const queryParams = new URLSearchParams({
      dictType: params.dictType || '',
      dictName: params.dictName || '',
      page: params.page?.toString() || '1',
      limit: params.limit?.toString() || '10'
    }).toString()

    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/dict/type/page?${queryParams}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取字典类型列表失败:', err)
        RequestService.reAjaxFun(() => {
          this.getDictTypeList(params, callback)
        })
      })
      .send()
  },

  // 获取字典类型详情
  getDictTypeDetail(id: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/dict/type/${id}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取字典类型详情失败:', err)
        RequestService.reAjaxFun(() => {
          this.getDictTypeDetail(id, callback)
        })
      })
      .send()
  },

  // 新增字典类型
  addDictType(data: any, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/dict/type/save`)
      .method('POST')
      .data(data)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('新增字典类型失败:', err)
        RequestService.reAjaxFun(() => {
          this.addDictType(data, callback)
        })
      })
      .send()
  },

  // 更新字典类型
  updateDictType(data: any, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/dict/type/update`)
      .method('PUT')
      .data(data)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('更新字典类型失败:', err)
        RequestService.reAjaxFun(() => {
          this.updateDictType(data, callback)
        })
      })
      .send()
  },

  // 删除字典类型
  deleteDictType(ids: string[], callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/dict/type/delete`)
      .method('POST')
      .data(ids)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('删除字典类型失败:', err)
        RequestService.reAjaxFun(() => {
          this.deleteDictType(ids, callback)
        })
      })
      .send()
  },

  // 获取字典数据列表
  getDictDataList(
    params: {
      dictTypeId: string;
      dictLabel?: string;
      dictValue?: string;
      page?: number;
      limit?: number;
    },
    callback: (res: any) => void
  ) {
    const queryParams = new URLSearchParams({
      dictTypeId: params.dictTypeId,
      dictLabel: params.dictLabel || '',
      dictValue: params.dictValue || '',
      page: params.page?.toString() || '1',
      limit: params.limit?.toString() || '10'
    }).toString()

    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/dict/data/page?${queryParams}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取字典数据列表失败:', err)
        RequestService.reAjaxFun(() => {
          this.getDictDataList(params, callback)
        })
      })
      .send()
  },

  // 获取字典数据详情
  getDictDataDetail(id: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/dict/data/${id}`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取字典数据详情失败:', err)
        RequestService.reAjaxFun(() => {
          this.getDictDataDetail(id, callback)
        })
      })
      .send()
  },

  // 新增字典数据
  addDictData(data: any, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/dict/data/save`)
      .method('POST')
      .data(data)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('新增字典数据失败:', err)
        RequestService.reAjaxFun(() => {
          this.addDictData(data, callback)
        })
      })
      .send()
  },

  // 更新字典数据
  updateDictData(data: any, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/dict/data/update`)
      .method('PUT')
      .data(data)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('更新字典数据失败:', err)
        RequestService.reAjaxFun(() => {
          this.updateDictData(data, callback)
        })
      })
      .send()
  },

  // 删除字典数据
  deleteDictData(ids: string[], callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/dict/data/delete`)
      .method('POST')
      .data(ids)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('删除字典数据失败:', err)
        RequestService.reAjaxFun(() => {
          this.deleteDictData(ids, callback)
        })
      })
      .send()
  },

  // 获取字典数据列表（按类型）
  getDictDataByType(dictType: string): Promise<any> {
    return new Promise((resolve, reject) => {
      RequestService.sendRequest()
        .url(`${getServiceUrl()}/admin/dict/data/type/${dictType}`)
        .method('GET')
        .success((res: any) => {
          RequestService.clearRequestTime()
          if (res && res.code === 0) {
            resolve(res)
          } else {
            reject(new Error(res?.msg || '获取字典数据列表失败'))
          }
        })
        .networkFail((err: Error) => {
          console.error('获取字典数据列表失败:', err)
          reject(err)
        })
        .send()
    })
  }
}
