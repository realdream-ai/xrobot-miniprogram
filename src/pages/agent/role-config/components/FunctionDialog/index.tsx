import React, { useState, useCallback, useEffect } from 'react'
import { View, Button, Text } from 'remax/one'
import { PorviderPluginFunction, ParamInfo } from '@/pages/common/types'
import ParamsInput from '../paramsInput'
import './index.less'

interface Props {
  style?: any;
  all_functions: PorviderPluginFunction[];
  current_functions: PorviderPluginFunction[];
  onSave: (updatedFunctions: PorviderPluginFunction[]) => void;
  onCancel: () => void;
}

const FunctionDialog: React.FC<Props> = ({ all_functions, current_functions, onSave, onCancel, style }) => {
  const [selectedFunctionIds, setSelectedFunctionIds] = useState<string[]>(current_functions.map(item => item.id).filter(id => all_functions.some(f => f.id === id)))

  useEffect(() => {
    setSelectedFunctionIds(current_functions.map(item => item.id).filter(id => all_functions.some(f => f.id === id)))
  }, [all_functions, current_functions])

  const [paramValues, setParamValues] = useState<Record<string, ParamInfo>>(
    current_functions.reduce((acc, ef) => ({ ...acc, [ef.id]: ef.params }), {})
  )

  const handleParamChange = (pluginId: string, values: ParamInfo) => {
    // console.log('handleParamChange values', values)
    setParamValues(prev => ({
      ...prev,
      [pluginId]: values
    }))
  }

  const handleSave = () => {
    // console.log('func dialog onsave:\n', 'all_functions', all_functions, 'current_functions', current_functions)
    // console.log('paramValues', paramValues)
    // todo: 原本存在但后续被移除的func会被在此处被过滤
    const updatedFunctions = all_functions.filter(
      // 取出对应原始function
      func => selectedFunctionIds.some(id => (id === func.id))
      // 替换params
    ).map(func => ({
      ...func,
      params: paramValues[func.id]
    }))
    onSave(updatedFunctions)
  }

  const toggleFunction = useCallback((funcId: string) => {
    setSelectedFunctionIds(prev => (prev.includes(funcId) ? prev.filter(id => id !== funcId) : [...prev, funcId]))
  }, [])

  // 阻止滚动穿透
  const handleTouchMove = useCallback((e: any) => {
    e.stopPropagation()
  }, [])

  return (
    <View style={style}>
      <View className="function-dialog-overlay" onTouchMove={handleTouchMove}>
        <View className="function-dialog">
          <Text className="dialog-title">功能配置</Text>
          <View className="function-list">
            {all_functions.map(func => {
              const isSelected = selectedFunctionIds.includes(func.id)
              return (
                <View
                  key={func.id}
                  className={`function-card ${isSelected ? 'selected' : ''}`}
                  onTap={() => toggleFunction(func.id)}
                >
                  <View className="function-card-content">
                    <View className="function-info">
                      <Text className="function-name">{func.name}</Text>
                      {/* <Text className="function-code">{func.providerCode}</Text> */}
                    </View>
                    <Text className={`function-status ${isSelected ? 'enabled' : 'disabled'}`}>
                      {isSelected ? '已开启' : '未开启'}
                    </Text>
                  </View>
                  {isSelected && (
                    <View className="function-params" onTap={e => e.stopPropagation()}>
                      <ParamsInput
                        single_function={func}
                        current_function={current_functions.find(ef => ef.id === func.id)}
                        onChange={values => handleParamChange(func.id, values)}
                      />
                    </View>
                  )}
                </View>
              )
            })}
          </View>
          <View className="dialog-actions">
            <Button className="dialog-button cancel" onTap={onCancel}>
              取消
            </Button>
            <Button className="dialog-button save" onTap={handleSave}>
              保存
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}

export default FunctionDialog
