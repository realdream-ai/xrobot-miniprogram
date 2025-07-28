
/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react'
import { View, Text, Input, Button, Switch } from 'remax/wechat'
import api from '@/apis/api'
import { Device } from '../../types'
import './index.less'

interface DeviceDetailProps {
  device: Device;
  onClose: () => void;
  onUpdate: (updatedDevice: Device) => void;
  onUnbind: () => void;
  getFirmwareTypeName: (model: string) => string;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({
  device,
  onClose,
  onUpdate,
  onUnbind,
  getFirmwareTypeName
}) => {
  const [isEditingRemark, setIsEditingRemark] = useState(false)
  const [remark, setRemark] = useState(device.remark || '')
  const [otaSwitch, setOtaSwitch] = useState(device.otaSwitch || false)

  const handleRemarkEdit = () => {
    setIsEditingRemark(true)
  }

  const handleRemarkSave = () => {
    if (device._submitting) return
    const text = remark.trim()
    if (text.length > 64) {
      console.error('备注不能超过 64 字符')
      return
    }
    if (text === device.remark) {
      setIsEditingRemark(false)
      return
    }

    const updatedDevice = { ...device, _submitting: true }
    onUpdate(updatedDevice)

    api.device.updateDeviceInfo(
      device.device_id,
      { alias: text },
      (res: { code: number; msg: string }) => {
        if (res.code === 0) {
          onUpdate({ ...device, remark: text, _submitting: false })
          console.log('备注保存成功')
        } else {
          onUpdate({ ...device, _submitting: false })
          console.error('备注保存失败:', res.msg || '未知错误')
        }
        setIsEditingRemark(false)
      }
    )
  }

  const handleRemarkCancel = () => {
    setRemark(device.remark || '')
    setIsEditingRemark(false)
  }

  const handleOtaSwitchChange = (e: any) => {
    if (device._submitting) return
    const newOtaSwitch = e.detail.value
    const updatedDevice = { ...device, _submitting: true }
    onUpdate(updatedDevice)

    api.device.updateDeviceInfo(
      device.device_id,
      { autoUpdate: newOtaSwitch },
      (res: { code: number; msg: string }) => {
        if (res.code === 0) {
          onUpdate({ ...device, otaSwitch: newOtaSwitch, _submitting: false })
          console.log(newOtaSwitch ? '已设置成自动升级' : '已关闭自动升级')
        } else {
          onUpdate({ ...device, _submitting: false })
          console.error('OTA 设置失败:', res.msg || '未知错误')
        }
      }
    )
    setOtaSwitch(newOtaSwitch)
  }

  return (
    <View className="device-detail">
      <View className="detail-header">
        <Text className="title">设备详情</Text>
      </View>
      <View className="detail-content">
        <View className="detail-item">
          <Text className="label">设备型号:</Text>
          <Text className="value">{getFirmwareTypeName(device.model)}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">MAC地址:</Text>
          <Text className="value">{device.macAddress || '—'}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">固件版本:</Text>
          <Text className="value">{device.firmwareVersion || '—'}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">绑定时间:</Text>
          <Text className="value">{device.bindTime || '—'}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">最近对话:</Text>
          <Text className="value">{device.lastConversation || '—'}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">备注:</Text>
          {isEditingRemark ? (
            <View className="remark-edit">
              <Input
                className="remark-input"
                value={remark}
                onInput={e => setRemark(e.detail.value)}
                maxlength={64}
                confirmType="done"
                onConfirm={handleRemarkSave}
              />
              <Button className="remark-button" onClick={handleRemarkSave}>
                保存
              </Button>
              <Button
                className="remark-button cancel"
                onClick={handleRemarkCancel}
              >
                取消
              </Button>
            </View>
          ) : (
            <View className="remark-view">
              <Text className="value">{device.remark || '—'}</Text>
              <Text className="edit-icon" onClick={handleRemarkEdit}>
                ✎
              </Text>
            </View>
          )}
        </View>
        <View className="detail-item">
          <Text className="label">OTA自动升级:</Text>
          <Switch
            checked={otaSwitch}
            onChange={handleOtaSwitchChange}
            color="#5f70f3"
          />
        </View>
      </View>
      <View className="detail-footer">
        <Button className="footer-button unbind" onClick={onUnbind}>
          解绑
        </Button>
        <Button className="footer-button" onClick={onClose}>
          关闭
        </Button>
      </View>
    </View>
  )
}

export default DeviceDetail
