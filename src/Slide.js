import React from 'react'
import cx from 'classnames'

export default function Slide({ children, className, ...rest }) {
  return (
    <div className={cx('swiper-slide', className)} {...rest}>
      {children}
    </div>
  )
}
