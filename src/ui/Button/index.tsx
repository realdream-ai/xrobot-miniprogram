import React, { ReactNode } from 'react'
import { Button, ButtonProps } from 'remax/one'
import cls from 'classnames'

import style from './style.less'

type Props = ButtonProps & {
  mode?: 'default' | 'primary'
  children?: ReactNode
  className?: string
}

export default function MButton(props: Props) {
  const { mode = 'default', className, children, ...otherProps } = props

  return (
    <Button className={cls(style.button, style[mode], className)} {...otherProps}>
      {children}
    </Button>
  )
}
