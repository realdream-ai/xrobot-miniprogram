import React from 'react'
import { View, Input } from 'remax/one'

import './index.less'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = '搜索智能体' }: SearchBarProps) {
  return (
    <View className="search-bar">
      <View className="search-icon">🔍</View>
      <Input
        className="search-input"
        value={value}
        onInput={e => onChange(e.target.value)}
        placeholder={placeholder}
        // placeholderClass="search-placeholder"
      />
    </View>
  )
}
