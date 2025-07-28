/**
 * @file LoginRequired 组件
 * @description 若用户未登录会自动重定向到登录页面
 */

import React, { PropsWithChildren, ReactNode, useEffect } from 'react'
import { redirectTo } from 'remax/one'
import store from '@/stores'

import PageLoading from '@/ui/PageLoading'
import { toLoginPageUrl } from './util'

export interface LoginRequiredProps {
  /* 未登录时显示的内容，不传的话用 PageLoading */
  noLoginView?: ReactNode
}

export default function LoginRequired({ children, noLoginView }: PropsWithChildren<LoginRequiredProps>) {
  useEffect(() => {
    if (store.getCookie() !== '') {
      return
    }
    redirectTo({ url: toLoginPageUrl() })
  }, [])
  if (store.getCookie() === '') {
    return <>{noLoginView !== undefined ? noLoginView : <PageLoading />}</>
  }
  return <>{children}</>
}
