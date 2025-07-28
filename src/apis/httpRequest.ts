import { fetch, FetchOptions } from '@/utils/fetchs'
import store from '@/stores'
import { showToast as wxShowToast } from 'remax/wechat'
import api from '@/apis/api'
import { isNotNull } from './utils'

// 显示错误信息
function showToast(msg: string, duration?: number) {
  wxShowToast({
    title: msg,
    icon: 'none', // 该toast带有icon时最多显示 7 个汉字长度
    duration: duration ?? 3000
  })
}
type Response = { msg: string; data: any; code: string | number };
/**
 * Request服务封装
 */
export default {
  sendRequest,
  reAjaxFun,
  clearRequestTime
}

function sendRequest() {
  return {
    _sucCallback: null as ((res: Response) => void) | null,
    _failCallback: undefined as ((e: Error) => void) | undefined,
    _networkFailCallback: undefined as ((e: Error) => void) | undefined,
    _method: 'GET' as string,
    _data: {} as any,
    _header: {
      'content-type': 'application/json; charset=utf-8',
      Authorization: '',
      Cookie: '',
      'X-Robot-Auth-Token': ''
    } as Record<string, string>,
    _url: '' as string,
    _responseType: undefined as string | undefined,
    _showLoading: false as boolean,

    send() {
      const token = store.getToken()
      if (isNotNull(token)) {
        this._header.Authorization = 'Bearer ' + token
        // todo 考虑删除该字段
        this._header['X-Robot-Auth-Token'] = 'Bearer ' + token
      }

      const cookieStore = store.getCookie()
      if (isNotNull(cookieStore)) {
        this._header.Cookie = cookieStore
      }

      // 构造请求选项
      const options: FetchOptions = {
        data: this._data,
        method: this._method,
        header: this._header,
        responseType: this._responseType,
        dataType: 'json',
        timeout: 30000
      } as FetchOptions

      // 请求
      fetch(this._url, options)
        .then((res: Response) => {
          // console.log('fetch then res', res)
          const error = httpHandlerError(
            res,
            this._failCallback,
            this._networkFailCallback
          )
          if (error) {
            return
          }

          if (this._sucCallback) {
            this._sucCallback(res)
          }
        })
        .catch(res => {
          // 打印失败响应
          httpHandlerError(res, this._failCallback, this._networkFailCallback)
        })
      return this
    },
    success(callback: (res: Response) => void) {
      this._sucCallback = callback
      return this
    },
    fail(callback: (res: Error) => void) {
      this._failCallback = callback
      return this
    },
    networkFail(callback: (res: any) => void) {
      this._networkFailCallback = callback
      return this
    },
    url(url: string) {
      if (url) {
        url = url.replace(/\$/g, '/')
      }
      this._url = url
      return this
    },
    data(data: any) {
      this._data = data
      return this
    },
    method(method: string) {
      this._method = method
      return this
    },
    header(header: Record<string, string>) {
      this._header = header
      return this
    },
    showLoading(showLoading: boolean) {
      this._showLoading = showLoading
      return this
    },
    // async(flag: boolean) {
    //   this.async = flag;
    // },

    type(responseType: string) {
      this._responseType = responseType
      return this
    }
  }
}

/**
 * 处理 HTTP 错误
 * @param res HTTP 响应
 * @param failCallback 失败回调
 * @param networkFailCallback 网络失败回调
 * @returns 是否发生错误
 */
// 在错误处理函数中添加日志
// 似乎由于flyio与本项目fetchs返回的结果的结构不同（大概是flyio的res为一个字典，
// 其中有一字段data包含fetchs的res，且flyio的res还包含status等字断
//
// // 目前修改了对flyio的status的判断，导致目前不能判断是否发生网络问题
function httpHandlerError(
  res: Response,
  failCallback?: (e: Error) => void,
  networkFailCallback?: (e: Error) => void
): boolean {
  /** 请求成功，退出该函数 可以根据项目需求来判断是否请求成功。这里判断的是status为200的时候是成功 */
  // if (info.status === 200) {
  // 正常
  if (res.code === 'success' || res.code === 0 || res.code === undefined) {
    return false
  }

  // 未登录
  if (res.code === 401) {
    // TODO
    store.clearAuth()
    api.qApi.fetchQInfo()
    return true
  }
  if (failCallback) {
    const err = {
      name: res.code as string,
      message: res.msg
    }
    failCallback(err)
  } else {
    showToast(res.msg || '出现了错误')
  }
  return true
  // }

  if (networkFailCallback) {
    // networkFailCallback(res);
  } else {
    showToast(`网络请求出现了错误【${res}】`)
  }
  return true
}

let requestTime = 0
const reAjaxSec = 2

function reAjaxFun(fn: () => void) {
  const nowTimeSec = new Date().getTime() / 1000
  if (requestTime === 0) {
    requestTime = nowTimeSec
  }
  const ajaxIndex: number = parseInt(
    `${(nowTimeSec - requestTime) / reAjaxSec}`,
    10
  )
  if (ajaxIndex > 10) {
    showToast('似乎无法连接服务器', 3000)
  } else {
    showToast('正在连接服务器(' + ajaxIndex + ')', 1500)
  }
  if (ajaxIndex < 10 && fn) {
    setTimeout(() => {
      fn()
    }, reAjaxSec * 1000)
  }
}

function clearRequestTime() {
  requestTime = 0
}
