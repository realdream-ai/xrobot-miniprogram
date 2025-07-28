
import React, { useEffect, useState } from 'react'
import { View, Text, Input, Button } from 'remax/wechat'
import { navigateTo } from 'remax/one'
import { Pages, routeMap } from '@/constants/route'
import './index.less'
import store from '@/stores'

interface AddDeviceDialogProps {
  agentId: string;
  onClose: () => void;
  onConfirm: (deviceCode: string) => void;
}

const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({
  agentId,
  onClose,
  onConfirm
}) => {
  const [deviceCode, setDeviceCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    store.setCurrentDeviceNetConigAgentId(agentId)
  }, [agentId])

  const handleConfirm = () => {
    if (loading) return
    if (!/^\d{6}$/.test(deviceCode)) {
      // eslint-disable-next-line no-console
      console.error('请输入6位数字验证码')
      return
    }
    store.setCurrentDeviceNetConigAgentId('')
    setLoading(true)
    onConfirm(deviceCode)
    setDeviceCode('')
    setLoading(false)
  }

  const handleCancel = () => {
    store.setCurrentDeviceNetConigAgentId('')
    setDeviceCode('')
    onClose()
  }

  // 判断按钮是否可用
  const isConfirmEnabled = deviceCode.trim().length > 0

  return (
    <View className="add-device-dialog">
      <View className="dialog-container">
        <View className="dialog-header">
          <Text className="title">添加设备</Text>
        </View>
        <View className="dialog-divider" />
        <View className="dialog-content">
          <View className="input-item">
            <Text className="label">
              <Text className="required">*</Text> 6位数验证码
            </Text>
            <Input
              className="input"
              placeholder="请输入设备播报的6位数验证码"
              value={deviceCode}
              onInput={e => setDeviceCode(e.detail.value)}
              type="number"
              maxlength={6}
              confirmType="done"
              onConfirm={handleConfirm}
              disabled={loading}
            />
          </View>
        </View>
        <View>没有验证码？前去配网 ⬇️</View>
        <View className="dialog-footer">
          <Button
            className="dialog-button cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            className="dialog-button confirm active"
            onClick={() => {
              navigateTo({ url: routeMap[Pages.XrobotNetConfigWelcome] })
            }}
          >
            配网
          </Button>
          <Button
            className={`dialog-button confirm${/^\d{6}$/.test(deviceCode) ? ' active' : ''}`}
            onClick={handleConfirm}
            disabled={!isConfirmEnabled || loading}
          >
            确定
          </Button>
        </View>
      </View>
    </View>
  )
}

export default AddDeviceDialog
