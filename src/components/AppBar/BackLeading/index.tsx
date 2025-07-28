/**
 * @author: corol
 * @github: github.com/huangbinjie
 * @created: Thu Sep 03 2020
 * @file: 返回用 leading
 *
 * Copyright (c) 2020 Qiniu
 */

import React, { CSSProperties, useCallback } from 'react'
import { View, navigateBack, switchTab } from 'remax/one'

import { Pages, routeMap } from '@/constants/route'
import { IconType } from '@/constants/icons'
import Icon from '@/ui/Icon'
import { useSystemInfo } from '@/utils/hooks/system-info'
import { greySeven } from '@/utils/styles/color'

export interface Props {
  onTap?: () => void
}

export default function BackLeading({ onTap }: Props) {
  const { appBarHeight } = useSystemInfo()
  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: `${appBarHeight}px`
  }

  const handleBack = useCallback(async () => {
    try {
      await navigateBack()
    } catch {
      switchTab({ url: routeMap[Pages.XrobotManageAgent] })
    }
  }, [])

  return (
    <View onTap={onTap ?? handleBack} style={style}>
      <Icon type={IconType.ArrowLeft} size="48rpx" color={greySeven} />
    </View>
  )
}
