/**
 * @file config content
 */

import {
  AppConfig as WechatAppConfig,
  PageConfig as WechatPageConfig
} from 'remax/wechat'

import {
  Pages,
  mainPackageRoutes,
  mainPackageUrlMap,
  titlePrefix
} from '../constants/route'
import { iconMap as tabBarIconMap } from '../constants/tab-bar'

import { white, black, primaryColor } from './styles/color'

export function getWechatAppConfig(title?: string): WechatAppConfig {
  const appConfig: WechatAppConfig = {
    // 不支持深色
    darkmode: false,
    pages: [...mainPackageRoutes],
    window: {
      navigationBarTitleText: title || titlePrefix,
      navigationBarBackgroundColor: white,
      navigationBarTextStyle: 'black',
      navigationStyle: 'custom'
    },
    tabBar: {
      color: black,
      selectedColor: primaryColor,
      backgroundColor: white,
      borderStyle: 'white',
      list: [{
        pagePath: mainPackageUrlMap[Pages.XrobotManageAgent],
        text: '智能体',
        iconPath: tabBarIconMap[Pages.XrobotManageAgent].default,
        selectedIconPath: tabBarIconMap[Pages.XrobotManageAgent].active
      }, {
        pagePath: mainPackageUrlMap[Pages.XrobotVoiceClone],
        text: '音色复刻',
        iconPath: tabBarIconMap[Pages.XrobotVoiceClone].default,
        selectedIconPath: tabBarIconMap[Pages.XrobotVoiceClone].active
      },
      {
        pagePath: mainPackageUrlMap[Pages.XrobotSquare],
        text: '广场',
        iconPath: tabBarIconMap[Pages.XrobotSquare].default,
        selectedIconPath: tabBarIconMap[Pages.XrobotSquare].active
      },
      {
        pagePath: mainPackageUrlMap[Pages.XrobotAccManage],
        text: '个人中心',
        iconPath: tabBarIconMap[Pages.XrobotAccManage].default,
        selectedIconPath: tabBarIconMap[Pages.XrobotAccManage].active
      }
      ]
    },
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于获取附近的 WiFi 列表'
      }
    }
  }

  return appConfig
}

export function getWechatPageConfig(config?: Omit<WechatPageConfig, 'navigationBarTitleText'>): WechatPageConfig {
  return { ...config }
}

export function isTabBarPage(url: string) {
  const route = url.split('?')[0]
  const { tabBar } = getWechatAppConfig()
  return !!(tabBar?.list.some(item => item.pagePath === route))
}
