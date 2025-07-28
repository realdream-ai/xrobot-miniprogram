import React from 'react'
import { View, Text } from 'remax/one'
import { ScrollView } from 'remax/wechat'

import './index.less'

interface TagFilterProps {
  tags: string[]
  selectedTag: string
  onTagSelect: (tag: string) => void
}

export default function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  return (
    <ScrollView
      className="tag-filter"
      scrollX
      showScrollbar={false}
    >
      <View className="tag-list">
        {tags.map(tag => (
          <View
            key={tag}
            className={`tag-item ${selectedTag === tag ? 'tag-active' : ''}`}
            onTap={() => onTagSelect(tag)}
          >
            <Text className={`tag-text ${selectedTag === tag ? 'tag-text-active' : ''}`}>
              {tag}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
