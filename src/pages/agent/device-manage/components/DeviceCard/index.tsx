
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { View, Button } from 'remax/wechat'
import { Device } from '../../types'
import './index.less'

interface DeviceCardProps {
  device: Device;
  onSelect: (deviceId: string) => void;
  onDetail: (deviceId: string) => void;
  onUnbind: (deviceId: string) => void;
  getFirmwareTypeName: (model: string) => string;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onSelect,
  onDetail,
  onUnbind,
  getFirmwareTypeName
// eslint-disable-next-line arrow-body-style
}) => {
  return (
    <View
      className={`device-card ${device.selected ? 'selected' : ''}`}
      onClick={() => onSelect(device.device_id)}
    >
      <View className="device-info">
        <View>设备型号: {getFirmwareTypeName(device.model)}</View>

        <View>MAC地址: {device.macAddress}</View>
      </View>
      <View className="device-actions">
        <View className="action-buttons">
          <Button
            size="mini"
            className="action-button detail"
            onClick={_e => {
              onDetail(device.device_id)
            }}
          >
            详情
          </Button>
          <Button
            size="mini"
            className="action-button unbind"
            onClick={_e => {
              onUnbind(device.device_id)
            }}
          >
            解绑
          </Button>
        </View>
        <View className="checkbox">{device.selected ? '✓' : ''}</View>
      </View>
    </View>
  )
}

export default DeviceCard
