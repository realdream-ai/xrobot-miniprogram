/**
 * @file tab-bar 相关
 */

import { Pages } from './route'

export const iconMap = {
  [Pages.XrobotManageAgent]: {
    default: '/images/home.png',
    active: '/images/home-active.png'
  },
  [Pages.XrobotVoiceClone]: {
    default: '/images/voice-clone.png',
    active: '/images/voice-clone-active.png'
  },
  [Pages.XrobotSquare]: {
    default: '/images/cloud.png',
    active: '/images/cloud-active.png'
  },
  [Pages.XrobotAccManage]: {
    default: '/images/mine.png',
    active: '/images/mine-active.png'
  }
}
