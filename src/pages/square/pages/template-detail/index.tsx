import React, { useState, useEffect } from 'react'
import { useQuery } from 'remax'
import { View, Text, Image } from 'remax/one'
import { ScrollView, showToast } from 'remax/wechat'
import AppBar from '@/components/AppBar'
import BackLeading from '@/components/AppBar/BackLeading'
import Scaffold from '@/components/Scaffold'
import api from '@/apis/api'
import { AgentTemplate } from '@/pages/agent/manage-agent/types'
import store from '@/stores'

import { Template } from '../../types'
import './index.less'

export default function TemplateDetail() {
  const query = useQuery()
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchTemplateDetail = async (_id: string) => {
    try {
      setIsLoading(true)
      // todo 调用 API 获取模板详情
      // const response = await api.getTemplateDetail(id)
      // setTemplate(response.data)

      const temp = store.popCurrentSquareDetailTemplate()
      setTemplate(temp || null)
    } catch (error) {
      console.error('获取模板详情失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const templateId = query.id as string
    const temp = store.popCurrentSquareDetailTemplate()
    // 首先尝试从全局状态获取
    if (temp && temp.id === templateId) {
      setTemplate(temp)
      setIsLoading(false)
    } else {
      // 如果全局状态没有，则通过 API 获取
      fetchTemplateDetail(templateId)
    }
  }, [query.id])

  const formatCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万人`
    }
    return `${count}人`
  }

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

  const updateAgent = (agentId: string, callback: (res: any) => void) => {
    // const configData = {
    //   ...template
    //   // functions: enabledFunctions.map((item: any) => ({
    //   //   pluginId: item.id,
    //   //   paramInfo: item.params
    //   // }))
    // }
    api.agent.updateAgentConfig(agentId, template as AgentTemplate, callback)
  }

  const handleAddAgentWithTemplate = () => {
    if (template) {
      console.log('使用模板:', template.agentName)
      // 实现使用模板的逻辑
      console.log('添加模板:', template.agentName)
      showToast({ title: `添加模板: ${template.agentName}` })

      // 实现添加模板的逻辑
      // 1. 添加一个新的agent，并拿到agentId
      addAgent(template.agentName, (res1: any) => {
        if (res1.code === 0) {
          // 2. 对新agent使用template更新配置
          // todo： 检查template
          updateAgent(res1.data, (res2: any) => {
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
  }

  if (isLoading) {
    return (
      <Scaffold appBar={<AppBar title="模板详情" leading={<BackLeading />} />}>
        <View className="loading-container">
          <Text>加载中...</Text>
        </View>
      </Scaffold>
    )
  }

  if (!template) {
    return (
      <Scaffold appBar={<AppBar title="模板详情" leading={<BackLeading />} />}>
        <View className="error-container">
          <Text>模板不存在</Text>
        </View>
      </Scaffold>
    )
  }

  return (
    <Scaffold appBar={<AppBar title={template.agentName} leading={<BackLeading />} />}>
      <ScrollView className="template-detail" scrollY>
        {/* 头部信息 */}
        <View className="detail-header">
          <Image
            className="detail-avatar"
            src={template.icon || '/images/placeholder.png'}
            mode="aspectFill"
          />
          <View className="detail-info">
            <View className="detail-title-row">
              <Text className="detail-name">{template.agentName}</Text>
              {template.isOffical && (
                <Text className="official-badge">官方</Text>
              )}
              {template.langCode && (
                <Text className="language-badge">{template.language}</Text>
              )}
            </View>
            <View className="detail-stats">
              <Text className="stats-item">💬 {formatCount(template.stat_count)}聊过</Text>
              {template.creator && (
                <Text className="stats-item">👤 @{template.creator}</Text>
              )}
            </View>
          </View>
        </View>

        {/* 描述 */}
        <View className="detail-section">
          <Text className="section-title">描述</Text>
          <Text className="section-content">
            {template.systemPrompt || '暂无描述'}
          </Text>
        </View>

        {/* 标签 */}
        {template.tags.length > 0 && (
          <View className="detail-section">
            <Text className="section-title">标签</Text>
            <View className="tags-container">
              {template.tags.map((tag, index) => (
                <Text key={index} className="detail-tag">
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* 配置信息 */}
        <View className="detail-section">
          <Text className="section-title">配置信息</Text>
          <View className="config-list">
            <View className="config-item">
              <Text className="config-label">聊天历史配置:</Text>
              <Text className="config-value">{template.chatHistoryConf}</Text>
            </View>
            <View className="config-item">
              <Text className="config-label">语言:</Text>
              <Text className="config-value">{template.language}</Text>
            </View>
            <View className="config-item">
              <Text className="config-label">创建时间:</Text>
              <Text className="config-value">{template.createdAt || '未知'}</Text>
            </View>
            {template.updatedAt && (
              <View className="config-item">
                <Text className="config-label">更新时间:</Text>
                <Text className="config-value">{template.updatedAt}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 底部操作按钮 */}
        <View className="detail-actions">
          <View className="action-button primary" onTap={handleAddAgentWithTemplate}>
            <Text className="action-text">添加到我的智能体</Text>
          </View>
        </View>
      </ScrollView>
    </Scaffold>
  )
}
