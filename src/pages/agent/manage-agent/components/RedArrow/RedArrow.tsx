import React from 'react'
import styles from './RedArrow.module.less'

const RedArrow: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`${styles.arrowWrap} ${className || ''}`}>
    <div className={styles.line}></div>
    <div className={styles.triangle}></div>
  </div>
)

export default RedArrow
