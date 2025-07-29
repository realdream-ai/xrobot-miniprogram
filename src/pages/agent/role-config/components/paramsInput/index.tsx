import React, { useState, useEffect, useCallback } from 'react'
import { View, Input, Text, Button, InputEvent } from 'remax/one'

import { PorviderPluginFunction, ParamInfo } from '@/pages/common/types'

import './index.less'

interface Props {
  single_function: PorviderPluginFunction;
  current_function: PorviderPluginFunction | undefined;
  onChange: (info: ParamInfo) => void;
}

interface Field {
  key: string;
  type: string;
  label: string;
  default: string;
}

const ParamsInput: React.FC<Props> = ({ single_function, current_function, onChange }: Props) => {
  const [values, setValues] = useState<ParamInfo>(() => {
    const initialValues: ParamInfo = {}
    const fields: Field[] = JSON.parse(single_function.fields || '[]')
    fields.forEach(field => {
      initialValues[field.key] = current_function?.params[field.key] || field.default || ''
    })
    return initialValues
  })

  const onChangeCallback = useCallback((_values: ParamInfo) => {
    onChange(_values)
  }, [onChange])

  useEffect(() => {
    onChangeCallback(values)
  }, [onChangeCallback, values])

  const handleInputChange = useCallback((key: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const handleReset = useCallback((key: string) => {
    const fields: Field[] = JSON.parse(single_function.fields || '[]')
    const field = fields.find(f => f.key === key)
    if (field) {
      setValues(prev => ({
        ...prev,
        [key]: field.default || ''
      }))
    }
  }, [single_function.fields])

  const fields: Field[] = JSON.parse(single_function.fields || '[]')

  return (
    <View className="params-input">
      {fields.map(field => (
        <View key={`${single_function.id}-${field.key}`} className="input-wrapper">
          <View className="input-header">
            <Text className="input-label">{field.label}</Text>
            <Button
              className="reset-button"
              onTap={() => handleReset(field.key)}
            >
              ↺
            </Button>
          </View>
          <Input
            className="input-field"
            id={`${single_function.id}-${field.key}`}
            value={values[field.key] || ''}
            onInput={(e: InputEvent) => handleInputChange(field.key, e.target.value)}
            placeholder={`请输入${field.label}`}
          />
        </View>
      ))}
    </View>
  )
}

export default ParamsInput
