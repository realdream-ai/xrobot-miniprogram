import AppBar from '@/components/AppBar'
import Scaffold from '@/components/Scaffold'
import { nameMap, Pages, routeMap } from '@/constants/route'
import React, { useState, useMemo } from 'react'
import { View, Text, navigateTo } from 'remax/one'
import { usePageEvent } from 'remax/macro'
import { ScrollView, showToast } from 'remax/wechat'
import api from '@/apis/api'
import store from '@/stores'
import { AgentTemplate } from '@/pages/agent/manage-agent/types'
import { fetch } from '@/utils/fetchs'

import SearchBar from './components/SearchBar'
import TagFilter from './components/TagFilter'
import TemplateCard from './components/TemplateCard'
import { Template } from './types'
import './index.less'

function fetchAllTemplates(callback: (data: { template: Template[] },) => void, failcallback: (res: any) => void) {
  console.log("fetchAllTemplates")
  fetch("https://xrobot-storage.qnaigc.com/xrobot-mp/agent-square-template.json",)
    .then((res) => { callback(res) })
    .catch((res) => { failcallback(res) })
}

export default function Square() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedTag, setSelectedTag] = useState('推荐')

  const loadData = () => {
    if (isLoading) return
    setIsLoading(true)

    fetchAllTemplates((res) => {
      setTemplates(res.template)
      setIsLoading(false)
    }, (res) => {
      console.error("获取模板失败：", res)
      showToast({ title: "获取模板失败", icon: "error", duration: 2000 })
    })
  }

  usePageEvent('onLoad', loadData)

  // 动态生成标签列表
  const filterTags = useMemo(() => {
    const dynamicTags: string[] = []

    // 根据模板数据动态添加特殊标签
    const hasRecommend = templates.some(t => t.isRecommend)
    const hasPicked = templates.some(t => t.isPicked)
    const hasOfficial = templates.some(t => t.isOffical)

    if (hasRecommend) dynamicTags.push('推荐')
    if (hasPicked) dynamicTags.push('精选')
    if (hasOfficial) dynamicTags.push('官方')

    // 收集所有模板的标签
    const allTags = new Set<string>()
    templates.forEach(template => {
      template.tags.forEach(tag => {
        if (tag.trim()) {
          allTags.add(tag.trim())
        }
      })
    })

    // 将标签按使用频率排序
    const tagFrequency = new Map<string, number>()
    templates.forEach(template => {
      template.tags.forEach(tag => {
        if (tag.trim()) {
          const trimmedTag = tag.trim()
          tagFrequency.set(trimmedTag, (tagFrequency.get(trimmedTag) || 0) + 1)
        }
      })
    })

    const sortedTags = Array.from(allTags).sort((a, b) => {
      const freqA = tagFrequency.get(a) || 0
      const freqB = tagFrequency.get(b) || 0
      return freqB - freqA // 按频率降序排列
    })

    // 合并特殊标签和普通标签
    return [...dynamicTags, ...sortedTags]
  }, [templates])

  const handleTemplateCardClick = (template: Template) => {
    store.setCurrentSquareDetailTemplate(template)
    navigateTo({
      url: `${routeMap[Pages.XrobotSquareTemplateDetail]}?id=${template.id}`
    })
  }

  // 过滤模板
  const filteredTemplates = useMemo(() => {
    let filtered = templates

    // 根据搜索文本过滤 ==> 搜索范围包含系统提示词、名称、标签
    if (searchText.trim()) {
      filtered = filtered.filter(template => template.agentName.toLowerCase().includes(searchText.toLowerCase())
        || (template.systemPrompt && template.systemPrompt.toLowerCase().includes(searchText.toLowerCase()))
        || template.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase())))
    }

    // 根据标签过滤
    if (selectedTag) {
      filtered = filtered.filter(template => {
        switch (selectedTag) {
          case '推荐':
            return template.isRecommend
          case '精选':
            return template.isPicked
          case '官方':
            return template.isOffical
          default:
            // 普通标签匹配
            return template.tags.some(tag => tag.trim() === selectedTag)
        }
      })
    }

    // 按使用量排序
    return filtered.sort((a, b) => b.stat_count - a.stat_count)
  }, [templates, searchText, selectedTag])

  const addAgent = (name: string, callback: (res: any) => void) => {
    setIsLoading(true)
    // 先获取qinfo中的token
    api.qApi.fetchQInfo(
      res => {
        if (res.code === 0) {
          // 再添加agent
          api.agent.addAgent(name, callback)
        } else if (res.code === 401) {
          setIsLoading(false)
          // todo 管理账号登录过期问题
          showToast({ title: '登录失效', icon: 'error' })
        }
      },
      () => setIsLoading(false)
    )

  }

  const updateAgent = (agentId: string, template: AgentTemplate, callback: (res: any) => void) => {
    // const configData = {
    //   ...template
    //   // functions: enabledFunctions.map((item: any) => ({
    //   //   pluginId: item.id,
    //   //   paramInfo: item.params
    //   // }))
    // }
    api.agent.updateAgentConfig(agentId, template, callback)
  }

  // todo: 添加智能体时会刷新/重新拉取数据
  const handleAddAgentWithTemplate = (template: Template) => {
    console.log('添加模板:', template.agentName)
    showToast({ title: `添加模板: ${template.agentName}` })

    // 实现添加模板的逻辑
    // 1. 添加一个新的agent，并拿到agentId
    addAgent(template.agentName, (res1: any) => {
      if (res1.code === 0) {
        // 2. 对新agent使用template更新配置
        // todo： 检查template
        updateAgent(res1.data, template as AgentTemplate, res2 => {
          if (res2.code === 0) {
            wx.showToast({ title: '添加成功', icon: 'success' })
          } else {
            wx.showToast({ title: res2.msg || '添加失败', icon: 'error' })
          }
        })
      } else {
        showToast({ title: res1.msg || '添加失败', icon: 'error' })
      }
    })
  }

  return (
    <Scaffold appBar={<AppBar title={nameMap[Pages.XrobotSquare]} />}>
      <ScrollView className="square-container" scrollY>
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="搜索智能体"
        />

        <TagFilter
          tags={filterTags}
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
        />

        <View className="template-list">
          {isLoading ? (
            <View className="loading">
              <Text>加载中...</Text>
            </View>
          ) : <>{filteredTemplates.length > 0 ? (
            filteredTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                onAdd={handleAddAgentWithTemplate}
                onTap={handleTemplateCardClick}
              />
            ))
          ) : (
            <View className="empty">
              <Text>暂无相关模板</Text>
            </View>
          )}</>}
        </View>
      </ScrollView>
    </Scaffold>
  )
}
