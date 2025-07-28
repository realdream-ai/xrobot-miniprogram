import React from 'react'
import cls from 'classnames'
import { View } from 'remax/one'
import Button from '@/ui/Button'
import type { AgentCardProps } from '../../types'
import styles from './style.less'

const AgentCard: React.FC<AgentCardProps> = ({
  agentName,
  deviceCount,
  llmModelName,
  ttsModelName,
  lastConnectedAt,
  onConfig,
  onManage,
  // onChat,
  onDelete
}) => (
  <View className={styles.agentCard}>
    <View className={styles.agentCard__header}>
      <View className={styles.agentCard__title}>{agentName}</View>
    </View>
    <View className={styles.agentCard__content}>
      <View className={styles.agentCard__info}>
        <View className={styles.agentCard__infoItem}>
          设备数量: {deviceCount}
        </View>
        <View className={styles.agentCard__infoItem}>
          对话模型: {llmModelName}
        </View>
        <View className={styles.agentCard__infoItem}>语音合成: {ttsModelName}</View>
        <View className={styles.agentCard__infoItem}>
          上次连接: {lastConnectedAt || '暂无'}
        </View>
      </View>
    </View>
    <View className={styles.agentCard__actions}>
      <View className={styles.agentCard__actionRow}>
        <Button mode="primary" className={styles.actionButton} onTap={onConfig}>
          配置角色
        </Button>
        <Button mode="primary" className={styles.actionButton} onTap={onManage}>
          设备管理
        </Button>
        {/* <Button mode="primary" className={styles.actionButton} onTap={onChat}>
          聊天记录
        </Button> */}
        <Button
          mode="primary"
          className={cls(styles.actionButton, styles.deleteButton)}
          onTap={onDelete}
        >
          删除
        </Button>
      </View>
    </View>
  </View>
)

export default AgentCard
