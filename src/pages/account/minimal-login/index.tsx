import AppBar from '@/components/AppBar'
import Scaffold from '@/components/Scaffold'
import React, { useCallback, useState, useEffect } from 'react'
import { usePageEvent } from 'remax/macro'
import { Image, View } from 'remax/one'
import { Button as WxButton, GenericEvent } from 'remax/wechat'
import { useToast } from '@/utils/toast'
import { PhoneBoundUserIdsResp, UserID, identityCategoryTextMap } from '@/runtime/getPhoneBoundUserIds'
import {
  getPhoneBoundUserIds,
  signinWithPhone,
  signUpWithPhone
} from '@/runtime'
import { useQuery } from 'remax'

import BackLeading from '@/components/AppBar/BackLeading'
import { loginRedirect, setLoginInfo, SourceType, LoginRedirectType } from '@/components/LoginRequired/util'
import { CommonApiError } from '@/constants/api'
import { nameMap, Pages } from '@/constants/route'
import { useSystemInfo } from '@/utils/hooks/system-info'
import store from '@/stores'
import style from './style.less'
import avatarIcon from './icons/avatar.svg'

type Step = 'entry' | 'acc-select'

export default function LoginEntry() {
  const { source = SourceType.Self, sourceUrl, qr_key: qrKey } = useQuery()
  const showToast = useToast()

  useEffect(() => {
    setLoginInfo({ source: source as SourceType, sourceUrl })
  }, [source, sourceUrl])

  const loginCheck = useCallback(() => {
    if (store.getCookie() !== '') {
      showToast({ tip: '登录成功', icon: 'success' })
      loginRedirect(LoginRedirectType.Redirect)
    }
  }, [showToast])

  usePageEvent('onShow', () => {
    // 确保在 loginRedirect 前把页面参数存下来
    setLoginInfo({ source: source as SourceType, sourceUrl })
    loginCheck()
  })

  const [step, setStep] = useState<Step>('entry')
  const [userIdsResp, setUserIdsResp] = useState<PhoneBoundUserIdsResp | null>(null)

  // 登录手机已绑定账号
  const loginWithUserId = useCallback(
    async (token: string, userId: UserID) => {
      try {
        showToast({ tip: '登录中', icon: 'loading', duration: -1 })
        await signinWithPhone({
          token,
          account_id: userId.account_id,
          qr_key: qrKey
        })
        showToast({ tip: '登录成功', icon: 'success' })
        loginRedirect(LoginRedirectType.Redirect)
      } catch (err) {
        // if (err instanceof CommonApiError) {
        //   showToast({ tip: err.message, icon: 'fail' })
        // } else {
        //   showToast({ tip: '登录失败，请稍后再试', icon: 'fail' })
        // }
        console.log('loginWithUserId err', err)
      }
    },
    [showToast, qrKey]
  )

  // 自动注册并登录
  const autoRegisterAndLogin = useCallback(
    async (token: string) => {
      try {
        showToast({ tip: '自动注册中', icon: 'loading', duration: -1 })
        // 注册成功后，后台会自动登录并设置 cookie 不需要再调登录接口
        await signUpWithPhone({ token, qr_key: qrKey })
      } catch (err) {
        if (err instanceof CommonApiError) {
          showToast({ tip: err.message, icon: 'fail' })
        } else {
          showToast({ tip: '注册失败，请稍后再试', icon: 'fail' })
        }
        return
      }
      try {
        showToast({ tip: '登录中', icon: 'loading', duration: -1 })
        // await refreshUserInfo()
        showToast({ tip: '登录成功', icon: 'success' })
        loginRedirect(LoginRedirectType.Redirect)
      } catch (err) {
        if (err instanceof CommonApiError) {
          showToast({ tip: err.message, icon: 'fail' })
        } else {
          showToast({ tip: '自动登录失败，请稍后再试', icon: 'fail' })
        }
      }
    },
    [showToast, qrKey]
  )

  const handleLoginWithPhone = useCallback(
    async (code: string) => {
      // console.log('handleLoginWithPhone code: ', code)
      // const phoneInfo = await getPhoneNumber(code)
      // console.log('handleLoginWithPhone phoneInfo: ', phoneInfo)
      // console.log('handleLoginWithPhone2 code: ', code)
      try {
        showToast({ tip: '加载中', icon: 'loading', duration: -1 })
        const resp = await getPhoneBoundUserIds(code)
        showToast(undefined)
        // 手机号没有绑定账号，自动注册并登录
        if (!resp.user_ids || resp.user_ids.length === 0) {
          autoRegisterAndLogin(resp.token)
          return
        }
        // 自动登录第一个账号
        if (resp.user_ids.length === 1) {
          loginWithUserId(resp.token, resp.user_ids[0])
          return
        }

        // 绑定了多个账号，打开选择账号页面
        setUserIdsResp(resp)
        setStep('acc-select')
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('获取手机号绑定账号列表异常：', err)
        if (err instanceof CommonApiError) {
          showToast({ tip: err.message, icon: 'fail' })
        } else {
          showToast({ tip: '获取手机号绑定账号信息失败', icon: 'fail' })
        }
      }
    },
    [showToast, autoRegisterAndLogin, loginWithUserId]
  )

  const handleAccountSelect = useCallback((userId: UserID) => {
    if (userIdsResp) {
      loginWithUserId(userIdsResp.token, userId)
    }
  }, [userIdsResp, loginWithUserId])

  const { statusBarHeight, appBarHeight } = useSystemInfo()

  return (
    <Scaffold
      appBar={(
        <AppBar
          title={nameMap[Pages.XrobotAccountLogin]}
          leading={step === 'entry' ? <BackLeading /> : <BackLeading onTap={() => setStep('entry')} />}
        />
      )}
    >
      <View style={{ height: `calc(100vh - ${appBarHeight + statusBarHeight}px)` }}>
        {step === 'entry' && <Entry loginWithPhoneCode={handleLoginWithPhone} />}
        {step === 'acc-select' && (
          <AccountSelect
            userIds={userIdsResp?.user_ids}
            onAccountSelect={handleAccountSelect}
          />
        )}
      </View>
    </Scaffold>
  )
}

