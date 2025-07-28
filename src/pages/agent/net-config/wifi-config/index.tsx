import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { navigateBack, navigateTo } from 'remax/one'
import './index.less'

import { nameMap, Pages, routeMap } from '@/constants/route'
import Scaffold from '@/components/Scaffold'
import AppBar from '@/components/AppBar'
import BackLeading from '@/components/AppBar/BackLeading'

import {
  useWifiConfigContext,
  WifiConfigProvider,
  iosSteps,
  androidSteps,
  IosStep,
  AndroidStep
} from './context'

import SelectDevice from './SelectDevice'
import ConnectDevice from './ConnectDevice'
import SelectWifi from './SelectWifi'
import SendWifiToDevice from './InputPwd'
import SubmitConfig from './SubmitConfig'
import IosDeviceGuide from './IosDeviceGuide'

const WifiConfigInner = observer(function WifiConfigInner() {
  const { isIOS, currentStep, setCurrentStep } = useWifiConfigContext()

  const handleBack = useCallback(async () => {
    // 端内流程回退
    if (isIOS) {
      const stepIndex = iosSteps.indexOf(currentStep as IosStep)
      if (stepIndex > 0) {
        setCurrentStep(iosSteps[stepIndex - 1])
        return
      }
    } else {
      const stepIndex = androidSteps.indexOf(currentStep as AndroidStep)
      if (stepIndex > 0) {
        setCurrentStep(androidSteps[stepIndex - 1])
        return
      }
    }
    try {
      await navigateBack()
    } catch {
      navigateTo({ url: routeMap[Pages.XrobotNetConfigWelcome] })
    }
  }, [currentStep, isIOS, setCurrentStep])
  const renderStepContent = () => (
    <>
      <div style={{ display: isIOS && currentStep === 'ios-guide' ? 'block' : 'none' }}>
        <IosDeviceGuide />
      </div>
      <div style={{ display: currentStep === 'select-device' ? 'block' : 'none' }}>
        <SelectDevice />
      </div>
      <div style={{ display: !isIOS && currentStep === 'connect-device' ? 'block' : 'none' }}>
        <ConnectDevice />
      </div>
      <div style={{ display: currentStep === 'select-wifi' ? 'block' : 'none' }}>
        <SelectWifi />
      </div>
      <div style={{ display: currentStep === 'input-pwd' ? 'block' : 'none' }}>
        <SendWifiToDevice />
      </div>
      <div style={{ display: currentStep === 'submit-config' ? 'block' : 'none' }}>
        <SubmitConfig />
      </div>
    </>
  )

  return (
    <Scaffold
      appBar={(
        <AppBar
          title={nameMap[Pages.XrobotNetConfigWifi]}
          leading={<BackLeading onTap={handleBack} />}
        />
      )}
    >
      {renderStepContent()}
    </Scaffold>
  )
})

export default function WifiConfig() {
  return (
    <WifiConfigProvider>
      <WifiConfigInner />
    </WifiConfigProvider>
  )
}
