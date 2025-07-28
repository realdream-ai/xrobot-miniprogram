import React, { CSSProperties } from 'react'
import { View, switchTab, navigateBack } from 'remax/one'

import Icon from '@/ui/Icon'
import { IconType } from '@/constants/icons'
import { useSystemInfo } from '@/utils/hooks/system-info'
import { greySeven } from '@/utils/styles/color'
import { Pages, routeMap } from '@/constants/route'

export default function CloseLeading({ beforeClose }: { beforeClose?: () => void }) {
  const handleClickClose = async () => {
    if (beforeClose) {
      beforeClose()
    }

    try {
      await navigateBack()
    } catch (e) {
      switchTab({ url: routeMap[Pages.XrobotManageAgent] })
    }
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
      <Icon type={IconType.Close} size="48rpx" color={greySeven} />
    </View>
  )
}