interface EntryProps {
  loginWithPhoneCode: (code: string) => void
}

function Entry({ loginWithPhoneCode }: EntryProps) {
  const handleLoginWithPhone = useCallback((e: GenericEvent) => {
    const code = e.detail.code
    if (!code) {
      return
    }
    loginWithPhoneCode(code)
  }, [loginWithPhoneCode])

  return (
    <View className={style.entry}>
      {/* <QiniuLogo /> */}
      <WxButton
        className={style.phoneLoginBtn}
        openType="getPhoneNumber"
        onGetPhoneNumber={handleLoginWithPhone}
      >
        手机号快捷登录
      </WxButton>
    </View>
  )
}

interface AccountSelectProps {
  userIds?: UserID[]
  onAccountSelect: (userId: UserID) => void
}

function AccountSelect({ userIds, onAccountSelect }: AccountSelectProps) {
  if (!userIds || !userIds.length) {
    return null
  }
  return (
    <View className={style.accSelect}>
      <View className={style.title}>请选择已关联账号</View>
      <View className={style.subTitle}>
        {`当前手机号已关联 ${userIds.length} 个账号${userIds.length ? '，请选择登录账号' : ''}。`}
      </View>
      <View className={style.list}>
        {userIds.map(userId => (
          <View className={style.uidCard} key={userId.user_id} onTap={() => onAccountSelect(userId)}>
            <Image mode="widthFix" className={style.userIcon} src={avatarIcon} />
            <View className={style.userInfo}>
              <View className={style.userName}>{userId.full_name || userId.email || '--'}</View>
              <View className={style.accountId}>账号 ID: {userId.account_id}</View>
            </View>
            <View className={style.identity}>{identityCategoryTextMap[userId.identity_category]}</View>
          </View>
        ))}
      </View>
    </View>
  )
}
