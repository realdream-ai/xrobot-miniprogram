import React, { useState } from 'react'
import { showModal, showToast } from '@remax/wechat'

interface CreateAgentDialogProps {
  open: boolean
  onClose: () => void
  onCreate: (agentName: string) => void
}

const CreateAgentDialog: React.FC<CreateAgentDialogProps> = ({
  open,
  onClose,
  onCreate
}) => {
  const [, setAgentName] = useState('')

  const handleShowModal = () => {
    showModal({
      title: '创建智能体',
      content: '',
      editable: true,
      placeholderText: '请输入智能体名称',
      confirmText: '确定',
      cancelText: '取消',
      success: res => {
        if (res.confirm && res.content) {
          const name = res.content.trim()
          if (!name) {
            // todo 此处showtoast似乎有未知原因导致失败
            showToast({ title: '名称不能为空', icon: 'error', duration: 3000 })
            return
          }
          if (name.length > 50) {
            showToast({ title: '名称过长', icon: 'error', duration: 3000 })
            return
          }
          onCreate(name)
          setAgentName('')
        }
        onClose()
      },
      fail: () => {
        onClose()
      }
    })
  }

  if (open) {
    handleShowModal()
  }

  return null
}

export default CreateAgentDialog
