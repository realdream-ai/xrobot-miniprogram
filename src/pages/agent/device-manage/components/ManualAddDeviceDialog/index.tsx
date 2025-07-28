// import React, { useState } from 'react';
// import { View, Text, RadioGroup, Radio, Button } from 'remax/wechat';
// import { Textarea } from 'remax/one';
// import './index.less';

// interface ManualAddDeviceDialogProps {
//   agentId: string;
//   onClose: () => void;
//   onConfirm: (codes: string[], type: 'MAC' | 'SN') => void;
// }

// const ManualAddDeviceDialog: React.FC<ManualAddDeviceDialogProps> = ({
//   agentId,
//   onClose,
//   onConfirm,
// }) => {
//   const [type, setType] = useState<'MAC' | 'SN'>('MAC');
//   const [codes, setCodes] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const validateCodes = () => {
//     const codeArray = codes
//       .split('\n')
//       .map((code) => code.trim())
//       .filter((code) => code);
//     if (codeArray.length === 0) {
//       setError('请输入设备信息');
//       return null;
//     }

//     if (type === 'MAC') {
//       const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
//       for (const code of codeArray) {
//         if (!macRegex.test(code)) {
//           setError(
//             `请输入正确的Mac地址格式，例如：00:1A:2B:3C:4D:5E (错误: ${code})`
//           );
//           return null;
//         }
//       }
//     }

//     setError('');
//     return codeArray;
//   };

//   const handleConfirm = () => {
//     if (loading) return;
//     const validCodes = validateCodes();
//     if (validCodes) {
//       setLoading(true);
//       onConfirm(validCodes, type);
//       setCodes('');
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setCodes('');
//     setError('');
//     setType('MAC');
//     onClose();
//   };

//   return (
//     <View className="manual-add-device-dialog">
//       <View className="dialog-container">
//         <View className="dialog-header">
//           <Text className="title">批量导入设备</Text>
//         </View>
//         <View className="dialog-divider" />
//         <View className="dialog-content">
//           <View className="form-item">
//             <Text className="label">
//               <Text className="required">*</Text> 设备型号
//             </Text>
//             <RadioGroup
//               className="radio-group"
//               onChange={(e) => {
//                 setType(e.target.value);
//                 setError('');
//               }}
//             >
//               <Radio value="MAC" checked={type === 'MAC'}>
//                 MAC
//               </Radio>
//               <Radio value="SN" checked={type === 'SN'}>
//                 SN码
//               </Radio>
//             </RadioGroup>
//           </View>
//           <View className="form-item">
//             <Text className="label">
//               <Text className="required">*</Text> Mac地址
//             </Text>
//             <Textarea
//               className="textarea"
//               placeholder={
//                 type === 'MAC'
//                   ? '请输入Mac地址，每行一个，例如：00:1A:2B:3C:4D:5E'
//                   : '请输入SN码，每行一个'
//               }
//               value={codes}
//               onInput={(e) => {
//                 setCodes(e.detail.value);
//                 setError('');
//               }}
//               disabled={loading}
//             />
//             {error && <Text className="error">{error}</Text>}
//           </View>
//         </View>
//         <View className="dialog-footer">
//           <Button
//             className="dialog-button cancel"
//             onClick={handleCancel}
//             disabled={loading}
//           >
//             取消
//           </Button>
//           <Button
//             className="dialog-button confirm"
//             onClick={handleConfirm}
//             disabled={loading}
//           >
//             确定
//           </Button>
//         </View>
//       </View>
//     </View>
//   );
// };

// export default ManualAddDeviceDialog;
