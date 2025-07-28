/**
 * @file Icon UI Component
 * @description 使用 url-loader + js-base64 实现 icon 的加载以及修改颜色
 * url-loader 用于将 *.icon.svg 的内容直接读取为 string 格式（remax.config.js 中自定义了 url-loader 的 generator）
 * 用正则将 fill="#xxx" && stroke="#xxx" 替换为外部传入的 color 值
 * 用 js-base64 将替换后的 string 编码为 base64
 * 编码后的字符串前面拼上 'data:image/svg+xml;base6'，赋值给 container 的 background-image，从而实现图标的加载
 */

import React, { HTMLAttributes } from 'react'
import { View } from 'remax/one'
import cls from 'classnames'
import { encode } from 'js-base64'

import { greyFour } from '@/utils/styles/color'

import { IconType } from '@/constants/icons'

import closeIcon from './images/close.icon.svg'
import emailIcon from './images/email.icon.svg'
import passwordIcon from './images/password.icon.svg'
import userIcon from './images/user.icon.svg'
import arrowRightIcon from './images/arrow-right.icon.svg'
import arrowLeftIcon from './images/arrow-left.icon.svg'
import arrowDownSolidIcon from './images/arrow-down-solid.icon.svg'
import searchIcon from './images/search.icon.svg'
import questionIcon from './images/question.icon.svg'
import warningIcon from './images/warning.icon.svg'
import closeSolidIcon from './images/close-solid.icon.svg'
import successSolidIcon from './images/success-solid.icon.svg'
import warningSolidIcon from './images/warning-solid.icon.svg'
import infoSolidIcon from './images/info-solid.icon.svg'
import timeSolidIcon from './images/time-solid.icon.svg'
import editIcon from './images/edit.icon.svg'
import deleteIcon from './images/delete.icon.svg'
import clockCircle from './images/clock-circle.icon.svg'
import moreIcon from './images/more.icon.svg'
import heart from './images/heart.icon.svg'
import volume from './images/volume.icon.svg'
import setting from './images/setting.icon.svg'
import heartFill from './images/heart-fill.icon.svg'
import dropdown from './images/dropdown.icon.svg'
import infoGreyIcon from './images/info-grey.icon.svg'
import homeIcon from './images/home.icon.svg'

import styles from './style.less'

export type Props = HTMLAttributes<HTMLElement> & {
  type: string | IconType
  color?: string
  size?: string
  onTap?: (e: any) => void
}

export default function Icon({
  type,
  color = greyFour,
  size = '32rpx',
  className,
  onTap
}: Props) {

  function getEncodeIconByType(iconType: string | IconType) {
    let iconStr = ''

    switch (iconType) {
      case IconType.Close:
        iconStr = closeIcon
        break
      case IconType.Email:
        iconStr = emailIcon
        break
      case IconType.Password:
        iconStr = passwordIcon
        break
      case IconType.User:
        iconStr = userIcon
        break
      case IconType.ArrowRight:
        iconStr = arrowRightIcon
        break
      case IconType.ArrowLeft:
        iconStr = arrowLeftIcon
        break
      case IconType.ArrowDownSolid:
        iconStr = arrowDownSolidIcon
        break
      case IconType.Search:
        iconStr = searchIcon
        break
      case IconType.Question:
        iconStr = questionIcon
        break
      case IconType.Warning:
        iconStr = warningIcon
        break
      case IconType.CloseSolid:
        iconStr = closeSolidIcon
        break
      case IconType.SuccessSolid:
        iconStr = successSolidIcon
        break
      case IconType.WarningSolid:
        iconStr = warningSolidIcon
        break
      case IconType.InfoSolid:
        iconStr = infoSolidIcon
        break
      case IconType.TimeSolid:
        iconStr = timeSolidIcon
        break
      case IconType.Edit:
        iconStr = editIcon
        break
      case IconType.Delete:
        iconStr = deleteIcon
        break
      case IconType.ClockCircle:
        iconStr = clockCircle
        break
      case IconType.More:
        iconStr = moreIcon
        break
      case IconType.Heart:
        iconStr = heart
        break
      case IconType.Volume:
        iconStr = volume
        break
      case IconType.Setting:
        iconStr = setting
        break
      case IconType.HeartFill:
        iconStr = heartFill
        break
      case IconType.Dropdown:
        iconStr = dropdown
        break
      case IconType.InfoGrey:
        iconStr = infoGreyIcon
        break
      case IconType.Home:
        iconStr = homeIcon
        break
      default:
        iconStr = ''
    }

    // 替换颜色后 encode to base64
    const encodeStr = encode(
      iconStr
        .replace(/fill="#[a-zA-Z0-9]{0,6}"/g, `fill="${color}"`)
        .replace(/stroke="#[a-zA-Z0-9]{0,6}"/g, `stroke="${color}"`)
    )

    return `data:image/svg+xml;base64,${encodeStr}`
  }

  return (
    <View
      className={cls(styles.main, className)}
      style={{
        width: size,
        height: size,
        backgroundImage: `url("${getEncodeIconByType(type)}")`
      }}
      onTap={onTap}
    />
  )
}
