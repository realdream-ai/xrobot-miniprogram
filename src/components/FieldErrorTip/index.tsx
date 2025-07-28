/**
 * @file FieldErrorTip 组件
 * @description 用于控制表单 input 框下面 error tip 的显示/隐藏
 */

import React from 'react'
import cls from 'classnames'
import { FieldState } from 'formstate-x'
import { observer } from 'mobx-react'

import { View } from 'remax/one'

import styles from './style.less'

export type Props = {
  for: FieldState<any>
}

export default observer(function FieldErrorTip({ for: field }: Props) {
  return (
    <View
      className={cls(
        styles.tip,
        field.error && styles.show
      )}
    >
      {field.error}
    </View>
  )
})
