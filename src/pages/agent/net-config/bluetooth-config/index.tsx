import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { navigateBack, navigateTo } from 'remax/one'
import './index.less'

import { nameMap, Pages, routeMap } from '@/constants/route'
import Scaffold from '@/components/Scaffold'
import AppBar from '@/components/AppBar'
import BackLeading from '@/components/AppBar/BackLeading'

import {
  useBluetoothConfigContext,
  BluetoothConfigProvider,
  configSteps,
  Step
} from './context'

import SelectDevice from './SelectDevice'
import ConnectDevice from './ConnectDevice'
import SelectWifi from './SelectWifi'
import InputPwd from './InputPwd'
import SubmitConfig from './SubmitConfig'

const BluetoothConfigInner = observer(function BluetoothConfigInner() {
  const { currentStep, setCurrentStep } = useBluetoothConfigContext()

  const handleBack = useCallback(async () => {
    // 配网流程回退
    const stepIndex = configSteps.indexOf(currentStep)
    if (stepIndex > 0) {
      setCurrentStep(configSteps[stepIndex - 1] as Step)
      return
    }

    try {
      await navigateBack()
    } catch {
      navigateTo({ url: routeMap[Pages.XrobotNetConfigWelcome] })
    }
  }, [currentStep, setCurrentStep])

  const renderStepContent = () => (
    <>
      <div style={{ display: currentStep === 'select-device' ? 'block' : 'none' }}>
        <SelectDevice />
      </div>
      <div style={{ display: currentStep === 'connect-device' ? 'block' : 'none' }}>
        <ConnectDevice />
      </div>
      <div style={{ display: currentStep === 'select-wifi' ? 'block' : 'none' }}>
        <SelectWifi />
      </div>
      <div style={{ display: currentStep === 'input-pwd' ? 'block' : 'none' }}>
        <InputPwd />
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
          title={nameMap[Pages.XrobotNetConfigBluetooth]}
          leading={<BackLeading onTap={handleBack} />}
        />
      )}
    >
      {renderStepContent()}
    </Scaffold>
  )
})

export default function BluetoothConfig() {
  return (
    <BluetoothConfigProvider>
      <BluetoothConfigInner />
    </BluetoothConfigProvider>
  )
}
