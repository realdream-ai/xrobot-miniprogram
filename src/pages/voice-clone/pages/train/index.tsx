import React, { useState } from 'react'
import { View, Button } from 'remax/one'
import { useQuery } from 'remax'
import { showToast, showModal, showLoading, hideLoading, navigateBack } from 'remax/wechat'

import VoiceApi from '@/apis/module/voice'
import Scaffold from '@/components/Scaffold'
import AppBar from '@/components/AppBar'
import BackLeading from '@/components/AppBar/BackLeading'
import './index.less'

// todo: 该页面暂未完成文件上传功能
// bug： 开始训练后，(模拟器）页面会一直闪，真机正常

// const ALLOWED_EXTS = ['wav', 'mp3']
// const MAX_SIZE_MB = 10

export default function TrainVoicePage() {
  const query = useQuery<{ id: string, name: string }>()
  const voiceId = query.id
  const voiceName = query.name

  const [file, setFile] = useState<any>(null)
  const [uploadKey, setUploadKey] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [training, setTraining] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState<'Init'|'Success'|'Training'|'Failed'>('Init')
  const [failMsg, setFailMsg] = useState('')

  // // 聊天/文件选择音频
  // const handleChooseFromChat = () => {
  //   wx.chooseMessageFile({
  //     count: 1,
  //     type: 'file',
  //     extension: ALLOWED_EXTS,
  //     success: res => {
  //       const f = res.tempFiles[0]
  //       if (!validateFile(f)) return
  //       confirmAndSetFile(f)
  //     },
  //     fail: () => {
  //       // showToast({ title: '未选择文件', icon: 'none' })
  //     }
  //   })
  //   // e.g.
  //   // binary: ArrayBuffer(1506424) {byteLength: 1506424, maxByteLength: 1506424, resizable: false, detached: false}
  //   // name: "01.mp3"
  //   // path: "wxfile://tmp_f842b5ac5ed59e0e306d7aebe6e2c13d17276f9aadb3d51b.mp3"
  //   // size: 1506424
  //   // time: 1753163963
  //   // type: "file"
  // }

  // 通过链接导入音频
  const handleImportByUrl = () => {
    showModal({
      title: '通过链接导入音频',
      editable: true,
      placeholderText: 'http(s)://',
      success: res => {
        if (!res.confirm) return
        const url = (res.content || '').trim()
        if (!url) {
          showToast({ title: '请输入链接', icon: 'error' })
          return
        }
        if (!/^https?:\/\/.+\.(mp3|wav)$/i.test(url)) {
          showToast({ title: '链接格式不合法，仅支持http(s)且以.mp3/.wav结尾', icon: 'none' })
          return
        }
        setUploadKey(url)
        setFile({ name: url.split('/').pop(), url })
        setUploadSuccess(true)
        setVoiceStatus('Init')
        showToast({ title: '链接导入成功', icon: 'success' })
      }
    })
  }

  // function validateFile(f: any) {
  //   const ext = f.name ? f.name.slice(f.name.lastIndexOf('.')).toLowerCase() : ''
  //   if (!ALLOWED_EXTS.includes(ext)) {
  //     showToast({ title: '仅支持mp3/wav格式', icon: 'none' })
  //     return false
  //   }
  //   if (f.size > MAX_SIZE_MB * 1024 * 1024) {
  //     showToast({ title: `文件不能超过${MAX_SIZE_MB}MB`, icon: 'none' })
  //     return false
  //   }
  //   return true
  // }

  // function confirmAndSetFile(file: any) {
  //   showModal({
  //     title: '上传声明',
  //     content: '请务必使用自己或已获授权的声音，否则将承担相关法律责任。是否确认上传？',
  //     success: res => {
  //       if (res.confirm) {
  //         // 读取为二进制
  //         wx.getFileSystemManager().readFile({
  //           filePath: file.path,
  //           encoding: undefined,
  //           success: readRes => {
  //             setFile({ ...file, binary: readRes.data })
  //           },
  //           fail: () => {
  //             showToast({ title: '读取文件失败', icon: 'error' })
  //           }
  //         })
  //       }
  //     }
  //   })
  // }

  // 上传 todo
  const handleUpload = () => {
    console.log('handleUpload', file, uploadKey)
    if (!file) {
      return
    }
    setUploading(true)
    // UploadApi.uploadFile(
    //   file.binary,
    //   uploadToken,
    //   res => {
    //     if (!res || !res.key) {
    //       showToast({ title: '上传失败', icon: 'error' })
    //       setUploading(false)
    //       return
    //     }
    //     setUploadKey(res.key)
    //     setUploadSuccess(true)
    //     setVoiceStatus('Init')
    //     showToast({ title: '上传成功', icon: 'success' })
    //   },
    //   () => {
    //     showToast({ title: '上传失败', icon: 'error' })
    //     setUploading(false)
    //   }
    // )
  }

  // 清除已选文件
  const handleClearFile = () => {
    setFile(null)
    setUploadSuccess(false)
    setVoiceStatus('Init')
  }

  // 开始训练
  const handleStartTrain = () => {
    if (!file || !uploadSuccess) return
    setTraining(true)
    setVoiceStatus('Training')
    setFailMsg('')
    showLoading({ title: '准备训练中' })
    VoiceApi.trainVoiceClone(
      voiceId as string,
      { key: uploadKey, name: voiceName },
      (res: any) => {
        hideLoading()
        if (res && res.code !== 0) {
          setVoiceStatus('Failed')
          setTraining(false)
          setFailMsg(res.msg || '训练失败')
          showToast({ title: '训练失败', icon: 'error' })
          return
        }
        showToast({ title: '训练已开始', icon: 'success', duration: 2000 })
        setVoiceStatus('Success')
        setTraining(false)
        setFailMsg('')
        navigateBack()
      },
      (e: Error) => {
        hideLoading()
        setVoiceStatus('Failed')
        setTraining(false)
        setFailMsg(`${e.name}: ${e.message}`)
        showToast({ title: '训练失败', icon: 'error', duration: 2000 })
      }
    )
  }

  // 状态映射
  const statusMap = {
    Init: { label: '待训练', color: '#bbb' },
    Success: { label: '训练成功', color: '#13ce66' },
    Training: { label: '训练准备中...', color: '#409eff' },
    Failed: { label: '训练失败', color: '#ff4949' }
  }

  return (
    <Scaffold appBar={<AppBar title="上传音频" leading={<BackLeading />} />}>
      <View className="upload-page">
        <View className="voice-upload-card">
          <View className="voice-upload-card__header">1. 选择音频文件</View>
          <View className="voice-upload-card__content">
            <View className="choose-btns">
              {/* <Button onTap={handleChooseFile} disabled={uploading}>
                文件管理器
              </Button> */}
              {/* todo: 聊天/文件选择 */}
              {/* <Button onTap={handleChooseFromChat} disabled={uploading}>
                聊天/文件选择
              </Button> */}
              <Button onTap={handleImportByUrl} disabled={uploading}>
                链接导入
              </Button>
            </View>
            {file && (
              <View className="file-info">
                <View>文件名：{file.name}</View>
                {file.size && <View>大小：{(file.size / 1024 / 1024).toFixed(2)} MB</View>}
                {file.url && <View>链接：{file.url}</View>}
              </View>
            )}
            <View className="tip">仅支持WAV/MP3，时长小于2分钟，文件仅限一份</View>
            <View className="tip">在使用此功能时，应遵守《用户协议》，同时取得声音权利人的授权，我们可能通过技术手段核验或要求提供授权文件。</View>
          </View>
          <View className="voice-upload-card__actions">
            {!uploadSuccess ? (
              <Button
                className="upload-btn"
                type="submit"
                disabled={!file || uploading}
                // loading={uploading}
                onTap={handleUpload}
              >
                确认上传
              </Button>
            ) : (
              <Button
                className="upload-btn"
                type="reset"
                onTap={handleClearFile}
              >
                清除文件
              </Button>
            )}
          </View>
        </View>

        {/* 状态与训练卡片 */}
        <View className="voice-upload-card">
          <View className="voice-upload-card__header">2. 音色训练</View>
          <View className="voice-upload-card__content">
            <View style={{ fontSize: 40, marginBottom: 12, fontWeight: 600 }}>
              <span style={{ color: statusMap[voiceStatus].color }}>
                状态：{statusMap[voiceStatus].label}
              </span>
            </View>
            {voiceStatus === 'Failed' && failMsg && (
              <View style={{ color: '#ff4949', fontSize: 40, marginBottom: 8 }}>错误：{failMsg}</View>
            )}
          </View>
          <View className="voice-upload-card__actions">
            <Button
              className="upload-btn"
              type="submit"
              disabled={!uploadSuccess || training}
              // loading={training}
              onTap={handleStartTrain}
            >
              开始训练
            </Button>
          </View>
        </View>
      </View>
    </Scaffold>
  )
}
