// import React, { useState, useEffect, useMemo } from 'react'
// import { View, Text, Button, Input, Checkbox, Textarea } from 'remax/wechat'
// import './index.less'

// // Type definitions
// interface FunctionItem {
//   id: string;
//   name: string;
//   params: { [key: string]: any };
//   fieldsMeta: FieldMeta[];
// }

// interface FieldMeta {
//   key: string;
//   label: string;
//   type: string;
//   default?: any;
// }

// interface Props {
//   show: boolean;
//   functions: FunctionItem[];
//   allFunctions: FunctionItem[];
//   onUpdate: (selected: FunctionItem[]) => void;
//   onCancel: () => void;
// }

// const FunctionDialog: React.FC<Props> = ({ show, functions, allFunctions, onUpdate, onCancel }) => {
//   const [dialogVisible, setDialogVisible] = useState(show)
//   const [selectedNames, setSelectedNames] = useState<string[]>([])
//   const [expandedFunction, setExpandedFunction] = useState<string | null>(null)
//   const [currentFunction, setCurrentFunction] = useState<FunctionItem | null>(null)
//   const [modifiedFunctions, setModifiedFunctions] = useState<{ [key: string]: FunctionItem }>({})
//   const [tempFunctions, setTempFunctions] = useState<{ [key: string]: FunctionItem }>({})
//   const [textCache, setTextCache] = useState<{ [key: string]: string }>({})

//   const selectedList = useMemo(
//     () => allFunctions.filter(f => selectedNames.includes(f.name)),
//     [allFunctions, selectedNames]
//   )

//   useEffect(() => {
//     setDialogVisible(show)
//     if (show) {
//       setSelectedNames(functions.map(f => f.name))
//       setCurrentFunction(selectedList[0] || null)
//     }
//   }, [show, functions, selectedList])

//   useEffect(() => {
//     if (currentFunction) {
//       currentFunction.fieldsMeta.forEach(f => {
//         const v = currentFunction.params[f.key]
//         if (f.type === 'array') {
//           setTextCache(prev => ({
//             ...prev,
//             [f.key]: Array.isArray(v) ? v.join('\n') : ''
//           }))
//         } else if (f.type === 'json') {
//           try {
//             setTextCache(prev => ({
//               ...prev,
//               [f.key]: JSON.stringify(v ?? {}, null, 2)
//             }))
//           } catch {
//             setTextCache(prev => ({
//               ...prev,
//               [f.key]: ''
//             }))
//           }
//         }
//       })
//     }
//   }, [currentFunction])

//   const handleFunctionClick = (func: FunctionItem) => {
//     setSelectedNames(
//       prev => (prev.includes(func.name) ? prev.filter(name => name !== func.name) : [...prev, func.name])
//     )
//   }

//   const handleExpandClick = (func: FunctionItem) => {
//     setExpandedFunction(expandedFunction === func.name ? null : func.name)
//     setCurrentFunction(func)
//   }

//   const handleParamChange = (func: FunctionItem, key: string, value: any) => {
//     if (!tempFunctions[func.name]) {
//       setTempFunctions(prev => ({ ...prev, [func.name]: JSON.parse(JSON.stringify(func)) }))
//     }
//     setTempFunctions(prev => ({
//       ...prev,
//       [func.name]: { ...prev[func.name], params: { ...prev[func.name].params, [key]: value } }
//     }))
//   }

//   const closeDialog = () => {
//     setTempFunctions({})
//     setSelectedNames(functions.map(f => f.name))
//     setCurrentFunction(null)
//     setExpandedFunction(null)
//     setDialogVisible(false)
//     onCancel()
//   }

//   const saveSelection = () => {
//     Object.keys(tempFunctions).forEach(name => {
//       setModifiedFunctions(prev => ({
//         ...prev,
//         [name]: JSON.parse(JSON.stringify(tempFunctions[name]))
//       }))
//     })
//     setTempFunctions({})
//     const selected = selectedList.map(f => {
//       const modified = modifiedFunctions[f.name]
//       return { id: f.id, name: f.name, params: modified ? { ...modified.params } : { ...f.params } }
//     })
//     onUpdate(selected as FunctionItem[])
//     setDialogVisible(false)
//   }

//   const getFunctionColor = (name: string) => {
//     const functionColorMap = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#A2836E']
//     const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0)
//     return functionColorMap[hash % functionColorMap.length]
//   }

//   return (
//     <View className={`function-dialog ${dialogVisible ? 'visible' : ''}`}>
//       <View className="custom-header">
//         <Text className="header-title">功能管理</Text>
//         <Button className="close-btn" onClick={closeDialog}>×</Button>
//       </View>

//       <View className="function-list">
//         {allFunctions.map(func => (
//           <View key={func.name} className={`function-item ${selectedNames.includes(func.name) ? 'selected' : ''}`}>
//             <View className="function-content" onClick={() => handleFunctionClick(func)}>
//               <Checkbox checked={selectedNames.includes(func.name)} />
//               <View className="function-icon" style={{ backgroundColor: getFunctionColor(func.name) }} />
//               <Text className="function-name">{func.name}</Text>
//               <Text
//                 className={`expand-btn ${expandedFunction === func.name ? 'expanded' : ''}`}
//                 onClick={_e => {
//                 //   e.stopPropagation();
//                   handleExpandClick(func)
//                 }}
//               >
//                 {expandedFunction === func.name ? '收起' : '展开'}
//               </Text>
//             </View>
//             {expandedFunction === func.name && (
//               <View className="param-forms">
//                 {func.fieldsMeta.length === 0 ? (
//                   <Text className="no-params">无需配置参数</Text>
//               ) : (
//                   func.fieldsMeta.map(field => (
//                     <View key={field.key} className="param-item">
//                       <Text className="param-label">{field.label}</Text>
//                       {field.type === 'array' ? (
//                         <Textarea
//                           value={textCache[field.key] || ''}
//                           onInput={e => setTextCache(prev => ({ ...prev, [field.key]: e.detail.value }))}
//                           disabled={!selectedNames.includes(func.name)}
//                         />
//                     ) : field.type === 'json' ? (
//                       <Textarea
//                         value={textCache[field.key] || ''}
//                         onInput={e => setTextCache(prev => ({ ...prev, [field.key]: e.detail.value }))}
//                         disabled={!selectedNames.includes(func.name)}
//                       />
//                     ) : field.type === 'number' ? (
//                       <Input
//                         type="number"
//                         value={func.params[field.key]}
//                         onInput={e => handleParamChange(func, field.key, e.detail.value)}
//                         disabled={!selectedNames.includes(func.name)}
//                       />
//                     ) : field.type === 'boolean' || field.type === 'bool' ? (
//                       <Checkbox
//                         checked={func.params[field.key]}
//                         onChange={(e: any) => handleParamChange(func, field.key, e.target.checked)}
//                         disabled={!selectedNames.includes(func.name)}
//                       />
//                     ) : (
//                       <Input
//                         value={func.params[field.key]}
//                         onInput={e => handleParamChange(func, field.key, e.detail.value)}
//                         disabled={!selectedNames.includes(func.name)}
//                       />
//                     )}
//                     </View>
//                   ))
//               )}
//               </View>
//             )}
//           </View>
//         ))}
//       </View>

//       <View className="drawer-footer">
//         <Button className="footer-btn cancel-btn" onClick={closeDialog}>取消</Button>
//         <Button className="footer-btn save-btn" onClick={saveSelection}>保存</Button>
//       </View>
//     </View>
//   )
// }

// export default FunctionDialog
