import { apiHost } from '@/constants/env'
import { fetch } from '@/utils/fetchs'

import { showToast } from 'remax/wechat'
import store from '@/stores'
import { toLoginPageUrl } from '@/components/LoginRequired/util'
import { navigateTo } from 'remax/one'

// import { toLoginPageUrl } from '@/components/LoginRequired/util'

export default {
  getQInfo(cookie: string, token?: string): Promise<any> {
    return fetch(
      `${apiHost}/api/proxy/portal-v4/api/xrobot-proxy/manager/xiaozhi/user/q-info`,
      {
        header: {
          Cookie: cookie,
          'X-Robot-Auth-Token': 'Bearer ' + (token ?? '')
        }
      }
    )
  },

  // OPTIONS方法请求q-info接口，解决跨域问题
  //  fetchQInfoPre() {
  //   return fetch(
  //     `${apiHost}/api/proxy/portal-v4/api/xrobot-proxy/manager/xiaozhi/user/q-info`,
  //     {
  //       method: 'OPTIONS',
  //       header: {
  //         'access-control-request-headers': 'x-robot-auth-token',
  //         'access-control-request-method': 'GET',
  //       },
  //     }
  //   );
  // },

  /// 使用 userIDStore 中的cookie 请求q-info接口获取token并存入store
  ///
  /// 若不给出callback函数，则默认将在401时跳转登录页面
  ///
  /// 给出callback时，会先保存token到store再执行回调
  fetchQInfo(callback?: (res: {code: number, data: {token: string}, msg: string}) => void,
    finallyCallback?: () => void) {
    const cookie = store.getCookie()
    console.log('try fetch q info')
    this.getQInfo(cookie)
      .then(res => {
        // console.log('fetch qinfo res:', res)
        if (callback) {
          store.setToken(res.data.token)
          callback(res)
        } else if (res.code === 0) {
          store.setToken(res.data.token)
        } else if (res.code === 401) {
          // todo 管理账号登录过期问题
          showToast({ title: '请登录' })
          store.clearAuth()
          navigateTo({ url: toLoginPageUrl() })

        }
      })
      .catch(e => {
        console.error('fetchQInfo fail:', e)
      })
      .finally(() => {
        if (finallyCallback) {
          finallyCallback()
        }
      })
  }
}
