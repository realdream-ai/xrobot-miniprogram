import api from '@/apis/api'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, navigateTo } from 'remax/one'
import { usePageEvent } from 'remax/macro'
import { showToast, showModal, showLoading, hideLoading } from '@remax/wechat'
import Button from '@/ui/Button'
import AppBar from '@/components/AppBar'
import { Pages, nameMap, routeMap } from '@/constants/route'
import LoginRequired from '@/components/LoginRequired'
import Scaffold from '@/components/Scaffold'
import store from '@/stores'
import CreateAgentDialog from './components/AgentAdder/index'
import AgentCard from './components/AgentCard'
import styles from './index.less'
import type { Agent } from './types'
import RedArrow from './components/RedArrow/RedArrow'

export default function ManageAgent() {
  const [isLoading, setIsLoading] = useState(false)
  const [createDialogVisible, setCreateDialogVisible] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])

  const fetchAgentList = () => {
    console.log('fetch agentlist')
    setIsLoading(true)
    showLoading({ title: '加载中...' })
    api.agent.getAgentList(res => {
      if (res.code === 401) {
        hideLoading()
        setIsLoading(false)
        showToast({ title: '未授权', icon: 'error', duration: 3000 })
        showToast({ title: '请尝试重新登录', icon: 'error', duration: 3000 })
        // navigateTo({ url: routeMap[Pages.MineAccManage] })
      } else if (res.data) {
        setAgents(res.data as Agent[])
        hideLoading()
        setIsLoading(false)
      } else {
        hideLoading()
        setIsLoading(false)
        showToast({ title: '加载失败，请重试', icon: 'error' })
      }
    })
  }

  const loadData = useCallback(() => {
    if (isLoading) return

    setIsLoading(true)
    showLoading({ title: '加载中...' })
    // 先获取qinfo中的token
    api.qApi.fetchQInfo(
      res => {
        if (res.code === 500) {
          showToast({ title: '服务器异常', icon: 'error' })
        } else if (res.code === 0) {
          fetchAgentList()
        } else if (res.code === 401) {
          hideLoading()
          setIsLoading(false)
          // todo sso登录失效，获取token失败
          store.clearAuth()
          showToast({ title: '登录失效', icon: 'error' })
        }
      },
      () => {
        setIsLoading(false)
        hideLoading()
      }
    )
    // 这里会在fetch qinfo还未得到响应结果时就设置加载结束，
    // 应该修改fetch qinfo api 的参数添加一个 finallyCallback来设置加载结束
    // setIsLoading(false)
    // hideLoading()
  }, [isLoading])

  const hasLoadedRef = useRef(false)

  usePageEvent('onLoad', () => {
    console.log('manage-agent onLoad')
    loadData()
  })

  usePageEvent('onShow', () => {
    console.log('manage-agent onShow')
    loadData()
  })

  useEffect(() => {
    // 冷启动时 Remax 可能没注册上 onLoad/onShow
    if (!hasLoadedRef.current) {
      loadData()
      hasLoadedRef.current = true
    }
  }, [loadData])

  const handleCreateAgent = (name: string) => {
    // 实现创建智能体逻辑
    api.agent.addAgent(name, res => {
      if (res.code === 0) {
        fetchAgentList()
        showToast({ title: '创建成功', icon: 'success' })
      } else {
        showToast({ title: res.msg || '创建失败', icon: 'error' })
      }
    })
    setCreateDialogVisible(false)
  }

  const handleDeleteAgent = (agentId: string, agentName: string) => {
    showModal({
      title: '删除智能体',
      content: `确定要删除智能体 "${agentName}" 吗？此操作无法撤销。`,
      confirmText: '确定',
      cancelText: '取消',
      success: res => {
        if (res.confirm) {
          api.agent.deleteAgent(agentId, res_Del => {
            if (res_Del.code === 0) {
              showToast({ title: '删除成功', icon: 'success' })
              fetchAgentList()
            } else {
              showToast({ title: res_Del.msg || '删除失败', icon: 'error' })
            }
          })
        }
      }
    })
  }

  // 点击配置角色后跳转到角色配置页
  const goToRoleConfig = (agentId: string) => {
    navigateTo({
      url: `${routeMap[Pages.XrobotRoleConfig]}?agentId=${agentId}`
    })
  }

  // 点击设备管理后跳转到设备配置页
  const goToDeviceManage = (agentId: string) => {
    navigateTo({
      url: `${routeMap[Pages.XrobotDeviceManage]}?agentId=${agentId}`
    })
  }

  return (
    <Scaffold appBar={<AppBar title={nameMap[Pages.XrobotManageAgent]} />}>
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
        <ManageAgentPage
          agents={agents}
          onConfig={goToRoleConfig}
          onManage={goToDeviceManage}
          onDelete={handleDeleteAgent}
        />
        <View className={styles.agentPage__footer}>
          <Button
            mode="primary"
            className={styles.footerButton}
            onTap={() => setCreateDialogVisible(true)}
          >
            创建智能体
          </Button>
          {/* 小程序无法配置外部链接，所以暂时注释掉 */}
          {/* <Button
            className={styles.footerButton}
            onTap={() => navigateTo({ url: routeMap[Pages.XrobotDoc] })}
          >
            {nameMap[Pages.XrobotDoc]}
          </Button> */}
        </View>
        <CreateAgentDialog
          open={createDialogVisible}
          onClose={() => setCreateDialogVisible(false)}
          onCreate={handleCreateAgent}
        />
      </LoginRequired>
    </Scaffold>
  )
}

// 只保留展示逻辑
const ManageAgentPage: React.FC<{
  agents: Agent[];
  onConfig: (agentId: string) => void;
  onManage: (agentId: string) => void;
  onDelete: (agentId: string, agentName: string) => void;
}> = ({ agents, onConfig, onManage, onDelete }) => (
  <View className={styles.agentPage}>
    <View className={styles.agentPage__content}>
      {agents.length === 0 ? (
        <View
          className="alert-text__bold col-container"
          style={{ alignItems: 'center' }}
        >
          请点击下方按钮创建智能体
          <RedArrow />
        </View>
      ) : (
        agents.map((agent, index) => (
          <AgentCard
            key={index}
            {...agent}
            onConfig={() => onConfig(agent.id)}
            onManage={() => onManage(agent.id)}
            onDelete={() => onDelete(agent.id, agent.agentName)}
          />
        ))
      )}
    </View>
  </View>
)
