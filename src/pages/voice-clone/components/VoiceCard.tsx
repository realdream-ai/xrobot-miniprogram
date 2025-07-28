import React from 'react'
import cls from 'classnames'
import { View, Text, Button } from 'remax/one'
import './VoiceCard.less'

interface Voice {
  id: string
  name: string
  state: 'Init' | 'Success' | 'Training' | 'Failed'
  language: string
  demo_url?: string
}

interface VoiceCardProps {
  voice: Voice
  onEdit?: (voice: Voice) => void
  onPlay?: (voice: Voice) => void
  onClone?: (voice: Voice) => void
  onDelete?: (voice: Voice) => void
  playing?: boolean
}

const statusMap = {
  Init: { label: '未上传数据', className: 'pending' },
  Success: { label: '复刻成功', className: 'success' },
  Training: { label: '训练中', className: 'training' },
  Failed: { label: '训练失败', className: 'failed' }
}

const VoiceCard: React.FC<VoiceCardProps> = ({ voice, onEdit, onPlay, onClone, onDelete, playing }) => {
  const status = statusMap[voice.state] || statusMap.Init
  return (
    <View className="voice-card-agent">
      <View className="voice-card-agent__header">
        <View className="voice-card-agent__title">{voice.name}</View>
        <View className={cls('voice-card-agent__status', status.className)}>{status.label}</View>
        {/* <Text className="edit-icon" onTap={() => onEdit && onEdit(voice)}>✏️</Text> */}
      </View>
      <View className="voice-card-agent__content">
        <View className="voice-card-agent__infoItem">语言：{voice.language || 'N/A'}</View>
        <View className="voice-card-agent__infoItem">
          试听：{voice.demo_url && voice.state === 'Success' ? (
            <Text
              className={cls('info-value', 'clickable-audio', { playing })}
              onTap={() => onPlay && onPlay(voice)}
            >
              {playing ? '⏸ 暂停试听' : '▶️ 点击试听'}
            </Text>
          ) : (
            <Text className="info-value disabled">暂无试听</Text>
          )}
        </View>
      </View>
      <View className="voice-card-agent__actions">
        <View className="voice-card-agent__actionRow">
          <Button className="actionButton cloneButton" type="submit" onTap={() => onClone && onClone(voice)} disabled={voice.state === 'Training'}>
            复刻
          </Button>
          <Button className="actionButton" onTap={() => onEdit && onEdit(voice)}>
            重命名
          </Button>
          <Button className={cls('actionButton', 'deleteButton')} type="reset" onTap={() => onDelete && onDelete(voice)}>
            删除
          </Button>
        </View>
      </View>
    </View>
  )
}

export default VoiceCard
