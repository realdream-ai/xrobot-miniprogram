import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react'
import { View, Text } from 'remax/one'
import cns from 'classnames'

import { bindTextInput } from '@/utils/form'
import Input from '@/ui/Input'
import Checkbox from '@/ui/Checkbox'
import FieldErrorTip from '@/components/FieldErrorTip'

import { useBluetoothConfigContext } from '../context'

import styles from './index.less'

export default observer(function InputPwd() {
  const { currentStep, setCurrentStep, selectedWifi, passwordState } = useBluetoothConfigContext()
  const isActive = currentStep === 'input-pwd'

  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = useCallback(async () => {
    const res = await passwordState.validate()
    if (res.hasError) return
    setCurrentStep('submit-config')
  }, [passwordState, setCurrentStep])

  return (
    <View className={styles.container} style={{ display: isActive ? 'block' : 'none' }}>
      <View className={styles.stepTitle}>当前步骤：输入 WiFi 密码</View>
      <View className={styles.form}>
        <View className={styles.item}>
          <View className={styles.label}>WiFi 名称：{selectedWifi?.SSID}</View>
        </View>
        <View className={styles.item}>
          <View className={cns(styles.label, styles.required)}>WiFi 密码</View>
          <Input
            className={cns(styles.input, passwordState.error && styles.error)}
            placeholder="请输入 WiFi 密码"
            password={!showPwd}
            {...bindTextInput(passwordState)}
          />
          <FieldErrorTip for={passwordState} />
          <View style={{ marginTop: '16rpx' }}>
            <Checkbox checked={showPwd} onChange={setShowPwd}>
              <Text style={{ color: '#333' }}>显示密码</Text>
            </Checkbox>
          </View>
        </View>
      </View>
      <View className={styles.tips}>
        <View className={styles.tip}>请确保密码正确</View>
        <View className={styles.tip}>配网过程中请保持设备通电状态</View>
      </View>
      <View className={styles.actionBtn} onTap={handleSubmit}>开始配网</View>
    </View>
  )
})
