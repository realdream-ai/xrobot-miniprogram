/**
 * @file mine account manage page
 */

import React, { useState } from 'react'
import cls from 'classnames'

import { View, Text, switchTab } from 'remax/one'
import { usePageEvent } from 'remax/macro'

import Scaffold from '@/components/Scaffold'
import AppBar from '@/components/AppBar'
import BackLeading from '@/components/AppBar/BackLeading'

import Cell from '@/ui/Cell'
import Popup from '@/ui/Popup'

import { nameMap, routeMap, Pages } from '@/constants/route'

import { greySix } from '@/utils/styles/color'
import { useToast } from '@/utils/toast'
import { useSystemInfo } from '@/utils/hooks/system-info'

import store from '@/stores'
import styles from './index.less'

export default function MineAccManage() {
  const { statusBarHeight, appBarHeight, bottomSafeAreaHeight } = useSystemInfo()

  return (
    <Scaffold appBar={<AppBar title={nameMap.xrobot_acc_manage} leading={<BackLeading />} />}>
      <View className={styles.wrapper} style={{ height: `calc(100vh - ${appBarHeight + statusBarHeight + bottomSafeAreaHeight}px)` }}>
        <View className={styles.info}>
          <View className={styles.title}>基本信息</View>
          <Cells />
        </View>
        <SignoutBtn />
      </View>
    </Scaffold>
  )
}

function Cells() {
  const showToast = useToast()
  const labelStyle = {
    marginRight: '40rpx',
    color: greySix,
    fontSize: '26rpx',
    fontWeight: 400,
    lineHeight: '44rpx'
  }

  usePageEvent('onShow', () => {
    if (store.getCookie() === '') {
      showToast({ tip: '您已退出登录', icon: 'warning' })
      switchTab({ url: routeMap[Pages.XrobotManageAgent] })
    }
  })

  return (
    <View className={styles.cells}>
      <Cell label={<Text style={labelStyle}>绑定手机</Text>} arrow>
        <View className={styles.cellRight}>
          <View>None</View>
        </View>
      </Cell>
    </View>
  )
}

function SignoutBtn() {
  const showToast = useToast()
  const [popupShow, setPopupShow] = useState(false)
  return (
    <>
      <View
        className={styles.signoutBtn}
        onTap={() => setPopupShow(true)}
      >
        退出登录
      </View>
      <Popup
        className={styles.popupBody}
        open={popupShow}
        position="bottom"
      >
        <View
          className={cls(styles.popupBtn, styles.confirm)}
          onTap={handleSignout}
        >
          确定退出
        </View>
        <View
          className={styles.popupBtn}
          onTap={() => setPopupShow(false)}
        >
          取消
        </View>
      </Popup>
    </>
  )

  async function handleSignout() {
    showToast({
      icon: 'loading',
      tip: '登出中...',
      duration: -1,
      coverTopNav: true
    })
    store.clearAuth()
    setPopupShow(false)
    showToast(undefined)
    switchTab({ url: routeMap[Pages.XrobotManageAgent] })
  }
}
