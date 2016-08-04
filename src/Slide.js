import React, { PropTypes } from 'react'
import cx from 'classnames'

export default function Slide({ children, className, onActive, ...rest }) {
  return (
    <div className={cx('swiper-slide', className)} {...rest}>
      {children}
    </div>
  )
}

Slide.propTypes = {
  onActive: PropTypes.func,
}
