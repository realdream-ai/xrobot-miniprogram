import React, { useState, useEffect } from 'react'
import { View, Text, Input, Textarea, navigateBack } from 'remax/one'
import { Picker, hideLoading, showLoading } from 'remax/wechat'
import { useQuery } from 'remax'
import { usePageEvent } from 'remax/macro'
import AppBar from '@/components/AppBar'
import BackLeading from '@/components/AppBar/BackLeading'
import { nameMap, Pages } from '@/constants/route'
import api from '@/apis/api'
import { ConfigFunction, ModelItem, PorviderPluginFunction } from '@/pages/common/types'
import type { AgentTemplate } from '@/pages/agent/manage-agent/types'
import Scaffold from '@/components/Scaffold'
import LoginRequired from '@/components/LoginRequired'

import type {
  RoleFormData,
  PickerOption,
  ConfigPageProps,
  ModelOptions,
  ModelType,
  ModelID
} from './types'
import { DefaultModelOptions } from './types'
import './index.less'
import FunctionDialog from './components/FunctionDialog'
import { functionColorMap } from './constrants'

// 事件类型定义
interface InputEvent {
  target: { value: string };
}

const ChatHistoryRadio: React.FC<{
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}> = ({ value, onChange, disabled }) => (
  <View className={`chat-history-options ${disabled ? 'disabled' : ''}`}>
    <View
      className={`radio-option ${value === 1 ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onTap={() => !disabled && onChange(1)}
    >
      <Text>上报文字</Text>
    </View>
    <View
      className={`radio-option ${value === 2 ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onTap={() => !disabled && onChange(2)}
    >
      <Text>上报文字+语音</Text>
    </View>
  </View>
)

const RoleConfigPage: React.FC<ConfigPageProps> = () => {
  const query = useQuery()
  const currentAgentId = query.agentId || ''
  const agentId = currentAgentId
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState<RoleFormData>({
    agentCode: '',
    agentName: '',
    ttsVoiceId: '',
    chatHistoryConf: 0,
    systemPrompt: '',
    summaryMemory: '',
    langCode: '',
    language: '',
    sort: 0,
    model: {
      ttsModelId: '',
      vadModelId: '',
      asrModelId: '',
      llmModelId: '',
      vllmModelId: '',
      memModelId: '',
      intentModelId: ''
    }
  })

  const beLoad = (b?: boolean) => {
    if (b) {
      setIsLoading(true)
      showLoading({ title: '加载中...' })
    } else {
      setIsLoading(false)
      hideLoading()
    }
  }

  // 模型配置项
  const models = [
    // { label: '语音活动检测(VAD)', key: 'vadModelId' as ModelID, type: 'VAD'  as ModelType},
    // { label: '语音识别(ASR)', key: 'asrModelId' as ModelID, type: 'ASR'  as ModelType},
    { label: '大语言模型(LLM)', key: 'llmModelId' as ModelID, type: 'LLM' as ModelType },
    // { label: '视觉大模型(VLLM)', key: 'vllmModelId' as ModelID, type: 'VLLM'  as ModelType},
    { label: '意图识别(Intent)', key: 'intentModelId' as ModelID, type: 'Intent' as ModelType },
    { label: '记忆(Memory)', key: 'memModelId' as ModelID, type: 'Memory' as ModelType },
    { label: '语音合成(TTS)', key: 'ttsModelId' as ModelID, type: 'TTS' as ModelType }
  ]

  // 角色配置模板，通过api获取
  const [templates, setTemplate] = useState<AgentTemplate[]>([])
  const [loadingTemplate, setLoadingTemplate] = useState(false)

  // 当前角色启用的插件功能
  const [currentFunctions, setCurrentFunctions] = useState<PorviderPluginFunction[]>([])
  const [showFunctionDialog, setShowFunctionDialog] = useState(false)
  // const [enabledFunctions, setEabledFunctions] = useState<PluginId[]>([])
  // const [originalFunctions, setOriginalFunctions] = useState([])
  // const [enabledParamInfo, setEnabledParamInfo] = useState({})

  // 插件功能列表，通过api获取
  const [allFunctions, setAllFunctions] = useState<PorviderPluginFunction[]>([])

  // 模型选项
  const [modelOptions, setModelOptions] = useState<ModelOptions>(DefaultModelOptions)

  // 音色选项
  const [voiceOptions, setVoiceOptions] = useState<PickerOption[]>([])

  // 获取角色模板
  const fetchTemplates = () => {
    // setTemplate(templates as AgentTemplate[]);
    api.agent.getAgentTemplate(res => {
      if (res.code === 0) {
        setTemplate(res.data as AgentTemplate[])
      }
    })
  }

  // 获取插件功能列表，如：服务器音乐播放
  const fetchAllFunctions = (callback: (allFuncs: PorviderPluginFunction[]) => void) => {
    // beLoad(true)
    api.model.getPluginFunctionList(null, res2 => {
      // console.log('fetchAllFunctions,', res2);
      if (res2.code === 0) {
        const allFuncs = res2.data.map((item: PorviderPluginFunction) => {
          const meta = JSON.parse(item.fields || '[]')
          const params = meta.reduce((m: any, f: any) => {
            m[f.key] = f.default
            return m
          }, {})
          return { ...item, fieldsMeta: meta, params }
        }) || []
        setAllFunctions(allFuncs)
        callback(allFuncs)
      } else {
        console.error(res2.msg || '获取插件列表失败')
      }
      // beLoad(false)
    })
    const MAX_WAIT = 5000
    setTimeout(() => { if (isLoading) beLoad(false) }, MAX_WAIT)
  }

  const fetchModelOptions = () => {
    models.forEach(model => {
      api.model.getModelNames(model.type, '', res => {
        // console.log('fetch model options', model.type, res)
        if (res.code === 0) {
          setModelOptions(prev => ({
            ...prev,
            [model.type]: res.data.map((item: ModelItem) => ({
              value: item.id,
              label: item.modelName
            }))
          }))

        }
      })
    })
  }

  const fetchVoiceOptions = (modelId: string) => {
    if (!modelId) {
      setVoiceOptions([])
      return
    }
    api.model.getModelVoices(modelId, res => {
      // console.log('getModelVoices', res)
      if (res.code === 0 && res.data) {
        // todo: qiniu服务器api与开源接口差异 - 返回值结构 qiniu 音色放在res.data.voices中
        // eslint-disable-next-line no-underscore-dangle
        const _voiceOptions = res.data.voices.map(
          (voice: { id: string; name: string }) => ({
            value: voice.id,
            label: voice.name
          } as PickerOption)
        )
        // console.log(_voiceOptions)
        setVoiceOptions(_voiceOptions)
      } else {
        setVoiceOptions([])
      }
    })
  }

  // 获取agent配置
  const fetchAgentConfig = (_agentId: string) => {
    if (!_agentId) return
    api.agent.getDeviceConfig(_agentId, res => {
      if (res.code === 0) {
        setForm(prev => ({
          ...prev,
          ...res.data,
          // 若为空，tts音色模型默认：湾湾小何
          ttsVoiceId: res.data.ttsVoiceId || 'a5b85a7ba5b24a9a96e24aa88b500d2f',
          model: {
            // 优先采用原始的config中的数据，为空则优先使用可用模型的第一个
            ttsModelId: res.data.ttsModelId,  // || modelOptions.TTS?.[0].value || '',
            vadModelId: res.data.vadModelId,  // || modelOptions.VAD?.[0].value || '',
            asrModelId: res.data.asrModelId,  // || modelOptions.ASR?.[0].value || '',
            llmModelId: res.data.llmModelId,  // || modelOptions.LLM?.[0].value || '',
            vllmModelId: res.data.vllmModelId,  // || modelOptions.VLLM?.[0].value || '',
            memModelId: res.data.memModelId,  // || modelOptions.Memory?.[0].value || '',
            intentModelId: res.data.intentModelId  // || modelOptions.Intent?.[0].value || ''
          }
        }))

        // 后端只给了最小映射：[{ id, agentId, pluginId }, ...]
        const dataFunctions: ConfigFunction[] = res.data.functions || []
        // 先保证 allFunctions 已经加载（如果没有，则先 fetchAllFunctions）
        // const ensureFuncs = allFunctions.length
        //   ? Promise.resolve()
        //   : fetchAllFunctions();

        fetchAllFunctions(allFuncs => {
          // 合并：按照 pluginId（id 字段）把全量元数据信息补齐
          const curFuncs: PorviderPluginFunction[] = dataFunctions.map(mapping => {
            const meta: PorviderPluginFunction | undefined = allFuncs.find(f => f.id === mapping.pluginId)
            if (!meta) {
              // 插件定义没找到，退化处理
              return { id: mapping.pluginId, name: mapping.pluginId, params: {} } as PorviderPluginFunction
            }
            return {
              ...meta,
              id: mapping.pluginId,
              // name: meta.name,
              // 后端如果还有 paramInfo 字段就用 mapping.paramInfo，否则用 meta.params 默认值
              params: mapping.paramInfo || { ...meta.params },
              fieldsMeta: meta.fieldsMeta  // 保留以便对话框渲染 tooltip
            } as PorviderPluginFunction
          })
          setCurrentFunctions(curFuncs)

          // // 备份原始，以备取消时恢复
          // setOriginalFunctions(JSON.parse(JSON.stringify(currentFunctions)));

        })
      } else {
        console.error(res.msg || '获取配置失败')
      }
    })
  }

  // 获取已有的配置数据
  useEffect(() => {
    if (currentAgentId) {
      fetchAgentConfig(currentAgentId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  // 获取音色
  useEffect(() => {
    if (form.model.ttsModelId) {
      fetchVoiceOptions(form.model.ttsModelId)
    }
  }, [form.model.ttsModelId])

  // 加载时获取只读的数据
  usePageEvent('onLoad', () => {
    // 获取模板列表
    fetchTemplates()
    // 获取模型数据
    fetchModelOptions()
  })

  // todo bug: 打字快了会吞字
  const handleInputChange = (field: string, value: string | number) => {
    // console.log('handleInputChange, field', field, 'value', value)
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleModelChange = (modelType: string, value: string) => {
    // 当修改tts模型时，清空音色选项
    if (modelType === 'ttsModelId') {
      setForm(prev => ({
        ...prev,
        model: {
          ...prev.model,
          ttsVoiceId: null
        }
      }))
    }

    setForm(prev => ({
      ...prev,
      model: {
        ...prev.model,
        [modelType]: value
      }
    }))

    // 处理特殊逻辑
    if (modelType === 'memModelId') {
      if (value === 'Memory_nomem') {
        setForm(prev => ({ ...prev, chatHistoryConf: 0 }))
      } else if (!form.chatHistoryConf || form.chatHistoryConf === 0) {
        setForm(prev => ({ ...prev, chatHistoryConf: 2 }))
      }
    }
  }

  const selectTemplate = (template: AgentTemplate) => {
    if (loadingTemplate) return
    setLoadingTemplate(true)

    try {
      setForm(
        prev => ({
          ...prev,
          agentName: template.agentName,
          // tts音色 默认为 湾湾小何
          ttsVoiceId: template.ttsVoiceId || 'a5b85a7ba5b24a9a96e24aa88b500d2f',
          chatHistoryConf: template.chatHistoryConf,
          systemPrompt: template.systemPrompt,
          summaryMemory: template.summaryMemory,
          langCode: template.langCode,
          language: template.language,
          model: {
            ...prev.model,
            ttsModelId: template.ttsModelId,
            vadModelId: template.vadModelId,
            asrModelId: template.asrModelId,
            llmModelId: template.llmModelId,
            vllmModelId: template.vllmModelId,
            memModelId: template.memModelId,
            intentModelId: template.intentModelId
          }
        } as RoleFormData)
      )
      wx.showToast({
        title: `「${template.agentName}」`,
        icon: 'success'
      })
    } catch (error) {
      console.error('应用模板失败:', error)
      wx.showToast({ title: '应用模板失败', icon: 'error' })
    } finally {
      setTimeout(() => setLoadingTemplate(false), 500)
    }
  }

  const validateForm = () => {
    if (!form.agentName.trim()) {
      wx.showToast({
        title: '助手昵称不能为空',
        icon: 'error',
        duration: 2000
      })
      return false
    }
    if (form.agentName.length > 10) {
      wx.showToast({
        title: '助手昵称不能超过10个字符',
        icon: 'error',
        duration: 2000
      })
      return false
    }
    if (!form.ttsVoiceId) {
      wx.showToast({ title: '请选择角色音色', icon: 'error', duration: 2000 })
      return false
    }
    return true
  }

  const saveConfig = () => {
    const configData = {
      agentCode: form.agentCode,
      agentName: form.agentName,
      asrModelId: form.model.asrModelId,
      vadModelId: form.model.vadModelId,
      llmModelId: form.model.llmModelId,
      vllmModelId: form.model.vllmModelId,
      ttsModelId: form.model.ttsModelId,
      ttsVoiceId: form.ttsVoiceId,
      chatHistoryConf: form.chatHistoryConf,
      memModelId: form.model.memModelId,
      intentModelId: form.model.intentModelId,
      systemPrompt: form.systemPrompt,
      summaryMemory: form.summaryMemory,
      langCode: form.langCode,
      language: form.language,
      sort: form.sort,
      functions: currentFunctions.map(item => ({
        pluginId: item.id,
        paramInfo: item.params
      }))
    }
    // todo 校验tts与voice匹配

    console.log('保存配置:', configData)
    api.agent.updateAgentConfig(agentId, configData, data => {
      if (data.code === 0) {
        wx.showToast({ title: '配置保存成功', icon: 'success' })
        navigateBack()
      } else {
        wx.showToast({ title: data.msg || '配置保存失败', icon: 'error' })
      }
    })
  }

  const handleSaveConfig = () => {
    if (validateForm()) {
      wx.showModal({
        title: '保存配置',
        content: '确定要保存当前配置吗？\n保存后需要重启设备以生效。',
        confirmText: '确定',
        cancelText: '取消',
        success: res => {
          if (res.confirm) {
            saveConfig()
          }
        }
      })
    }
  }

  const resetConfig = () => {
    wx.showModal({
      title: '提示',
      content: '确定要重置配置吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: res => {
        if (res.confirm) {
          setForm({
            agentCode: '',
            agentName: '',
            ttsVoiceId: '',
            chatHistoryConf: 0,
            systemPrompt: '',
            summaryMemory: '',
            langCode: '',
            language: '',
            sort: 0,
            model: {
              ttsModelId: '',
              vadModelId: '',
              asrModelId: '',
              llmModelId: '',
              vllmModelId: '',
              memModelId: '',
              intentModelId: ''
            }
          })
          setCurrentFunctions([])
          wx.showToast({ title: '配置已重置', icon: 'success' })
        }
      }
    })
  }

  const getFunctionColor = (name: string) => {
    const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return functionColorMap[hash % functionColorMap.length]
  }

  const openFunctionDialog = () => {
    // todo: FunctionDialog暂未完成
    // return null
    console.log('openFunctionDialog')
    if (allFunctions.length === 0) {
      // fetchAllFunctions().then(() => setShowFunctionDialog(true))
      // pass
    } else {
      setShowFunctionDialog(true)
    }
  }

  const handleUpdateFunctions = (selected: PorviderPluginFunction[]) => {
    console.log('handleUpdateFunctions, selected:', selected)
    setCurrentFunctions(selected)
    setShowFunctionDialog(false)
  }

  const handleDialogClosed = () => {
    console.log('handleDialogClosed')
    setShowFunctionDialog(false)
  }

  // 简单的选择器组件
  const SimpleSelect: React.FC<{
    value: string;
    options: PickerOption[];
    onChange: (value: string) => void;
    placeholder?: string;
  }> = ({ value, options, onChange, placeholder = '请选择' }) => {
    const range = options?.map(opt => opt.label) || []
    const selectedIndex = options?.findIndex(opt => opt.value === value) ?? -1
    const isDisabled = !options || options.length === 0

    const handlePickerChange = (e: any) => {
      const index = e.detail.value
      const selectedValue = options[index]?.value || ''
      onChange(selectedValue)
    }

    let displayValue = ''
    if (isDisabled) {
      displayValue = '无数据'
    } else if (selectedIndex >= 0) {
      displayValue = options[selectedIndex].label
    } else {
      displayValue = placeholder
    }

    return (
      <View
        className={`simple-select-container ${isDisabled ? 'disabled' : ''}`}
      >
        <Picker
          range={range}
          value={selectedIndex >= 0 ? selectedIndex : 0}
          onChange={handlePickerChange}
          className="simple-select"
          disabled={isDisabled}
        >
          <View className="select-trigger">
            <Text className="select-value">{displayValue}</Text>
            <Text className="dropdown-arrow">▼</Text>
          </View>
        </Picker>
      </View>
    )
  }

  return (
    <Scaffold appBar={<AppBar title={nameMap[Pages.XrobotRoleConfig]} leading={<BackLeading />} />}>
      <LoginRequired>
        <View className="config-page">
          {/*
        <View className="hint-text">
          <Text className="info-icon">ℹ️</Text>
          <Text className="hint-content">
            保存配置后，需要重启设备，新的配置才会生效。
          </Text>
        </View> */}

          {/* <View className="divider" /> */}

          <View className="form-content">
            <View className="form-column">
              {/* 助手昵称 */}
              <View className="form-item">
                <Text className="form-label">助手昵称：</Text>
                <Input
                  className="form-input"
                  value={form.agentName}
                  onInput={(e: InputEvent) => handleInputChange('agentName', e.target.value)}
                  placeholder="请输入助手昵称"
                  maxLength={10}
                />
              </View>

              {/* 角色模版 */}
              <View className="form-item">
                <Text className="form-label">角色模版：</Text>
                <View className="template-container">
                  {templates.map((template, index) => (
                    <View
                      key={index}
                      className={`template-item ${loadingTemplate ? 'template-loading' : ''}`}
                      onTap={() => selectTemplate(template)}
                    >
                      <Text className="template-text">{template.agentName}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* 角色介绍 */}
              <View className="form-item">
                <Text className="form-label">角色介绍：</Text>
                <View className="textarea-container">
                  <Textarea
                    className="form-textarea"
                    value={form.systemPrompt}
                    onInput={(e: InputEvent) => handleInputChange('systemPrompt', e.target.value)}
                    placeholder="请输入内容"
                    maxLength={2000}
                  />
                  <Text className="char-count">
                    {form.systemPrompt.length}/2000
                  </Text>
                </View>
              </View>

              {/* 记忆 */}
              <View className="form-item">
                <Text className="form-label">记忆：</Text>
                <View className="textarea-container">
                  <Textarea
                    className="form-textarea memory-textarea"
                    value={form.summaryMemory}
                    onInput={(e: InputEvent) => handleInputChange('summaryMemory', e.target.value)}
                    placeholder={
                      form.model.memModelId === 'Memory_mem_local_short'
                        ? '请输入记忆内容'
                        : '当前记忆模型不支持编辑'
                    }
                    maxLength={2000}
                    disabled={form.model.memModelId !== 'Memory_mem_local_short'}
                  />
                  <Text className="char-count">
                    {form.summaryMemory?.length || 0}/2000
                  </Text>
                </View>
              </View>

              {/* 模型配置 */}
              {models.map((model, index) => (
                <View key={index} className="form-item">
                  <Text className="form-label">{model.label}</Text>
                  <View className="model-select-wrapper">
                    <SimpleSelect
                      value={form.model[model.key] || '无数据'}
                      options={modelOptions[model.type] || []}
                      onChange={value => handleModelChange(model.key, value)}
                      placeholder="请选择"
                    />
                    {model.type === 'Memory' && form.model.memModelId !== 'Memory_nomem' && (<ChatHistoryRadio value={form.chatHistoryConf} onChange={value => handleInputChange('chatHistoryConf', value)} disabled={form.model.memModelId === 'Memory_nomem'} />)}

                    {/* 意图识别功能图标 */}
                    {model.type === 'Intent' && form.model.intentModelId !== 'Intent_nointent' && (
                      <View className="function-icons">
                        {/* 编辑功能按钮 */}
                        <View className={`edit-function-btn ${showFunctionDialog ? 'active-btn' : ''} ${isLoading ? 'disable' : ''}`}
                          onTap={() => form.model.intentModelId !== 'Intent_nointent' && openFunctionDialog()}
                        >
                          <Text className="edit-btn-text">编辑功能</Text>
                        </View>
                        {/* 已启用功能图标 */}
                        {currentFunctions.map((func: any) => (
                          <View key={func.name}
                            className="icon-dot"
                            style={{ backgroundColor: getFunctionColor(func.name) }}
                          >
                            <Text className="icon-letter">
                              {func.name.charAt(0)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))}

              {/* 角色音色 */}
              <View className="form-item">
                <Text className="form-label">角色音色</Text>
                <SimpleSelect
                  value={form.ttsVoiceId}
                  options={voiceOptions}
                  onChange={value => handleInputChange('ttsVoiceId', value)}
                  placeholder="请选择"
                />
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="form-footer">
            <View className="btn btn-primary" onTap={handleSaveConfig}>
              <Text className="btn-text">保存配置</Text>
            </View>
            <View className="btn btn-secondary" onTap={resetConfig}>
              <Text className="btn-text">重置</Text>
            </View>
          </View>

          {/* 编辑功能对话框 */}
          {isLoading && !showFunctionDialog ? <></> : <FunctionDialog current_functions={currentFunctions} all_functions={allFunctions} onSave={handleUpdateFunctions} onCancel={handleDialogClosed} style={{ display: showFunctionDialog ? 'block' : 'none' }} />}
        </View>
      </LoginRequired>
    </Scaffold>
  )
}

export default RoleConfigPage
