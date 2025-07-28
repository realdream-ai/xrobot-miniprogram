import React from 'react'
import { WebView } from 'remax/one'

import AppBar from '@/components/AppBar'
import Scaffold from '@/components/Scaffold'
import { Pages, nameMap } from '@/constants/route'

const url = 'https://ucnno9lo9da5.feishu.cn/wiki/Bbn4wfbvtiPRFWk8shyc4hqjnaf'

export default function DocPage() {
  return (
    <Scaffold appBar={<AppBar title={nameMap[Pages.XrobotDoc]} />}>
      <WebView src={url} />
    </Scaffold>
  )
}
