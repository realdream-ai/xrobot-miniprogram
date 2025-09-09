/**
 * @file route 相关
 */

export const titlePrefix = 'Xrobot'

export enum Pages {
  // 主包
  XrobotManageAgent = 'xrobot_manage_agent',
  XrobotAccountLogin = 'xrobot_account_login',
  XrobotNetConfigWelcome = 'xrobot_net_config_welcome',
  XrobotNetConfigGuide = 'xrobot_net_config_guide',
  XrobotNetConfigWifi = 'xrobot_net_config_wifi',
  XrobotNetConfigBluetooth = 'xrobot_net_config_bluetooth',
  XrobotRoleConfig = 'xrobot_role_config',
  XrobotDeviceManage = 'xrobot_device_manage',
  XrobotVoiceClone = 'xrobot_voice_clone',
  XrobotVoiceCloneTrain = 'xrobot_voice_clone_train',
  XrobotSquare = 'xrobot_square',
  XrobotSquareTemplateDetail = 'xrobot_square_template_detail',
  XrobotAccManage = 'xrobot_acc_manage',
  XrobotDoc = 'xrobot_doc',
}

export const nameMap = {
  // 主包
  [Pages.XrobotManageAgent]: '我的智能体',
  [Pages.XrobotAccountLogin]: '登录',
  [Pages.XrobotNetConfigWelcome]: '智能配网助手',
  [Pages.XrobotNetConfigGuide]: '配网帮助',
  [Pages.XrobotNetConfigWifi]: 'WiFi 配网',
  [Pages.XrobotNetConfigBluetooth]: '蓝牙配网',
  [Pages.XrobotRoleConfig]: '角色配置',
  [Pages.XrobotDeviceManage]: '设备管理',
  [Pages.XrobotVoiceClone]: '音色复刻',
  [Pages.XrobotVoiceCloneTrain]: '音色复刻训练',
  [Pages.XrobotSquare]: '广场',
  [Pages.XrobotSquareTemplateDetail]: '模板详情',
  [Pages.XrobotAccManage]: '个人中心',
  [Pages.XrobotDoc]: '操作指南'
}

export const mainPackageUrlMap = {
  [Pages.XrobotManageAgent]: 'pages/agent/manage-agent/index',
  [Pages.XrobotAccountLogin]: 'pages/account/minimal-login/index',
  [Pages.XrobotNetConfigWelcome]: 'pages/agent/net-config/welcome/index',
  [Pages.XrobotNetConfigGuide]: 'pages/agent/net-config/guide/index',
  [Pages.XrobotNetConfigWifi]: 'pages/agent/net-config/wifi-config/index',
  [Pages.XrobotNetConfigBluetooth]: 'pages/agent/net-config/bluetooth-config/index',
  [Pages.XrobotRoleConfig]: 'pages/agent/role-config/index',
  [Pages.XrobotDeviceManage]: 'pages/agent/device-manage/index',
  [Pages.XrobotVoiceClone]: 'pages/voice-clone/index',
  [Pages.XrobotVoiceCloneTrain]: 'pages/voice-clone/pages/train/index',
  [Pages.XrobotSquare]: 'pages/square/index',
  [Pages.XrobotSquareTemplateDetail]: 'pages/square/pages/template-detail/index',
  [Pages.XrobotAccManage]: 'pages/account/manage/index',
  [Pages.XrobotDoc]: 'pages/doc/index'
}

export const mainPackageRoutes = Object.values(mainPackageUrlMap)

// 之所以不用 xxxUrlMap，是因为小程序配置不允许 pages 是从斜杠开头的, 但是路由可以
export const routeMap = {
  // 主包
  [Pages.XrobotManageAgent]: '/pages/agent/manage-agent/index',
  [Pages.XrobotAccountLogin]: '/pages/account/minimal-login/index',
  [Pages.XrobotNetConfigWelcome]: '/pages/agent/net-config/welcome/index',
  [Pages.XrobotNetConfigGuide]: '/pages/agent/net-config/guide/index',
  [Pages.XrobotNetConfigWifi]: '/pages/agent/net-config/wifi-config/index',
  [Pages.XrobotNetConfigBluetooth]: '/pages/agent/net-config/bluetooth-config/index',
  [Pages.XrobotRoleConfig]: '/pages/agent/role-config/index',
  [Pages.XrobotDeviceManage]: '/pages/agent/device-manage/index',
  [Pages.XrobotVoiceClone]: '/pages/voice-clone/index',
  [Pages.XrobotVoiceCloneTrain]: '/pages/voice-clone/pages/train/index',
  [Pages.XrobotSquare]: '/pages/square/index',
  [Pages.XrobotSquareTemplateDetail]: '/pages/square/pages/template-detail/index',
  [Pages.XrobotAccManage]: '/pages/account/manage/index',
  [Pages.XrobotDoc]: '/pages/doc/index'
}
