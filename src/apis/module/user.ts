import {
  ApiResponse,
  LoginForm,
  RegisterForm
} from '@/pages/common/types'
import { getServiceUrl } from '../api'
import RequestService from '../httpRequest'

export default {
  // 登录
  login(
    loginForm: LoginForm,
    callback: (res: ApiResponse<{ token: string }>) => void,
    failCallback: (err: Error) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/user/login`)
      .method('POST')
      .data(loginForm)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .fail((err: Error) => {
        RequestService.clearRequestTime()
        failCallback(err)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.login(loginForm, callback, failCallback)
        })
      })
      .send()
  },

  // 获取验证码
  getCaptcha(uuid: string, callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/user/captcha?uuid=${uuid}`)
      .method('GET')
      .type('blob')
      .header({
        'Content-Type': 'image/gif',
        Pragma: 'No-cache',
        'Cache-Control': 'no-cache'
      })
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取验证码失败:', err)
        RequestService.reAjaxFun(() => {
          this.getCaptcha(uuid, callback)
        })
      })
      .send()
  },

  // 发送短信验证码
  sendSmsVerification(
    data: { mobile: string },
    callback: (res: any) => void,
    failCallback: (err: Error) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/user/smsVerification`)
      .method('POST')
      .data(data)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .fail((err: Error) => {
        RequestService.clearRequestTime()
        failCallback(err)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.sendSmsVerification(data, callback, failCallback)
        })
      })
      .send()
  },

  // 注册账号
  register(
    registerForm: RegisterForm,
    callback: (res: any) => void,
    failCallback: (err: Error) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/user/register`)
      .method('POST')
      .data(registerForm)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .fail((err: Error) => {
        RequestService.clearRequestTime()
        failCallback(err)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.register(registerForm, callback, failCallback)
        })
      })
      .send()
  },

  // 保存设备配置
  saveDeviceConfig(
    deviceId: string,
    configData: any,
    callback: (res: any) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/user/configDevice/${deviceId}`)
      .method('PUT')
      .data(configData)
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('保存配置失败:', err)
        RequestService.reAjaxFun(() => {
          this.saveDeviceConfig(deviceId, configData, callback)
        })
      })
      .send()
  },

  // 用户信息获取
  getUserInfo(callback: (res: any) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/user/info`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('接口请求失败:', err)
        RequestService.reAjaxFun(() => {
          this.getUserInfo(callback)
        })
      })
      .send()
  },

  // 修改用户密码
  changePassword(
    oldPassword: string,
    newPassword: string,
    successCallback: (res: any) => void,
    errorCallback: (err: Error) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/user/change-password`)
      .method('PUT')
      .data({
        password: oldPassword,
        newPassword
      })
      .success((res: any) => {
        RequestService.clearRequestTime()
        successCallback(res)
      })
      .networkFail((err: Error) => {
        console.error('修改密码失败:', err)
        RequestService.reAjaxFun(() => {
          this.changePassword(
            oldPassword,
            newPassword,
            successCallback,
            errorCallback
          )
        })
      })
      .send()
  },

  // 修改用户状态
  changeUserStatus(
    status: string,
    userIds: string[],
    successCallback: (res: any) => void
  ) {
    console.log('changeUserStatus:', userIds)
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/admin/users/changeStatus/${status}`)
      .method('PUT')
      .data(userIds)
      .success((res: any) => {
        RequestService.clearRequestTime()
        successCallback(res)
      })
      .networkFail((err: Error) => {
        console.error('修改用户状态失败:', err)
        RequestService.reAjaxFun(() => {
          this.changeUserStatus(status, userIds, successCallback)
        })
      })
      .send()
  },

  // 获取公共配置
  getPubConfig(callback: (res: ApiResponse<any>) => void) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/user/pub-config`)
      .method('GET')
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .networkFail((err: Error) => {
        console.error('获取公共配置失败:', err)
        RequestService.reAjaxFun(() => {
          this.getPubConfig(callback)
        })
      })
      .send()
  },

  // 找回用户密码
  retrievePassword(
    passwordData: { phone: string; code: string; password: string },
    callback: (res: any) => void,
    failCallback: (err: Error) => void
  ) {
    RequestService.sendRequest()
      .url(`${getServiceUrl()}/user/retrieve-password`)
      .method('PUT')
      .data({
        phone: passwordData.phone,
        code: passwordData.code,
        password: passwordData.password
      })
      .success((res: any) => {
        RequestService.clearRequestTime()
        callback(res)
      })
      .fail((err: Error) => {
        RequestService.clearRequestTime()
        failCallback(err)
      })
      .networkFail(() => {
        RequestService.reAjaxFun(() => {
          this.retrievePassword(passwordData, callback, failCallback)
        })
      })
      .send()
  }
}
