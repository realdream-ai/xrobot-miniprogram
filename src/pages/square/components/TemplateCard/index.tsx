import React from 'react'
import { View, Text, Image } from 'remax/one'
import { Template } from '../../types'
import './index.less'

interface TemplateCardProps {
  template: Template
  onAdd?: (template: Template) => void
  onTap?: (template: Template) => void
}

export default function TemplateCard({ template, onAdd, onTap }: TemplateCardProps) {
  const handleAdd = (e: any) => {
    e.stopPropagation() // 阻止事件冒泡
    if (onAdd) { onAdd(template) }

  }

  const handleCardClick = () => {
    if (onTap) { onTap(template) }
  }

  const formatCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万人聊过`
    }
    return `${count}人聊过`
  }

  return (
    <View className="template-card" onTap={handleCardClick}>
      <View className="template-card-content">
        <Image
          className="template-avatar"
          src={template.icon || '/images/placeholder.png'}
          mode="aspectFill"
          onError={e => {
            console.log('图片加载失败:', e)
          }}
        />
        <View className="template-info">
          <View className="template-header">
            <Text className="template-name">{template.agentName}</Text>
            {template.isOffical && (
              <Text className="official-badge">官方</Text>
            )}
            {template.langCode && (
              <Text className="language-badge">
                {template.language}
              </Text>
            )}
          </View>
          <Text className="template-description">
            {template.systemPrompt || '暂无描述'}
          </Text>
          <View className="template-stats">
            <Text className="stats-text">
              💬 {formatCount(template.stat_count)}
            </Text>
            {template.creator && (
              <>
                <Text className="separator"> · </Text>
                <Text className="creator-text">@{template.creator}</Text>
              </>
            )}
          </View>
          {template.tags.length > 0 && (
            <View className="template-tags">
              {template.tags.slice(0, 3).map((tag, index) => (
                <Text key={index} className="tag">
                  {tag}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
      <View className="add-button" onTap={handleAdd}>
        <Text className="add-icon">+</Text>
      </View>
    </View>
  )
}
