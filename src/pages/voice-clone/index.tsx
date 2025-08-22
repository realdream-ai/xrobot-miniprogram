import React, { useEffect, useState, useRef, useCallback } from 'react'
import { usePageEvent } from 'remax/macro'
import { View, Button as WxButton } from 'remax/one'
import Button from '@/ui/Button'
import {
  showModal,
  showToast,
  navigateTo,
  showLoading,
  hideLoading
} from 'remax/wechat'
import Scaffold from '@/components/Scaffold'
import AppBar from '@/components/AppBar'
import VoiceApi from '@/apis/module/voice'
import VoiceCard from '@/pages/voice-clone/components/VoiceCard'
import { Pages, routeMap } from '@/constants/route'
import LoginRequired from '@/components/LoginRequired'

import styles from './index.less'

interface Voice {
  id: string;
  name: string;
  state: 'Init' | 'Success' | 'Training' | 'Failed';
  language: string;
  demo_url?: string;
}

// 已复刻音色管理页面
const VoiceClonePage = () => {
  const [voiceList, setVoiceList] = useState<Voice[]>([])
  const [loading, setLoading] = useState(false)

  // 获取音色列表
  const fetchVoiceList = () => {
    setLoading(true)
    showLoading({ title: '加载中' })
    VoiceApi.listVoiceClones(
      res => {
        setVoiceList(res.data?.voices || [])
        // setLoading(false);
        // hideLoading();
      },
      _err => {
        // setLoading(false);
        // hideLoading();
        showToast({ title: `加载数据失败：${_err.message}` })
      },
      () => {
        setLoading(false)
        hideLoading()
      }
    )
  }

  const loadData = useCallback(() => {
    if (loading) return
    fetchVoiceList()
  }, [loading])

  usePageEvent('onLoad', loadData)

  usePageEvent('onShow', loadData)

  usePageEvent('onPullDownRefresh', () => {
    loadData()
  })

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 创建音色
  const handleCreateVoice = () => {
    setLoading(true)
    VoiceApi.voiceClone(
      'QN_ACV',
      _res => {
        showToast({
          title: '创建成功, 点击复刻前往训练',
          icon: 'none',
          duration: 2000
        })
        fetchVoiceList()
      },
      _err => {
        setLoading(false)
        showToast({ title: '创建失败', icon: 'error', duration: 2000 })
      }
    )
  }

  // 试听音色
  const audioRef = useRef<any>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const handlePlayDemo = (voice: Voice) => {
    if (!voice.demo_url) return
    // 如果正在播放同一个，暂停
    if (playingId === voice.id && audioRef.current) {
      audioRef.current.pause()
      if (audioRef.current.destroy) audioRef.current.destroy()
      audioRef.current = null
      setPlayingId(null)
      return
    }
    // 否则播放新音频
    if (audioRef.current) {
      if (audioRef.current.stop) audioRef.current.stop()
      if (audioRef.current.destroy) audioRef.current.destroy()
      audioRef.current = null
    }
    const innerAudio = wx.createInnerAudioContext()
    innerAudio.src = voice.demo_url
    innerAudio.autoplay = true
    innerAudio.onPlay(() => {
      setPlayingId(voice.id)
    })
    innerAudio.onEnded(() => {
      setPlayingId(null)
      if (innerAudio.destroy) innerAudio.destroy()
      if (audioRef.current === innerAudio) audioRef.current = null
    })
    innerAudio.onError(() => {
      showToast({ title: '播放失败', icon: 'error' })
      setPlayingId(null)
      if (innerAudio.destroy) innerAudio.destroy()
      if (audioRef.current === innerAudio) audioRef.current = null
    })
    audioRef.current = innerAudio
    innerAudio.play()
  }

  const deleteVoice = (voice: Voice) => {
    setLoading(true)
    VoiceApi.deleteVoiceClone(
      voice.id,
      _res => {
        showToast({ title: '删除成功', icon: 'success', duration: 2000 })
        fetchVoiceList()
      },
      _err => {
        setLoading(false)
        // todo：后端目前虽然删除成功但是返回信息导致错误，需要后端修改
        fetchVoiceList()
      }
    )
  }

  // 删除音色
  const handleDeleteVoice = (voice: Voice) => {
    // 未训练的直接删除
    if (voice.state === 'Init') {
      deleteVoice(voice)
      return
    }
    showModal({
      title: '删除音色',
      content: '确定要删除该音色吗？',
      success: res => {
        if (!res.confirm) return
        deleteVoice(voice)
      }
    })
  }

  // 编辑音色名
  const handleEditVoice = (voice: Voice) => {
    showModal({
      title: '修改音色名称',
      editable: true,
      placeholderText: '请输入新名称',
      defaultText: voice.name,
      success: res => {
        if (!res.confirm) return
        if (!res.content) {
          showToast({ title: '请输入新名称', icon: 'none' })
          return
        }
        if (res.content === voice.name) {
          showToast({ title: '新名称与原名称相同', icon: 'none' })
          return
        }
        if (res.content.length > 20) {
          showToast({ title: '名称长度不能超过20个字符', icon: 'none' })
          return
        }
        setLoading(true)
        VoiceApi.trainVoiceClone(
          voice.id,
          { name: res.content },
          _res => {
            fetchVoiceList()
          },
          _err => {
            setLoading(false)
            showToast({ title: '修改失败', icon: 'error', duration: 2000 })
          }
        )
      }
    })
  }

  // 复刻（训练）音色
  const handleCloneVoice = (voice: Voice) => {
    if (voice.state === 'Training') {
      showToast({ title: '训练中，请稍后再试', icon: 'none', duration: 2000 })
      return
    }
    gotoTrainVoice(voice)
  }

  function gotoTrainVoice(voice: Voice) {
    navigateTo({
      url: `${routeMap[Pages.XrobotVoiceCloneTrain]}?id=${voice.id}&name=${
        voice.name
      }`
    })
  }

  return (
    <Scaffold appBar={<AppBar title="音色复刻" />}>
      <LoginRequired
        autoRedirect={false}
        noLoginView={
          <View className="col-container">
            <View className="alert-text alert-text__bold">未登录</View>
            <View className="alert-text">请登录后使用</View>
            <Button
              className={styles.footerButton}
              mode="primary"
              onTap={() => {
                // 这里需要把 routeMap[Pages.XrobotManageAgent] 删除最前面的'/'
                const originUrl = routeMap[Pages.XrobotManageAgent].replace(
                  '/',
                  ''
                )
                navigateTo({
                  url: `${
                    routeMap[Pages.XrobotAccountLogin]
                  }?sourceUrl=${encodeURIComponent(originUrl)}`
                })
              }}
            >
              登录
            </Button>
          </View>
        }
      >
        {/* 音色列表 */}
        <View className="voice-list">
          {voiceList.length === 0 && !loading && (
            <View className="empty">暂无音色，请先创建</View>
          )}
          {voiceList.map(voice => (
            <VoiceCard
              key={voice.id}
              voice={voice}
              onEdit={handleEditVoice}
              onPlay={handlePlayDemo}
              onClone={handleCloneVoice}
              onDelete={handleDeleteVoice}
              playing={playingId === voice.id}
            />
          ))}
        </View>

        {/* 创建音色按钮 */}
        <View className="create-btn-wrapper">
          <WxButton
            className="create-btn"
            onTap={handleCreateVoice}
            type="submit"
          >
            创建音色
          </WxButton>
        </View>
      </LoginRequired>
    </Scaffold>
  )
}

export default VoiceClonePage
