// 引入各个模块的请求
import { host } from '@/constants/env'

import admin from './module/admin'
import agent from './module/agent'
import device from './module/device'
import dict from './module/dict'
import model from './module/model'
import ota from './module/ota'
import qApi from './module/q-api'
import timbre from './module/timbre'
import user from './module/user'
import voice from './module/voice'

// NOTICE：部分api接口未验证

/**
 * 接口地址
 */
const DEV_API_SERVICE = '/xiaozhi'

/**
 * 服务端域名
 */
const SERVER_DOMAIN = host

/**
 * 返回接口url
 * @returns {string}
 */
export function getServiceUrl() {
  return SERVER_DOMAIN + DEV_API_SERVICE
}

/** request服务封装 */
export default {
  getServiceUrl,
  user,
  admin,
  agent,
  device,
  model,
  timbre,
  ota,
  dict,
  qApi,
  voice
}
