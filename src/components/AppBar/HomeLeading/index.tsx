import React, { CSSProperties } from 'react'
import { View, switchTab } from 'remax/one'

import Icon from '@/ui/Icon'
import { IconType } from '@/constants/icons'
import { useSystemInfo } from '@/utils/hooks/system-info'
import { greySeven } from '@/utils/styles/color'
import { Pages, routeMap } from '@/constants/route'

export default function HomeLeading() {
  const handleClickClose = async () => {
    switchTab({ url: routeMap[Pages.XrobotManageAgent] })
  }

  const { appBarHeight } = useSystemInfo()
  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: `${appBarHeight}px`
  }

  return (
    <View onTap={handleClickClose} style={style}>
      <Icon type={IconType.Home} size="48rpx" color={greySeven} />
    </View>
  )
}
